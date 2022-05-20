import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

store.dispatch("attempt", localStorage.getItem("authToken"));
store.dispatch("initLocale");

const app = createApp(App);

app.use(store).use(router);

// install all modules under `modules/`
Object.values(import.meta.globEager("./modules/*.js")).forEach((i) =>
	i.install?.(app, router)
);

app.mount("#app");
