import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"~/": `${path.resolve(__dirname, "src")}/`,
		},
	},
	plugins: [
		vue(),

		// https://github.com/antfu/unplugin-auto-import
		AutoImport({
			imports: [
				"vue",
				"vue-router",
				"vue-i18n",
				"@vueuse/head",
				// "@vueuse/core",
			],
			dts: "src/auto-imports.d.ts",
		}),

		// https://github.com/antfu/unplugin-vue-components
		Components({
			dirs: ["src/components", "src/templates"],
			// allow auto load markdown components under `./src/components/`
			extensions: ["vue"],
			// allow auto import and register components used in markdown
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			dts: "src/components.d.ts",
		}),

		Pages({
			extensions: ["vue"],
			extendRoute(route, parent) {
				if (
					route.name === "all" ||
					String(route.path).match(/^\/auth/i)
				) {
					// Index is unauthenticated.
					return route;
				}

				// Augment the route with meta that indicates that the route requires authentication.
				return {
					...route,
					meta: { ...route.meta, requiresAuth: true },
				};
			},
		}),

		Layouts(),
	],
});
