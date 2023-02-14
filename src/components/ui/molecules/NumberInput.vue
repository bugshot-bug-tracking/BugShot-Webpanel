<template>
	<div :class="`size-${size}`" flex items-baseline>
		<div flex>
			<button @click="decrementValue">-</button>

			<input
				type="number"
				:min="lowerLimit"
				:max="upperLimit"
				:value="modelValue"
				@input="updateValue"
			/>

			<button @click="incrementValue">+</button>
		</div>

		<b ml-3>{{ labelText?.toLocaleLowerCase() }}</b>
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
const props = defineProps({
	modelValue: {
		type: Number as PropType<number>,
		required: false,
	},
	labelText: {
		type: String as PropType<string | undefined>,
		required: false,
		default: undefined,
	},

	lowerLimit: {
		type: Number as PropType<number | undefined>,
		required: false,
		default: undefined,
	},
	upperLimit: {
		type: Number as PropType<number | undefined>,
		required: false,
		default: undefined,
	},

	size: {
		required: false,
		type: String as PropType<"S" | "M">,
		default: "S",
	},
});

const emit = defineEmits<{ (event: "update:modelValue", value: number): void }>();

const updateValue = (event: any) => {
	if (event.target.value <= 0) emit("update:modelValue", 1);
	else emit("update:modelValue", event.target.value);
};

const incrementValue = (event: any) => {
	if (props.modelValue == undefined) return;

	if (props.upperLimit && props.modelValue + 1 > props.upperLimit) return;

	emit("update:modelValue", props.modelValue + 1);
};

const decrementValue = (event: any) => {
	if (props.modelValue == undefined) return;

	if (props.lowerLimit && props.modelValue - 1 < props.lowerLimit) return;

	emit("update:modelValue", props.modelValue - 1);
};
</script>

<style lang="scss" scoped>
button {
	font-weight: bold;
	border: 2px solid var(--bs-purple);

	&:first-of-type {
		border-radius: 0.25rem 0 0 0.25rem;
	}

	&:last-of-type {
		border-radius: 0 0.25rem 0.25rem 0;
	}

	background-color: #e4d5fa;
}

input {
	border: 2px solid var(--bs-purple);
	border-left-width: 0;
	border-right-width: 0;
	text-align: center;

	&:focus,
	&:focus-visible {
		outline: unset;
	}

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	&[type="number"] {
		-moz-appearance: textfield; /* Firefox */
	}
}

.size-S {
	font-size: 1rem;

	input {
		height: 1.75rem;
		width: 3rem;
		text-align: center;
	}

	button {
		height: 1.75rem;
		width: 1.75rem;
	}
}

.size-M {
	font-size: 1.125rem;

	input {
		height: 2.5rem;
		width: 3.5rem;
		font-size: 1.125rem;
	}

	button {
		height: 2.5rem;
		width: 2rem;
		font-size: 1.125rem;
	}
}
</style>
