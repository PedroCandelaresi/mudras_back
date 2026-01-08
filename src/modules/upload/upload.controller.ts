import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
    @Post('articulos')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/articulos',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        // Retornamos la URL relativa que se servirá estáticamente
        return {
            url: `/uploads/articulos/${file.filename}`,
        };
    }
}
