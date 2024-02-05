import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { Setting, SettingTypes, SettingValues } from "~/models/Setting";
import { useI18nStore } from "./i18n";
import { useFlagsStore } from "./flags";

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

		async changeSetting(setting: number, value: SettingValues) {
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

		getNotificationsSelection: (state) =>
			state.settings?.find(
				(setting) =>
					setting.attributes.setting.id ===
					SettingTypes.user_settings_select_notifications
			),

		getCustomNotificationsSettings(): {
			id: number;
			setting: {
				id: SettingTypes;
				name: string;
			};
			value: {
				id: SettingValues;
				name: string;
			};
		}[] {
			let list =
				this.settings
					?.filter((s) =>
						s.attributes.setting.attributes.designation.match(/^custom_notification/i)
					)
					.map((entry) => ({
						id: entry.id,
						setting: {
							id: entry.attributes.setting.id,
							name: entry.attributes.setting.attributes.designation,
						},
						value: entry.attributes.value
							? {
									id: entry.attributes.value.id,
									name: entry.attributes.value.attributes.designation,
							  }
							: {
									id: SettingValues.deactivated,
									name: "deactivated",
							  },
					})) ?? [];

			if (useFlagsStore().isSpecialUser) return list;

			return list.filter((entry) =>
				this.i18n.te(
					`user_settings.advanced_page.notifications.custom_notifications_options.${entry.setting.name}`
				)
			);
		},
	},
});
