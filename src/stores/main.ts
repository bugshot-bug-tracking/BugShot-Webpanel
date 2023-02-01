import { defineStore } from "pinia";

import axios from "axios";
import nProgress from "nprogress";
import { Role } from "~/models/Role";
import { Organization } from "~/models/Organization";

export const useMainStore = defineStore("main", {
	state: () => ({
		roles: undefined as Role[] | undefined,

		organizations: undefined as Organization[] | undefined,
	}),

	actions: {
		async init() {
			try {
				nProgress.start();

				this.$reset();

				await this.fetchRoles();

				await this.initOrganizations();

				nProgress.done();
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
			let response = (await axios.get(`organizations`)).data.data;

			this.organizations = response;

			return response;
		},

		async createOrganization({ designation }: { designation: string }) {
			let response = (await axios.post("organizations", { designation })).data.data;

			this.addOrganization(response);
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

			item = organization;

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
	},
});
