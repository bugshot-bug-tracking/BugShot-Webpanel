<template>
	<div class="align-items-center d-flex justify-content-center modal">
		<div class="wrapper" v-if="bug">
			<div class="header">
				<span>{{ $t("assign_team_member") }}</span>
			</div>

			<div class="options" v-if="options">
				<div
					class="item"
					v-for="item of options"
					:key="item.id"
					@change="check"
				>
					<input
						type="checkbox"
						v-model="users"
						:id="'cp' + item.id"
						:value="item.id"
					/>

					<div class="check-state" />

					<label :for="'cp' + item.id" class="lab">
						<div
							class="avatar"
							:style="{
								'background-color':
									colors[
										(item.attributes.first_name.charCodeAt(
											0
										) +
											item.attributes.last_name.charCodeAt(
												0
											)) %
											7
									],
							}"
						>
							{{
								item.attributes.first_name[0] +
								item.attributes.last_name[0]
							}}
						</div>
						<div class="name">
							{{
								item.attributes.first_name +
								" " +
								item.attributes.last_name
							}}
						</div>
					</label>
				</div>
			</div>

			<a class="close" @click="$emit('close')" />

			<a class="btn bs bf-green add">{{ $t("add.member", 2) }}</a>
		</div>
	</div>
</template>

<script>
import { ref } from "@vue/reactivity";
import Modal from "./Modal.vue";
import { computed, nextTick, onMounted } from "@vue/runtime-core";
import store from "../store";
import colors from "@/util/colors";

export default {
	props: {
		id: {
			required: true,
			type: String,
			desc: "The bug ID",
		},
	},
	emits: ["close"],
	components: { Modal },
	setup(props, context) {
		const show = ref(false);

		onMounted(() => {
			show.value = true;

			store.dispatch(
				"fetchProjectUsers",
				bug.value.attributes.project_id
			);
		});

		const close = () => {
			show.value = false;

			nextTick(() => {
				context.emit("close");
			});
		};

		const bug = computed(() => {
			return store.getters.getBugById(props.id);
		});

		const options = computed(() => {
			if (!bug.value) return [];

			const project = store.getters.getProjectById(
				bug.value.attributes.project_id
			);

			console.log(project.users);
			if (!project.users) return [];
			return project.users;
		});

		const check = (event) => {
			// if (event.target.checked)
			// 	event.target.parentElement.classList.add("checked");
			// else event.target.parentElement.classList.remove("checked");
		};

		return {
			show,
			close,
			colors,
			bug,
			options,
			check,
		};
	},
};
</script>

<style lang="scss" scoped>
.modal {
	background-color: hsla(0, 0%, 0%, 0.5);
	z-index: -1;
}
.close {
	position: absolute;
	top: -13px;
	right: -13px;
	background-image: url("../assets/icons/classic_X.svg");
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
	cursor: pointer;
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
</style>
