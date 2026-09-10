const fs = require("fs");
const path = require("path");
const https = require("https");
const plantumlEncoder = require("plantuml-encoder");

const diagramsDir = path.resolve(__dirname, "../diagrams");
const pumlPath = path.join(diagramsDir, "art-gallery-class-diagram.puml");
const outPng = path.join(diagramsDir, "art-gallery-class-diagram.png");

const puml = fs.readFileSync(pumlPath, "utf8");
const encoded = plantumlEncoder.encode(puml);
const url = `https://www.plantuml.com/plantuml/png/${encoded}`;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for PlantUML`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      })
      .on("error", reject);
  });
}

download(url, outPng)
  .then((dest) => {
    console.log("UML PNG:", dest, fs.statSync(dest).size, "bytes");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
