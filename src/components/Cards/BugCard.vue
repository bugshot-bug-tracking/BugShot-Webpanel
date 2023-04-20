<template>
	<n-card
		class="bug-card"
		:class="{ active: active, loading: loading }"
		@click="emit('open', bug.id, bug.attributes.status_id)"
		cursor-pointer
	>
		<template #header>
			<n-h6 class="bs-bb" pb-2>
				<n-ellipsis style="word-break: break-all; max-width: 20rem; line-height: 1.4">
					{{ bug.attributes.designation }}
				</n-ellipsis>
			</n-h6>
		</template>

		<div grid style="grid-template-columns: 4fr 1fr; column-gap: 0.5rem">
			<div flex items-start gap-2 text-3>
				<n-p
					font-500
					style="word-break: keep-all; line-height: 1.2; font-size: 0.875rem"
					v-if="['deadline', 'archiving_in'].includes(body.type)"
				>
					{{ $t(body.type) }}:
				</n-p>

				<n-p style="font-size: 0.875rem">
					<n-ellipsis
						line-clamp="2"
						:tooltip="false"
						style="line-height: 1.2; color: var(--bs-gray)"
					>
						{{ body.text }}
					</n-ellipsis>
				</n-p>
			</div>

			<PriorityTag :priority="bug.attributes.priority.id" />
		</div>

		<div
			v-if="bug.attributes.archived_at != undefined || bug.attributes.deleted_at != undefined"
			class="card-badge"
			:class="{ 'delete-badge': bug.attributes.deleted_at != undefined }"
		>
			<img
				v-if="bug.attributes.deleted_at != undefined"
				src="/src/assets/icons/delete.svg"
				alt=""
				class="black-to-white"
			/>

			<img
				v-else-if="bug.attributes.archived_at != undefined"
				src="/src/assets/icons/archive.svg"
				alt=""
				class="black-to-white"
			/>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { Bug } from "~/models/Bug";
import timeToText from "~/util/timeToText";

const props = defineProps({
	bug: {
		type: Object as PropType<Bug>,
		required: true,
	},

	active: {
		required: false,
		type: Boolean,
		default: false,
	},

	loading: {
		required: false,
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits<{ (event: "open", bug_id: string, status_id: string): void }>();

const { t, d } = useI18n();

const body = computed(() => {
	if (props.bug.attributes.done_at != undefined) {
		let date = new Date(props.bug.attributes.done_at);
		date.setDate(date.getDate() + 30);

		return {
			type: "archiving_in",
			text: timeToText(date),
		};
	}

	if ((props.bug.attributes.description?.length ?? 0) > 2)
		return {
			type: "description",
			text: props.bug.attributes.description,
		};

	if ((props.bug.attributes.deadline?.length ?? 0) > 2)
		return {
			type: "deadline",
			text: d(new Date(props.bug.attributes.deadline)),
		};

	return {
		type: "deadline",
		text: t("no_deadline"),
	};
});
</script>

<style scoped lang="scss">
p,
span {
	margin: unset;
}

h6 {
	margin: unset;
	border-width: 2px;
}
.bug-card {
	border-radius: 1rem;
	text-align: left;
	border: 2px solid var(--bs-purple-light);
	box-shadow: 0 0.125rem 0.25rem hsla(0, 0%, 0%, 0.15);

	:deep(.n-card-header) {
		padding: 1rem 1rem 0 1rem;
	}
	:deep(.n-card__content) {
		padding: 0.5rem 1rem 1rem 1rem;
	}

	&.active {
		border-color: var(--bs-purple);
	}

	&.loading {
		opacity: 0.5;
		&::after {
			content: "";
			inset: 0;
			margin: auto;
			position: absolute;
			width: 3rem;

			background-image: url("/src/assets/animations/loading.svg");
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center center;
		}
	}
}

.card-badge {
	position: absolute;
	top: -0.75rem;
	right: -0.75rem;
	background: var(--bs-blue);
	border-radius: 3.5rem;
	padding: 0.25rem;
	width: 1.5rem;
	height: 1.5rem;
	display: flex;

	img {
		width: 1rem;
		height: 1rem;
	}

	&.delete-badge {
		background: var(--bs-red);
	}
}
</style>
