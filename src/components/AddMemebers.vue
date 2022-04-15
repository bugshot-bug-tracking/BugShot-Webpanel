<template>
	<div class="invite-members">
		<span>{{ $t("add.team_member") }}</span>

		<div class="user-list w-100 d-flex flex-column" v-if="displayList">
			<div
				class="user-item w-100"
				v-for="(item, index) in invites"
				:key="index"
			>
				<div class="user-email">{{ item.email }}</div>

				<div class="user-role">
					{{ roles.get(item.role).attributes.designation }}
				</div>

				<div class="actions">
					<img
						src="../assets/icons/edit.svg"
						alt="edit"
						class="edit bs-to-gray"
						@click="editInvite(index)"
					/>

					<img
						src="../assets/icons/round_x.svg"
						alt="delete"
						class="delete bs-to-gray"
						@click="deleteInvite(index)"
					/>
				</div>
			</div>
		</div>

		<img
			src="../assets/icons/add.svg"
			alt="add"
			class="bs-to-green"
			@click="modalActive = true"
		/>
	</div>

	<Modal :show="modalActive" @close="closeModal">
		<div class="wrapper">
			<div class="header mb-3">
				<span>{{ $t("add.team_member") }}</span>
			</div>

			<form
				@submit.prevent="modalSubmit"
				class="d-flex flex-column align-items-center w-100 gap-4"
			>
				<div class="bs-input w-icon">
					<input
						:placeholder="$t('email')"
						:type="'email'"
						v-model="email"
						required
						maxlength="255"
						autocomplete="email"
					/>

					<img src="../assets/icons/at@.svg" alt="at" />
				</div>

				<div class="roles">
					<span>{{ $t("role") }}</span>

					<div class="items">
						<label class="role" v-for="role of roles.values()">
							<input
								type="radio"
								name="roleOptions"
								:value="role.id"
								v-model="rolePicked"
							/>

							<span>{{ role.attributes.designation }}</span>
						</label>
					</div>
				</div>

				<slot name="extra"> </slot>

				<button class="btn bs bf-green mt-4">
					{{ $t("add.member") }}
				</button>
			</form>
		</div>
	</Modal>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import store from "../store";
import Modal from "./Modal.vue";

const emit = defineEmits(["change", "submit"]);
const props = defineProps({
	displayList: {
		type: Boolean,
		required: false,
		default: true,
	},
	externalSubmit: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const invites = ref([]);

const modalActive = ref(false);

const email = ref("");
//! WIP treat the value taking the database roles into consideration
const rolePicked = ref(4);
const editMode = reactive({
	on: false,
	index: -1,
});

const modalSubmit = () => {
	if (props.externalSubmit) {
		emit(
			"submit",
			{
				email: email.value,
				role: rolePicked.value,
			},
			closeModal
		);

		return;
	}

	if (!editMode.on)
		invites.value.push({
			email: email.value,
			role: rolePicked.value,
		});
	else
		invites.value[editMode.index] = {
			email: email.value,
			role: rolePicked.value,
		};

	emit("change", invites.value);

	closeModal();
};

const editInvite = (value) => {
	if (invites.value.length <= value) return;

	email.value = invites.value[value].email;
	rolePicked.value = invites.value[value].role;

	editMode.on = true;
	editMode.index = value;

	modalActive.value = true;
};

const deleteInvite = (value) => {
	if (invites.value.length <= value) return;

	invites.value.splice(value, 1);

	emit("change", invites.value);
};

const closeModal = () => {
	modalActive.value = false;
	email.value = "";
	rolePicked.value = 4;
	editMode.on = false;
	editMode.index = -1;
};

const roles = computed(() => store.getters.getRoles);
</script>

<style lang="scss" scoped>
.invite-members {
	display: flex;
	flex-direction: column;
	border-top: 2px solid #eee5fc;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	margin: 20px 0;
	padding: 20px 0;

	> span {
		font-weight: bold;
	}

	> img {
		cursor: pointer;

		&:hover {
			filter: brightness(0) saturate(1) invert(18%) sepia(72%)
				saturate(5384%) hue-rotate(263deg) brightness(94%) contrast(92%);
		}
	}
}

.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 25px 50px;

	.header {
		span {
			font-weight: bold;
			font-size: 24px;
		}
	}

	.roles {
		display: flex;
		gap: 8px;
		justify-content: space-between;
		user-select: none;

		> span {
			font-weight: bold;
			font-size: 18px;
		}
		.items {
			display: grid;
			justify-items: center;
			grid-template-columns: 1fr 1fr 1fr;
			align-items: center;
			gap: 8px;
		}
		.role {
			span {
				border: 1px solid #7a2ee6;
				border-radius: 8px;
				padding: 4px;
				color: #7a2ee6;
			}

			input:checked + span {
				border-radius: 8px;
				background: #7a2ee6;
				color: white;
			}

			input {
				display: none;
			}
		}
	}
}

.user-list {
	display: flex;
	flex-direction: column;
	gap: 14px;

	.user-item {
		display: grid;
		grid-template-columns: 4fr 1fr 1fr;
		align-items: center;
		gap: 16px;

		> .actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;
			justify-items: center;
			gap: 16px;

			img {
				width: 1.5rem;
				cursor: pointer;

				&.edit:hover {
					filter: brightness(0) saturate(1) invert(18%) sepia(72%)
						saturate(5384%) hue-rotate(263deg) brightness(94%)
						contrast(92%);
				}

				&.delete:hover {
					filter: brightness(0) saturate(1) invert(46%) sepia(28%)
						saturate(5216%) hue-rotate(331deg) brightness(87%)
						contrast(121%);
				}
			}
		}
	}

	.user-role {
		border-radius: 8px;
		padding: 4px 8px;
		background-color: #7a2ee6;
		color: #fff;
		font-size: 14px;
	}

	.user-email {
		word-break: break-all;
		text-align: left;
	}
}
</style>
