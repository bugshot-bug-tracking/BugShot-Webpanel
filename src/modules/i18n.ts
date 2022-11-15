import { createI18n } from "vue-i18n";
import datetimeFormats from "~/../locales/datetimeFormats";
import { UserModule } from "~/types";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

/**
 *  Import i18n resources
 *  https://vitejs.dev/guide/features.html#glob-import
 *
 *  Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
 *  manual method of importing raw filles and compiling at runtime
 */

// const messages = Object.fromEntries(
// 	Object.entries(import.meta.glob("/locales/*.json", { eager: true })).map(([key, value]) => {
// 		const json = key.endsWith(".json");
// 		return [key.slice(9, json ? -5 : -4), (value as any).default];
// 	})
// );

/// pre-compiled messages from vite

export const install: UserModule = ({ app }) => {
	const i18n = createI18n({
		legacy: false,
		globalInjection: true,
		locale: import.meta.env.VITE_I18N_LOCALE || "en",
		fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
		messages: messages,
		datetimeFormats: datetimeFormats,
	});

	app.use(i18n);
};
