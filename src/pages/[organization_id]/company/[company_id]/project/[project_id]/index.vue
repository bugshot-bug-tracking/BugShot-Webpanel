<template>
	<T2Page>
		<template #header>
			<T2Header v-if="project.id">
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
					:list="project.attributes.users"
					:pending_list="project?.pending ?? []"
					:add="addMember"
					:edit="editMember"
					:delete="deleteMember"
					:deleteInvitation="deleteInvitation"
					:preOpenCall="preCall"
				/>

				<AddBug :id="project_id" />

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

		<BugsTable v-if="project" :id="project_id" />
	</T2Page>
</template>

<script setup lang="ts">
import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { useProjectStore } from "~/stores/project";

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

const project = computed(() => store.getProject);

const isAuthorized = computed(() => {
	// temp code replace with proper ?global? logic
	return (
		project.value?.attributes.role?.id === 1 ||
		project.value.attributes.creator?.id === useAuthStore().getUser.id ||
		store.company.attributes.role?.id === 1
	);
});

const preCall = async () => {
	await store.fetchProjectUsers();
	await store.fetchProjectInvitations();
};

const addMember = async (email: String, role_id: number) => {
	let response = await axios.post(`projects/${props.project_id}/invite`, {
		target_email: email,
		role_id: role_id,
	});

	project.value?.pending?.push(response.data.data);
};

const editMember = async (user_id: number, role_id: number) => {
	let response = await axios.put(`projects/${props.project_id}/users/${user_id}`, {
		role_id: role_id,
	});

	let user = project.value?.attributes.users?.find((x) => x.id === user_id);
	if (user) user.role = response.data.data.role;
};

const deleteMember = async (user_id: number) => {
	await axios.delete(`projects/${props.project_id}/users/${user_id}`);

	let index = project.value?.attributes.users?.findIndex((x) => x.id === user_id);

	if (index !== undefined && index !== -1) project.value?.attributes.users?.splice(index, 1);
};

const deleteInvitation = async (invitation_id: string) => {
	await axios.delete(`invitations/${invitation_id}`);

	let index = project.value?.pending?.findIndex((x: any) => x.id === invitation_id);

	if (index !== undefined && index !== -1) project.value?.pending?.splice(index, 1);
};
</script>

<route lang="yaml">
name: project
</route>
