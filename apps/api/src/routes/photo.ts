import router from 'koa-joi-router';

import { controller, validator } from '../controllers/photo';

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
    method: 'GET',
    path: '/:id/thumbnail',
    handler: controller.readThumbnails,
    validate: validator.readThumbnails,
  },
]);

export default photoRouter;
