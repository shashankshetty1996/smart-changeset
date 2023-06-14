import type { Package } from "@manypkg/get-packages";
import { generateAPIReport } from "../extractor/generate-api-report";
import chalk from "chalk";

export async function extractAPIReport(packages: Package[]) {
  for await (const pkg of packages) {
    const result = await generateAPIReport(pkg);
    console.log(
      chalk.blue(`Generating API report for ${pkg.packageJson.name}`)
    );
    console.log(result);
  }
}
