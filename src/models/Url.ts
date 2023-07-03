export interface Url {
	id: string;
	type: "Url";
	attributes: {
		url: string;
		https: 0 | 1;
	};
}
