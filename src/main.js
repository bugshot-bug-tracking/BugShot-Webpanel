import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "vue-select/dist/vue-select.css";

import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const routes = setupLayouts(generatedRoutes);

console.dir(routes);

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
