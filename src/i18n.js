import { createI18n } from "vue-i18n";
import datetimeFormats from "./config/datetimeFormats";

// TODO Update this to use lazy loading in the future
/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
	const messages = Object.fromEntries(
		Object.entries(import.meta.globEager("./locales/*.json")).map(
			([key, value]) => {
				const json = key.endsWith(".json");
				return [key.slice(10, json ? -5 : -4), value.default];
			}
		)
	);

	return messages;
}

export default createI18n({
	legacy: false,
	globalInjection: true,
	locale: import.meta.env.VITE_I18N_LOCALE || "en",
	fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
	messages: loadLocaleMessages(),
	datetimeFormats: datetimeFormats,
});
