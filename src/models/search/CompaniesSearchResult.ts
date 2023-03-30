import { CompaniesSearchData } from "./CompaniesSearchData";
import { Links, Meta } from "./SearchResult";

export interface CompaniesSearchResult {
	data: CompaniesSearchData[];
	links: Links;
	meta: Meta;
}
