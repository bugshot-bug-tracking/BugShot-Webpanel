<template>
	<Navbar />

	<div class="sidebar-container" :class="{ close: sidebarVisibility }">
		<div class="sidebar-wrapper">
			<router-view name="sidebar" />
		</div>

		<div class="hide" @click="sidebarVisibility = !sidebarVisibility">
			<img src="/src/assets/icons/caret-down-fill.svg" />
		</div>
	</div>

	<router-view />
</template>

<script>
// @ is an alias to /src
import Navbar from "./Navbar.vue";
import store from "../store";
import { ref } from "@vue/reactivity";

export default {
	name: "Home",
	components: { Navbar },
	setup() {
		store.dispatch("start");

		const sidebarVisibility = ref(false);

		return {
			sidebarVisibility,
		};
	},
};
</script>

<style lang="scss" scoped>
.sidebar-container {
	position: relative;
	border-right: 1px solid hsl(263, 79%, 94%);
	height: 100vh;

	.sidebar-wrapper {
		width: 12vw;
		min-width: 200px;
		max-width: 300px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	> .hide {
		position: absolute;
		right: -23px;
		top: 24px;
		background-color: #f8f8fc;
		width: 24px;
		height: 48px;
		border-radius: 0 10px 10px 0;
		border: 1px solid #ede4fc;
		border-left: 1px solid #f8f8fc;
		display: flex;
		z-index: 1;

		> img {
			user-select: none;
			transform: rotateZ(90deg);
			width: 18px;
			filter: brightness(0) saturate(1) invert(18%) sepia(72%)
				saturate(5384%) hue-rotate(263deg) brightness(94%) contrast(92%);
		}

		&:hover {
			cursor: pointer;

			> img {
				filter: brightness(0) saturate(1) invert(63%) sepia(74%)
					saturate(493%) hue-rotate(104deg) brightness(96%)
					contrast(88%);
			}
		}
	}
	&.close {
		> .hide > img {
			transform: rotateZ(-90deg);
		}
		width: 10px;

		> .sidebar-wraper {
			display: none;
		}
	}
}
</style>

<style lang="scss">
.btn {
	&.bs {
		border-radius: 22px;
		letter-spacing: 0.14px;
		font-size: 16px;
		padding: 8px 16px;
		box-shadow: none;

		&.bf-green {
			background: hsl(158, 80%, 47%);
			color: hsl(0, 0%, 100%);

			&:hover {
				background: hsl(158, 80%, 41%);
			}
		}

		&.be-green {
			background: transparent;
			border: 2px solid hsl(158, 80%, 47%);
			color: hsl(158, 80%, 47%);
			font-weight: bold;

			&:hover {
				background: hsl(158, 79%, 87%);
			}
		}

		&.bf-purple {
			background: hsl(265, 79%, 54%);
			color: hsl(0, 0%, 100%);

			&:hover {
				background: hsl(265, 80%, 41%);
			}
		}

		&.be-purple {
			background: transparent;
			border: 2px solid hsl(265, 79%, 54%);
			color: hsl(265, 79%, 54%);
			font-weight: bold;

			&:hover {
				background: hsl(265, 79%, 92%);
			}
		}

		&.bf-red {
			background: hsl(0, 88%, 58%);
			color: hsl(0, 0%, 100%);

			&:hover {
				background: hsl(0, 88%, 45%);
			}
		}

		&.be-red {
			background: transparent;
			border: 2px solid hsl(0, 88%, 58%);
			color: hsl(0, 88%, 58%);
			font-weight: bold;

			&:hover {
				background: hsla(0, 88%, 58%, 10%);
			}
		}
	}
}
</style>

<style lang="scss">
.bs-scroll {
	overflow: auto;
	overflow-y: auto;
	scrollbar-gutter: stable;

	scrollbar-width: thin;

	/* width */
	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
		border-radius: 8px;
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	&.s-purple {
		scrollbar-color: hsl(263, 80%, 83%) hsl(0, 0%, 95%);

		&::-webkit-scrollbar-thumb {
			background: hsl(263, 80%, 83%);
		}

		&::-webkit-scrollbar-thumb:hover {
			background: hsl(263, 80%, 73%);
		}
	}

	&.s-green {
		scrollbar-color: hsl(158, 80%, 47%) hsl(240, 100%, 95%);

		&::-webkit-scrollbar-thumb {
			background: hsl(158, 80%, 47%);
		}

		&::-webkit-scrollbar-thumb:hover {
			background: hsl(158, 80%, 37%);
		}
	}
}

.v-select {
	--vs-controls-color: #7a2de6;
	--vs-border-color: #7a2de6;

	--vs-dropdown-option--active-bg: #eee5fc;
	--vs-dropdown-option--active-color: black;
	--vs-dropdown-max-height: 125px;

	.vs__dropdown-menu {
		@extend .bs-scroll;
		@extend .s-purple;
	}
}
</style>

<style lang="scss">
.disabled {
	opacity: 0.5 !important;

	&:hover {
		opacity: 0.5 !important;
		filter: none !important;
	}
}

.disabled-overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0.5;
	top: 0;
	left: 0;
	background-color: white;
}

.default-form {
	width: 100%;
	padding: 0 5%;
}
</style>

<style lang="scss">
.bs-input {
	width: 100%;
	display: flex;
	position: relative;
	align-items: center;
	margin: auto;

	input {
		border: 1px solid hsl(264, 78%, 77%);
		border-radius: 8px;
		width: 100%;
		padding: 10px;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: hsl(265, 79%, 41%);
			outline-color: hsl(265, 79%, 41%);
		}
	}

	textarea {
		border: 1px solid hsl(264, 78%, 77%);
		border-radius: 8px;
		width: 100%;
		padding: 10px;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: hsl(265, 79%, 41%);
			outline-color: hsl(265, 79%, 41%);
		}
	}

	&.w-icon {
		input {
			padding-right: 40px;
		}

		img {
			width: 20px;
			position: absolute;
			right: 12px;
		}
	}
}
</style>

<style lang="scss">
.bs-priority {
	font-weight: normal;
	font-size: 12px;
	line-height: 16px;
	color: hsl(0, 0%, 100%);
	border-radius: 30px;
	width: fit-content;
	height: fit-content;
	position: relative;
	padding: 3px 10px;
	user-select: none;

	&.p1 {
		background-color: hsl(188, 80%, 47%);
	}

	&.p2 {
		background-color: hsl(218, 80%, 47%);
	}

	&.p3 {
		background-color: hsl(32, 100%, 67%);
	}

	&.p4 {
		background-color: hsl(0, 90%, 60%);
	}
}
</style>

<style lang="scss">
.bs-to-green {
	// color:#18D992;
	filter: brightness(0) saturate(1) invert(63%) sepia(74%) saturate(493%)
		hue-rotate(104deg) brightness(96%) contrast(88%);
}

.bs-to-purple {
	// color:#7A2EE6;
	filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
		hue-rotate(263deg) brightness(94%) contrast(92%);
}

.bs-to-red {
	// color: #F23838;
	filter: brightness(0) saturate(1) invert(46%) sepia(28%) saturate(5216%)
		hue-rotate(331deg) brightness(87%) contrast(121%);
}

.bs-to-gray {
	// color: #9BA5D7;
	filter: brightness(0) saturate(1) invert(73%) sepia(14%) saturate(897%)
		hue-rotate(194deg) brightness(90%) contrast(86%);
}
</style>

<style lang="scss">
@import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";

.dp__select {
	color: #18b984;
}
</style>
