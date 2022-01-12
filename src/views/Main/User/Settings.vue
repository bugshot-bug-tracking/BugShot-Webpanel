<template>
	<div class="user-settings-layout" v-if="user">
		<Column class="column personal">
			<template v-slot:header> Personal Settings </template>

			<div class="body">
				<Container>
					<div class="wrapper">
						<div class="group my-3">
							<div class="label">First Name</div>

							<FormInput
								:value="data.first_name"
								@input="
									(i) => (data.first_name = i.target.value)
								"
								:placeholder="`First Name`"
								:type="'text'"
								:autocomplete="`given-name`"
								:disabled="disableForm"
							/>
						</div>

						<div class="group my-3">
							<div class="label">Last Name</div>

							<FormInput
								:value="data.last_name"
								@input="
									(i) => (data.last_name = i.target.value)
								"
								:placeholder="`First Name`"
								:type="'text'"
								:autocomplete="`family-name`"
								:disabled="disableForm"
							/>
						</div>

						<div class="text-header">Contact informations</div>

						<div class="group my-3">
							<div class="label">Email</div>

							<FormInput
								:value="data.email"
								@input="(i) => (data.email = i.target.value)"
								:placeholder="`E-Mail`"
								:type="'email'"
								:image="require('@/assets/icons/at@.svg')"
								:autocomplete="`email`"
								:disabled="disableForm"
							/>
						</div>

						<div class="text-header">Change Password</div>

						<div class="group my-3">
							<FormInput
								:value="data.password.current"
								@input="
									(i) =>
										(data.password.current = i.target.value)
								"
								:placeholder="`Current Password`"
								:type="show.current ? 'text' : 'password'"
								:image="
									show.current
										? require('@/assets/icons/hide_password.svg')
										: require('@/assets/icons/show_password.svg')
								"
								@imageClick="show.current = !show.current"
								autocomplete="password"
								:disabled="disableForm"
							/>
						</div>

						<div class="group my-3">
							<FormInput
								:value="data.password.new"
								@input="
									(i) => (data.password.new = i.target.value)
								"
								:placeholder="`New Password`"
								:type="show.new ? 'text' : 'password'"
								:image="
									show.new
										? require('@/assets/icons/hide_password.svg')
										: require('@/assets/icons/show_password.svg')
								"
								@imageClick="show.new = !show.new"
								:autocomplete="`new-password`"
								:disabled="disableForm"
							/>
						</div>

						<div class="group my-3">
							<FormInput
								:value="data.password.confirm"
								@input="
									(i) =>
										(data.password.confirm = i.target.value)
								"
								:placeholder="`Confirm Password`"
								:type="show.new ? 'text' : 'password'"
								:image="
									show.new
										? require('@/assets/icons/hide_password.svg')
										: require('@/assets/icons/show_password.svg')
								"
								@imageClick="show.new = !show.new"
								:autocomplete="`new-password`"
								:disabled="disableForm"
							/>
						</div>

						<div class="buttons">
							<a
								class="btn bs bf-green"
								:class="{ disabled: disableForm }"
							>
								Save
							</a>

							<a
								class="btn bs be-green"
								:class="{ disabled: disableForm }"
								@click.prevent="cancelClick"
							>
								Cancel
							</a>
						</div>
					</div>
				</Container>
			</div>
		</Column>

		<Column class="column">
			<template v-slot:header> Extension </template>

			<div class="body">
				<Container>
					<div class="wrapper">
						<img
							src="../../../assets/extern/logo-2.svg"
							alt="BugShot"
							class="bs-logo"
						/>

						<div class="block plugin">
							<div class="header">The Plugin</div>

							<div class="body">
								<div class="text">
									Install the browser extension so you can
									give and receive feedback.
								</div>

								<img
									src="../../../assets/extern/chrome-icon.svg"
									alt="Chrome Icon"
								/>

								<a
									class="btn bs bf-green"
									@click.prevent="chromeStore"
								>
									Install Plugin
								</a>
							</div>
						</div>

						<div class="block apps">
							<div class="header">The Apps</div>

							<div class="body">
								<div class="text">Download client apps</div>

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
import FormInput from "../../../components/FormInput.vue";
import { computed, reactive, ref } from "@vue/reactivity";
import store from "../../../store";

export default {
	components: { Layout, Column, Container, FormInput },

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
		}
	}

	.buttons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 60%;
	}
}
</style>
