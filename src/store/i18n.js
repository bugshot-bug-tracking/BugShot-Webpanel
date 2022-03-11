import i18n from "../i18n";
import supportedLocales from "../config/supported-locales";
import axios from "axios";

export default {
	state: {
		locale: process.env.VUE_APP_I18N_LOCALE,
		supportedLocales: [],
		auto_locale: null,
	},

	mutations: {
		SET_LOCALE: (state, payload) => {
			state.locale = payload;
		},
		SET_SUPPORTED_LOCALES: (state, payload) => {
			state.supportedLocales = payload;
		},
		SET_AUTO_LOCALE: (state, payload) => {
			state.auto_locale = payload;
		},
	},

	actions: {
		initLocale: (state) => {
			state.dispatch("setSupportedLocales");

			let localStorageLocale = localStorage.getItem("locale");

			if (!localStorageLocale) localStorageLocale = "auto";

			state.dispatch("setLocale", localStorageLocale);
		},

		setLocale: async (state, payload) => {
			let locale = payload;

			if (payload.toLowerCase() === "auto") {
				let autoLoc = await state.dispatch("determineLocale");

				state.commit("SET_AUTO_LOCALE", autoLoc);

				// if locale is null use the default
				locale = autoLoc ? autoLoc : process.env.VUE_APP_I18N_LOCALE;
			}

			document.querySelector("html").setAttribute("lang", locale);

			i18n.global.locale.value = locale;
			state.commit("SET_LOCALE", payload);

			axios.defaults.headers["locale"] = locale;
		},

		setSupportedLocales: (state) => {
			let list = [];

			for (const locale of Object.keys(supportedLocales)) {
				list.push({
					code: locale,
					name: supportedLocales[locale],
				});
			}

			state.commit("SET_SUPPORTED_LOCALES", list);
		},

		determineLocale: (state) => {
			// if no language list could be found
			if (navigator.languages === undefined) {
				// if no language could be found return null to indicate use of default
				if (navigator.language === undefined) return null;

				// if the langauge detected does not have a translation file return null to indicate use of default
				if (
					!supportedLocales.hasOwnProperty(
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
					supportedLocales.hasOwnProperty(
						language.trim().split(/-|_/)[0]
					)
				)
					return language.trim().split(/-|_/)[0];
			}

			// return null to indicate defaul use
			return null;
		},
	},

	getters: {
		getLocale: (state) => state.locale,
		getAutoLocale: (state) => state.auto_locale,
		getSupportedLocales: (state) => state.supportedLocales,
	},
};
