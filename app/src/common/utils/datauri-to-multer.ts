import { dataUriToBuffer } from 'data-uri-to-buffer';
import { v4 as uuidv4 } from 'uuid';

export function dataUriToMulter(data: string): Express.Multer.File {
	const file = dataUriToBuffer(data);
	const multerFile: Express.Multer.File = {
		buffer: Buffer.from(file.buffer),
		fieldname: 'valueImage',
		mimetype: file.type,
		size: file.buffer.byteLength,
		originalname: uuidv4() + `.${file.type.split('/')[1]}`, //image/png -> uuidv4_random.png
		encoding: file.charset,
		destination: null,
		filename: null,
		path: null,
		stream: null,
	};
	return multerFile;
}
