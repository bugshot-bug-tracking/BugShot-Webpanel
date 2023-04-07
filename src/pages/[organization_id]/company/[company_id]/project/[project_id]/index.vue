<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					<a :href="project.attributes.url" target="_blank">
						{{ project.attributes.designation }}

						<img
							src="/src/assets/icons/external-link.svg"
							alt="external"
							w-3
							v-if="project.attributes.url"
						/>
					</a>
				</template>

				<template #l-bottom>
					{{ project.attributes.company.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>

				<ManageMembers
					v-if="isAuthorized"
					:list="manageableMembers"
					:pending_list="pendingMembers"
					:add="addMember"
					:edit="editMember"
					:delete="deleteMember"
					:deleteInvitation="deleteInvitation"
					:preOpenCall="preCall"
					:suggestOptions="suggestOptions"
					infoKey="tooltips.project_roles"
				/>

				<AddBug />

				<RouterLink
					:to="{
						name: 'project-settings',
						params: {
							organization_id: organization_id,
							company_id: company_id,
							project_id: project_id,
						},
					}"
					class="bs-btn green empty"
					v-if="isAuthorized"
				>
					<div flex items-center gap-2>
						<img
							src="/src/assets/icons/gear.svg"
							alt="project"
							class="black-to-green"
							w-5
							h-5
						/>

						{{ $t("project_settings") }}
					</div>
				</RouterLink>
			</T3Header>
		</template>

		<TrialBanner mb-0 />

		<div v-if="loading" class="loading">
			<img src="/src/assets/animations/loading.svg" alt="loading circle" />
		</div>

		<n-tabs
			v-else
			type="bar"
			v-model:value="tab"
			animated
			style="max-height: 100%"
			px-8
			py-4
			flex-1
		>
			<n-tab-pane name="kanban">
				<template #tab>
					<img src="/src/assets/icons/board.svg" w-5 mr-1 class="tab-image" />
					{{ $t("kanban") }}
				</template>

				<Kanban />
			</n-tab-pane>

			<n-tab-pane name="archive" display-directive="if">
				<template #tab>
					<img src="/src/assets/icons/archive.svg" w-5 mr-1 class="tab-image" />
					{{ $t("archive") }}
				</template>

				<BugsArchive />
			</n-tab-pane>

			<template #suffix v-if="tab === 'kanban'">
				<KanbanActions />
			</template>
		</n-tabs>
	</T2Page>

	<BugDrawer />
</template>

<script setup lang="ts">
import { useBugStore } from "~/stores/bug";
import { useCompanyStore } from "~/stores/company";
import { useOrganizationStore } from "~/stores/organization";
import { useProjectStore } from "~/stores/project";
import { useReportsStore } from "~/stores/reports";

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

	project_id: {
		type: String,
		required: true,
		description: "Project ID",
	},
});

const route = useRoute();

const store = useProjectStore();

const project = computed(() => store.getProject!);

const isAuthorized = computed(() => {
	// temp code replace with proper ?global? logic
	return (
		(useOrganizationStore().getUserRole?.id ?? 9) < 2 ||
		(useCompanyStore().getUserRole?.id ?? 9) < 2 ||
		(project.value?.attributes.role?.id ?? 9) < 2
	);
});

const preCall = async () => {
	await store.fetchUsers();

	await store.fetchInvitations();
};

const addMember = async (email: string, role_id: number) => {
	await store.sendInvitation({ email, role_id });
};

const deleteInvitation = async (invitation_id: string) => {
	await store.deleteInvitation({ invitation_id });
};

const editMember = async (user_id: number, role_id: number) => {
	await store.editMember({ user_id, role_id });
};

const deleteMember = async (user_id: number) => {
	await store.deleteMember({ user_id });
};

//TODO replace this with members when ManageMember component ignores owner actions
const manageableMembers = computed(() => store.getMembers);

const pendingMembers = computed(() => store.getPendingInvitations);

const reportsStore = useReportsStore();

const loading = ref(true);
const error = ref(false);

const initStore = async () => {
	if (!props.project_id) return;

	try {
		loading.value = true;
		error.value = false;

		await reportsStore.init(props.project_id);
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

const suggestOptions = computed(() => {
	const all = useOrganizationStore().getMembers ?? [];
	const inside = store.getMembers ?? [];

	const diffArray = all.filter((am) => !inside.some((im) => am.id === im.id));

	return diffArray.map((m) => m.attributes.email);
});

const tabValue = ref("kanban");
const tab = computed({
	get: () => {
		return tabValue.value;
	},
	set: (value: string) => {
		tabValue.value = value;
	},
});

watchEffect(() => {
	try {
		// if no bug queried exit
		if (route.query.b == undefined) return;

		const bug = reportsStore.getBugById(route.query.b as string);

		if (bug?.id != undefined) {
			useBugStore().init(bug.id, bug.attributes.status_id);
		}
	} catch (error) {
		console.log(error);
	}
});
</script>

<style lang="scss" scoped>
.loading {
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
}

:deep(.n-tabs-pane-wrapper) {
	display: flex;
	height: 100%;

	.n-tab-pane {
		display: flex;
	}
}

:deep(.n-tabs-tab--active) {
	.tab-image {
		color: #7a2ee6;
		filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%) hue-rotate(263deg)
			brightness(94%) contrast(92%);
	}
}
</style>

<route lang="yaml">
name: project
</route>
