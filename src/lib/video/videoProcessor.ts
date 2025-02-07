/**
 * Video processing service for handling video compression and thumbnail generation.
 */
import * as VideoThumbnails from "expo-video-thumbnails";
import { manipulateAsync } from "expo-image-manipulator";
import { Platform } from "react-native";

export interface ProcessedVideo {
  uri: string;
  thumbnailUri: string;
  duration: number;
  size: number;
}

/**
 * Processes a video file for upload, including compression and thumbnail generation.
 * @param videoUri - The URI of the recorded video
 * @returns ProcessedVideo object containing processed video details
 */
export async function processVideoForUpload(videoUri: string): Promise<ProcessedVideo> {
  try {
    // Generate thumbnail
    const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 0,
      quality: 0.7,
    });

    // TODO: Implement proper video compression when expo-video-manipulator is available
    // For now, we'll just return the original video with its thumbnail

    // Get video metadata (size, duration) - This would need a proper video metadata extraction
    // For now, we'll use placeholder values
    const processedVideo: ProcessedVideo = {
      uri: videoUri,
      thumbnailUri,
      duration: 0, // This should be extracted from the video
      size: 0, // This should be the actual file size
    };

    return processedVideo;
  } catch (error) {
    console.error("Error processing video:", error);
    throw new Error("Failed to process video for upload");
  }
}

/**
 * Compresses a thumbnail image to a specific size
 * @param uri - The URI of the thumbnail image
 * @returns The URI of the compressed thumbnail
 */
export async function compressThumbnail(uri: string): Promise<string> {
  try {
    const result = await manipulateAsync(uri, [{ resize: { width: 320 } }], {
      compress: 0.7,
      format: Platform.OS === "ios" ? "jpeg" : "png",
    });
    return result.uri;
  } catch (error) {
    console.error("Error compressing thumbnail:", error);
    return uri; // Return original if compression fails
  }
}
