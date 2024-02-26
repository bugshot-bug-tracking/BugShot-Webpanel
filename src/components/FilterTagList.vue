<template>
	<n-list
		flex-1
		flex
		gap-x-3
		gap-y-2
		flex-wrap
		style="background-color: transparent"
		:show-divider="false"
	>
		<n-list-item v-for="user in creators" class="p-0!">
			<n-tag
				round
				:color="{
					color: 'var(--bs-green-light)',
					borderColor: 'var(--bs-green-dark)',
				}"
				size="small"
			>
				<div flex items-center justify-center gap-2>
					<n-p m-0>
						<n-text style="color: var(--bs-green-dark)"> {{ t("creator") }}: </n-text>
						<n-text style="color: var(--bs-green-dark)" strong>
							{{
								user
									? `${user.attributes.first_name} ${user.attributes.last_name}`
									: t("anonymous")
							}}
						</n-text>
					</n-p>

					<n-button text @click="emit('remove:creator', user)">
						<IconX size="1rem" color="var(--bs-green-dark)" />
					</n-button>
				</div>
			</n-tag>
		</n-list-item>

		<n-list-item v-for="user in assignees" class="p-0!">
			<n-tag
				round
				:color="{
					color: 'var(--bs-purple-light)',
					borderColor: 'var(--bs-purple-dark)',
				}"
				size="small"
			>
				<div flex items-center justify-center gap-2>
					<n-p m-0>
						<n-text style="color: var(--bs-purple-dark)"> {{ t("assignee") }}: </n-text>
						<n-text style="color: var(--bs-purple-dark)" strong>
							{{ `${user.attributes.first_name} ${user.attributes.last_name}` }}
						</n-text>
					</n-p>

					<n-button text @click="emit('remove:assignee', user)">
						<IconX size="1rem" color="var(--bs-purple-dark)" />
					</n-button>
				</div>
			</n-tag>
		</n-list-item>

		<n-list-item v-for="value in priorities" class="p-0!">
			<n-tag round :color="priorityOptions(value)?.tagStyle" size="small">
				<div flex items-center justify-center gap-2>
					<n-p m-0>
						<n-text :style="{ color: priorityOptions(value)?.textColor }">
							{{ t("priority") }}:
						</n-text>
						<n-text :style="{ color: priorityOptions(value)?.textColor }" strong>
							{{ priorityOptions(value)?.label }}
						</n-text>
					</n-p>

					<n-button text @click="emit('remove:priority', value)">
						<IconX size="1rem" :color="priorityOptions(value)?.textColor" />
					</n-button>
				</div>
			</n-tag>
		</n-list-item>
	</n-list>
</template>

<script setup lang="ts">
import { User } from "~/models/User";

// const props =
defineProps({
	creators: {
		type: Array as PropType<(User | undefined)[]>,
		required: false,
		default: [],
	},
	assignees: {
		type: Array as PropType<User[]>,
		required: false,
		default: [],
	},
	priorities: {
		type: Array as PropType<any[]>,
		required: false,
		default: [],
	},
});

const emit = defineEmits<{
	(event: "remove:creator", value: User | undefined): void;
	(event: "remove:assignee", value: User): void;
	(event: "remove:priority", value: number): void;
}>();

const { t } = useI18n();

const priorityOptions = (value: number) => {
	switch (value) {
		case 1:
			return {
				label: t("minor"),
				value: 1,
				tagStyle: {
					color: "var(--bs-light-blue-light)",
					borderColor: "var(--bs-light-blue)",
				},
				textColor: "var(--bs-light-blue)",
			};
		case 2:
			return {
				label: t("normal"),
				value: 2,
				tagStyle: {
					color: "var(--bs-blue-light)",
					borderColor: "var(--bs-blue-dark)",
				},
				textColor: "var(--bs-blue)",
			};
		case 3:
			return {
				label: t("important"),
				value: 3,
				tagStyle: {
					color: "var(--bs-yellow-light)",
					borderColor: "var(--bs-yellow-dark)",
				},
				textColor: "var(--bs-yellow-dark)",
			};
		case 4:
			return {
				label: t("critical"),
				value: 4,
				tagStyle: {
					color: "var(--bs-red-light)",
					borderColor: "var(--bs-red-dark)",
				},
				textColor: "var(--bs-red)",
			};
	}
};
</script>

<style scoped lang="scss"></style>
