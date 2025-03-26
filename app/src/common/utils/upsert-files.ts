import { PrismaTXClient } from '../types/prisma/types';
import { dataUriToMulter } from './datauri-to-multer';

export async function upsertFiles<
	T extends { url: string; id: string },
	K extends { file?: string; url?: string },
>(
	options: {
		id: string;
		files: K[];
		getFilesFn: (id: string, tx?: PrismaTXClient) => Promise<T[]>;
		attachFilesFn: (
			id: string,
			files: Express.Multer.File[],
			tx?: PrismaTXClient,
		) => Promise<any>;
		detachFilesFn: (ids: string[], tx?: PrismaTXClient) => Promise<any>;
	},
	tx?: PrismaTXClient,
): Promise<T[]> {
	const existingFiles = await options.getFilesFn(options.id, tx);

	const filesToCreate: Express.Multer.File[] = [];

	const filesUrls: string[] = [];

	if (options.files != null)
		options.files.forEach((image) => {
			// todo: replace with validation pipe when implement ability to look inside arrays, too complicated by now
			if (
				(image.file == null && image.url == null) ||
				(image.file != null && image.url != null)
			)
				throw new Error(
					'File upsertion data must contain single field: file in case of appending new file to entity, url in case of do nothing with existing',
				);

			if (image.file != null)
				filesToCreate.push(dataUriToMulter(image.file));
			else filesUrls.push(image.url);
		});

	const filesToDelete: string[] = existingFiles
		.filter((existingImage) => !filesUrls.includes(existingImage.url))
		.flatMap((existingImage) => existingImage.id);

	if (filesToCreate.length != 0 || filesToDelete.length != 0)
		await Promise.all([
			options.attachFilesFn(options.id, filesToCreate, tx),
			options.detachFilesFn(filesToDelete, tx),
		]);
	return await options.getFilesFn(options.id, tx);
}
