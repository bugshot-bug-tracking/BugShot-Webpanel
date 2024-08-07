<template>
	<n-button type="success" round size="large" @click="active = true" class="sh-add-bug">
		<template #icon>
			<img src="/src/assets/icons/add.svg" alt="add" class="black-to-white" />
		</template>
		{{ t("add.bug") }}
	</n-button>

	<n-drawer v-model:show="active" :width="'30rem'" placement="right">
		<n-drawer-content>
			<template #header>
				<div flex items-center justify-between flex-1>
					<n-h3 m-0>{{ t("new_bug_report") }}</n-h3>
					<img src="/src/assets/icons/close_2.svg" alt="close" />
				</div>
			</template>

			<n-scrollbar>
				<n-form
					ref="formRef"
					flex
					flex-col
					gap-4
					pr-4
					@submit.prevent="submit"
					:rules="rules"
					:model="data"
				>
					<div class="bs-container">
						<ImageManager @update="imagesUpdate" :disabled="loading" />
					</div>

					<div class="bs-container">
						<n-form-item :label="t('bug_name')" path="designation">
							<n-input
								type="text"
								:minlength="1"
								:maxlength="70"
								:show-count="true"
								:placeholder="t('bug_name')"
								v-model:value="data.designation"
								:disabled="loading"
								required
							/>
						</n-form-item>

						<n-form-item :label="t('bug_desc')" path="description">
							<n-input
								type="textarea"
								:maxlength="1500"
								:show-count="true"
								:placeholder="t('describe_problem')"
								v-model:value="data.description"
								:disabled="loading"
							/>
						</n-form-item>

						<n-form-item :label="t('deadline')" path="deadline">
							<n-date-picker
								v-model:value="data.deadline"
								type="datetime"
								clearable
								:placeholder="$t('no_deadline')"
								:disabled="loading"
								flex-1
							/>
						</n-form-item>

						<n-form-item :label="t('set_priority')" path="priority">
							<div grid grid-cols-4 gap-4 flex-1>
								<PriorityTag
									:priority="1"
									checkable
									:checked="data.priority === 1"
									@click="data.priority = 1"
									:disabled="loading"
								/>
								<PriorityTag
									:priority="2"
									checkable
									:checked="data.priority === 2"
									@click="data.priority = 2"
									:disabled="loading"
								/>
								<PriorityTag
									:priority="3"
									checkable
									:checked="data.priority === 3"
									@click="data.priority = 3"
									:disabled="loading"
								/>
								<PriorityTag
									:priority="4"
									checkable
									:checked="data.priority === 4"
									@click="data.priority = 4"
									:disabled="loading"
								/>
							</div>
						</n-form-item>

						<n-form-item :label="t('time_estimate')" path="estimate">
							<n-input-group>
								<n-input-number
									clearable
									:min="0"
									v-model:value="data.time_estimation"
									:disabled="loading"
								/>

								<n-select
									v-model:value="data.time_estimation_type"
									default-value="m"
									:options="timeEstimateOptions"
								/>
							</n-input-group>
						</n-form-item>

						<n-form-item
							:label="t('assigned_to')"
							path="assignees"
							:show-feedback="false"
						>
							<AssignModal :assignedList="data.assignees" @submit="assigneesSubmit" />
						</n-form-item>
					</div>

					<AttachmentsList
						:list="data.attachments"
						:error="attachments.error"
						@upload="attachments.upload"
						:disabled="loading"
						local
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

					<n-button
						type="success"
						strong
						round
						mx-a
						size="large"
						:disabled="loading"
						:loading="loading"
						attr-type="submit"
					>
						{{ $t("report_bug") }}
					</n-button>
				</n-form>
			</n-scrollbar>
		</n-drawer-content>
	</n-drawer>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		:z_index="100000"
	/>
</template>

<script setup lang="ts">
import toBase64 from "~/util/toBase64";
import { useReportsStore } from "~/stores/reports";
import { FormInst, FormRules } from "naive-ui";
import { User } from "~/models/User";
import axios from "axios";
import { useFlagsStore } from "~/stores/flags";

const store = useReportsStore();

const { t } = useI18n();

const active = ref(false);

const loading = ref(false);

const data = reactive({
	designation: "",
	description: "",
	deadline: undefined as number | undefined,
	priority: 2,
	images: [] as File[],
	attachments: [] as File[],
	assignees: [] as User[],
	time_estimation: undefined as undefined | number,
	time_estimation_type: undefined as undefined | "m" | "h" | "d" | "w",
});

const attachments = reactive({
	error: "",

	upload: (files: File[]) => {
		data.attachments.push(...files);
	},

	delete: (index: number) => {
		data.attachments.splice(index, 1);
	},
});

const imagesUpdate = (files: File[]) => {
	data.images = files;
};

const submit = async () => {
	try {
		// if this throws an error it will go straight to catch
		await formRef.value?.validate();

		loading.value = true;
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

		let response = await store.createBug({
			designation: data.designation,
			description: data.description,
			priority_id: data.priority,
			deadline: data.deadline,
			images: images,
			attachments: attachments,
			time_estimation: data.time_estimation,
			time_estimation_type: data.time_estimation_type,
		});

		await Promise.allSettled(
			data.assignees.map(async (user) => {
				return await axios.post(`bugs/${response.id}/assign-user`, {
					user_id: user.id,
				});
			})
		);

		loadingModal.state = 1;
		loadingModal.message = t("bug_created");

		active.value = false;

		resetData();
	} catch (error) {
		if (loading.value === true) loadingModal.state = 2;

		console.log(error);
	} finally {
		loading.value = false;
	}
};

const resetData = () => {
	data.designation = "";
	data.description = "";
	data.deadline = undefined;
	data.priority = 2;
	data.images = [];
	data.attachments = [];
	data.assignees = [];
	data.time_estimation = undefined;
	data.time_estimation_type = undefined;
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

const formRef = ref<FormInst | null>(null);

const rules: FormRules = reactive({
	designation: {
		required: true,
		min: 1,
		renderMessage: () => t("rules.designation_required"),
	},
});

const assigneesSubmit = (list: { user: User; original: boolean; checked: boolean }[]) => {
	data.assignees = [];
	list.forEach((element) => {
		if (element.checked === true) data.assignees.push(element.user);
	});
};

const timeEstimateOptions = computed(() => [
	{
		label: t("minute", 2),
		value: "m",
	},
	{
		label: t("hour", 2),
		value: "h",
	},
	{
		label: t("day", 2),
		value: "d",
	},
	{
		label: t("week", 2),
		value: "w",
	},
]);
</script>

<style scoped lang="scss">
:deep(.n-drawer-header__main) {
	display: flex;
	flex: 1;
}
:deep(.n-select) {
	width: 40%;
}
</style>
