<template>
	<div class="wrapper">
		<div flex items-center gap-2>
			<Avatar :first_name="first_name" :last_name="last_name" size="XS" mt-0 />

			<b>
				{{ first_name }}
				{{ last_name }}
			</b>

			<span class="black-to-gray">
				{{ email }}
			</span>

			<slot name="role-badge" />
		</div>

		<slot name="plan-badge" />

		<div ml-a flex items-center>
			<slot name="end" />
		</div>
	</div>
</template>

<script setup lang="ts">
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
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: grid;
	grid-template-columns: 4fr 1fr auto;
	align-items: center;
	gap: 1rem;
}
</style>
