<template>
	<n-popover trigger="hover" v-if="message">
		<template #trigger>
			<img src="/src/assets/icons/info.svg" alt="i" class="black-to-gray" v-bind="$attrs" />
		</template>

		<n-text strong>
			{{ message }}
		</n-text>
	</n-popover>
</template>

<script setup lang="ts">
defineProps({
	message: String,
});
</script>

<style scoped lang="scss">
img {
	width: 1.25rem;
	height: 1.25rem;
}
span {
	white-space: pre-line;
}
</style>
