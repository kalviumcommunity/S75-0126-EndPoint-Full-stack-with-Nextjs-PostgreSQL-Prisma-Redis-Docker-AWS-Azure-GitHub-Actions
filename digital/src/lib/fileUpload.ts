/**
 * Utility functions for handling file uploads using pre-signed URLs
 */

interface UploadResult {
  success: boolean;
  uploadURL?: string;
  publicUrl?: string;
  fileName?: string;
  error?: string;
}

interface FileRecord {
  fileName: string;
  fileURL: string;
  size?: number;
  type?: string;
  businessId?: string;
  userId?: string;
}

/**
 * Generate a pre-signed URL for file upload
 */
export async function generatePresignedUrl(
  filename: string,
  fileType: string,
  fileSize?: number
): Promise<UploadResult> {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        fileType,
        fileSize,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Upload a file using a pre-signed URL
 */
export async function uploadFileToS3(
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // Generate pre-signed URL first
    const presignedResult = await generatePresignedUrl(
      file.name,
      file.type,
      file.size
    );

    if (!presignedResult.success || !presignedResult.uploadURL) {
      return {
        success: false,
        error: presignedResult.error || 'Failed to generate upload URL',
      };
    }

    // Create XMLHttpRequest to track upload progress
    return new Promise<UploadResult>((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            success: true,
            publicUrl: presignedResult.publicUrl,
            fileName: presignedResult.fileName,
          });
        } else {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`,
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Upload failed due to network error',
        });
      });

      xhr.open('PUT', presignedResult.uploadURL);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Store file record in database
 */
export async function storeFileRecord(fileRecord: FileRecord): Promise<{
  success: boolean;
  fileId?: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileRecord),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        fileId: result.file?.id,
      };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to store file record',
      };
    }
  } catch (error) {
    console.error('Error storing file record:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Complete file upload flow: generate URL, upload to S3, store in DB
 */
export async function completeFileUpload(
  file: File,
  businessId?: string,
  userId?: string,
  onProgress?: (progress: number) => void
): Promise<{
  success: boolean;
  fileId?: string;
  publicUrl?: string;
  error?: string;
}> {
  try {
    // Step 1: Upload file to S3 using pre-signed URL
    const uploadResult = await uploadFileToS3(file, onProgress);

    if (!uploadResult.success || !uploadResult.publicUrl || !uploadResult.fileName) {
      return {
        success: false,
        error: uploadResult.error || 'File upload failed',
      };
    }

    // Step 2: Store file record in database
    const storeResult = await storeFileRecord({
      fileName: uploadResult.fileName,
      fileURL: uploadResult.publicUrl,
      size: file.size,
      type: file.type,
      businessId,
      userId,
    });

    if (!storeResult.success) {
      return {
        success: false,
        error: storeResult.error || 'Failed to store file record',
      };
    }

    return {
      success: true,
      fileId: storeResult.fileId,
      publicUrl: uploadResult.publicUrl,
    };
  } catch (error) {
    console.error('Error in complete file upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Fetch files from database
 */
export async function fetchFiles(params?: {
  businessId?: string;
  userId?: string;
}): Promise<{
  success: boolean;
  files?: Array<{
    id: string;
    name: string;
    url: string;
    size?: number;
    type?: string;
    businessId?: string;
    userId?: string;
    createdAt: string;
  }>;
  error?: string;
}> {
  try {
    let url = '/api/files';
    const queryParams = new URLSearchParams();
    
    if (params?.businessId) queryParams.append('businessId', params.businessId);
    if (params?.userId) queryParams.append('userId', params.userId);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        files: result.files,
      };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to fetch files',
      };
    }
  } catch (error) {
    console.error('Error fetching files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a file from database
 */
export async function deleteFile(
  fileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/files', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: fileId }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to delete file',
      };
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}