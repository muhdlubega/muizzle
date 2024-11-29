import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_KEY;
const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;

export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});