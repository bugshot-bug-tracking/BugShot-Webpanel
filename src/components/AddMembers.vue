<!-- Note:
	- maybe refactor to be more reusable
 -->

<template>
	<div class="invite-members">
		<span>{{ $t("add.team_member") }}</span>

		<div class="user-list" v-if="displayList">
			<div class="user-item" v-for="(item, index) in invites" :key="index">
				<div class="user-email">{{ item.email }}</div>

				<Badge
					:text="
						$t(
							'roles.' +
								roles
									.find((x) => x.id === item.role_id)
									?.attributes.designation.toLocaleLowerCase()
						)
					"
					preset="pf"
				/>

				<div class="actions">
					<img
						src="/src/assets/icons/edit.svg"
						alt="edit"
						class="edit black-to-gray"
						@click="inviteModal.openEdit(item)"
					/>

					<img
						src="/src/assets/icons/close_1.svg"
						alt="delete"
						class="delete black-to-gray"
						@click="deleteInvite(index)"
					/>
				</div>
			</div>
		</div>

		<img
			src="/src/assets/icons/add.svg"
			alt="add"
			class="black-to-green"
			style="width: 2rem; height: 2rem"
			@click="inviteModal.open"
		/>
	</div>

	<InviteMemberModal
		:show="inviteModal.show"
		@close="inviteModal.close"
		@submit="inviteModal.submit"
		@change="inviteModal.change"
		:user="inviteModal.user"
		:editMode="inviteModal.editMode"
		:infoKey="infoKey"
	>
		<template #extra>
			<slot name="extra" />
		</template>
	</InviteMemberModal>
</template>

<script setup lang="ts">
import { User } from "~/models/User";
import { useMainStore } from "~/stores/main";

const emit = defineEmits(["change", "submit"]);

// const props =
defineProps({
	displayList: {
		type: Boolean,
		required: false,
		default: true,
	},

	infoKey: {
		type: String,
		required: false,
		default: undefined,
		description:
			"Key used to get the information text for the roles from the translation files",
	},
});

const roles = computed(() => useMainStore().getRoles!);

const invites = ref<{ email: string; role_id: number }[]>([]);

const deleteInvite = (index: number) => {
	if (invites.value.length <= index) return;

	invites.value.splice(index, 1);

	emit("change", invites.value);
};

const inviteModal = reactive({
	show: false,
	user: undefined as User | { email: string; role_id: number } | undefined,
	editMode: false,

	open: () => {
		inviteModal.show = true;
		inviteModal.user = undefined;
		inviteModal.editMode = false;
	},
	close: () => {
		inviteModal.show = false;
		inviteModal.user = undefined;
		inviteModal.editMode = false;
	},
	openEdit: (user: { email: string; role_id: number }) => {
		inviteModal.editMode = true;
		inviteModal.user = user;
		inviteModal.show = true;
	},

	submit: async (user: { email: string; role_id: number }) => {
		invites.value.push(user);

		emit("change", invites.value);

		inviteModal.close();
	},
	change: async (value: {
		old: { email: string; role_id: number };
		new: { email: string; role_id: number };
	}) => {
		const index = invites.value.findIndex(
			(x) => x.email === (value.old as { email: string; role_id: number }).email
		);

		invites.value[index] = value.new;

		emit("change", invites.value);

		inviteModal.close();
	},
});
</script>

<style lang="scss" scoped>
.invite-members {
	display: flex;
	flex-direction: column;
	border-top: 2px solid #eee5fc;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	margin: 1.5rem 0;
	padding: 1.5rem 0;

	> span {
		font-weight: bold;
	}

	> img {
		cursor: pointer;

		&:hover {
			filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
				hue-rotate(263deg) brightness(94%) contrast(92%);
		}
	}
}

.user-list {
	display: flex;
	flex-direction: column;
	gap: 0.875rem;

	.user-item {
		display: grid;
		grid-template-columns: 3fr 1fr 1fr;
		align-items: center;
		gap: 1rem;

		> .actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			justify-items: center;
			gap: 1rem;

			img {
				width: 1.5rem;
				cursor: pointer;

				&.edit:hover {
					filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
						hue-rotate(263deg) brightness(94%) contrast(92%);
				}

				&.delete:hover {
					filter: brightness(0) saturate(1) invert(46%) sepia(28%) saturate(5216%)
						hue-rotate(331deg) brightness(87%) contrast(121%);
				}
			}
		}
	}

	.user-email {
		word-break: normal;
		text-align: left;
	}
}
</style>
