<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg
			id="ordering"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2890"
					data-name="Rectangle 2890"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<rect
					id="Rectangle_2891"
					data-name="Rectangle 2891"
					width="20"
					height="2"
					transform="translate(2 4)"
				/>
				<rect
					id="Rectangle_2892"
					data-name="Rectangle 2892"
					width="9"
					height="2"
					transform="translate(2 11)"
				/>
				<rect
					id="Rectangle_2893"
					data-name="Rectangle 2893"
					width="2"
					height="10"
					transform="translate(16.06 9)"
				/>
				<rect
					id="Rectangle_2894"
					data-name="Rectangle 2894"
					width="7"
					height="2"
					transform="translate(2 18)"
				/>
				<path
					id="Path_912"
					data-name="Path 912"
					d="M17.06,19.85l-4.81-4.09,1.29-1.52,3.52,2.98,3.52-2.98,1.3,1.52Z"
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
