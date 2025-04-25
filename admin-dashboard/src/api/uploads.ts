// src/api/uploads.ts

import axios from "./axios";

/**
 * Calls the backend to generate a presigned S3 POST for meal CSV upload
 * @returns { url, fields, key } to use in a multipart POST to S3
 */
export const getMealCsvPresignedPost = async () => {
  const res = await axios.post("/uploads/meal-csv");
  
  return res.data as {
    url: string;
    fields: Record<string, string>;
    key: string;
  };
};
