<template>
	<div v-if="loading" class="page-loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<div v-else-if="!loading && error">{{ $t("error") }}</div>

	<RouterView v-else-if="!loading && !error && resource" />

	<div v-else>{{ $t("empty") }}</div>
</template>

<script setup lang="ts">
import { usePaymentsStore } from "~/stores/payments";

const props = defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const store = usePaymentsStore();

const loading = ref(true);
const error = ref(false);

const initStore = async () => {
	try {
		loading.value = true;
		error.value = false;

		await store.init();
	} catch (err) {
		console.log(err);
		error.value = true;
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

const resource = computed(() => store.getProducts);
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
