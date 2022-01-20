<template>
	<div class="bug-card">
		<div class="card">
			<div class="card-header bug-title" @click="$emit('info', id)">
				{{ title }}
			</div>

			<div class="card-body">
				<div class="card-text d-flex justify-content-between">
					<div class="bug-deadline">
						{{ deadline ? date(deadline) : "No deadline" }}
					</div>

					<div class="bug priority" :class="'p' + priority" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BugCard",
	props: {
		id: {
			required: true,
			type: String,
		},
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
	},
	emits: ["info"],
	setup() {
		const date = (dateString) => {
			if (dateString === "" || dateString === null) return "";
			if (dateString.slice(-1).toUpperCase() !== "Z") dateString += "Z";

			return new Date(dateString).toLocaleString();
		};

		return {
			date,
		};
	},
};
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
		padding: 3px 10px;
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
