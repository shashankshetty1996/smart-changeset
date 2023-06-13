import OpenAI from "openai-api";
import * as dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

class OpenAISingleTon {
  private openAi: OpenAI;
  private static instance: OpenAISingleTon;

  private constructor() {
    const { OPENAI_API_KEY } = process.env;
    if (OPENAI_API_KEY === undefined) {
      // TODO: this would be a service that would fetch secret key from other service won't be having this API Token here
      throw new Error(chalk.red("Missing OpenAI API Key, Please setup one"));
    }

    this.openAi = new OpenAI(OPENAI_API_KEY);
  }

  static getInstance() {
    if (!OpenAISingleTon.instance) {
      OpenAISingleTon.instance = new OpenAISingleTon();
    }
    return OpenAISingleTon.instance;
  }

  async getAnswer(question: string, context: string) {
    const prompt = `Answer: ${question}\nQuestion: ${context}`;
    const gptResponse = await this.openAi.complete({
      engine: "davinci",
      prompt,
      maxTokens: 3,
      temperature: 0.2,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      stop: ["\n", " Answer:"],
    });

    console.log(gptResponse.data);

    return gptResponse.data.choices[0].text.trim();
  }
}

export default OpenAISingleTon.getInstance();
