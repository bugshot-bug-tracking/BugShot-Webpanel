<template>
	<div class="notification-entry">
		<div class="notification-header">
			<n-text>
				<i18n-t keypath="new_approval_form_received" scope="global">
					<n-text strong> {{ value.data.exporter_name }}</n-text>
					<n-text strong> {{ value.data.project_designation }}</n-text>
				</i18n-t>
			</n-text>
		</div>

		<div class="notification-footer" v-if="value.data.created_at">
			<n-text style="color: var(--bs-gray)">
				{{ $d(new Date(dateFix(value.data.created_at)), "short") }}
			</n-text>
		</div>

		<div class="notification-action">
			<n-button secondary round type="primary" @click="openForm" icon-placement="right">
				<template #icon>
					<Icon-ArrowHead color="var(--bs-purple)" :deg="-90" />
				</template>

				{{ $t("go") }}
			</n-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ImplementationApprovalFormReceived } from "~/models/NotificationTypes/ImplementationApprovalFormReceived";
import dateFix from "~/util/dateFixISO";

const props = defineProps({
	value: {
		type: Object as PropType<ImplementationApprovalFormReceived>,
		required: true,
	},
});

const openForm = () => {
	window.location.href = props.value.data.url;
};
</script>
