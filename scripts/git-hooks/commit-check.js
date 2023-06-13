/* eslint-disable no-console */
/**
 * Enforce commit messages start with an issue key, automatically
 * add issue key if exists in branch name, else abort the commit
 */

// if in CI dont enforce anything
if (process.env.CI) {
  process.exit(0);
}

const fs = require("fs");
const { execSync } = require("child_process");

const messageFile = process.argv[2];

const data = fs.readFileSync(messageFile);
const commitMessage = data.toString();

// if first line of commit message is empty or commentary exit hook and let git handle it
const commitMessageFirstLine = commitMessage.split("\n")[0];
if (!commitMessageFirstLine.match(/^\s*[^#\s]+/)) {
  process.exit(0);
}

// Check for existing issue or other key phrase
const exec = execSync("git rev-parse --abbrev-ref HEAD"); // get current branch name
const branch = exec.toString();

const allowedPrefixes = [
  "NO-ISSUE",
  "RELEASING:",
  "SKIP-MINOR:",
  "CHANGESET:",
  "pull request",
  "Merge branch",
  "[A-Z0-9]+-[0-9]+",
  // Git uses these prefixes to implement autosquash and creates messages with
  // these prefixes with e.g. git commit --fixup
  // https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---autosquash
  "fixup!",
  "squash!",
];

const commitRegex = new RegExp(`^(${allowedPrefixes.join("|")})`);

const commitMessageMatch = commitMessage.match(commitRegex);
if (commitMessageMatch) {
  process.exit(0);
}

const issueKeyBranchRegex = new RegExp(`^(?:.+/)*([A-Z0-9]+-[0-9]+)`);
// Prepend issue key from branch name if present, else prepend `NO-ISSUE`
const branchMatch = branch.match(issueKeyBranchRegex);
if (branchMatch) {
  const issueKey = branchMatch[1];
  fs.writeFileSync(messageFile, `${issueKey} ${commitMessage}`);
  console.log(
    `Issue key ${issueKey} from branch name has been prepended to commit message.`
  );
  process.exit(0);
}

fs.writeFileSync(messageFile, `NO-ISSUE ${commitMessage}`);
console.log(
  "NO-ISSUE has been prepended to commit message as no issue key was provided."
);
console.log("To change the commit message to add an issue key use:");
console.log('\tgit commit --amend -m "New message"');
console.log();
process.exit(0);
