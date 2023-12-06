import { defineStore } from "pinia";

import axios from "axios";
import { useAuthStore } from "../auth";
import { useProjectStore } from "../project";
import { JiraProjectLink } from "~/models/Integrations/Jira/ProjectLink";

export const useJiraStore = defineStore("jira", {
	state: () => ({
		project: useProjectStore().project,

		link: undefined as undefined | JiraProjectLink,
	}),

	actions: {
		async init() {
			try {
				this.$reset();

				if (!this.project?.id) throw new Error("No active project!");

				let response = (await axios.get(`/projects/${this.project.id}/jira-link`)).data
					.data;

				this.link = response;
			} catch (error: any) {
				this.$reset();

				if (error?.response?.status === 404 && this.project)
					this.project.attributes.integrations.jira = false;

				console.log(error);

				throw error;
			} finally {
			}
		},

		async connect() {
			if (!this.project?.id) throw new Error("No active project!");

			let state = btoa(`${useAuthStore().token.split("|")[1]}|${this.project.id}`);

			let url = new URL("https://auth.atlassian.com/authorize");
			url.searchParams.append("audience", "api.atlassian.com");
			url.searchParams.append("client_id", import.meta.env.VITE_JIRA_CLIENT_ID);
			url.searchParams.append(
				"scope",
				"read:jira-work read:jira-user write:jira-work offline_access manage:jira-webhook"
			);
			url.searchParams.append(
				"redirect_uri",
				window.location.origin + "/extra/integrations/atlassian"
			);
			url.searchParams.append("state", state);
			url.searchParams.append("response_type", "code");
			url.searchParams.append("prompt", "consent");

			window.open(url, "_blank", "popup");
		},

		async disconnect() {
			if (!this.project?.id) throw new Error("No active project!");

			// let response =
			await axios.delete(`/projects/${this.project.id}/jira-link`);

			this.project.attributes.integrations.jira = false;
		},

		async getSites() {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (await axios.get(`/projects/${this.project.id}/jira-sites`)).data;

			return response;
		},

		async setSite(payload: { id: string; name: string; url: string }) {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (
				await axios.post(`/projects/${this.project.id}/jira-site`, {
					id: payload.id,
					name: payload.name,
					url: payload.url,
				})
			).data.data;

			return response;
		},

		async deleteSite() {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (await axios.delete(`/projects/${this.project.id}/jira-site`)).data.data;

			if (this.link) Object.assign(this.link, response);
		},

		async getProjects(payload?: { query?: string }) {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (
				await axios.get(
					`/projects/${this.project.id}/jira-projects` +
						(payload ? `?query=${payload.query}` : "")
				)
			).data;

			return response;
		},

		async getCreatemeta() {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (await axios.get(`/projects/${this.project.id}/jira-createmeta`)).data;

			return response;
		},

		async setProject(payload: { id: string; key: string; name: string; issuetype: string }) {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (
				await axios.post(`/projects/${this.project.id}/jira-project`, {
					id: payload.id,
					name: payload.name,
					key: payload.key,
					issuetype: payload.issuetype,
				})
			).data.data;

			if (this.link) Object.assign(this.link, response);
		},

		async deleteProject() {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (await axios.delete(`/projects/${this.project.id}/jira-project`)).data
				.data;

			if (this.link) Object.assign(this.link, response);
		},

		async setSetting(payload: {
			sync_bugs_to_jira?: boolean;
			sync_bugs_from_jira?: boolean;
			sync_comments_to_jira?: boolean;
			sync_comments_from_jira?: boolean;
			update_status_to_jira?: boolean;
			update_status_from_jira?: boolean;
		}) {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (
				await axios.patch(`/projects/${this.project.id}/jira-settings`, payload)
			).data.data;

			return response;
		},
	},

	getters: {
		getActiveSite: (state) => {
			if (state.link?.site.id)
				return {
					label: state.link.site.name as string,
					value: state.link.site.id as string,
					url: state.link.site.url as string,
				};
			else return undefined;
		},

		getActiveProject: (state) => {
			if (state.link?.project.id)
				return {
					label: state.link.project.name as string,
					value: state.link.project.id as string,
					key: state.link.project.key as string,
				};
			else return undefined;
		},

		getActiveSettings: (state) => {
			if (state.link)
				return {
					syncBugsTo: state.link.options.sync_bugs_to_jira ? true : false,
					syncBugsFrom: state.link.options.sync_bugs_from_jira ? true : false,
					syncCommentsTo: state.link.options.sync_comments_to_jira ? true : false,
					syncCommentsFrom: state.link.options.sync_comments_from_jira ? true : false,
					updateStatusTo: state.link.options.update_status_to_jira ? true : false,
					updateStatusFrom: state.link.options.update_status_from_jira ? true : false,
				};
			else return undefined;
		},
	},
});
