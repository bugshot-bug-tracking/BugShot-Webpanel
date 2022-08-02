<template>
	<div class="bug-card">
		<div class="card" :class="{ active: active }">
			<div class="card-header bug-title" @click="emit('info')">
				{{ title }}
			</div>

			<div class="card-body">
				<div class="card-text d-flex justify-content-between">
					<div class="bug-deadline">
						{{
							deadline
								? $d(new Date(dateFix(deadline)), "short")
								: $t("no_deadline")
						}}
					</div>

					<DropdownButton
						:color="priorities[priority - 1].color"
						dumb
					>
						<template #text>
							{{ priorities[priority - 1].text }}
						</template>
					</DropdownButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";

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
});

const { t } = useI18n();

const priorities = computed(() => [
	{
		id: 1,
		text: t("minor"),
		color: "#18bed8",
	},
	{
		id: 2,
		text: t("normal"),
		color: "#185ed8",
	},
	{
		id: 3,
		text: t("important"),
		color: "#ffb057",
	},
	{
		id: 4,
		text: t("critical"),
		color: "#f53d3d",
	},
]);
</script>

<style lang="scss" scoped>
.bug-card {
	margin: 0.2em;
	margin-bottom: 0.5em;

	> .card {
		background: hsl(0, 0%, 100%) 0% 0% no-repeat padding-box;
		box-shadow: hsla(0, 0%, 0%, 0.35) 10px 10px 10px -11px;
		border-radius: 12px;
		padding: 8px;

		.card-header {
			padding: 0.5rem;
		}

		.card-body {
			padding: 1rem 0.5rem;
		}

		&.active {
			border: 2px solid #7a2ee6;
		}
	}

	.bug-title {
		background: hsl(0, 0%, 100%);
		border-radius: 12px 12px 0px 0px;
		font-size: 1em;
		font-weight: bold;
		color: hsl(230, 40%, 20%);
		border-bottom: 2px solid hsl(240, 100%, 95%);
		text-align: left;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-word;

		&:hover {
			cursor: pointer;
		}
	}

	.bug-deadline {
		align-items: center;
		color: hsl(230, 45%, 75%);
		font-size: 14px;
		text-align: left;

		&::before {
			content: "Deadline: ";
			font-size: 14px;
			color: hsl(230, 40%, 20%);
			font-weight: bold;
		}
	}
}
</style>
