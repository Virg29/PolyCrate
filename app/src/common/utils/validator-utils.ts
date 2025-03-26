const uuidv4RegexValidator = new RegExp(
	/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
);

export function isStringUuidv4(string: string): boolean {
	return uuidv4RegexValidator.test(string);
}
