import { NextResponse } from "next/server";
import chalk from "chalk";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { r2 } from "@/lib/r2";
const fs = require("fs");
const path = require("path");
const slugifyString = (str) => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/-+/g, "-")
    .replace(/[^a-z0-9-]/g, "-");
};
export async function POST(request) {
  try {
    console.log("this is R2 information");
    console.log(process.env.R2_ACCESS_KEY_ID);
    console.log(process.env.R2_SECRET_ACCESS_KEY);
    const fileName = "sample.pdf";
    const objectKey = `${slugifyString(Date.now().toString())}-${slugifyString(
      fileName
    )}`;

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.PUBLIC_S3_BUCKET_NAME,
        Key: "sample.pdf",
        ContentType: "text/html",
        ACL: "public-read",
      }),
      { expiresIn: 60 * 30 }
    );
    const filePath = "src/sample.pdf";
    const fileData = fs.readFileSync(filePath);
    console.log(fileData);
    const formData = new FormData();

    console.log(chalk.green(`Success generating upload URL!`));
    console.log(signedUrl);

    formData.append("file", fileData);

    const uploadToR2Response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "text/html",
      },
      body: fileData,
    });
    console.log(uploadToR2Response.ok);

    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.log(err);
    console.log("error");
  }
}
