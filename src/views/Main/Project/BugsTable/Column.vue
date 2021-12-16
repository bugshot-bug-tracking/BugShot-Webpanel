<template>
	<div class="status-column" @dragenter.prevent @dragover.prevent>
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
		padding: 0px 50px 10px 10px;
		margin-bottom: 10px;
		border-bottom: 1px solid hsl(263, 79%, 94%);
		text-align: left;
	}

	.items {
		overflow: auto;
		padding: 10px;
		overflow-y: auto;
		scrollbar-gutter: stable;

		scrollbar-color: #cbb0f6 #f1f1f1;
		scrollbar-width: thin;

		/* width */
		&::-webkit-scrollbar {
			width: 8px;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			background: #f1f1f1;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			background: #cbb0f6;
			border-radius: 8px;
		}

		/* Handle on hover */
		&::-webkit-scrollbar-thumb:hover {
			background: #555;
		}
	}
}
</style>
