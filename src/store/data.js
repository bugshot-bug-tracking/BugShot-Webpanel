import axios from "axios";

export default {
	state: {
		companies: new Map(),
		projects: new Map(),
	},

	mutations: {
		// mass assignment and replace (it needs to be a Map Object as payload)
		SET_COMPANIES: (state, payload) => {
			state.companies = payload;
		},
		SET_PROJECTS: (state, payload) => {
			state.projects = payload;
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

	},

	// api calls
	actions: {
		init: async (state, payload) => {
			await state.dispatch("fetchCompanies");
			await state.dispatch("fetchProjects");
			return true;
		},

		// fetch all companies that the logged user is associated with
		fetchCompanies: async (state) => {
			try {
				let companies = (await axios.get("user/companies")).data.data;

				// because i want to make a single mutation
				let coMap = new Map();
				for (const company of companies) {
					// used to determine if projects were fetched or not
					company["projects"] = null;

					coMap.set(company.company.id, company);
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
						await axios.get(
							`company/${company.company.id}/projects`
						)
					).data;

					// object with the list of projects for a company
					let cProj = {
						id: company.company.id,
						list: new Array(),
					};

					for (const project of projects) {
						// used to determine if bugs were fetched or not
						project["statuses"] = null;

						state.commit("SET_PROJECT", project);

						cProj.list.push(project.id);
					}

					state.commit("SET_COMPANY_PROJECTS", cProj);
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

	},
};
