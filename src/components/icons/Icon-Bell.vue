<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg
			id="notification"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2889"
					data-name="Rectangle 2889"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<path id="Path_910" data-name="Path 910" d="M10,20a2,2,0,0,0,4,0Z" />
				<path
					id="Path_911"
					data-name="Path 911"
					d="M22.06,18H1.94l3.4-7.22V5.59L8.93,2h6.14l3.59,3.59v5.19Zm-17-2H18.91l-2.25-4.78V6.41L14.24,4H9.76L7.34,6.41v4.81Z"
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
	filled: Boolean,
});

// in case it is disabled prevent click events
const onClick = (event: MouseEvent) => {
	if (props.disabled) event.stopPropagation();
};
</script>
