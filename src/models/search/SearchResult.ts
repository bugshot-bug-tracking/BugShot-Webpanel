import { BugsSearchResult } from "./BugsSearchResult";
import { CompaniesSearchResult } from "./CompaniesSearchResult";
import { ProjectsSearchResult } from "./ProjectsSearchResult";

export interface SearchResult {
	companies: CompaniesSearchResult;
	projects: ProjectsSearchResult;
	bugs: BugsSearchResult;
}

export interface Links {
	self: string;
	first: string;
	last: string;
	prev: any;
	next: string;
}

export interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: {
		url?: string;
		label: string;
		active: boolean;
	}[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}
