import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuid } from "uuid";

export const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function generateMealCsvPresignedPost(userId: string) {
  const key = `meals/${userId}/${uuid()}.csv`;

  const post = await createPresignedPost(s3, {
    Bucket: process.env.UPLOAD_BUCKET!,
    Key: key,
    Conditions: [
      ["content-length-range", 0, 5_000_000],          // ≤ 5 MB
      ["starts-with", "$Content-Type", "text/"]
    ],
    Fields: { acl: "private" },
    Expires: 900                                        // 15 min
  });

  return { ...post, key };
}
