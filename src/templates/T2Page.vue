<template>
	<div class="wrapper">
		<div class="head">
			<slot name="header" />
		</div>

		<div class="main">
			<slot>
				<slot name="main" />
			</slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 0.25fr 2.75fr;
	gap: 0px 0px;
	grid-auto-flow: row;
	grid-template-areas:
		"head"
		"main";
	height: 100vh;
	max-height: 100vh;

	.head {
		grid-area: head;

		border-bottom: 1px solid hsl(263, 79%, 94%);
		padding: 0 3rem;
		min-height: 5rem;
	}

	.main {
		grid-area: main;

		overflow: auto;
		display: flex;
		flex-direction: column;
	}
}
</style>
