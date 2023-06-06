<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg
			id="check"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2851"
					data-name="Rectangle 2851"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<path
					id="Path_889"
					data-name="Path 889"
					d="M9.49,18.91l-6.5-6.5L4.41,11l5.08,5.08L19.59,5.99,21,7.41Z"
				/>
			</g>
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
