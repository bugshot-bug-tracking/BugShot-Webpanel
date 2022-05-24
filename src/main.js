import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);

app.use(router);

// install all modules under `modules/`
Object.values(import.meta.globEager("./modules/*.js")).forEach((i) =>
	i.install?.(app, router)
);

useAuthStore()
	.attempt(localStorage.getItem("authToken"))
	.then(() => {
		app.mount("#app");
	});
