import { defineStore } from "pinia";

import { useAuthStore } from "./auth";
import axios from "axios";

export const useNotificationStore = defineStore("notification", {
	state: () => ({
		notifications: [],
	}),

	actions: {
		// fetch all notifications
		async fetchInvitations() {
			const auth = useAuthStore();

			try {
				let notifications = (
					await axios.get(`users/${auth.getUser.id}/invitations`)
				).data.data;

				this.notifications = notifications;
			} catch (error) {
				console.log(error);
			}
		},

		async accept(id) {
			try {
				let user = useAuthStore().getUser;
				let response = await axios.get(
					`users/${user.id}/invitations/${id}/accept`
				);

				this.notifications.splice(this.notifications.indexOf(id), 1);

				return response.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async decline(id) {
			try {
				let user = useAuthStore().getUser;
				let response = await axios.get(
					`users/${user.id}/invitations/${id}/decline`
				);

				this.notifications.splice(this.notifications.indexOf(id), 1);

				return response.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},
	},

	getters: {
		getInvitations: (state) => state.notifications,

		getInvitationById: (state) => (id) =>
			state.notifications.find((x) => (x.id = id)),
	},
});
