import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
import i18n from "./i18n";

require("./store/subscriber");

axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT;
axios.defaults.headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	clientId: process.env.VUE_APP_CLIENT_ID,
	version: process.env.VUE_APP_VERSION,
};

store.dispatch("attempt", localStorage.getItem("authToken"));
store.dispatch("initLocale");

createApp(App).use(i18n).use(store).use(router).mount("#app");
