import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
    @Post('articulos')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const path = './uploads/articulos';
                    // Ensure directory exists
                    if (!fs.existsSync(path)) {
                        fs.mkdirSync(path, { recursive: true });
                    }
                    cb(null, path);
                },
                filename: (req, file, cb) => {
                    const randomName = uuidv4();
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new BadRequestException('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB limit
            }
        }),
    )
    uploadArticulo(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Ensure file is readable by others (Nginx)
        try {
            fs.chmodSync(file.path, 0o644);
        } catch (e) {
            console.error('Error setting file permissions:', e);
        }

        // Return the URL that Nginx will serve
        // Filename is stored in file.filename
        const baseUrl = process.env.APP_URL || 'https://mudras.nqn.net.ar';
        return {
            url: `${baseUrl}/api/uploads/articulos/${file.filename}`,
        };
    }
}
