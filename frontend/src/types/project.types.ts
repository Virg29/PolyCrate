export interface Project {
	id: string;
	name: string;
	description: string;
	tags: string[];
	created_at: string;
	creator: {
		id: string;
		name: string;
		email: string;
	};
	collaborators: {
		id: string;
		name: string;
		email: string;
	}[];
	versions: Version[];
	_count: {
		versions: number;
		collaborators: number;
	};
}

export interface Version {
	id: string;
	version_tag: string;
	description: string;
	created_at: string;
	files: {
		id: string;
		name: string;
		description: string;
		mime_type: string;
		size: number;
		created_at: string;
	}[];
	_count: {
		files: number;
	};
}

export interface FileWithPreview extends File {
	id: string;
	preview?: string;
}
