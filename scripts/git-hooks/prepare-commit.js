/* eslint-disable no-console */
const fs = require("fs");
const { execSync } = require("child_process");

const messageFile = process.argv[2];
const source = process.argv[3];

const branchExec = execSync("git rev-parse --abbrev-ref HEAD"); // get current branch name
const branch = branchExec.toString();

const allowedPrefixes = [
  "NO-ISSUE",
  "no-changeset/",
  "(?:.+/)*([A-Z0-9]+-[0-9]+)",
];
const issueKeyRegex = new RegExp(`^(${allowedPrefixes.join("|")})`);
const branchMatch = branch.match(issueKeyRegex);

// source undefined when no commit message options given to `git commit`
// including -t given implicitly by commit.template git config.

if (source && source !== "template") {
  process.exit(0);
}

const data = fs.readFileSync(messageFile);
const commitMessage = data.toString();

if (branchMatch) {
  const issueKey = branchMatch[branchMatch.length - 1];
  fs.writeFileSync(messageFile, `${issueKey} ${commitMessage}`);
} else {
  fs.writeFileSync(messageFile, `NO-ISSUE ${commitMessage}`);
}

process.exit(0);
