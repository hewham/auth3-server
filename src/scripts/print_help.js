const colors = require("colors");
const figures = require("figures");

async function go() {
  const pathOfPackageJson = 'package.json';
  const fs = require('fs');
  const obj = JSON.parse(fs.readFileSync(pathOfPackageJson, 'utf8'));
  const scripts = obj.scripts;
  for (const scriptName of Object.keys(scripts)) {
    const spaceNum = 18 - scriptName.length;
    let spacing = "";
    for (let i = 0; i < spaceNum; i++) {
      spacing += " ";
    }
    console.log(colors.cyan(scriptName) + spacing + colors.cyan(figures.heart) + " " + scripts[scriptName]);
  }
}

go();
