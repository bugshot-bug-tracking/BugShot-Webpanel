import { defineStore } from "pinia";

import axios from "axios";
import { Role } from "~/models/Role";
import { Organization } from "~/models/Organization";
import { useAuthStore } from "./auth";

export const useMainStore = defineStore("main", {
	state: () => ({
		roles: undefined as Role[] | undefined,

		organizations: undefined as Organization[] | undefined,

		organizationsWithCompaniesAndProjects: undefined as Organization[] | undefined,
	}),

	actions: {
		async init() {
			try {
				this.$reset();

				await this.fetchRoles();

				await this.initOrganizations();
			} catch (error) {
				console.log(error);
				throw error;
			}

			return true;
		},

		async initAll() {
			try {
				this.organizationsWithCompaniesAndProjects = undefined;

				await this.initOrganizationsWithCompaniesAndProjects();
			} catch (error) {
				console.log(error);
				throw error;
			}

			return true;
		},

		async fetchRoles() {
			let roles = (await axios.get("administration/roles")).data.data;

			this.roles = roles;

			return roles;
		},

		async initOrganizations() {
			let response = (
				await axios.get(`organizations`, {
					headers: {
						"include-organization-role": true,
					},
				})
			).data.data;

			this.organizations = response;

			return response;
		},

		async initOrganizationsWithCompaniesAndProjects() {
			let response = (
				await axios.get(`organizations`, {
					headers: {
						"include-organization-role": true,
						"include-company-role": true,
						"include-project-role": true,
						"include-companies": true,
						"include-projects": true,
						"include-project-image": true,
					},
				})
			).data.data;

			this.organizationsWithCompaniesAndProjects = response;

			return response;
		},

		async createOrganization({ designation }: { designation: string }) {
			let response = (await axios.post("organizations", { designation })).data.data;

			this.addOrganization(response);

			this.message.success(this.i18n.t("messages.organization_created"));
			return response;
		},

		/**
		 * Add an organization to local store
		 */
		addOrganization(organization: Organization) {
			if (!this.organizations) this.organizations = [] as Organization[];

			return this.organizations.push(organization);
		},

		/**
		 * Update an organization in local store
		 */
		updateOrganization(organization: Organization) {
			if (!this.organizations) return false;

			let item = this.organizations?.find((x) => x.id === organization.id);

			if (!item) return false;

			Object.assign(item.attributes, organization.attributes);

			return true;
		},

		/**
		 * Remove an organization from local store
		 */
		removeOrganization(id: string) {
			if (!this.organizations) return true;

			let index = this.organizations?.findIndex((x) => x.id === id);

			if (index === -1) return true;

			this.organizations.splice(index, 1);

			if (this.organizations.length === 0) this.organizations = undefined;
		},
	},

	getters: {
		getRoles: (state) => state.roles,

		getOrganizations: (state) => state.organizations,

		getOrganizationById: (state) => (id: string) =>
			state.organizations?.find((x) => x.id === id),

		getMyOrganization: (state) => {
			if (state.organizations)
				return state.organizations?.find(
					(o) => o.attributes.creator?.id === useAuthStore().user?.id
				);

			if (state.organizationsWithCompaniesAndProjects)
				return state.organizationsWithCompaniesAndProjects?.find(
					(o) => o.attributes.creator?.id === useAuthStore().user?.id
				);
		},

		getMyOrganizations: (state) => {
			if (state.organizations)
				return state.organizations?.filter(
					(o) => o.attributes.creator?.id === useAuthStore().user?.id
				);

			if (state.organizationsWithCompaniesAndProjects)
				return state.organizationsWithCompaniesAndProjects?.filter(
					(o) => o.attributes.creator?.id === useAuthStore().user?.id
				);
		},

		getExternalOrganizations: (state) => {
			if (state.organizations)
				return state.organizations?.filter(
					(o) => o.attributes.creator?.id !== useAuthStore().user?.id
				);

			if (state.organizationsWithCompaniesAndProjects)
				return state.organizationsWithCompaniesAndProjects?.filter(
					(o) => o.attributes.creator?.id !== useAuthStore().user?.id
				);
		},
		getAllOrganizations: (state) => {
			return state.organizationsWithCompaniesAndProjects;
		},
	},
});
