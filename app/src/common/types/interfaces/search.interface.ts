//https://www.typescriptlang.org/play?#code/C4TwDgpgBAysBOBLAdgcwGKIgGwCYGcAeAFQD4oBeKAbwCgooBtAaShSgGsIQB7AMyjEAugC5BLIVAgAPYBGQEo+BClRQA-FFYy5C-EpVpNzMcggA3CPCimLVgNy0Avoy68Bwx7Voo58PgCGAMbQAOLyVgHYMBAB8EEAFjS0AJB8WHj4YspIaIxCzt6+VoEhguAQuDFxiSTkOvKK4WbwUdXxSXRpGQRicLkYPURk+Y5O3gD0E1AAotIBALZg2NAArvgBqNAA7ojASTwARgBWEEHAUACCtKCQV5TJDOk4uAD6yIsQ2YaojgwByB4+ysr2eeHen2+Az+UABb3wPAWEFeCx48GRYNwUNUMOQqyRSCCoJ6pnxhwczi8QR4yGUsMwLyy5UgVViHUIl3IVDoTyGYkYAHJMRCkQKADRQAUAoEJEHCj6iiVShSvBFIlFojE9cWSvEExBEzECoRiymTabEBKIfS7bDYKDo-CrbAXdgBZkQGBBJBgC5WeBopQoMoCvVWA3El4Ctj6QEXd05VRQTFQfipk5nC7XKZQam013IcxRRC4BmZPo-MsES7wVogDlc5I53mM-lCnoiiA60P48OG7VKuGqxHI1HoyN4Y2mnNORxAA

type StringFields<T> = {
	[K in keyof T]: T[K] extends string
		? K extends string
			? K
			: never
		: never;
}[keyof T];

export interface SearchQueryGeneral {
	fields: string[];
	query: string;
	sort: 'asc' | 'desc';
}
export interface SearchQueryTyped<T> extends SearchQueryGeneral {
	fields: StringFields<T>[];
}

export interface ExactMatchQuery {
	[key: string]: {
		equals?: string;
		not?: string;
		in?: string[];
		notIn?: string[];
	};
}
