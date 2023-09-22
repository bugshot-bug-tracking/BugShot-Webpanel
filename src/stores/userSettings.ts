import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { Setting, SettingTypes, SettingValues } from "~/models/Setting";
import { useI18nStore } from "./i18n";

export const useUserSettingsStore = defineStore("user-settings", {
	state: () => ({
		settings: undefined as Setting[] | undefined,

		user: useAuthStore().user,
	}),

	actions: {
		async init() {
			if (!this.user?.id) return;

			let response = (await axios.get(`/users/${this.user.id}/settings`)).data
				.data as Setting[];

			this.settings = response;
		},

		async applySettings() {
			let language = this.getUserLanguage?.attributes.value?.attributes.designation;

			if (language) useI18nStore().setLocale(language);
		},

		async changeSetting(setting: SettingTypes, value: SettingValues) {
			let response = (
				await axios.put(`/users/${this.user?.id}/settings/${setting}`, {
					value_id: value,
				})
			).data.data as Setting;

			const oldSetting = this.settings!.find((s) => s.id === response.id)!;

			Object.assign(oldSetting.attributes, response.attributes);
		},
	},

	getters: {
		getUserLanguage: (state) =>
			state.settings?.find(
				(s) => s.attributes.setting.id === SettingTypes.user_settings_interface_language
			),

		getTourStatus: (state) =>
			state.settings?.find((s) => s.attributes.setting.id === SettingTypes.tour_status),
	},
});
