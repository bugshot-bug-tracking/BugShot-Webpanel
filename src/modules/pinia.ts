import { MessageApi } from "naive-ui";
import { createPinia } from "pinia";
import { Composer } from "vue-i18n";
import { Router } from "vue-router";
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { useGlobalI18n } from "~/composables/GlobalI18n";
import { UserModule } from "~/types";

declare module "pinia" {
	export interface PiniaCustomProperties {
		router: Router;
		message: MessageApi;
		i18n: Composer;
	}
}

export const install: UserModule = ({ app, router }) => {
	const pinia = createPinia();

	const { message } = useDiscreteApi();

	pinia.use(({ store }) => {
		store.router = markRaw(router);
		store.message = markRaw(message);
		store.i18n = useGlobalI18n();
	});

	app.use(pinia);
};
