<!-- Transform thin into a proper template -->
<template>
	<div class="group-container">
		<div class="top">
			<div class="text-left">
				<slot name="top-left"> [PH] Group </slot>
			</div>
			<div class="text-right">
				<slot name="top-right"> </slot>
			</div>
		</div>

		<div class="items">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.group-container {
	display: flex;
	flex-direction: column;
	padding: 1rem 2rem;

	> .top {
		display: flex;
		justify-content: space-between;
		width: 22rem;
		border-bottom: 1px solid hsl(264, 78%, 77%);
		padding: 0.5rem;
		padding-top: 0;
		align-items: center;

		> .text-left {
			font-size: 1.25rem;
			font-weight: 600;
			text-align: left;
		}

		> .text-right {
			font-size: 1.125rem;
			color: hsl(265, 79%, 54%);
			min-width: 7.5rem;
		}
	}

	> .items {
		display: flex;
		flex-wrap: wrap;
		padding: 0.5rem;
	}
}
</style>
