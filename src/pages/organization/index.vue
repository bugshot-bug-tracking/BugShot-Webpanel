<template>
	<main class="main-loading" v-if="loading">
		<img src="src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<main class="main-grid" v-else-if="organizations.length > 0"></main>

	<main class="main-empty" v-else>
		<section>
			<img src="/src/assets/images/nothing_to_show.svg" alt="empty boxes" w-88 h-88 />

			<h1 w-88 text-6>{{ $t("no_organizations") }}</h1>

			<p>{{ $t("please_add_new_one") }}</p>

			<CreateOrganizationModal />
		</section>
	</main>
</template>

<script setup lang="ts">
import CreateOrganizationModal from "./components/CreateOrganizationModal.vue";
// TODO make init and change content when initiated

import { useMainStore } from "~/stores/main";

const loading = ref(true);

const store = useMainStore();

const organizations = computed(() => store.getOrganizations);

onMounted(async () => {
	// fetch organizations data and set the appropriate main based on store.organizations
	// TODO add an error main component
	try {
		await store.initOrganizations();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
});
</script>

<style lang="scss" scoped></style>

<route lang="yaml">
name: organization

meta:
    layout: default2
</route>
