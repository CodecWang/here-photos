import router from 'koa-joi-router';

import { controller, validator } from '../controller/album';

const albumRouter = router();
albumRouter.prefix('/api/v1/albums');

albumRouter.route([
  {
    method: 'GET',
    path: '/',
    handler: controller.read,
  },
  {
    method: 'POST',
    path: '/',
    handler: controller.create,
    validate: validator.create,
  },
  {
    method: 'DELETE',
    path: '/',
    handler: controller.delete,
    validate: validator.delete,
  },
  {
    method: 'GET',
    path: '/:id/photos',
    handler: controller.readPhotos,
    validate: validator.readPhotos,
  },
]);

export default albumRouter;
