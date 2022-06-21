<template>
	<a class="bs-btn purple" @click="modalActive = !modalActive">
		{{ $t("add.member") }}
	</a>

	<Modal :show="modalActive" @close="modalActive = false">
		<div class="wrapper">
			<div class="header">
				<span>{{ $t("add.team_member") }}</span>
			</div>

			<form
				@submit.prevent="sendInvite"
				class="d-flex flex-column align-items-center"
			>
				<div class="bs-input w-icon my-3">
					<input
						:placeholder="$t('email')"
						:type="'email'"
						v-model="email"
						required
						maxlength="255"
						autocomplete="email"
					/>

					<img src="/src/assets/icons/at@.svg" alt="at" />
				</div>

				<div class="roles">
					<span>{{ $t("role") }}</span>

					<div class="items">
						<label
							class="role"
							v-for="role of roles"
							:key="role.id"
						>
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

				<button class="bs-btn green mt-4">
					{{ $t("add.member") }}
				</button>
			</form>
		</div>
	</Modal>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup>
import axios from "axios";
import { useMainStore } from "~/stores/main";

const props = defineProps({
	dataType: {
		required: true,
		type: String,
	},
	id: {
		required: true,
		type: String,
	},
});
const modalActive = ref(false);

const email = ref("");
const rolePicked = ref(2);

const roles = computed(() => useMainStore().getRoles);

const sendInvite = async () => {
	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		let base = "";
		if (props.dataType === "Company") base = "companies";
		else if (props.dataType === "Project") base = "projects";

		await axios.post(`${base}/${props.id}/invite`, {
			target_email: email.value,
			role_id: rolePicked.value,
		});

		loadingModal.state = 1;
		loadingModal.message = `Invitation sent.`;

		setTimeout(() => {
			modalActive.value = false;
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
			close();
		}, 4000);
	} catch (error) {
		console.dir(error);
		loadingModal.state = 2;
		loadingModal.message = error.response.data.data?.message.replace(
			":",
			""
		);

		if (error.response.status === 403)
			loadingModal.message =
				"You are not authorized to complete this action!";

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
		}, 4000);
	}
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.wrapper {
	width: 20vw;
	min-width: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 50px;

	.header {
		span {
			font-weight: bold;
			font-size: 32px;
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
</style>
