<template>
	<Layout>
		<div class="title">Register</div>

		<form id="login-form" @submit.prevent="submit">
			<div class="form-group">
				<input
					id="first_name"
					type="first_name"
					name="first_name"
					class="field"
					placeholder="First Name"
					required
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
					autocomplete="email"
					v-model="email"
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
					v-model="password"
					autocomplete="new-password"
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
					v-model="confirm_password"
					autocomplete="new-password"
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
	</Layout>
</template>

<script>
import { ref } from "@vue/reactivity";
import Layout from "./Layout.vue";
import router from "../../router";

export default {
	components: { Layout },
	name: "RegisterPage",
	setup() {
		const first_name = ref("");
		const last_name = ref("");
		const email = ref("");
		const password = ref("");
		const confirm_password = ref("");
		const showPassword = ref(false);
		const passwordType = ref("password");

		const togglePassword = () => {
			showPassword.value = !showPassword.value;
			if (showPassword.value) passwordType.value = "text";
			else passwordType.value = "password";
		};

		const submit = () => {};

		return {
			first_name,
			last_name,
			email,
			password,
			confirm_password,
			showPassword,
			passwordType,
			submit,
			togglePassword,
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
}
</style>
