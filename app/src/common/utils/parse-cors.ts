export function parseCorsConfig(configString: string): (string | RegExp)[] {
	const configArray = configString.split(',');
	const trimmedConfigArray = configArray.map((value) => value.trim());

	const corsConfig = trimmedConfigArray.map((item) => {
		if (item.startsWith('/') && item.endsWith('/')) {
			const regexPattern = item.slice(1, -1);
			return new RegExp(regexPattern);
		} else {
			return item;
		}
	});

	return corsConfig;
}
