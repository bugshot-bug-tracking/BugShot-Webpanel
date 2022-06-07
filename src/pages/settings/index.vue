<template>
	<div class="user-settings-layout bs-scroll s-purple" v-if="user">
		<Column class="column personal">
			<template v-slot:header>
				<div class="bold">{{ $t("personal_settings") }}</div>
			</template>

			<div class="body">
				<Container>
					<form
						class="wrapper my-3 default-form"
						@submit.prevent="saveClick"
						@reset.prevent="cancelClick"
					>
						<div class="group">
							<div class="label">{{ $t("first_name") }}</div>

							<div class="bs-input my-3">
								<input
									v-model="data.first_name"
									:placeholder="$t('first_name')"
									type="text"
									autocomplete="given-name"
									minlength="1"
									maxlength="255"
								/>
							</div>
						</div>

						<div class="group">
							<div class="label">{{ $t("last_name") }}</div>

							<div class="bs-input my-3">
								<input
									v-model="data.last_name"
									:placeholder="$t('last_name')"
									type="text"
									autocomplete="family-name"
									minlength="1"
									maxlength="255"
								/>
							</div>
						</div>

						<div class="text-header">{{ $t("contact_info") }}</div>

						<div class="group">
							<div class="label">{{ $t("email") }}</div>

							<div class="bs-input w-icon my-3">
								<input
									v-model="data.email"
									:placeholder="$t('email')"
									type="email"
									autocomplete="email"
									minlength="1"
									maxlength="255"
								/>

								<img src="/src/assets/icons/at@.svg" alt="at" />
							</div>
						</div>

						<div class="text-header">
							{{ $t("change_password") }}
						</div>

						<div class="bs-input w-icon my-3 w-95">
							<input
								v-model="data.password.current"
								:placeholder="$t('current_password')"
								:type="show.current ? 'text' : 'password'"
								autocomplete="password"
								required
								minlength="8"
								maxlength="255"
								@focus.prevent="errMessage = null"
								@blur.prevent="errMessage = null"
							/>

							<img
								v-if="show.current"
								src="/src/assets/icons/hide_password.svg"
								alt="hide"
								@click="show.current = !show.current"
							/>

							<img
								v-else
								src="/src/assets/icons/show_password.svg"
								alt="show"
								@click="show.current = !show.current"
							/>
						</div>

						<div class="errors" v-if="errMessage != null">
							{{ errMessage }}
						</div>

						<div class="requed my-3 w-95">
							<div class="bs-input w-icon">
								<input
									v-model="data.password.new"
									:placeholder="$t('new_password')"
									:type="show.new ? 'text' : 'password'"
									autocomplete="new-password"
									minlength="8"
									maxlength="255"
									@focus.prevent="showValidate.pass = true"
									@click="showValidate.pass = true"
									@blur.prevent="showValidate.pass = false"
								/>

								<img
									v-if="show.new"
									src="/src/assets/icons/hide_password.svg"
									alt="hide"
									@click="show.new = !show.new"
								/>

								<img
									v-else
									src="/src/assets/icons/show_password.svg"
									alt="show"
									@click="show.new = !show.new"
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

						<div class="requed my-3 w-95">
							<div class="bs-input w-icon">
								<input
									v-model="data.password.confirm"
									:placeholder="$t('confirm_password')"
									:type="show.new ? 'text' : 'password'"
									autocomplete="new-password"
									:required="
										data.password.new !== '' ? true : false
									"
									minlength="8"
									maxlength="255"
									:class="{ error: errField.password }"
									@focus.prevent="showValidate.confirm = true"
									@blur.prevent="showValidate.confirm = false"
								/>

								<img
									v-if="show.new"
									src="/src/assets/icons/hide_password.svg"
									alt="hide"
									@click="show.new = !show.new"
								/>

								<img
									v-else
									src="/src/assets/icons/show_password.svg"
									alt="show"
									@click="show.new = !show.new"
								/>
							</div>

							<ul v-show="showValidate.confirm || !validate.same">
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

						<div class="buttons">
							<button class="bs-btn green">
								{{ $t("save") }}
							</button>

							<button class="bs-btn green empty" type="reset">
								{{ $t("cancel") }}
							</button>
						</div>
					</form>
				</Container>
			</div>
		</Column>

		<Column class="column">
			<template v-slot:header>
				<div class="bold">{{ $t("extension.extension") }}</div>
			</template>

			<div class="body">
				<Container>
					<div class="wrapper">
						<img
							src="/src/assets/extern/logo-2.svg"
							alt="BugShot"
							class="bs-logo"
						/>

						<div class="block plugin">
							<div class="header">
								{{ $t("extension.the_plugin") }}
							</div>

							<div class="body">
								<div class="text">
									{{
										$t(
											"extension.install_browser_extension"
										) + "."
									}}
								</div>

								<img
									src="/src/assets/extern/chrome-icon.svg"
									alt="Chrome Icon"
								/>

								<a
									class="bs-btn green"
									@click.prevent="chromeStore"
								>
									{{ $t("extension.install_plugin") }}
								</a>
							</div>
						</div>

						<div class="block apps" v-if="false">
							<div class="header">
								{{ $t("extension.the_apps") }}
							</div>

							<div class="body">
								<div class="text">
									{{ $t("extension.download_client_app") }}
								</div>

								<div class="stores">
									<img
										src="/src/assets/extern/google_play.svg"
										alt="Google Play Store"
										@click.prevent="playStore"
									/>

									<img
										src="/src/assets/extern/app_store.svg"
										alt="Apple Store"
										@click.prevent="appleStore"
									/>

									<img
										src="/src/assets/extern/windowsstore.svg"
										alt="Windows Store"
										@click.prevent="windowsStore"
									/>
								</div>
							</div>
						</div>
					</div>
				</Container>
			</div>
		</Column>
	</div>
</template>

<script setup>
import Container from "src/components/Container.vue";

import axios from "axios";
import { useAuthStore } from "/src/stores/auth";

const data = reactive({
	first_name: "",
	last_name: "",
	email: "",
	password: {
		current: "",
		new: "",
		confirm: "",
	},
});

const store = useAuthStore();

const user = computed(() => {
	let user = store.getUser;

	if (user && user.attributes) {
		data.first_name = user.attributes.first_name;
		data.last_name = user.attributes.last_name;
		data.email = user.attributes.email;
		data.password = {
			current: "",
			new: "",
			confirm: "",
		};
	}

	return user;
});

const show = reactive({
	current: false,
	new: false,
	confirm: false,
});

const saveClick = async () => {
	try {
		let response = await axios.put(`/users/${user.value.id}`, {
			first_name: data.first_name.trim(),

			last_name: data.last_name.trim(),

			email: data.email.trim(),

			old_password: data.password.current,

			...(data.password.new === data.password.confirm &&
			data.password.new !== "" &&
			validate.value.same
				? {
						password: data.password.new,
						password_confirmation: data.password.confirm,
				  }
				: {}),
		});

		response = response.data.data;

		store.user = response;
	} catch (error) {
		console.log(error);

		errMessage.value = error.response.data.message;
	}
};

const cancelClick = () => {
	if (user.value && user.value.attributes) {
		data.first_name = user.value.attributes.first_name;
		data.last_name = user.value.attributes.last_name;
		data.email = user.value.attributes.email;

		data.password.current = "";
		data.password.new = "";
		data.password.confirm = "";
	} else {
		data.first_name = "";
		data.last_name = "";
		data.email = "";

		data.password.current = "";
		data.password.new = "";
		data.password.confirm = "";
	}
};

const chromeStore = () => {
	window.open(
		"https://chrome.google.com/webstore/detail/bugshot/dioobkjdnepaibmmhlniiolocpmdbblh?hl=en&authuser=0"
	);
};
const playStore = () => {};
const appleStore = () => {};
const windowsStore = () => {};

const showValidate = reactive({
	pass: false,
	confirm: false,
});

// password validations
const validate = computed(() => {
	return {
		minChars: data.password.new.length,
		letters: data.password.new.match(/[a-zA-Z]/g),
		numbers: data.password.new.match(/[0-9]/g),
		same: data.password.new === data.password.confirm,
	};
});

const errMessage = ref(null);

const errField = reactive({
	password: false,
});
</script>

<style lang="scss" scoped>
.user-settings-layout {
	padding: 2%;
	width: 100%;
	height: 100vh;
	display: flex;
	position: relative;
	// padding: 30px;
	overflow: auto;

	.column.personal {
		width: 500px;
	}
	.column {
		display: flex;
		position: relative;
		flex-direction: column;
		height: 100%;
		padding: 15px;
		width: 33%;
		border-right: 1px solid #ede4fc;

		min-width: 500px;
	}

	.column:last-of-type {
		border-right: unset;
	}

	.text-header {
		font-weight: bold;
		border-bottom: 1px solid #ede4fc;
		margin: 2% 0;
		width: 95%;
		text-align: left;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;

		.save-button {
			margin: 10px;
		}
	}

	.bs-logo {
		width: 70%;
		margin: 4% 0;
	}

	.block {
		display: flex;
		flex-direction: column;
		width: 100%;

		margin-top: 40px;

		.header {
			font-weight: bold;
			border-bottom: 1px solid #ede4fc;
		}

		.text {
			margin: 2%;
		}
	}

	.stores {
		width: 400px;
		text-align: start;
		margin: auto;

		> img {
			width: 180px;
			margin: 10px;
		}
	}

	.plugin {
		.body {
			display: flex;
			flex-direction: column;
			align-items: center;
			row-gap: 30px;
		}
	}

	.group {
		width: 95%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		> .label {
			padding: 0 0.5rem;
			margin-bottom: -1rem;
		}
	}

	.buttons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 60%;
	}

	.bold {
		font-weight: bold;
	}
}

.w-95 {
	width: 95%;
}

.errors {
	color: red;
	font-weight: 500;
	font-size: 14px;
	text-align: left;
	width: 95%;
}

.requed {
	width: 95%;
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
name: settings
</route>
