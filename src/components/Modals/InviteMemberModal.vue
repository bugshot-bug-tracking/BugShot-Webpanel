<template>
	<MyModal :modelValue="show" z-101>
		<ModalTemplate @close="closeModal">
			<template #header-text>
				{{ editMode ? $t("edit.team_member") : $t("add.team_member") }}
			</template>

			<form @submit.prevent="modalSubmit" @reset="closeModal">
				<div :style="{ width: '100%' }">
					<n-auto-complete
						v-model:value="email"
						:input-props="{
							autocomplete: 'email',
							required: true,
							maxlength: 255,
							type: 'email',
						}"
						:placeholder="$t('email')"
						:disabled="disableSubmit && user && Object.hasOwn(user, 'id')"
						:options="memberOptions"
					>
						<template #suffix>
							<img class="input-image" src="/src/assets/icons/mail.svg" alt="at" />
						</template>
					</n-auto-complete>
				</div>

				<div class="roles">
					<span>{{ $t("role") }}</span>

					<div class="items">
						<label class="role" v-for="role of roles">
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

				<slot name="extra" />

				<div flex justify-around style="width: 100%">
					<button
						type="submit"
						class="bs-btn green mt-4"
						:class="{ disabled: disableSubmit }"
					>
						{{ editMode ? $t("edit.member") : $t("add.member") }}
					</button>

					<button type="reset" class="bs-btn purple mt-4">
						{{ $t("cancel") }}
					</button>
				</div>
			</form>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { User } from "~/models/User";
import { useMainStore } from "~/stores/main";

const emit = defineEmits(["close", "submit", "change"]);
const props = defineProps({
	show: {
		type: Boolean,
		default: true,
	},

	editMode: {
		type: Boolean,
		required: false,
		default: false,
	},

	user: {
		type: Object as PropType<User | { email: string; role_id: number }>,
		required: false,
		default: undefined,
	},

	suggestOptions: {
		type: Array as PropType<string[]>,
		required: false,
		default: [],
	},
});

const roles = computed(() => useMainStore().getRoles);
//! WIP treat the value taking the database roles into consideration
const rolePicked = ref(2);

const email = ref("");

const modalSubmit = () => {
	if (disableSubmit.value) return;

	if (!props.editMode) {
		emit("submit", {
			email: email.value,
			role_id: rolePicked.value,
		});
	} else {
		emit("change", {
			old: props.user,
			new: { email: email.value, role_id: rolePicked.value },
		});
	}

	closeModal();
};

const closeModal = () => {
	emit("close");
	email.value = "";
	rolePicked.value = 2;
};

watch(
	props,
	() => {
		if (props.editMode && props.user) {
			if (Object.hasOwn(props.user, "id")) {
				let user = props.user as User;

				rolePicked.value = user.role!.id;
				email.value = user.attributes.email;
			} else {
				let user = props.user as { email: string; role_id: number };

				rolePicked.value = user.role_id;
				email.value = user.email;
			}
		}
	},
	{ deep: true }
);

const disableSubmit = computed(() => {
	if (!props.editMode) return false;

	if (props.user && Object.hasOwn(props.user, "id")) {
		let user = props.user as User;

		if (rolePicked.value === user.role!.id && email.value === user.attributes.email)
			return true;
	} else {
		let user = props.user as { email: string; role_id: number };

		if (rolePicked.value === user.role_id && email.value === user.email) return true;
	}

	return false;
});

const memberOptions = computed(() => {
	let members = props.suggestOptions;

	return members?.filter((m) => m.includes(email.value));
});
</script>

<style lang="scss" scoped>
form {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	gap: 1rem;
	padding: 1.5rem 3rem;

	.roles {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		user-select: none;

		> span {
			font-weight: bold;
			font-size: 1.125rem;
		}

		.items {
			display: grid;
			justify-items: center;
			grid-template-columns: 1fr 1fr 1fr;
			align-items: center;
			gap: 0.5rem;
		}

		.role {
			cursor: pointer;

			span {
				border: 1px solid #7a2ee6;
				border-radius: 0.5rem;
				padding: 0.25rem;
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
</style>
