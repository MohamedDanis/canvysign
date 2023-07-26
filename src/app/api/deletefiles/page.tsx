// pages/api/deleteFilesFromS3.js
import  s3  from "@/utils/s3";

export default async function handler(req:any, res:any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { files } = req.body;

    // Ensure files are provided in the request body
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Construct the objects array for deletion
    const objectsToDelete = files.map((file) => ({ Key: file }));

    // Specify your S3 bucket name here
    const bucketName = "canvisign";

    // Perform the S3 deletion operation
    await s3.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false, // Set to true if you want to suppress response data
      },
    }).promise();

    return res.status(200).json({ message: "Files deleted successfully" });
  } catch (error) {
    console.error("Error deleting files from S3:", error);
    return res.status(500).json({ message: "Failed to delete files from S3" });
  }
}
