import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useFlagsStore = defineStore("flags", {
	state: () => ({
		user: useAuthStore().user,

		users: [1, 2, 6, 22, 96, 4, 114, 9],
	}),

	actions: {},

	getters: {
		canSeeEverything: (state) => {
			if (state.user?.id) if (state.users.some((u) => u === state.user?.id)) return true;
			return false;
		},

		canEditCompanyTerm: (state) => {
			if (state.user?.id) if (state.users.some((u) => u === state.user?.id)) return true;
			return false;
		},
	},
});
