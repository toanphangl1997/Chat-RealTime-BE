import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.config';

export const CloudinaryInterceptor = FileInterceptor('avatar', {
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: 'chat-app',
      public_id: Date.now() + '-' + file.originalname,
    }),
  }),
});