import { defineStore } from "pinia";

import axios from "axios";

export const useMainStore = defineStore("main", {
	state: () => ({
		companies: new Map(),
		projects: new Map(),

		roles: [],
	}),

	actions: {
		async destroy() {
			return true;
		},

		async init() {
			this.companies = new Map();
			this.projects = new Map();

			await this.fetchAll();
			await this.fetchRoles();
		},

		async fetchAll() {
			try {
				let response = await axios.get(`companies`, {
					headers: {
						"include-image": "true",
						"include-projects": "true",
						"include-project-image": "true",
					},
				});

				response = response.data.data;

				for (const company of response) {
					if (company.attributes.image != null)
						company.attributes.image.attributes.base64 = atob(
							company.attributes.image.attributes.base64
						);
					this.companies.set(company.id, company);

					for (const project of company.attributes.projects) {
						if (
							project.attributes.image != null &&
							project.attributes.image.attributes
						)
							project.attributes.image.attributes.base64 = atob(
								project.attributes.image.attributes.base64
							);
						else project.attributes.image = null;

						// leave the data in the company object but create a mop of where it is so its easier to access later
						this.projects.set(project.id, company.id);
					}
				}

				console.log(response);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		// fetch all roles
		async fetchRoles() {
			try {
				let roles = (await axios.get("administration/roles")).data.data;

				//! remove when the API is fixed
				roles = [
					{
						id: 3,
						type: "Role",
						attributes: {
							designation: "Manager",
						},
					},
					{
						id: 4,
						type: "Role",
						attributes: {
							designation: "Developer",
						},
					},
					{
						id: 5,
						type: "Role",
						attributes: {
							designation: "Client",
						},
					},
				];

				this.roles = roles;
			} catch (error) {
				console.log(error);
			}
		},
	},

	getters: {},
});
