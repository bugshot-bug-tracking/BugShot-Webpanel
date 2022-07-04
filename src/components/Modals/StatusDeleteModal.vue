<template>
	<Modal :show="show" @close="close">
		<div class="wrapper">
			<div class="w-100">
				<h3 class="mb-4"><b>Delete column?</b></h3>
				<span class="text">
					<p>
						You are about to delete column <b>"{{ text }}"</b>.
					</p>
					<p v-if="bugs.length > 0">This column contains reports.</p>
				</span>
			</div>

			<form
				class="move-form"
				@submit.prevent="submit"
				v-if="bugs.length > 0"
			>
				<h6>
					<b>What do you want to happen with the existing reports?</b>
				</h6>

				<div class="break" />

				<div class="options">
					<p><b>I want them moved to:</b></p>

					<div class="select mb-4">
						<v-select
							:options="statuses"
							:placeholder="'Please choose....'"
							:get-option-label="
								(option) => option.attributes.designation
							"
							:reduce="(option) => option.id"
							:disabled="deleteAll"
							v-model="statusOption"
						>
							<template #open-indicator="{ attributes }">
								<img
									class="black-to-purple"
									style="
										background-color: unset;
										cursor: pointer;
									"
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

					<div class="break" />

					<div class="delete-all mt-2 mb-4">
						<label>
							<input
								type="checkbox"
								class="form-check-input"
								v-model="deleteAll"
							/>

							<div>
								<b>Do nothing</b>
								(this option will delete the reports)
							</div>
						</label>
					</div>
				</div>

				<div class="actions">
					<button class="bs-btn green" @click.prevent="close">
						{{ $t("cancel") }}
					</button>

					<button
						class="bs-btn red empty"
						type="submit"
						:disabled="
							deleteAll || statusOption != null ? false : true
						"
					>
						Continue with deletion
					</button>
				</div>
			</form>

			<form @submit.prevent="submit" v-else>
				<div class="actions">
					<button class="bs-btn green" @click.prevent="close">
						{{ $t("cancel") }}
					</button>

					<button class="bs-btn red empty" type="submit">
						Continue with deletion
					</button>
				</div>
			</form>
		</div>
	</Modal>
</template>

<script setup>
import { useProjectStore } from "~/stores/project";

const emit = defineEmits(["close", "delete"]);

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
	},

	id: {
		type: String,
		required: true,
	},

	text: {
		type: String,
		required: true,
	},
});

const store = useProjectStore();

const statuses = computed(() =>
	store.getStatuses.filter((x) => x.id !== props.id)
);

const bugs = computed(() => store.getBugsByStatusId(props.id));

const deleteAll = ref(false);
const statusOption = ref(null);

const submit = () => {
	// if delete all is checked emit delete with null target
	if (deleteAll.value)
		return emit("delete", {
			id: props.id, // id of status to be deleted
			move: null, // id of status to move reports to
		});

	// if not checked emit with status id
	if (statusOption.value !== null)
		return emit("delete", {
			id: props.id, // id of status to be deleted
			move: statusOption.value, // id of status to move reports to
		});

	// if there are no reports emit delete with null target
	if (bugs.value.length < 1)
		return emit("delete", {
			id: props.id, // id of status to be deleted
			move: null, // id of status to move reports to
		});
};

const close = () => {
	emit("close");
};

watch(props, () => {
	deleteAll.value = false;
	statusOption.value = null;
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 450px;
	// height: 200px;
	justify-content: center;
	gap: 40px;
	padding: 20px;

	.actions {
		display: flex;
		align-items: center;
		justify-content: center;

		gap: 40px;
	}

	.text {
		white-space: pre-line;
		p {
			margin: unset;
		}
	}
}

.break {
	width: 100%;
	height: 1px;
	background-color: #f2ebfd;
	margin: 8px 0;
}

h3 {
	width: 100%;
	padding: 8px 0;
	border-bottom: 1px solid #f2ebfd;
}

.move-form {
	text-align: left;
}

.options {
	p {
		font-size: 0.9rem;
	}
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

.delete-all label {
	display: flex;
	align-items: center;
	gap: 1rem;

	div {
		font-size: 0.9rem;
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
