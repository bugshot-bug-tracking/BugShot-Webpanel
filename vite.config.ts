import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"src/": `${path.resolve(__dirname, "src")}/`,
			"~/": `${path.resolve(__dirname, "src")}/`,
		},
	},
	plugins: [
		vue(),

		// https://github.com/antfu/unplugin-auto-import
		AutoImport({
			imports: ["vue", "vue-router", "vue-i18n"],
			dts: "src/auto-imports.d.ts",
		}),

		// https://github.com/antfu/unplugin-vue-components
		Components({
			// allow auto load markdown components under `./src/components/`
			extensions: ["vue", "md"],
			// allow auto import and register components used in markdown
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			dts: "src/components.d.ts",
		}),
	],
});
