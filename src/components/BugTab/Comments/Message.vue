<template>
	<div class="message-wrapper" :class="sender === 0 ? `self` : `other`">
		<div class="content">
			<div class="message" ref="node">{{ content }}</div>
			<div class="timestamp">{{ $d(dateFix(timestamp), "short") }}</div>
		</div>

		<div class="creator">
			<div class="avatar">
				{{ creator.first_name[0] + creator.last_name[0] }}
			</div>
		</div>
	</div>
</template>

<script setup>
import dateFix from "/src/util/dateFixISO";

const props = defineProps({
	content: {
		required: true,
		type: String,
	},
	creator: {
		required: true,
		type: Object,
	},
	sender: {
		required: true,
		type: Number,
	},
	timestamp: {
		required: true,
		type: String,
	},
});

const node = ref(null);

onMounted(() => {
	// single instance as 1 group
	let regex1 = /(\<[0-9]+\$\@.+\>)/i;
	// grouped by data type (id,tag)
	let regex2 = /\<([0-9]+)\$\@(.+)\>/i;

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
</script>

<style lang="scss" scoped>
.message-wrapper {
	display: inline-flex;
	width: 100%;
	margin: 10px 0;

	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		text-align: start;

		.message {
			font-size: 14px;
			background: hsl(230, 43%, 95%);
			border-radius: 20px;
			position: relative;
			padding: 8px 15px;
			margin: 0 10px;
			max-width: 75%;
			overflow-wrap: anywhere;

			&::before {
				border-width: 10px;
				border-style: solid;
				border-color: hsl(230, 43%, 95%) transparent transparent
					transparent;
				content: "";
				position: absolute;
				right: -6px;
				top: 0;
			}
		}

		.timestamp {
			font-size: 10px;
			margin: 0 2em;
		}
	}

	.creator {
		color: hsl(0, 0%, 100%);
		background-color: hsl(265, 80%, 50%);
		font-size: 12px;
		padding: 8px;
		border-radius: 25px;
		height: 35px;
		width: 35px;
		position: relative;

		.avatar {
			text-align: center;
			text-transform: uppercase;
		}
	}

	&.self {
		.content {
			align-items: flex-end;
		}
	}

	&.other {
		flex-direction: row-reverse;

		.content {
			align-items: flex-start;

			.message::before {
				left: -6px;
				right: unset;
			}
		}

		.creator {
			background-color: hsl(158, 80%, 47%);
		}
	}
}
</style>
