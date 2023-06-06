<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg
			v-if="!alternative"
			id="close_2"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2855"
					data-name="Rectangle 2855"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<rect
					id="Rectangle_2856"
					data-name="Rectangle 2856"
					width="2"
					height="20.47"
					transform="translate(4.053 5.466) rotate(-45)"
				/>
				<rect
					id="Rectangle_2857"
					data-name="Rectangle 2857"
					width="20.47"
					height="2"
					transform="translate(4.053 18.534) rotate(-45)"
				/>
			</g>
		</svg>

		<svg
			v-else
			id="close_1"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2852"
					data-name="Rectangle 2852"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<path
					id="Path_890"
					data-name="Path 890"
					d="M12,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22ZM12,4a8,8,0,1,0,8,8A8,8,0,0,0,12,4Z"
				/>
				<rect
					id="Rectangle_2853"
					data-name="Rectangle 2853"
					width="2"
					height="10.44"
					transform="translate(7.602 9.016) rotate(-45)"
				/>
				<rect
					id="Rectangle_2854"
					data-name="Rectangle 2854"
					width="10.44"
					height="2"
					transform="translate(7.602 14.984) rotate(-45)"
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
	alternative: Boolean,
});

// in case it is disabled prevent click events
const onClick = (event: MouseEvent) => {
	if (props.disabled) event.stopPropagation();
};
</script>
