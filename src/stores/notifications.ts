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
		async init() {
			try {
				this.$reset();

				await this.fetchNotifications();
			} catch (error) {
				console.log(error);
				throw error;
			}

			return true;
		},

		async fetchNotifications() {
			try {
				let notifications = (await axios.get(`/users/${this.user?.id}/notifications`)).data
					.data;

				this.notifications = notifications;
			} catch (error) {
				console.log(error);
			}
		},

		async acceptInvitation(invite: InvitationReceived, notification_id: string) {
			try {
				let response = await axios.get(
					`users/${this.user?.id}/invitations/${invite.data.id}/accept`
				);

				this.message.info(this.i18n.t("messages.invitation_accepted"));
				invite.status = "accepted";

				await useMainStore().initOrganizations();

				switch (response.status === 200 && invite.data.invited_to_type?.toLowerCase()) {
					case "project":
						this.router.push({
							name: "project",
							params: {
								organization_id: invite.data.invitable.organization_id,
								company_id: invite.data.invitable.company_id,
								project_id: invite.data.invitable.project_id,
							},
						});
						break;

					case "company":
						this.router.push({
							name: "company",
							params: {
								organization_id: invite.data.invitable.organization_id,
								company_id: invite.data.invitable.company_id,
							},
						});
						break;

					case "organization":
						this.router.push({
							name: "organization-home",
							params: {
								organization_id: invite.data.invitable.organization_id,
							},
						});
						break;
				}

				await this.deleteNotification(notification_id);

				return response.data.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async declineInvitation(invite: InvitationReceived, notification_id: string) {
			try {
				let response = (
					await axios.get(`users/${this.user?.id}/invitations/${invite.data.id}/decline`)
				).data.data;

				this.message.info(this.i18n.t("messages.invitation_declined"));
				invite.status = "declined";

				await this.deleteNotification(notification_id);

				return response;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async deleteNotification(notification_id: string) {
			try {
				let response = (
					await axios.delete(`/users/${this.user?.id}/notifications/${notification_id}`)
				).data.data;

				let index = this.notifications.findIndex((n) => n.id === notification_id);
				if (index !== -1) this.notifications.splice(index, 1);

				return response;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async deleteAllNotifications() {
			try {
				let result = await axios.delete(`/users/${this.user?.id}/notifications`);

				await this.fetchNotifications();

				return result;
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
