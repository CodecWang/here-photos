import router from 'koa-joi-router';

import { controller, validator } from '../controller/photo';

const photoRouter = router();
photoRouter.prefix('/api/v1/photos');

photoRouter.route([
  {
    method: 'GET',
    path: '/',
    handler: controller.read,
    validate: validator.read,
  },
  {
    method: 'DELETE',
    path: '/',
    handler: controller.delete,
    validate: validator.delete,
  },
  {
    method: 'POST',
    path: '/upload',
    handler: controller.upload,
  },
  {
    method: 'POST',
    path: '/scan',
    handler: controller.scan,
  },
  {
    method: 'GET',
    path: '/:id/thumbnail',
    handler: controller.readThumbnails,
    validate: validator.readThumbnails,
  },
]);

export default photoRouter;
