import overview from "~/tours/overview";

export enum Tours {
	overview = "overview",
}

export function useTours() {
	return {
		[Tours.overview]: overview,
	};
}
