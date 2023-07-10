<template>
	<div class="wrapper">
		<div class="left">
			<slot name="left">
				<div class="top">
					<n-ellipsis :line-clamp="1">
						<slot name="l-top" />
					</n-ellipsis>
				</div>

				<div class="bottom" v-if="$slots['l-bottom']">
					<n-ellipsis :line-clamp="1">
						<slot name="l-bottom" />
					</n-ellipsis>
				</div>
			</slot>
		</div>

		<div class="center">
			<slot name="center" />
		</div>

		<div class="right">
			<slot />

			<div v-if="$slots['actions']" flex gap-4 items-center>
				<n-divider :vertical="true" min-h-8 />

				<slot name="actions" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.wrapper {
	display: grid;
	grid-template-columns: 2fr 3fr 3fr;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	width: 100%;
	gap: 2rem;

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
		justify-content: flex-end;
	}
}
</style>
