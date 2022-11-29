import { defineStore } from "pinia";

import axios from "axios";
import { Project } from "~/models/Project";
import { Status } from "~/models/Status";
import { Invitation } from "~/models/Invitation";
import { ProjectUserRole } from "~/models/ProjectUserRole";
import { useCompanyStore } from "./company";

export const useProjectStore = defineStore("project", {
	state: () => ({
		company_id: undefined as string | undefined,

		project_id: undefined as string | undefined,
		project: undefined as Project | undefined,

		members: undefined as ProjectUserRole[] | undefined,
		pendingInvitations: undefined as Invitation[] | undefined,

		statuses: undefined as Status[] | undefined,
	}),

	actions: {
		async destroy() {
			this.company_id = undefined;
			this.project_id = undefined;
			this.project = undefined;
			this.members = undefined;
			this.pendingInvitations = undefined;
			this.statuses = undefined;

			return true;
		},

		async init(company_id: string, project_id: string) {
			try {
				this.destroy();

				this.project_id = project_id;
				this.company_id = company_id;

				await this.load();

				await this.fetchUsers();

				await this.fetchStatuses();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async refresh() {
			try {
				await this.load();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async load() {
			let project = (
				await axios.get(`companies/${this.company_id}/projects/${this.project_id}`, {
					headers: {
						"include-project-role": true,
						"include-project-image": true,
					},
				})
			).data.data;

			this.project = project;
		},

		async updateResource(payload: {
			designation: string;
			url: string;
			color_hex: string;
			base64: string;
		}) {
			let response = (
				await axios.put(`companies/${this.company_id}/projects/${this.project_id}`, {
					designation: payload.designation,
					url: payload.url,
					color_hex: payload.color_hex,
					base64: payload.base64,
				})
			).data.data;

			useCompanyStore().updateProject(response);

			await this.refresh();
		},

		async deleteResource() {
			// if an id was not set return
			if (this.company_id === undefined || this.project_id === undefined) return;

			await axios.delete(`companies/${this.company_id}/projects/${this.project_id}`);

			useCompanyStore().removeProject(this.project_id);
		},

		async fetchUsers() {
			let response = (await axios.get(`projects/${this.project_id}/users`)).data.data;

			this.members = response;
		},

		async fetchInvitations() {
			let response = (
				await axios.get(`projects/${this.project_id}/invitations`, {
					headers: {
						"status-id": "1",
					},
				})
			).data.data;

			this.pendingInvitations = response;
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			// if an id was not set return
			if (this.project_id === undefined) return;

			let response = (
				await axios.post(`projects/${this.project_id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			if (!this.pendingInvitations) this.pendingInvitations = [] as Invitation[];
			this.pendingInvitations.push(response);
		},

		/**
		 * Function used to send an invitation for a specific project without requiring the store to be initialized
		 * @param id A project ID
		 * @param payload Invitation details
		 */
		async sendInvitationSpecific(id: string, payload: { email: string; role_id: number }) {
			let response = (
				await axios.post(`projects/${id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			return response;
		},

		async deleteInvitation(payload: { invitation_id: string }) {
			await axios.delete(`invitations/${payload.invitation_id}`);

			let index = this.pendingInvitations?.findIndex(
				(x: any) => x.id === payload.invitation_id
			);

			if (index !== undefined && index !== -1) this.pendingInvitations!.splice(index, 1);
		},

		async editMember(payload: { user_id: number; role_id: number }) {
			let response = (
				await axios.put(`projects/${this.project_id}/users/${payload.user_id}`, {
					role_id: payload.role_id,
				})
			).data.data;

			let user = this.members?.find((x) => x.user.id === payload.user_id);

			if (user) user.role = response.role;
		},

		async deleteMember(payload: { user_id: number }) {
			await axios.delete(`projects/${this.project_id}/users/${payload.user_id}`);

			let index = this.members?.findIndex((x) => x.user.id === payload.user_id);

			if (index !== undefined && index !== -1) this.members!.splice(index, 1);
		},

		async fetchStatuses() {
			let response = (
				await axios.get(`projects/${this.project_id}/statuses`, {
					headers: {
						"include-statuses": true,
						"include-bugs": true,
					},
				})
			).data.data;

			this.statuses = response;
		},

		//! --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		async syncBug(payload: any) {
			try {
				//get a reference to the bug
				const bug = this.getBugById(payload.id);
				if (!bug) throw "Bug not found in memory";

				let response = await axios.put(
					`statuses/${bug.attributes.status_id}/bugs/${bug.id}`,
					{
						ai_id: bug.attributes.ai_id,

						...(payload.changes.designation
							? { designation: payload.changes.designation }
							: { designation: bug.attributes.designation }),

						...(payload.changes.description
							? { description: payload.changes.description }
							: { description: bug.attributes.description }),

						url: bug.attributes.url,
						operating_system: bug.attributes.operating_system,
						browser: bug.attributes.browser,
						selector: bug.attributes.selector,
						resolution: bug.attributes.resolution,

						...(payload.changes.status_id
							? { status_id: payload.changes.status_id }
							: { status_id: bug.attributes.status_id }),

						...(payload.changes.priority_id
							? { priority_id: payload.changes.priority_id }
							: { priority_id: bug.attributes.priority.id }),

						...(payload.changes.order_number != null
							? { order_number: payload.changes.order_number }
							: { order_number: bug.attributes.order_number }),

						// if undefined it means that no change was made; if null it means resetting the deadline;
						...(payload.changes.deadline === undefined
							? {
									deadline: bug.attributes.deadline?.slice(0, -1),
							  }
							: payload.changes.deadline === null
							? { deadline: null }
							: {
									deadline: payload.changes.deadline?.slice(0, -1),
							  }),
					}
				);

				// if (payload.changes.status_id) {
				// 	let orgList = this.getBugsByStatusId(
				// 		bug.attributes.status_id
				// 	);

				// 	let index1 = orgList?.findIndex((x) => x.id === bug.id);

				// 	if (index1 !== undefined && index1 >= 0)
				// 		orgList?.splice(index1, 1);

				// 	let newList = this.getBugsByStatusId(
				// 		payload.changes.status_id
				// 	);

				// 	newList?.unshift(bug);
				// }

				bug.attributes = response.data.data.attributes;

				console.log(bug);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchScreenshots(id: string) {
			let bug = this.getBugById(id);
			if (!bug) throw "Bug not found in memory";

			try {
				// fetch bug screenshots
				let screenshots = (await axios.get(`bugs/${id}/screenshots`)).data.data;

				for (const screenshot of screenshots) {
					// fetch each status bugs

					screenshot.attributes.base64 = atob(screenshot.attributes.base64);
				}

				bug.screenshots = screenshots;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchAttachments(id: string) {
			let bug = this.getBugById(id);
			if (!bug) throw "Bug not found in memory";

			try {
				// fetch bug screenshots
				let attachments = (await axios.get(`bugs/${id}/attachments`)).data.data;

				bug.attachments = attachments;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchComments(id: string) {
			let bug = this.getBugById(id);
			if (!bug) throw "Bug not found in memory";

			try {
				// fetch bug screenshots
				let comments = (await axios.get(`bugs/${id}/comments`)).data.data;

				bug.comments = comments;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchBugUsers(id: string) {
			let bug = this.getBugById(id);
			if (!bug) throw "Bug not found in memory";

			try {
				// fetch bug screenshots
				let users = (await axios.get(`bugs/${id}/users`)).data.data;

				bug.users = users;
			} catch (error) {
				console.log(error);
			}
		},

		async createStatus(payload: { designation: string; order_number: number }) {
			try {
				await axios.post(`projects/${this.project_id}/statuses`, {
					designation: payload.designation,
					order_number: payload.order_number,
				});

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async syncStatus(payload: {
			id: string;
			changes?: {
				designation?: string;
				order_number?: number;
			};
		}) {
			try {
				// get a reference to the status
				const status = this.getStatusById(payload.id);
				if (!status) throw "Status not found in memory";

				if (payload.changes?.designation)
					status.attributes.designation = payload.changes.designation;
				if (payload.changes?.order_number != undefined) {
					status.attributes.order_number > payload.changes.order_number
						? (status.attributes.order_number = payload.changes.order_number - 0.1)
						: (status.attributes.order_number = payload.changes.order_number + 0.1);
				}

				// let response =
				await axios.put(`projects/${this.project_id}/statuses/${status.id}`, {
					...(payload.changes?.designation
						? { designation: payload.changes.designation }
						: { designation: status.attributes.designation }),

					...(payload.changes?.order_number != null
						? { order_number: payload.changes.order_number }
						: {
								order_number: Math.round(status.attributes.order_number), // Math.round in case the status was moved before refresh finished
						  }),
				});

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteStatus(payload: { id: string; move: string | undefined }) {
			try {
				await axios.delete(`projects/${this.project_id}/statuses/${payload.id}`, {
					headers: {
						...(payload.move ? { move: payload.move } : {}),
					},
				});

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},

	getters: {
		getProject: (state) => state.project,

		getMembers: (state) =>
			state.members?.map((x) => {
				x.user.role = x.role;
				return x.user;
			}),

		getCreator: (state) => state.project?.attributes?.creator,

		getPendingInvitations: (state) => state.pendingInvitations,

		getStatuses: (state) =>
			state.statuses?.sort((a, b) =>
				a.attributes.order_number < b.attributes.order_number ? -1 : 1
			),

		getStatusById: (state) => (id: string) => state.statuses?.find((x) => x.id === id),

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
