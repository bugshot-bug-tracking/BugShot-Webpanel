<template>
	<div class="announcement" v-if="visible">
		<div />

		<div>
			<p>{{ t("new_version_released") }}!</p>
			<p>{{ t("banner_info") }}</p>
		</div>

		<img
			src="/src/assets/icons/close_2.svg"
			alt="close"
			:title="t('close')"
			@click="acknowledge"
			cursor-pointer
		/>
	</div>
</template>

<script setup lang="ts">
import { version } from "~/../package.json";
import { useLocalStorage } from "@vueuse/core";

let local = useLocalStorage("new_version", version);
let visibility = useLocalStorage("new_version_visibility", true);

onMounted(() => {
	if (local.value !== version) {
		visibility.value = true;
	}
});

const visible = computed(() => visibility.value);

const acknowledge = () => {
	local.value = version;
	visibility.value = false;
};

const { t } = useI18n({
	inheritLocale: true,
});
</script>

<style lang="scss" scoped>
.announcement {
	position: absolute;
	width: 100%;
	top: 0;
	left: 0;
	display: flex;
	background-color: hsl(32deg, 100%, 67%);
	align-items: center;
	justify-content: space-between;
	z-index: 1000;
	box-shadow: 0px 0.5rem 1rem -0.125rem rgba(0, 0, 0, 0.1);
	padding: 1rem;
}
</style>

<i18n>
{
  "en": {
    "banner_info": "If you encounter any problems or bugs, please use the feedback form in the lower right corner to tell us about them."
  },
  "de": {
    "banner_info": "Sollte es zu Problemen oder Fehler kommen, nutze bitte das Feedback Formular in der unteren rechten Ecke um uns darüber zu berichten."
  }
}
</i18n>
