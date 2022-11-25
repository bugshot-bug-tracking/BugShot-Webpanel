<template>
	<AssignmentTable :title="$t('team_members')" :list="members">
		<template #after-title>
			<div ml-a>
				<ManageMembers
					:list="manageableMembers"
					:pending_list="pendingMembers"
					:add="addMember"
					:edit="editMember"
					:delete="deleteMember"
					:deleteInvitation="deleteInvitation"
					:preOpenCall="preCall"
				>
					<template #button="{ loading }">
						<img
							src="/src/assets/icons/gear.svg"
							alt="gear"
							:title="!loading ? $t('manage_members') : $t('loading') + '...'"
							w-8
							h-8
							class="manage-button"
							:class="{ loading: loading }"
						/>
					</template>
				</ManageMembers>
			</div>
		</template>

		<template #item="{ item }: { item: User }">
			<UserHeader
				:first_name="item.attributes.first_name"
				:last_name="item.attributes.last_name"
				:email="item.attributes.email"
				:role_text="item.role?.attributes.designation"
				:owner="resource.attributes.creator?.id === item.id"
				py-4
				:removable="false"
				:current_user="user.id === item.id"
			>
				<template #end>
					<RouterLink
						:to="{
							name: 'organization-user',
							params: { id: resource.id, user_id: item.id },
						}"
						class="black-to-purple"
						:style="{ 'font-size': '0.825rem' }"
					>
						<img
							src="/src/assets/icons/password_view.svg"
							alt="view"
							:style="{ width: '0.825rem', height: '0.825rem' }"
							mr-1
						/>

						<b>{{ $t("view_details") }}</b>
					</RouterLink>
				</template>
			</UserHeader>

			<AssignedToList
				:list="store.getMemberCompanies(item.id)"
				@remove=""
				:type="'Company'"
				my-2
			/>

			<div flex gap-4 class="black-to-purple" mb-2>
				<b>{{ $t("member_plan") }}:</b>

				<div v-if="item.subscription">
					<img src="/src/assets/icons/starter.svg" alt="" w-5 h-5 mr-1 />

					{{ item.subscription }}
				</div>

				<div v-else>
					{{ $t("no_plan") }}
				</div>
			</div>
		</template>
	</AssignmentTable>
</template>

<script setup lang="ts">
import { User } from "~/models/User";

import { useAuthStore } from "~/stores/auth";
import { useOrganizationStore } from "~/stores/organization";

const store = useOrganizationStore();

const user = computed(() => useAuthStore().getUser);

const resource = computed(() => store.getOrganization!);

const members = computed(() => {
	let users = [...(store.getMembers ?? [])];
	if (store.getCreator) users.unshift(store.getCreator);
	return users;
});

//TODO replace this with members when ManageMember component ignores owner actions
const manageableMembers = computed(() => store.getMembers);

const pendingMembers = computed(() => store.getPendingInvitations);

const preCall = async () => {
	await store.fetchUsers();
	await store.fetchPendingInvitations();
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
</script>

<style lang="scss" scoped>
.manage-button {
	cursor: pointer;

	&.loading {
		cursor: default;
		opacity: 0.5 !important;

		animation: spin 4s linear infinite;

		@keyframes spin {
			100% {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}
	}
}
</style>
