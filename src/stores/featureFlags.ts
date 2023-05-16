import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useFeatureFlagsStore = defineStore("featureFlags", {
	state: () => ({
		users: [1, 2, 6, 22, 96, 4, 114, 9],
	}),

	actions: {},

	getters: {
		canSeeEverything: (state) => {
			let user = useAuthStore().user;

			if (user?.id) if (state.users.some((u) => u === user?.id)) return true;
			return false;
		},
	},
});
