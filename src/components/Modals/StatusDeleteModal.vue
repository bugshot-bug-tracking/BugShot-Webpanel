<template>
	<MyModal :modelValue="modal.show" :close="modal.close" z-101 v-if="status">
		<ModalTemplate @close="modal.close" noCloseButton>
			<template #header-text> {{ $t("delete.column") }}? </template>

			<form class="default-form" @submit.prevent="onSubmit">
				<span text-center>
					<i18n-t keypath="about_to_delete_column_x" tag="p" scope="global">
						<b>"{{ status.attributes.designation }}"</b>.
					</i18n-t>
				</span>

				<div v-if="bugs.length > 0">
					<p text-center mb-8>{{ t("column_contains_reports") }}</p>

					<b>{{ t("what_to_to_with_reports") }}</b>

					<hr my-2 />

					<b>{{ t("move_reports_to") }}</b>

					<div class="select" mb-4>
						<v-select
							:options="statuses"
							:placeholder="$t('please_choose') + '...'"
							:get-option-label="(option:Status) => option.attributes.designation"
							:reduce="(option:Status) => option.id"
							:disabled="deleteAll"
							v-model="statusOption"
						>
							<template #open-indicator="{ attributes }">
								<img
									class="black-to-purple"
									style="background-color: unset; cursor: pointer"
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

					<hr my-2 />

					<div>
						<label flex items-center gap-4>
							<input type="checkbox" class="form-check-input" v-model="deleteAll" />

							<div>
								<b>{{ t("do_nothing") }}</b>
								({{ t("option_will_delete_reports") }})
							</div>
						</label>
					</div>
				</div>

				<div class="actions">
					<button class="bs-btn green" @click.prevent="modal.close">
						{{ $t("cancel") }}
					</button>

					<button
						class="bs-btn red empty"
						type="submit"
						:class="{
							disabled: bugs.length > 0 && !(deleteAll || statusOption),
						}"
					>
						{{ t("continue_with_delete") }}
					</button>
				</div>
			</form>
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
	>
		<template #success-img>
			<img src="/src/assets/animations/delete.gif" alt="success" class="h-50 w-auto" />
		</template>
	</LoadingModal2>
</template>

<script setup lang="ts">
import { Status } from "~/models/Status";
import { useReportsStore } from "~/stores/reports";

const emit = defineEmits(["close", "delete"]);

const props = defineProps({
	id: {
		type: String,
		required: true,
		description: "Status ID",
	},
});

const { t } = useI18n();

const store = useReportsStore();

const status = computed(() => store.getStatusById(props.id));

// choices for moving bugs
const statuses = computed(() => store.getStatuses?.filter((x) => x.id !== props.id));

const bugs = computed(() => store.getBugsByStatusId(props.id) ?? []);

const deleteAll = ref(false);
const statusOption = ref(undefined);

onMounted(() => {
	deleteAll.value = false;
	statusOption.value = undefined;
});

const modal = reactive({
	show: true,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
		emit("close");
	},
});

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

const onSubmit = async () => {
	try {
		loadingModal.show = true;

		await store.deleteStatus({
			id: props.id,

			// if delete all is checked or there are no reports delete with null target
			move: deleteAll.value || bugs.value.length < 1 ? undefined : statusOption.value,
		});

		loadingModal.state = 1;
		loadingModal.message = t("status_deleted_succ");
	} catch (error) {
		loadingModal.state = 2;

		console.log(error);
	}
};
</script>

<style lang="scss" scoped>
.actions {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-top: 2.5rem;
}

.select {
	select {
		border-color: #bd99f2;

		&:focus {
			border-color: #7a2ee6;

			box-shadow: none;
		}
	}
}

.form-check-input {
	color: #7a2de6;
	border: 2px solid #7a2de6;
	margin: unset;

	&:checked {
		background-color: #7a2de6;
		border-color: #7a2ee6;
	}

	&:focus {
		border-color: #7a2ee6;
		box-shadow: none;
	}
}
</style>
