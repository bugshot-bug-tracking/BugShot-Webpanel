<template>
	<main class="main-loading" v-if="loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<main class="main-grid" v-else-if="(organizations?.length ?? -1) > 0">
		<section class="grid-sidebar">
			<OrganizationNavbar />
		</section>

		<section class="grid-page">
			<RouterView />
		</section>
	</main>

	<main class="main-empty" v-else>
		<section>
			<img src="/src/assets/images/nothing_to_show.svg" alt="empty boxes" w-88 h-88 />

			<h1 w-88 text-6>{{ $t("no_organizations") }}</h1>

			<p>{{ $t("please_add_new_one") }}</p>

			<OrganizationCreateModal :primary_button="true" />
		</section>
	</main>
</template>

<script setup lang="ts">
import OrganizationCreateModal from "./organization/components/OrganizationCreateModal.vue";
import OrganizationNavbar from "./organization/components/OrganizationNavbar.vue";
import { useMainStore } from "~/stores/main";

const loading = ref(true);

const store = useMainStore();

const organizations = computed(() => store.getOrganizations);

onMounted(async () => {
	// fetch organizations data and set the appropriate main based on store.organizations
	//TODO add an error main component
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
name: organization-root

meta:
    layout: default2
</route>
