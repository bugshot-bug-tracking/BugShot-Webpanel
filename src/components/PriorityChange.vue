<template>
	<div
		class="pill priority"
		:class="'p' + priority"
		@click="toggleShow"
		ref="popup"
	>
		<div class="container" v-if="show">
			<div class="i i1" @click="$emit('change', 1)">Minor</div>
			<div class="i i2" @click="$emit('change', 2)">Normal</div>
			<div class="i i3" @click="$emit('change', 3)">Important</div>
			<div class="i i4" @click="$emit('change', 4)">Critical</div>
		</div>
	</div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";
export default {
	name: "PriorityChange",
	props: {
		priority: {
			type: Number,
			required: true,
		},
	},
	emits: ["change"],
	setup(props) {
		const popup = ref(null);

		const show = ref(false);
		const toggleShow = () => {
			show.value = !show.value;
		};

		const close = (e) => {
			if (e.target != popup.value) show.value = false;
		};

		document.addEventListener("click", close);

		onUnmounted(() => {
			document.addEventListener("click", close);
		});

		return {
			popup,
			show,
			toggleShow,
		};
	},
};
</script>

<style lang="scss" scoped>
.priority {
	font-weight: normal;
	font-size: 12px;
	line-height: 16px;
	color: hsl(0, 0%, 100%);
	border-radius: 30px;
	width: fit-content;
	height: fit-content;
	position: relative;

	&:hover {
		cursor: pointer;
	}

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

.container {
	display: flex;
	flex-direction: column;

	position: absolute;
	z-index: 1;
	background-color: hsl(240, 40%, 98%);
	top: 200%;
	left: -50%;

	width: 100px;
	align-items: center;
	justify-content: space-evenly;

	border-radius: 8px;
	padding: 0;
	text-align: center;
	color: black;

	box-shadow: 0px 8px 10px hsla(232, 41%, 18%, 0.2);
	border: 1px solid #e6e6ff;
	user-select: none;

	> * {
		border-bottom: 1px solid #e6e6ff;
		width: 100%;
		padding: 8px;
	}

	&::before {
		content: "";
		position: absolute;
		top: -10px;
		z-index: -1;
		width: 20px;
		height: 20px;
		transform: rotate(45deg);

		background-color: hsl(240, 40%, 98%);

		border: 1px solid #e6e6ff;
	}

	.i {
		font-weight: bold;
		background-color: hsl(240, 40%, 98%);

		&:first-child {
			border-radius: 8px 8px 0 0;
		}

		&:last-child {
			border-radius: 0 0 8px 8px;
		}

		&.i4 {
			color: hsl(0, 90%, 60%);

			&:hover {
				background-color: hsl(0, 90%, 60%);
				color: #ffffff;
			}
		}
		&.i3 {
			color: hsl(32, 100%, 67%);

			&:hover {
				background-color: hsl(32, 100%, 67%);
				color: #ffffff;
			}
		}
		&.i2 {
			color: hsl(218, 80%, 47%);

			&:hover {
				background-color: hsl(218, 80%, 47%);
				color: #ffffff;
			}
		}
		&.i1 {
			color: hsl(188, 80%, 47%);

			&:hover {
				background-color: hsl(188, 80%, 47%);
				color: #ffffff;
			}
		}
	}
}
</style>
