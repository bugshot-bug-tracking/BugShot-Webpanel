import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";

require("./store/subscriber");

axios.defaults.baseURL = "https://dev-api.bugshot.de/api/v1";
axios.defaults.headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	clientId: "1",
	version: "1.0.0",
};

store.dispatch("attempt", localStorage.getItem("authToken"));

createApp(App).use(store).use(router).mount("#app");
