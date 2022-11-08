import { defineStore } from "pinia";

import axios from "axios";
import { Project } from "~/models/Project";
import { Status } from "~/models/Status";
import { Company } from "~/models/Company";
import { useMainStore } from "./main";

export const useProjectStore = defineStore("project", {
	state: () => ({
		project_id: "",
		company_id: "",
		project: <Project>{},
		company: <Company>{},

		statuses: new Array<Status>(),
	}),

	actions: {
		async destroy() {
			this.project_id = "";
			this.project = <Project>{};
			this.statuses = [] as Status[];

			return true;
		},

		async init(company_id: string, project_id: string) {
			this.destroy();

			this.project_id = project_id;
			this.company_id = company_id;

			await this.loadProject();
		},

		async refresh() {
			await this.loadProject();
		},

		async loadProject() {
			try {
				let project = (
					await axios.get(
						`companies/${this.company_id}/projects/${this.project_id}`,
						{
							headers: {
								"include-project-users": true,
								"include-project-users-roles": true,
								"include-project-role": true,
								"include-statuses": true,
								"include-bugs": true,
								"include-project-image": true,
							},
						}
					)
				).data.data;

				let company = (
					await axios.get(`companies/${this.company_id}`, {
						headers: {
							"include-company-users": true,
							"include-company-users-roles": true,
							"include-company-role": true,
						},
					})
				).data.data;

				this.project = project;
				this.company = company;

				this.statuses = <Status[]>this.project.attributes.statuses;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchProjectUsers() {
			try {
				let response = (
					await axios.get(
						`companies/${this.company_id}/projects/${this.project_id}`,
						{
							headers: {
								"include-project-users": true,
								"include-project-users-roles": true,
							},
						}
					)
				).data.data;

				this.project.attributes.users = response.attributes.users;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchProjectInvitations() {
			try {
				let response = (
					await axios.get(`projects/${this.project.id}/invitations`, {
						headers: {
							"status-id": "1",
						},
					})
				).data.data;

				if (this.project) this.project.pending = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

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
									deadline: bug.attributes.deadline?.slice(
										0,
										-1
									),
							  }
							: payload.changes.deadline === null
							? { deadline: null }
							: {
									deadline: payload.changes.deadline?.slice(
										0,
										-1
									),
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
				let screenshots = (await axios.get(`bugs/${id}/screenshots`))
					.data.data;

				for (const screenshot of screenshots) {
					// fetch each status bugs

					screenshot.attributes.base64 = atob(
						screenshot.attributes.base64
					);
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
				let attachments = (await axios.get(`bugs/${id}/attachments`))
					.data.data;

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
				let comments = (await axios.get(`bugs/${id}/comments`)).data
					.data;

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

		async createStatus(payload: {
			designation: string;
			order_number: number;
		}) {
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
					status.attributes.order_number >
					payload.changes.order_number
						? (status.attributes.order_number =
								payload.changes.order_number - 0.1)
						: (status.attributes.order_number =
								payload.changes.order_number + 0.1);
				}

				// let response =
				await axios.put(
					`projects/${this.project_id}/statuses/${status.id}`,
					{
						...(payload.changes?.designation
							? { designation: payload.changes.designation }
							: { designation: status.attributes.designation }),

						...(payload.changes?.order_number != null
							? { order_number: payload.changes.order_number }
							: {
									order_number: Math.round(
										status.attributes.order_number
									), // Math.round in case the status was moved before refresh finished
							  }),
					}
				);

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteStatus(payload: { id: string; move: string | undefined }) {
			try {
				await axios.delete(
					`projects/${this.project_id}/statuses/${payload.id}`,
					{
						headers: {
							...(payload.move ? { move: payload.move } : {}),
						},
					}
				);

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async sendProjectInvitation(payload: {
			email: string;
			role_id: number;
		}) {
			try {
				let response = await axios.post(
					`projects/${this.project.id}/invite`,
					{
						target_email: payload.email,
						role_id: payload.role_id,
					}
				);

				this.project.pending?.push(response.data.data);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteProjectInvitation(payload: { invitation_id: string }) {
			try {
				await axios.delete(`invitations/${payload.invitation_id}`);

				let index = this.project.pending?.findIndex(
					(x: any) => x.id === payload.invitation_id
				);

				if (index !== undefined && index !== -1)
					this.project.pending?.splice(index, 1);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async editProjectMember(payload: { user_id: number; role_id: number }) {
			try {
				let response = await axios.put(
					`projects/${this.project.id}/users/${payload.user_id}`,
					{
						role_id: payload.role_id,
					}
				);

				let user = this.project.attributes.users?.find(
					(x) => x.id === payload.user_id
				);

				if (user) user.role = response.data.data.role;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteProjectMember(payload: { user_id: number }) {
			try {
				await axios.delete(
					`projects/${this.project.id}/users/${payload.user_id}`
				);

				let index = this.project.attributes.users?.findIndex(
					(x) => x.id === payload.user_id
				);

				if (index !== undefined && index !== -1)
					this.project.attributes.users?.splice(index, 1);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async updateProject(payload: {
			designation: string;
			url: string;
			color_hex: string;
			base64: string;
		}) {
			try {
				await axios.put(
					`companies/${this.company.id}/projects/${this.project.id}`,
					{
						designation: payload.designation,
						url: payload.url,
						color_hex: payload.color_hex,
						base64: payload.base64,
					}
				);

				await this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteProject() {
			try {
				await axios.delete(
					`/companies/${this.project.attributes.company.id}/projects/${this.project.id}`
				);

				let projects = useMainStore().getProjectCompany(this.project.id)
					?.attributes.projects;

				if (projects) {
					projects.splice(
						projects.findIndex((x) => x.id === this.project.id),
						1
					);

					useMainStore().projects.delete(this.project.id);
				}
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},

	getters: {
		getProject: (state) => state.project,

		getStatuses: (state) =>
			state.project?.attributes?.statuses?.sort((a, b) =>
				a.attributes.order_number < b.attributes.order_number ? -1 : 1
			),

		getStatusById: (state) => (id: string) =>
			state.statuses?.find((x) => x.id === id),

		getBugById: (state) => (id: string) => {
			if (!state.statuses) return null;

			for (const status of state.statuses)
				for (const bug of status.attributes.bugs ?? [])
					if (bug.id === id) return bug;

			return null;
		},

		getBugsByStatusId: (state) => (id: string) => {
			let status = state.statuses?.find((x) => x.id === id);

			if (status) return status.attributes.bugs;
			else return [];
		},

		getFirstStatus: (state) => {
			if (state.statuses.length < 1) return null;

			return state.statuses?.find((x) => x.attributes.order_number === 0);
		},

		getProjectUsers: (state) => state.project?.attributes?.users ?? [],

		getCompanyUsers: (state) => state.company?.attributes?.users,

		getProjectCreator: (state) =>
			state.project?.attributes?.creator ?? undefined,

		getProjectPendingInvitations: (state) => state.project?.pending ?? [],
	},
});
