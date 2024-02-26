<template>
	<T2Page>
		<template #header>
			<T3Header v-if="kanbanState.mode == undefined">
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

				<AddBug />

				<ManageMembers
					v-if="isAuthorized"
					:list="store.getMembers"
					:pending_list="pendingMembers"
					:add="addMember"
					:edit="editMember"
					:delete="deleteMember"
					:deleteInvitation="deleteInvitation"
					:preOpenCall="preCall"
					:suggestOptions="suggestOptions"
					infoKey="tooltips.project_roles"
				/>

				<template #actions v-if="more.options.some((o) => o.show)">
					<n-dropdown trigger="click" :options="more.options">
						<n-button text>
							<IconVerticalDots />
						</n-button>
					</n-dropdown>
				</template>
			</T3Header>

			<T2Header v-else>
				<template #l-top>
					<n-h2 m-0>
						<i18n-t keypath="request_approvals_for_s" scope="global">
							{{ project.attributes.designation }}
						</i18n-t>
					</n-h2>
				</template>

				<template #l-bottom>
					{{ project.attributes.company.attributes.designation }}
				</template>

				<n-text type="primary">
					<i18n-t
						keypath="n_bug_selected"
						tag="span"
						scope="global"
						:plural="kanbanState.checkList.length"
					>
						<b>
							{{ kanbanState.checkList.length }}
						</b>
					</i18n-t>
				</n-text>

				<n-button
					type="primary"
					:ghost="!allBugsSelected"
					size="large"
					round
					@click="toggleSelectAll"
				>
					<template #icon>
						<Icon-SelectAll />
					</template>

					{{ allBugsSelected ? t("deselect_all_bugs") : t("select_all_bugs") }}
				</n-button>

				<n-divider :vertical="true" min-h-8 />

				<RequestApprovalModal
					:list="store.getAssignableMembers"
					:disabled="kanbanState.checkList.length < 1"
					:submit="onSubmitApprovals"
				/>

				<template #actions v-if="more.options.some((o) => o.show)">
					<n-button text @click="kanbanState.cancelChecker">
						<Icon-X />
					</n-button>
				</template>
			</T2Header>
		</template>

		<TrialBanner mb-0 />

		<div v-if="loading" class="loading">
			<img src="/src/assets/animations/loading.svg" alt="loading circle" />
		</div>

		<n-tabs
			v-else
			type="bar"
			v-model:value="currentTab"
			animated
			style="max-height: 100%"
			px-8
			py-4
			flex-1
			min-h-0
		>
			<n-tab-pane name="kanban" display-directive="show" flex flex-col>
				<template #tab>
					<Icon-Board mr-1 />

					{{ $t("kanban") }}
				</template>

				<div class="max-w-100% flex mb-4">
					<FilterTagList
						:creators="reportsStore.getFilteredCreatorsData"
						:assignees="reportsStore.getFilteredAssigneesData"
						:priorities="reportsStore.filter.priorities"
						@remove:creator="removeCreatorFromFilter"
						@remove:assignee="removeAssigneeFromFilter"
						@remove:priority="removePriorityFromFilter"
					/>
				</div>

				<n-checkbox-group v-model:value="kanbanState.checkList" overflow-auto flex-1>
					<Kanban
						:mode="kanbanState.mode"
						:moveable="store.getProject?.attributes.role?.id !== 3"
					/>
				</n-checkbox-group>

				<BugDrawer />

				<BugMoveModal v-model:show="bugMove.show" />

				<ProjectMoveModal v-model:show="projectMove.show" @success="projectMove.redirect" />
			</n-tab-pane>

			<n-tab-pane name="archive" display-directive="if">
				<template #tab>
					<Icon-Archive mr-1 />

					{{ $t("archive") }}
				</template>

				<BugsArchive />

				<ArchiveBugDrawer />
			</n-tab-pane>

			<template #suffix v-if="currentTab === 'kanban'">
				<GroupPopselect
					:button-title="t('filter')"
					:groups="availableFilters"
					@update:filter="handleFilterUpdate"
					mr-4
				/>

				<KanbanActions />
			</template>
		</n-tabs>
	</T2Page>
</template>

<script setup lang="ts">
import { DropdownOption } from "naive-ui";
import { useBugStore } from "~/stores/bug";
import { useCompanyStore } from "~/stores/company";
import { useOrganizationStore } from "~/stores/organization";
import { useProjectStore } from "~/stores/project";
import { useReportsStore } from "~/stores/reports";
import IconSettings from "~/components/icons/Icon-Settings.vue";
import IconTabular from "~/components/icons/Icon-Tabular.vue";
import IconFolderMove from "~/components/icons/Icon-FolderMove.vue";
import IconFileMove from "~/components/icons/Icon-FileMove.vue";
import IconBolt from "~/components/icons/Icon-Bolt.vue";
import { useFlagsStore } from "~/stores/flags";
import { User } from "~/models/User";

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

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

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
	const allMembers = store.getAssignableMembers;
	const insideMemberIds = store.getMembers.map((member) => member.id);

	const difference = allMembers.filter((allMember) => !insideMemberIds.includes(allMember.id));

	return difference.map((member) => member.attributes.email);
});

const currentTab = ref("kanban");

const BugWasOpened = ref(false);
const BugWasOpenedId = ref<string | undefined>(undefined);
const BugWasOpenedCommentId = ref<string | undefined>(undefined);

watchEffect(async () => {
	try {
		// if no bug queried exit
		if (
			route.query.b == undefined ||
			(BugWasOpened.value === true &&
				BugWasOpenedId.value === route.query.b &&
				BugWasOpenedCommentId.value === route.query.c)
		)
			return;

		const bug = reportsStore.getBugById(route.query.b as string);

		if (bug?.id != undefined) {
			await useBugStore().init(bug.id, bug.attributes.status_id);
			BugWasOpened.value = true;
			BugWasOpenedId.value = route.query.b as string;
			BugWasOpenedCommentId.value = route.query.c as string | undefined;
		}
	} catch (error) {
		console.log(error);
	}
});

const more = computed(() => ({
	options: [
		{
			label: t("project_settings"),
			key: "settings",
			icon: () => h(IconSettings),
			show: isAuthorized.value,
			props: {
				onClick: () => {
					router.push({
						name: "project-settings",
						params: {
							organization_id: props.organization_id,
							company_id: props.company_id,
							project_id: props.project_id,
						},
					});
				},
			},
		},
		{
			label: t("request_approval", 2),
			key: "approvals",
			icon: () => h(IconTabular),
			show: currentTab.value === "kanban" && isAuthorized.value,
			props: {
				onClick: () => {
					kanbanState.startChecker();
				},
			},
		},
		{
			label: t("project_page.more_options.move_project", 2),
			key: "move_project",
			icon: () => h(IconFolderMove),
			show: currentTab.value === "kanban" && isAuthorized.value,
			props: {
				onClick: () => {
					projectMove.show = true;
				},
			},
		},
		{
			label: t("move_bug", 2),
			key: "move_bugs",
			icon: () => h(IconFileMove),
			show: currentTab.value === "kanban" && isAuthorized.value,
			props: {
				onClick: () => {
					bugMove.show = true;
				},
			},
		},
		{
			label: t("project_integrations.integration", 2),
			key: "project_integrations",
			icon: () => h(IconBolt),
			show: isAuthorized && useFlagsStore().isSpecialUser,
			props: {
				onClick: () => {
					router.push({
						name: "project-integrations",
						params: {
							organization_id: props.organization_id,
							company_id: props.company_id,
							project_id: props.project_id,
						},
					});
				},
			},
		},
	] as DropdownOption[],
}));

const kanbanState = reactive({
	mode: undefined as undefined | "checker",
	checkList: [] as string[],

	startChecker: () => {
		kanbanState.mode = "checker";
		kanbanState.checkList = [];
	},

	cancelChecker: () => {
		kanbanState.mode = undefined;
		kanbanState.checkList = [];
	},
});

const allBugsSelected = computed(
	() => kanbanState.checkList.length === reportsStore.getBacklogStatus?.attributes.bugs?.length
);

const toggleSelectAll = () => {
	// if it's a deselect action empty the list and return
	if (allBugsSelected.value === true) return (kanbanState.checkList = []);

	let bugs = reportsStore.getBacklogStatus?.attributes.bugs;

	if (bugs == undefined) return;

	bugs.forEach((bug) => {
		if (!kanbanState.checkList.some((bId) => bId === bug.id))
			kanbanState.checkList.push(bug.id);
	});
};

const onSubmitApprovals = async (recipients: { name: string; email: string }[]) => {
	await store.requestApprovals(kanbanState.checkList, recipients);
	kanbanState.cancelChecker();
};

const bugMove = reactive({
	show: false,
});

const projectMove = reactive({
	show: false,
	redirect: () => {
		router.replace({
			name: "organization-home",
			params: { organization_id: props.organization_id },
		});
	},
});

const removeCreatorFromFilter = (user: User | undefined) => {
	let entryIndex = reportsStore.filter.creators.findIndex((creator_id) =>
		user ? creator_id === user.id : creator_id === -1
	);

	if (entryIndex != undefined && entryIndex != -1) {
		reportsStore.filter.creators.splice(entryIndex, 1);
	}
};
const removeAssigneeFromFilter = (user: User) => {
	let entryIndex = reportsStore.filter.assignees.findIndex(
		(creator_id) => creator_id === user.id
	);

	if (entryIndex != undefined && entryIndex != -1) {
		reportsStore.filter.assignees.splice(entryIndex, 1);
	}
};
const removePriorityFromFilter = (value: number) => {
	let entryIndex = reportsStore.filter.priorities.findIndex(
		(priority_id) => priority_id === value
	);

	if (entryIndex != undefined && entryIndex != -1) {
		reportsStore.filter.priorities.splice(entryIndex, 1);
	}
};

const availableFilters = computed(() => [
	{
		label: t("creator"),
		key: "creators-filter",
		children: [
			...(store.assignableMembers?.map((user) => ({
				label: `${user.attributes.first_name} ${user.attributes.last_name}`,
				value: user.id,
			})) ?? []),
			{
				label: t("anonymous"),
				value: -1,
			},
		],
	},
	{
		label: t("assignee"),
		key: "assignees-filter",
		children: [
			...(store.assignableMembers?.map((user) => ({
				label: `${user.attributes.first_name} ${user.attributes.last_name}`,
				value: user.id,
			})) ?? []),
		],
	},
	{
		label: t("priority"),
		key: "priorities-filter",
		children: [
			{
				label: t("critical"),
				value: 4,
			},
			{
				label: t("important"),
				value: 3,
			},
			{
				label: t("normal"),
				value: 2,
			},
			{
				label: t("minor"),
				value: 1,
			},
		],
	},
]);

// key is the availableFilters 'group' key and value is the children's value
const handleFilterUpdate = (key: string, value: (string | number)[]) => {
	switch (key) {
		case "creators-filter":
			reportsStore.filter.creators = value as number[];
			break;
		case "assignees-filter":
			reportsStore.filter.assignees = value as number[];

			break;
		case "priorities-filter":
			reportsStore.filter.priorities = value as number[];

			break;
	}
};
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
</style>

<route lang="yaml">
name: project
</route>
