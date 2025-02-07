/**
 * Firebase Storage service for handling video uploads.
 */
import { storage } from "./config";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { ProcessedVideo } from "../video/videoProcessor";

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface UploadedVideo {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  size: number;
}

/**
 * Uploads a video and its thumbnail to Firebase Storage
 * @param userId - The ID of the user uploading the video
 * @param video - The processed video object containing video and thumbnail URIs
 * @param onProgress - Optional callback for upload progress updates
 * @returns Promise with the uploaded video URLs
 */
export async function uploadVideo(
  userId: string,
  video: ProcessedVideo,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedVideo> {
  try {
    const timestamp = Date.now();
    const videoFileName = `videos/${userId}/${timestamp}.mp4`;
    const thumbnailFileName = `thumbnails/${userId}/${timestamp}.jpg`;

    // Create storage references
    const videoRef = ref(storage, videoFileName);
    const thumbnailRef = ref(storage, thumbnailFileName);

    // Convert URIs to Blobs
    const videoBlob = await fetch(video.uri).then(r => r.blob());
    const thumbnailBlob = await fetch(video.thumbnailUri).then(r => r.blob());

    // Upload video with progress tracking
    const videoUploadTask = uploadBytesResumable(videoRef, videoBlob);

    const videoUrl = await new Promise<string>((resolve, reject) => {
      videoUploadTask.on(
        "state_changed",
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
          });
        },
        error => reject(error),
        async () => {
          const downloadUrl = await getDownloadURL(videoUploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });

    // Upload thumbnail
    const thumbnailUploadTask = uploadBytesResumable(thumbnailRef, thumbnailBlob);
    const thumbnailUrl = await new Promise<string>((resolve, reject) => {
      thumbnailUploadTask.on(
        "state_changed",
        null,
        error => reject(error),
        async () => {
          const downloadUrl = await getDownloadURL(thumbnailUploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });

    return {
      videoUrl,
      thumbnailUrl,
      duration: video.duration,
      size: video.size,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    throw new Error("Failed to upload video");
  }
}

/**
 * Deletes a video and its thumbnail from Firebase Storage
 * @param videoUrl - The URL of the video to delete
 * @param thumbnailUrl - The URL of the thumbnail to delete
 */
export async function deleteVideo(videoUrl: string, thumbnailUrl: string): Promise<void> {
  try {
    const videoRef = ref(storage, videoUrl);
    const thumbnailRef = ref(storage, thumbnailUrl);

    await Promise.all([deleteObject(videoRef), deleteObject(thumbnailRef)]);
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("Failed to delete video");
  }
}
