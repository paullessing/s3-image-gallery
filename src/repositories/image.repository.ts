import BaseRepository from './base.repository';
import { Image, ImageKey } from '@models/image.model';

export type CreateImageDto = Omit<Image, 'id'>;
export type UpdateImageDto = Pick<Image, 'id'>;

class ImageRepository extends BaseRepository<ImageKey, Image> {
  protected tableName = 'Images';
  //
  // public async listMoviesByYear(
  //   year: number,
  //   limit: number,
  //   lastEvaluatedKey?: IMovieKey,
  // ): Promise<IPagingData<IMovie, IMovieKey>> {
  //   const query: QueryInput = {
  //     KeyConditionExpression: '#year = :year',
  //     Limit: limit,
  //     ExpressionAttributeNames: {
  //       '#year': 'year',
  //     },
  //     ExpressionAttributeValues: {
  //       ':year': year,
  //     },
  //     ExclusiveStartKey: lastEvaluatedKey,
  //   };
  //
  //   return this.query(query);
  // }
}

export default new ImageRepository();
