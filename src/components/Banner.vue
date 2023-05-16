<template>
	<div class="announcement-wrapper">
		<div class="announcement" v-if="visible">
			<div />
			<div>
				<p>{{ t("new_version_released") }}!</p>
				<p>{{ t("banner_info") }}</p>
			</div>
			<img
				src="/src/assets/icons/close_2.svg"
				alt="close"
				:title="$t('close')"
				@click="acknowledge"
				cursor-pointer
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { version } from "~/../package.json";
import { useLocalStorage } from "@vueuse/core";

let local = useLocalStorage("new_version", version);
let visibility = useLocalStorage("new_version_visibility", true);

onMounted(() => {
	let splitLocalVersion = local.value.split(".");
	let splitVersion = version.split(".");

	// ignore the patch version changes but notify for the major and minor
	if (splitVersion[0] !== splitLocalVersion[0] || splitVersion[1] !== splitLocalVersion[1])
		visibility.value = true;
});

const visible = computed(() => visibility.value);

const acknowledge = () => {
	local.value = version;
	visibility.value = false;
};

const { t } = useI18n({ inheritLocale: true });
</script>

<style lang="scss" scoped>
.announcement-wrapper {
	width: max-content;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	padding: 1rem;
	z-index: 10;
	margin: 0 auto;
}

.announcement {
	display: flex;
	background-color: hsl(32deg, 100%, 67%);
	align-items: center;
	justify-content: space-between;
	box-shadow: 0px 0.5rem 1rem -0.125rem rgba(0, 0, 0, 0.1);
	padding: 1rem;
	border-radius: 0.5rem;
	gap: 1rem;
}
</style>

<i18n lang="json">
{
	"en": {
		"new_version_released": "A new version was released",
		"banner_info": "If you encounter any problems or bugs, please use the feedback form in the lower right corner to tell us about them."
	},
	"de": {
		"new_version_released": "Eine neue Version wurde veröffentlicht",
		"banner_info": "Sollte es zu Problemen oder Fehler kommen, nutze bitte das Feedback Formular in der unteren rechten Ecke um uns darüber zu berichten."
	}
}
</i18n>
