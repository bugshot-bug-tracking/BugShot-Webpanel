import { createRouter, createWebHistory } from "vue-router";

import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { useI18nStore } from "./stores/i18n";

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	if (
		to.query.lang != undefined &&
		typeof to.query.lang === "string" &&
		["auto", "en", "de"].includes(to.query.lang)
	) {
		try {
			localStorage.setItem("locale", to.query.lang);

			useI18nStore().setLocale(to.query.lang);
		} catch (error) {
			console.log(error);
		}
	}

	//? does the route have auth requirement
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		// if the user is authenticated continue
		if (localStorage.getItem("authToken")) next();
		// else redirect to login
		else next({ name: "login" });
	} else {
		next();
	}
});

export default router;
