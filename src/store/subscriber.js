import axios from "axios";
import store from ".";
import router from "../router";

store.subscribe((mutations) => {
	switch (mutations.type) {
		case "SET_TOKEN":
			// if token was invalid or expired remove it from headers and storage
			if (mutations.payload == null) {
				axios.defaults.headers["Authorization"] = "";
				localStorage.removeItem("authToken");
				return;
			}

			// set the token as an axios header and save it to localStorage
			localStorage.setItem("authToken", mutations.payload);
			axios.defaults.headers["Authorization"] =
				"Bearer " + mutations.payload;

			break;

		case "SET_LOCALE":
			// set the locale for use after reload
			localStorage.setItem("locale", mutations.payload);

			// set the locale for api calls
			axios.defaults.headers["locale"] = mutations.payload;

			break;

		default:
			break;
	}
});

// intercept 401 and redirect to login
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			// clear the localstorage then redirect
			store.commit("SET_TOKEN", null);
			store.dispatch("destroy");

			router.push({ name: "Login" });
		}
		throw error;
	}
);
