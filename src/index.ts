import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { intialDbExecution } from './db';
import { addNewUser, loginFunc } from './functions';
import { deleteImage, getimages, uploadImage } from './functions/image';
import { authorize } from './controller/auth';

dotenv.config();
const app = express();
app.use(express.json({limit: "10mb"}));
app.use(cors());


app.post('/api/v1/ysquare-imageGallery/login', loginFunc)
app.post('/api/v1/ysquare-imageGallery/signup', addNewUser)

app.get('/api/v1/ysquare-imageGallery/get/images', authorize, getimages)
app.post('/api/v1/ysquare-imageGallery/upload/image', authorize, uploadImage)
app.delete('/api/v1/ysquare-imageGallery/delete/:id/image', authorize, deleteImage)


app.listen(process.env.PORT || 5001, () => {
    intialDbExecution()
    console.log("universe listening on port ",process.env.PORT || 5001);
})