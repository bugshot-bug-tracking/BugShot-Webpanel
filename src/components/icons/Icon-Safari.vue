<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
			<path d="m4.9577 10.0423 1.9067-3.1779 3.1779-1.9067-1.9067 3.1779-3.1779 1.9067Z" />
			<path
				fill-rule="evenodd"
				d="M0 7.5C0 3.3574 3.3574 0 7.5 0S15 3.3574 15 7.5 11.6426 15 7.5 15 0 11.6426 0 7.5Zm11.9288-3.7428a.5001.5001 0 0 0-.686-.686L6.1356 6.1357l-3.0643 5.1071a.5.5 0 0 0 .686.686l5.1071-3.0643 3.0644-5.1072Z"
				clip-rule="evenodd"
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
	filled: Boolean,
});

// in case it is disabled prevent click events
const onClick = (event: MouseEvent) => {
	if (props.disabled) event.stopPropagation();
};
</script>
