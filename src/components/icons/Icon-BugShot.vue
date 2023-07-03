<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 40 40">
			<path
				fill="#18d992"
				d="M26.93 18.33a7.23 7.23 0 0 0-5.29-5.42v3.51h-3.27v-3.51a7.23 7.23 0 0 0-5.29 5.42h3.42v3.34h-3.42a7.23 7.23 0 0 0 5.29 5.42v-3.51h3.27v3.51a7.23 7.23 0 0 0 5.29-5.42H23.5v-3.34Z"
				data-name="Path 140"
			/>
			<path
				fill="#18d992"
				d="M21.63 9.5a10.54 10.54 0 0 1 8.62 8.83h3.63v-3.91l5.64-5.78a1.7 1.7 0 0 0 0-2.37L33.4 0l-2.31 2.37 5 5.09-3.81 3.9-5-5.09a1.61 1.61 0 0 0-1.15-.49h-4.49Z"
				data-name="Path 141"
			/>
			<path
				fill="#18d992"
				d="M33.88 25.58v-3.91h-3.63a10.52 10.52 0 0 1-8.62 8.83v3.72h4.49a1.64 1.64 0 0 0 1.16-.49l5-5.09 3.82 3.91-5 5.09L33.4 40l6.12-6.27a1.7 1.7 0 0 0 0-2.37Z"
				data-name="Path 142"
			/>
			<path
				fill="#18d992"
				d="M18.37 30.5a10.52 10.52 0 0 1-8.62-8.83H6.12v3.91L.48 31.36a1.7 1.7 0 0 0 0 2.37L6.6 40l2.31-2.36-5-5.09 3.82-3.91 5 5.09a1.64 1.64 0 0 0 1.16.49h4.49Z"
				data-name="Path 143"
			/>
			<path
				fill="#18d992"
				d="M6.12 14.42v3.91h3.63a10.54 10.54 0 0 1 8.62-8.83V5.78h-4.49a1.64 1.64 0 0 0-1.16.49l-5 5.09-3.78-3.9 5-5.09L6.6 0 .48 6.27a1.69 1.69 0 0 0 0 2.36Z"
				data-name="Path 144"
			/>
		</svg>
	</n-icon>
</template>

<script setup lang="ts">
const props = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
	button: {
		type: Boolean,
		default: false,
	},
});

// in case it is disabled prevent click events
const onClick = (event: MouseEvent) => {
	if (props.disabled) event.stopPropagation();
};
</script>
