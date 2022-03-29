import axios from "axios";

export default {
	state: {
		companies: new Map(),
		projects: new Map(),

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

		SET_COMPANY_PROJECTS: (state, payload) => {
			state.companies.get(payload.id).projects = payload.list;
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
				throw error.response;
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
				throw error.response;
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
				throw error.response;
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

		getRoles: (state) => state.roles,

		getInvitations: (state) => state.invitations,

		getInvitationById: (state) => (invitation_id) =>
			state.invitations.get(invitation_id),
	},
};
