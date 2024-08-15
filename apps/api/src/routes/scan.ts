import router from 'koa-joi-router';

import { controller } from '../controllers/scan';

const scanRouter = router();
scanRouter.prefix('/api/v1/scan');

scanRouter.route([
  {
    method: 'POST',
    path: '/',
    handler: controller.scan,
  },
]);

export default scanRouter;
