import config from 'config';
import consola from 'consola';
import mongoose from 'mongoose';

const mongoURI = config.get('mongoURI') as string;

export default () => {
  return mongoose
    .connect(mongoURI)
    .then(() => consola.success('MongoDB connected.'))
    .catch((err: string) => {
      consola.error(err);
      process.exit(1);
    });
};
