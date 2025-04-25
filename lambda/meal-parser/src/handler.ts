// lambda/meal-parser/src/handler.ts
require("dotenv").config();
import { v4 as uuid } from "uuid";

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require("@fast-csv/parse");
const { Client } = require("pg");
const { Readable } = require("stream");

/**
 * @param {import('aws-lambda').S3Event} event
 */
exports.handler = async (event: any) => {
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const pg = new Client({ connectionString: process.env.PG_URL });
  await pg.connect();

  for (const rec of event.Records) {
    const bucket = rec.s3.bucket.name;
    const key = decodeURIComponent(rec.s3.object.key);

    // fetch the CSV from S3
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const stream = Body; // this is a Node Readable

    // parse & insert rows
    await new Promise((resolve, reject) => {
      const insertPromises: Promise<any>[] = [];
    
      stream
        .pipe(csv.parse({ headers: true }))
        .on("error", reject)
        .on("data", (row: any) => {
          // Only these six columns—no id, no createdAt, no date
          const sql = `
            INSERT INTO "Meal"
              ("id","userId","name","calories","protein","carbs","fat")
            VALUES ($1,$2,$3,$4,$5,$6,$7)
          `;
          const params = [
            uuid(),                // id
            key.split("/")[1],     // userId
            row.meal,              // name
            +row.calories,
            +row.protein,
            +row.carbs,
            +row.fats,
          ];
          insertPromises.push(pg.query(sql, params));
        })
        .on("end", async () => {
          try {
            await Promise.all(insertPromises);
            resolve(undefined);
          } catch (err) {
            console.error("DB insert error:", err);
            reject(err);
          }
        });
    });
    
    
    console.log(`✅ Processed ${key}`);
  }

  await pg.end();
};
