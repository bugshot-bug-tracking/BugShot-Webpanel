import { createStore } from "vuex";

import axios from "axios";
import auth from "./auth";

export default createStore({
	state: {
		companies: [],
		projects: [],
		active: {
			company: 0,
		},
	},
	mutations: {
		SET_COMPANIES: (state, payload) => {
			state.companies = payload;
		},
		SET_ACTIVE_COMPANY: (state, payload) => {
			state.active.company = payload;
		},
	},
	actions: {
		companies: (state, payload) => {
			return new Promise((resolve, reject) => {
				axios
					.get("user/companies")
					.then((response) => {
						state.commit("SET_COMPANIES", response.data.data);

						resolve(response.data.data);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

		makeActiveCompany: (state, payload) => {
			return new Promise((resolve, reject) => {
				axios
					.get(`company/${payload}/projects`)
					.then((response) => {
						state.state.companies.find(
							(record) => record.company.id === payload
						).company["projects"] = response.data;

						state.commit("SET_ACTIVE_COMPANY", payload);

						resolve(true);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
	},
	modules: { auth },
	getters: {
		getCompanies: (state) => state.companies,
		getActiveCompany: (state) =>
			state.companies.find(
				(record) => record.company.id === state.active.company
			)?.company,
	},
});
