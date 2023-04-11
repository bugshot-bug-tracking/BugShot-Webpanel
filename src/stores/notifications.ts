import { defineStore } from "pinia";

import { useAuthStore } from "./auth";
import axios from "axios";
import { echo } from "~/composables/listeners";
import { Invitation } from "~/models/Invitation";
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { useGlobalI18n } from "~/composables/GlobalI18n";

export const useNotificationStore = defineStore("notification", {
	state: () => ({
		user: useAuthStore().user,

		notifications: [] as Invitation[],
	}),

	actions: {
		// fetch all notifications
		async fetchInvitations() {
			try {
				this.unhook();
				let notifications = (
					await axios.get(`users/${this.user?.id}/invitations`, {
						headers: {
							"include-organization-id": true,
						},
					})
				).data.data;

				this.notifications = notifications;

				this.hook();
			} catch (error) {
				console.log(error);
			}
		},

		async accept(id: number) {
			try {
				let response = await axios.get(`users/${this.user?.id}/invitations/${id}/accept`);

				let item = this.notifications.find((x) => x.id === id);

				if (item) item.status = "accepted";

				const { message } = useDiscreteApi();
				// @ts-ignore
				const { t } = useGlobalI18n();

				message.info(t("messages.invitation_accepted"));

				return response.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async decline(id: number) {
			try {
				let response = await axios.get(`users/${this.user?.id}/invitations/${id}/decline`);

				let item = this.notifications.find((x) => x.id === id);

				if (item) item.status = "declined";

				const { message } = useDiscreteApi();
				// @ts-ignore
				const { t } = useGlobalI18n();

				message.info(t("messages.invitation_declined"));

				return response.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async unhook() {
			if (this.user === undefined) return;

			const api_channel = `user.${this.user.id}`;

			echo.leave(api_channel);
		},

		async hook() {
			if (this.user === undefined) return;

			const api_channel = `user.${this.user.id}`;

			let channel = echo.private(api_channel);

			channel.listen(".invitation.created", (data: any) => {
				if (!(data && data.data.type === "Invitation")) return console.log(data);

				this.fetchInvitations();
			});
		},
	},

	getters: {
		getInvitations: (state) => state.notifications,

		getInvitationById: (state) => (id: number) => state.notifications.find((x) => (x.id = id)),

		getPendingInvitations: (state) => state.notifications.filter((i) => i.status == undefined),
	},
});
