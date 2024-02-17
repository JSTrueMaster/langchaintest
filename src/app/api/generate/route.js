import { PDFLoader } from "langchain/document_loaders/fs/pdf";
const fs = require("fs");
import chalk from "chalk";

function plain2html(text) {
  console.log(text);
  const textString = text || "";
  const result = textString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\t/g, "    ")
    .replace(/ /g, "&#8203;&nbsp;&#8203;")
    .replace(/\r\n|\r|\n/g, "<br />");

  return result;
}

export async function POST(req) {
  console.log("post request was called");
  const { input } = await req.json();
  const loader = new PDFLoader("src/sample.pdf", { splitPages: false });
  const docs = await loader.load();

  const filePath = "src/output.html";
  let index = 0;
  console.log("This is docs");
  console.log(docs);
  for (let doc of docs) {
    chalk.green(`This is doc`);
    const htmlString = plain2html(doc.pageContent);
    fs.writeFile(filePath, htmlString, (err) => {
      if (err) {
        console.error("Error writing HTML file:", err);
        return;
      }
      chalk.green(`HTML file saved successfully!`);
    });
  }

  const response = docs;
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
