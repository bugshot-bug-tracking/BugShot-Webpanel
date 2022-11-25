<template>
	<main class="main-grid" v-if="(organizations?.length ?? -1) > 0">
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
import { useMainStore } from "~/stores/main";

const store = useMainStore();

const organizations = computed(() => store.getOrganizations);
</script>

<route lang="yaml">
name: organization-root

meta:
    layout: default2
</route>
