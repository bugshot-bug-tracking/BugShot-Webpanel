<template>
	<MyModal v-model="modal.show" :close="modal.close" z-10000>
		<ModalTemplate @close="modal.close" style="min-width: 22rem">
			<template #header-text> {{ t("extension_install_hint.title") }} </template>

			<template #content>
				<n-text tag="p" max-w-54ch text-balance my-4>
					{{ t("extension_install_hint.content") }}
				</n-text>
			</template>

			<template #footer>
				<div flex justify-center mt-4>
					<n-button
						type="success"
						round
						@click=""
						tag="a"
						:href="storeLink"
						target="_blank"
					>
						{{ t("extension_install_hint.action") }}
					</n-button>
				</div>
			</template>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { detect } from "detect-browser";
import { NButton } from "naive-ui";
import { useSettingsStore } from "~/stores/settings";

const { t } = useI18n();

const store = useSettingsStore();

const modal = reactive({
	show: true,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;

		store.setExtensionInstallHint(false);
	},
});

onMounted(() => {
	if (
		document.body.classList.contains("88857183727984") ||
		store.getExtensionInstallHint === false
	)
		modal.show = false;
	else modal.show = true;
});

const storeLink = computed(() => {
	const result = detect();

	switch (result?.name) {
		default:
		case "chrome":
			return import.meta.env.VITE_EXTENSION_CHROME;
		case "firefox":
			return import.meta.env.VITE_EXTENSION_FIREFOX;
		case "edge-chromium":
			return import.meta.env.VITE_EXTENSION_EDGE;
		case "safari":
			return import.meta.env.VITE_EXTENSION_SAFARI;
	}
});
</script>

<style scoped></style>
