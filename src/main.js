import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";

require("./store/subscriber");

axios.defaults.baseURL = "http://165.232.70.214/api/v1/";
axios.defaults.headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

store.dispatch("attempt", localStorage.getItem("authToken"));

createApp(App).use(store).use(router).mount("#app");
