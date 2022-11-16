<template>
	<div v-if="loading" class="page-loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<T2Page v-else-if="!loading && resource?.id">
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("organization") }}
				</template>

				<template #l-bottom>
					{{ resource.attributes.designation }}
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 content-start>
			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("organization_settings") }}
				</div>
				<div class="group-content">
				</div>
			</div>

			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("actions") }}
				</div>

				<div class="group-content">
					<div class="delete-project" flex flex-col gap-2 p-6 py-8>
						<a class="text-to-red" underline @click="openDelete">
							{{ t("delete_organization_and_projects") }}?
						</a>

						<p>({{ t("operation_cant_be_reverted") }})</p>
					</div>
				</div>
			</div>

			<div class="component-group" max-w-128 v-if="false">
				<div class="group-header">
					{{ $t("resource_token") }}
				</div>
				<div class="group-content">
					<span>token</span>
				</div>
			</div>
		</article>
	</T2Page>

	<div v-else>{{ t("empty") }}</div>

	<DeleteModal
		v-if="deleteAction.visible"
		:text="deleteAction.text"
		:callback="deleteAction.execute"
		@close="deleteAction.reset"
	/>
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
let router = useRouter();

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

const editResource = async (data: { designation: string }) => {
	await store.updateResource(data);
};

const deleteAction = reactive({
	visible: false,
	text: "",
	execute: () => {},
	reset: () => {
		deleteAction.visible = false;
		deleteAction.text = "";
		deleteAction.execute = () => {};
	},
});

const openDelete = () => {
	// shouldn't be triggered because of the template page if; but just in case and because TS
	if (resource.value === undefined) return;

	deleteAction.text = resource.value.attributes.designation;
	deleteAction.execute = async () => {
		await store.deleteOrganization();

		router.push({
			name: "organization-index",
		});
	};
	deleteAction.visible = true;
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	max-height: 100%;
	column-gap: 3rem;
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

.page-loading {
	display: flex;
	width: 100%;
	height: 100%;

	img {
		margin: auto;
	}
}
</style>

<route lang="yaml">
name: organization
</route>
