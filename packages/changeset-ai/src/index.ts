import chalk from "chalk";
import ai from "./modules/ai/openai";

console.log(chalk.green("Hello world! 🌈"));
ai.getAnswer("What is the meaning of life?", "The meaning of life is");
