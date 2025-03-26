interface PreviewableCategory {
	types: string[];
	label: string;
	checkExtension?: (fileName: string) => boolean;
}

export const previewableMimeTypes: Record<string, PreviewableCategory> = {
	image: {
		types: [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'image/svg+xml',
		],
		label: 'Image preview',
	},
	pdf: {
		types: ['application/pdf'],
		label: 'PDF preview',
	},
	stl: {
		types: ['application/octet-stream', 'model/stl'],
		label: '3D Model preview',
		// Additional check for STL files since they might have octet-stream mime type
		checkExtension: (fileName: string) =>
			fileName.toLowerCase().endsWith('.stl'),
	},
	excel: {
		types: [
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		],
		label: 'Excel preview',
		checkExtension: (fileName: string) => {
			const ext = fileName.toLowerCase();
			return ext.endsWith('.xls') || ext.endsWith('.xlsx');
		},
	},
	word: {
		types: [
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		],
		label: 'Word preview',
		checkExtension: (fileName: string) => {
			const ext = fileName.toLowerCase();
			return ext.endsWith('.doc') || ext.endsWith('.docx');
		},
	},
	plaintext: {
		types: ['text/plain'],
		label: 'Text preview',
		checkExtension: (fileName: string) =>
			fileName.toLowerCase().endsWith('.txt'),
	},
};

export const isPreviewableFile = (mimeType: string, fileName?: string) => {
	for (const category of Object.values(previewableMimeTypes)) {
		if (category.types.includes(mimeType)) {
			// For STL files, we need to check the extension
			if (category.checkExtension && fileName) {
				return category.checkExtension(fileName);
			}
			return true;
		}
	}
	return false;
};
