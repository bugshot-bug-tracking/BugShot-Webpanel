import NProgress from "nprogress";

export const install = (app, router) => {
	router.beforeEach((to, from) => {
		console.log("before");
		if (to.path !== from.path) NProgress.start();
	});

	router.afterEach(() => {
		console.log("after");

		NProgress.done();
	});
};
