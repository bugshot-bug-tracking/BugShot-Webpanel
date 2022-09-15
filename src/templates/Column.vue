<template>
	<div class="column-wrapper" @dragenter.prevent @dragover.prevent>
		<div class="header" v-if="$slots['header']">
			<slot name="header" />
		</div>

		<div class="main bs-scroll">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.column-wrapper {
	display: flex;
	position: relative;
	flex-direction: column;
	height: 100%;
	padding: 15px;
	width: 100%;
	border-right: 1px solid hsl(263, 79%, 94%);

	&:last-of-type {
		border-right: 0;
	}

	> .header {
		padding: 0px 10px 10px 10px;
		margin-bottom: 10px;
		border-bottom: 1px solid hsl(263, 79%, 94%);
		text-align: left;
	}

	.main {
		height: 100%;
		overflow: auto;
		padding: 10px;
	}
}
</style>
