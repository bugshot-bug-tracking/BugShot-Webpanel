<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					{{ $t("project", 2) }}
				</template>

				<template #l-bottom>
					{{ company.attributes.designation }}
				</template>

				<template #center>
					<SearchBar :order="'pcb'" />
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

				<ProjectCreateModal :primary_button="true" />

				<RouterLink
					:to="{
						name: 'company-settings',
						params: { organization_id: organization_id, company_id: company.id },
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

						{{ $t("company_settings") }}
					</div>
				</RouterLink>
			</T3Header>
		</template>

		<div class="main-empty" v-if="projects.length < 1">
			<TrialBanner />

			<section>
				<img src="/src/assets/images/nothing_to_show.svg" alt="empty boxes" w-88 h-88 />

				<h1 w-88 text-6>{{ $t("no_projects") }}</h1>

				<p>{{ $t("please_add_new_one") }}</p>

				<ProjectCreateModal :primary_button="true" />
			</section>
		</div>

		<div class="bs-scroll s-green w-100 h-100" v-else>
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
						$t("last_update", {
							time: timeToText(company.attributes.updated_at),
						})
					}}
				</template>

				<ProjectCard
					v-for="project of projects"
					:key="project.id"
					:title="project.attributes.designation"
					:lastEdit="project.attributes.updated_at"
					:image="project.attributes.image?.attributes.base64"
					:color="project.attributes.color_hex"
					:progress="{
						done: project.attributes.bugsDone,
						total: project.attributes.bugsTotal,
					}"
					actions
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
		</div>
	</T2Page>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useCompanyStore } from "~/stores/company";
import { useOrganizationStore } from "~/stores/organization";
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

const store = useCompanyStore();

const router = useRouter();

const company = computed(() => store.getCompany!);

const projects = computed(() => store.getProjects ?? []);

const isAuthorized = computed(() => {
	//TODO temp code replace with proper ?global? logic
	return (
		company.value?.attributes.role?.id === 1 ||
		company.value?.attributes.creator?.id === useAuthStore().getUser.id
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

const suggestOptions = computed(() => {
	const all = useOrganizationStore().getMembers ?? [];
	const inside = useCompanyStore().getMembers ?? [];

	const diffArray = all.filter((am) => !inside.some((im) => am.id === im.id));

	return diffArray.map((m) => m.attributes.email);
});
</script>

<route lang="yaml">
name: company
</route>
