import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({ 
  region: process.env.AWS_REGION,
});

export async function POST(req: Request) {
  try {
    const { filename, fileType, fileSize } = await req.json();

    // Validate required fields
    if (!filename || !fileType) {
      return NextResponse.json(
        { success: false, message: "Filename and fileType are required" }, 
        { status: 400 }
      );
    }

    // Validate file type (security measure)
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" }, 
        { status: 400 }
      );
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (fileSize && fileSize > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit" }, 
        { status: 400 }
      );
    }

    // Generate a unique filename to avoid conflicts
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // Generate pre-signed URL with 60-second expiry
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return NextResponse.json({ 
      success: true, 
      uploadURL, 
      fileName: uniqueFileName,
      publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to generate pre-signed URL", 
        error: (error as Error).message 
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    message: "GET method not allowed. Use POST to generate upload URL." 
  }, { status: 405 });
}