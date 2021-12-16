<template>
	<div class="tab">
		<slot />
	</div>
</template>

<script>
export default {
	name: "SideTab",
};
</script>

<style lang="scss" scoped>
.tab {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: stretch;
	background-color: hsl(240, 40%, 98%);
	height: 100vh;
	min-width: 320px;
	width: 21vw;
	max-width: 500px;
	overflow: auto;
	padding: 0.6em;
	position: relative;

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
</style>
