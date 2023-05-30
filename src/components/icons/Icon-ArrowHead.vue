<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
		:style="{ transform: `rotate(${deg}deg)` }"
	>
		<svg
			id="arrow_down"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2833"
					data-name="Rectangle 2833"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2" transform="translate(0 -1.435)">
				<g id="Path_612" data-name="Path 612">
					<path
						id="Path_882"
						data-name="Path 882"
						d="M12.02,17.72,4.87,10.56,6.28,9.15l5.74,5.74,5.7-5.7,1.42,1.42Z"
					/>
				</g>
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
	deg: {
		type: Number,
		default: 0,
	},
});

// in case it is disabled prevent click events
const onClick = (event: MouseEvent) => {
	if (props.disabled) event.stopPropagation();
};
</script>
