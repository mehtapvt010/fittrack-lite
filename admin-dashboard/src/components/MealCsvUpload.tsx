import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { getMealCsvPresignedPost } from "../api/uploads";

export default function MealCsvUpload() {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setUploading(true);
    try {
      // ① Get the presigned POST data
      const { url, fields } = await getMealCsvPresignedPost();

      // ② Build exactly the fields S3 expects
      const formData = new FormData();
      Object.entries(fields).forEach(([name, value]) => {
        // ⚠️ Do NOT append `bucket` – it's implied by the URL
        if (name === "bucket") return;
        formData.append(name, value as string);
      });

      // ③ Append the Content-Type to satisfy the "starts-with" condition
      formData.append("Content-Type", file.type); // e.g. "text/csv"

      // ④ Finally, append the file itself
      formData.append("file", file);

      // ⑤ POST straight to S3
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      toast.success("📤 CSV uploaded – S3 accepted it!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 p-8 rounded-xl text-center cursor-pointer bg-gray-50 dark:bg-gray-800"
    >
      <input {...getInputProps()} />
      {uploading
        ? <p className="animate-pulse">Uploading…</p>
        : isDragActive
          ? <p>Drop the CSV here…</p>
          : <p>Drag & drop your <strong>Meal CSV</strong> or click to choose</p>}
    </div>
  );
}
