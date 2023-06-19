<template>
	<div class="notification-entry">
		<div class="notification-header">
			<n-text>
				<i18n-t keypath="approval_request_fulfilled" scope="global">
					<n-text strong> {{ value.data.evaluator_name }}</n-text>
				</i18n-t>
			</n-text>
		</div>

		<div class="notification-footer">
			<n-text style="color: var(--bs-gray)" v-if="value.data.created_at">
				{{ $d(new Date(dateFix(value.data.created_at)), "short") }}
			</n-text>
		</div>

		<div class="notification-action">
			<n-button text underline type="primary" @click="openPDF">
				{{ $t("view_pdf") }}
			</n-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ApprovalReportReceived } from "~/models/NotificationTypes/ApprovalReportReceived";
import dateFix from "~/util/dateFixISO";

const props = defineProps({
	value: {
		type: Object as PropType<ApprovalReportReceived>,
		required: true,
	},
});

const openPDF = () => {
	window.open(props.value.data.file_path, "_blank");
};
</script>
