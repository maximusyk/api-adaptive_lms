import consola from 'consola';
import mongoose from 'mongoose';
import 'dotenv/config';

const mongoURI: string = process.env.MONGODB_URI as string;

export default () => {
    return mongoose
        .connect(mongoURI)
        .then(() => consola.success('MongoDB connected.'))
        .catch((err: string) => {
            consola.error(err);
            process.exit(1);
        });
};
