import { BugSearchData } from "./BugSearchData";
import { Links, Meta } from "./SearchResult";

export interface BugsSearchResult {
	data: BugSearchData[];
	links: Links;
	meta: Meta;
}
