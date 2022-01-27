<template>
	<div class="title">Password reset</div>

	<form v-if="!message" id="login-form" @submit.prevent="submit">
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

		<div class="errors" v-if="errMessage != null">
			{{ errMessage }}
		</div>

		<div class="from-buttons">
			<button id="form-submit" type="submit" class="btn bs bf-green">
				Reset Password
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
	name: "Login",
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
		justify-content: flex-end;
		align-content: center;
		padding: 2% 0 10% 0%;

		#remember {
			filter: hue-rotate(40deg);
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
