<template>
	<div
		grid
		items-center
		flex-1
		p-2
		style="grid-template-columns: 1fr 8rem 13rem 5rem; column-gap: 1rem; word-break: keep-all"
		:class="{ 'disabled-overlay': locked }"
	>
		<div flex items-center gap-2>
			<n-checkbox
				class="checkbox-round-inverted"
				@click.stop
				:value="bug.id"
				v-if="locked === false"
			/>
			<Icon-Lock v-else />

			<n-ellipsis line-clamp="1" :tooltip="{ scrollable: true }">
				<n-text strong>
					{{ bug.attributes.designation }}
				</n-text>
			</n-ellipsis>
		</div>

		<div text-end style="font-size: 0.875rem">
			<n-text :type="statusData.type"> {{ statusData.text }} </n-text>
		</div>

		<div flex items-center gap-2 style="font-size: 0.875rem">
			<n-text strong> {{ t("time_estimate") }}</n-text>
			<n-p style="color: var(--bs-gray)" m-0>
				{{ time_estimation }}
			</n-p>
		</div>

		<div text-end>
			<PriorityTag :priority="bug.attributes.priority.id" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { Bug } from "~/models/Bug";

const props = defineProps({
	bug: {
		required: true,
		type: Object as PropType<Bug>,
	},
	status: {
		type: String as PropType<"pending" | "approved" | "declined">,
		required: false,
		default: "pending",
	},
	defaultStatus: {
		type: String as PropType<"pending" | "approved" | "declined" | undefined>,
		required: false,
		default: undefined,
	},
});

const { t } = useI18n();

const statusData = computed(() => {
	let val = props.status;

	if (props.defaultStatus !== undefined && props.defaultStatus !== "pending")
		val = props.defaultStatus;

	switch (val) {
		default:
		case "pending":
			return {
				type: "warning",
				text: t("approval_status.pending"),
			};
		case "approved":
			return {
				type: "success",
				text: t("approval_status.approved"),
			};

		case "declined":
			return {
				type: "error",
				text: t("approval_status.rejected"),
			};
	}
});

const locked = computed(() => {
	if (props.defaultStatus === undefined || props.defaultStatus === "pending") return false;
	return true;
});

const time_estimation = computed(() => {
	let time = props.bug.attributes.time_estimation;

	if (time === undefined || time < 1) return "-";

	switch (props.bug.attributes.time_estimation_type) {
		default:
		case "m":
			return `${time} ${t("minute", time)}`;
		case "h":
			return `${time} ${t("hour", time)}`;
		case "w":
			return `${time} ${t("week", time)}`;
		case "d":
			return `${time} ${t("day", time)}`;
	}
});
</script>
