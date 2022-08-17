import * as imageService from '@functions/images/image.service';
import { ICustomAPIGatewayProxyEvent } from '@libs/api-gateway';
import { Image } from '@models/image.model';
import { CreateImageDto } from '@repositories/image.repository';

export function createImage(event: ICustomAPIGatewayProxyEvent<CreateImageDto>): Promise<Image> {
  const { body } = event;

  return imageService.createImage(body);
}

// export function getMoviesByYear(event: ICustomAPIGatewayProxyEvent) {
//   const year = Number(event.pathParameters?.year);
//   const nextPageToken = event.queryStringParameters?.nextPageToken;
//
//   return movieService.getMoviesByYear(year, nextPageToken);
// }
//
// export function getMovieDetail(event: ICustomAPIGatewayProxyEvent) {
//   const title = event.pathParameters?.title as string;
//   const year = Number(event.pathParameters?.year);
//
//   return movieService.getMoviesByTitleAndYear(title, year);
// }
//
// export function deleteMove(event: ICustomAPIGatewayProxyEvent) {
//   const title = event.pathParameters?.title as string;
//   const year = Number(event.pathParameters?.year);
//
//   return movieService.deleteMovieByTitleAndYear(title, year);
// }
//
// export function updateMovieInfo(event: ICustomAPIGatewayProxyEvent<UpdateMovieInfoDTO>) {
//   const title = event.pathParameters?.title as string;
//   const year = Number(event.pathParameters?.year);
//
//   return movieService.updateMovieInfoByTitleAndYear(title, year, event.body);
// }
