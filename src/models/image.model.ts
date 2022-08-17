export interface ImageData {
  createdAt: Date;
  uploadedAt: Date;
  creator: string;
  fileName: string;
  originalFileName: string;
  sizeBytes: number;
  dimensions: {
    width: number;
    height: number;
  };

  upload: null | {
    url: string;
    validUntil: Date;
  }
}

export interface ImageKey {
  id: string;
}

export type Image = ImageKey & ImageData;
