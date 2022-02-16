<template>
	<div class="title" v-if="!process">Register</div>

	<div class="errors" v-if="errMessage != null">
		{{ errMessage }}
	</div>

	<form id="login-form" @submit.prevent="submit" v-if="!process">
		<div class="bs-input">
			<input
				type="text"
				placeholder="First Name"
				required
				maxlength="255"
				autocomplete="given-name"
				v-model="first_name"
			/>
		</div>

		<div class="bs-input">
			<input
				type="text"
				placeholder="Last Name"
				required
				maxlength="255"
				autocomplete="family-name"
				v-model="last_name"
			/>
		</div>

		<div class="bs-input w-icon">
			<input
				type="email"
				placeholder="E-mail address"
				required
				maxlength="255"
				autocomplete="email"
				v-model="email"
				:class="{ error: errField.email }"
				@focus="resetError"
			/>

			<img src="../../assets/icons/at@.svg" alt="at" />
		</div>

		<div class="requed">
			<div class="bs-input w-icon">
				<input
					:type="passwordType"
					placeholder="Password"
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
					src="../../assets/icons/hide_password.svg"
				/>

				<img
					v-if="!showPassword"
					@click="togglePassword"
					src="../../assets/icons/show_password.svg"
				/>
			</div>

			<ul v-show="showValidate.pass">
				<li
					:class="{
						good: validate.minChars >= 8,
						bad: validate.minChars < 8,
					}"
				>
					Minimum 8 characters
				</li>

				<li
					:class="{
						good: validate.letters,
						bad: !validate.letters,
					}"
				>
					Contain letters
				</li>

				<li
					:class="{
						good: validate.numbers,
						bad: !validate.numbers,
					}"
				>
					Contain numbers
				</li>
			</ul>
		</div>

		<div class="requed">
			<div class="bs-input w-icon">
				<input
					:type="passwordType"
					placeholder="Confirm Password"
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
					src="../../assets/icons/hide_password.svg"
				/>

				<img
					v-if="!showPassword"
					@click="togglePassword"
					src="../../assets/icons/show_password.svg"
				/>
			</div>

			<ul v-show="showValidate.confirm">
				<li
					:class="{
						good: validate.same,
						bad: !validate.same,
					}"
				>
					Passwords match
				</li>
			</ul>
		</div>

		<div class="tos">
			<input type="checkbox" v-model="tos" required />

			<span>
				<p>I accept BugShot's</p>
				<p class="linked">Terms of Service</p>
				<p>and</p>
				<p class="linked">Privacy Policy</p>
			</span>
		</div>

		<div class="from-buttons">
			<div class="aLogin">
				<div>Already registered?</div>
				<router-link :to="{ name: 'Login' }">Login</router-link>
			</div>

			<button id="form-submit" type="submit" class="btn bs bf-green">
				Register
			</button>
		</div>
	</form>

	<div class="process" v-if="process">
		<div class="loading" v-if="stage === 0">
			<img src="../../assets/global/loading.svg" alt="loading" />
		</div>

		<div class="success" v-if="stage === 1">
			<img src="../../assets/gif/bug_confirmation.gif" alt="Success" />

			<div>Success!</div>

			<span> Please confirm your email before login! </span>
		</div>
	</div>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import router from "../../router";
import axios from "axios";
import { computed } from "@vue/runtime-core";

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
			stage.value = 0;
			process.value = true;
			errMessage.value = null;
			errField.email = null;
			errField.password = null;

			axios
				.post("auth/register", {
					first_name: first_name.value,
					last_name: last_name.value,
					email: email.value,
					password: password.value,
					password_confirmation: confirm_password.value,
				})
				.then((response) => {
					stage.value = 1;

					console.log(response.data);
				})
				.then(() => {
					setTimeout(() => {
						router.push({
							name: "Login",
						});
					}, 5000);
				})
				.catch((error) => {
					process.value = false;

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

		const process = ref(false);
		const stage = ref(0);

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
			process,
			stage,
			validate,
			showValidate,
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
	justify-content: flex-start;
	height: 600px;
	gap: 30px;

	> * {
		margin: 0 auto;
		width: 100%;
	}

	.from-buttons {
		display: flex;
		align-items: flex-end;
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
	filter: invert(55%) sepia(54%) saturate(630%) hue-rotate(106deg)
		brightness(112%) contrast(90%);
	position: relative;
	display: flex;
	align-items: center;

	&::before {
		content: "";
		background-image: url("../../assets/icons/check.svg");
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
	filter: invert(46%) sepia(72%) saturate(6900%) hue-rotate(343deg)
		brightness(110%) contrast(93%);
	position: relative;
	display: flex;
	align-items: center;

	&::before {
		content: "";
		background-image: url("../../assets/icons/classic_X.svg");
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
