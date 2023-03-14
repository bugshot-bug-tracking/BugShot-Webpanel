<template>
	<div class="wrapper">
		<div class="left">
			<slot name="left">
				<div class="top">
					<slot name="l-top" />
				</div>

				<div class="bottom" v-if="$slots['l-bottom']">
					<slot name="l-bottom" />
				</div>
			</slot>
		</div>

		<slot name="center" />

		<div class="right">
			<slot />
		</div>
	</div>
</template>

<style scoped lang="scss">
.wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
	height: 100%;

	.left {
		text-align: left;

		.top {
			font-size: 1.5rem;
			font-weight: 600;
		}

		.bottom {
			font-size: 1rem;
			color: hsl(265, 79%, 54%);
		}
	}

	.right {
		display: inline-flex;
		align-items: center;
		gap: 1.25rem;
	}
}
</style>
