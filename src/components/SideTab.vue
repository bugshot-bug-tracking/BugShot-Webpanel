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

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
