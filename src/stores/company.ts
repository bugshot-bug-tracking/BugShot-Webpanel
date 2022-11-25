import { defineStore } from "pinia";

import axios from "axios";
// import { Project } from "~/models/Project";
import { Company } from "~/models/Company";
import { useMainStore } from "./main";
import { Project } from "~/models/Project";

export const useCompanyStore = defineStore("company", {
	state: () => ({
		organization_id: undefined as string | undefined,

		company_id: undefined as string | undefined,
		company: undefined as Company | undefined,
		projects: undefined as Project[] | undefined,
	}),

	actions: {
		async destroy() {
			this.organization_id = undefined;
			this.company_id = undefined;
			this.company = undefined;
			this.projects = undefined;

			return true;
		},

		async init(organization_id: string, company_id: string) {
			this.destroy();

			this.company_id = company_id;
			this.organization_id = organization_id;

			await this.loadCompany();
		},

		async refresh() {
			await this.loadCompany();
		},

		async loadCompany() {
			try {
				let company = (
					await axios.get(
						`organizations/${this.organization_id}/companies/${this.company_id}`,
						{
							headers: {
								"include-company-users": true,
								"include-company-users-roles": true,
								"include-company-role": true,
								"include-company-image": true,
								"include-projects": true,
							},
						}
					)
				).data.data;

				this.company = company;

				this.projects = <Project[]>company.attributes.projects;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchUsers() {
			try {
				let response = (
					await axios.get(`companies/${this.company_id}`, {
						headers: {
							"include-company-users": true,
							"include-company-users-roles": true,
						},
					})
				).data.data;

				this.company.attributes.users = response.attributes.users;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchInvitations() {
			try {
				let response = (
					await axios.get(`companies/${this.company.id}/invitations`, {
						headers: {
							"status-id": "1",
						},
					})
				).data.data;

				if (this.company) this.company.pending = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			try {
				let response = await axios.post(`companies/${this.company.id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				});

				this.company.pending?.push(response.data.data);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 * Function used to send an invitation for a specific company without requiring the store to be initialized
		 * @param id A company ID
		 * @param payload Invitation details
		 */
		async sendInvitationSpecific(id: string, payload: { email: string; role_id: number }) {
			try {
				await axios.post(`companies/${id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteInvitation(payload: { invitation_id: string }) {
			try {
				await axios.delete(`invitations/${payload.invitation_id}`);

				let index = this.company.pending?.findIndex(
					(x: any) => x.id === payload.invitation_id
				);

				if (index !== undefined && index !== -1) this.company.pending?.splice(index, 1);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async editMember(payload: { user_id: number; role_id: number }) {
			try {
				let response = await axios.put(
					`companies/${this.company.id}/users/${payload.user_id}`,
					{
						role_id: payload.role_id,
					}
				);

				let user = this.company.attributes.users?.find((x) => x.id === payload.user_id);

				if (user) user.role = response.data.data.role;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteMember(payload: { user_id: number }) {
			try {
				await axios.delete(`companies/${this.company.id}/users/${payload.user_id}`);

				let index = this.company.attributes.users?.findIndex(
					(x) => x.id === payload.user_id
				);

				if (index !== undefined && index !== -1)
					this.company.attributes.users?.splice(index, 1);
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async updateCompany(payload: { designation: string; color_hex: string; base64: string }) {
			try {
				await axios.put(
					`organizations/${this.organization_id}/companies/${this.company.id}`,
					{
						designation: payload.designation,
						color_hex: payload.color_hex,
						base64: payload.base64,
					}
				);

				await this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteCompany() {
			try {
				await axios.delete(
					`organizations/${this.organization_id}/companies/${this.company.id}`
				);

				let company = useMainStore().getCompanyById(this.company.id);

				if (company) {
					useMainStore().companies.delete(this.company.id);
				}
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async createProject({
			designation,
			url,
			base64,
			color_hex,
		}: {
			designation: string;
			url: string | undefined;
			base64: string | undefined;
			color_hex: string;
		}) {
			let response = await axios.post(`companies/${this.company!.id}/projects`, {
				designation,
				url,
				base64,
				color_hex,
			});

			if (!this.projects) this.projects = [] as Project[];
			this.projects.push(response.data.data);

			return response.data.data;
		},
	},

	getters: {
		getCompany: (state) => state.company,

		getUsers: (state) => state.company?.attributes?.users ?? [],

		getCreator: (state) => state.company?.attributes?.creator ?? undefined,

		getPendingInvitations: (state) => state.company?.pending ?? [],

		getProjects: (state) => state.projects ?? ([] as Project[]),
	},
});
