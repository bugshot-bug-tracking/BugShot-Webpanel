<template>
	<div class="message-wrapper" :class="sender === 0 ? `self` : `other`">
		<div class="content">
			<div class="message">{{ content }}</div>
			<div class="timestamp">{{ date(timestamp) }}</div>
		</div>

		<div class="creator">
			<div class="avatar">
				{{ creator.first_name[0] + creator.last_name[0] }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Message",
	props: {
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
	},
	setup() {
		const date = (dateString) => {
			if (dateString === "" || dateString === null) return "";
			return new Date(dateString).toLocaleString();
		};

		return {
			date,
		};
	},
};
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
