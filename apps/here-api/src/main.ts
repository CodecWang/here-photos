import fs from 'fs';

import koa from 'koa';
import { HttpMethodEnum, koaBody } from 'koa-body';

import {
  DEFAULT_MEDIA_DIR,
  THUMBNAILS_DIR,
  UPLOADS_DIR,
} from './config/constants';
import { catchError } from './middleware/catch-error';
import albumRoutes from './routes/album';
import photoRoutes from './routes/photo';
import settingRoutes from './routes/setting';

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
      parsedMethods: [
        HttpMethodEnum.POST,
        HttpMethodEnum.PUT,
        HttpMethodEnum.PATCH,
        HttpMethodEnum.DELETE,
      ],
      multipart: true,
      formidable: {
        uploadDir: UPLOADS_DIR,
        keepExtensions: true,
        multiples: true,
        hashAlgorithm: 'md5',
      },
    })
  );

  app.use(albumRoutes.routes()).use(albumRoutes.allowedMethods());
  app.use(settingRoutes.routes()).use(settingRoutes.allowedMethods());
  app.use(photoRoutes.routes()).use(photoRoutes.allowedMethods());

  app.use(async (ctx) => {
    ctx.body = { message: 'Hi, welcome to visit Here APIs.' };
  });

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

initApp();
