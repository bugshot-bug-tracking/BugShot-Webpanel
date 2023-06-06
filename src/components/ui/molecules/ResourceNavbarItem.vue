<template>
	<RouterLink :to="to_resource" class="route-header" :class="{ open: open }">
		<div flex gap-2>
			{{ text }}
		</div>

		<div flex gap-2>
			<div
				class="item-options"
				:class="{ open: optionsOpen || open }"
				v-if="owner || authorized"
			>
				<n-dropdown
					trigger="click"
					:options="more.options"
					@clickoutside="optionsOpen = false"
					placement="bottom-end"
				>
					<n-button text @click.prevent="optionsOpen = true">
						<Icon-VerticalDots size="1.25rem" />
					</n-button>
				</n-dropdown>
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
import { DropdownOption } from "naive-ui";
import { PropType } from "vue";
import IconSettings from "~/components/icons/Icon-Settings.vue";

const props = defineProps({
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

const { t } = useI18n();

const router = useRouter();

const more = computed(() => ({
	options: [
		{
			label: t("setting", 2),
			key: "settings",
			icon: () => h(IconSettings),
			show: props.owner || props.authorized,
			props: {
				onClick: () => {
					if (props.to_settings) router.push(props.to_settings);
				},
			},
		},
	] as DropdownOption[],
}));

const optionsOpen = ref(false);
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

		.item-options {
			max-width: 2rem;
			opacity: 1;
		}
	}

	&.router-link-active {
		.item-options {
			max-width: 2rem;
			opacity: 1;
		}
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

.route-header {
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

		.item-options {
			max-width: 2rem;
			opacity: 1;
		}
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

.item-options {
	max-width: 0;
	overflow: hidden;
	opacity: 0;
	transition: all 0.25s ease-in-out;
	display: flex;
	align-self: center;

	&.open {
		max-width: 2rem;
		opacity: 1;
	}
}
</style>
