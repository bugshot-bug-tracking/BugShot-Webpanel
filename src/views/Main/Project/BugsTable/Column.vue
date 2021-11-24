<template>
	<div class="status-column">
		<div class="header">
			<slot name="header" />
		</div>

		<div class="items">
			<slot />
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.status-column {
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
		padding: 10px 50px 10px 10px;
		margin-bottom: 10px;
		border-bottom: 1px solid hsl(263, 79%, 94%);
		text-align: left;
	}
	.items {
		overflow: auto;
	}
}
</style>
