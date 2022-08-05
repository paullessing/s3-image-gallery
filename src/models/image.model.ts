export interface ImageData {
  uploadedAt: Date;
  creator: string;
  fileName: string;
  originalFileName: string;
  sizeBytes: number;
  dimensions: {
    width: number;
    height: number;
  };

  uploadUrl: string;
  uploadValidUntil: Date;
}

export interface ImageKey {
  id: string;
}

export type Image = ImageKey & ImageData;
