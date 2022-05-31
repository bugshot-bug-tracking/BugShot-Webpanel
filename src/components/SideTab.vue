<template>
	<div class="tab bs-scroll s-purple">
		<slot />
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.tab {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: stretch;
	background-color: hsl(240, 40%, 98%);
	height: 100vh;
	min-width: 350px;
	width: 21vw;
	max-width: 500px;
	overflow: auto;
	padding: 0.6em;
	position: absolute;
	right: 0;
	top: 0;
	z-index: 10;
}
</style>
