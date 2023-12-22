import { defineStore } from "pinia";

import axios from "axios";

import { Bug } from "~/models/Bug";
import { Screenshot } from "~/models/Screenshot";
import { Attachment } from "~/models/Attachment";
import { useProjectStore } from "./project";
import { BugUserRole } from "~/models/BugUserRole";
import { useHookStore } from "./hooks";
import { Comment } from "~/models/Comment";
import { useReportsStore } from "./reports";
import dateFix from "~/util/dateFixISO";

export const useBugStore = defineStore("bug", {
	state: () => ({
		// used for canceling fetch requests if the store was re-initialized
		controller: new AbortController(),

		project: useProjectStore().project,
		statuses: useReportsStore().statuses,

		// used as a flag for the BugDrawer
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

				if (bug_id === undefined) {
					// unsubscribe from old bug
					return await useHookStore().hookBug();
				}

				this.loading = true;

				this.active = true;

				await this.fetchBug(bug_id, status_id);

				let result = await Promise.allSettled([
					this.fetchScreenshots(),
					this.fetchAttachments(),
					this.fetchComments(),
					this.fetchBugUsers(),
					useHookStore().hookBug(),
				]);

				console.log(result);

				// subscribe to live updates
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
				let response = (
					await axios.get(`statuses/${status_id}/bugs/${id}`, {
						signal: this.controller.signal,
					})
				).data.data as Bug;

				this.bug = response;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_bug = false;
			}
		},

		async fetchScreenshots() {
			if (!this.bug) throw "Screenshots: Bug not set!";

			try {
				this.loading_screenshots = true;

				let screenshots = (
					await axios.get(`bugs/${this.bug.id}/screenshots`, {
						signal: this.controller.signal,
					})
				).data.data as Screenshot[];

				this.screenshots = screenshots;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_screenshots = false;
			}
		},

		async fetchAttachments() {
			if (!this.bug) throw "Attachments: Bug not set!";

			try {
				this.loading_attachments = true;

				let attachments = (
					await axios.get(`bugs/${this.bug.id}/attachments`, {
						signal: this.controller.signal,
					})
				).data.data as Attachment[];

				this.attachments = attachments;
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

				let comments = (
					await axios.get(`bugs/${this.bug.id}/comments`, {
						signal: this.controller.signal,
					})
				).data.data as Comment[];

				this.comments = comments;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_comments = false;
			}
		},

		async fetchBugUsers() {
			if (!this.bug) throw "BugUsers: Bug not set!";

			try {
				this.loading_assignees = true;

				let users = (
					await axios.get(`bugs/${this.bug.id}/users`, {
						signal: this.controller.signal,
					})
				).data.data as BugUserRole[];

				this.assignees = users;
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_assignees = false;
			}
		},

		async deleteBug() {
			if (!this.bug) throw "Bug not set!";

			try {
				this.loading_delete_bug = true;

				await axios.delete(`statuses/${this.bug.attributes.status_id}/bugs/${this.bug.id}`);

				let status = this.getStatus;

				if (!status) return;

				let index = status.attributes.bugs?.findIndex((x) => x.id === this.bug!.id);

				if (index == undefined || index === -1) return;

				status.attributes.bugs?.splice(index, 1);

				this.$reset();

				this.message.info(this.i18n.t("messages.bug_deleted"));
			} catch (error: any) {
				console.log(error);
				throw error;
			} finally {
				this.loading_delete_bug = false;
			}
		},

		async updateBug(changes: {
			designation?: string;
			description?: string;
			url?: string;
			status_id?: string;
			priority_id?: number;
			order_number?: number;
			deadline?: string | null;
			time_estimation?: number | null;
			time_estimation_type?: string | null;
		}) {
			if (!this.bug) throw "Bug not set";

			let newBug = (
				await axios.put(`statuses/${this.bug.attributes.status_id}/bugs/${this.bug.id}`, {
					ai_id: this.bug.attributes.ai_id,

					...{ designation: changes.designation ?? this.bug.attributes.designation },

					...{ description: changes.description ?? this.bug.attributes.description },

					...{ url: changes.url ?? this.bug.attributes.url },

					operating_system: this.bug.attributes.operating_system,
					browser: this.bug.attributes.browser,
					selector: this.bug.attributes.selector,
					resolution: this.bug.attributes.resolution,

					...{ status_id: changes.status_id ?? this.bug.attributes.status_id },

					...{ priority_id: changes.priority_id ?? this.bug.attributes.priority.id },

					...{
						time_estimation:
							changes.time_estimation ?? this.bug.attributes.time_estimation,
					},

					...{
						time_estimation_type:
							changes.time_estimation_type ??
							this.bug.attributes.time_estimation_type,
					},

					...{
						order_number: changes.order_number ?? this.bug.attributes.order_number,
					},

					// if undefined it means that no change was made; if null it means resetting the deadline;
					...{
						deadline:
							changes.deadline === undefined
								? dateFix(this.bug.attributes.deadline)?.slice(0, -1)
								: changes.deadline === null
								? null
								: changes.deadline?.slice(0, -1),
					},
				})
			).data.data as Bug;

			// if the bug change places just handle the move
			if (!(changes.status_id == undefined && changes.order_number == undefined)) {
				const oldBug = this.bug;

				const oldStatus = this.getStatus;
				const newStatus = this.statuses?.find((s) => s.id == changes.status_id);

				let sameStatus = oldStatus?.id === newStatus?.id;

				// if they are the same status but different order, update just the bugs in that status
				if (sameStatus) {
					oldStatus?.attributes.bugs?.forEach((bug) => {
						// if the move was to the right (ex. bug 1 was moved after 4), all the bugs in interval (1, 4] or [2, 4] should be -1
						if (oldBug!.attributes.order_number < newBug.attributes.order_number) {
							if (
								bug.attributes.order_number > oldBug!.attributes.order_number &&
								bug.attributes.order_number <= newBug.attributes.order_number
							) {
								bug.attributes.order_number--;
							}

							// else if the move was to the left (ex. bug 6 was moved before 1), all the bugs in interval [1, 6) or [1, 5] should be +1
						} else {
							if (
								bug.attributes.order_number >= newBug.attributes.order_number &&
								bug.attributes.order_number < oldBug!.attributes.order_number
							) {
								bug.attributes.order_number++;
							}
						}
					});
				} else {
					// remove old bug
					let oldIndex = oldStatus?.attributes.bugs?.findIndex((x) => x.id === newBug.id);

					if (oldIndex != undefined && oldIndex != -1)
						oldStatus?.attributes.bugs?.splice(oldIndex, 1);

					// decrease all the bugs with order_number greater than the one removed
					oldStatus?.attributes.bugs?.forEach((bug) => {
						if (bug.attributes.order_number > oldBug!.attributes.order_number)
							bug.attributes.order_number--;
					});

					let newBugFoundInNewStatus = false;

					// increase all the bugs with order_number the same or greater than the one who will be pushed
					newStatus?.attributes.bugs?.forEach((bug) => {
						// in case external factors added the newBug to the newStatus set the flag and continue iterating
						if (bug.id === newBug.id) return (newBugFoundInNewStatus = true);

						if (bug.attributes.order_number >= newBug.attributes.order_number)
							bug.attributes.order_number++;
					});

					// if the flag was not raised add the bug to the new status
					if (!newBugFoundInNewStatus) newStatus?.attributes.bugs?.push(newBug);
				}
			}

			// update the bug in this store
			Object.assign(this.bug.attributes, newBug.attributes);

			// update the bug in the status list also
			let externalBug = useReportsStore().getBugById(this.bug.id);
			if (externalBug) Object.assign(externalBug.attributes, newBug.attributes);

			this.message.success(this.i18n.t("messages.bug_updated"));
		},

		async createComment({ message, users }: { message: string; users: { user_id: number }[] }) {
			if (!this.bug) throw "Bug not set";

			await axios.post(`bugs/${this.bug.id}/comments`, {
				bug_id: this.bug.id,
				content: message,
				tagged: users,
			});

			this.fetchComments();
		},
	},

	getters: {
		getStatus: (state) => state.statuses?.find((s) => s.id === state.bug?.attributes.status_id),
		getStatusByID: (state) => (id: string) => state.statuses?.find((s) => s.id === id),

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

		getCreatorDisplayName: (state) => {
			if (state.bug == undefined) return undefined;

			if (state.bug.attributes.creator)
				return `${state.bug.attributes.creator.attributes.first_name} ${state.bug.attributes.creator.attributes.last_name}`;

			if (state.bug.attributes.guest_creator) {
				if (
					state.bug.attributes.guest_creator.name ||
					state.bug.attributes.guest_creator.email
				)
					return (
						state.bug.attributes.guest_creator.name ??
						state.bug.attributes.guest_creator.email
					);
			}

			return state.i18n.t("anonymous");
		},
	},
});
