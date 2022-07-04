<template>
	<main>
		<RouterView />
	</main>
</template>

<style lang="scss" scoped>
main {
	grid-area: main;
	position: relative;
	padding: 30px;

	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: center;
	align-items: center;
}
</style>
