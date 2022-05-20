import { createStore } from "vuex";

import data from "./data";
import i18n from "./i18n";
import kanban from "./kanban";

export default createStore({
	modules: {
		data,
		i18n,
		kanban,
	},

	state: {},
	mutations: {},
	actions: {
		start: async (state, payload) => {
			state.dispatch("init");
		},

		destroy: async (state, payload) => {
			state.dispatch("data_destroy");
		},
	},
	getters: {},
});
