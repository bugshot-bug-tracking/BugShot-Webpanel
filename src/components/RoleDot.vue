<template>
	<div
		v-if="useFlagsStore().canAccessBetaFeatures"
		:style="{
			background: color,
		}"
		:aria-label="name ? t('roles.' + name.toLowerCase()) : undefined"
		:title="name ? t('roles.' + name.toLowerCase()) : undefined"
	/>
</template>

<script setup lang="ts">
import { useFlagsStore } from "~/stores/flags";
import { COLOR } from "~/util/colors";

const props = defineProps({
	id: {
		type: Number,
		required: false,
		default: undefined,
	},
	name: {
		type: String,
		required: false,
		default: undefined,
	},
});

const { t } = useI18n();

const color = computed(() => {
	switch (props.id) {
		case 0:
			return COLOR.GREEN;
		case 1:
			return COLOR.YELLOW;
		case 2:
			return COLOR.PURPLE;
		case 3:
			return COLOR.BLUE;
		default:
			return COLOR.GRAY;
	}
});
</script>

<style scoped lang="scss">
div {
	width: 0.75rem;
	height: 0.75rem;
	border-radius: 100%;
	background: black;
	margin: auto;
	flex: none;
}
</style>
