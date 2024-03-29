/* eslint-disable camelcase */
import { randomUUID } from 'crypto';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import AppError from '@libs/app.error';
import s3Client from '@libs/s3client';
import { Image } from '@models/image.model';
import { IMovie, IMovieInfo, IMovieKey } from '@models/movie.model';
import imageRepository, { CreateImageDto } from '@repositories/image.repository';
import movieRepository, { UpdateMovieInfoDTO } from '@repositories/movie.repository';

export interface IMoviesByYearResponse {
  data: Array<Pick<IMovie, 'title' | 'year'> & { info: Pick<IMovieInfo, 'image_url'> }>;
  nextPageToken?: string;
}

export async function createImage(createImageDto: CreateImageDto): Promise<Image> {
  const id = randomUUID();
  const createdAt = new Date();
  const uploadedAt = new Date(); // TODO generate properly
  if (!createImageDto.creator) {
    throw new Error('creator required');
  }
  if (!createImageDto.fileName) {
    throw new Error('filename required');
  }

  const bucketParams: PutObjectCommandInput = {
    Bucket: `s3-image-upload`,
    Key: `${id}`,
  };

  // Create a command to put the object in the S3 bucket.
  const command = new PutObjectCommand(bucketParams);
  // Create the presigned URL.
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  console.log(signedUrl);

  const fileName = 'todo generate for AWS';
  const originalFileName = createImageDto.fileName;
  const sizeBytes = 0;

  const dimensions = {
    // TODO get from image
    width: 1,
    height: 1,
  };

  const upload: CreateImageDto['upload'] = {
    url: signedUrl,
    validUntil: new Date(new Date().getTime() + 3600 * 1000), // TODO actually compute properly
  };

  return imageRepository.upsert({
    ...createImageDto,
    id,
    createdAt,
    uploadedAt,
    dimensions,
    fileName,
    originalFileName,
    sizeBytes,
    upload,
  });
}

export async function getMoviesByYear(year: number, nextPageToken?: string): Promise<IMoviesByYearResponse> {
  const lastEvaluatedKey: IMovieKey = nextPageToken ? JSON.parse(nextPageToken) : undefined;
  const { data, lastEvaluatedKey: nextPageTokenObject } = await movieRepository.listMoviesByYear(
    year,
    10,
    lastEvaluatedKey
  );

  return {
    data: data.map((movie) => {
      return {
        title: movie.title,
        year: movie.year,
        info: {
          image_url: movie.info.image_url,
        },
      };
    }),
    nextPageToken: nextPageTokenObject ? encodeURIComponent(JSON.stringify(nextPageTokenObject)) : undefined,
  };
}

export async function getMoviesByTitleAndYear(title: string, year: number): Promise<IMovie> {
  const movie = await movieRepository.getByKey({ title, year });

  if (!movie) {
    throw new AppError('Movie not found!');
  }

  return movie;
}

export function deleteMovieByTitleAndYear(title: string, year: number): Promise<void> {
  return movieRepository.deleteByKey({ title, year });
}

export async function updateMovieInfoByTitleAndYear(
  title: string,
  year: number,
  info: UpdateMovieInfoDTO
): Promise<IMovie> {
  const key: IMovieKey = { title, year };
  const movie = await movieRepository.getByKey(key);

  if (!movie) {
    throw new AppError('Movie not found!');
  }

  const newInfo: IMovieInfo = { ...movie.info, ...info };
  return movieRepository.updateByKey(key, { info: newInfo });
}
