import router from 'koa-joi-router';

import { controller, validator } from '../controllers/setting';

const settingRouter = router();
settingRouter.prefix('/api/v1/settings');

settingRouter.route([
  {
    method: 'GET',
    path: '/',
    handler: controller.read,
    validate: validator.read,
  },
]);

export default settingRouter;
