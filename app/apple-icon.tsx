import { generateIconPng } from "@/configuration/icon";

// Image metadata
export const size = {
	width: 256,
	height: 256,
};
export const contentType = "image/png";

export default function Icon() {
	return generateIconPng(size.width);
}
