<template>
	<RouterLink :to="to" class="bs-container" flex flex-row gap-4 content-start>
		<Avatar :size="'M'" :first_name="first_name" :last_name="last_name" />

		<div text-start>
			<b text-5>{{ first_name }} {{ last_name }}</b>

			<p class="black-to-gray">{{ email }}</p>
		</div>
	</RouterLink>
</template>

<script setup lang="ts">
import { PropType } from "vue";

defineProps({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},

	to: {
		type: Object as PropType<{ name: string; params: { id: string; user_id: string } }>,
		required: true,
	},
});
</script>

<style scoped></style>
