<template>
	<Container>
		<div id="info" class="d-flex flex-column no-wrap">
			<div class="justify-content-between mb-2">
				<div class="title">
					<div class="content">{{ bug.attributes.designation }}</div>
				</div>

				<div class="btn close-button" @click="$emit('close')" />
			</div>

			<div class="id">
				<label> ID: </label>
				<div class="content">{{ bug.id }}</div>
			</div>

			<div class="justify-content-between">
				<div class="creator">
					<label>Creator:</label>
					<div class="content">
						{{
							`${bug.attributes.user.first_name} ${bug.attributes.user.last_name}`
						}}
					</div>
				</div>
				<div class="date">
					<div class="content">
						{{ date(bug.attributes.created_at) }}
					</div>
				</div>
			</div>

			<div class="screenshot">
				<Screenshot
					:screenshots="bug.screenshots"
					:priority="bug.attributes.priority.id"
				/>
			</div>

			<div class="url">
				<label>URL:</label>
				<div class="content">
					<a :href="bug.attributes.url" target="_blank">
						{{ bug.attributes.url }}
					</a>
				</div>
			</div>

			<div class="description">
				<label>Description:</label>
				<div class="content">{{ bug.attributes.description }}</div>
			</div>

			<div id="technical" :class="{ open: open }">
				<div
					class="
						technical-label
						d-inline-flex
						justify-content-between
					"
					@click="open = !open"
				>
					<span>Technical information:</span>
					<img />
				</div>
				<div class="technical-info">
					<div class="os">
						<label>Operating System:</label>
						<div class="content">
							{{ bug.attributes.operating_system }}
						</div>
					</div>

					<div class="browser">
						<label>Browser:</label>
						<div class="content">{{ bug.attributes.browser }}</div>
					</div>

					<div class="selector">
						<label>Selector:</label>
						<div class="content">{{ bug.attributes.selector }}</div>
					</div>

					<div class="resolution">
						<label>Resolution:</label>
						<div class="content">
							{{ bug.attributes.resolution }}
						</div>
					</div>
				</div>
			</div>

			<div class="grid1x2 my-3">
				<div class="grid1x2">
					<label>Priority:</label>
					<div
						class="content priority"
						:class="'p' + bug.attributes.priority.id"
					/>
				</div>

				<div class="grid1x2 status">
					<label>Status:</label>
					<div class="content status">
						{{ bug.attributes.status.designation }}
					</div>
				</div>
			</div>

			<div class="deadline">
				<label>Deadline:</label>

				<div class="content">
					{{
						bug.attributes.deadline
							? date(bug.attributes.deadline)
							: "No deadline"
					}}
				</div>
			</div>
		</div>
	</Container>
</template>

<script>
import { ref } from "@vue/reactivity";
import Container from "./Container.vue";
import Screenshot from "./Screenshot.vue";

export default {
	components: { Container, Screenshot },
	name: "Info",
	props: {
		bug: {
			required: true,
			type: Object,
		},
	},
	emits: ["close"],
	setup(props, context) {
		const open = ref(false);

		const date = (dateString) => {
			if (dateString === "" || dateString === null) return "";
			return new Date(dateString).toLocaleString();
		};

		return {
			open,
			date,
		};
	},
};
</script>

<style lang="scss" scoped>
#info {
	text-align: left;

	label {
		font-weight: bold;
		color: hsl(230, 40%, 20%);
		font-size: 15px;
		text-transform: capitalize;
		margin-right: 5px;
	}

	> div {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.close-button {
		background-image: url("../assets/icons/classic_X.svg");
		background-repeat: no-repeat;
		background-position: center;
		width: 24px;
		height: 24px;
	}
	.title > .content {
		font-size: 20px;
		font-weight: 500;
		align-self: center;
		text-overflow: ellipsis;
		margin-left: 5px;
	}

	.id {
		font-size: 12px;
		line-height: 2em;

		> label {
			font-size: 12px;
		}
	}

	.description {
		display: block;
		text-align: left;
	}

	#technical {
		display: block;
		border-bottom: 1px solid hsl(240, 100%, 95%);
		padding: 0.5em 0;

		img {
			transition: 0.3s;
			content: url("../assets/icons/caret-down-fill.svg");
		}

		&.open {
			img {
				transition: 0.3s;
				transform: rotate(180deg);
			}

			.technical-info {
				max-height: initial;
				transition: max-height 0.3s ease-out;
			}
		}

		.technical-info {
			max-height: 0;
			overflow: hidden;
			line-height: 1.65em;

			.content {
				color: hsl(230, 45%, 75%);
			}

			> div {
				width: 100%;
				display: inline-flex;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: space-between;
			}

			label {
				font-weight: 500;
			}

			.selector {
				flex-direction: column;
				align-items: flex-start;
			}
		}

		.technical-label {
			display: flex;
			justify-content: space-between;
			width: 100%;
			font-size: 16px;
			font-weight: bold;
			margin-top: 0.5em;
			cursor: pointer;
		}
	}

	.creator {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.screenshot {
		position: relative;
		width: 100%;
		height: 170px;
		margin: 0.4em 0;
		background-color: hsl(0, 0%, 50%);
		border: 2px solid hsl(240, 100%, 95%);
		overflow: hidden;
	}

	.url {
		line-height: 2em;

		> .content {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 14px;

			a {
				text-decoration: none;
				color: hsl(230, 45%, 75%);
			}
		}
	}

	.status {
		.content {
			text-align: center;
			padding: 2px 0px;
			color: hsl(0, 0%, 100%);
			background-color: hsl(0, 0%, 50%);
			border-radius: 30px;
			font-size: 14px;
		}
	}

	.deadline .content {
		color: hsl(231, 45%, 75%);
	}

	.grid1x2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
	}
}

.priority {
	font-weight: normal;
	font-size: 12px;
	line-height: 16px;
	color: hsl(0, 0%, 100%);
	border-radius: 30px;
	width: fit-content;
	height: fit-content;

	&.p4 {
		padding: 3px 10px;
		background-color: hsl(0, 90%, 60%);

		&::after {
			content: "Critical";
		}
	}

	&.p3 {
		padding: 4px;
		background-color: hsl(32, 100%, 67%);

		&::after {
			content: "Important";
		}
	}

	&.p2 {
		padding: 3px 10px;
		background-color: hsl(218, 80%, 47%);

		&::after {
			content: "Normal";
		}
	}

	&.p1 {
		padding: 3px 10px;
		background-color: hsl(188, 80%, 47%);

		&::after {
			content: "Minor";
		}
	}
}
</style>
