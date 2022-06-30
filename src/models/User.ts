export interface User {
	id: number;
	type: string;
	attributes: {
		email: string;
		first_name: string;
		last_name: string;
	};
}
