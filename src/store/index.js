import { createStore } from "vuex";

import auth from "./auth";
import data from "./data";

export default createStore({
	modules: { auth, data },

	state: {},
	mutations: {},
	actions: {
		start: async (state, payload) => {
			state.dispatch("init");
		},

		destroy: async (state, payload) => {
			state.dispatch("auth_destroy");
			state.dispatch("data_destroy");
		},
	},
	getters: {},
});
