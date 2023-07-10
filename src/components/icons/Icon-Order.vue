<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g data-name="Layer 3">
				<path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 2890" />
			</g>
			<g data-name="Layer 2">
				<path d="M2 4h20v2H2z" data-name="Rectangle 2891" />
				<path d="M2 11h9v2H2z" data-name="Rectangle 2892" />
				<path d="M16.06 9h2v10h-2z" data-name="Rectangle 2893" />
				<path d="M2 18h7v2H2z" data-name="Rectangle 2894" />
				<path
					d="m17.06 19.85-4.81-4.09 1.29-1.52 3.52 2.98 3.52-2.98 1.3 1.52Z"
					data-name="Path 912"
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
``
