<template>
	<section class="member-list">
		<n-h4 style="width: 100%" m-o>
			{{ invitationMode ? $t("pending_invitations") : $t("member_list") }}
		</n-h4>

		<ul class="user-list">
			<li class="user-item" v-for="(item, index) in list" :key="index">
				<div class="user-email">
					{{
						invitationMode
							? (item as Invitation).attributes.target_email
							: (item as User).attributes.email
					}}
				</div>

				<div
					class="user-role"
					v-if="!invitationMode && (item.type === 'User') && (item as User).role"
				>
					{{ (item as User).role?.attributes.designation }}
				</div>
				<div v-else />

				<div class="actions">
					<img
						src="/src/assets/icons/edit.svg"
						alt="edit"
						class="edit black-to-gray"
						@click="emit('edit', item as User)"
						v-if="!invitationMode"
					/>
					<div v-else />

					<img
						src="/src/assets/icons/close_1.svg"
						alt="delete"
						class="delete black-to-gray"
						@click="emit('delete', item)"
					/>
				</div>
			</li>
		</ul>

		<a v-if="!invitationMode">
			<img
				src="/src/assets/icons/add.svg"
				alt="add"
				class="black-to-green"
				style="width: 2rem; height: 2rem"
				@click="emit('add')"
			/>
		</a>
	</section>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Invitation } from "~/models/Invitation";
import { User } from "~/models/User";

const emit = defineEmits<{
	(e: "add"): void;
	(e: "edit", user: User): void;
	(e: "delete", value: User | any): void;
}>();

defineProps({
	list: {
		type: Array as PropType<User[] | Invitation[]>,
		required: true,
		default: [],
	},
	invitationMode: {
		type: Boolean,
		required: false,
		default: false,
	},
});
</script>

<style lang="scss" scoped>
h1 {
	font-size: 1.5rem;
}

.member-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}

.user-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0 1rem;
	width: 100%;

	.user-item {
		display: grid;
		grid-template-columns: 3fr 1fr 1fr;
		align-items: center;
		gap: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #eee5fc;

		&:last-of-type {
			border-bottom: unset;
		}

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

	.user-role {
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
		background-color: #7a2ee6;
		color: #ffffff;
		font-size: 0.875rem;
		text-align: center;
		user-select: none;
	}

	.user-email {
		word-break: normal;
		text-align: left;
	}
}

a {
	cursor: pointer;

	&:hover {
		filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%) hue-rotate(263deg)
			brightness(94%) contrast(92%);
	}
}
</style>
