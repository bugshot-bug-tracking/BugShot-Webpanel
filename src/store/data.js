import axios from "axios";

export default {
	state: {
		companies: new Map(),
		projects: new Map(),
		statuses: new Map(),
		bugs: new Map(),

		roles: new Map(), // all the possible roles
	},

	mutations: {
		// mass assignment and replace (it needs to be a Map Object as payload)
		SET_COMPANIES: (state, payload) => {
			state.companies = payload;
		},
		SET_PROJECTS: (state, payload) => {
			state.projects = payload;
		},
		SET_STATUSES: (state, payload) => {
			state.statuses = payload;
		},
		SET_BUGS: (state, payload) => {
			state.bugs = payload;
		},

		// single assignment of payload, payload needs a root id property
		SET_COMPANY: (state, payload) => {
			state.companies.set(payload.id, payload);
		},
		SET_PROJECT: (state, payload) => {
			state.projects.set(payload.id, payload);
		},
		SET_STATUS: (state, payload) => {
			state.statuses.set(payload.id, payload);
		},
		SET_BUG: (state, payload) => {
			state.bugs.set(payload.id, payload);
		},

		SET_COMPANY_PROJECTS: (state, payload) => {
			state.companies.get(payload.id).projects = payload.list;
		},

		SET_BUG_SCREENSHOT: (state, payload) => {
			state.bugs.get(payload.id).screenshots = payload.list;
		},

		SET_BUG_ATTACHMENTS: (state, payload) => {
			state.bugs.get(payload.id).attachments = payload.list;
		},

		SET_BUG_COMMENTS: (state, payload) => {
			state.bugs.get(payload.id).comments = payload.list;
		},
		SET_ROLE: (state, payload) => {
			state.roles.set(payload.id, payload);
		},
	},

	// api calls
	actions: {
		init: async (state, payload) => {
			await state.dispatch("fetchCompanies");
			await state.dispatch("fetchProjects");
			await state.dispatch("fetchRoles");
			return true;
		},

		// fetch all companies that the logged user is associated with
		fetchCompanies: async (state) => {
			try {
				let companies = (
					await axios.get("companies", {
						headers: {
							"include-image": "true",
						},
					})
				).data.data;

				// because i want to make a single mutation
				let coMap = new Map();
				for (const company of companies) {
					// used to determine if projects were fetched or not
					company["projects"] = null;
					console.log(company);
					if (company.attributes.image != null)
						company.attributes.image.attributes.base64 = atob(
							company.attributes.image.attributes.base64
						);
					coMap.set(company.id, company);
				}

				state.commit("SET_COMPANIES", coMap);
			} catch (error) {
				console.log(error);
			}
		},

		// fetch all the projects that are a part of the companies already in memory and set the project property on each company record to a list of projects id's relative to the project Map
		fetchProjects: async (state) => {
			try {
				for (const company of state.state.companies.values()) {
					let projects = (
						await axios.get(`companies/${company.id}/projects`, {
							headers: {
								"include-image": "true",
							},
						})
					).data.data;

					console.log(projects);

					// object with the list of projects for a company
					let cProj = {
						id: company.id,
						list: new Array(),
					};
					for (const project of projects) {
						// used to determine if bugs were fetched or not
						project["statuses"] = null;

						if (project.attributes.image != null)
							project.attributes.image.attributes.base64 = atob(
								project.attributes.image.attributes.base64
							);

						state.commit("SET_PROJECT", project);

						cProj.list.push(project.id);
					}

					state.commit("SET_COMPANY_PROJECTS", cProj);
				}
			} catch (error) {
				console.log(error);
			}
		},

		fetchBugs: async (state, project_id) => {
			try {
				//get a refference to the project
				const project = state.state.projects.get(project_id);
				project.statuses = new Array();

				// fetch the project statuses
				let statuses = (
					await axios.get(`projects/${project_id}/statuses`)
				).data.data;

				for (const status of statuses) {
					// fetch each status bugs
					let bugs = (
						await axios.get(`statuses/${status.id}/bugs`, {
							headers: {
								"include-owner": "true",
								"include-bug-users": "true",
							},
						})
					).data.data;

					// set the status bugs array to store bug id's
					status["bugs"] = new Array();

					for (const bug of bugs) {
						// prepare space for bug additional contents
						bug["screenshots"] = new Array();
						bug["attachments"] = new Array();
						bug["comments"] = new Array();

						// add the bug id to the status array
						status.bugs.push(bug.id);

						// store the bug in memory
						state.commit("SET_BUG", bug);
					}

					// store the status in memory
					state.commit("SET_STATUS", status);

					// add the status id to the project array
					project.statuses.push(status.id);
				}
			} catch (error) {
				console.log(error);
			}
		},

		fetchScreenshots: async (state, bug_id) => {
			try {
				// fetch bug screenshots
				let screenshots = (
					await axios.get(`bugs/${bug_id}/screenshots`)
				).data.data;

				for (const screenshot of screenshots) {
					// fetch each status bugs
					console.log(screenshot);
					screenshot.attributes.base64 = atob(
						screenshot.attributes.base64
					);
				}

				// store the status in memory
				state.commit("SET_BUG_SCREENSHOT", {
					id: bug_id,
					list: screenshots,
				});
			} catch (error) {
				console.log(error);
			}
		},

		fetchAttachments: async (state, bug_id) => {
			try {
				// fetch bug screenshots
				let attachments = (
					await axios.get(`bugs/${bug_id}/attachments`)
				).data.data;

				// store the status in memory
				state.commit("SET_BUG_ATTACHMENTS", {
					id: bug_id,
					list: attachments,
				});
			} catch (error) {
				console.log(error);
			}
		},

		fetchComments: async (state, bug_id) => {
			try {
				// fetch bug screenshots
				let comments = (await axios.get(`bugs/${bug_id}/comments`)).data
					.data;

				// store the status in memory
				state.commit("SET_BUG_COMMENTS", {
					id: bug_id,
					list: comments,
				});
			} catch (error) {
				console.log(error);
			}
		},

		refetchProjectStatus: async (state, status_id) => {
			try {
				//get a refference to the status
				const status = state.state.statuses.get(status_id);

				// fetch each status bugs
				let bugs = (await axios.get(`statuses/${status_id}/bugs`)).data
					.data;

				// set the status bugs array to store bug id's
				status["bugs"] = new Array();

				for (const bug of bugs) {
					// prepare space for bug additional contents
					bug["screenshots"] = new Array();
					bug["attachments"] = new Array();
					bug["comments"] = new Array();

					// add the bug id to the status array
					status.bugs.push(bug.id);

					// store the bug in memory
					state.commit("SET_BUG", bug);
				}

				// store the status in memory
				state.commit("SET_STATUS", status);
			} catch (error) {
				console.log(error);
			}
		},

		// fetch all roles
		fetchRoles: async (state) => {
			try {
				let roles = (await axios.get("roles")).data.data;

				for (const role of roles) {
					state.commit("SET_ROLE", role);
				}
			} catch (error) {
				console.log(error);
			}
		},
	},

	getters: {
		getCompanies: (state) => state.companies,

		getCompanyById: (state) => (company_id) =>
			state.companies.get(company_id),

		getCompanyWithProjects: (state) =>
			[...state.companies]
				.filter((record) => record[1].projects?.length > 0)
				.map((r) => r[1]),

		getCompanyProjects: (state) => (company_id) =>
			state.companies
				.get(company_id)
				.projects?.map((project_id) => state.projects.get(project_id)),

		getProjectById: (state) => (project_id) => {
			// null if no project exists
			if (state.projects.size === 0) return null;

			// undefined if no match exists
			return state.projects.get(project_id);
		},

		getProjectStatuses: (state) => (project_id) => {
			const project = state.projects.get(project_id);

			// null if no status exists
			if (project.statuses.size === 0) return null;

			return project.statuses.map((status_id) =>
				state.statuses.get(status_id)
			);
		},

		getStatusBugs: (state) => (status_id) => {
			const status = state.statuses.get(status_id);

			// null if no status exists
			if (status.bugs.size === 0) return null;

			return status.bugs.map((bug_id) => state.bugs.get(bug_id));
		},

		getStatusById: (state) => (status_id) => state.statuses.get(status_id),

		getBugById: (state) => (bug_id) => state.bugs.get(bug_id),

		getRoles: (state) => state.roles,
	},
};
