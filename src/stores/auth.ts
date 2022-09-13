import { defineStore } from "pinia";

import axios from "axios";
import { User } from "~/models/User";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: "",
		user: <User>{},
	}),

	actions: {
		async destroy() {
			this.token = "";
			this.user = <User>{};

			return true;
		},

		async login(payload: { email: string; password: string }) {
			try {
				let response = await axios.post("auth/login", {
					email: payload.email,
					password: payload.password,
				});

				return await this.attempt(response.data.data.token);
			} catch (error) {
				this.token = "";
				localStorage.removeItem("authToken");

				throw error;
			}
		},

		async logout() {
			return (
				axios
					.post("auth/logout")
					// 2xx
					.then((response) => {
						this.destroy();
						return true;
					})
					// 4xx, 5xx
					.catch((error) => {
						//? needs a verification why the error happened if it will happen
						//? 5xx may be a possibility of when you arrive in this block
						return false;
					})
			);
		},

		// validate token by setting the user
		async attempt(token: string) {
			// no point in checking the token if it doesn't exist
			if (token == null || token === "") return false;

			axios.defaults.headers.common["Authorization"] = "Bearer " + token;

			try {
				// test if the token is still valid
				let response = await axios.get("auth/user");

				//if it is set the user and token
				this.user = response.data.data;
				this.token = token;

				// then save it to localStorage
				localStorage.setItem("authToken", token);

				return true;
			} catch (error) {
				//if the token is invalid or it expired set the token from storage to null
				this.destroy();
				axios.defaults.headers.common["Authorization"] = "";
				localStorage.removeItem("authToken");

				return false;
			}
		},

		async updateUser(payload: {
			email: string;
			first_name: string;
			last_name: string;
			password: string;
		}) {
			let response = await axios.put(`/users/${this.user.id}`, {
				first_name: payload.first_name.trim(),
				last_name: payload.last_name.trim(),
				email: payload.email.trim(),

				old_password: payload.password,
			});

			this.user = <User>response.data.data;
		},
	},

	getters: {
		getUser: (state) => state.user,
		isAuthenticated: (state) => (state.token !== "" ? true : false),
	},
});
