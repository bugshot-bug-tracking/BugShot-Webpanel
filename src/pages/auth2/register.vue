<template>
	<div w-132 text-left>
		<n-h1 text-6>
			<n-text style="font-weight: 600">
				{{ t("bugshot_registration") }}
			</n-text>
		</n-h1>

		<n-steps :current="steps.current" :status="steps.status" size="small">
			<n-step title="Account">
				<template #icon> <div /></template>
			</n-step>

			<n-step title="Personal data">
				<template #icon> <div /></template>
			</n-step>

			<n-step title="Password">
				<template #icon> <div /></template>
			</n-step>
		</n-steps>
	</div>
</template>

<script setup lang="ts">
import { StepsProps } from "naive-ui";

const { t } = useI18n();

const steps = reactive({
	current: 1,
	status: "process" as StepsProps["status"],
	next: () => {},
	prev: () => {},
});
</script>

<style scoped lang="scss">
:deep(.n-step-indicator) {
	width: 0.5rem;
	height: 0.5rem;
	background-color: var(--bs-gray);
	box-shadow: unset;
	margin: auto;
}
</style>

<route lang="yaml">
name: register2
</route>
