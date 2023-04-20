<template>
	<n-button type="success" round size="large" @click="tabOpen = true">
		<template #icon>
			<img src="/src/assets/icons/add.svg" alt="add" class="black-to-white" />
		</template>
		{{ t("add.bug") }}
	</n-button>

	<div v-if="tabOpen" class="bs-tab bs-scroll">
		<form @submit.prevent="submit" flex flex-col gap-4>
			<div class="top">
				<h4>{{ t("new_bug_report") }}</h4>

				<img src="/src/assets/icons/close_2.svg" alt="close" @click="tabOpen = false" />
			</div>

			<div class="bs-container">
				<ImageManager @update="imagesUpdate" />
			</div>

			<div class="bs-container" gap-4>
				<div class="bs-input">
					<label flex justify-between>
						<p>{{ t("bug") }}</p>
						<span>{{ `${data.designation.length}/70` }}</span>
					</label>

					<input
						type="text"
						:placeholder="t('bug_name')"
						v-model="data.designation"
						required
						minlength="1"
						maxlength="70"
					/>
				</div>

				<div class="bs-input">
					<label flex justify-between>
						<p>{{ t("bug_desc") }}</p>
						<span>{{ `${data.description.length}/1500` }}</span>
					</label>

					<textarea
						:placeholder="t('describe_problem')"
						v-model="data.description"
						rows="3"
						maxlength="1500"
					/>
				</div>

				<div class="datepicker">
					<div>{{ t("pick_date") }}</div>

					<Datepicker
						v-model="data.deadline"
						:placeholder="t('no_deadline')"
						@cleared="clearDeadline"
						:selectText="t('select.select')"
						:cancelText="t('cancel')"
					/>
				</div>

				<div class="priority">
					<div>{{ t("set_priority") }}</div>

					<div class="options">
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="1"
								id="i1"
								v-model="data.priority"
							/>
							<label for="i1" class="i i1">
								<span> {{ t("minor") }} </span>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="2"
								id="i2"
								v-model="data.priority"
							/>
							<label for="i2" class="i i2">
								<span> {{ t("normal") }} </span>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="3"
								id="i3"
								v-model="data.priority"
							/>
							<label for="i3" class="i i3">
								<span> {{ t("important") }} </span>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="4"
								id="i4"
								v-model="data.priority"
							/>
							<label for="i4" class="i i4">
								<span> {{ t("critical") }} </span>
							</label>
						</div>
					</div>
				</div>

				<div class="assign-to" v-if="false">
					<div>{{ t("assigned_to") }}</div>
					<Assignees :list="[]" />
				</div>
			</div>

			<AttachmentsList
				:list="data.attachments"
				:error="attachments.error"
				@upload="attachments.upload"
			>
				<template #item="{ item, index }">
					<AttachmentsItem
						:name="item.name"
						:id="index"
						@delete="attachments.delete"
						:download="false"
					/>
				</template>
			</AttachmentsList>

			<button class="bs-btn green" type="submit">
				{{ t("report_bug") }}
			</button>
		</form>
	</div>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
	/>

	<div class="full-overlay" v-if="tabOpen" @click="tabOpen = false" />
</template>

<script setup lang="ts">
import toBase64 from "~/util/toBase64";
import { useReportsStore } from "~/stores/reports";

const store = useReportsStore();

const { t } = useI18n();

const tabOpen = ref(false);

const data = reactive({
	designation: "",
	description: "",
	deadline: undefined as string | undefined,
	priority: 2,
	images: [] as File[],
	attachments: [] as File[],
});

const attachments = reactive({
	error: "",

	upload: (files: File[]) => {
		data.attachments = files;
	},

	delete: (index: number) => {
		data.attachments.splice(index, 1);
	},
});

const clearDeadline = () => {
	data.deadline = undefined;
};

const imagesUpdate = (files: File[]) => {
	data.images = files;
};

const submit = async () => {
	try {
		loadingModal.show = true;

		// convert all images from file to string
		let images = await Promise.all(
			data.images.map(async (i) => ({
				base64: btoa((await toBase64(i)) as string),
			}))
		);

		// convert all attachments from file to string
		let attachments = await Promise.all(
			data.attachments.map(async (a) => ({
				designation: a.name,
				base64: btoa((await toBase64(a)) as string),
			}))
		);

		await store.createBug({
			designation: data.designation,
			description: data.description,
			priority_id: data.priority,
			deadline: data.deadline,
			images: images,
			attachments: attachments,
		});

		loadingModal.state = 1;
		loadingModal.message = t("bug_created");

		tabOpen.value = false;
		resetData();
	} catch (error) {
		loadingModal.state = 2;

		console.log(error);
	}
};

const resetData = () => {
	data.designation = "";
	data.description = "";
	data.deadline = undefined;
	data.priority = 2;
	data.images = [];
	data.attachments = [];
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
.add-button {
	display: flex;
	align-items: center;
	gap: 6px;

	> img {
		height: 1.5rem;
	}
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.25rem 1rem;

	font-size: 1.4rem;

	img {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}
}

.priority {
	text-align: start;
	font-weight: bold;
	font-size: 14px;

	input {
		display: none;

		&:checked + label {
			background-color: currentcolor;

			span {
				color: white;
			}
		}
	}

	.options {
		display: flex;
		justify-content: space-around;
	}

	.i {
		font-weight: normal;
		font-size: 12px;
		line-height: 16px;
		border-radius: 30px;
		width: fit-content;
		height: fit-content;

		padding: 3px 10px;
		user-select: none;
		border: 2px solid;
		cursor: pointer;

		&.i1 {
			color: hsl(188, 80%, 47%);
		}
		&.i2 {
			color: hsl(218, 80%, 47%);
		}
		&.i3 {
			color: hsl(32, 100%, 67%);
		}
		&.i4 {
			color: hsl(0, 90%, 60%);
		}
	}
}
.datepicker {
	text-align: start;
	font-weight: bold;
	font-size: 14px;
}

.assign-to {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
	font-size: 14px;
}
</style>
