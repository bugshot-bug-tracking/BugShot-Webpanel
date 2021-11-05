<template>
	<Sidebar />

	<div class="layout">
		<div class="left">
			<slot name="left" />
		</div>

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
import Sidebar from "./Sidebar.vue";

export default {
	name: "MainLayout",
	components: { Sidebar },
	setup() {},
};
</script>

<style lang="scss" scoped>
.layout {
	display: grid;
	grid-template-columns: minmax(100px, 0.2fr) 1.8fr;
	grid-template-rows: minmax(50px, 0.2fr) 1.8fr;
	gap: 2px 2px;
	grid-template-areas:
		"left top"
		"left main";
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: hsl(240, 40%, 98%);

	> .left {
		grid-area: left;
		background-color: hsl(120, 78%, 96%);
		border-right: 1px solid hsl(263, 79%, 94%);
	}

	> .top {
		grid-area: top;
		display: flex;
		background-color: hsl(300, 100%, 95%);
		border-bottom: 1px solid hsl(263, 79%, 94%);
		padding: 0 50px;
		align-items: center;

		.left {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;

			background-color: pink;

			.title {
				font-size: 2.5rem;
			}

			.sub-title {
				font-size: 1.3rem;
			}
		}

		.right {
			width: 100%;
			background-color: hsl(339, 30%, 75%);
		}
	}

	.main {
		grid-area: main;
	}
}
</style>
