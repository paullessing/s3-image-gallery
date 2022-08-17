import { createAPIGatewayProxyHandler } from '@libs/api-gateway';
import routers from './image.router';

export const main = createAPIGatewayProxyHandler(routers);
