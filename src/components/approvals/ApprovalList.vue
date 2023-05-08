<template>
	<div style="width: 50%" flex flex-col mx-a overflow-auto>
		<div flex-1 flex items-center justify-between px-6 style="white-space: nowrap">
			<div flex items-center gap-4>
				<n-checkbox
					class="checkbox-round-inverted"
					:checked="list.length === selectionList.length"
					@update:checked="selectAll"
				>
					<n-text type="primary" strong>
						{{
							!(list.length === selectionList.length)
								? $t("select_all")
								: $t("deselect_all")
						}}
					</n-text>
				</n-checkbox>

				<n-button
					v-if="selectionList.length > 0"
					type="success"
					ghost
					size="tiny"
					round
					@click="approveSelected"
				>
					{{ t("approve_selected") }}
				</n-button>

				<n-button
					v-if="selectionList.length > 0"
					type="error"
					ghost
					size="tiny"
					round
					@click="rejectSelected"
				>
					{{ t("reject_selected") }}
				</n-button>
			</div>

			<div inline-flex gap-12 my-4 items-center>
				<n-text strong>
					<i18n-t keypath="pending_x_out_of_y_bugs" scope="global">
						<n-text>{{ resolvedCount }}</n-text>
						<n-text>{{ list.length }}</n-text>
					</i18n-t>
				</n-text>

				<div inline-flex gap-2 items-center>
					<n-text strong> {{ t("sort_bugs_by") }} </n-text>

					<n-popselect
						trigger="click"
						v-model:value="sorting.value"
						:options="sorting.options"
						placement="right-start"
						@update:value="sorting.changeOrder"
					>
						<Icon-Sort cursor-pointer />
					</n-popselect>
				</div>
			</div>
		</div>

		<n-scrollbar pr-2>
			<n-checkbox-group p-2 v-model:value="selectionList">
				<n-collapse arrow-placement="right" class="collapse" accordion>
					<n-collapse-item
						v-for="bug in sortedList"
						:key="bug.id"
						class="collapse-item bs-b"
					>
						<template #header>
							<ApprovalItemHeader :bug="bug" :status="bugResponses.get(bug.id)" />
						</template>

						<ApprovalItem
							:bug="bug"
							@approve="bugResponses.set(bug.id, 'approved')"
							@reject="bugResponses.set(bug.id, 'rejected')"
						/>
					</n-collapse-item>
				</n-collapse>
			</n-checkbox-group>
		</n-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { DropdownOption } from "naive-ui";
import { Bug } from "~/models/Bug";

const props = defineProps({
	list: {
		required: false,
		type: Array as PropType<Bug[]>,
		default: [],
	},
});

const emit = defineEmits(["totalTime"]);

const { t } = useI18n();

const sorting = reactive({
	value: undefined as undefined | "priority" | "date" | "estimate",

	order: "desc" as "asc" | "desc",

	oldValue: undefined as undefined | "priority" | "date" | "estimate",

	options: [
		{
			label: t("priority"),
			value: "priority",
		},
		{
			label: t("time_estimate"),
			value: "estimate",
		},
		{
			label: t("deadline"),
			value: "date",
		},
	] as DropdownOption[],

	changeOrder: (value: string) => {
		console.log(value);

		if (sorting.oldValue !== sorting.value) sorting.oldValue = sorting.value;
		else sorting.order = sorting.order === "asc" ? "desc" : "asc";
	},
});

const sortedList = computed(() => {
	switch (sorting.value) {
		case "priority":
			return props.list.sort(
				(a, b) =>
					(a.attributes.priority.id - b.attributes.priority.id) *
					(sorting.order === "asc" ? 1 : -1)
			);

		case "date":
			return props.list.sort(
				(a, b) =>
					(new Date(a.attributes.deadline ?? 0).getTime() -
						new Date(b.attributes.deadline ?? 0).getTime()) *
					(sorting.order === "asc" ? 1 : -1)
			);
		case "estimate":
			return props.list.sort(
				(a, b) =>
					(new Date(a.attributes.time_estimate ?? 0).getTime() -
						new Date(b.attributes.time_estimate ?? 0).getTime()) *
					(sorting.order === "asc" ? 1 : -1)
			);

		default:
			return props.list;
	}
});

const selectionList = ref<string[]>([]);

const selectAll = (value: boolean) => {
	if (value === true)
		props.list.forEach((b) =>
			!selectionList.value.some((i) => i === b.id) ? selectionList.value.push(b.id) : ""
		);
	else selectionList.value = [];
};

const bugResponses = ref(new Map<string, "pending" | "approved" | "rejected">());

const approveSelected = () => {
	selectionList.value.forEach((item) => {
		bugResponses.value.set(item, "approved");
	});

	selectionList.value = [];
};

const rejectSelected = () => {
	selectionList.value.forEach((item) => {
		bugResponses.value.set(item, "rejected");
	});

	selectionList.value = [];
};

const resolvedCount = computed(() => {
	let count = props.list.length;
	bugResponses.value.forEach((v) => {
		if (v !== "pending") count--;
	});

	return count;
});

watchEffect(() => {
	let time = 0;

	for (const [key, value] of bugResponses.value.entries()) {
		if (value !== "approved") continue;

		let bug = props.list.find((x) => x.id === key);
		time += bug?.attributes.time_estimate ?? 0;
	}

	emit("totalTime", time);
});
</script>

<style lang="scss" scoped>
h6 {
	margin: 0;
}

.collapse {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	.collapse-item {
		background-color: white;

		border-radius: 0.5rem;
		padding: 0.5rem;
		box-shadow: 0 0.125rem 0.25rem #00000026;

		:deep(.n-collapse-item__header) {
			padding: 0;
		}
	}
}
</style>
