<template>
	<div class="layout">
		<div class="top">
			<div class="left">
				<div class="title">
					<slot name="title" />
				</div>

				<div class="sub-title">
					<slot name="sub-title" />
				</div>
			</div>

			<div class="right">
				<slot name="top" />
			</div>
		</div>

		<div class="main">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: "MainLayout",
	setup() {},
};
</script>

<style lang="scss" scoped>
.layout {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: minmax(50px, 0.2fr) 2fr;
	gap: 2px 2px;
	grid-template-areas:
		"top"
		"main";
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: hsl(240, 40%, 98%);

	> .top {
		grid-area: top;
		display: flex;
		border-bottom: 1px solid hsl(263, 79%, 94%);
		padding: 0 50px;
		align-items: center;

		.left {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;

			.title {
				font-size: 2.5rem;
				font-weight: 600;
			}

			.sub-title {
				font-size: 1.3rem;
				color: hsl(265, 79%, 54%);
			}
		}

		.right {
			width: 100%;
			background-color: hsl(339, 30%, 75%);
			display: inline-flex;
		}
	}

	.main {
		grid-area: main;
	}
}
</style>
