import config from 'config';
import crypto from 'crypto';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';

const mongoURI: string = config.get('mongoURI');

const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('lectures');
});

export const upload = multer({
    storage: new GridFsStorage({
        url: mongoURI,
        file: (req, file) => {
            const { key } = req.params;
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = key || buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename, bucketName: 'lectures'
                    };
                    resolve(fileInfo);
                });
            });
        }
    })
});