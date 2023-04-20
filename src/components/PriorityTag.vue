<template>
	<n-tag
		round
		size="tiny"
		class="priority-tag"
		:class="`priority-${priorityData.id}`"
		:bordered="false"
	>
		{{ priorityData.text }}
	</n-tag>
</template>

<script setup lang="ts">
const props = defineProps({
	priority: {
		required: true,
		type: Number,
		description: "Priority ID",
	},
});
const { t } = useI18n();

const priorityData = computed(() => {
	switch (props.priority) {
		case 1:
			return {
				id: 1,
				text: t("minor"),
			};

		default:
		case 2:
			return {
				id: 2,
				text: t("normal"),
			};

		case 3:
			return {
				id: 3,
				text: t("important"),
			};

		case 4:
			return {
				id: 4,
				text: t("critical"),
			};
	}
});
</script>

<style scoped lang="scss">
.priority-tag {
	justify-content: center;
	color: #ffffff;
	font-weight: normal;
	user-select: none;
	padding: 0.25rem 0.5rem;
	word-break: keep-all;

	&.priority-1 {
		background-color: var(--bs-blue-light);
	}

	&.priority-2 {
		background-color: var(--bs-blue);
	}

	&.priority-3 {
		background-color: var(--bs-yellow);
	}

	&.priority-4 {
		background-color: var(--bs-red);
	}
}
</style>
