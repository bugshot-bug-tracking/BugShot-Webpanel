import { defineStore } from "pinia";

import axios from "axios";
// import { Project } from "~/models/Project";
import { Company } from "~/models/Company";
import { useMainStore } from "./main";

export const useCompanyStore = defineStore("company", {
	state: () => ({
		company_id: "",
		company: <Company>{},

		// projects: new Array<Project>(),
	}),

	actions: {
		async destroy() {
			this.company_id = "";
			this.company = <Company>{};
			// this.projects = [] as Project[];

			return true;
		},

		async init(company_id: string) {
			this.destroy();

			this.company_id = company_id;

			await this.loadCompany();
		},

		async refresh() {
			await this.loadCompany();
		},

		async loadCompany() {
			try {
				let company = (
					await axios.get(`companies/${this.company_id}`, {
						headers: {
							"include-company-users": true,
							"include-company-users-roles": true,
							"include-company-role": true,
							"include-company-image": true,
							// "include-projects": true,
						},
					})
				).data.data;

				this.company = company;

				// this.projects = <Project[]>this.company.attributes.projects;
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
					await axios.get(
						`companies/${this.company.id}/invitations`,
						{
							headers: {
								"status-id": "1",
							},
						}
					)
				).data.data;

				if (this.company) this.company.pending = response;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			try {
				let response = await axios.post(
					`companies/${this.company.id}/invite`,
					{
						target_email: payload.email,
						role_id: payload.role_id,
					}
				);

				this.company.pending?.push(response.data.data);
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

				if (index !== undefined && index !== -1)
					this.company.pending?.splice(index, 1);
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

				let user = this.company.attributes.users?.find(
					(x) => x.id === payload.user_id
				);

				if (user) user.role = response.data.data.role;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteMember(payload: { user_id: number }) {
			try {
				await axios.delete(
					`companies/${this.company.id}/users/${payload.user_id}`
				);

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

		async updateCompany(payload: {
			designation: string;
			color_hex: string;
			base64: string;
		}) {
			try {
				await axios.put(`companies/${this.company.id}`, {
					designation: payload.designation,
					color_hex: payload.color_hex,
					base64: payload.base64,
				});

				await this.refresh();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async deleteCompany() {
			try {
				await axios.delete(`/companies/${this.company.id}`);

				let company = useMainStore().getCompanyById(this.company.id);

				if (company) {
					useMainStore().companies.delete(this.company.id);
				}
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},

	getters: {
		getCompany: (state) => state.company,

		getUsers: (state) => state.company?.attributes?.users ?? [],

		getCreator: (state) => state.company?.attributes?.creator ?? undefined,

		getPendingInvitations: (state) => state.company?.pending ?? [],
	},
});
