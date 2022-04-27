import consola from 'consola';

import app from './src/app';
import connectMongo from './src/db';

app.listen(5000, () => {
  consola.success('Server has been started on 5000');

  connectMongo();
});
