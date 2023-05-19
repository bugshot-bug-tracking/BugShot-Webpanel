<template>
	<div my-2>
		<ul :class="{ active: active }" pl-4>
			<li v-for="rule in rules" flex items-center gap-2>
				<Icon-Check v-if="rule.value" color="var(--bs-green)" />
				<Icon-X v-else color="var(--bs-gray)" />

				<n-text :type="rule.value ? 'success' : 'default'">
					{{ rule.text }}
				</n-text>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
defineProps({
	rules: {
		type: Array as PropType<{ text: string; value: boolean }[]>,
	},
	active: Boolean,
});
</script>

<style scoped lang="scss">
ul {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.5s ease-in-out;

	&.active {
		max-height: 10rem;
		transition: max-height 0.5s ease-in-out;
	}
}
</style>
