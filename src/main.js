import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";

require("./store/subscriber");

axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT;
axios.defaults.headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	clientId: process.env.VUE_APP_CLIENT_ID,
	version: process.env.VUE_APP_VERSION,
};

store.dispatch("attempt", localStorage.getItem("authToken"));

createApp(App).use(store).use(router).mount("#app");
