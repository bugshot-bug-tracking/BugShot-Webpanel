<template>
	<MyModal v-model="modal.show" :close="modal.close" z-10000>
		<ModalTemplate @close="modal.close" style="min-width: 22rem">
			<template #header-text> {{ t("extension_install_hint.title") }} </template>

			<template #content>
				<n-text tag="p" max-w-54ch my-4 text-center>
					{{ t("extension_install_hint.content_1") }}
				</n-text>

				<n-text tag="p" max-w-54ch text-balance my-4 text-center>
					{{ t("extension_install_hint.content_2") }}
				</n-text>

				<div flex-1 flex flex-col items-center my-8>
					<n-text strong text-center>
						{{ t("extension_install_hint.detected_browser") }}
					</n-text>

					<n-button text tag="a" :href="detectedStore.link" target="_blank">
						<div flex flex-col items-center>
							<img :src="detectedStore.image" w-14 m-4 />

							<n-text strong type="primary" underline>
								{{ detectedStore.label }}
							</n-text>
						</div>
					</n-button>
				</div>
			</template>

			<template #footer>
				<n-text tag="p" mt-8 mb-2 text-center>
					<i18n-t keypath="extension_install_hint.wrong_browser" scope="global">
						<RouterLink :to="{ name: 'settings-apps' }">
							<n-button text strong underline type="primary">
								{{ t("extension_install_hint.wrong_browser_0") }}
							</n-button>
						</RouterLink>
					</i18n-t>
				</n-text>

				<div flex-1 flex justify-center>
					<n-checkbox v-model:checked="modal.checkbox">
						<n-text> {{ t("dont_show_again") }}</n-text>
					</n-checkbox>
				</div>
			</template>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import Bowser from "bowser";
import BowserUtils from "bowser/src/utils.js";
import { SettingTypes, SettingValues } from "~/models/Setting";
import { useSettingsStore } from "~/stores/settings";
import { useUserSettingsStore } from "~/stores/userSettings";

const { t } = useI18n();

const store = useSettingsStore();

const browser = Bowser.getParser(window.navigator.userAgent);

const modal = reactive({
	show: false,
	checkbox: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;

		store.setExtensionInstallHint(new Date().toISOString());

		if (modal.checkbox === true) {
			useUserSettingsStore().changeSetting(
				SettingTypes.extension_suggest,
				SettingValues.deactivated
			);
		}
	},
});

let timeoutRef: undefined | NodeJS.Timeout = undefined;

onMounted(() => {
	timeoutRef = setTimeout(() => {
		const now = new Date();

		// Hide modal on non-desktop platforms.
		if (browser.getPlatformType(true) !== "desktop") return (modal.show = false);

		// Hide modal if user already opted out of reminders.
		if (useUserSettingsStore().getExtensionSuggestSetting?.attributes.value)
			return (modal.show = false);

		// Hide modal if the extension is already installed.
		if (document.body.classList.contains("88857183727984")) return (modal.show = false);

		// Show modal if no local record of showing exists.
		if (!store.getExtensionInstallHint) return (modal.show = true);

		// Hide modal if the last showing was less than 24 hours ago.
		if ((now.getTime() - store.getExtensionInstallHint.getTime()) / (1000 * 3600 * 24) < 1)
			return (modal.show = false);

		// Show modal if it's the first day of the month and more than 24 hours passed since the last showing.
		if (now.getDate() === 1) {
			return (modal.show = true);
		}
	}, 1000 * 15);
});

onUnmounted(() => {
	if (timeoutRef != undefined) clearTimeout(timeoutRef);
});

const detectedStore = computed(() => {
	const result = BowserUtils.getBrowserAlias(browser.getBrowserName());

	switch (result) {
		default:
		case "chrome":
		case "chromium":
			return {
				key: "chrome",
				label: t("extension.install_ext_chrome"),
				link: import.meta.env.VITE_EXTENSION_CHROME,
				image: "/src/assets/icons/chrome-logo.svg",
			};
		case "firefox":
			return {
				key: "firefox",
				label: t("extension.install_ext_firefox"),
				link: import.meta.env.VITE_EXTENSION_FIREFOX,
				image: "/src/assets/icons/firefox-logo.svg",
			};
		case "edge":
			return {
				key: "edge",
				label: t("extension.install_ext_edge"),
				link: import.meta.env.VITE_EXTENSION_EDGE,
				image: "/src/assets/icons/edge-logo.svg",
			};
		case "safari":
			return {
				key: "safari",
				label: t("extension.install_ext_safari"),
				link: import.meta.env.VITE_EXTENSION_SAFARI,
				image: "/src/assets/icons/safari-logo.svg",
			};
	}
});
</script>

<style scoped></style>
