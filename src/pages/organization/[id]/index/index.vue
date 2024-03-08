<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					{{ t("organization") }}
				</template>

				<template #l-bottom>
					{{ resource.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>
			</T3Header>
		</template>

		<TrialBanner />

		<article p-8 content-start>
			<div>
				<div class="component-group">
					<div class="group-header">
						{{ t("organization_settings") }}
					</div>
					<div class="group-content">
						<OrganizationSettings />
					</div>
				</div>

				<div class="component-group">
					<div class="group-header">
						{{ t("invoice", 2) }}
					</div>

					<div class="group-content">
						<InvoiceList />
					</div>
				</div>

				<div class="component-group">
					<div class="group-header">
						{{ t("actions") }}
					</div>

					<div class="group-content">
						<div class="delete-project" flex flex-col gap-2 p-6 py-8>
							<a style="color: var(--bs-red)" underline @click="deleteModal.open">
								{{ t("delete_organization_and_projects") }}?
							</a>

							<p>({{ t("operation_cant_be_reverted") }})</p>
						</div>
					</div>
				</div>
			</div>

			<div class="component-group">
				<div class="group-header">
					{{ t("company", 2) }}
				</div>

				<div class="group-content">
					<OrganizationCompaniesTable />
				</div>
			</div>

			<div class="component-group">
				<div class="group-header">
					{{ t("team_members") }}
				</div>

				<div class="group-content" v-if="resource">
					<OrganizationTeamTable />
				</div>
			</div>
		</article>
	</T2Page>

	<DeleteModal2
		:show="deleteModal.show"
		:header="deleteModal.header"
		:text="deleteModal.text"
		:callback="deleteModal.callback"
		@close="deleteModal.clear"
	/>

	<OverviewTourModal v-model:show="showOverviewTour" @permanent-close="handlePermanentClose" />
</template>

<script setup lang="ts">
import { SettingTypes, SettingValues } from "~/models/Setting";
import { useOrganizationStore } from "~/stores/organization";
import { useUserSettingsStore } from "~/stores/userSettings";

// const props =
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const { t } = useI18n();
let router = useRouter();

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization!);

const deleteModal = reactive({
	show: false,
	text: "test",
	header: t("want_to_delete"),
	callback: null as Function | null,
	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = null;
	},
	open: () => {
		deleteModal.text = resource.value.attributes.designation;

		deleteModal.callback = async () => {
			await store.deleteResource();

			router.push({
				name: "organization-index",
			});
		};

		deleteModal.show = true;
	},
});

const showOverviewTour = ref(false);

onMounted(() => {
	const status = useUserSettingsStore().getTourStatus;

	if (status && status.attributes.value == null) showOverviewTour.value = true;
	else showOverviewTour.value = false;
});

const handlePermanentClose = () => {
	useUserSettingsStore().changeSetting(SettingTypes.tour_status, SettingValues.canceled);
};
</script>

<style lang="scss" scoped>
article {
	display: grid;
	grid-template-columns: 32rem minmax(40rem, 60rem) minmax(40rem, 60rem);
	grid-auto-flow: dense;
	padding: 2.5rem;
	padding-right: 1.5rem;
	gap: 3rem;
}

.delete-project {
	background: #fcebeb;
	box-shadow: 0 0.125rem 0.25rem #00000029;
	border: 1px solid #ffbbbb;
	border-radius: 0.5rem;

	a {
		cursor: pointer;

		&:hover {
			font-weight: bold;
			color: #f23838;
		}
	}
}
</style>

<route lang="yaml">
name: organization
</route>
