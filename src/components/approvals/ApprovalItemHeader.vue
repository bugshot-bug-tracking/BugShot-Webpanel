<template>
	<div
		grid
		items-center
		flex-1
		p-2
		style="grid-template-columns: 1fr 8rem 13rem 5rem; column-gap: 1rem; word-break: keep-all"
	>
		<div flex items-center gap-2>
			<n-checkbox class="checkbox-round-inverted" @click.stop :value="bug.id" />

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
				{{ bug.attributes.time_estimate ?? "-" }}
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
		type: String as PropType<"pending" | "approved" | "rejected">,
		required: false,
		default: "pending",
	},
});

const { t } = useI18n();

const statusData = computed(() => {
	switch (props.status) {
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

		case "rejected":
			return {
				type: "error",
				text: t("approval_status.rejected"),
			};
	}
});
</script>
