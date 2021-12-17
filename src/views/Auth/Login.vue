<template>
	<div class="title">Log In</div>

	<form id="login-form" @submit.prevent="submit">
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
				@focus="errMessage = null"
				:class="{ error: errMessage }"
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
				autocomplete="current-password"
				@focus="errMessage = null"
				:class="{ error: errMessage }"
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

		<div class="errors" v-if="errMessage != null">
			{{ errMessage }}
		</div>

		<div class="from-buttons">
			<div class="recover">
				<p>Forgot Password?</p>

				<router-link to="/recover" class="btn btn-recover">
					Recover
				</router-link>
			</div>

			<button id="form-submit" type="submit" class="btn bs bf-green">
				Log In
			</button>
		</div>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import store from "../../store";
import router from "../../router";

export default {
	name: "Login",
	setup() {
		const email = ref("");
		const password = ref("");

		const showPassword = ref(false);
		const passwordType = ref("password");

		const errMessage = ref(null);

		const togglePassword = () => {
			showPassword.value = !showPassword.value;
			if (showPassword.value) passwordType.value = "text";
			else passwordType.value = "password";
		};

		const submit = () => {
			store
				.dispatch("login", {
					email: email.value,
					password: password.value,
				})
				.then((response) => {
					if (response === false)
						errMessage.value = "Incorect E-Mail or Password.";
					else router.push({ name: "Home" });
				});
		};

		return {
			email,
			password,
			showPassword,
			passwordType,
			errMessage,
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
	width: 70%;
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
	width: 85%;
	text-align: right;
	padding-bottom: 10px;
}
</style>
