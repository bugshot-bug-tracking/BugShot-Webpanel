<template>
	<div class="align-items-center d-flex justify-content-center modal">
		<div class="wrapper" v-if="bug">
			<div class="header">
				<span>{{ $t("assign_team_member") }}</span>
			</div>

			<div class="options" v-if="list.length > 0">
				<div
					class="item"
					v-for="[index, { user, checked }] of list.entries()"
					:key="user.id"
				>
					<div class="d-flex align-items-center">
						<input
							type="checkbox"
							:id="'cp' + user.id"
							:value="user.id"
							:checked="checked"
							@change="changeUser(user, checked, index)"
						/>
						<div class="check-state" />
						<label :for="'cp' + user.id" class="lab">
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
							<div class="name">
								{{
									user.attributes.first_name +
									" " +
									user.attributes.last_name
								}}
							</div>
						</label>
					</div>

					<img
						src="/src/assets/icons/close_2.svg"
						class="remove-user black-to-gray"
						alt=""
						v-if="checked"
						@click="changeUser(user, true, index)"
					/>
				</div>
			</div>

			<a class="close" @click="$emit('close')" />

			<a class="bs-btn green add" @click="submit">{{
				$t("add.member", 2)
			}}</a>
		</div>
	</div>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup>
import { useProjectStore } from "~/stores/project";
import colors from "~/util/colors";
import axios from "axios";

const emit = defineEmits(["close"]);

const props = defineProps({
	id: {
		required: true,
		type: String,
		desc: "The bug ID",
	},
});

const store = useProjectStore();

const list = ref([]);

const bug = computed(() => {
	let bug = store.getBugById(props.id);

	if (!bug.id) list.value = [];
	else {
		let project_users = [
			store.getProject.attributes.creator,
			...store.getProjectUsers,
		];

		list.value = [];

		project_users.forEach((user) => {
			let checked = false;
			if (bug.users?.find((x) => x.user.id === user.id)) checked = true;

			list.value.push({
				user: user,
				oroginal: checked, // compare checked with this to know what operation to execute (add/remove)
				checked: checked,
			});
		});
	}

	return bug;
});

const changeUser = (user, checked, index) => {
	list.value[index].checked = !checked;
};

const submit = async () => {
	console.log(list.value);
	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		for (const item of list.value) {
			// if no change was made skip over the item
			if (item.original === item.checked) continue;

			if (item.checked === true)
				await axios.post(`bugs/${bug.value.id}/assign-user`, {
					user_id: item.user.id,
				});
			else
				await axios.delete(
					`bugs/${bug.value.id}/users/${item.user.id}`
				);
		}
		loadingModal.state = 1;
		loadingModal.message = "Members updated!";

		setTimeout(() => {
			emit("close");

			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	} catch (error) {
		loadingModal.state = 2;
		loadingModal.message = null;

		console.log(error);

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	}
	store.fetchBugUsers(props.id);
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.modal {
	background-color: hsla(0, 0%, 0%, 0.5);
	z-index: 2;
}
.close {
	position: absolute;
	top: -13px;
	right: -13px;
	background-image: url("/src/assets/icons/close_2.svg");
	background-repeat: no-repeat;
	width: 16px;
	height: 16px;
	background-color: hsl(0, 0%, 100%) !important;
	padding: 12px !important;
	border-radius: 100% !important;
	background-position: center;
	z-index: 1;
	box-shadow: -1px 2px 10px hsla(0, 0%, 0%, 0.5);
	background-size: 60%;
	cursor: pointer;
}

.add {
	align-self: end;
	padding: 6px 12px;
	margin-top: 12px;
}

.wrapper {
	width: 300px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 16px;
	gap: 10px;
	background-color: white;
	position: relative;
	border-radius: 8px;

	.header {
		font-weight: bold;
		font-size: 18px;
	}
}

.options {
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 300px;
	margin-left: -16px;
}

.item {
	display: flex;
	justify-content: space-between;
	position: relative;
	align-items: center;
	width: 100%;

	&.checked {
		background: hsl(158, 79%, 87%);
	}

	input[type="checkbox"] {
		display: none;

		&:checked {
			& ~ .check-state {
				opacity: 1;
			}

			& ~ label {
				padding-left: 10px;
				padding-right: 0px;
			}
		}
	}

	label {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 8px;
		padding: 5px 10px 5px 0;
		transition: 0.25s;
		cursor: pointer;
	}

	.check-state {
		width: 24px;
		height: 24px;
		opacity: 0;
		margin-left: -12px;
		border-radius: 6px;
		transition: 0.25s;
		border-right: 12px solid hsl(158, 80%, 47%);
	}

	.avatar {
		color: hsl(0, 0%, 100%);
		background-color: hsl(265, 80%, 50%);
		font-size: 12px;
		padding: 8px;
		border-radius: 25px;
		height: 32px;
		width: 32px;

		text-align: center;
		text-transform: uppercase;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	&:hover {
		background: hsl(158, 79%, 87%);

		label {
			padding-left: 10px;
			padding-right: 0px;
		}
	}
}

.remove-user {
	height: 14px;
	margin-right: 16px;
	cursor: pointer;

	&:hover {
		filter: none;
	}
}
</style>
