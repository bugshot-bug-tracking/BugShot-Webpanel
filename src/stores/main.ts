import { defineStore } from "pinia";

import axios from "axios";
import { Company } from "~/models/Company";

export const useMainStore = defineStore("main", {
	state: () => ({
		companies: new Map<String, Company>(),
		projects: new Map<String, String>(),

		roles: [],
	}),

	actions: {
		async destroy() {
			return true;
		},

		async init() {
			this.companies = new Map<String, Company>();
			this.projects = new Map<String, String>();

			await this.fetchAll();
			await this.fetchRoles();
		},

		async fetchAll() {
			try {
				let response = (
					await axios.get(`companies`, {
						headers: {
							// "include-company-image": "true",
							"include-projects": "true",
							"include-project-image": "true",
						},
					})
				).data.data;

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
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		// fetch all roles
		async fetchRoles() {
			try {
				let roles = (await axios.get("administration/roles")).data.data;

				this.roles = roles;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchCompanyUsers(id: string) {
			try {
				let response = (
					await axios.get(`companies/${id}`, {
						headers: {
							"include-company-users": "true",
						},
					})
				).data.data;

				let company = this.getCompanyById(id);
				company.attributes.users = response.attributes.users;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		// data is an object with the company id and new/old data
		async updateCompany(data: {
			id: string;
			designation: string;
			color_hex: string;
			base64: string;
		}) {
			try {
				//get a reference to the bug
				const company = this.companies.get(data.id);

				let response = (
					await axios.put(
						`companies/${company.id}`,
						{
							designation: data.designation,
							color_hex: data.color_hex,
							base64: data.base64,
						},
						{
							headers: {
								"include-company-image": "true",
							},
						}
					)
				).data.data;

				if (response.attributes.image != null)
					response.attributes.image.attributes.base64 = atob(
						response.attributes.image.attributes.base64
					);
				response.attributes.projects = company.attributes.projects;

				this.companies.set(data.id, response);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		// data is an object with the project id and new/old data
		async updateProject(data: {
			id: string;
			designation: string;
			url: string;
			color_hex: string;
			base64: string;
		}) {
			try {
				//get a reference to the bug
				const project = this.getProjectById(data.id);

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

				let company = this.getProjectCompany(project.id);

				console.log(company);

				company.attributes.projects[
					company.attributes.projects.findIndex(
						(x) => x.id === project.id
					)
				] = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteCompany(id: string) {
			try {
				await axios.delete(`/companies/${id}`);

				this.companies.delete(id);

				return true;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteProject(id: string) {
			try {
				const project = this.getProjectById(id);
				await axios.delete(
					`/companies/${project.attributes.company.id}/projects/${project.id}`
				);

				let projects = this.getProjectCompany(id).attributes.projects;

				projects.splice(
					projects.findIndex((x) => x.id === id),
					1
				);

				this.projects.delete(id);

				return true;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},

	getters: {
		getCompanies: (state) => state.companies,

		getCompanyById: (state) => (id: string) => state.companies.get(id),

		getCompanyProjects: (state) => (id: string) =>
			state.companies.get(id)?.attributes.projects || [],

		getProjectById: (state) => (id: string) =>
			state.companies
				.get(state.projects.get(id))
				?.attributes.projects?.find((x) => x.id === id),

		getProjectCompany: (state) => (id: string) =>
			state.companies.get(state.projects.get(id)),

		getRoles: (state) => state.roles,
	},
});
