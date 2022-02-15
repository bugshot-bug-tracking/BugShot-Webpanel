import axios from "axios";

export default {
	state: {
		companies: new Map(),
		projects: new Map(),
		statuses: new Map(),
		bugs: new Map(),

		roles: new Map(), // all the possible roles
		invitations: new Map(),
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

		SET_ROLES: (state, payload) => {
			state.roles = payload;
		},

		SET_INVITATIONS: (state, payload) => {
			state.invitations = payload;
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

		SET_INVITATION: (state, payload) => {
			state.invitations.set(payload.id, payload);
		},

		REMOVE_INVITATION: (state, payload) => {
			state.invitations.delete(payload);
		},

		SET_COMPANY_USERS: (state, payload) => {
			const company = state.companies.get(payload.id);
			company.users = payload.users;
		},

		SET_PROJECT_USERS: (state, payload) => {
			const project = state.projects.get(payload.id);
			project.users = payload.users;
		},

		UPDATE_COMPANY: (state, payload) => {
			const company = state.companies.get(payload.id);
			company.attributes = payload.attributes;
		},

		UPDATE_PROJECT: (state, payload) => {
			const project = state.projects.get(payload.id);
			project.attributes = payload.attributes;
		},

		DELETE_COMPANY: (state, id) => {
			state.companies.delete(id);
		},

		DELETE_PROJECT: (state, id) => {
			const project = state.projects.get(id);
			const company = state.companies.get(project.attributes.company.id);

			company.projects.splice(
				company.projects.findIndex((x) => x === project.id),
				1
			);

			state.projects.delete(id);
		},
	},

	// api calls
	actions: {
		init: async (state, payload) => {
			await state.dispatch("fetchCompanies");
			await state.dispatch("fetchProjects");
			await state.dispatch("fetchRoles");
			await state.dispatch("fetchInvitations");
			return true;
		},

		data_destroy: async (state, payload) => {
			state.commit("SET_COMPANIES", new Map());
			state.commit("SET_PROJECTS", new Map());
			state.commit("SET_STATUSES", new Map());
			state.commit("SET_BUGS", new Map());
			state.commit("SET_ROLES", new Map());
			state.commit("SET_INVITATIONS", new Map());
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

		fetchCompany: async (state, copany_id) => {
			try {
				let company = (await axios.get(`companies/${copany_id}`)).data
					.data;

				company["projects"] = null;

				if (company.attributes.image != null)
					company.attributes.image.attributes.base64 = atob(
						company.attributes.image.attributes.base64
					);

				state.commit("SET_COMPANY", company);
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
								"include-project-image": "true",
							},
						})
					).data.data;

					// object with the list of projects for a company
					let cProj = {
						id: company.id,
						list: new Array(),
					};
					for (const project of projects) {
						// used to determine if bugs were fetched or not
						project["statuses"] = null;

						if (
							project.attributes.image != null &&
							project.attributes.image.attributes
						)
							project.attributes.image.attributes.base64 = atob(
								project.attributes.image.attributes.base64
							);
						else project.attributes.image = null;

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
				let roles = (await axios.get("administration/roles")).data.data;

				for (const role of roles) {
					state.commit("SET_ROLE", role);
				}
			} catch (error) {
				console.log(error);
			}
		},

		// fetch all invitations
		fetchInvitations: async (state) => {
			try {
				let roles = (
					await axios.get(
						`users/${state.getters.getUser.id}/invitations`
					)
				).data.data;

				for (const role of roles) {
					state.commit("SET_INVITATION", role);
				}
			} catch (error) {
				console.log(error);
			}
		},

		fetchCompanyUsers: async (state, company_id) => {
			try {
				let newCompany = (
					await axios.get(`companies/${company_id}`, {
						headers: {
							"include-company-users": "true",
						},
					})
				).data.data;

				state.commit("SET_COMPANY_USERS", {
					id: company_id,
					users: newCompany.attributes.users,
				});
			} catch (error) {
				console.log(error);
			}
		},

		fetchProjectUsers: async (state, id) => {
			try {
				const project = state.state.projects.get(id);

				let newProject = (
					await axios.get(
						`companies/${project.attributes.company.id}/projects/${id}`,
						{
							headers: {
								"include-project-users": "true",
							},
						}
					)
				).data.data;

				state.commit("SET_PROJECT_USERS", {
					id: id,
					users: newProject.attributes.users,
				});
			} catch (error) {
				console.log(error);
			}
		},

		syncBug: async (state, bug_id) => {
			try {
				//get a refference to the bug
				const bug = state.state.bugs.get(bug_id);

				await axios.put(
					`statuses/${bug.attributes.status_id}/bugs/${bug.id}`,
					{
						project_id: bug.attributes.project_id,
						ai_id: bug.attributes.ai_id,
						designation: bug.attributes.designation,
						description: bug.attributes.description,
						url: bug.attributes.url,
						status_id: bug.attributes.status_id,
						order_number: bug.attributes.order_number,
						priority_id: bug.attributes.priority.id,
						operating_system: bug.attributes.operating_system,
						browser: bug.attributes.browser,
						selector: bug.attributes.selector,
						resolution: bug.attributes.resolution,
						...(bug.attributes.deadline
							? {
									deadline: new Date(bug.attributes.deadline)
										.toISOString()
										.slice(0, -1),
							  }
							: {}),
					}
				);
			} catch (error) {
				console.log(error);
			}
		},

		// data is an object with the company id and new/old data
		updateCompany: async (state, data) => {
			try {
				//get a refference to the bug
				const company = state.state.companies.get(data.company_id);

				let response = (
					await axios.put(`companies/${company.id}`, {
						designation: data.designation,
						color_hex: data.color_hex,
						base64: data.base64,
					})
				).data.data;

				state.commit("UPDATE_COMPANY", response);
			} catch (error) {
				console.log(error);
			}
		},

		deleteCompany: async (state, company_id) => {
			try {
				const company = state.state.companies.get(company_id);

				let response = await axios.delete(`/companies/${company.id}`);

				state.commit("DELETE_COMPANY", company_id);

				return true;
			} catch (error) {
				console.log(error);
				throw error.response;
			}
		},

		// data is an object with the project id and new/old data
		updateProject: async (state, data) => {
			try {
				//get a refference to the bug
				const project = state.state.projects.get(data.id);

				let response = (
					await axios.put(
						`companies/${project.attributes.company.id}/projects/${project.id}`,
						{
							designation: data.designation,
							url: data.url,
							color_hex: data.color_hex,
							base64: data.base64,
						}
						// {
						// 	headers: {
						// 		"include-project-image": "true",
						// 	},
						// }
					)
				).data.data;

				let image = (await axios.get(`projects/${project.id}/image`))
					.data.data;

				if (image != null && image.attributes)
					image.attributes.base64 = atob(image.attributes.base64);
				else image = null;

				response.attributes.image = image;

				state.commit("UPDATE_PROJECT", response);
			} catch (error) {
				console.log(error);
			}
		},

		deleteProject: async (state, project_id) => {
			try {
				const project = state.state.projects.get(project_id);

				await axios.delete(
					`/companies/${project.attributes.company.id}/projects/${project.id}`
				);

				state.commit("DELETE_PROJECT", project_id);

				return true;
			} catch (error) {
				console.log(error);

				return false;
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

		getInvitations: (state) => state.invitations,

		getInvitationById: (state) => (invitation_id) =>
			state.invitations.get(invitation_id),
	},
};
