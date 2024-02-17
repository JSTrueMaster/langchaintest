import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import chalk from "chalk";

const cheerio = require("cheerio");
const fs = require("fs");
const { PromptTemplate } = require("@langchain/core/prompts");
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

//const inquirer = require("inquirer");

const model = new ChatOpenAI({
  //   openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function handlePrompt(input, promptTemplate) {
  console.log("this is handleprompt function");
  const promptInput = await promptTemplate.format({
    question: input,
  });

  console.log("this is prompt input");
  console.log(promptInput);

  try {
    //return await model.invoke(promptInput);
    const response = await model.invoke("Hi there!");
    console.log("this is prompt response");
    console.log(response);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function translate(sourceLanguage, targetLanguage, text) {
  console.log("this is translate function");
  const promptTemplate = new PromptTemplate({
    template: `I am an expert translator. My goal is to provide the best translation possible.\n
        Translate the following text from ${sourceLanguage} to ${targetLanguage}: "${text}"`,
    inputVariables: ["question"],
  });

  return await handlePrompt(text, promptTemplate);
}

export async function GET() {
  try {
    const response = await translate("English", "Chinese", "I am a student");
    console.log("This is response from translation");
    console.log(response);
    return new Response(
      {},
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (err) {
    console.log("there is an error");
    console.log("error", err);
  }
}
