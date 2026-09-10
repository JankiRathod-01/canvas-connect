const fs = require("fs");
const path = require("path");
const https = require("https");
const plantumlEncoder = require("plantuml-encoder");

const diagramsDir = path.resolve(__dirname, "../diagrams");

const files = [
  "art-gallery-use-case.puml",
  "art-gallery-activity.puml",
  "art-gallery-sequence-login.puml",
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try { fs.unlinkSync(dest); } catch (_) {}
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      })
      .on("error", reject);
  });
}

(async () => {
  for (const name of files) {
    const pumlPath = path.join(diagramsDir, name);
    const outPng = pumlPath.replace(/\.puml$/i, ".png");
    const puml = fs.readFileSync(pumlPath, "utf8");
    const encoded = plantumlEncoder.encode(puml);
    const url = `https://www.plantuml.com/plantuml/png/${encoded}`;
    await download(url, outPng);
    console.log("OK", path.basename(outPng), fs.statSync(outPng).size, "bytes");
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
