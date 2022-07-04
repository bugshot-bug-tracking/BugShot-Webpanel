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

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import colors from "~/util/colors";
import axios from "axios";
import { User } from "~/models/User";

const emit = defineEmits(["close"]);

const props = defineProps({
	id: {
		required: true,
		type: String,
		desc: "The bug ID",
	},
});

const store = useProjectStore();

const list = ref(Array<{ user: User; original: boolean; checked: boolean }>());

const bug = computed(() => {
	let bug = store.getBugById(props.id);

	if (!bug?.id) list.value = [];
	else {
		let project_users = [
			store.getProject.attributes.creator,
			...store.getProjectUsers,
		];

		list.value = [];

		project_users.forEach((user) => {
			let checked = false;
			if (bug?.users?.find((x) => x.user.id === user.id)) checked = true;

			list.value.push({
				user: user,
				original: checked, // compare checked with this to know what operation to execute (add/remove)
				checked: checked,
			});
		});
	}

	return bug;
});

const changeUser = (user: User, checked: boolean, index: number) => {
	list.value[index].checked = !checked;
};

const submit = async () => {
	if (!bug.value) return;
	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = "";

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
			loadingModal.message = "";
		}, 4000);
	} catch (error) {
		loadingModal.state = 2;
		loadingModal.message = "";

		console.log(error);

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = "";
		}, 4000);
	}
	store.fetchBugUsers(props.id);
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
});
</script>

<style lang="scss" scoped>
.modal {
	background-color: hsla(0, 0%, 0%, 0.5);
	z-index: 2;
}
.close {
	position: absolute;
	top: -0.75rem;
	right: -0.75rem;
	background-image: url("/src/assets/icons/close_2.svg");
	background-repeat: no-repeat;
	width: 1rem;
	height: 1rem;
	background-color: hsl(0, 0%, 100%) !important;
	padding: 0.75rem !important;
	border-radius: 100% !important;
	background-position: center;
	z-index: 1;
	box-shadow: -1px 0.125rem 0.625rem hsla(0, 0%, 0%, 0.5);
	background-size: 60%;
	cursor: pointer;
}

.add {
	align-self: end;
	padding: 0.375rem 0.75rem;
	margin-top: 0.75rem;
}

.wrapper {
	width: 19rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 1rem;
	gap: 0.5rem;
	background-color: white;
	position: relative;
	border-radius: 0.5rem;

	.header {
		font-weight: bold;
		font-size: 1.125rem;
	}
}

.options {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 19rem;
	margin-left: -1rem;
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
				padding-left: 0.5rem;
				padding-right: 0;
			}
		}
	}

	label {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		padding: 0.25rem 0.5rem 0.25rem 0;
		transition: 0.25s;
		cursor: pointer;
	}

	.check-state {
		width: 1.5rem;
		height: 1.5rem;
		opacity: 0;
		margin-left: -0.65rem;
		border-radius: 0.375rem;
		transition: 0.25s;
		border-right: 0.875rem solid hsl(158, 80%, 47%);
	}

	.avatar {
		color: hsl(0, 0%, 100%);
		background-color: hsl(265, 80%, 50%);
		font-size: 0.75rem;
		padding: 0.5rem;
		border-radius: 1.5rem;
		height: 2rem;
		width: 2rem;

		text-align: center;
		text-transform: uppercase;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	&:hover {
		background: hsl(158, 79%, 87%);

		label {
			padding-left: 0.5rem;
			padding-right: 0;
		}
	}
}

.remove-user {
	height: 1rem;
	width: 1rem;
	margin-right: 1rem;
	cursor: pointer;

	&:hover {
		filter: none;
	}
}
</style>
