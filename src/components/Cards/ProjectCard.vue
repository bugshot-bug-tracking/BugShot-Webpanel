<!-- Note:
	- Proposal: remove the popup options and replace them with a gear that redirects to the project settings page
-->
<template>
	<div class="project-card">
		<div
			class="top"
			:style="{
				'background-color': color,
			}"
			@click="emit('open')"
		>
			<img v-if="c_image" :src="c_image" class="dark-overlay" alt="image" />

			<div class="text">{{ title }}</div>

			<div class="edit-time">
				{{ $t("last_edit_ago", { time: timeToText(lastEdit) }) }}
			</div>
		</div>

		<div class="bottom">
			<div class="left">
				<div class="text-left">{{ $t("task_overview") }}</div>
				<div class="text-right">
					{{ `${progress.done} / ${progress.total}` }}
				</div>
			</div>

			<div class="right" v-if="actions">
				<RouterLink :to="to_settings" v-if="to_settings">
					<img
						src="/src/assets/icons/gear.svg"
						alt="settings"
						:title="$t('setting', 2)"
					/>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import timeToText from "~/util/timeToText";

const props = defineProps({
	title: {
		required: true,
		type: String,
		default: "Title",
	},

	lastEdit: {
		required: false,
		type: String,
		default: null,
	},

	image: {
		required: false,
		type: String,
		default: "",
	},

	color: {
		required: false,
		type: String,
		default: "#7A2EE6",
	},

	progress: {
		required: true,
		type: Object,
		default: { done: 0, total: 0 },
	},

	actions: {
		required: false,
		type: Boolean,
		default: false,
	},

	to_settings: {
		type: Object as PropType<{ name: string; params: { id: string } }>,
		required: false,
	},
});

const emit = defineEmits(["open", "edit", "delete"]);

const c_image = computed(() => (props.image !== "" ? atob(props.image) : undefined));
</script>

<style lang="scss" scoped>
.project-card {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 2.2fr 0.8fr;
	grid-template-areas:
		"top"
		"bottom";
	width: 20rem;
	height: 12.5rem;
	border-radius: 0.75rem;
	box-shadow: 0px 2px 4px hsla(0deg, 0%, 0%, 0.161);
	margin: 0.5rem;
}

.top {
	grid-area: top;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border-radius: 0.75rem 0.75rem 0 0;
	overflow: hidden;
	text-align: left;
	cursor: pointer;

	img {
		min-width: 100%;
		min-height: 100%;
	}

	> .text {
		position: absolute;
		font-size: 1.25rem;
		font-weight: bold;
		color: white;
		left: 1rem;
		bottom: 2rem;
	}

	> .edit-time {
		position: absolute;
		font-size: 0.875rem;
		color: white;
		left: 1rem;
		bottom: 0.5rem;
	}
	.dark-overlay {
		filter: brightness(0.8);
	}
}

.bottom {
	grid-area: bottom;
	display: flex;
	align-items: center;
	position: relative;

	.left {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		font-weight: bold;
		text-transform: capitalize;
		font-size: 1.125rem;
		width: 100%;
	}

	.right {
		display: flex;
		position: relative;
		width: 15%;
		padding: 0.7rem;
		border-left: 1px solid hsl(263, 79%, 94%);
		cursor: pointer;

		> img {
			min-width: 100%;
			min-height: 100%;
		}
	}
}

.popup-actions {
	position: absolute;
	display: flex;
	flex-direction: column;
	background-color: #f8f8fc;
	border: 0.06rem solid #e6e6ff;
	top: 0.2rem;
	left: 3rem;
	z-index: 1;
	border-radius: 0.5rem;
	box-shadow: 0 0.25rem 0.375rem hsla(0, 0%, 0%, 0.2);

	&::before {
		content: "";
		position: absolute;
		top: 0.375rem;
		left: -0.45rem;
		z-index: -1;
		width: 1.25rem;
		height: 1.25rem;
		transform: rotate(45deg);
		background-color: #f8f8fc;
		border: 1px solid #e6e6ff;
		box-shadow: 0.25rem 1px 0.375rem hsla(0, 0%, 0%, 0.2);
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.25rem 0;
		background-color: #f8f8fc;
		text-transform: capitalize;
		border-radius: 0.5rem;
	}

	a {
		display: flex;
		align-items: center;
		background-color: #f8f8fc;
		gap: 0.5rem;
		padding: 0.25rem 1rem;
		user-select: none;
		cursor: pointer;

		> img {
			height: 1.5rem;
			width: 1.5rem;
		}

		&:hover {
			background-color: hsl(158, 79%, 87%);
		}
	}
}
</style>
