import i18n from "../i18n";
import supportedLocales from "../config/supported-locales";

export default {
	state: {
		locale: process.env.VUE_APP_I18N_LOCALE,
		supportedLocales: [],
	},

	mutations: {
		SET_LOCALE: (state, payload) => {
			state.locale = payload;
		},
		SET_SUPPORTED_LOCALES: (state, payload) => {
			state.supportedLocales = payload;
		},
	},

	actions: {
		// TODO create auto detect locale code
		initLocale: (state) => {
			let list = [];

			for (const locale of Object.keys(supportedLocales)) {
				list.push({
					code: locale,
					name: supportedLocales[locale],
				});
			}

			state.commit("SET_SUPPORTED_LOCALES", list);

			let localStorageLocale = localStorage.getItem("locale");

			if (
				!localStorageLocale ||
				!supportedLocales.hasOwnProperty(localStorageLocale)
			) {
				localStorageLocale = process.env.VUE_APP_I18N_LOCALE;
			}

			state.commit("SET_LOCALE", localStorageLocale);

			i18n.global.locale.value = localStorageLocale;

			document
				.querySelector("html")
				.setAttribute("lang", localStorageLocale);
		},

		setLocale: async (state, payload) => {
			document.querySelector("html").setAttribute("lang", payload);

			console.log(payload);

			i18n.global.locale.value = payload;
			state.commit("SET_LOCALE", payload);
		},
	},

	getters: {
		getLocale: (state) => state.locale,
		getSupportedLocales: (state) => state.supportedLocales,
	},
};
