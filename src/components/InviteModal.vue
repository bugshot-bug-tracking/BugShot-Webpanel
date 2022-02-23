<template>
	<a class="btn bs bf-purple" @click="modalActive = !modalActive">
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

					<img src="../assets/icons/at@.svg" alt="at" />
				</div>

				<div class="roles">
					<span>{{ $t("role") }}</span>

					<div class="items">
						<label
							class="role"
							v-for="role in roles"
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

				<button class="btn bs bf-green mt-4">
					{{ $t("add.member") }}
				</button>
			</form>
		</div>
	</Modal>

	<StatusModal
		v-if="process.show"
		:status="process.status"
		:message="process.message"
	/>
</template>

<script>
import { computed, reactive, ref } from "@vue/reactivity";
import axios from "axios";
import Modal from "./Modal.vue";
import store from "../store";
import StatusModal from "./Modals/StatusModal.vue";

export default {
	name: "CreateData",
	props: {
		dataType: {
			required: true,
			type: String,
		},
		id: {
			required: true,
			type: String,
		},
	},
	components: {
		Modal,
		StatusModal,
	},
	setup(props) {
		const modalActive = ref(false);

		const email = ref("");
		const rolePicked = ref(4);

		const roles = computed(() => {
			let roles = [];

			store.getters.getRoles.forEach((element) => {
				roles.push(element);
			});

			return roles.splice(1, 5);
		});

		const sendInvite = async () => {
			try {
				process.show = true;
				process.status = 0;
				process.message = null;

				let base = "";
				if (props.dataType === "Company") base = "companies";
				else if (props.dataType === "Project") base = "projects";

				await axios.post(`${base}/${props.id}/invite`, {
					target_email: email.value,
					role_id: rolePicked.value,
				});

				process.status = 1;
				process.message = `Invitation sent.`;

				setTimeout(() => {
					modalActive.value = false;
					process.show = false;
					process.status = 0;
					process.message = null;
					close();
				}, 4000);
			} catch (error) {
				console.dir(error);
				process.status = 2;
				process.message = error.response.data.data.message.replace(
					":",
					""
				);

				setTimeout(() => {
					process.show = false;
					process.status = 0;
				}, 4000);
			}
		};

		const process = reactive({
			show: false,
			status: 0,
			message: null,
		});

		return {
			modalActive,
			email,
			sendInvite,
			roles,
			rolePicked,
			process,
		};
	},
};
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
		width: 90%;
		display: flex;
		justify-content: space-between;
		user-select: none;

		> span {
			font-weight: bold;
			font-size: 18px;
		}
		.items {
			display: flex;
			gap: 8px;
			flex-wrap: wrap;
			width: 80%;
			justify-content: center;
			align-items: center;
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
