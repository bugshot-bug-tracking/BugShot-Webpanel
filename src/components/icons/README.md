# What is this folder for?

This folder contains icons compiled by the project using the Naive UI icon component; it's main purpose is to enable dynamic svg icon modifications like color and size.

# How to write a component

## File Name

For the name please use Icon-{name}.vue to easily identify in code.

## File Structure

The structure follows the Vue SFC one where in template is most of the data and the script tag contains custom logic for this project; in the next example the script is used to enable a disabled mode for the icon where the color is gray and any click events are stopped.

Check icon example:

```vue
<template>
	<n-icon
		size="24"
		@click.capture="onClick"
		:class="{ 'button-icon': button, 'icon-disabled': disabled }"
	>
		<svg
			id="check"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g id="Layer_3" data-name="Layer 3">
				<rect
					id="Rectangle_2851"
					data-name="Rectangle 2851"
					width="24"
					height="24"
					fill="none"
				/>
			</g>
			<g id="Layer_2" data-name="Layer 2">
				<path
					id="Path_889"
					data-name="Path 889"
					d="M9.49,18.91l-6.5-6.5L4.41,11l5.08,5.08L19.59,5.99,21,7.41Z"
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
```

### Note

1.  Documentation for `<n-icon/>` can be found [here](https://www.naiveui.com/en-US/light/components/icon).
2.  Please use the `<script/>` block from the example to maintain a consistent default behavior in the project; additions in specific components are good but subtractions from default are not recommended.
    -   In case the default `<script/>` block needs more values/code please update this documentation as well and leave a note in the [Updates](#updates) regarding what changed for versioning purposes.
3.  The `button` prop is for quickly assign style to the icon for making it look more like a button.
    -   `custom_n-icon_button` and `custom_n-icon_button-disabled` classes can be found in `styles/custom.css` file.
4.  In case the `color` is set externally it will take precedence over the internal one (the hover color set in class will not work in this case).

# Updates <a name="updates"></a>

-   vx.y.z: ...
-   v1.5.3: first release of this file.
