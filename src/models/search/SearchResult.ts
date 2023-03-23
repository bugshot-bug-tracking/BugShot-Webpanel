import { BugsSearchResult } from "./BugsSearchResult";
import { CompaniesSearchResult } from "./CompaniesSearchResult";
import { ProjectsSearchResult } from "./ProjectsSearchResult";

export interface SearchResult {
	companies: CompaniesSearchResult;
	projects: ProjectsSearchResult;
	bugs: BugsSearchResult;
}

export interface Link {
	url?: string;
	label: string;
	active: boolean;
}
