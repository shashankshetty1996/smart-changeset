#!/usr/bin/env node
/* eslint-disable */
/* prettier-ignore */

const fs = require('fs');
const path = require("path");
const project = path.join(__dirname, "../tsconfig.json");
const dev = fs.existsSync(project);

let cliPath = "dist/src/cli/api-extractor.cli.js";
if (dev) {
  require("ts-node").register({ project });
  cliPath = "src/cli/api-extractor.cli.ts";
}

require(path.join("..", cliPath))
  .run()
  .catch((error) => {
    if (typeof error === "number") {
      process.exit(error);
    }
    console.error(error);
    process.exit(1);
  });
