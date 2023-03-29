import { ProjectSearchData } from "./ProjectSearchData";
import { Links, Meta } from "./SearchResult";

export interface ProjectsSearchResult {
	data: ProjectSearchData[];
	links: Links;
	meta: Meta;
}
