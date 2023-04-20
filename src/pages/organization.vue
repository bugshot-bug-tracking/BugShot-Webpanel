<template>
	<main class="main-loading" v-if="organizations == undefined">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<main class="main-grid" v-else-if="organizations.length > 0">
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

			<n-h2 m-0 style="color: var(--bs-purple)">{{ $t("no_organizations") }}</n-h2>

			<p>{{ $t("please_add_new_one") }}</p>

			<OrganizationCreateModal :primary_button="true" />
		</section>
	</main>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";

const store = useMainStore();

const organizations = computed(() => store.getOrganizations);
</script>

<route lang="yaml">
name: organization-root
</route>
