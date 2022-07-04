import NProgress from "nprogress";
import { UserModule } from "~/types";

export const install: UserModule = ({ router }) => {
	router.beforeEach((to, from) => {
		if (to.path !== from.path) NProgress.start();
	});

	router.afterEach(() => {
		NProgress.done();
	});
};
