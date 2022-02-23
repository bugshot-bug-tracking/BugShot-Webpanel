<template>
	<div class="title">{{ $t("password_reset") }}</div>

	<form v-if="!message" id="login-form" @submit.prevent="submit">
		<div class="bs-input w-icon">
			<input
				type="email"
				:placeholder="$t('email_address')"
				required
				maxlength="255"
				autocomplete="email"
				v-model="email"
				:class="{ error: errMessage }"
				@focus="errMessage = null"
			/>

			<img src="../../assets/icons/at@.svg" alt="at" />
		</div>

		<div class="errors" v-if="errMessage != null">
			{{ errMessage }}
		</div>

		<div class="from-buttons">
			<button id="form-submit" type="submit" class="btn bs bf-green">
				{{ $t("reset_password") }}
			</button>
		</div>
	</form>

	<div v-if="message" class="d-flex flex-column gap-4 align-items-center">
		<div class="message">{{ message }}</div>
	</div>
</template>

<script>
import { ref } from "@vue/reactivity";

import axios from "axios";
import router from "../../router";

export default {
	name: "ForgotPassword",
	setup() {
		const email = ref("");
		const message = ref(null);
		const errMessage = ref(null);

		const submit = () => {
			if (email.value && email.value.length > 4)
				try {
					axios
						.post(`auth/forgot-password`, {
							email: email.value,
						})
						.then((response) => {
							message.value = response.data;
						})
						.then(() => {
							setTimeout(() => {
								router.push({ name: "Home" });
							}, 4000);
						});
				} catch (error) {
					console.log(error);
				}
		};

		return {
			email,
			errMessage,
			message,
			submit,
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
	gap: 1rem;

	.from-buttons {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: flex-end;
		align-content: center;
		padding: 2% 0 10% 0%;
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

.message {
	background: #7a2ee6 0% 0% no-repeat padding-box;
	border-radius: 8px;
	color: white;
	width: 400px;
	height: 88px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
