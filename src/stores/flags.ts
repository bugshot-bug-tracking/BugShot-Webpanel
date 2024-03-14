import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useUserSettingsStore } from "./userSettings";
import { SettingValues } from "~/models/Setting";

export const useFlagsStore = defineStore("flags", {
	state: () => ({
		user: useAuthStore().user,
	}),

	actions: {},

	getters: {
		isAdmin: (state) => {
			if (state.user?.id && state.user?.attributes.admin) return true;
			return false;
		},

		// This method checks if a user can access beta features
		canAccessBetaFeatures() {
			// If the user id is not logged in, return false
			if (this.user?.id === undefined) return false;

			// If the user is an admin, return true
			if (this.isAdmin) return true;

			const userStore = useUserSettingsStore();

			// If the there is no beta setting for user return false
			if (userStore.getBetaUserSetting == undefined) return false;

			// Check the value of the beta user setting
			switch (userStore.getBetaUserSetting.attributes.value?.id) {
				// If the setting is deactivated, return false
				case SettingValues.deactivated:
					return false;

				// If the setting is activated, return true
				case SettingValues.activated:
					return true;
			}

			// If none of the above conditions are met, return false
			return false;
		},

		isSpecialUser: (state) => {
			if (
				state.user?.id &&
				(state.user?.attributes.admin || state.users?.some((u) => u === state.user?.id))
			)
				return true;
			return false;
		},
	},
});
