import { defineStore } from "pinia";

import axios from "axios";

import { Bug } from "~/models/Bug";
import { Screenshot } from "~/models/Screenshot";
import { Attachment } from "~/models/Attachment";
import { useProjectStore } from "./project";
import { BugUserRole } from "~/models/BugUserRole";
import { Comment } from "~/models/Comment";
import { useReportsStore } from "./reports";

export const useArchivedBugStore = defineStore("archivedBug", {
	state: () => ({
		// used for canceling fetch requests if the store was re-initialized
		controller: new AbortController(),

		project: useProjectStore().project,
		statuses: useReportsStore().statuses,

		// used as a flag for the ArchivedBugDrawer
		active: false,

		loading: false,
		loading_bug: false,
		loading_attachments: false,
		loading_screenshots: false,
		loading_comments: false,
		loading_assignees: false,
		loading_delete_bug: false,

		bug: undefined as Bug | undefined,

		screenshots: undefined as Screenshot[] | undefined,
		attachments: undefined as Attachment[] | undefined,
		comments: undefined as Comment[] | undefined,

		assignees: undefined as BugUserRole[] | undefined,
	}),

	actions: {
		async init(bug_id: string | undefined, status_id: string) {
			try {
				this.controller.abort("New initialization");
				this.$reset();

				if (bug_id === undefined) return;

				this.loading = true;

				this.active = true;

				await this.fetchBug(bug_id, status_id);
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				this.loading = false;
			}

			return true;
		},

		async refreshBug() {
			if (!this.bug) return "RefreshBug: No active bug set!";

			await this.fetchBug(this.bug?.id, this.bug?.attributes.status_id);
		},

		async fetchBug(id: string, status_id: string) {
			try {
				this.loading_bug = true;
				this.loading_attachments = true;
				this.loading_screenshots = true;
				this.loading_comments = true;
				this.loading_assignees = true;

				let response = (
					await axios.get(`statuses/${status_id}/archived-bugs/${id}`, {
						signal: this.controller.signal,
						headers: {
							"include-attachments": true,
							"include-screenshots": true,
							"include-comments": true,
							"include-bug-users": true,
						},
					})
				).data.data as Bug;

				this.bug = response;
				this.screenshots = response.attributes.screenshots;
				this.attachments = response.attributes.attachments;
				this.comments = response.attributes.comments;
				this.assignees = response.attributes.users;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_bug = false;
				this.loading_attachments = false;
				this.loading_screenshots = false;
				this.loading_comments = false;
				this.loading_assignees = false;
			}
		},

		async fetchAttachments() {
			if (!this.bug) throw "Attachments: Bug not set!";

			try {
				this.loading_attachments = true;

				let response = (
					await axios.get(
						`statuses/${this.bug.attributes.status_id}/archived-bugs/${this.bug.id}`,
						{
							signal: this.controller.signal,
							headers: {
								"include-attachments": true,
							},
						}
					)
				).data.data as Bug;

				this.attachments = response.attributes.attachments;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_attachments = false;
			}
		},

		async fetchComments() {
			if (!this.bug) throw "Comments: Bug not set!";

			try {
				this.loading_comments = true;

				let response = (
					await axios.get(
						`statuses/${this.bug.attributes.status_id}/archived-bugs/${this.bug.id}`,
						{
							signal: this.controller.signal,
							headers: {
								"include-comments": true,
							},
						}
					)
				).data.data as Bug;

				this.comments = response.attributes.comments;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_comments = false;
			}
		},
	},

	getters: {
		getStatus: (state) => state.statuses?.find((s) => s.id === state.bug?.attributes.status_id),

		getScreenshots: (state) => state.screenshots ?? [],
		getAttachments: (state) => state.attachments ?? [],
		getComments: (state) =>
			state.comments?.sort((a, b) => {
				let a_date = Date.parse(a.attributes.created_at);
				let b_date = Date.parse(b.attributes.created_at);

				if (a_date < b_date) return -1;
				else if (a_date > b_date) return 1;
				return 0;
			}) ?? [],
		getAssignees: (state) =>
			state.assignees?.map((x: BugUserRole) => {
				x.user.role = x.role;
				return x.user;
			}),
	},
});
