import { defineStore } from "pinia";

import { useAuthStore } from "./auth";
import axios from "axios";
import { Notification } from "~/models/Notification";
import { InvitationReceived } from "~/models/NotificationTypes/InvitationReceived";
import { useMainStore } from "./main";

export const useNotificationStore = defineStore("notification", {
	state: () => ({
		user: useAuthStore().user,

		notifications: [] as Notification[],
	}),

	actions: {
		async fetchNotifications() {
			try {
				let notifications = (await axios.get(`/users/${this.user?.id}/notifications`)).data
					.data;

				this.notifications = notifications;
			} catch (error) {
				console.log(error);
			}
		},

		async acceptInvitation(invite: InvitationReceived) {
			try {
				let response = (
					await axios.get(`users/${this.user?.id}/invitations/${invite.data.id}/accept`)
				).data.data;

				this.message.info(this.i18n.t("messages.invitation_accepted"));
				invite.status = "accepted";

				await useMainStore().initOrganizations();

				switch (invite.data.invitable?.toLowerCase()) {
					case "project":
						this.router.push({
							name: "project",
							params: {
								organization_id: invite.data.organization_id,
								company_id: invite.data.company_id,
								project_id: invite.data.project_id,
							},
						});
						break;

					case "company":
						this.router.push({
							name: "company",
							params: {
								organization_id: invite.data.organization_id,
								company_id: invite.data.company_id,
							},
						});
						break;

					case "organization":
						this.router.push({
							name: "organization-home",
							params: {
								organization_id: invite.data.organization_id,
							},
						});
						break;
				}

				return response;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async declineInvitation(invite: InvitationReceived) {
			try {
				let response = (
					await axios.get(`users/${this.user?.id}/invitations/${invite.data.id}/decline`)
				).data.data;

				this.message.info(this.i18n.t("messages.invitation_declined"));
				invite.status = "declined";

				return response;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},
	},

	getters: {
		getNotifications: (state) => state.notifications,
	},
});
