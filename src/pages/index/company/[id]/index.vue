<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("project", 2) }}
				</template>

				<template #l-bottom>
					{{
						company ? company.attributes.designation : $t("loading")
					}}
				</template>

				<ManageMembers
					v-if="isAuthorized"
					:list="company?.attributes.users"
					:pending_list="company?.pending ?? []"
					:add="addMember"
					:edit="editMember"
					:delete="deleteMember"
					:deleteInvitation="deleteInvitation"
					:preOpenCall="preCall"
				/>

				<CreateDataModal
					:dataType="'Project'"
					:postPath="`companies/${id}/projects`"
					:aditionalBody="{
						company_id: id,
					}"
					:subTitle="`${$t('company')}: ${
						company?.attributes.designation
					}`"
				/>

				<router-link
					:to="{ name: 'company-settings', params: { id: id } }"
					class="bs-btn green empty text-capitalize"
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
				</router-link>
			</T2Header>
		</template>

		<div class="bs-scroll s-green w-100 h-100" v-if="company && projects">
			<GroupContainer>
				<template #top-left>
					<RouterLink
						:to="{ name: 'company', params: { id: company.id } }"
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
					@open="
						goToProject(project.attributes.company.id, project.id)
					"
					@edit="openEdit(project)"
					@delete="openDelete(project)"
				/>
			</GroupContainer>
		</div>
	</T2Page>

	<EditModal v-if="edit.visible" :id="edit.project_id" @close="edit.reset" />

	<DeleteModal
		v-if="deleteAction.visible"
		:text="deleteAction.text"
		:callback="deleteAction.execute"
		@close="deleteAction.reset"
	/>
</template>

<script setup lang="ts">
import axios from "axios";
import { Project } from "~/models/Project";
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import timeToText from "~/util/timeToText";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const store = useMainStore();
const router = useRouter();

const company = computed(() => store.getCompanyById(props.id));

const projects = computed(() => store.getCompanyProjects(props.id));

const isAuthorized = computed(() => {
	// temp code replace with proper ?global? logic
	return (
		company.value?.attributes.role?.id === 1 ||
		company.value?.attributes.creator?.id === useAuthStore().getUser.id
	);
});

const goToProject = (company_id: string, project_id: string) => {
	router.push({
		name: "project",
		params: { id: company_id, project_id: project_id },
	});
};

const edit = reactive({
	visible: false,
	company_id: "",
	project_id: "",
	reset: () => {
		edit.visible = false;
		edit.company_id = "";
		edit.project_id = "";
	},
});
const openEdit = (project: Project) => {
	edit.company_id = project.attributes.company.id;
	edit.project_id = project.id;
	edit.visible = true;
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
const openDelete = (project: Project) => {
	deleteAction.text = project.attributes.designation;
	deleteAction.execute = async () => {
		await store.deleteProject(project.id);
	};
	deleteAction.visible = true;
};

const preCall = async () => {
	await store.fetchCompanyUsers(props.id);

	await store.fetchCompanyInvitations(props.id);
};

const addMember = async (email: String, role_id: number) => {
	let response = await axios.post(`companies/${props.id}/invite`, {
		target_email: email,
		role_id: role_id,
	});

	company.value?.pending?.push(response.data.data);
};

const editMember = async (user_id: number, role_id: number) => {
	let response = await axios.put(`companies/${props.id}/users/${user_id}`, {
		role_id: role_id,
	});

	let user = company.value?.attributes.users?.find((x) => x.id === user_id);
	if (user) user.role = response.data.data.role;
};

const deleteMember = async (user_id: number) => {
	await axios.delete(`companies/${props.id}/users/${user_id}`);

	let index = company.value?.attributes.users?.findIndex(
		(x) => x.id === user_id
	);

	if (index !== undefined && index !== -1)
		company.value?.attributes.users?.splice(index, 1);
};

const deleteInvitation = async (invitation_id: string) => {
	await axios.delete(`invitations/${invitation_id}`);

	let index = company.value?.pending?.findIndex(
		(x) => x.id === invitation_id
	);

	if (index !== undefined && index !== -1)
		company.value?.pending?.splice(index, 1);
};
</script>

<route lang="yaml">
name: company
</route>
