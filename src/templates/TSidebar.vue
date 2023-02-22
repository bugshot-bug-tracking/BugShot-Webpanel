<template>
	<div class="wrapper" :class="{ close: sidebar.closed }">
		<div class="head">
			<slot name="header" />
		</div>

		<div class="main">
			<slot>
				<slot name="main" />
			</slot>
		</div>

		<div class="footer" v-if="$slots['footer']">
			<slot name="footer" />
		</div>

		<div class="hide" @click="sidebar.toggle">
			<img src="/src/assets/icons/caret_down.svg" />
		</div>
	</div>
</template>

<script setup lang="ts">
const sidebar = reactive({
	closed: false,
	toggle: () => {
		sidebar.closed = !sidebar.closed;
	},
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 0.2fr 2.6fr 0.2fr;
	grid-auto-flow: row;
	grid-template-areas:
		"head"
		"main"
		"footer";

	border-right: 1px solid hsl(263, 79%, 94%);
	position: relative;
	min-width: 15rem;
	max-width: 20vw;
	height: 100%;
	max-height: 100vh;
	transition: 0.3s;

	.head {
		grid-area: head;
	}

	.main {
		grid-area: main;

		overflow: auto;
	}

	.footer {
		grid-area: footer;

		border-top: 1px solid hsl(263, 79%, 94%);
		min-height: 4rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.5rem 0;
	}

	> .hide {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: -1.75rem;
		top: 1.5rem;
		background-color: #f8f8fc;
		width: 1.75rem;
		height: 2.75rem;
		border-radius: 0 0.375rem 0.375rem 0;
		border: 1px solid #ede4fc;
		border-left: 1px solid #f8f8fc;
		z-index: 1;

		> img {
			user-select: none;
			transform: rotateZ(90deg);
			width: 1.75rem;
			height: 1.75rem;
			color: #7a2ee6;
			filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
				hue-rotate(263deg) brightness(94%) contrast(92%);
		}

		&:hover {
			cursor: pointer;
			> img {
				color: #18d992;

				filter: brightness(0) saturate(1) invert(63%) sepia(74%) saturate(493%)
					hue-rotate(104deg) brightness(96%) contrast(88%);
			}
		}
	}
}

.wrapper.close {
	width: 0.5rem;
	min-width: 0.5rem;

	.hide > img {
		transform: rotateZ(-90deg);
	}

	> .head,
	.main,
	.footer {
		display: none;
	}
}
</style>
