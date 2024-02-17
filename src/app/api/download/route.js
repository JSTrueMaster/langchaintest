import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import chalk from "chalk";

const cheerio = require("cheerio");
const fs = require("fs");

export async function GET() {
  try {
    console.log(`Retrieving pdf from R2!`);

    const html = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.PUBLIC_S3_BUCKET_NAME,
        Key: "sample.pdf",
      })
    );

    if (!html) {
      throw new Error("pdf not found.");
    }

    await html.Body.pipe(fs.createWriteStream("sample_output.pdf"));

    // var htmlSrc = await fs.readFileSync("output.html", "utf8");

    // const $ = cheerio.load(htmlSrc);
    // const textContent = $("body").text();
    // console.log("This is text content");
    // console.log(textContent);

    // const doc = new jsPDF();
    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");

    console.log(doc);
    console.log("finished");

    // // Saving the pdf file in root directory.
    // doc.pipe(fs.createWriteStream("example.pdf"));
    // doc.text(textContent, 100, 100);
    // doc.end();

    return new Response(html.Body?.transformToWebStream(), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err) {
    console.log("there is an error");
    console.log("error", err);
  }
}
