<template>
	<div class="comment-wrapper" :class="{ owner: owner, highlighted: highlightedComment }">
		<div class="action">
			<n-button
				v-if="showVisibilityChange"
				text
				type="tertiary"
				@click="emit('change-visibility')"
				:title="
					visibility ? t('comment_visibility.internal') : t('comment_visibility.public')
				"
			>
				<IconEarthSlashed v-if="visibility" />
				<IconEarth v-else />
			</n-button>
		</div>

		<div class="message-wrapper">
			<div class="message">
				<span>
					{{ creator.first_name }}
					{{ creator.last_name }}
				</span>

				<p ref="node">{{ content }}</p>
			</div>

			<span class="timestamp">{{ d(new Date(timestamp), "short") }}</span>
		</div>

		<Avatar
			:first_name="creator.first_name"
			:last_name="creator.last_name"
			size="S"
			:color="owner ? colors[3] : colors[4]"
		/>
	</div>
</template>

<script setup lang="ts">
import colors from "~/util/colors";

const props = defineProps({
	id: {
		required: false,
		type: String,
	},
	content: {
		required: true,
		type: String,
	},
	creator: {
		required: true,
		type: Object,
	},
	owner: {
		required: true,
		type: Boolean,
		default: false,
	},
	timestamp: {
		required: true,
		type: String,
	},
	visibility: {
		required: false,
		type: Boolean,
		default: true,
	},
	showVisibilityChange: {
		required: false,
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits<{ (event: "change-visibility"): void }>();

const { t, d } = useI18n();

const route = useRoute();
const node = ref<HTMLDivElement | null>(null);

onMounted(() => {
	// single instance as 1 group
	let regex1 = /(\<[0-9]+\$\@.+?\>)/i;
	// grouped by data type (id,tag)
	let regex2 = /\<([0-9]+)\$\@(.+?)\>/i;

	let parts = props.content.split(regex1);
	node.value.innerText = "";

	for (const part of parts) {
		let match = part.match(regex2);

		if (!match) node.value.append(part);
		else {
			let tag = document.createElement("span");
			tag.className = "tagged";
			tag.textContent = "@" + match[2];
			tag.style.color = "#7A2EE6";

			node.value.append(tag);
		}
	}
});

const highlightedComment = computed(() => {
	let value = route.query.c === props.id;

	if (value) nextTick(() => node.value?.scrollIntoView({ behavior: "smooth" }));

	return value;
});
</script>

<style lang="scss" scoped>
.comment-wrapper {
	display: flex;
	column-gap: 0.5rem;

	flex-direction: row-reverse;

	&.owner {
		flex-direction: row;

		.avatar {
			display: none;
		}

		.action {
			justify-content: flex-end;
		}

		.message {
			span {
				display: none;
			}

			&::before {
				right: -0.25rem;
				left: unset;
			}
		}

		.timestamp {
			align-self: flex-end;
		}
	}

	&:hover {
		.action {
			visibility: visible;
			opacity: 1;
		}
	}
}

.action {
	visibility: hidden;
	opacity: 0;
	transition: visibility 0.25s linear, opacity 0.25s linear;

	display: flex;
	flex: 1;
	justify-content: flex-start;

	margin-bottom: 1rem;
}

.timestamp {
	width: fit-content;
	font-size: 0.75rem;
	margin: 0 1rem;
	color: var(--bs-gray);
	height: 1rem;
}

.message-wrapper {
	max-width: 75%;
	display: flex;
	flex-direction: column;
}

.message {
	font-size: 0.875rem;
	background: hsl(230, 43%, 95%);
	border-radius: 1.25rem;
	position: relative;
	padding: 0.5rem 1rem;
	margin: 0 0.5rem;
	overflow-wrap: anywhere;
	white-space: pre-line;

	&::before {
		border-width: 0.6rem;
		border-style: solid;
		border-color: hsl(230, 43%, 95%) transparent transparent transparent;
		content: "";
		position: absolute;
		top: 0;
		left: -0.25rem;
		right: unset;
	}

	span {
		font-size: 0.75rem;
		font-weight: bold;
		color: var(--bs-gray-dark);
	}
}

.highlighted {
	animation: pulse 2s infinite ease-in alternate;
	padding: 0.5rem 0;

	@keyframes pulse {
		0% {
			background-color: hsla(158, 80%, 47%, 0.2);
		}
		50% {
			background-color: hsla(158, 80%, 47%, 0.3);
		}
		100% {
			background-color: hsla(158, 80%, 47%, 0.4);
		}
	}
}
</style>
