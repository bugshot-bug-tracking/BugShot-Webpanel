import { createPinia } from "pinia";

export const install = (app, router) => {
	const pinia = createPinia();

	app.use(pinia);
};
