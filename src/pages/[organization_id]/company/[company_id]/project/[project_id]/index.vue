<template>
	<T2Page>
		<template #header>
			<T2Header>
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
					class="bs-btn green empty text-capitalize"
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
				<div
					v-else
					class="bs-btn green empty text-capitalize disabled"
					:title="$t('unauthorized')"
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
				</div>
			</T2Header>
		</template>

		<div v-if="loading" class="loading">
			<img src="/src/assets/animations/loading.svg" alt="loading circle" />
		</div>

		<ProjectKanbanBoard v-else />
	</T2Page>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
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

const store = useProjectStore();

const project = computed(() => store.getProject!);

const isAuthorized = computed(() => {
	// temp code replace with proper ?global? logic
	return (
		project.value?.attributes.role?.id === 1 ||
		project.value.attributes.creator?.id === useAuthStore().getUser.id ||
		useCompanyStore().getCompany!.attributes.role?.id === 1
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
</script>

<style lang="scss" scoped>
.loading {
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
}
</style>

<route lang="yaml">
name: project
</route>
