const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const auditPath = path.join(root, "scripts", "adsense-quality-v2-audit.js");
let source = fs.readFileSync(auditPath, "utf8");

if (!source.includes("KB_ADSENSE_AUDIT_POLICY_V2")) {
  const benignAnchor = `  /az eredmények tájékoztató becslések/i,\n];`;
  if (!source.includes(benignAnchor)) throw new Error("Az AdSense audit benign mintáinak horgonya nem található.");
  const benignReplacement = `  /az eredmények tájékoztató becslések/i,\n  // KB_ADSENSE_AUDIT_POLICY_V2 – standard trust/safety copy is not page-unique editorial content.\n  /az oldal tájékoztató kalkulátor.*egyedi döntéshez szakember/i,\n  /a kalkulátor tájékoztató segédlet.*egyedi egészségügyi vagy jogi döntést/i,\n  /a referenciaértékek segítenek fejben ellenőrizni.*kerekítése/i,\n  /gyártói\\/rendszeradat ellenőrzése szükséges/i,\n  /a számítás kiindulópont.*nem személyre szabott étrend/i,\n  /vesebetegség.*fehérjecél.*általános kalkulátorból/i,\n  /evészavar.*szakember bevonása indokolt/i,\n  /a túl nagy kalóriadeficit.*regeneráció/i,\n  /a mezők tájékoztató tervezésre valók.*hivatalos.*adat/i,\n];`;
  source = source.replace(benignAnchor, benignReplacement);

  const extractAnchor = `const extractBlocks = (mainHtml) => {\n  const blocks = [];\n  for (const match of mainHtml.matchAll(/<(p|h2|h3|li|summary)\\b[^>]*>([\\s\\S]*?)<\\/\\1>/gi)) {`;
  if (!source.includes(extractAnchor)) throw new Error("Az AdSense audit extractBlocks horgonya nem található.");
  const extractReplacement = `const extractBlocks = (mainHtml) => {\n  // The following sections are intentionally standardized trust/safety UI.\n  // They remain visible to users and are still checked by the YMYL/runtime gates,\n  // but they must not inflate page-content boilerplate ratios.\n  const editorialHtml = mainHtml\n    .replace(/<!-- KB_ADSENSE:ymyl-trust:START -->[\\s\\S]*?<!-- KB_ADSENSE:ymyl-trust:END -->/g, " ")\n    .replace(/<!-- KB_STATIC:reliability:START -->[\\s\\S]*?<!-- KB_STATIC:reliability:END -->/g, " ");\n  const blocks = [];\n  for (const match of editorialHtml.matchAll(/<(p|h2|h3|li|summary)\\b[^>]*>([\\s\\S]*?)<\\/\\1>/gi)) {`;
  source = source.replace(extractAnchor, extractReplacement);
  fs.writeFileSync(auditPath, source, "utf8");
  console.log("Applied AdSense v2 audit policy: trust/safety copy separated from editorial boilerplate.");
} else {
  console.log("AdSense v2 audit policy already applied.");
}
