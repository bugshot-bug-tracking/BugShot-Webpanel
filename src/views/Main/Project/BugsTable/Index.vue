<template>
	<div class="bugs-table c-scroll s-purple">
		<slot />
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.bugs-table {
	width: 100%;
	height: 100%;
	position: relative;
	padding: 30px;
	display: flex;
}
</style>
