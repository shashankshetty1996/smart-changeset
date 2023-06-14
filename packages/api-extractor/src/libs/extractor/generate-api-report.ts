import type { Package } from "@manypkg/get-packages";
import chalk from "chalk";
import { promises as fsp } from "fs";
import get from "lodash/get";
import * as path from "path";
import getExtractorConfig from "../../config/config";
import { API_REPORT_FILE_NAME, REPORT_TMP_FILENAME } from "../../constants";
import ApiExtractor from "./api-extractor";
import dedent from "ts-dedent";

function parseReportText(reportText: string) {
  return dedent`
  \`\`\`ts
  ${reportText}
  \`\`\`
  `;
}

async function writeAPIReport(packageDir: string, content: string) {
  const apiReportFilePath = path.join(packageDir, API_REPORT_FILE_NAME);
  await fsp.writeFile(apiReportFilePath, content, "utf8");
}

export async function generateAPIReport(pkg: Package) {
  const packageDir = pkg.dir;
  const packageName = pkg.packageJson.name;
  const typesEntry = get(pkg, "packageJson.types");

  if (!typesEntry) {
    console.error(chalk.red(`No types entry found for ${packageName}`));
    return;
  }

  console.log(chalk.blue(`Generating API report for ${packageName}`));

  const extractorConfig = {
    ...getExtractorConfig(REPORT_TMP_FILENAME),
    projectFolder: packageDir,
    mainEntryPointFilePath: typesEntry,
  };

  const extractor = new ApiExtractor(extractorConfig);

  await extractor.extract({
    localBuild: true,
  });

  const reportTmpFilePath = path.join(packageDir, REPORT_TMP_FILENAME);
  const tmpReport = await fsp.readFile(reportTmpFilePath, "utf8");
  await fsp.unlink(reportTmpFilePath);
  await fsp.rm(path.join(packageDir, "tmp"), { recursive: true, force: true });

  const reportContent = parseReportText(tmpReport);

  await writeAPIReport(packageDir, reportContent);

  return reportContent;
}
