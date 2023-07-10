import { defineStore } from "pinia";

import axios from "axios";
import { Project } from "~/models/Project";
import { Invitation } from "~/models/Invitation";
import { ProjectUserRole } from "~/models/ProjectUserRole";
import { useCompanyStore } from "./company";
import { useHookStore } from "./hooks";
import { Url } from "~/models/Url";

export const useProjectStore = defineStore("project", {
	state: () => ({
		company_id: undefined as string | undefined,
		company: useCompanyStore().company,

		project_id: undefined as string | undefined,
		project: undefined as Project | undefined,

		extra_urls: undefined as Url[] | undefined,

		members: undefined as ProjectUserRole[] | undefined,
		pendingInvitations: undefined as Invitation[] | undefined,
	}),

	actions: {
		async init(company_id: string, project_id: string) {
			try {
				this.$reset();

				this.project_id = project_id;
				this.company_id = company_id;

				await this.load();
				await this.fetchUsers();
				await this.fetchProjectUrls();
			} catch (error) {
				this.$reset();

				console.log(error);
				throw error;
			} finally {
				// add the hooks when the load was a success or remove existing ones (if any) in case of error
				useHookStore().hookProject();
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
			let project = (
				await axios.get(`companies/${this.company_id}/projects/${this.project_id}`, {
					headers: {
						"include-project-role": true,
						"include-project-image": true,
					},
				})
			).data.data;

			this.project = project;
		},

		async fetchProjectUrls() {
			let urls = (await axios.get(`/project/${this.project_id}/urls`)).data.data;

			this.extra_urls = urls as Url[];
		},

		async updateResource(payload: {
			designation: string;
			url: string;
			color_hex: string;
			base64: string;
		}) {
			let response = (
				await axios.put(`companies/${this.company_id}/projects/${this.project_id}`, {
					designation: payload.designation,
					url: payload.url,
					color_hex: payload.color_hex,
					base64: payload.base64,
				})
			).data.data;

			useCompanyStore().updateProject(response);

			this.message.success(this.i18n.t("messages.project_updated"));

			await this.refresh();
		},

		async addExtraUrl(item: string) {
			const response = await axios.post(`project/${this.project?.id}/urls`, {
				url: item,
				https: item.match(/^(https):\/\//) == null ? false : true,
			});

			return response;
		},

		async updateExtraUrl(item: Url) {
			const response = await axios.put(`project/${this.project?.id}/urls/${item.id}`, {
				url: item.attributes.url,
				https: item.attributes.url.match(/^(https):\/\//) == null ? 0 : 1,
			});

			return response;
		},

		async deleteExtraUrl(item: Url) {
			const response = await axios.delete(`project/${this.project?.id}/urls/${item.id}`);

			return response;
		},

		async deleteResource() {
			// if an id was not set return
			if (this.company_id === undefined || this.project_id === undefined) return;

			await axios.delete(`companies/${this.company_id}/projects/${this.project_id}`);

			useCompanyStore().removeProject(this.project_id);

			this.message.info(this.i18n.t("messages.project_deleted"));
		},

		async fetchUsers() {
			let response = (
				await axios.get(`projects/${this.project_id}/users`, {
					headers: { "include-users-project-role": true },
				})
			).data.data;

			this.members = response;
		},

		async fetchInvitations() {
			let response = (
				await axios.get(`projects/${this.project_id}/invitations`, {
					headers: {
						"status-id": "1",
					},
				})
			).data.data;

			this.pendingInvitations = response;
		},

		async sendInvitation(payload: { email: string; role_id: number }) {
			// if an id was not set return
			if (this.project_id === undefined) return;

			let response = (
				await axios.post(`projects/${this.project_id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			if (!this.pendingInvitations) this.pendingInvitations = [] as Invitation[];
			this.pendingInvitations.push(response);

			this.message.info(this.i18n.t("messages.invitation_sent"));
		},

		/**
		 * Function used to send an invitation for a specific project without requiring the store to be initialized
		 * @param id A project ID
		 * @param payload Invitation details
		 */
		async sendInvitationSpecific(id: string, payload: { email: string; role_id: number }) {
			let response = (
				await axios.post(`projects/${id}/invite`, {
					target_email: payload.email,
					role_id: payload.role_id,
				})
			).data.data;

			this.message.info(this.i18n.t("messages.invitation_sent"));

			return response;
		},

		async deleteInvitation(payload: { invitation_id: string }) {
			await axios.delete(`invitations/${payload.invitation_id}`);

			let index = this.pendingInvitations?.findIndex(
				(x: any) => x.id === payload.invitation_id
			);

			if (index !== undefined && index !== -1) this.pendingInvitations!.splice(index, 1);

			this.message.info(this.i18n.t("messages.invitation_deleted"));
		},

		async editMember(payload: { user_id: number; role_id: number }) {
			let response = (
				await axios.put(
					`projects/${this.project_id}/users/${payload.user_id}`,
					{
						role_id: payload.role_id,
					},
					{
						headers: {
							"include-users-project-role": true,
						},
					}
				)
			).data.data;

			let user = this.members?.find((x) => x.user.id === payload.user_id);

			if (user) Object.assign(user.role, response.role);

			this.message.success(this.i18n.t("messages.member_updated"));
		},

		async deleteMember(payload: { user_id: number }) {
			await axios.delete(`projects/${this.project_id}/users/${payload.user_id}`);

			let index = this.members?.findIndex((x) => x.user.id === payload.user_id);

			if (index !== undefined && index !== -1) this.members!.splice(index, 1);

			this.message.info(this.i18n.t("messages.member_removed"));
		},

		//TODO maybe update with better logic.

		async handleRemoteUpdate() {
			// let project = this.project;

			// alert(`Project ${project?.attributes.designation} was updated!`);

			this.load();
		},

		async handleRemoteDelete() {
			// let project = this.project;

			// alert(`Project ${project?.attributes.designation} was deleted!`);

			this.$reset();
		},

		// ---

		async requestApprovals(bugs: string[], recipients: { name: string; email: string }[]) {
			console.log(bugs);
			console.log(recipients);

			let response = (
				await axios.post(`projects/${this.project?.id}/exports`, {
					bugs: bugs.map((b) => ({ id: b })),

					recipients: recipients,
				})
			).data.data;

			console.log(response);
			return response;
		},
	},

	getters: {
		getProject: (state) => state.project,

		getMembers: (state) =>
			state.members
				?.map((x) => {
					x.user.role = x.role;
					return x.user;
				})
				.sort((a, b) => (a.role?.id ?? 0) - (b.role?.id ?? 0)) ?? [],

		getCreator: (state) => state.project?.attributes?.creator,

		getPendingInvitations: (state) => state.pendingInvitations,

		getUserRole: (state) => state.project?.attributes.role,
	},
});
