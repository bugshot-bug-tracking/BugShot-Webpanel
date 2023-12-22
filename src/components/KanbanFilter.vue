<template>
	<div class="w-100% max-w-100% flex items-start gap-4">
		<n-select
			placeholder="Creator"
			v-model:value="creatorSelect"
			:options="creatorOptions"
			clearable
			multiple
			@update:value="emit('update:creator', creatorSelect)"
			:style="{
				'max-width': '30ch',
			}"
		/>

		<n-select
			placeholder="Assignee"
			v-model:value="assigneeSelect"
			:options="assigneeOptions"
			clearable
			multiple
			@update:value="emit('update:assignee', assigneeSelect)"
			:style="{
				'max-width': '30ch',
			}"
		/>

		<n-select
			placeholder="Priority"
			v-model:value="prioritySelect"
			:options="priorityOptions"
			clearable
			@update:value="emit('update:priority', prioritySelect)"
			:style="{
				'max-width': '15ch',
			}"
		/>
	</div>
</template>

<script setup lang="ts">
import { SelectOption } from "naive-ui";
import { User } from "~/models/User";

const props = defineProps({
	creators: {
		type: Array as PropType<number[]>,
		required: false,
		default: [],
	},
	assignees: {
		type: Array as PropType<number[]>,
		required: false,
		default: [],
	},
	priority: {
		type: Number,
		required: false,
		default: undefined,
	},

	users: {
		type: Array as PropType<User[]>,
		required: false,
		default: [],
	},
});

const emit = defineEmits(["update:creator", "update:assignee", "update:priority"]);

const { t } = useI18n();

onMounted(() => {
	prioritySelect.value = props.priority;
	creatorSelect.value = props.creators;
	assigneeSelect.value = props.assignees;
});

const creatorSelect = ref<number[]>([]);
const creatorOptions = computed(
	() =>
		props.users?.map((user) => ({
			label: `${user.attributes.first_name} ${user.attributes.last_name}`,
			value: user.id,
		})) as SelectOption[]
);

const assigneeSelect = ref<number[]>([]);
const assigneeOptions = computed(
	() =>
		props.users?.map((user) => ({
			label: `${user.attributes.first_name} ${user.attributes.last_name}`,
			value: user.id,
		})) as SelectOption[]
);

const prioritySelect = ref<undefined | number>(undefined);
const priorityOptions = computed(
	() =>
		[
			{
				label: t("critical"),
				value: 4,
				style: { color: "var(--bs-red)", "font-weight": "bold" },
			},
			{
				label: t("important"),
				value: 3,
				style: { color: "var(--bs-yellow)", "font-weight": "bold" },
			},
			{
				label: t("normal"),
				value: 2,
				style: { color: "var(--bs-blue)", "font-weight": "bold" },
			},
			{
				label: t("minor"),
				value: 1,
				style: { color: "var(--bs-light-blue)", "font-weight": "bold" },
			},
		] as SelectOption[]
);
</script>

<style scoped lang="scss"></style>
