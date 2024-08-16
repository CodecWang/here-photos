import koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { catchError } from './middleware/catch-error';
import db from './model';
import routes from './route';

const app = new koa();

app.use(catchError);
app.use(bodyParser());
routes.forEach((router) => app.use(router.middleware()));
app.use(async (ctx) => {
  ctx.body = { message: 'Hi, welcome to visit Here APIs.' };
});

db.sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error: Error) => {
    console.error(`Error syncing database: ${error.message}`);
  });

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
