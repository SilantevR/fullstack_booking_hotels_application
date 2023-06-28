import { extname } from 'path';
import { randomUUID } from 'crypto';
import { Request } from 'express';

const fileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const fileExtName = extname(file.originalname);
  const randomName = randomUUID();
  callback(null, `${randomName}${fileExtName}`);
};

export default fileName;
