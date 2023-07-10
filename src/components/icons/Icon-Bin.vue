<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g data-name="Layer 3">
				<path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 2868" />
			</g>
			<g data-name="Layer 2">
				<path
					d="M16.41 22H7.59L5 19.41V8h2v10.59L8.41 20h7.18L17 18.59V8h2v11.41Z"
					data-name="Path 893"
				/>
				<path d="M3 6h18v2H3z" data-name="Rectangle 2869" />
				<path
					d="M17 6h-2V4.86L14.14 4H9.86L9 4.86V6H7V4.03L9.03 2h5.94L17 4.03Z"
					data-name="Path 894"
				/>
				<path d="M9 10h2v8H9z" data-name="Rectangle 2870" />
				<path d="M13 10h2v8h-2z" data-name="Rectangle 2871" />
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
