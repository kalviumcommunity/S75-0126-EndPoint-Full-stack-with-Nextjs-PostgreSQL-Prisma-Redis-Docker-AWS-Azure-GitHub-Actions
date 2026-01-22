import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { fileName, fileURL, size, type, businessId, userId } = await req.json();

    // Validate required fields
    if (!fileName || !fileURL) {
      return NextResponse.json(
        { success: false, message: "fileName and fileURL are required" },
        { status: 400 }
      );
    }

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        name: fileName,
        url: fileURL,
        size: size || null,
        type: type || null,
        businessId: businessId || null,
        userId: userId || null,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.name,
        url: fileRecord.url,
        size: fileRecord.size,
        type: fileRecord.type,
        businessId: fileRecord.businessId,
        userId: fileRecord.userId,
        createdAt: fileRecord.createdAt,
      },
    });
  } catch (error) {
    console.error("Error storing file record:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to store file record in database",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const userId = searchParams.get("userId");
    
    // Build query based on filters
    const whereClause: any = {};
    if (businessId) whereClause.businessId = businessId;
    if (userId) whereClause.userId = userId;

    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      files: files.map((file: any) => ({
        id: file.id,
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.type,
        businessId: file.businessId,
        userId: file.userId,
        createdAt: file.createdAt,
      })), 
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch files from database",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    await prisma.file.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete file from database",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}