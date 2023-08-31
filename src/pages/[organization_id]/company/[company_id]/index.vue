<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					{{ t("project", 2) }}
				</template>

				<template #l-bottom>
					{{ company.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>

				<template #actions>
					<OrderPopover v-model:value="orderRef" :header="t('order.porject')" />

					<n-dropdown trigger="click" :options="more.options" v-if="isAuthorized">
						<n-button text>
							<Icon-VerticalDots />
						</n-button>
					</n-dropdown>
				</template>

				<ProjectCreateModal
					:primary_button="true"
					v-if="isAuthorized || (company.attributes.role?.id ?? 9) < 3"
				/>

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
					infoKey="tooltips.company_roles"
					@invite-close="projectSelected = undefined"
				>
					<template #extra-add>
						<div style="width: 100%">
							<n-text> {{ t("manage_members.add.assign_to_project") }} </n-text>

							<n-select
								v-model:value="projectSelected"
								filterable
								:options="projectOptions"
								text-left
								clearable
								class="project-select"
								multiple
							>
								<template #arrow>
									<img
										class="black-to-purple"
										src="/src/assets/icons/caret_down.svg"
									/>
								</template>
							</n-select>
						</div>
					</template>
				</ManageMembers>
			</T3Header>
		</template>

		<div class="main-empty" v-if="projects.length < 1">
			<TrialBanner />

			<section>
				<img src="/src/assets/images/nothing_to_show.svg" alt="empty boxes" w-88 h-88 />

				<n-h2 m-0 style="color: var(--bs-purple)">{{ t("no_projects") }}</n-h2>

				<p>{{ t("please_add_new_project") }}</p>

				<ProjectCreateModal :primary_button="true" multipleURL />
			</section>
		</div>

		<n-scrollbar flex-1 v-else>
			<TrialBanner />

			<GroupContainer>
				<template #top-left>
					<RouterLink
						:to="{
							name: 'company',
							params: { organization_id: organization_id, company_id: company.id },
						}"
					>
						{{ company.attributes.designation }}
					</RouterLink>
				</template>

				<template #top-right>
					{{
						t("last_update", {
							time: timeToText(company.attributes.updated_at),
						})
					}}
				</template>

				<ProjectCard
					v-for="project of projects"
					:key="project.id"
					:title="project.attributes.designation"
					:lastEdit="project.attributes.updated_at"
					:image="project.attributes.image?.attributes.url"
					:color="project.attributes.color_hex"
					:progress="{
						done: project.attributes.bugsDone,
						total: project.attributes.bugsTotal,
					}"
					:actions="isAuthorized || (project.attributes.role?.id ?? 9) < 2"
					@open="goToProject(project.attributes.company.id, project.id)"
					:to_settings="{
						name: 'project-settings',
						params: {
							organization_id: organization_id,
							company_id: company.id,
							project_id: project.id,
						},
					}"
				/>
			</GroupContainer>
		</n-scrollbar>
	</T2Page>
</template>

<script setup lang="ts">
import { DropdownOption, SelectOption } from "naive-ui";
import IconSettings from "~/components/icons/Icon-Settings.vue";
import useOrderResource from "~/composables/OrderResource";
import { Project } from "~/models/Project";
import { useCompanyStore } from "~/stores/company";
import { useOrganizationStore } from "~/stores/organization";
import { useProjectStore } from "~/stores/project";
import { useSettingsStore } from "~/stores/settings";
import timeToText from "~/util/timeToText";

const props = defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},

	company_id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const { t } = useI18n();

const store = useCompanyStore();

const router = useRouter();

const company = computed(() => store.getCompany!);

const projects = computed(() => orderedList(store.getProjects ?? []) as Project[]);

const isAuthorized = computed(() => {
	//TODO temp code replace with proper ?global? logic
	return (
		(useOrganizationStore().getUserRole?.id ?? 9) < 2 ||
		(company.value?.attributes.role?.id ?? 9) < 2
	);
});

const goToProject = (company_id: string, project_id: string) => {
	router.push({
		name: "project",
		params: {
			organization_id: props.organization_id,
			company_id: company_id,
			project_id: project_id,
		},
	});
};

const preCall = async () => {
	await store.fetchUsers();

	await store.fetchInvitations();
};

const addMember = async (email: string, role_id: number) => {
	if (projectSelected.value === undefined || projectSelected.value.length < 1)
		await store.sendInvitation({ email, role_id });
	else
		await Promise.all(
			projectSelected.value.map(
				async (item) =>
					await useProjectStore().sendInvitationSpecific(item, { email, role_id })
			)
		);
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

const suggestOptions = computed(() => {
	const all = useOrganizationStore().getMembers ?? [];
	const inside = useCompanyStore().getMembers ?? [];

	const diffArray = all.filter((am) => !inside.some((im) => am.id === im.id));

	return diffArray.map((m) => m.attributes.email);
});

const { orderRef, orderedList } = useOrderResource();

onMounted(() => {
	orderRef.value = useSettingsStore().getProjectsOrder;
});

watch(orderRef, () => {
	useSettingsStore().setProjectsOrder(orderRef.value);
});

const more = computed(() => ({
	options: [
		{
			label: t("company_settings"),
			key: "settings",
			icon: () => h(IconSettings),
			show: isAuthorized.value,
			props: {
				onClick: () => {
					router.push({
						name: "company-settings",
						params: {
							organization_id: props.organization_id,
							company_id: props.company_id,
						},
					});
				},
			},
		},
	] as DropdownOption[],
}));

const projectSelected = ref<undefined | string[]>(undefined);
const projectOptions = computed(() => {
	return store.getProjects?.map(
		(item): SelectOption => ({
			label: item.attributes.designation,
			value: item.id,
		})
	);
});
</script>

<style lang="scss">
.project-select {
	max-width: 48ch;

	.n-base-icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.n-tag__content {
		max-width: 16ch;
	}
}
</style>

<route lang="yaml">
name: company
</route>
