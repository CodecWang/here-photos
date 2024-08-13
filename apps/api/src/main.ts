import koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { catchError } from './middleware/catch-error';
import db from './models';
import v1Router from './routes/v1';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new koa();

app.use(catchError);
app.use(bodyParser());
app.use(v1Router.middleware());
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

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
