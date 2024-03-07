import { createI18n } from "vue-i18n";
import datetimeformat from "~/config/datetimeFormats";
import { UserModule } from "~/types";
import messages from "@intlify/unplugin-vue-i18n/messages";

const instance = createI18n({
	locale: import.meta.env.VITE_I18N_LOCALE || "en",
	fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
	messages: messages,
	datetimeFormats: datetimeformat,
});

export const install: UserModule = ({ app }) => {
	app.use(instance);
};

export const globalI18nInstance = instance.global;
