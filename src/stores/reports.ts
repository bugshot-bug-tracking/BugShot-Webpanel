import { defineStore } from "pinia";

import axios from "axios";

import { Status } from "~/models/Status";
import { Bug } from "~/models/Bug";
import { Screenshot } from "~/models/Screenshot";
import { Attachment } from "~/models/Attachment";
import { useProjectStore } from "./project";
import { BugUserRole } from "~/models/BugUserRole";
import { pusher } from "~/composables/pusher";

export const useReportsStore = defineStore("reports", {
	state: () => ({
		project: useProjectStore().project,

		statuses: undefined as Status[] | undefined,

		// vvv-- the active bug and it's resources --vvv

		bug: undefined as Bug | undefined,

		screenshots: undefined as Screenshot[] | undefined,
		attachments: undefined as Attachment[] | undefined,
		comments: undefined as Comment[] | undefined,

		assignees: undefined as BugUserRole[] | undefined,

		// ------
	}),

	actions: {
		async init(id: string) {
			try {
				this.$reset();

				await this.fetchStatuses(id);
			} catch (error) {
				console.log(error);
				throw error;
			}

			return true;
		},

		async refresh() {
			try {
				await this.fetchStatuses();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchStatuses(id?: string) {
			let response = (
				await axios.get(`projects/${id ?? this.project.id}/statuses`, {
					headers: {
						"include-statuses": true,
						"include-bugs": true,
					},
				})
			).data.data;

			this.statuses = response;
		},

		async createStatus({
			designation,
			order_number = 0,
		}: {
			designation: string;
			order_number?: number;
		}) {
			await axios.post(`projects/${this.project.id}/statuses`, {
				designation: designation,
				order_number: order_number,
			});

			this.refresh();
		},

		async updateStatus({
			id,
			changes = {},
		}: {
			id: string;
			changes: {
				designation?: string;
				order_number?: number;
			};
		}) {
			// get a reference to the status
			const status = this.statuses?.find((x) => x.id === id);
			if (!status) throw "Status not found in memory";

			if (changes.designation) status.attributes.designation = changes.designation;

			if (changes.order_number != undefined) {
				status.attributes.order_number > changes.order_number
					? (status.attributes.order_number = changes.order_number - 0.1)
					: (status.attributes.order_number = changes.order_number + 0.1);
			}

			// let response =
			await axios.put(`projects/${this.project.id}/statuses/${status.id}`, {
				...{ designation: changes.designation ?? status.attributes.designation },

				...{
					order_number:
						changes.order_number != null
							? changes.order_number
							: Math.round(status.attributes.order_number), // Math.round in case the status was moved before refresh finished
				},
			});

			this.refresh();
		},

		async deleteStatus({ id, move }: { id: string; move: string | undefined }) {
			await axios.delete(`projects/${this.project.id}/statuses/${id}`, {
				headers: {
					...(move ? { move: move } : {}),
				},
			});

			this.refresh();
		},

		async setBug(id: string) {
			// unsubscribe from old bug
			await this.unhookBug(this.bug?.id);

			this.bug = undefined;
			this.screenshots = undefined;
			this.attachments = undefined;
			this.comments = undefined;
			this.assignees = undefined;

			let bug = this.getBugById(id);

			if (!bug) throw `Bug (${id}) could not be found!`;

			this.bug = bug;

			await this.fetchScreenshots();
			await this.fetchAttachments();
			await this.fetchComments();
			await this.fetchBugUsers();

			// subscribe to live updates
			await this.hookBug(bug.id);
		},

		async createBug({
			designation,
			description,
			deadline,
			priority_id,
			images,
			attachments,
		}: {
			designation: string;
			description: string;
			deadline?: string;
			priority_id: number;
			images?: { base64: string }[];
			attachments?: { designation: string; base64: string }[];
		}) {
			let status = this.getFirstStatus;

			if (!status) return;

			let response = (
				await axios.post(`statuses/${status.id}/bugs`, {
					designation: designation,
					description: description,
					priority_id: priority_id,
					...{
						deadline: deadline ? new Date(deadline).toISOString().slice(0, -1) : null,
					},
				})
			).data.data;

			if (images)
				// using the bug id send screenshots one-by-one
				for (const image of images) {
					await axios.post(`bugs/${response.id}/screenshots`, image);
				}

			if (attachments)
				// using the bug id send screenshots one-by-one
				for (const attachment of attachments) {
					await axios.post(`bugs/${response.id}/attachments`, attachment);
				}

			this.refresh();
		},

		async updateBug(changes: {
			designation?: string;
			description?: string;
			status_id?: string;
			priority_id?: number;
			order_number?: number;
			deadline?: string | null;
		}) {
			if (!this.bug) throw "Bug not set";

			let response = (
				await axios.put(`statuses/${this.bug.attributes.status_id}/bugs/${this.bug.id}`, {
					ai_id: this.bug.attributes.ai_id,

					...{ designation: changes.designation ?? this.bug.attributes.designation },

					...{ description: changes.description ?? this.bug.attributes.description },

					url: this.bug.attributes.url,
					operating_system: this.bug.attributes.operating_system,
					browser: this.bug.attributes.browser,
					selector: this.bug.attributes.selector,
					resolution: this.bug.attributes.resolution,

					...{ status_id: changes.status_id ?? this.bug.attributes.status_id },

					...{ priority_id: changes.priority_id ?? this.bug.attributes.priority.id },

					...{ order_number: changes.order_number ?? this.bug.attributes.order_number },

					// if undefined it means that no change was made; if null it means resetting the deadline;
					...{
						deadline:
							changes.deadline === undefined
								? this.bug.attributes.deadline?.slice(0, -1)
								: changes.deadline === null
								? null
								: changes.deadline?.slice(0, -1),
					},
				})
			).data.data;

			Object.assign(this.bug.attributes, (response as Bug).attributes);

			this.refresh();
		},

		async moveBug({
			bug_id,
			changes,
		}: {
			bug_id: string;
			changes: { status_id: string; order_number: number };
		}) {
			let bug = this.getBugById(bug_id);
			if (!bug) throw "Bug not found!";

			await axios.put(`statuses/${bug.attributes.status_id}/bugs/${bug.id}`, {
				ai_id: bug.attributes.ai_id,

				designation: bug.attributes.designation,

				description: bug.attributes.description,

				url: bug.attributes.url,
				operating_system: bug.attributes.operating_system,
				browser: bug.attributes.browser,
				selector: bug.attributes.selector,
				resolution: bug.attributes.resolution,

				...{ status_id: changes.status_id ?? bug.attributes.status_id },

				priority_id: bug.attributes.priority.id,

				...{
					order_number: changes.order_number ?? bug.attributes.order_number,
				},

				deadline: bug.attributes.deadline?.slice(0, -1),
			});
		},

		async deleteBug() {
			if (!this.bug) throw "Bug not set!";

			await axios.delete(`statuses/${this.bug.attributes.status_id}/bugs/${this.bug.id}`);

			let status = this.getStatusById(this.bug.attributes.status_id);

			if (!status) return;

			let index = status.attributes.bugs?.findIndex((x) => x.id === this.bug!.id);

			if (index == undefined || index === -1) return;

			status.attributes.bugs?.splice(index, 1);
		},

		async fetchScreenshots() {
			if (!this.bug) throw "Bug not set!";

			let screenshots = (await axios.get(`bugs/${this.bug.id}/screenshots`)).data
				.data as Screenshot[];

			screenshots.forEach((x) => (x.attributes.base64 = atob(x.attributes.base64)));

			this.screenshots = screenshots;
		},

		async fetchAttachments() {
			if (!this.bug) throw "Bug not set!";

			let attachments = (await axios.get(`bugs/${this.bug.id}/attachments`)).data
				.data as Attachment[];

			this.attachments = attachments;
		},

		async fetchComments() {
			if (!this.bug) throw "Bug not set!";

			let comments = (await axios.get(`bugs/${this.bug.id}/comments`)).data.data as Comment[];

			this.comments = comments;
		},

		async fetchBugUsers() {
			if (!this.bug) throw "Bug not set!";

			let users = (await axios.get(`bugs/${this.bug.id}/users`)).data.data as BugUserRole[];

			this.assignees = users;
		},

		async unhookBug(id: string | undefined) {
			if (id == undefined) return;

			const channel = `bugs.${id}`;

			const pusher_channel = pusher.channel(channel);

			if (pusher_channel) pusher_channel.unsubscribe();
		},

		async hookBug(id: string) {
			const channel = `bugs.${id}`;

			pusher.subscribe(channel);

			pusher.bind("bug.updated", async (data: any) => {
				if (data && data.type === "Bug") {
					Object.assign(this.bug!.attributes, (data as Bug).attributes);

					//TODO treat move or order change
				} else console.log(data);
			});

			pusher.bind("bug.deleted", async (data: any) => {
				let status = this.getStatusById(this.bug!.attributes.status_id);

				if (!status) return;

				let index = status.attributes.bugs?.findIndex((x) => x.id === this.bug!.id);

				if (index == undefined || index === -1) return;

				status.attributes.bugs?.splice(index, 1);

				this.bug!.attributes.deleted_at = new Date().toString();
			});

			pusher.bind("members.updated", async () => {
				await this.fetchBugUsers();
			});

			pusher.bind("screenshot.created", (data: any) => {
				if (data && data.type === "Screenshot") {
					this.screenshots?.push(data);
				} else console.log(data);
			});

			pusher.bind("screenshot.deleted", (data: string) => {
				if (isNaN(Number(data))) return;

				let index = this.screenshots?.findIndex((x) => x.id === Number(data));

				if (index == undefined || index === -1) return;

				this.screenshots?.splice(index, 1);
			});

			pusher.bind("attachment.created", (data: any) => {
				if (data && data.type === "Attachment") {
					this.attachments?.push(data);
				} else console.log(data);
			});

			pusher.bind("attachment.deleted", (data: string) => {
				if (isNaN(Number(data))) return;

				let index = this.attachments?.findIndex((x) => x.id === Number(data));

				if (index == undefined || index === -1) return;

				this.attachments?.splice(index, 1);
			});

			pusher.bind("comment.created", (data: any) => {
				if (data && data.type === "Comment") {
					this.comments?.push(data);
				} else console.log(data);
			});
		},
	},

	getters: {
		getStatuses: (state) =>
			state.statuses?.sort((a, b) =>
				a.attributes.order_number < b.attributes.order_number ? -1 : 1
			),

		getStatusById: (state) => (id: string) => state.statuses?.find((x) => x.id === id),

		getBug: (state) => state.bug,

		getScreenshots: (state) => state.screenshots,
		getAttachments: (state) => state.attachments,
		getComments: (state) => state.comments,
		getAssignees: (state) =>
			state.assignees?.map((x: BugUserRole) => {
				x.user.role = x.role;
				return x.user;
			}),

		getBugById: (state) => (id: string) => {
			if (!state.statuses) return null;

			for (const status of state.statuses)
				for (const bug of status.attributes.bugs ?? []) if (bug.id === id) return bug;

			return null;
		},

		getBugsByStatusId: (state) => (id: string) => {
			let status = state.statuses?.find((x) => x.id === id);

			if (status) return status.attributes.bugs;
			else return [];
		},

		getFirstStatus: (state) => {
			if ((state.statuses?.length ?? -1) < 1) return null;

			return state.statuses?.find((x) => x.attributes.order_number === 0);
		},
	},
});
