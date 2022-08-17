import { IRouter } from '@libs/api-gateway';
import * as controller from './image.controller';

const ROOT_PATH = '/images';

const routers: IRouter[] = [
  // {
  //   method: 'GET',
  //   resource: `${ROOT_PATH}/{year}`,
  //   handler: controller.getMoviesByYear,
  // },
  // {
  //   method: 'GET',
  //   resource: `${ROOT_PATH}/{title}/{year}`,
  //   handler: controller.getMovieDetail,
  // },
  {
    method: 'POST',
    resource: `${ROOT_PATH}`,
    handler: controller.createImage,
  },
  // {
  //   method: 'DELETE',
  //   resource: `${ROOT_PATH}/{title}/{year}`,
  //   handler: controller.deleteMove,
  // },
  // {
  //   method: 'PUT',
  //   resource: `${ROOT_PATH}/{title}/{year}`,
  //   handler: controller.updateMovieInfo,
  // },
];

export default routers;
