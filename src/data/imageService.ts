import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/cloudflareClient";
import { Screenshot } from "../types/types";

export const imageService = {
  async getScreenshots(folder: string, language: 'tamil' | 'hindi' = 'tamil'): Promise<Screenshot[]> {
    try {
      const bucketName = language === 'tamil' 
        ? import.meta.env.VITE_R2_BUCKET_NAME 
        : import.meta.env.VITE_R2_BUCKET_NAME_2;

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `${folder}/`,
      });

      const { Contents } = await s3.send(command);
      if (!Contents) return [];

      const screenshots: Screenshot[] = [];
      for (const file of Contents) {
        const fileName = file.Key!.split("/").pop()!;
        const [movieId, indexWithExt] = fileName.split("-");
        const index = parseInt(indexWithExt.split(".")[0]);

        // Generate a signed URL for private object access
        const getObjectCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: file.Key,
        });

        const signedUrl = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 3600, // URL expires in 1 hour
        });

        screenshots.push({
          folder,
          movieId,
          index,
          url: signedUrl,
          language,
        });
      }

      return screenshots.sort((a, b) => a.index - b.index);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      return [];
    }
  },

  async getAllFolders(language: 'tamil' | 'hindi' = 'tamil'): Promise<string[]> {
    try {
      const bucketName = language === 'tamil' 
        ? import.meta.env.VITE_R2_BUCKET_NAME 
        : import.meta.env.VITE_R2_BUCKET_NAME_2;

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Delimiter: "/",
      });

      const { CommonPrefixes } = await s3.send(command);
      if (!CommonPrefixes) return [];

      return CommonPrefixes.map((prefix) =>
        prefix.Prefix!.replace("/", "")
      ).sort((a, b) => Number(a) - Number(b));
    } catch (error) {
      console.error("Error fetching folders:", error);
      return [];
    }
  },
};