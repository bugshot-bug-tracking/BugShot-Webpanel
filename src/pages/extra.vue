<template>
	<main>
		<RouterView />
	</main>

	<img src="/src/assets/images/plugin-trans.svg" class="absolute right-0 self-center z--10" />
</template>

<style lang="scss" scoped>
main {
	display: flex;
	height: 100vh;
	width: 100vw;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>

<route lang="yaml">
meta:
    layout: empty
</route>
