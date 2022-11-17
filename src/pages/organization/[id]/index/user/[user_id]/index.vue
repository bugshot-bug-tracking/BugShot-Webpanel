<template>
	<div>
		<p>Organization: {{ id }}</p>
		<p>User: {{ user_id }}</p>
	</div>
</template>

<script setup lang="ts">
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
	user_id: {
		// needs to be cast to Number because router sends as String
		type: String,
		required: true,
		description: "User ID",
	},
});
</script>

<style scoped></style>

<route lang="yaml">
name: "organization-user"
</route>
