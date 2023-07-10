<template>
	<div flex items-center style="width: 100%">
		<n-input-group>
			<n-select
				v-model:value="url.protocol"
				:options="url.protocolOptions"
				style="width: 9rem"
				:show-checkmark="false"
			/>

			<n-tooltip
				trigger="hover"
				:content-style="{ fontSize: '0.875rem' }"
				:disabled="finalValue == undefined"
			>
				<template #trigger>
					<n-input
						type="text"
						:maxlength="65000"
						v-model:value="urlValue"
						:placeholder="placeholder"
						:disabled="disabled"
						:loading="loading"
					/>
				</template>

				{{ finalValue }}
			</n-tooltip>
		</n-input-group>

		<div ml-2 cursor-pointer @click.capture="emit('click:suffix')" v-if="!noActions">
			<slot name="suffix">
				<img src="/src/assets/icons/add.svg" alt="" class="black-to-green" />
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SelectOption } from "naive-ui";
const props = defineProps({
	modelValue: {
		type: String,
		required: false,
		default: "",
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
	placeholder: {
		type: String,
		required: false,
		default: "",
	},
	noWildcard: {
		type: Boolean,
		required: false,
		default: false,
	},
	onlyOrigin: {
		type: Boolean,
		required: false,
		default: false,
	},
	noActions: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits<{
	(event: "click:suffix"): void;
	(event: "update:modelValue", value: string | undefined): void;
}>();

const url = reactive({
	protocol: "https",

	//protocol not included
	value: "",

	protocolOptions: [
		{
			label: "http://",
			value: "http",
		},
		{
			label: "https://",
			value: "https",
		},
		{
			label: "*://",
			value: "*",
		},
	] as SelectOption[],
});

if (props.noWildcard === true) {
	url.protocolOptions.splice(2, 1);
}

const urlValue = computed({
	get: () => {
		return url.value;
	},
	set: (value) => {
		const has_protocol_regex = new RegExp("^(.*:\/\/)(.*?)(?:\/|$)$", "i");
		let result = value.match(has_protocol_regex);

		//if no protocol detected update just the value
		if (result == null) return (url.value = value);

		// if there was a protocol detected save it separately and then update the value without the protocol or the trailing /
		if (result[1].match(/https?/i)) url.protocol = result[1].substring(0, result[1].length - 3);
		else url.protocol = props.noWildcard ? "https" : "*";

		url.value = result[2];
	},
});

// Define a computed property to compute the final value
const finalValue = computed(() => {
	// Check if the url value is empty
	if (url.value.length < 1) return undefined; // Return undefined if the url value is empty

	// Remove forward slashes at the end of the url value using regular expression
	const trimmedUrl = url.value.replace(/\/+$/, "");

	// Return the final formatted url value
	return `${url.protocol}://${trimmedUrl}`;
});

watch(url, () => {
	// Don't emit update if the values are the same (this treats the initialization case) and prevents recursive calls from watchEffect
	if (finalValue.value === props.modelValue) return;

	if (url.value.length < 1) emit("update:modelValue", "");
	else {
		if (props.onlyOrigin) {
			let newValue = new URL(finalValue.value ?? "").origin;
			emit("update:modelValue", newValue);
		} else emit("update:modelValue", finalValue.value);
	}
});

watchEffect(() => {
	urlValue.value = props.modelValue;
});
</script>

<style scoped lang="scss">
:deep(.n-base-selection-label) {
	background-color: #f6f1fd;
}
</style>
