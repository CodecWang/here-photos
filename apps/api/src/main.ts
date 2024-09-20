import fs from 'fs';
import koa from 'koa';
import { koaBody } from 'koa-body';
import os from 'os';
import path from 'path';

import {
  DEFAULT_MEDIA_DIR,
  THUMBNAILS_DIR,
  UPLOADS_DIR,
} from './config/constants';
import { catchError } from './middleware/catch-error';
import db from './model';
import routes from './route';

function checkPrerequisites() {
  try {
    const requiredDirs = [THUMBNAILS_DIR, DEFAULT_MEDIA_DIR, UPLOADS_DIR];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function initApp() {
  if (!checkPrerequisites()) return;

  const app = new koa();
  app.use(catchError);
  app.use(
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: path.join(os.homedir(), '.here-photos/uploads'),
        keepExtensions: true,
        multiples: true,
        hashAlgorithm: 'md5',
      },
    }),
  );
  routes.forEach((router) => app.use(router.middleware()));
  app.use(async (ctx) => {
    ctx.body = { message: 'Hi, welcome to visit Here APIs.' };
  });

  if (process.env.DB_SYNC === '1') {
    db.sequelize
      .sync()
      .then(() => {
        console.log('Database synced');
      })
      .catch((error: Error) => {
        console.error(`Error syncing database: ${error.message}`);
      });
  }

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

initApp();
