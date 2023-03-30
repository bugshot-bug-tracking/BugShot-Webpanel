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

		<article class="bs-scroll" p-8 content-start>
			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ t("organization_settings") }}
				</div>
				<div class="group-content">
					<OrganizationSettings />
				</div>
			</div>

			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ t("invoice", 2) }}
				</div>

				<div class="group-content">
					<InvoiceList />
				</div>
			</div>

			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ t("actions") }}
				</div>

				<div class="group-content">
					<div class="delete-project" flex flex-col gap-2 p-6 py-8>
						<a class="text-to-red" underline @click="deleteModal.open">
							{{ t("delete_organization_and_projects") }}?
						</a>

						<p>({{ t("operation_cant_be_reverted") }})</p>
					</div>
				</div>
			</div>

			<div class="component-group" max-w-176 min-w-160 h-80vh>
				<div class="group-header">
					{{ t("company", 2) }}
				</div>

				<div class="group-content">
					<OrganizationCompaniesTable />
				</div>
			</div>

			<div class="component-group" max-w-176 min-w-160 h-80vh>
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
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

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
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	max-height: 100%;
	column-gap: 3rem;
	height: 100%;
	width: 100%;
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
