import { defineStore } from "pinia";

import { useAuthStore } from "./auth";
import axios from "axios";
import { pusher } from "~/composables/pusher";
import { Invitation } from "~/models/Invitation";

export const useNotificationStore = defineStore("notification", {
	state: () => ({
		user: useAuthStore().user,

		notifications: [] as Invitation[],
	}),

	actions: {
		// fetch all notifications
		async fetchInvitations() {
			try {
				let notifications = (await axios.get(`users/${this.user.id}/invitations`)).data
					.data;

				this.notifications = notifications;
			} catch (error) {
				console.log(error);
			}
		},

		async accept(id: number) {
			try {
				let response = await axios.get(`users/${this.user.id}/invitations/${id}/accept`);

				let index = this.notifications.findIndex((x) => x.id === id);

				if (index !== -1) this.notifications.splice(index, 1);

				return response.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async decline(id: number) {
			try {
				let response = await axios.get(`users/${this.user.id}/invitations/${id}/decline`);

				let index = this.notifications.findIndex((x) => x.id === id);

				if (index !== -1) this.notifications.splice(index, 1);

				return response.data;
			} catch (error) {
				console.log(error);

				throw error;
			}
		},

		async unhook() {
			if (this.user === undefined) return;

			const api_channel = `user.${this.user.id}`;

			const channel = pusher.channel(api_channel);

			if (channel != undefined) {
				channel.unsubscribe();
				channel.unbind_all();
			}
		},

		async hook() {
			if (this.user === undefined) return;

			const api_channel = `user.${this.user.id}`;

			let channel = pusher.subscribe(api_channel);

			channel.bind("invitation.created", (data: any) => {
				if (!(data && data.data.type === "Invitation")) return console.log(data);

				this.fetchInvitations();
			});
		},
	},

	getters: {
		getInvitations: (state) => state.notifications,

		getInvitationById: (state) => (id: number) => state.notifications.find((x) => (x.id = id)),
	},
});
