import axios from "axios";

import { useAuthStore } from "/src/stores/auth";

export const install = (app, router) => {
	axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
	axios.defaults.headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		clientId: import.meta.env.VITE_CLIENT_ID,
		version: import.meta.env.VITE_VERSION,
	};

	// intercept 401 and redirect to login
	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response?.status === 401) {
				// ignore 401 on login route calls
				if (error.config.url === "auth/login") throw error;

				// clear the local storage then redirect
				useAuthStore().destroy();

				router.push({ name: "Login" });
			}
		}
	);
};
