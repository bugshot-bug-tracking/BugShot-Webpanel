import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import Home from "../views/Home.vue";
import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import Recover from "../views/Auth/Recover.vue";
import NotFound from "../views/NotFound.vue";
import Auth from "../views/Auth/Auth.vue";
import EmptyView from "../views/Main/EmptyView.vue";

import CompanyNavSidebar from "../views/Main/Company/NavSidebar.vue";
import CompanyProjects from "../views/Main/Company/CompanyProjects.vue";
import Project from "../views/Main/Project/Project.vue";

import UserSettings from "../views/Main/User/Settings.vue";
import UserSettingsSidebar from "../views/Main/User/SettingsSidebar.vue";
import CompanySettings from "../views/Main/Company/Settings.vue";
import CompanySettingsSidebar from "../views/Main/Company/SettingsSidebar.vue";
import CompanyInvoices from "../views/Main/Company/Invoices.vue";

import ProjectSettings from "../views/Main/Project/Settings.vue";
import ProjectSettingsSidebar from "../views/Main/Project/SettingsSidebar.vue";

import AllProjects from "../views/Main/Project/All.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
		redirect: { name: "ViewMode" },
		children: [
			{
				path: "",
				name: "ViewMode",
				components: {
					default: EmptyView,
					sidebar: CompanyNavSidebar,
				},
				redirect: { name: "allProjects" },
				children: [
					{
						path: "",
						name: "allProjects",
						component: AllProjects,
					},
					{
						path: "company/:id",
						name: "CompanyProjects",
						component: CompanyProjects,
						props: true,
					},

					{
						path: "project/:id",
						name: "Project",
						component: Project,
						props: true,
					},
				],
			},

			{
				path: "settings",
				name: "UserSettings",
				components: {
					default: UserSettings,
					sidebar: UserSettingsSidebar,
				},
			},

			{
				path: "settings/company/:id",
				name: "CompanySettings",
				components: {
					default: EmptyView,
					sidebar: CompanySettingsSidebar,
				},
				redirect: { name: "CompanyGeneral" },
				children: [
					{
						path: "",
						name: "CompanyGeneral",
						component: CompanySettings,
						props: true,
					},
					{
						path: "invoices",
						name: "CompanyInvoices",
						component: CompanyInvoices,
						props: true,
					},
				],
			},

			{
				path: "settings/project/:id",
				name: "ProjectSettings",
				components: {
					default: ProjectSettings,
					sidebar: ProjectSettingsSidebar,
				},
				props: true,
			},
		],
		meta: {
			requiresAuth: true,
		},
	},

	{
		path: "/auth",
		name: "auth",
		component: Auth,
		redirect: { name: "Login" },
		children: [
			{
				path: "login",
				name: "Login",
				component: Login,
			},

			{
				path: "register",
				name: "Register",
				component: Register,
			},

			{
				path: "recover",
				name: "Recover",
				component: Recover,
			},
		],
	},

	{
		path: "/:catchAll(.*)",
		name: "NotFound",
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (store.getters.isAuthenticated) {
			next();
			return;
		}
		next({ name: "Login" });
	} else {
		next();
	}
});

export default router;
