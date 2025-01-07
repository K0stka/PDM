export const gytool = "#0062a3";

export const getColorsFromString = (string: string): { light: string; dark: string } => {
	const normalizeHash = (hash: number, min: number, max: number): number => {
		return Math.floor((hash % (max - min)) + min);
	};

	let hash = 0;

	for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
	hash = Math.abs(hash);

	return {
		light: `hsl(${normalizeHash(hash, 0, 360)}, ${normalizeHash(hash, 50, 90)}%, ${normalizeHash(hash, 20, 40)}%)`,
		dark: `hsl(${normalizeHash(hash, 0, 360)}, ${normalizeHash(hash, 50, 90)}%, ${normalizeHash(hash, 80, 90)}%)`,
	};
};
