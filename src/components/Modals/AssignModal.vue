<template>
	<div flex items-center justify-start gap-2 flex-wrap>
		<Avatar
			v-for="item in assignedList"
			:key="item.id"
			:size="'XS'"
			:first_name="item.attributes.first_name"
			:last_name="item.attributes.last_name"
		/>

		<n-button text @click="modal.open" v-if="!disableAdd">
			<Icon-Add color="var(--bs-green)" size="32" />
		</n-button>
	</div>

	<MyModal v-model="modal.show" :close="modal.close" z-10000>
		<ModalTemplate @close="modal.close" style="min-width: 22rem">
			<template #header-text>
				{{ $t("assign_team_member") }}
			</template>

			<template #content>
				<div class="options" v-if="list.length > 0" mt-4>
					<div
						class="item"
						v-for="[index, { user, checked }] of list.entries()"
						:key="user.id"
					>
						<div flex items-center>
							<input
								type="checkbox"
								:id="'cp' + user.id"
								:value="user.id"
								:checked="checked"
								@change="changeUser(user, checked, index)"
							/>

							<div class="check-state" />

							<label :for="'cp' + user.id" class="lab">
								<Avatar
									:size="'XS'"
									:first_name="user.attributes.first_name"
									:last_name="user.attributes.last_name"
								/>
								<div class="name">
									{{
										user.attributes.first_name + " " + user.attributes.last_name
									}}
								</div>
							</label>
						</div>

						<Icon-X
							size="16"
							color="var(--bs-gray)"
							v-if="checked"
							@click="changeUser(user, true, index)"
							mr-4
							cursor-pointer
						/>
					</div>
				</div>
			</template>

			<template #footer>
				<div flex justify-end mt-4>
					<n-button type="success" round @click="submit" ml-a>
						{{ $t("save") }}
					</n-button>
				</div>
			</template>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="
			loadingModal.clear();
			modal.close();
		"
		:z_index="10000"
	/>
</template>

<script setup lang="ts">
import { User } from "~/models/User";
import { useProjectStore } from "~/stores/project";

const props = defineProps({
	assignedList: {
		type: Array as PropType<User[]>,
		required: true,
		default: [],
	},

	disableAdd: {
		type: Boolean,
		required: false,
		default: false,
	},

	submit: {
		type: Function,
		required: false,
		default: undefined,
	},
});

const emit = defineEmits(["close", "submit"]);

const { t } = useI18n();

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
		emit("close");
	},
});

const list = ref<{ user: User; original: boolean; checked: boolean }[]>([]);

watchEffect(() => {
	list.value = [];

	useProjectStore().getMembers.forEach((user) => {
		let checked = false;
		if (props.assignedList.some((x) => x.id === user?.id)) checked = true;

		list.value.push({
			user: user!,
			original: checked, // compare checked with this to know what operation to execute (add/remove)
			checked: checked,
		});
	});
});

const changeUser = (user: User, checked: boolean, index: number) => {
	list.value[index].checked = !checked;
};

const submit = async () => {
	if (!props.submit) {
		emit("submit", list.value);
		return modal.close();
	}

	try {
		loadingModal.show = true;

		await props.submit(list.value);

		loadingModal.state = 1;
		loadingModal.message = t("members_updated");
	} catch (error) {
		loadingModal.state = 2;
		loadingModal.message = "";

		console.log(error);
	}
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
	clear: () => {
		loadingModal.show = false;
		loadingModal.state = 0;
		loadingModal.message = "";
	},
});
</script>

<style lang="scss" scoped>
.options {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: calc(100% + 2rem);
	margin-left: -1rem;
	margin-right: -1rem;
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

	&:hover {
		background: hsl(158, 79%, 87%);

		label {
			padding-left: 0.5rem;
			padding-right: 0;
		}
	}
}
</style>
