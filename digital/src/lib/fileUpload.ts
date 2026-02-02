/**
 * File validation utilities for client-side upload validation
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file type and size before upload
 * @param file - File object to validate
 * @returns Validation result with error message if invalid
 */
export function validateFile(file: File): FileValidationResult {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Only PNG and JPEG files are allowed!",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large! Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  return { isValid: true };
}

/**
 * Uploads a file to AWS S3 using presigned URL
 * @param file - File to upload
 * @returns Promise with upload result
 */
export async function uploadFileToS3(file: File): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Get presigned URL from API
    const response = await fetch(
      `/api/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Failed to get upload URL" };
    }

    const { uploadUrl } = await response.json();

    // Upload file using presigned URL
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      return { success: false, error: "Failed to upload file to S3" };
    }

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "An unexpected error occurred during upload" };
  }
}
