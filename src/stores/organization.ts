import { defineStore } from "pinia";

import axios from "axios";
import { useMainStore } from "./main";
import { Organization } from "~/models/Organization";
import { Invitation } from "~/models/Invitation";
import { OrganizationUserRole } from "~/models/OrganizationUserRole";
import { Company } from "~/models/Company";

export const useOrganizationStore = defineStore("organization", {
	state: () => ({
		organization_id: undefined as string | undefined,
		organization: undefined as Organization | undefined,

		members: undefined as OrganizationUserRole[] | undefined,
		pendingInvitations: undefined as Invitation[] | undefined,

		companies: undefined as Company[] | undefined,
	}),

	actions: {
		async destroy() {
			this.organization = undefined;

			return true;
		},

		async init(id: string) {
			this.destroy();

			this.organization_id = id;

			await this.load();

			await this.fetchUsers();

			await this.fetchCompanies();
		},

		async refresh() {
			await this.load();
		},

		async load() {
			try {
				let response = (await axios.get(`organizations/${this.organization_id}`)).data.data;

				this.organization = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchUsers() {
			let response = (
				await axios.get(`organizations/${this.organization_id}/users`, {
					headers: {
						"include-organization-role": true,
					},
				})
			).data.data;

			this.members = response;
		},

		async createOrganization({ designation }: { designation: string }) {
			let response = await axios.post("organizations", { designation });

			useMainStore().addOrganization(response.data.data);
		},

		async deleteOrganization() {
			// if an id was not set return
			// if (this.organization_id ?? "" === "") return;
			if (this.organization_id === undefined) return;

			try {
				await axios.delete(`organizations/${this.organization_id}`);

				useMainStore().removeOrganization(this.organization_id);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchPendingInvitations() {
			try {
				let response = (
					await axios.get(`organizations/${this.organization_id}/invitations`, {
						headers: {
							"status-id": 1,
						},
					})
				).data.data;

				this.pendingInvitations = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			try {
				let response = await axios.post(`organizations/${this.organization_id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				});

				if (!this.pendingInvitations) this.pendingInvitations = [] as Invitation[];
				this.pendingInvitations.push(response.data.data);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteInvitation(payload: { invitation_id: string }) {
			try {
				await axios.delete(`invitations/${payload.invitation_id}`);

				let index = this.pendingInvitations?.findIndex(
					(x: any) => x.id === payload.invitation_id
				);

				if (index !== undefined && index !== -1) this.pendingInvitations!.splice(index, 1);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async editMember(payload: { user_id: number; role_id: number }) {
			try {
				let response = await axios.put(
					`organizations/${this.organization_id}/users/${payload.user_id}`,
					{
						role_id: payload.role_id,
					}
				);

				let user = this.members?.find((x) => x.user.id === payload.user_id);

				if (user) user.role = response.data.data.role;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteMember(payload: { user_id: number }) {
			try {
				await axios.delete(
					`organizations/${this.organization_id}/users/${payload.user_id}`
				);

				let index = this.members?.findIndex((x) => x.user.id === payload.user_id);

				if (index !== undefined && index !== -1) this.members!.splice(index, 1);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async updateResource(payload: { designation: string }) {
			try {
				await axios.put(`organizations/${this.organization_id}`, {
					designation: payload.designation,
				});

				await this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchCompanies() {
			try {
				let response = //! use this implemented
					// await axios.get(`organizations/${this.organization_id}/companies`, {
					(
						await axios.get(`companies`, {
							headers: {
								"include-company-role": "true",
								"include-projects": "true",
							},
						})
					).data.data;

				this.companies = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
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
			let response = await axios.post("companies", { designation, base64, color_hex });

			if (!this.companies) this.companies = [] as Company[];
			this.companies.push(response.data.data);

			return response.data.data;
		},
	},

	getters: {
		getOrganization: (state) => state.organization,

		getMembers: (state) =>
			state.members?.map((x) => {
				x.user.role = x.role;
				x.user.subscription = x.subscription;
				return x.user;
			}) ?? [],

		getCreator: (state) => state.organization?.attributes?.creator ?? undefined,

		getPendingInvitations: (state) => state.pendingInvitations ?? [],

		getCompanies: (state) => state.companies ?? [],
		getCompanyProjects: (state) => (id: string) =>
			state.companies?.find((x) => x.id === id)?.attributes.projects ?? [],

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
	},
});
