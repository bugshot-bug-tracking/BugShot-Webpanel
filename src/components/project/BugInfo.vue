<template>
	<n-card class="n-card-container" v-if="!store.bug || store.loading_bug">
		<template #header v-if="store.loading_bug">
			<n-skeleton text height="2rem" />
		</template>

		<div flex flex-col gap-4>
			<div flex gap-2>
				<n-skeleton size="medium" width="33%" />
				<n-skeleton size="medium" width="33%" />
				<n-skeleton size="medium" width="33%" />
			</div>

			<n-skeleton height="10rem" />

			<n-skeleton text />

			<div>
				<n-skeleton width="40%" mb-2 />
				<n-skeleton height="5rem" />
			</div>

			<n-skeleton text />

			<div flex gap-2 items-center>
				<n-skeleton text />
				<n-skeleton text size="medium" />
				<n-skeleton text />
				<n-skeleton text size="medium" />
			</div>

			<n-skeleton text size="medium" />

			<n-skeleton text size="medium" />
		</div>
	</n-card>

	<n-card class="n-card-container" v-else>
		<template #header>
			<div v-if="!bugData.flag1" flex justify-between min-h-8 items-baseline>
				<div flex items-baseline>
					<n-h3>
						{{ store.bug.attributes.designation }}
					</n-h3>

					<img
						w-4
						ml-2
						class="black-to-gray"
						src="/src/assets/icons/edit.svg"
						alt="edit"
						cursor-pointer
						@click="bugData.editDesignation"
					/>
				</div>

				<img
					w-6
					ml-2
					src="/src/assets/icons/close_2.svg"
					alt="edit"
					cursor-pointer
					@click="emit('close')"
				/>
			</div>

			<div v-else flex gap-4 h-8 items-center>
				<n-input
					v-model:value="bugData.designation"
					type="text"
					:placeholder="store.bug.attributes.designation"
					maxlength="70"
					show-count
					flex-1
				/>

				<div flex gap-2>
					<img
						src="/src/assets/icons/check.svg"
						alt="save"
						class="black-to-gray"
						@click="changeDesignation"
						w-6
						cursor-pointer
					/>

					<img
						src="/src/assets/icons/close_2.svg"
						alt="cancel"
						class="black-to-gray"
						@click="bugData.flag1 = false"
						cursor-pointer
						w-6
					/>
				</div>
			</div>
		</template>

		<div flex flex-col gap-4>
			<div grid style="grid-template-columns: 1fr 4fr 3fr">
				<div>
					<n-h6> {{ $t("id") }}</n-h6>
					<p style="font-size: 0.875rem">
						{{ store.bug.attributes.ai_id }}
					</p>
				</div>

				<div>
					<n-h6>{{ $t("creator") }}</n-h6>

					<p style="font-size: 0.875rem">
						<template v-if="store.bug.attributes.creator">
							{{
								`${store.bug.attributes.creator.attributes.first_name} ${store.bug.attributes.creator.attributes.last_name}`
							}}
						</template>

						<template v-else>
							{{ `${store.bug.attributes.selector ?? t("anonymous")}` }}
						</template>
					</p>
				</div>

				<div>
					<n-h6>{{ $t("created_at") }}</n-h6>

					<p style="font-size: 0.875rem">
						{{ $d(new Date(dateFix(store.bug.attributes.created_at)), "short") }}
					</p>
				</div>
			</div>

			<n-skeleton height="10rem" v-if="store.loading_screenshots" />
			<Screenshot
				v-else
				:screenshots="store.getScreenshots"
				:priority="store.bug.attributes.priority.id"
			/>

			<div flex gap-2 v-if="store.bug.attributes.url" h-6>
				<n-h6>{{ $t("url") }}:</n-h6>

				<a
					:href="store.bug.attributes.url"
					target="_blank"
					style="font-size: 0.875rem; color: var(--bs-gray)"
				>
					<n-ellipsis :line-clamp="1" :tooltip="{ scrollable: true }">
						{{ store.bug.attributes.url }}
					</n-ellipsis>
				</a>
			</div>

			<div flex flex-col gap-2>
				<div flex items-center justify-between h-6>
					<div flex items-center>
						<n-h6>{{ $t("description") }}:</n-h6>

						<img
							v-if="!bugData.flag2"
							w-4
							ml-2
							class="black-to-gray"
							src="/src/assets/icons/edit.svg"
							alt="edit"
							cursor-pointer
							@click="bugData.editDescription"
						/>
					</div>

					<div v-if="bugData.flag2" flex gap-4>
						<img
							src="/src/assets/icons/check.svg"
							alt="save"
							class="black-to-gray"
							@click="changeDescription"
							w-6
							cursor-pointer
						/>

						<img
							src="/src/assets/icons/close_2.svg"
							alt="cancel"
							class="black-to-gray"
							@click="bugData.flag2 = false"
							w-6
							cursor-pointer
						/>
					</div>
				</div>

				<n-ellipsis
					v-if="!bugData.flag2 && store.bug.attributes.description"
					expand-trigger="click"
					line-clamp="5"
					:tooltip="false"
					style="font-size: 0.875rem; white-space: pre-line"
				>
					{{ store.bug.attributes.description }}
				</n-ellipsis>

				<n-input
					v-else-if="bugData.flag2"
					v-model:value="bugData.description"
					type="textarea"
					maxlength="1500"
					show-count
					:placeholder="store.bug.attributes.description"
					:rows="4"
				/>
			</div>

			<n-collapse
				v-if="
					store.bug.attributes.resolution ||
					store.bug.attributes.selector ||
					store.bug.attributes.browser ||
					store.bug.attributes.operating_system
				"
				arrow-placement="right"
				display-directive="show"
			>
				<n-collapse-item class="technical-collapse bs-bb">
					<template #header>
						<n-h6>{{ $t("technical_info") }}</n-h6>
					</template>

					<div grid style="grid-template-columns: auto 1fr; gap: 0.25rem 1rem">
						<n-p>
							{{ $t("os") + ":" }}
						</n-p>

						<n-text>
							{{ store.bug.attributes.operating_system }}
						</n-text>

						<n-p> {{ $t("browser") + ":" }} </n-p>

						<n-text>
							{{ store.bug.attributes.browser }}
						</n-text>

						<n-p> {{ $t("resolution") + ":" }} </n-p>

						<n-text>
							{{ store.bug.attributes.resolution }}
						</n-text>

						<n-p> {{ $t("selector") + ":" }} </n-p>

						<n-text>
							<n-ellipsis line-clamp="2" expand-trigger="click" :tooltip="false">
								{{ store.bug.attributes.selector }}
							</n-ellipsis>
						</n-text>
					</div>
				</n-collapse-item>
			</n-collapse>

			<div grid style="grid-template-columns: 1fr 2fr 1fr 2fr">
				<n-h6>{{ $t("priority") + ":" }}</n-h6>

				<DropdownButton
					@select="changePriority"
					:list="priorities"
					:color="priorities[store.bug.attributes.priority.id - 1].color"
					m-a
				>
					<template #text>
						{{ priorities[store.bug.attributes.priority.id - 1].text }}
					</template>

					<template #item="{ item }">
						<div flex items-center gap-2>
							<div
								class="dot"
								:style="{
									background: item.color,
								}"
							/>

							{{ item.text }}
						</div>
					</template>
				</DropdownButton>

				<n-h6>{{ $t("status") + ":" }}</n-h6>

				<DropdownButton
					@select="changeStatus"
					:list="store.statuses"
					:text="store.getStatus?.attributes.designation"
					m-a
				>
					<template #item="{ item }">
						<n-ellipsis style="max-width: 7rem" :tooltip="{ scrollable: true }">
							{{ item.attributes.designation }}
						</n-ellipsis>
					</template>
				</DropdownButton>
			</div>

			<div flex items-center gap-2>
				<n-h6>
					{{ $t("deadline") + ":" }}
				</n-h6>

				<n-date-picker
					v-model:value="timestamp"
					type="datetime"
					clearable
					:placeholder="$t('no_deadline')"
					flex-1
					@clear="clearDeadline"
					@confirm="changeDeadline"
				/>
			</div>

			<div
				flex
				items-center
				gap-2
				class="bs-bb bs-bt"
				py-4
				v-if="useFeatureFlagsStore().canSeeEverything"
			>
				<n-h6 style="white-space: nowrap">
					{{ $t("time_estimate") + ":" }}
				</n-h6>

				<n-input-group v-if="estimate.editMode">
					<n-input-number
						clearable
						:min="0"
						v-model:value="estimate.value"
						@update:value="estimate.onChange"
						ref="inputNumberInst"
						@blur="estimate.stopEdit"
					/>
					<n-input-group-label>{{ t("minutes") }}</n-input-group-label>
				</n-input-group>

				<div v-else flex items-center>
					<n-text depth="3">
						{{ estimate.value ? t("x_minutes", [estimate.value]) : "-" }}
					</n-text>

					<img
						w-4
						ml-2
						class="black-to-gray"
						src="/src/assets/icons/edit.svg"
						alt="edit"
						cursor-pointer
						@click="estimate.startEdit"
					/>

					<n-text
						v-if="estimate.status"
						:type="estimate.status.type"
						ml-4
						style="font-size: 0.875rem"
					>
						{{ estimate.status.text }}
					</n-text>
				</div>
			</div>

			<div flex items-center gap-2>
				<n-h6>
					{{ $t("assigned_to") + ":" }}
				</n-h6>

				<AssignModal :assignedList="store.getAssignees" :submit="onSubmit" />
			</div>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";
import { Status } from "~/models/Status.js";
import { useBugStore } from "~/stores/bug";
import axios from "axios";
import { User } from "~/models/User";
import debounce from "lodash.debounce";
import { useFeatureFlagsStore } from "~/stores/featureFlags";
import { InputNumberInst } from "naive-ui";

const emit = defineEmits(["close"]);

const store = useBugStore();

const { t } = useI18n();

const priorities = computed(() => [
	{
		id: 1,
		text: t("minor"),
		color: "#18bed8",
	},
	{
		id: 2,
		text: t("normal"),
		color: "#185ed8",
	},
	{
		id: 3,
		text: t("important"),
		color: "#ffb057",
	},
	{
		id: 4,
		text: t("critical"),
		color: "#f53d3d",
	},
]);

const timestamp = ref(undefined as undefined | number);

watchEffect(() => {
	if (store.bug?.attributes.deadline)
		timestamp.value = new Date(dateFix(store.bug!.attributes.deadline)).valueOf();
});

const bugData = reactive({
	designation: "",
	flag1: false,
	editDesignation: () => {
		bugData.designation = store.bug!.attributes.designation;
		bugData.flag1 = true;
	},

	description: "",
	flag2: false,
	editDescription: () => {
		bugData.description = store.bug!.attributes.description;
		bugData.flag2 = true;
	},
});

const changeDesignation = () => {
	bugData.flag1 = false;

	store.bug!.attributes.designation = bugData.designation;

	store.updateBug({
		designation: bugData.designation,
	});
};

const changeDescription = () => {
	bugData.flag2 = false;

	store.bug!.attributes.description = bugData.description;

	store.updateBug({
		description: bugData.description,
	});
};

const changePriority = (value: { id: number; text: string; color: string }) => {
	store.updateBug({
		priority_id: value.id,
	});
};

const changeStatus = (item: Status) => {
	store.updateBug({
		status_id: item.id,
		order_number: 0,
	});
};

const clearDeadline = () => {
	store.updateBug({
		deadline: null,
	});
};

const changeDeadline = (value: number) => {
	let newDate = value ? new Date(value).toISOString() : null;

	if (store.bug!.attributes.deadline != null) {
		let deadline = dateFix(store.bug!.attributes.deadline);

		if (newDate && newDate === deadline) return;
	}

	store.updateBug({
		deadline: newDate,
	});
};

const inputNumberInst = ref<InputNumberInst | null>(null);

const estimate = reactive({
	value: undefined as undefined | number,

	onChange: debounce(async () => {
		console.log("here");
		await store.updateBug({
			time_estimation: estimate.value,
		});
	}, 1000),

	editMode: false,

	startEdit: () => {
		estimate.editMode = true;
		nextTick(() => inputNumberInst.value?.focus());
	},
	stopEdit: () => {
		estimate.editMode = false;
	},

	status: computed(() => {
		let approval_status = store.bug?.attributes.approval_status;

		if (approval_status?.id == undefined) return undefined;

		switch (approval_status.designation) {
			case "pending":
				return {
					text: t("approval_status.pending"),
					type: "warning",
				};

			case "approved":
				return {
					text: t("approval_status.approved"),
					type: "success",
				};

			case "declined":
				return {
					text: t("approval_status.rejected"),
					type: "error",
				};
		}
	}),
});

watchEffect(() => {
	estimate.value = store.bug?.attributes.time_estimation
		? Number(store.bug?.attributes.time_estimation)
		: undefined;
});

const onSubmit = async (list: { user: User; original: boolean; checked: boolean }[]) => {
	for (const item of list) {
		// if no change was made skip over the item
		if (item.original === item.checked) continue;

		if (item.checked === true)
			await axios.post(`bugs/${store.bug?.id}/assign-user`, {
				user_id: item.user.id,
			});
		else await axios.delete(`bugs/${store.bug?.id}/users/${item.user.id}`);
	}

	await store.fetchBugUsers();
};
</script>

<style scoped lang="scss">
h3,
h6 {
	margin: unset;
	word-break: keep-all;
}

.technical-collapse {
	:deep(.n-collapse-item-arrow) {
		margin-left: auto !important;
	}

	p {
		margin: unset;
		font-size: 0.875rem;
		font-weight: 500;

		& + span {
			font-size: 0.875rem;
			color: var(--bs-gray);
		}
	}
}

a:focus-visible {
	outline: unset;
}
</style>
