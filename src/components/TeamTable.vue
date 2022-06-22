<template>
	<Container>
		<div class="team-table">
			<div class="container" v-if="company?.attributes.users">
				<div class="header bold">
					<div class="members">{{ $t("member", 2) }}</div>
					<div class="count" v-if="false">
						{{
							$t("member_out_of", {
								x: company.attributes.users.length,
								n: 8,
							})
						}}
					</div>
				</div>

				<div class="items">
					<div
						class="person"
						v-for="user of [
							company.attributes.creator,
							...company.attributes.users,
						]"
						:key="user.id"
					>
						<div class="info">
							<div
								class="avatar"
								:style="{
									'background-color':
										colors[
											(user.attributes.first_name.charCodeAt(
												0
											) +
												user.attributes.last_name.charCodeAt(
													0
												)) %
												7
										],
								}"
							>
								{{
									user.attributes.first_name[0] +
									user.attributes.last_name[0]
								}}
							</div>
							<div class="wrapper">
								<div class="name">
									{{
										user.attributes.first_name +
										" " +
										user.attributes.last_name
									}}
								</div>
								<div class="email">
									{{ user.attributes.email }}
								</div>
							</div>
						</div>

						<div v-if="canRemove(user.id)" class="actions">
							<a @click.prevent="removeUser(user)">
								<img
									src="/src/assets/icons/delete.svg"
									alt="Trash Can"
								/>
								<div class="">{{ $t("remove") }}</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<AddMembers
			:displayList="false"
			:externalSubmit="true"
			@submit="addMember"
		>
			<template v-slot:extra>
				<div class="w-100 project-select">
					<span>Assign to project?</span>

					<v-select
						:options="companyProjects"
						:placeholder="'Select Project'"
						:get-option-label="
							(option) => option.attributes.designation
						"
						:reduce="(option) => option.id"
						v-model="selectOption"
					>
						<template #open-indicator="{ attributes }">
							<img
								class="black-to-purple"
								style="background-color: unset"
								v-bind="attributes"
								src="/src/assets/icons/caret_down.svg"
							/>
						</template>

						<template v-slot:option="option">
							{{ option.attributes.designation }}
						</template>

						<template v-slot:selected-option="option">
							{{ option.attributes.designation }}
						</template>
					</v-select>
				</div>
			</template>
		</AddMembers>
	</Container>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup>
import { useMainStore } from "~/stores/main";
import axios from "axios";
import colors from "~/util/colors";

const props = defineProps({
	company_id: {
		required: true,
		type: String,
	},
});

const store = useMainStore();

// request team data to be fetched
store.fetchCompanyUsers(props.company_id);

const company = computed(() => {
	return store.getCompanyById(props.company_id);
});

const removeUser = (user) => {
	axios
		.delete(`companies/${company.value.id}/users/${user.id}`)
		.then((response) => {
			company.value.users.splice(
				company.value.users.findIndex((x) => x.id === user.id),
				1
			);
		})
		.catch((error) => {
			console.log(error);
		});
};

const canRemove = (id) => {
	if (!id || !company.value || !company.value.attributes.creator)
		return false;

	return !(id === company.value.attributes.creator.id);
};

const companyProjects = computed(() => {
	return store.getCompanyProjects(props.company_id);
});

const selectOption = ref(null);

const addMember = async (user, close) => {
	console.log("user: ", user);
	console.log("selectOption: ", selectOption);

	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		let base = "";
		let endID = props.company_id;
		if (selectOption.value === null) base = "companies";
		else {
			base = "projects";
			endID = selectOption.value;
		}

		await axios.post(`${base}/${endID}/invite`, {
			target_email: user.email,
			role_id: user.role,
		});

		loadingModal.state = 1;
		loadingModal.message = `Invitation sent.`;

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
			close();
		}, 4000);
	} catch (error) {
		console.log(error);

		loadingModal.state = 2;
		loadingModal.message = error.response.data.data.message.replace(
			":",
			""
		);

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
		}, 4000);
	}
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});

watch(
	props,
	() => {
		store.fetchCompanyUsers(props.company_id);
	},
	{ deep: true }
);
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	width: 100%;
	flex-direction: column;

	> .header {
		display: flex;
		width: 100%;
		align-content: center;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
		border-bottom: 1px solid #ede4fc;

		> * {
			min-width: 100px;
		}
	}

	.count {
		color: hsl(32, 100%, 50%);
	}

	> .items {
		display: flex;
		flex-direction: column;
		gap: 10px;

		.person {
			display: flex;
			align-content: center;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			border-bottom: 1px solid #ede4fc;

			.info {
				display: flex;
				align-items: center;
				gap: 8px;

				.avatar {
					color: hsl(0, 0%, 100%);
					background-color: hsl(265, 80%, 50%);
					font-size: 12px;
					padding: 8px;
					border-radius: 25px;
					height: 35px;
					width: 35px;

					text-align: center;
					text-transform: uppercase;
				}

				.wrapper {
					display: flex;
					flex-direction: column;
					text-align: left;

					.name {
						font-weight: bold;
					}
					.email {
						word-break: normal;
					}
				}
			}
		}
	}
	.actions {
		> a {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			cursor: pointer;
			color: black;
		}
		img {
			height: 1rem;
		}

		&:hover {
			// color: #F23838; red
			filter: brightness(0) saturate(1) invert(46%) sepia(28%)
				saturate(5216%) hue-rotate(331deg) brightness(87%)
				contrast(121%);
		}
	}
}
.bold {
	font-weight: bold;
}

.project-select {
	padding-bottom: 16px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 8px;

	span {
		font-weight: bold;
		font-size: 18px;
		border-bottom: 1px solid #eee5fc;
		text-align: left;
	}
}
</style>
