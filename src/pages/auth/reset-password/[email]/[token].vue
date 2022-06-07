<template>
	<div class="title">{{ $t("new_password") }}</div>

	<div class="errors" v-if="errMessage != null">
		{{ errMessage }}
	</div>

	<form id="login-form" @submit.prevent="submit">
		<div class="requed">
			<div class="bs-input w-icon">
				<input
					:type="passwordType"
					:placeholder="$t('password')"
					minlength="8"
					required
					maxlength="255"
					v-model="password"
					autocomplete="new-password"
					:class="{ error: errField.password }"
					@focus.prevent="
						() => {
							showValidate.pass = true;
							resetError();
						}
					"
					@click="showValidate.pass = true"
					@blur.prevent="showValidate.pass = false"
				/>

				<img
					v-if="showPassword"
					@click="togglePassword"
					src="/src/assets/icons/hide_password.svg"
				/>

				<img
					v-if="!showPassword"
					@click="togglePassword"
					src="/src/assets/icons/show_password.svg"
				/>
			</div>

			<ul v-show="showValidate.pass">
				<li
					:class="{
						good: validate.minChars >= 8,
						bad: validate.minChars < 8,
					}"
				>
					{{ $t("limits.min_chars", { x: 8 }) }}
				</li>

				<li
					:class="{
						good: validate.letters,
						bad: !validate.letters,
					}"
				>
					{{ $t("limits.letters") }}
				</li>

				<li
					:class="{
						good: validate.numbers,
						bad: !validate.numbers,
					}"
				>
					{{ $t("limits.numbers") }}
				</li>
			</ul>
		</div>

		<div class="requed">
			<div class="bs-input w-icon">
				<input
					:type="passwordType"
					:placeholder="$t('confirm_password')"
					minlength="8"
					required
					maxlength="255"
					v-model="confirm_password"
					autocomplete="new-password"
					:class="{ error: errField.password }"
					@focus.prevent="
						() => {
							showValidate.confirm = true;
							resetError();
						}
					"
					@blur.prevent="showValidate.confirm = false"
				/>

				<img
					v-if="showPassword"
					@click="togglePassword"
					src="/src/assets/icons/hide_password.svg"
				/>

				<img
					v-if="!showPassword"
					@click="togglePassword"
					src="/src/assets/icons/show_password.svg"
				/>
			</div>

			<ul v-show="showValidate.confirm">
				<li
					:class="{
						good: validate.same,
						bad: !validate.same,
					}"
				>
					{{ $t("limits.passwords_match") }}
				</li>
			</ul>
		</div>

		<div class="from-buttons">
			<button id="form-submit" type="submit" class="bs-btn green">
				{{ $t("save_password") }}
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import axios from "axios";

const router = useRouter();

const props = defineProps({
	email: {
		required: true,
		type: String,
	},
	token: {
		required: true,
		type: String,
	},
});
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
	errField.password = false;
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
			errField.password = false;

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

const showValidate = reactive({
	pass: false,
	confirm: false,
});

// password validations
const validate = computed(() => {
	return {
		minChars: password.value.length,
		letters: password.value.match(/[a-zA-Z]/g),
		numbers: password.value.match(/[0-9]/g),
		same: password.value === confirm_password.value,
	};
});
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
	justify-content: flex-start;
	height: 300px;
	gap: 30px;

	> * {
		margin: 0 auto;
		width: 100%;
	}

	.from-buttons {
		display: flex;
		align-items: flex-end;
		width: 100%;
		justify-content: flex-end;
		align-content: center;
		padding: 4% 1%;

		#remember {
			filter: hue-rotate(40deg);
		}

		> label {
			user-select: none;
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

.requed {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	> * {
		margin: 0 auto;
		width: 100%;
	}

	ul {
		margin: 1rem 0 0 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
}

.errors {
	color: red;
	font-weight: 500;
	margin: 1rem 0;
}

.tos {
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 14px;
	width: 100%;
	justify-content: center;

	input:checked {
		color: #7a2de6;
		accent-color: currentcolor;
	}

	> span {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	p {
		margin: 0;
	}

	.linked {
		color: hsl(265, 79%, 54%);
		cursor: pointer;
		text-decoration: none;

		&:hover {
			color: hsl(265, 79%, 44%);
		}
	}
}

.aLogin {
	display: flex;
	gap: 4px;
	align-items: center;
	font-size: 14px;

	a {
		text-decoration: underline;
		color: hsl(158, 80%, 47%);
		font-weight: bold;
		text-transform: uppercase;
		cursor: pointer;

		&:hover {
			color: hsl(158, 80%, 42%);
		}
	}
}

.process {
	width: 400px;

	img {
		width: 300px;
		height: 300px;
	}

	.success {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;

		> div {
			color: #5916b9;
			font-weight: bold;
			font-size: 32px;
		}

		> span {
			font-size: 18px;
		}
	}
}

.good {
	color: black;
	// color: #18d891;
	filter: brightness(0) saturate(1) invert(63%) sepia(74%) saturate(493%)
		hue-rotate(104deg) brightness(96%) contrast(88%);
	position: relative;
	display: flex;
	align-items: center;

	&::before {
		content: "";
		background-image: url("/src/assets/icons/check.svg");
		background-position: 0 0;
		background-size: auto;
		background-repeat: no-repeat;
		width: 1rem;
		height: 1rem;
		position: absolute;
		left: -1.5rem;
	}
}
.bad {
	color: black;
	// color: #f23636;
	filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
		hue-rotate(263deg) brightness(94%) contrast(92%);
	position: relative;
	display: flex;
	align-items: center;

	&::before {
		content: "";
		background-image: url("/src/assets/icons/classic_X.svg");
		background-position: 0 0;
		background-size: auto;
		background-repeat: no-repeat;
		width: 1rem;
		height: 1rem;
		position: absolute;
		left: -1.5rem;
	}
}
</style>

<route lang="yaml">
name: Reset

meta:
    layout: auth
</route>
