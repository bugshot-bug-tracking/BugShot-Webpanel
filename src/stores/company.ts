import { defineStore } from "pinia";

import axios from "axios";
import { Company } from "~/models/Company";
import { CompanyUserRole } from "~/models/CompanyUserRole";
import { Invitation } from "~/models/Invitation";
import { Project } from "~/models/Project";
import { useOrganizationStore } from "./organization";
import { echo } from "~/composables/listeners";
import { useProjectStore } from "./project";
import { useAuthStore } from "./auth";

export const useCompanyStore = defineStore("company", {
	state: () => ({
		organization_id: undefined as string | undefined,

		company_id: undefined as string | undefined,
		company: undefined as Company | undefined,

		members: undefined as CompanyUserRole[] | undefined,
		pendingInvitations: undefined as Invitation[] | undefined,

		projects: undefined as Project[] | undefined,
	}),

	actions: {
		async init(organization_id: string, company_id: string) {
			try {
				this.unhook();

				this.$reset();

				this.company_id = company_id;
				this.organization_id = organization_id;

				await this.load();

				await this.fetchUsers();

				await this.fetchProjects();

				this.hook();
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
				await axios.get(
					`organizations/${this.organization_id}/companies/${this.company_id}`,
					{
						headers: {
							"include-company-role": true,
							"include-company-image": true,
						},
					}
				)
			).data.data;

			this.company = response;
		},

		async updateResource(payload: { designation: string; color_hex: string; base64: string }) {
			// if an id was not set return
			if (this.company_id === undefined) return;

			let response = (
				await axios.put(
					`organizations/${this.organization_id}/companies/${this.company_id}`,
					{
						designation: payload.designation,
						color_hex: payload.color_hex,
						base64: payload.base64,
					}
				)
			).data.data;

			useOrganizationStore().updateCompany(response);

			await this.refresh();
		},

		async deleteResource() {
			// if an id was not set return
			if (this.organization_id === undefined || this.company_id === undefined) return;

			await axios.delete(
				`organizations/${this.organization_id}/companies/${this.company_id}`
			);

			useOrganizationStore().removeCompany(this.company_id);
		},

		async fetchUsers() {
			let response = (
				await axios.get(`companies/${this.company_id}/users`, {
					headers: { "include-users-company-role": true },
				})
			).data.data;

			this.members = response;
		},

		async fetchInvitations() {
			let response = (
				await axios.get(`companies/${this.company_id}/invitations`, {
					headers: {
						"status-id": "1",
					},
				})
			).data.data;

			this.pendingInvitations = response;
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			// if an id was not set return
			if (this.company_id === undefined) return;

			let response = (
				await axios.post(`companies/${this.company_id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			if (!this.pendingInvitations) this.pendingInvitations = [] as Invitation[];
			this.pendingInvitations.push(response);
		},

		/**
		 * Function used to send an invitation for a specific company without requiring the store to be initialized
		 * @param id A company ID
		 * @param payload Invitation details
		 */
		async sendInvitationSpecific(id: string, payload: { email: string; role_id: number }) {
			let response = (
				await axios.post(`companies/${id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			return response;
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
				await axios.put(`companies/${this.company_id}/users/${payload.user_id}`, {
					role_id: payload.role_id,
				})
			).data.data;

			let user = this.members?.find((x) => x.user.id === payload.user_id);

			if (user) user.role = response.role;
		},

		async deleteMember(payload: { user_id: number }) {
			await axios.delete(`companies/${this.company_id}/users/${payload.user_id}`);

			let index = this.members?.findIndex((x) => x.user.id === payload.user_id);

			if (index !== undefined && index !== -1) this.members!.splice(index, 1);
		},

		async fetchProjects() {
			let response = (
				await axios.get(`companies/${this.company_id}/projects`, {
					headers: {
						"include-project-role": "true",
						"include-project-image": "true",
					},
				})
			).data.data;

			this.projects = response;
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
			let response = (
				await axios.post(
					`companies/${this.company!.id}/projects`,
					{
						designation,
						url,
						base64,
						color_hex,
					},
					{
						headers: {
							"include-project-role": "true",
							"include-project-image": "true",
						},
					}
				)
			).data.data;

			this.addProject(response);

			return response;
		},

		/**
		 * Add an project to local store
		 */
		addProject(project: Project) {
			if (!this.projects) this.projects = [] as Project[];

			return this.projects.push(project);
		},

		/**
		 * Update an project in local store
		 */
		updateProject(project: Project) {
			if (!this.projects) return false;

			let item = this.projects?.find((x) => x.id === project.id);

			if (!item) return false;

			Object.assign(item.attributes, project.attributes);

			let up_item = useOrganizationStore()
				.companies?.find((c) => c.id === project.attributes.company.id)
				?.attributes.projects?.find((p) => p.id === project.id);

			if (!up_item) return false;

			Object.assign(up_item.attributes, project.attributes);

			return true;
		},

		/**
		 * Remove an project from local store
		 */
		removeProject(id: string) {
			if (!this.projects) return true;

			let index = this.projects?.findIndex((x) => x.id === id);

			if (index === -1) return true;

			this.projects.splice(index, 1);

			if (this.projects.length === 0) this.projects = undefined;

			return true;
		},

		async unhook() {
			if (this.company === undefined) return;

			const api_channel = `company.${this.company.id}`;

			echo.leave(api_channel);
		},

		async hook() {
			if (this.company === undefined) return;

			const api_channel = `company.${this.company.id}`;

			let channel = echo.private(api_channel);

			channel.listen(".project.updated", (data: any) => {
				if (!(data && data.data.type === "Project")) return console.log(data);

				let project = data.data as Project;

				let oldProject = this.projects?.find((x) => x.id === project.id);

				if (oldProject == undefined) return;

				Object.assign(oldProject.attributes, project.attributes);

				if (useProjectStore().project_id === project.id)
					useProjectStore().handleRemoteUpdate();

				let up_oldProject = useOrganizationStore()
					?.companies?.find((c) => c.id === project.attributes.company.id)
					?.attributes.projects?.find((p) => p.id === project.id);

				if (up_oldProject == undefined) return;

				Object.assign(up_oldProject.attributes, project.attributes);
			});

			channel.listen(".project.deleted", (data: any) => {
				if (!(data && data.data.type === "Project")) return console.log(data);

				let project = data.data as Project;

				let index = this.projects?.findIndex((x) => x.id === project.id);

				if (index === undefined || index === -1)
					return console.log(
						`project.deleted: Project not found in company projects list!`
					);

				this.projects?.splice(index, 1);

				if (useProjectStore().project_id === project.id)
					useProjectStore().handleRemoteDelete();

				let up_index = useOrganizationStore()
					?.companies?.find((c) => c.id === project.attributes.company.id)
					?.attributes.projects?.findIndex((p) => p.id === project.id);

				if (up_index === undefined || up_index === -1)
					return console.log(
						`project.deleted: Project not found in organization company projects list!`
					);

				useOrganizationStore()
					?.companies?.find((c) => c.id === project.attributes.company.id)
					?.attributes.projects?.splice(up_index, 1);
			});

			const user = useAuthStore().user;
			if (
				user.id === this.company?.attributes.creator?.id ||
				this.company?.attributes.role?.id === 1
			) {
				const admin_channel = echo.private(api_channel + ".admin");

				admin_channel.listen(".project.created", (data: any) => {
					if (!(data && data.data.type === "Project")) return console.log(data);

					let project = data.data as Project;

					this.projects?.push(project);

					useOrganizationStore()
						?.companies?.find((c) => c.id === project.attributes.company.id)
						?.attributes.projects?.push(project);
				});
			}
		},

		//TODO maybe update with better logic.

		async handleRemoteUpdate() {
			let company = this.company;

			alert(`Company ${company?.attributes.designation} was updated!`);

			this.load();
		},

		async handleRemoteDelete() {
			let company = this.company;

			alert(`Company ${company?.attributes.designation} was deleted!`);

			this.$reset();
		},

		// ---
	},

	getters: {
		getCompany: (state) => state.company,

		getMembers: (state) =>
			state.members?.map((x) => {
				x.user.role = x.role;
				return x.user;
			}),

		getCreator: (state) => state.company?.attributes?.creator,

		getPendingInvitations: (state) => state.pendingInvitations,

		getProjects: (state) => state.projects,

		getProjectById: (state) => (id: string) => state.projects?.find((x) => x.id === id),
	},
});
