import { defineStore } from "pinia";
import axios from "axios";
import { User } from "~/models/User";
import { Export } from "~/models/Export";
import { BugExport } from "~/models/BugExport";
import { Project } from "~/models/Project";

export const useApprovalsStore = defineStore("approvals", {
	state: () => ({
		email: undefined as string | undefined,
		name: undefined as string | undefined,
		id: undefined as string | undefined,

		bugs: undefined as BugExport[] | undefined,
		users: undefined as User[] | undefined,
		project: undefined as Project | undefined,
	}),

	actions: {
		async init(email: string, name: string, id: string) {
			try {
				this.email = email;
				this.name = name;
				this.id = id;

				await this.fetchBugs();
			} catch (error) {
				console.log(error);
				// throw error;
			}
		},

		async fetchBugs() {
			if (this.id == undefined) throw new Error("Export id not set!");
			let response = (
				await axios.get(`exports/${this.id}`, {
					headers: {
						"include-bugs": true,
						"include-project-users": true,
						"include-screenshots": true,
					},
				})
			).data.data as Export;

			console.log(response);
			this.bugs = response.attributes.bugs;
			this.users = response.attributes.users;
			this.project = response.attributes.project;
		},

		async sendResponses(
			responses: { id: string; value: string }[],
			recipients: { name: string; email: string }[]
		) {
			let response = (
				await axios.put(`projects/${this.project?.id}/exports/${this.id}`, {
					evaluator: { name: this.name, email: this.email },
					bugs: responses.map((x) => ({
						id: x.id,
						status_id: x.value === "approved" ? "2" : "3",
					})),

					recipients: recipients,
				})
			).data.data;

			console.log(responses);
			console.log(recipients);
			console.log(response);

			return response;
		},
	},

	getters: {},
});
