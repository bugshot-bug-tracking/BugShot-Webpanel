<template>
	<div v-if="loading" class="page-loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<RouterView v-else-if="!loading && resource?.id"> </RouterView>

	<div v-else>{{ t("empty") }}</div>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const { t } = useI18n();

const store = useOrganizationStore();

const loading = ref(true);

const initStore = async () => {
	try {
		loading.value = true;

		await store.init(props.id);
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

initStore();
watch(
	props,
	() => {
		initStore();
	},
	{ deep: true }
);

const resource = computed(() => store.getOrganization);
</script>

<style lang="scss" scoped>
.page-loading {
	display: flex;
	width: 100%;
	height: 100%;

	img {
		margin: auto;
	}
}
</style>
