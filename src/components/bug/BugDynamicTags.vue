<template>
	<n-dynamic-tags v-model:value="tags" @click.stop round>
		<template #input="{ submit, deactivate }">
			<n-auto-complete
				ref="autoCompleteInstRef"
				v-model:value="inputValueRef"
				size="small"
				:options="options"
				placeholder="Tag"
				:clear-after-select="true"
				@select="submit($event)"
				@blur="deactivate"
				:render-label="renderLabel"
			/>
		</template>
	</n-dynamic-tags>
</template>

<script setup lang="ts">
import { AutoCompleteInst, NTag, SelectOption } from "naive-ui";
import { VNodeChild } from "vue";

const tags = ref([]);

const autoCompleteInstRef = ref<AutoCompleteInst | null>(null);

watch(autoCompleteInstRef, (value) => {
	if (value) nextTick(() => value.focus());
});

const inputValueRef = ref("");

const renderLabel = (option: SelectOption): VNodeChild => {
	let c: any = [option.label as string, " "];

	if (option.value === inputValueRef.value)
		c[2] = h(NTag, { size: "small", type: "info" }, { default: () => "New" });

	return c;
};

const options = computed(() => {
	if (inputValueRef.value === null) {
		return [];
	}

	let list = ["bug", "feature", "info"].filter((x) => x.includes(inputValueRef.value));
	console.log(list);

	if (list.length < 1) list.push(inputValueRef.value);

	return list.map((suffix) => {
		return {
			label: suffix,
			value: suffix,
		};
	});
});
</script>

<style scoped></style>
