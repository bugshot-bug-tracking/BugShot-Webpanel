import { createStore } from "vuex";

import axios from "axios";
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
	},
	getters: {},
});
