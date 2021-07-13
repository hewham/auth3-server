const increaseVersion = require('increase-version');

async function set() {
  const pathOfPackageJson = 'package.json';
  const oldVersion = await increaseVersion.getVersionOfPackageJson(pathOfPackageJson);
  const versions = { old: oldVersion, new: process.env.npm_config_new_version };
  increaseVersion.json(pathOfPackageJson, versions);
}

set();
