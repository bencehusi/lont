/**
 * Extracts the dimensions of an image.
 * @param filename - The name of the image file.
 * @returns An object containing the width and height of the image.
 */
export function extractImageDimensions(filename: string): {
  width: number;
  height: number;
} {
  if (!filename) {
    return { width: 0, height: 0 };
  }
  return {
    width: parseInt(filename.split("/")[5].split("x")[0]) || 0,
    height: parseInt(filename.split("/")[5].split("x")[1]) || 0,
  };
}
