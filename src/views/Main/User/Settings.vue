<template>
	<div class="user-settings-layout bs-scroll s-purple" v-if="user">
		<Column class="column personal">
			<template v-slot:header>
				<div class="bold">{{ $t("personal_settings") }}</div>
			</template>

			<div class="body">
				<Container>
					<form
						class="wrapper my-3"
						@submit.prevent=""
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
									:disabled="disableForm"
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
									:disabled="disableForm"
								/>
							</div>
						</div>

						<div class="text-header">{{ $t("contact_info") }}</div>

						<div class="group">
							<div class="label">{{ $t("email") }}</div>

							<div class="bs-input w-icon my-3">
								<input
									:v-model="data.email"
									:placeholder="$t('email')"
									type="email"
									autocomplete="email"
									:disabled="disableForm"
								/>

								<img
									src="../../../assets/icons/at@.svg"
									alt="at"
								/>
							</div>
						</div>

						<div class="text-header">
							{{ $t("change_password") }}
						</div>

						<div class="bs-input w-icon my-3">
							<input
								v-model="data.password.current"
								:placeholder="$t('current_password')"
								:type="show.current ? 'text' : 'password'"
								autocomplete="password"
								:disabled="disableForm"
								required
							/>

							<img
								v-if="show.current"
								src="../../../assets/icons/hide_password.svg"
								alt="hide"
								@click="show.current = !show.current"
							/>

							<img
								v-else
								src="../../../assets/icons/show_password.svg"
								alt="show"
								@click="show.current = !show.current"
							/>
						</div>

						<div class="bs-input w-icon my-3">
							<input
								v-model="data.password.new"
								:placeholder="$t('new_password')"
								:type="show.new ? 'text' : 'password'"
								autocomplete="new-password"
								:disabled="disableForm"
							/>

							<img
								v-if="show.new"
								src="../../../assets/icons/hide_password.svg"
								alt="hide"
								@click="show.new = !show.new"
							/>

							<img
								v-else
								src="../../../assets/icons/show_password.svg"
								alt="show"
								@click="show.new = !show.new"
							/>
						</div>

						<div class="bs-input w-icon my-3">
							<input
								v-model="data.password.confirm"
								:placeholder="$t('confirm_password')"
								:type="show.new ? 'text' : 'password'"
								autocomplete="new-password"
								:disabled="disableForm"
							/>

							<img
								v-if="show.new"
								src="../../../assets/icons/hide_password.svg"
								alt="hide"
								@click="show.new = !show.new"
							/>

							<img
								v-else
								src="../../../assets/icons/show_password.svg"
								alt="show"
								@click="show.new = !show.new"
							/>
						</div>

						<div class="buttons">
							<button
								class="btn bs bf-green"
								:class="{ disabled: disableForm }"
							>
								{{ $t("save") }}
							</button>

							<button
								class="btn bs be-green"
								:class="{ disabled: disableForm }"
								type="reset"
							>
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
							src="../../../assets/extern/logo-2.svg"
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
									src="../../../assets/extern/chrome-icon.svg"
									alt="Chrome Icon"
								/>

								<a
									class="btn bs bf-green"
									@click.prevent="chromeStore"
								>
									{{ $t("extension.install_plugin") }}
								</a>
							</div>
						</div>

						<div class="block apps">
							<div class="header">
								{{ $t("extension.the_apps") }}
							</div>

							<div class="body">
								<div class="text">
									{{ $t("extension.download_client_apps") }}
								</div>

								<div class="stores">
									<img
										src="../../../assets/extern/google_play.svg"
										alt="Google Play Store"
										@click.prevent="playStore"
									/>

									<img
										src="../../../assets/extern/app_store.svg"
										alt="Apple Store"
										@click.prevent="appleStore"
									/>

									<img
										src="../../../assets/extern/windowsstore.svg"
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

<script>
import Layout from "../Layout.vue";
import Column from "../Project/BugsTable/Column.vue";
import Container from "../../../components/Container.vue";
import { computed, reactive, ref } from "@vue/reactivity";
import store from "../../../store";

export default {
	components: {
		Layout,
		Column,
		Container,
	},

	setup(props) {
		const user = computed(() => {
			let user = store.getters.getUser;

			if (user && user.attributes) {
				data.first_name = user.attributes.first_name;
				data.last_name = user.attributes.last_name;
				data.email = user.attributes.email;
			}
			return user;
		});

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

		const show = reactive({
			current: false,
			new: false,
			confirm: false,
		});

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

		const disableForm = ref(true);

		const chromeStore = () => {};
		const playStore = () => {};
		const appleStore = () => {};
		const windowsStore = () => {};

		return {
			user,
			data,
			show,
			disableForm,
			cancelClick,
			chromeStore,
			playStore,
			appleStore,
			windowsStore,
		};
	},
};
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
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		> .label {
			padding: 0 5%;
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
</style>
