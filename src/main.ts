import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "vue-select/dist/vue-select.css";
import "uno.css";

const app = createApp(App);

app.use(router);

// install all modules under `modules/`
Object.values(import.meta.globEager("./modules/*.ts")).forEach((i) =>
	i.install?.({ app, router })
);

useAuthStore()
	.attempt(localStorage.getItem("authToken") || "")
	.then(() => {
		app.mount("#app");
	});
