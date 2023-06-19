import { defineStore } from "pinia";
import { echo } from "~/composables/listeners";
import { Bug } from "~/models/Bug";
import { Company } from "~/models/Company";
import { Project } from "~/models/Project";
import { Status } from "~/models/Status";
import { useAuthStore } from "./auth";
import { useCompanyStore } from "./company";
import { useMainStore } from "./main";
import { useNotificationStore } from "./notifications";
import { useOrganizationStore } from "./organization";
import { usePaymentsStore } from "./payments";
import { useProjectStore } from "./project";
import { useReportsStore } from "./reports";
import { useSettingsStore } from "./settings";
import { useBugStore } from "./bug";

export const useHookStore = defineStore("hooks", {
	state: () => ({
		authStore: useAuthStore(),
		notificationsStore: useNotificationStore(),
		settingsStore: useSettingsStore(),

		mainsStore: useMainStore(),
		organizationStore: useOrganizationStore(),
		companyStore: useCompanyStore(),
		projectStore: useProjectStore(),

		reportsStore: useReportsStore(),
		bugStore: useBugStore(),

		paymentsStore: usePaymentsStore(),

		// contains a list of active channels; key="resource name", value="api_channel"
		channels: new Map<string, string>(),
	}),

	actions: {
		async hookOrganization() {
			let existing = this.channels.get("organization");
			if (existing != undefined) echo.leave(existing);

			if (this.organizationStore.organization === undefined) return;

			const api_channel = `organization.${this.organizationStore.organization.id}`;
			let channel = echo.private(api_channel);

			this.channels.set("organization", api_channel);

			channel.listen(".members.updated", async (data: any) => {
				await this.organizationStore.fetchUsers();
			});

			channel.listen(".company.updated", (data: any) => {
				if (!(data && data.data.type === "Company")) return console.log(data);

				let company = data.data as Company;

				let oldCompany = this.organizationStore.companies?.find((x) => x.id === company.id);

				if (oldCompany == undefined) return;

				Object.assign(oldCompany.attributes, company.attributes);

				if (this.companyStore.company_id === company.id)
					this.companyStore.handleRemoteUpdate();
			});

			channel.listen(".company.deleted", (data: any) => {
				if (!(data && data.data.type === "Company")) return console.log(data);

				let company = data.data as Company;

				let index = this.organizationStore.companies?.findIndex((x) => x.id === company.id);

				if (index === undefined || index === -1)
					return console.log(
						`company.deleted: Company not found in organization companies list!`
					);

				this.organizationStore.companies?.splice(index, 1);

				if (this.companyStore.company_id === company.id)
					this.companyStore.handleRemoteDelete();
			});

			/**
			 * Admin routes.
			 * Requirements:
			 * - Owner of the resource
			 *	- Manager role in the said resource
			 */
			if (
				this.authStore.user?.id ===
					this.organizationStore.organization?.attributes.creator?.id ||
				this.organizationStore.organization?.attributes.role?.id === 1
			) {
				let existing_admin = this.channels.get("organization_admin");
				if (existing_admin != undefined) echo.leave(existing_admin);

				const admin_channel = echo.private(api_channel + ".admin");

				this.channels.set("organization_admin", api_channel + ".admin");

				admin_channel.listen(".company.created", (data: any) => {
					if (!(data && data.data.type === "Company")) return console.log(data);

					let company = data.data as Company;

					this.organizationStore.companies?.push(company);
				});

				admin_channel.listen(".subscription.created", (data: any) => {
					console.log(data);
				});
			}
		},

		async hookCompany() {
			let existing = this.channels.get("company");
			if (existing != undefined) echo.leave(existing);

			if (this.companyStore.company === undefined) return;

			const api_channel = `company.${this.companyStore.company.id}`;
			let channel = echo.private(api_channel);

			this.channels.set("company", api_channel);

			channel.listen(".members.updated", async (data: any) => {
				await this.companyStore.fetchUsers();
			});

			channel.listen(".project.updated", (data: any) => {
				if (!(data && data.data.type === "Project")) return console.log(data);

				let project = data.data as Project;

				let oldProject = this.companyStore.projects?.find((x) => x.id === project.id);

				if (oldProject == undefined) return;

				Object.assign(oldProject.attributes, project.attributes);

				if (this.projectStore.project_id === project.id)
					this.projectStore.handleRemoteUpdate();

				let up_oldProject = this.organizationStore?.companies
					?.find((c) => c.id === project.attributes.company.id)
					?.attributes.projects?.find((p) => p.id === project.id);

				if (up_oldProject == undefined) return;

				Object.assign(up_oldProject.attributes, project.attributes);
			});

			channel.listen(".project.deleted", (data: any) => {
				if (!(data && data.data.type === "Project")) return console.log(data);

				let project = data.data as Project;

				let index = this.companyStore.projects?.findIndex((x) => x.id === project.id);

				if (index === undefined || index === -1)
					return console.log(
						`project.deleted: Project not found in company projects list!`
					);

				this.companyStore.projects?.splice(index, 1);

				if (this.projectStore.project_id === project.id)
					this.projectStore.handleRemoteDelete();

				let up_index = this.organizationStore?.companies
					?.find((c) => c.id === project.attributes.company.id)
					?.attributes.projects?.findIndex((p) => p.id === project.id);

				if (up_index === undefined || up_index === -1)
					return console.log(
						`project.deleted: Project not found in organization company projects list!`
					);

				this.organizationStore?.companies
					?.find((c) => c.id === project.attributes.company.id)
					?.attributes.projects?.splice(up_index, 1);
			});

			if (
				this.authStore.user?.id === this.companyStore.company?.attributes.creator?.id ||
				this.companyStore.company?.attributes.role?.id === 1
			) {
				let existing_admin = this.channels.get("company_admin");
				if (existing_admin != undefined) echo.leave(existing_admin);

				const admin_channel = echo.private(api_channel + ".admin");

				this.channels.set("organization_admin", api_channel + ".admin");

				admin_channel.listen(".project.created", (data: any) => {
					if (!(data && data.data.type === "Project")) return console.log(data);

					let project = data.data as Project;

					this.companyStore.projects?.push(project);

					this.organizationStore?.companies
						?.find((c) => c.id === project.attributes.company.id)
						?.attributes.projects?.push(project);
				});
			}
		},

		async hookProject() {
			let existing = this.channels.get("project");
			if (existing != undefined) echo.leave(existing);

			if (this.projectStore.project === undefined) return;

			const api_channel = `project.${this.projectStore.project.id}`;
			let channel = echo.private(api_channel);

			this.channels.set("project", api_channel);

			channel.listen(".members.updated", async (data: any) => {
				await this.projectStore.fetchUsers();
			});
		},

		// register listeners for the active bug resources
		async hookBug() {
			let existing = this.channels.get("bug");
			if (existing != undefined) echo.leave(existing);

			if (this.bugStore.bug === undefined) return;

			const api_channel = `bug.${this.bugStore.bug.id}`;
			let channel = echo.private(api_channel);

			this.channels.set("bug", api_channel);

			channel.listen(".members.updated", async () => {
				await this.bugStore.fetchBugUsers();
			});

			channel.listen(".screenshot.created", (data: any) => {
				if (!(data && data.data.type === "Screenshot")) return console.log(data);

				this.bugStore.fetchScreenshots();
			});

			channel.listen(".screenshot.deleted", (data: any) => {
				if (!(data && data.data.type === "Screenshot")) return console.log(data);

				let index = this.bugStore.screenshots?.findIndex((x) => x.id === data.data.id);

				if (index == undefined || index === -1) return;

				this.bugStore.screenshots?.splice(index, 1);
			});

			channel.listen(".attachment.created", (data: any) => {
				if (!(data && data.data.type === "Attachment")) return console.log(data);

				this.bugStore.attachments?.push(data.data);
			});

			channel.listen(".attachment.deleted", (data: any) => {
				if (!(data && data.data.type === "Attachment")) return console.log(data);

				let index = this.bugStore.attachments?.findIndex((x) => x.id === data.data.id);

				if (index == undefined || index === -1) return;

				this.bugStore.attachments?.splice(index, 1);
			});

			channel.listen(".comment.created", (data: any) => {
				if (!(data && data.data.type === "Comment")) return console.log(data);

				this.bugStore.comments?.push(data.data);
			});
		},

		async hookKanban() {
			if (this.projectStore.project === undefined) return;

			const api_channel = `project.${this.projectStore.project.id}`;

			const channel = echo.private(api_channel);

			channel.listen(".status.created", (data: any) => {
				if (!(data && data.data.type === "Status")) return console.log(data);

				this.reportsStore.statuses?.push(data.data as Status);
			});

			channel.listen(".status.deleted", (data: any) => {
				if (!(data && data.data.type === "Status")) return console.log(data);

				let index = this.reportsStore.statuses?.findIndex((x) => x.id === data.data.id);

				if (index == undefined || index === -1) return;

				this.reportsStore.statuses?.splice(index, 1);
			});

			channel.listen(".status.updated", (data: any) => {
				if (!(data && data.data.type === "Status")) return console.log(data);

				let oldStatus = this.reportsStore.statuses?.find(
					(x) => x.id === (data.data as Status).id
				);

				if (oldStatus === undefined) return;

				let newStatus = data.data as Status;

				if (oldStatus.attributes.order_number === newStatus.attributes.order_number)
					return Object.assign(oldStatus.attributes, newStatus.attributes);

				this.reportsStore.statuses?.forEach((status) => {
					// if the move was to the right (ex. status 1 was moved after 4), all the statuses in interval (1, 4] or [2, 4] should be -1
					if (oldStatus!.attributes.order_number < newStatus.attributes.order_number) {
						if (
							status.attributes.order_number > oldStatus!.attributes.order_number &&
							status.attributes.order_number <= newStatus.attributes.order_number
						) {
							status.attributes.order_number--;
						}

						// else if the move was to the left (ex. status 6 was moved before 1), all the statuses in interval [1, 6) or [1, 5] should be +1
					} else {
						if (
							status.attributes.order_number >= newStatus.attributes.order_number &&
							status.attributes.order_number < oldStatus!.attributes.order_number
						) {
							status.attributes.order_number++;
						}
					}
				});

				Object.assign(oldStatus.attributes, newStatus.attributes);
			});

			channel.listen(".bug.updated", async (data: any) => {
				if (!(data && data.data.type === "Bug")) return console.log(data);

				let newBug = data.data as Bug;

				let oldBug = this.reportsStore.statuses
					?.find((x) =>
						x.attributes.bugs?.find((x) => x.id === newBug.id) ? true : false
					)
					?.attributes.bugs?.find((x) => x.id === newBug.id);

				// if no bug found in memory
				if (oldBug === undefined)
					return console.log("bug.updated: No bug found in memory!");

				let sameStatus = newBug.attributes.status_id === oldBug.attributes.status_id;

				// if no reorder was made just update the bug properties
				if (
					newBug.attributes.order_number === oldBug.attributes.order_number &&
					sameStatus
				) {
					Object.assign(oldBug!.attributes, newBug.attributes);

					if (this.bugStore.bug?.id === newBug.id) this.bugStore.refreshBug();

					return;
				}

				let oldStatus = this.reportsStore.statuses?.find(
					(x) => x.id === oldBug!.attributes.status_id
				);

				// if they are the same status but different order, update just the bugs in that status
				if (sameStatus) {
					oldStatus?.attributes.bugs?.forEach((bug) => {
						// if the move was to the right (ex. bug 1 was moved after 4), all the bugs in interval (1, 4] or [2, 4] should be -1
						if (oldBug!.attributes.order_number < newBug.attributes.order_number) {
							if (
								bug.attributes.order_number > oldBug!.attributes.order_number &&
								bug.attributes.order_number <= newBug.attributes.order_number
							) {
								bug.attributes.order_number--;
							}

							// else if the move was to the left (ex. bug 6 was moved before 1), all the bugs in interval [1, 6) or [1, 5] should be +1
						} else {
							if (
								bug.attributes.order_number >= newBug.attributes.order_number &&
								bug.attributes.order_number < oldBug!.attributes.order_number
							) {
								bug.attributes.order_number++;
							}
						}
					});

					Object.assign(oldBug!.attributes, newBug.attributes);
				} else {
					let newStatus = this.reportsStore.statuses?.find(
						(x) => x.id === newBug.attributes.status_id
					);

					// remove old bug
					let oldIndex = oldStatus?.attributes.bugs?.findIndex((x) => x.id === newBug.id);

					if (oldIndex != undefined && oldIndex != -1)
						oldStatus?.attributes.bugs?.splice(oldIndex, 1);

					oldStatus?.attributes.bugs?.forEach((bug) => {
						if (bug.attributes.order_number > oldBug!.attributes.order_number)
							bug.attributes.order_number--;
					});

					newStatus?.attributes.bugs?.forEach((bug) => {
						if (bug.attributes.order_number >= newBug.attributes.order_number)
							bug.attributes.order_number++;
					});

					newStatus?.attributes.bugs?.push(newBug);

					if (this.bugStore.bug?.id === newBug.id) this.bugStore.refreshBug();
				}
			});

			channel.listen(".bug.deleted", async (data: any) => {
				if (!(data && data.data.type === "Bug")) return console.log(data);

				let status = this.reportsStore.getStatusById(
					(data.data as Bug).attributes.status_id
				);

				if (!status) return;

				let index = status.attributes.bugs?.findIndex((x) => x.id === data.data.id);

				if (index == undefined || index === -1) return;

				status.attributes.bugs?.splice(index, 1);

				// helps to close the bug info tab without errors
				if (this.bugStore.bug?.id === (data.data as Bug).id)
					this.bugStore.init(undefined, "");
			});

			channel.listen(".bug.created", async (data: any) => {
				if (!(data && data.data.type === "Bug")) return console.log(data);

				let newBug = data.data as Bug;

				let status = this.reportsStore.getStatusById(newBug.attributes.status_id);

				if (!status) return;

				let itExists = status?.attributes.bugs?.find((b) => b.id === newBug.id);

				if (itExists) return console.log(`bug.created: bug already in memory.`);

				status.attributes.bugs?.forEach((bug) => {
					if (bug.attributes.order_number >= newBug.attributes.order_number)
						bug.attributes.order_number++;
				});

				status.attributes.bugs?.push(newBug);
			});
		},

		async hookUser() {
			let existing = this.channels.get("user");
			if (existing != undefined) echo.leave(existing);

			if (this.authStore.user === undefined) return;

			const api_channel = `user.${this.authStore.user.id}`;
			let channel = echo.private(api_channel);

			this.channels.set("user", api_channel);

			channel.listen(".members.updated", async (data: any) => {
				await this.organizationStore.fetchUsers();
			});

			channel.listen(".notification.created", (data: any) => {
				console.log(data);
				if (!(data && data.data.type === "Notification")) return console.log(data);
			});
		},
	},

	getters: {},
});
