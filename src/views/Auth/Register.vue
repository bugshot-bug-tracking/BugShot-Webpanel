<template>
	<div class="title">Register</div>

	<div class="errors" v-if="errMessage != null">
		{{ errMessage }}
	</div>

	<form id="login-form" @submit.prevent="submit">
		<div class="form-group">
			<input
				id="first_name"
				type="first_name"
				name="first_name"
				class="field"
				placeholder="First Name"
				required
				maxlength="255"
				autocomplete="given-name"
				v-model="first_name"
			/>
		</div>

		<div class="form-group">
			<input
				id="last_name"
				type="last_name"
				name="last_name"
				class="field"
				placeholder="Last Name"
				required
				maxlength="255"
				autocomplete="family-name"
				v-model="last_name"
			/>
		</div>

		<div class="form-group">
			<input
				id="email"
				type="email"
				name="email"
				class="field"
				placeholder="E-mail address"
				required
				maxlength="255"
				autocomplete="email"
				v-model="email"
				:class="{ error: errField.email }"
				@focus="resetError"
			/>

			<img class="email-img" src="../../assets/icons/at@.svg" />
		</div>

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
			<label>
				<input
					type="checkbox"
					name="tos"
					id="tos"
					v-model="tos"
					required
				/>
				Terms of Service
			</label>

			<button id="form-submit" type="submit" class="btn btn-primary">
				<span>Register</span>
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
	setup() {
		const first_name = ref("");
		const last_name = ref("");
		const email = ref("");
		const password = ref("");
		const confirm_password = ref("");

		const showPassword = ref(false);
		const passwordType = ref("password");

		const tos = ref(false);

		const errMessage = ref(null);

		const errField = reactive({
			email: false,
			password: false,
		});

		const resetError = () => {
			errMessage.value = null;
			errField.email = null;
			errField.password = null;
		};

		const togglePassword = () => {
			showPassword.value = !showPassword.value;
			if (showPassword.value) passwordType.value = "text";
			else passwordType.value = "password";
		};

		const submit = () => {
			axios
				.post("auth/register", {
					first_name: first_name.value,
					last_name: last_name.value,
					email: email.value,
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
					console.dir(error);

					errMessage.value = null;
					errField.email = null;
					errField.password = null;

					if (error.response.status !== 422)
						console.error(error.response.data.errors);

					const resError = error.response.data.errors;

					if (resError?.email) {
						errMessage.value = resError.email[0];
						errField.email = true;
						return;
					}

					if (resError?.password) {
						errMessage.value = resError.password[0];
						errField.password = true;
						return;
					}
				});
		};

		return {
			first_name,
			last_name,
			email,
			password,
			confirm_password,
			showPassword,
			passwordType,
			tos,
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
	margin: 2% 0 5% 0 !important;
	color: hsl(265, 79%, 41%);
	font-weight: 700;
	font-size: 22px;
}

#login-form {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.from-buttons {
		display: inline-flex;
		align-items: baseline;
		width: 100%;
		justify-content: space-evenly;
		margin-bottom: 10px;

		#form-submit {
			background: hsl(158, 80%, 47%) 0% 0% no-repeat padding-box;
			border-radius: 20px;
			border-color: hsl(158, 80%, 47%);
			padding: 8px 20px;
			font-weight: 500;
		}

		#remember {
			filter: hue-rotate(40deg);
		}
	}

	.form-group {
		width: 95%;
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

	.register {
		border-top: 2px solid #bc97f2;
		padding: 15px 0;

		p {
			font-size: 14px;
			color: #1f0237;
			line-height: 22px;
		}
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
}
</style>
