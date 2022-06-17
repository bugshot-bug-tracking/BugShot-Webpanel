import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "src/stores/auth";

import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	//? does the route have auth requirement
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		// if the user is authenticated continue
		if (useAuthStore().isAuthenticated || localStorage.getItem("authToken"))
			next();
		// else redirect to login
		else next({ name: "Login" });
	} else {
		next();
	}
});

export default router;
