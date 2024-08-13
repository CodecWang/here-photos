import router from 'koa-joi-router';

import { photoController, photoValidator } from '../controllers/photo';
import { scanController } from '../controllers/scan';
import { settingController, settingValidator } from '../controllers/setting';

const v1Router = router();

const photoRoutes = [
  {
    method: 'GET',
    path: '/photos',
    handler: photoController.read,
    validate: photoValidator.read,
  },
  {
    method: 'DELETE',
    path: '/photos',
    handler: photoController.delete,
    validate: photoValidator.delete,
  },
  {
    method: 'GET',
    path: '/photos/:id/thumbnail',
    handler: photoController.readThumbnails,
    validate: photoValidator.readThumbnails,
  },
];

const scanRoutes = [
  {
    method: 'POST',
    path: '/scan',
    handler: scanController.scan,
  },
];

const settingRoutes = [
  {
    method: 'GET',
    path: '/settings',
    handler: settingController.read,
    validate: settingValidator.read,
  },
];

v1Router.prefix('/api/v1');
v1Router.route([...photoRoutes, ...scanRoutes, ...settingRoutes]);

export default v1Router;
