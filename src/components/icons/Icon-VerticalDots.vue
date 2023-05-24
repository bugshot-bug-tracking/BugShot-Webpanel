<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg
			id="more_options"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2884"
					data-name="Rectangle 2884"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<circle
					id="Ellipse_87"
					data-name="Ellipse 87"
					cx="2"
					cy="2"
					r="2"
					transform="translate(10 3)"
				/>
				<circle
					id="Ellipse_88"
					data-name="Ellipse 88"
					cx="2"
					cy="2"
					r="2"
					transform="translate(10 17)"
				/>
				<circle
					id="Ellipse_89"
					data-name="Ellipse 89"
					cx="2"
					cy="2"
					r="2"
					transform="translate(10 10)"
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
