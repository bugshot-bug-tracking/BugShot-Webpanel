import { CompaniesSearchData } from "./CompaniesSearchData";
import { Link } from "./SearchResult";

export interface CompaniesSearchResult {
	current_page: number;
	data: CompaniesSearchData[];
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
