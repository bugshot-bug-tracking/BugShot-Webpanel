import i18n from "../i18n";

export default {
	state: {
		locale: "en",
		availableLocales: ["en", "de", "ro", "fr"],
	},

	mutations: {
		SET_LOCALE: (state, payload) => {
			state.locale = payload;
		},
	},

	actions: {
		changeLocale: async (state, payload) => {
			console.log(payload);

			console.log(i18n);

			state.commit("SET_LOCALE", payload);
		},
	},

	getters: {
		getLocale: (state) => state.locale,
		getLocales: (state) => state.availableLocales,
	},
};
