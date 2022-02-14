import axios from "axios";

export default {
	state: {
		token: null,
		user: {},
	},

	mutations: {
		SET_TOKEN: (state, payload) => {
			state.token = payload;
		},

		SET_USER: (state, payload) => {
			state.user = payload;
		},
	},

	// api calls
	actions: {
		auth_destroy: async (state, payload) => {
			state.commit("SET_TOKEN", null);
			state.commit("SET_USER", {});
			return true;
		},

		login: async (state, payload) => {
			return (
				axios
					.post("auth/login", {
						email: payload.email,
						password: payload.password,
					})
					// 2xx
					.then((response) => {
						return state.dispatch(
							"attempt",
							response.data.data.token
						);
					})
					// 4xx, 5xx
					.catch((error) => {
						state.commit("SET_TOKEN", null);
						throw error;
					})
			);
		},

		logout: async (state, payload) => {
			return (
				axios
					.post("auth/logout")
					// 2xx
					.then((response) => {
						state.dispatch("destroy");

						return true;
					})
					// 4xx, 5xx
					.catch((error) => {
						//? needs a verification why the error happened if it will happen
						//? 5xx may be a posibility of when you arrife in this block
						return false;
					})
			);
		},

		// validate token by setting the user
		attempt: async (state, payload) => {
			state.commit("SET_TOKEN", payload);

			// no point in checking the token if it doesn't exist
			if (payload == null) return false;

			try {
				// test if the token from storage is still valid
				let response = await axios.post("auth/user");

				//if it it set the user
				state.commit("SET_USER", response.data.data);

				return true;
			} catch (error) {
				//if the token is invalid or it expired set the token and user from storage to null
				state.commit("SET_TOKEN", null);
				state.commit("SET_USER", null);
			}

			return false;
		},
	},

	getters: {
		getUser: (state) => state.user,
		isAuthenticated: (state) => (state.token ? true : false),
	},
};
