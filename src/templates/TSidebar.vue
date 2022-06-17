<template>
	<div class="wrapper" :class="{ close: minimize }">
		<div class="head">
			<slot name="header" />
		</div>

		<div class="main">
			<slot>
				<slot name="main" />
			</slot>
		</div>

		<div class="footer">
			<slot name="footer" />
		</div>

		<div class="hide" @click="toggle">
			<img src="/src/assets/icons/caret-down-fill.svg" />
		</div>
	</div>
</template>

<script setup lang="ts">
const minimize = ref(false);

const toggle = () => {
	minimize.value = !minimize.value;
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 0.2fr 2.6fr 0.2fr;
	gap: 0px 0px;
	grid-auto-flow: row;
	grid-template-areas:
		"head"
		"main"
		"footer";

	border-right: 1px solid hsl(263, 79%, 94%);
	position: relative;
	min-width: 250px;
	max-width: 20vw;
	height: 100%;
	max-height: 100vh;

	.head {
		grid-area: head;

		// border-bottom: 1px solid hsl(263, 79%, 94%);
	}

	.main {
		grid-area: main;

		border-bottom: 1px solid hsl(263, 79%, 94%);
		overflow: auto;
	}

	.footer {
		grid-area: footer;

		min-height: 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px 0;
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
}

.wrapper.close {
	width: 10px;
	min-width: 10px;

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
