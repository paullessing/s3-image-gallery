/* eslint-disable camelcase */
import { randomUUID } from 'crypto';
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

  const signedPost = await s3Client.createPresignedPost({
    Bucket: `s3-image-upload`,
    Expires: 3600,
    Fields: {
      key: `original/${id}`,
    },
  });
  console.log('SIGNED POST', JSON.stringify(signedPost));

  const params = { ...signedPost.fields };
  delete params['key'];
  delete params['bucket'];

  const url = `${signedPost.url}/${signedPost.fields.key}`;

  // Use like this:
  // https://www.webiny.com/blog/upload-files-to-aws-s3-using-pre-signed-post-data-and-a-lambda-function-7a9fb06d56c1
  // const formData = new FormData();
  // Object.keys(presignedPostData.fields).forEach(key => {
  //   formData.append(key, presignedPostData.fields[key]);
  // });
  // // Actual file has to be appended last.
  // formData.append("file", file);
  // const xhr = new XMLHttpRequest();
  // xhr.open("POST", presignedPostData.url, true);
  // xhr.send(formData);
  // xhr.onload = function() {
  //   this.status === 204 ? resolve() : reject(this.responseText);
  // };

  // const urlParams = new URLSearchParams();
  // Object.entries(signedPost.fields)
  //   .filter(([key]) => !['bucket', 'key'].includes(key))
  //   .forEach(([key, value]) => urlParams.append(key, value));
  // const signedUrl = `${signedPost.url}/${signedPost.fields.key}?${urlParams.toString()}`;

  // console.log('About to send command', command);
  //
  // await s3Client.send(command);

  const fileName = 'todo generate for AWS';
  const originalFileName = createImageDto.fileName;
  const sizeBytes = 0;

  const dimensions = {
    // TODO get from image
    width: 1,
    height: 1,
  };

  const upload: CreateImageDto['upload'] = {
    url,
    params,
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
