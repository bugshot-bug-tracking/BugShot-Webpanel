<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'custom_n-icon_button': button, 'custom_n-icon_button-disabled': disabled }"
	>
		<svg
			id="e2lTgXHU7zQ1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 56.090000 56.090000"
			shape-rendering="geometricPrecision"
			text-rendering="geometricPrecision"
		>
			<g id="e2lTgXHU7zQ2_tr" transform="translate(28.049999,28.049999) rotate(0)">
				<g id="e2lTgXHU7zQ2" transform="translate(-28.049999,-28.049999)">
					<circle
						id="e2lTgXHU7zQ3"
						r="26.050000"
						transform="matrix(1 0 0 1 28.05000000000000 28.05000000000000)"
						fill="none"
						stroke="rgb(238,229,252)"
						stroke-width="4"
						stroke-miterlimit="10"
					/>
					<path
						id="e2lTgXHU7zQ4"
						d="M7.610000,43.300000C2.822048,35.257442,2.726494,25.262071,7.359813,17.129447C11.993132,8.996823,20.640144,3.982267,30,4"
						transform="matrix(1 0 0 1 -1.95000000000000 -1.95000000000000)"
						fill="none"
						stroke="rgb(89,22,185)"
						stroke-width="1.500000"
						stroke-linecap="round"
						stroke-miterlimit="10"
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
});

// in case it is disabled prevent click events
const onClick = (event: MouseEvent) => {
	if (props.disabled) event.stopPropagation();
};
</script>

<style>
#e2lTgXHU7zQ2_tr {
	animation: e2lTgXHU7zQ2_tr__tr 3500ms linear infinite normal forwards;
}

@keyframes e2lTgXHU7zQ2_tr__tr {
	0% {
		transform: translate(28.049999px, 28.049999px) rotate(0deg);
	}

	100% {
		transform: translate(28.049999px, 28.049999px) rotate(720deg);
	}
}
</style>
