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

				<AddBug :id="id" />
			</T2Header>
		</template>

		<BugsTable v-if="project" :id="id" />
	</T2Page>
</template>

<script setup lang="ts">
import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { useProjectStore } from "~/stores/project";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
	project_id: {
		required: true,
		type: String,
		description: "Project ID",
	},
});

useProjectStore().init(props.id, props.project_id);

watch(
	props,
	() => {
		useProjectStore().init(props.id, props.project_id);
	},
	{ deep: true }
);

const project = computed(() => useProjectStore().getProject);

const isAuthorized = computed(() => {
	// temp code replace with proper ?global? logic
	return (
		project.value?.attributes.role?.id === 1 ||
		project.value.attributes.creator?.id === useAuthStore().getUser.id
	);
});

const preCall = async () => {
	await useProjectStore().fetchProjectUsers();
	await useProjectStore().fetchProjectInvitations();
};

const addMember = async (email: String, role_id: number) => {
	let response = await axios.post(`projects/${props.project_id}/invite`, {
		target_email: email,
		role_id: role_id,
	});

	project.value?.pending?.push(response.data.data);
};

const editMember = async (user_id: number, role_id: number) => {
	let response = await axios.put(
		`projects/${props.project_id}/users/${user_id}`,
		{
			role_id: role_id,
		}
	);

	let user = project.value?.attributes.users?.find((x) => x.id === user_id);
	if (user) user.role = response.data.data.role;
};

const deleteMember = async (user_id: number) => {
	await axios.delete(`projects/${props.project_id}/users/${user_id}`);

	let index = project.value?.attributes.users?.findIndex(
		(x) => x.id === user_id
	);

	if (index !== undefined && index !== -1)
		project.value?.attributes.users?.splice(index, 1);
};

const deleteInvitation = async (invitation_id: string) => {
	await axios.delete(`invitations/${invitation_id}`);

	let index = project.value?.pending?.findIndex(
		(x: any) => x.id === invitation_id
	);

	if (index !== undefined && index !== -1)
		project.value?.pending?.splice(index, 1);
};
</script>

<route lang="yaml">
name: project
</route>
