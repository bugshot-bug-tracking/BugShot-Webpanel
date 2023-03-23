import { ProjectSearchData } from "./ProjectSearchData";
import { Link } from "./SearchResult";

export interface ProjectsSearchResult {
	current_page: number;
	data: ProjectSearchData[];
	first_page_url: string;
	from: any;
	last_page: number;
	last_page_url: string;
	links: Link[];
	next_page_url: any;
	path: string;
	per_page: number;
	prev_page_url: any;
	to: any;
	total: number;
}
