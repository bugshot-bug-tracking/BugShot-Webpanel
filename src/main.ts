import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "uno.css";
import { UserModule } from "./types";

const app = createApp(App);

app.use(router);

// install all modules under `modules/`
Object.values(import.meta.glob<{ install: UserModule }>("./modules/*.ts", { eager: true })).forEach(
	(i) => i.install?.({ app, router })
);

app.mount("#app");
