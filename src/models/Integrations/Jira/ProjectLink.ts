export interface JiraProjectLink {
	site: {
		id?: string;
		name?: string;
		url?: string;
	};
	project: {
		id?: string;
		name?: string;
		key?: string;
	};
	options: {
		sync_bugs_to_jira: boolean;
		sync_bugs_from_jira: boolean;
		sync_comments_to_jira: boolean;
		sync_comments_from_jira: boolean;
		update_status_to_jira: boolean;
		update_status_from_jira: boolean;
	};
}
