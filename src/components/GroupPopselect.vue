<template>
	<n-popover placement="left-start" trigger="click" class="p-2!">
		<template #trigger>
			<n-button text v-bind="$attrs" :title="buttonTitle">
				<IconFilter />
			</n-button>
		</template>

		<n-list hoverable :show-divider="false">
			<n-list-item v-for="group in groups" class="px-1! py-0.5! cursor-default">
				<n-popselect
					:options="group.children!"
					v-model:value="selectedValues[group.key]"
					multiple
					placement="left-start"
					scrollable
					@update:value="emit('update:filter', group.key, $event)"
					trigger="click"
					:content-style="{ color: 'red' }"
				>
					<n-button
						text
						icon-placement="right"
						class="w-100% flex justify-between px-1 py-0"
					>
						<template #icon>
							<IconArrowHead ml-a :deg="-90" />
						</template>

						{{ group.label }}
					</n-button>
				</n-popselect>
			</n-list-item>
		</n-list>
	</n-popover>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { SelectOption } from "naive-ui";

interface FilterGroup {
	label: string;
	key: string;
	children: SelectOption[] | undefined;
}

// const props =
defineProps({
	buttonTitle: {
		type: String,
		required: false,
		default: undefined,
	},
	groups: {
		type: Array as PropType<FilterGroup[]>,
		required: false,
		default: [],
	},
});

const emit = defineEmits<{
	(event: "update:filter", key: string, value: (string | number)[]): void;
}>();

const selectedValues = ref<{ [key: string]: (string | number)[] }>({});
</script>

<style scoped lang="scss"></style>
