import { findRoot } from "@manypkg/find-root";
import { getPackages } from "@manypkg/get-packages";
import chalk from "chalk";
import { extractAPIReport } from "../libs/runner/api-reports";

export async function run() {
  console.log(chalk.green("Hello world! 🌈"));

  const [, , ...filteredPackages] = process.argv;

  const rootDir = await findRoot(process.cwd());
  const { packages: allPackages } = await getPackages(rootDir);

  let packages = allPackages;

  if (filteredPackages.length > 0) {
    packages = allPackages.filter((pkg) => {
      return filteredPackages.includes(pkg.packageJson.name);
    });
  }

  console.log({ packages });
  extractAPIReport(packages);
}
