<template>
	<div v-if="loading" class="page-loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<div v-else-if="!loading && error">{{ t("error") }}</div>

	<RouterView v-else-if="!loading && !error && resource?.id" />

	<div v-else>{{ t("empty") }}</div>
</template>

<script setup lang="ts">
import { useCompanyStore } from "~/stores/company";

const props = defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},

	company_id: {
		type: String,
		required: true,
		description: "Company ID",
	},
});

const { t } = useI18n();

const store = useCompanyStore();

const loading = ref(true);
const error = ref(false);

const initStore = async () => {
	try {
		loading.value = true;
		error.value = false;

		await store.init(props.organization_id, props.company_id);
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

const resource = computed(() => store.getCompany);
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
