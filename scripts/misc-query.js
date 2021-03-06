const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const { readDictionary } = require("@lingdocs/pashto-inflector");
const verbsPath = path.join(".", "src", "words");
const collectionPath = path.join(verbsPath, "verb-categories");
const verbTsFiles = fs.readdirSync(collectionPath);

// const allTsS = [...new Set(verbTsFiles.reduce((arr, fileName) => {
//     const TsS = require(path.join("..", collectionPath, fileName));
//     return [...arr, ...TsS];
// }, []))];

fetch(process.env.LINGDOCS_DICTIONARY_URL).then(res => res.arrayBuffer()).then(data => {
  const { entries } = readDictionary(data);
  const filtered = entries.filter(e => (
      e.c && (e.c === "n. f.") && e.p.slice(-1) === "ا"
  ));
  const content = `module.exports = [
${filtered.reduce((text, entry) => (
    text + `{ ts: ${entry.ts}, e: "${entry.e}" }, // ${entry.p} - ${entry.f}
`), "")}
];`;
  fs.writeFileSync(path.join(verbsPath, "my-words.js"), content);
});

// function getFromTsS(entries) {
//     return allTsS.map(item => {
//         const entry = entries.find(x => item.ts === x.ts);
//         if (!entry) {
//             console.log("couldn't find ts", ts);
//             return undefined;
//         }
//         if (entry.c && entry.c.includes("comp.")) {
//             const complement = entries.find(x => entry.l === x.ts);
//             return {
//                 entry,
//                 complement,
//             };
//         }
//         return { entry, def: item.e };
//     }).filter(x => x);
// }
