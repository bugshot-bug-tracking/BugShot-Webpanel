<template>
	<n-dynamic-tags v-model:value="tags" @click.stop round>
		<template #input="{ submit, deactivate }">
			<n-auto-complete
				ref="autoCompleteInstRef"
				v-model:value="tag.value"
				size="small"
				:options="tag.options"
				placeholder="Tag"
				:clear-after-select="true"
				@select="onSelection($event, submit)"
				@blur="deactivate"
				:render-label="renderLabel"
				:loading="tag.loading"
			/>
		</template>
	</n-dynamic-tags>
</template>

<script setup lang="ts">
import debounce from "lodash.debounce";
import { AutoCompleteInst, NTag, SelectOption } from "naive-ui";
import { AutoCompleteOptions } from "naive-ui/es/auto-complete/src/interface";
import { VNodeChild } from "vue";

const props = defineProps({
	list: {
		type: Array as PropType<string[]>,
		required: false,
		default: [],
	},
});

const emit = defineEmits(["update:list"]);

const tags = computed({
	get: () => {
		return props.list;
	},
	set(value) {
		emit("update:list", value);
	},
});

const inputRef = ref<AutoCompleteInst | null>(null);
watch(inputRef, (value) => {
	if (value) nextTick(() => value.focus());
});

const tag = reactive({
	value: "",
	options: undefined as AutoCompleteOptions | undefined,
	loading: false,
});

const fetchSuggestedTags = debounce(async () => {
	if ((tag.value?.length ?? 0) < 1 || tag.value === "") tag.options = undefined;

	try {
		tag.loading = true;

		await new Promise((resolve) => setTimeout(resolve, 1000));
		let response = [
			{
				label: "bug",
				value: "bug",
			},
			{
				label: "feature",
				value: "feature",
			},
			{
				label: "info",
				value: "info",
			},
		];

		let filtered = response.filter((i) => i.label.includes(tag.value));

		if (filtered.length < 1)
			filtered.push({
				label: tag.value,
				value: "<-new,>",
			});

		tag.options = filtered;
	} catch (error) {
		console.log(error);
	} finally {
		tag.loading = false;
	}
}, 500);

watch(tag, fetchSuggestedTags);

const renderLabel = (option: SelectOption): VNodeChild => {
	let c: any = [option.label as string, " "];

	if (option.value === "<-new,>")
		c[2] = h(NTag, { size: "small", type: "info" }, { default: () => "new" });

	return c;
};

const onSelection = (value: string | number, submit: Function) => {
	if (value === "<-new,>") return submit(tag.value);

	return submit(value);
};
</script>

<style scoped></style>
