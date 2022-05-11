import consola from 'consola';

import app from './src/app';
import connectMongo from './src/db';

const PORT = process.env.API_PORT || 5000;

app.listen(PORT, () => {
    consola.success(`Server has been started on ${PORT}`);

    connectMongo();
});
