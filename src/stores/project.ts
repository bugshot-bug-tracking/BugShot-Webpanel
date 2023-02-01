import { defineStore } from "pinia";

import axios from "axios";
import { Project } from "~/models/Project";
import { Invitation } from "~/models/Invitation";
import { ProjectUserRole } from "~/models/ProjectUserRole";
import { useCompanyStore } from "./company";
import { pusher } from "~/composables/pusher";

export const useProjectStore = defineStore("project", {
	state: () => ({
		company_id: undefined as string | undefined,
		company: useCompanyStore().company,

		project_id: undefined as string | undefined,
		project: undefined as Project | undefined,

		members: undefined as ProjectUserRole[] | undefined,
		pendingInvitations: undefined as Invitation[] | undefined,
	}),

	actions: {
		async init(company_id: string, project_id: string) {
			try {
				this.unhook();

				this.$reset();

				this.project_id = project_id;
				this.company_id = company_id;

				await this.load();
				await this.fetchUsers();

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

			await this.refresh();
		},

		async deleteResource() {
			// if an id was not set return
			if (this.company_id === undefined || this.project_id === undefined) return;

			await axios.delete(`companies/${this.company_id}/projects/${this.project_id}`);

			useCompanyStore().removeProject(this.project_id);
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
				await axios.put(`projects/${this.project_id}/users/${payload.user_id}`, {
					role_id: payload.role_id,
				})
			).data.data;

			let user = this.members?.find((x) => x.user.id === payload.user_id);

			if (user) user.role = response.role;
		},

		async deleteMember(payload: { user_id: number }) {
			await axios.delete(`projects/${this.project_id}/users/${payload.user_id}`);

			let index = this.members?.findIndex((x) => x.user.id === payload.user_id);

			if (index !== undefined && index !== -1) this.members!.splice(index, 1);
		},

		async unhook() {
			if (this.project === undefined) return;

			const api_channel = `project.${this.project.id}`;

			const channel = pusher.channel(api_channel);

			if (channel != undefined) {
				channel.unsubscribe();
				channel.unbind_all();
			}
		},

		async hook() {
			if (this.project === undefined) return;

			const api_channel = `project.${this.project.id}`;

			let channel = pusher.subscribe(api_channel);

			channel.bind("members.updated", async (data: any) => {
				await this.fetchUsers();
			});
		},

		//TODO maybe update with better logic.

		async handleRemoteUpdate() {
			let project = this.project;

			alert(`Project ${project?.attributes.designation} was updated!`);

			this.load();
		},

		async handleRemoteDelete() {
			let project = this.project;

			alert(`Project ${project?.attributes.designation} was deleted!`);

			this.$reset();
		},

		// ---
	},

	getters: {
		getProject: (state) => state.project,

		getMembers: (state) =>
			state.members?.map((x) => {
				x.user.role = x.role;
				return x.user;
			}),

		getCreator: (state) => state.project?.attributes?.creator,

		getPendingInvitations: (state) => state.pendingInvitations,
	},
});
