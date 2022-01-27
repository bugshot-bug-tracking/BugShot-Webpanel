<template>
	<div class="title">New Password</div>

	<div class="errors" v-if="errMessage != null">
		{{ errMessage }}
	</div>

	<form id="login-form" @submit.prevent="submit">
		<div class="form-group">
			<input
				id="password"
				:type="passwordType"
				name="password"
				class="field"
				placeholder="Password"
				minlength="8"
				required
				maxlength="255"
				v-model="password"
				autocomplete="new-password"
				:class="{ error: errField.password }"
				@focus="resetError"
			/>

			<img
				class="password-img"
				v-if="showPassword"
				@click="togglePassword"
				src="../../assets/icons/hide_password.svg"
			/>

			<img
				class="password-img"
				v-if="!showPassword"
				@click="togglePassword"
				src="../../assets/icons/show_password.svg"
			/>
		</div>

		<div class="form-group">
			<input
				id="confirm_password"
				:type="passwordType"
				name="confirm_password"
				class="field"
				placeholder="Confirm Password"
				minlength="8"
				required
				maxlength="255"
				v-model="confirm_password"
				autocomplete="new-password"
				:class="{ error: errField.password }"
				@focus="resetError"
			/>

			<img
				class="password-img"
				v-if="showPassword"
				@click="togglePassword"
				src="../../assets/icons/hide_password.svg"
			/>

			<img
				class="password-img"
				v-if="!showPassword"
				@click="togglePassword"
				src="../../assets/icons/show_password.svg"
			/>
		</div>

		<div class="from-buttons">
			<button id="form-submit" type="submit" class="btn bs bf-green">
				Save password
			</button>
		</div>
	</form>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import router from "../../router";
import axios from "axios";

export default {
	name: "Register",
	props: {
		email: {
			required: true,
			type: String,
		},
		token: {
			required: true,
			type: String,
		},
	},
	setup(props) {
		const password = ref("");
		const confirm_password = ref("");

		const showPassword = ref(false);
		const passwordType = ref("password");

		const errMessage = ref(null);

		const errField = reactive({
			password: false,
		});

		const resetError = () => {
			errMessage.value = null;
			errField.password = null;
		};

		const togglePassword = () => {
			showPassword.value = !showPassword.value;
			if (showPassword.value) passwordType.value = "text";
			else passwordType.value = "password";
		};

		const submit = () => {
			axios
				.post("auth/reset-password", {
					email: atob(props.email),
					token: props.token,
					password: password.value,
					password_confirmation: confirm_password.value,
				})
				.then((response) => {
					console.log(response.data);
				})
				.then(() => {
					router.push({ name: "Login" });
				})
				.catch((error) => {
					errMessage.value = null;
					errField.password = null;

					if (error.response?.status !== 422) {
						console.log(error);
						errMessage.value = error.response
							? error.response.data.errors.detail
							: "Error!";
						return;
					}

					const resError = error.response
						? error.response.data.errors
						: "Error!";

					if (resError?.password) {
						errMessage.value = resError.password[0];
						errField.password = true;
						return;
					}
				});
		};

		return {
			password,
			confirm_password,
			showPassword,
			passwordType,
			errMessage,
			errField,
			submit,
			togglePassword,
			resetError,
		};
	},
};
</script>

<style scoped lang="scss">
.title {
	margin: 2% 0 4% 0 !important;
	color: hsl(265, 79%, 41%);
	font-weight: 700;
	font-size: 32px;
	text-align: left;
	width: 400px;
}

#login-form {
	width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.from-buttons {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		align-content: center;
		padding: 4% 1%;

		#remember {
			filter: hue-rotate(40deg);
		}

		> label {
			user-select: none;
		}
	}

	.form-group {
		width: 100%;
		display: flex;
		position: relative;
		align-items: center;
	}

	.field {
		border: 1px solid hsl(264, 78%, 77%);
		border-radius: 8px;
		margin: 16px 0;
		width: 100%;
		padding: 10px;
		padding-right: 40px;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: hsl(265, 79%, 41%);
			outline-color: hsl(265, 79%, 41%);
		}
	}

	.email-img {
		width: 20px;
	}

	#password {
		&::-ms-reveal,
		&::-ms-clear {
			display: none;
		}
	}

	.email-img,
	.password-img {
		position: absolute;
		width: 22px;
		right: 12px;
	}

	.error {
		color: red;
		border: 1px solid red;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: red;
			outline-color: red;
		}
	}
}

.errors {
	color: red;
	font-weight: 500;
	white-space: break-spaces;
	width: 70%;
}

#tos:checked {
	color: #7a2de6;
	accent-color: currentcolor;
}
</style>
