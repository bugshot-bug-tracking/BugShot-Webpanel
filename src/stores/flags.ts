import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useFlagsStore = defineStore("flags", {
	state: () => ({
		user: useAuthStore().user,

		users: import.meta.env.VITE_SPECIAL_USERS?.split(", ").map((x: string) => Number(x)) as
			| number[]
			| undefined,
	}),

	actions: {},

	getters: {
		canSeeEverything: (state) => {
			if (state.user?.id) if (state.users?.some((u) => u === state.user?.id)) return true;
			return false;
		},

		canEditCompanyTerm: (state) => {
			if (state.user?.id) if (state.users?.some((u) => u === state.user?.id)) return true;
			return false;
		},
	},
});
