<template>
	<div>
		<p>Organization: {{ id }}</p>
	</div>
</template>

<script setup lang="ts">
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});
</script>

<style scoped></style>

<route lang="yaml">
name: "organization-users"
</route>
