<template>
	<section class="bs-container" :class="{ active: active }">
		<h1 class="bs-bb" @click="emit('info')">
			{{ title }}
		</h1>

		<div class="card-body">
			<b>{{ t("deadline") }}:</b>

			<p>
				{{ deadline }}
			</p>

			<div class="bs-priority" :class="`priority-` + priority" justify-self-end>
				{{ priorities[priority - 1].text }}
			</div>
		</div>

		<div v-if="badge" class="card-badge" :class="{ 'delete-badge': badge === 'delete' }">
			<img
				v-if="badge === 'archive'"
				src="/src/assets/icons/archive.svg"
				alt=""
				class="black-to-white"
			/>

			<img
				v-else-if="badge === 'delete'"
				src="/src/assets/icons/delete.svg"
				alt=""
				class="black-to-white"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
const emit = defineEmits(["info"]);

defineProps({
	title: {
		required: true,
		type: String,
	},

	deadline: {
		required: true,
		type: String,
	},

	priority: {
		required: true,
		type: Number,
	},

	active: {
		required: false,
		type: Boolean,
		default: false,
	},

	badge: {
		required: false,
		type: String as PropType<undefined | "archive" | "delete">,
		default: undefined,
	},
});

const { t } = useI18n();

const priorities = computed(() => [
	{
		id: 1,
		text: t("minor"),
	},
	{
		id: 2,
		text: t("normal"),
	},
	{
		id: 3,
		text: t("important"),
	},
	{
		id: 4,
		text: t("critical"),
	},
]);
</script>

<style lang="scss" scoped>
section {
	padding: 0.5rem 1rem;
	border-width: 2px;
	position: relative;

	h1 {
		font-size: 1rem;
		font-weight: bold;
		text-align: left;
		padding: 0.5rem 0;
		margin: unset;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-word;
		cursor: pointer;
		border-width: 2px;
	}

	&.active {
		border: 2px solid #7a2ee6;
	}
}

.card-body {
	display: grid;
	grid-template-columns: auto auto 1fr;
	font-size: 0.875rem;
	gap: 1rem;
	padding: 1rem 0 0.5rem 0;

	p {
		color: #9ba5d7;
	}

	div {
		font-size: 0.75rem;
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
