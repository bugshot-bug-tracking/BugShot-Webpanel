import { defineStore } from "pinia";

import axios from "axios";
import { Company } from "~/models/Company";
import nProgress from "nprogress";
import { Role } from "~/models/Role";
import { Organization } from "~/models/Organization";

export const useMainStore = defineStore("main", {
	state: () => ({
		roles: [] as Role[],

		organizations: undefined as Organization[] | undefined,

		companies: new Map<String, Company>(),
		projects: new Map<String, String>(),
	}),

	actions: {
		async destroy() {
			this.companies = new Map<String, Company>();
			this.projects = new Map<String, String>();

			return true;
		},

		async init() {
			await this.destroy();

			nProgress.start();

			await this.fetchAll();
			await this.fetchRoles();

			nProgress.done();
		},

		async initOrganizations() {
			let response = (await axios.get(`organizations`)).data.data;

			this.organizations = response;

			return response;
		},

		async fetchAll() {
			let response = (
				await axios.get(`companies`, {
					headers: {
						// "include-company-image": "true",
						"include-projects": "true",
						"include-project-image": "true",
						"include-company-role": "true",
						"include-project-role": "true",
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
					if (project.attributes.image != null && project.attributes.image.attributes)
						project.attributes.image.attributes.base64 = atob(
							project.attributes.image.attributes.base64
						);
					else project.attributes.image = null;

					// leave the data in the company object but create a map of where it is so its easier to access later
					this.projects.set(project.id, company.id);
				}
			}
		},

		async fetchRoles() {
			let roles = (await axios.get("administration/roles")).data.data;

			this.roles = roles;

			return roles;
		},

		/**
		 * @deprecated Since version 1.2.6. If possible use company store. Will be removed in the near future
		 */
		async fetchCompanyUsers(id: string) {
			try {
				let response = (
					await axios.get(`companies/${id}`, {
						headers: {
							"include-company-users": "true",
							"include-company-users-roles": "true",
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

		/**
		 * @deprecated Since version 1.2.6. If possible use company store. Will be removed in the near future
		 */
		async fetchCompanyInvitations(id: string) {
			try {
				console.log(id);
				let response = (
					await axios.get(`companies/${id}/invitations`, {
						headers: {
							"status-id": "1",
						},
					})
				).data.data;

				let company = this.companies.get(id);

				if (company) company.pending = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 * @deprecated Since version 1.2.6. If possible use company store. Will be removed in the near future
		 */
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

		/**
		 * @deprecated Since version 1.2.6. If possible use project store. Will be removed in the near future
		 */
		// data is an object with the project id and new/old data
		async updateProject(data: {
			id: string;
			designation: string;
			url: string;
			color_hex: string;
			base64: string | null;
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

				let image = (await axios.get(`projects/${project.id}/image`)).data.data;

				if (image != null && image.attributes)
					image.attributes.base64 = atob(image.attributes.base64);
				else image = null;

				response.attributes.image = image;

				let company = this.getProjectCompany(project.id);

				console.log(company);

				company.attributes.projects[
					company.attributes.projects.findIndex((x) => x.id === project.id)
				] = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 * @deprecated Since version 1.2.6. If possible use company store. Will be removed in the near future
		 */
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

		/**
		 * @deprecated Since version 1.2.6. If possible use project store. Will be removed in the near future
		 */
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

		/**
		 * @deprecated Since version 1.2.6. If possible use company store. Will be removed in the near future
		 */
		async removeCompanyUser(company_id: string, user_id: number) {
			try {
				await axios.delete(`companies/${company_id}/users/${user_id}`);

				this.companies.delete(company_id);

				return true;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 * @deprecated Since version 1.2.6. If possible use project store. Will be removed in the near future
		 */
		async removeProjectUser(project_id: string, user_id: number) {
			try {
				await axios.delete(`projects/${project_id}/users/${user_id}`);

				let projects = this.getProjectCompany(project_id).attributes.projects;

				projects.splice(
					projects.findIndex((x) => x.id === project_id),
					1
				);

				this.projects.delete(project_id);

				return true;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 * Add an organization to local store
		 */
		async addOrganization(organization: Organization) {
			if (!this.organizations) this.organizations = [] as Organization[];

			return this.organizations.push(organization);
		},

		/**
		 * Remove an organization from local store
		 */
		async removeOrganization(id: string) {
			if (!this.organizations) return true;

			let index = this.organizations?.findIndex((x) => x.id === id);

			if (index === -1) return true;

			this.organizations.splice(index, 1);
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

		getProjectCompany: (state) => (id: string) => state.companies.get(state.projects.get(id)),

		getRoles: (state) => state.roles,

		getProjectsCount: (state) => state.projects.size,

		getOrganizations: (state) => state.organizations,

		getOrganizationById: (state) => (id: string) =>
			state.organizations?.find((x) => x.id === id),
	},
});
