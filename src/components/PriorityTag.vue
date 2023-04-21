<template>
	<n-tag
		round
		size="small"
		class="priority-tag"
		:class="[
			`priority-${priorityData.id}`,
			{ ghost: checkable && !checked },
			{ 'cursor-pointer': checkable },
		]"
		:bordered="checkable && !checked"
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

	checkable: {
		required: false,
		type: Boolean,
		default: false,
	},

	checked: {
		required: false,
		type: Boolean,
		default: true,
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
		background-color: var(--bs-light-blue);

		&.ghost {
			color: var(--bs-light-blue);
		}
	}

	&.priority-2 {
		background-color: var(--bs-blue);

		&.ghost {
			color: var(--bs-blue);
		}
	}

	&.priority-3 {
		background-color: var(--bs-yellow);

		&.ghost {
			color: var(--bs-yellow);
		}
	}

	&.priority-4 {
		background-color: var(--bs-red);

		&.ghost {
			color: var(--bs-red);
		}
	}

	&.ghost {
		background-color: #ffffff !important;

		:deep(.n-tag__border) {
			border-color: currentColor;
			border-width: 2px;
		}
	}
}
</style>
