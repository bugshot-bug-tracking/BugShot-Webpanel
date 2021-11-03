import { createStore } from "vuex";

import axios from "axios";

axios.defaults.baseURL = "http://165.232.70.214/api/v1/";
axios.defaults.headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

axios.interceptors.request.use(
	(config) => {
		let token = localStorage.getItem("authtoken");

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},

	(error) => {
		return Promise.reject(error);
	}
);

export default createStore({
	state: {
		auth: {},
		companies: [],
		projects: [],
		active: {
			company: 0,
		},
	},
	mutations: {
		SET_AUTH: (state, payload) => {
			state.auth = payload;
		},
		SET_COMPANIES: (state, payload) => {
			state.companies = payload;
		},
		SET_ACTIVE_COMPANY: (state, payload) => {
			state.active.company = payload;
		},
	},
	actions: {
		// api calls
		login: (state, payload) => {
			return new Promise((resolve, reject) => {
				axios
					.post("auth/login", {
						email: payload.email,
						password: payload.password,
					})
					// 2xx
					.then((response) => {
						state.commit("SET_AUTH", response.data.data);
						axios.defaults.headers["Authorization"] =
							"Bearer " + response.data.data.token;
						localStorage.setItem(
							"authtoken",
							response.data.data.token
						);
						resolve(true);
					})
					// 4xx, 5xx
					.catch((error) => {
						console.log(error);

						reject(error);
					});
			});
		},
		user: (state, payload) => {
			return new Promise((resolve, reject) => {
				axios
					.post("auth/user")
					.then((response) => {
						resolve(response.data.data);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

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
	modules: {},
	getters: {
		getUser: (state) => state.auth?.user,
		getCompanies: (state) => state.companies,
		getActiveCompany: (state) =>
			state.companies.find(
				(record) => record.company.id === state.active.company
			)?.company,
	},
});
