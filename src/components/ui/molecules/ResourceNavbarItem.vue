<template>
	<RouterLink :to="to_resource" class="header" :class="{ open: open }">
		<div flex gap-2>
			<img
				v-if="owner"
				src="/src/assets/icons/my_projects.svg"
				alt="owner"
				w-6
				h-6
				:title="$t('owner')"
			/>

			{{ text }}
		</div>

		<div flex gap-2>
			<RouterLink
				v-if="authorized && to_settings"
				:to="to_settings"
				class="route settings"
				:style="{
					'font-weight': 'bold',
					width: 'auto',
					padding: 0,
				}"
			>
				<img
					src="/src/assets/icons/gear.svg"
					alt="settings"
					w-6
					h-6
					:title="$t('settings')"
				/>
			</RouterLink>
			<div
				v-else-if="!authorized && to_settings"
				class="route settings"
				:style="{
					'font-weight': 'bold',
					width: 'auto',
					padding: 0,
					opacity: '0.25',
				}"
				@click.prevent=""
			>
				<img
					src="/src/assets/icons/gear.svg"
					alt="settings"
					w-6
					h-6
					:title="$t('unauthorized')"
				/>
			</div>

			<img
				src="/src/assets/icons/arrow_down.svg"
				class="arrow"
				@click.prevent="emit('toggle')"
			/>
		</div>
	</RouterLink>

	<div class="collapsable">
		<slot name="list"></slot>
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

defineProps({
	text: {
		type: String,
		required: true,
	},

	to_resource: {
		type: Object as PropType<{ name: string; params: { id: string } }>,
		required: true,
	},
	to_settings: {
		type: Object as PropType<{ name: string; params: { id: string } }>,
		required: false,
	},

	open: {
		type: Boolean,
		required: false,
		default: false,
	},

	owner: {
		type: Boolean,
		required: false,
		default: false,
	},

	authorized: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits(["toggle"]);
</script>

<style lang="scss">
.route {
	display: flex;
	align-items: flex-start;
	padding: 0.5rem;
	width: 100%;
	border-radius: 0.5rem;
	gap: 0.5rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
	}

	&.router-link-exact-active {
		background: hsl(158, 79%, 87%);

		&.settings {
			background: transparent;

			img {
				color: #7a2ee6;
				filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
					hue-rotate(263deg) brightness(94%) contrast(92%);
			}
		}
	}
}

.header {
	width: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 0.5rem;
	font-weight: bold;
	cursor: pointer;
	border-radius: 0.5rem;
	line-height: 1.5;
	gap: 1rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
	}

	.arrow {
		transform: rotateZ(-90deg);
		transition: transform 0.2s;
		user-select: none;
		width: 1.5rem;
		height: 1.5rem;
		line-height: 1.5;
	}

	&.open {
		background: hsl(158, 79%, 87%);

		> div img {
			transform: rotateZ(0deg);
		}

		+ .collapsable {
			visibility: visible;
			max-height: 10000px;
			transition: 0.5s ease-in;
		}
	}
}

.collapsable {
	display: flex;
	visibility: collapse;
	max-height: 0;
	flex-direction: column;
	margin: 0.5rem 0 0.5rem 0.5rem;
	transition: 0.2s ease-out;
	overflow: hidden;
	gap: 0.5rem;

	ul {
		padding: 0;
	}
}
</style>
