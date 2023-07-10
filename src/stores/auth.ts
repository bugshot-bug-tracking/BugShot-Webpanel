import { defineStore } from "pinia";

import axios from "axios";
import { User } from "~/models/User";
import { useHookStore } from "./hooks";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: "",
		user: undefined as User | undefined,
		new_user: undefined as undefined | boolean,
	}),

	actions: {
		async refresh() {
			let response = await axios.get("auth/user", {
				headers: {
					"include-subscriptions": true,
				},
			});

			this.user = response.data.data;
		},

		async login(payload: { email: string; password: string }) {
			try {
				let response = await axios.post("auth/login", {
					email: payload.email,
					password: payload.password,
				});

				this.new_user = response.data.data.new_user;

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
						this.$reset();
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
				let response = await axios.get("auth/user", {
					headers: {
						"include-subscriptions": true,
					},
				});

				//if it is set the user and token
				this.user = response.data.data;
				this.token = token;

				// then save it to localStorage
				localStorage.setItem("authToken", token);

				return true;
			} catch (error) {
				//if the token is invalid or it expired set the token from storage to null
				this.$reset();
				axios.defaults.headers.common["Authorization"] = "";
				localStorage.removeItem("authToken");

				return false;
			} finally {
				useHookStore().hookUser();
			}
		},

		async updateUser(payload: {
			email: string;
			first_name: string;
			last_name: string;
			password: string;
		}) {
			let response = await axios.put(`/users/${this.user?.id}`, {
				first_name: payload.first_name.trim(),
				last_name: payload.last_name.trim(),
				email: payload.email.trim(),

				old_password: payload.password,
			});

			this.user = <User>response.data.data;

			this.message.success(this.i18n.t("messages.user_updated"));
		},

		async register({
			email,
			first_name,
			last_name,
			password,
			confirm_password,
		}: {
			email: string;
			first_name: string;
			last_name: string;
			password: string;
			confirm_password: string;
		}) {
			let response = (
				await axios.post("auth/register", {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: password,
					password_confirmation: confirm_password,
				})
			).data.data;

			console.log(response);

			return response;
		},

		async resendVerification(id: number) {
			let response = (
				await axios.post("/auth/email/verification-notification", {
					user_id: id,
				})
			).data;

			console.log(response);

			return response;
		},

		async verifyEmail({
			id,
			token,
			expires,
			signature,
		}: {
			id: number;
			token: string;
			expires: string;
			signature: string;
		}) {
			let response = (
				await axios.get(
					`/auth/email/verify/${id}/${token}?expires=${expires}&signature=${signature}`
				)
			).data;

			console.log(response);

			return response;
		},

		async recover({ email }: { email: string }) {
			let response = (
				await axios.post(`auth/forgot-password`, {
					email: email,
				})
			).data;

			console.log(response);

			return response;
		},

		async newPassword({
			email,
			token,

			password,
			confirm_password,
		}: {
			email: string;
			token: string;

			password: string;
			confirm_password: string;
		}) {
			let response = (
				await axios.post("auth/reset-password", {
					email: atob(email),
					token: token,
					password: password,
					password_confirmation: confirm_password,
				})
			).data.data;

			console.log(response);

			return response;
		},

		async deleteUser() {
			if (this.user === undefined) throw new Error('User not set in "auth" store!');

			let response = await axios.delete(`users/${this.user.id}`);

			this.logout();

			return response;
		},
	},

	getters: {
		getUser: (state) => state.user,
		isAuthenticated: (state) => (state.token !== "" ? true : false),
		getLicenses: (state) => state.user?.attributes.subscriptions ?? [],
	},
});
