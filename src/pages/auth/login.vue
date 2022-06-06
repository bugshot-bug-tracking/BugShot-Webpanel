<template>
	<div class="title">{{ t("log_in") }}</div>

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

			<img src="/src/assets/icons/at@.svg" alt="at" />
		</div>

		<div class="bs-input w-icon">
			<input
				:type="passwordOpt.type"
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
				v-show="passwordOpt.hidden"
				@click="passwordOpt.toggle"
				src="/src/assets/icons/hide_password.svg"
				style="cursor: pointer"
			/>

			<img
				v-show="!passwordOpt.hidden"
				@click="passwordOpt.toggle"
				src="/src/assets/icons/show_password.svg"
				style="cursor: pointer"
			/>
		</div>

		<div class="errors" v-if="errMessage != null">
			{{ errMessage }}
		</div>

		<div class="from-buttons">
			<button type="submit" class="bs-btn green">
				{{ $t("log_in") }}
			</button>
		</div>
	</form>

	<div class="bottom">
		<RouterLink :to="{ name: 'Forgot' }" style="color: #7a2de6">
			{{ t("forgot_password") + "?" }}
		</RouterLink>

		<RouterLink
			:to="{ name: 'Register' }"
			class="bs-btn purple empty"
			style="text-decoration: none"
		>
			{{ t("register") }}
		</RouterLink>
	</div>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const { t } = useI18n();

const email = ref("");
const password = ref("");

const passwordOpt = reactive({
	hidden: true,
	type: "password",
	toggle: () => {
		passwordOpt.hidden = !passwordOpt.hidden;
		passwordOpt.type = passwordOpt.hidden ? "password" : "text";
	},
});

const errMessage = ref(null);

const submit = () => {
	useAuthStore()
		.login({
			email: email.value,
			password: password.value,
		})
		.then((response) => {
			router.push({ name: "home" });
		})
		.catch((error) => {
			errMessage.value = error.response.data.message;
		});
};
</script>

<style scoped lang="scss">
.title {
	margin: 0 0 2rem 0;
	color: hsl(265, 79%, 41%);
	font-weight: 700;
	font-size: 2rem;
	text-align: left;
	width: 400px;
}

form {
	width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	margin-bottom: 3rem;

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

.bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 400px;
	padding: 1.5rem 0;
	border-top: 2px solid hsl(264, 78%, 77%);

	> p {
		margin: 0;
	}
}
</style>

<route lang="yaml">
name: Login

meta:
    layout: auth
</route>
