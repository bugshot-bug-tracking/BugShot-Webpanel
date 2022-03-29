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

		<div class="main bs-scroll s-purple">
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
	position: relative;

	> .top {
		grid-area: top;
		display: flex;
		border-bottom: 1px solid hsl(263, 79%, 94%);
		padding: 0 50px;
		align-items: center;
		overflow: hidden;
		min-height: 80px;

		.left {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			min-width: 300px;
			min-height: 80px;
			justify-content: center;

			.title {
				font-size: 2rem;
				font-weight: 600;
			}

			.sub-title {
				font-size: 1rem;
				color: hsl(265, 79%, 54%);
			}
		}

		.right {
			width: 100%;
			display: inline-flex;
			justify-content: flex-end;
			align-items: center;
			align-content: center;
			gap: 20px;
		}
	}

	.main {
		grid-area: main;
		overflow: auto;
	}
}
@media only screen and (min-width: 50px) {
	.layout > .top .left .title {
		font-size: 1rem;
	}
	.layout > .top .left .sub-title {
		font-size: 0.7rem;
	}
}
@media only screen and (min-width: 1400px) {
	.layout > .top .left .title {
		font-size: 1.5rem;
	}
	.layout > .top .left .sub-title {
		font-size: 1rem;
	}
}
</style>
