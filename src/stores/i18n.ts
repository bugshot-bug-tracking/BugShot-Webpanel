import { defineStore } from "pinia";

import axios from "axios";
import { useI18n } from "vue-i18n";

export const useI18nStore = defineStore("i18n", {
	state: () => ({
		locale: import.meta.env.VITE_I18N_LOCALE || "en",
		supportedLocales: useI18n().availableLocales,
		auto_locale: "en",
		globalI18n: useI18n(),
	}),

	actions: {
		init() {
			let localStorageLocale = localStorage.getItem("locale");

			if (!localStorageLocale) {
				localStorageLocale = "auto";
				localStorage.setItem("locale", "auto");
			}

			this.setLocale(localStorageLocale);
		},

		setLocale(payload: string) {
			let locale = payload;

			if (payload.toLowerCase() === "auto") {
				let autoLoc = this.determineLocale();
				if (autoLoc) this.auto_locale = autoLoc;

				// if locale is null use the default
				locale = autoLoc || import.meta.env.VITE_I18N_LOCALE || "en";
			}

			document.querySelector("html")?.setAttribute("lang", locale);
			this.globalI18n.locale = locale;

			this.locale = payload;

			localStorage.setItem("locale", payload);
			axios.defaults.headers.common["locale"] = locale;
		},

		determineLocale() {
			// if no language list could be found
			if (navigator.languages === undefined) {
				// if no language could be found return null to indicate use of default
				if (navigator.language === undefined) return null;
				// if the language detected does not have a translation file return null to indicate use of default
				if (
					!this.supportedLocales.find(
						(x) =>
							x.toLowerCase() ===
							navigator.language.trim().split(/-|_/)[0]
					)
				)
					return null;

				// else return the language code
				return navigator.language.trim().split(/-|_/)[0];
			}

			// if a language list could be found iterate until finding a language that has a translation file
			for (const language of navigator.languages) {
				if (
					this.supportedLocales.find(
						(x) =>
							x.toLowerCase() === language.trim().split(/-|_/)[0]
					)
				)
					return language.trim().split(/-|_/)[0];
			}

			// return null to indicate default use
			return null;
		},
	},

	getters: {
		getLocale: (state) => state.locale,
		getAutoLocale: (state) => state.auto_locale,
		getSupportedLocales: (state) => state.supportedLocales,
		getCurrentLocale: (state) =>
			!state.locale || state.locale.toLowerCase() === "auto"
				? state.auto_locale
				: state.locale,
	},
});
