import { defineStore } from "pinia";

import axios from "axios";
import { useMainStore } from "./main";

export const useProjectStore = defineStore("project", {
	state: () => ({
		project_id: null,
		project: null,

		statuses: [],
	}),

	actions: {
		async destroy() {
			this.project_id = null;
			this.project = null;
			this.statuses = [];

			return true;
		},

		async init(project_id) {
			this.destroy();

			this.project_id = project_id;

			await this.loadProject();
		},

		async refresh() {
			await this.loadProject();
		},

		async loadProject() {
			try {
				let main_project = useMainStore().getProjectById(
					this.project_id
				);

				if (!main_project) {
					console.log("Error while loading project!");
					return;
				}

				let project = (
					await axios.get(
						`companies/${main_project.attributes.company.id}/projects/${this.project_id}`,
						{
							headers: {
								"include-project-users": true,
								"include-statuses": true,
								"include-bugs": true,
							},
						}
					)
				).data.data;

				this.project = project;
				this.statuses = this.project.attributes.statuses;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async syncBug(payload) {
			try {
				//get a reference to the bug
				const bug = this.getBugById(payload.id);

				let response = await axios.put(
					`statuses/${bug.attributes.status_id}/bugs/${bug.id}`,
					{
						ai_id: bug.attributes.ai_id,
						designation: bug.attributes.designation,
						description: bug.attributes.description,
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
							? { deadline: bug.attributes.deadline.slice(0, -1) }
							: payload.changes.deadline === null
							? { deadline: null }
							: {
									deadline: payload.changes.deadline.slice(
										0,
										-1
									),
							  }),
					}
				);

				bug.attributes = response.data.data.attributes;

				console.log(bug);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchScreenshots(id) {
			let bug = this.getBugById(id);

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

				bug.screenshot = screenshots;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchAttachments(id) {
			let bug = this.getBugById(id);

			try {
				// fetch bug screenshots
				let attachments = (await axios.get(`bugs/${id}/attachments`))
					.data.data;

				bug.attachments = attachments;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchComments(id) {
			let bug = this.getBugById(id);

			try {
				// fetch bug screenshots
				let comments = (await axios.get(`bugs/${id}/comments`)).data
					.data;

				bug.comments = comments;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchBugUsers(id) {
			let bug = this.getBugById(id);

			try {
				// fetch bug screenshots
				let users = (await axios.get(`bugs/${id}/users`)).data.data;

				bug.users = users;
			} catch (error) {
				console.log(error);
			}
		},

		async createStatus(payload) {
			try {
				let r = await axios.post(
					`projects/${this.project_id}/statuses`,
					{
						designation: payload.designation,
						order_number: payload.order_number,
					}
				);

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async syncStatus(payload) {
			try {
				// get a reference to the status
				const status = this.getStatusById(payload.id);

				let response = await axios.put(
					`projects/${this.project_id}/statuses/${status.id}`,
					{
						...(payload.changes.designation
							? { designation: payload.changes.designation }
							: { designation: status.attributes.designation }),

						...(payload.changes.order_number != null
							? { order_number: payload.changes.order_number }
							: { order_number: status.attributes.order_number }),
					}
				);

				this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteStatus(payload) {
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
	},

	getters: {
		getProject: (state) => state.project,

		getStatuses: (state) =>
			state.project?.attributes.statuses.sort((a, b) =>
				a.attributes.order_number < b.attributes.order_number ? -1 : 1
			),

		getStatusById: (state) => (id) =>
			state.statuses?.find((x) => x.id === id),

		getBugById: (state) => (id) => {
			if (!state.statuses) return null;

			for (const status of state.statuses)
				for (const bug of status.attributes.bugs)
					if (bug.id === id) return bug;

			return null;
		},

		getBugsByStatusId: (state) => (id) => {
			let status = state.statuses?.find((x) => x.id === id);

			if (status) return status.attributes.bugs;
			else return [];
		},

		getFirstStatus: (state) => {
			if (state.statuses.length < 1) return null;

			return state.statuses?.find((x) => x.attributes.order_number === 0);
		},

		getProjectUsers: (state) => state.project?.attributes.users,
	},
});
