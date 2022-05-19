import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
import i18n from "./i18n";

import vSelect from "vue-select";
import Datepicker from "@vuepic/vue-datepicker";

// require("./store/subscriber");

axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {
	Accept: "application/json",
	"Content-Type": "application/json",
	clientId: import.meta.env.VITE_CLIENT_ID,
	version: import.meta.env.VITE_VERSION,
};

store.subscribe((mutations) => {
	switch (mutations.type) {
		case "SET_TOKEN":
			// if token was invalid or expired remove it from headers and storage
			if (mutations.payload == null) {
				axios.defaults.headers.common["Authorization"] = "";
				localStorage.removeItem("authToken");
				return;
			}

			// set the token as an axios header and save it to localStorage
			localStorage.setItem("authToken", mutations.payload);
			axios.defaults.headers.common["Authorization"] =
				"Bearer " + mutations.payload;

			break;

		case "SET_LOCALE":
			// set the locale for use after reload
			localStorage.setItem("locale", mutations.payload);

			// set the locale for api calls
			axios.defaults.headers.common["locale"] = mutations.payload;

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

store.dispatch("attempt", localStorage.getItem("authToken"));
store.dispatch("initLocale");

const app = createApp(App);

app.use(i18n).use(store).use(router);

app.component("v-select", vSelect);
app.component("Datepicker", Datepicker);

app.mount("#app");
