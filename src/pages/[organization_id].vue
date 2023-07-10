<template>
	<Banner />

	<main class="main-loading" v-if="loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<main class="main-grid" v-else-if="!loading && (resource?.length ?? -1) > 0">
		<section class="grid-sidebar">
			<CompanyNavbar />
		</section>

		<section class="grid-page">
			<RouterView />
		</section>

		<NoLicenseOverlay />
	</main>

	<main class="main-empty" v-else>
		<TrialBanner />

		<section>
			<OrganizationSwitcher />

			<img src="/src/assets/images/nothing_to_show.svg" alt="empty boxes" w-88 h-88 />

			<n-h2 m-0 style="color: var(--bs-purple)">{{ $t("no_companies") }}</n-h2>

			<div flex gap-2 items-center>
				<p>{{ $t("please_add_new_group") }}</p>

				<div>
					<InfoPopover :message="$t('tooltips.company')" ml-a my-a />
				</div>
			</div>

			<CompanyCreateModal :primary_button="true" redirect />
		</section>

		<NoLicenseOverlay />
	</main>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const store = useOrganizationStore();

const loading = ref(true);
const error = ref(false);

const initStore = async () => {
	try {
		loading.value = true;
		error.value = false;

		await store.init(props.organization_id);
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

const resource = computed(() => store.getCompanies);
</script>

<route lang="yaml">
name: company-root
</route>
