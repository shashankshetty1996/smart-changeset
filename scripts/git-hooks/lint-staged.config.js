module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css,html,yml}": ["prettier --write"],
  "yarn.lock": ["git add package.json"],
  "**/package.json": ["git add package.json"],
};
