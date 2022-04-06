<template>
	<div class="title">{{ $t("log_in") }}</div>

	<form id="login-form" @submit.prevent="submit">
		<div class="bs-input w-icon">
			<input
				type="email"
				:placeholder="$t('email_address')"
				required
				maxlength="255"
				autocomplete="email"
				v-model="email"
				@focus="errMessage = null"
				:class="{ error: errMessage }"
			/>

			<img src="../../assets/icons/at@.svg" alt="at" />
		</div>

		<div class="bs-input w-icon">
			<input
				:type="passwordType"
				:placeholder="$t('password')"
				minlength="8"
				required
				maxlength="255"
				v-model="password"
				autocomplete="current-password"
				@focus="errMessage = null"
				:class="{ error: errMessage }"
			/>

			<img
				v-show="showPassword"
				@click="togglePassword"
				src="../../assets/icons/hide_password.svg"
			/>

			<img
				v-show="!showPassword"
				@click="togglePassword"
				src="../../assets/icons/show_password.svg"
			/>
		</div>

		<div class="errors" v-if="errMessage != null">
			{{ errMessage }}
		</div>

		<div class="from-buttons">
			<button type="submit" class="btn bs bf-green">
				{{ $t("log_in") }}
			</button>
		</div>
	</form>

	<div class="recover">
		<router-link :to="{ name: 'Forgot' }" style="color: #7a2de6">
			{{ $t("forgot_password") + "?" }}
		</router-link>

		<router-link :to="{ name: 'Register' }" class="btn bs be-purple">
			{{ $t("register") }}
		</router-link>
	</div>
</template>

<script>
import { ref } from "@vue/reactivity";
import store from "../../store";
import router from "../../router";

export default {
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
					router.push({ name: "Home" });
				})
				.catch((error) => {
					errMessage.value = error.response.data.message;
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
	margin: 0 0 2rem 0 !important;
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
	gap: 2rem;
	margin-bottom: 3rem;

	> * {
		margin: 0 auto;
		width: 100%;
	}

	.from-buttons {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: flex-end;
		align-content: center;
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
	margin: -1.5rem 0 -1rem 0 !important;
}

.recover {
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: space-between;
	width: 400px;
	padding: 1.5rem 0;
	border-top: 2px solid hsl(264, 78%, 77%);

	> p {
		margin: 0;
	}
}
</style>
