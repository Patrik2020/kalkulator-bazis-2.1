#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { transform } = require("./apply-construction-confirmation-ux.js");

const root = path.resolve(__dirname, "..");
const relativePath = "js/construction-upgrades.js";
const source = fs.readFileSync(path.join(root, relativePath), "utf8");
const expected = transform(source);

assert.ok(expected.includes('const confirmationNames = ["manufacturerConfirmed", "systemConfirmed"]'), "A gyártói/rendszer megerősítő mezők felismerése hiányzik");
assert.ok(expected.includes("pendingConfirmation"), "A megerősítés előtti semleges állapot feltétele hiányzik");
assert.ok(expected.includes("Addig nem készítünk rendelési mennyiséget."), "A semleges várakozó üzenet hiányzik");
assert.ok(expected.indexOf("pendingConfirmation") < expected.indexOf("config.compute(values)"), "A számítás a megerősítési kapu előtt futna le");
assert.ok(expected.includes('message.textContent = "";'), "A régi hibaüzenet nem törlődik a semleges állapot előtt");

// A compute-szintű guardokat külön manufacturer/drywall tesztek védik; ez a réteg csak azt biztosítja,
// hogy az automatikus első run() ne piros hibával fogadja a látogatót.
console.log("Construction confirmation UX audit OK: megerősítés előtt semleges állapot, compute csak utána fut.");
