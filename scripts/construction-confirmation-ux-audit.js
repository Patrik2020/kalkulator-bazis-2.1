#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const relativePath = "js/construction-upgrades.js";
const source = fs.readFileSync(path.join(root, relativePath), "utf8");
const guardStart = source.indexOf('  const run = () => {', source.indexOf('  const collect = () =>'));
const guardEnd = source.indexOf('  form.addEventListener("submit"', guardStart);
assert.ok(guardStart >= 0 && guardEnd > guardStart, "Nem található a kanonikus építőipari run()");
const guardedRun = source.slice(guardStart, guardEnd);
assert.equal((source.match(/const confirmationNames = \["manufacturerConfirmed", "systemConfirmed"\]/g) || []).length, 1,
  "A kanonikus megerősítési guard pontosan egyszer szerepelhet");

assert.ok(guardedRun.includes('const confirmationNames = ["manufacturerConfirmed", "systemConfirmed"]'), "A gyártói/rendszer megerősítő mezők felismerése hiányzik");
assert.ok(guardedRun.includes('values[name] !== "yes"'), "A nemet mondó látogató eredménye nem engedhető tovább");
assert.ok(guardedRun.includes("result.innerHTML"), "A semleges megerősítési üzenet hiányzik");
assert.ok(guardedRun.includes("pendingConfirmation"), "A megerősítés előtti semleges állapot feltétele hiányzik");
assert.ok(guardedRun.includes("Addig nem készítünk rendelési mennyiséget."), "A semleges várakozó üzenet hiányzik");
assert.ok(guardedRun.indexOf("pendingConfirmation") < guardedRun.indexOf("config.compute(values)"), "A számítás a megerősítési kapu előtt futna le");
assert.ok(guardedRun.includes('message.textContent = "";'), "A régi hibaüzenet nem törlődik a semleges állapot előtt");

// A compute-szintű guardokat külön manufacturer/drywall tesztek védik; ez a réteg csak azt biztosítja,
// hogy az automatikus első run() ne piros hibával fogadja a látogatót.
console.log("Construction confirmation UX audit OK: megerősítés előtt semleges állapot, compute csak utána fut.");
