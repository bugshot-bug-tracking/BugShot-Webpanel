<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg id="add" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2824"
					data-name="Rectangle 2824"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<path
					id="Path_876"
					data-name="Path 876"
					d="M12,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22ZM12,4a8,8,0,1,0,8,8A8,8,0,0,0,12,4Z"
				/>
				<rect
					id="Rectangle_2825"
					data-name="Rectangle 2825"
					width="2"
					height="10.44"
					transform="translate(11 6.78)"
				/>
				<rect
					id="Rectangle_2826"
					data-name="Rectangle 2826"
					width="10.44"
					height="2"
					transform="translate(6.78 11)"
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
