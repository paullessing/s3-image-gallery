import { handlerPath } from '@libs/handler-resolver';
import routers from './image.router';

export const manageImages = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: routers.map((router) => {
    return {
      http: {
        path: router.resource,
        method: router.method,
      },
    };
  }),
};
