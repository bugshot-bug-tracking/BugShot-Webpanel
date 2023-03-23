import { BugSearchData } from "./BugSearchData";
import { Link } from "./SearchResult";

export interface BugsSearchResult {
	current_page: number;
	data: BugSearchData[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: Link[];
	next_page_url: any;
	path: string;
	per_page: number;
	prev_page_url: any;
	to: number;
	total: number;
}
