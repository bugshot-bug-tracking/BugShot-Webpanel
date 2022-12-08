import { defineStore } from "pinia";

import axios from "axios";
import { useMainStore } from "./main";
import { Organization } from "~/models/Organization";
import { Invitation } from "~/models/Invitation";
import { OrganizationUserRole } from "~/models/OrganizationUserRole";
import { Company } from "~/models/Company";
import { useSettingsStore } from "./settings";

export const useOrganizationStore = defineStore("organization", {
	state: () => ({
		organization_id: undefined as string | undefined,
		organization: undefined as Organization | undefined,

		members: undefined as OrganizationUserRole[] | undefined,
		pendingInvitations: undefined as Invitation[] | undefined,

		companies: undefined as Company[] | undefined,

		member: undefined as OrganizationUserRole | undefined,
	}),

	actions: {
		async destroy() {
			this.organization_id = undefined;
			this.organization = undefined;
			this.members = undefined;
			this.pendingInvitations = undefined;
			this.companies = undefined;

			return true;
		},

		async init(id: string) {
			try {
				this.destroy();

				this.organization_id = id;

				await this.load();

				await this.fetchUsers();

				await this.fetchCompanies();

				useSettingsStore().setPreferredOrganization(id);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async refresh() {
			try {
				await this.load();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async load() {
			let response = (
				await axios.get(`organizations/${this.organization_id}`, {
					headers: {
						"include-organization-role": true,
					},
				})
			).data.data;

			this.organization = response;
		},

		async updateResource(payload: { designation: string }) {
			let response = (
				await axios.put(`organizations/${this.organization_id}`, {
					designation: payload.designation,
				})
			).data.data;

			useMainStore().updateOrganization(response);

			await this.refresh();
		},

		async deleteResource() {
			// if an id was not set return
			if (this.organization_id === undefined) return;

			await axios.delete(`organizations/${this.organization_id}`);

			useMainStore().removeOrganization(this.organization_id);
		},

		async fetchUsers() {
			let response = (
				await axios.get(`organizations/${this.organization_id}/users`, {
					headers: {
						"include-organization-role": true,
						"include-users-organization-role": true,
						"include-users-companies": true,
						"include-users-company-role": true,
					},
				})
			).data.data;

			this.members = response;
		},

		async fetchPendingInvitations() {
			let response = (
				await axios.get(`organizations/${this.organization_id}/invitations`, {
					headers: {
						"status-id": 1,
					},
				})
			).data.data;

			this.pendingInvitations = response;
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			let response = (
				await axios.post(`organizations/${this.organization_id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			if (!this.pendingInvitations) this.pendingInvitations = [] as Invitation[];
			this.pendingInvitations.push(response);
		},

		async deleteInvitation(payload: { invitation_id: string }) {
			await axios.delete(`invitations/${payload.invitation_id}`);

			let index = this.pendingInvitations?.findIndex(
				(x: any) => x.id === payload.invitation_id
			);

			if (index !== undefined && index !== -1) this.pendingInvitations!.splice(index, 1);
		},

		async editMember(payload: { user_id: number; role_id: number }) {
			let response = (
				await axios.put(`organizations/${this.organization_id}/users/${payload.user_id}`, {
					role_id: payload.role_id,
				})
			).data.data;

			let user = this.members?.find((x) => x.user.id === payload.user_id);

			if (user) user.role = response.role;
		},

		async deleteMember(payload: { user_id: number }) {
			await axios.delete(`organizations/${this.organization_id}/users/${payload.user_id}`);

			let index = this.members?.findIndex((x) => x.user.id === payload.user_id);

			if (index !== undefined && index !== -1) this.members!.splice(index, 1);
		},

		async fetchCompanies() {
			let response = (
				await axios.get(`organizations/${this.organization_id}/companies`, {
					headers: {
						"include-company-role": "true",
						"include-company-image": "true",
						"include-projects": "true",
						"include-project-image": "true",
					},
				})
			).data.data;

			this.companies = response;
		},

		async createCompany({
			designation,
			base64,
			color_hex,
		}: {
			designation: string;
			base64: string | undefined;
			color_hex: string;
		}) {
			let response = (
				await axios.post(
					`organizations/${this.organization_id}/companies`,
					{
						designation,
						base64,
						color_hex,
					},
					{
						headers: {
							"include-company-role": "true",
							"include-company-image": "true",
							"include-projects": "true",
							"include-project-image": "true",
						},
					}
				)
			).data.data;

			this.addCompany(response);

			return response;
		},

		/**
		 * Add an company to local store
		 */
		addCompany(company: Company) {
			if (!this.companies) this.companies = [] as Company[];

			return this.companies.push(company);
		},

		/**
		 * Update an company in local store
		 */
		updateCompany(company: Company) {
			if (!this.companies) return false;

			let item = this.companies?.find((x) => x.id === company.id);

			if (!item) return false;

			Object.assign(item.attributes, company.attributes);

			return true;
		},

		/**
		 * Remove an company from local store
		 */
		removeCompany(id: string) {
			if (!this.companies) return true;

			let index = this.companies?.findIndex((x) => x.id === id);

			if (index === -1) return true;

			this.companies.splice(index, 1);

			if (this.companies.length === 0) this.companies = undefined;

			return true;
		},

		async fetchMember(id: number) {
			this.member = undefined;

			let response = (
				await axios.get(`organizations/${this.organization_id}/users/${id}`, {
					headers: {
						"include-users-company-role": true,
						"include-users-companies": true,
						"include-users-projects": true,
					},
				})
			).data.data;

			this.member = response;
		},
	},

	getters: {
		getOrganization: (state) => state.organization,

		getMembers: (state) =>
			state.members?.map((x) => {
				x.user.role = x.role;
				x.user.subscription = x.subscription;
				return x.user;
			}),

		getCreator: (state) => state.organization?.attributes?.creator,

		getPendingInvitations: (state) => state.pendingInvitations,

		getCompanies: (state) => state.companies,

		getCompanyProjects: (state) => (id: string) =>
			state.companies?.find((x) => x.id === id)?.attributes.projects,

		getOrganizationMember: (state) => (user_id: number) => {
			if (user_id === state.organization?.attributes.creator.id) {
				let creator = state.organization.attributes.creator;
				creator.subscription = null; //TODO resolve this somehow to be the creator subscription

				return creator;
			}

			let resource = state.members?.find((x) => x.user.id === user_id);

			if (!resource) return undefined;

			resource.user.subscription = resource.subscription;

			return resource.user;
		},

		getCompanyById: (state) => (id: string) => state.companies?.find((x) => x.id === id),

		getMemberCompanies: (state) => (id: number) => {
			if (id === state.organization?.attributes.creator.id) return state.companies;

			let entry = state.members?.find((x) => x.user.id === id);
			if (!entry) return undefined;

			return entry.companies?.map((x) => {
				x.company.attributes.role = x.role;
				return x.company;
			});
		},
	},
});
