<template>
	<header z-2>
		<Navbar />
	</header>

	<RouterView />
</template>

<style lang="scss">
.main-grid {
	display: grid;
	grid-template-columns: fit-content(22rem) 1.75fr;
	grid-template-rows: 1fr;
	gap: 0;
	grid-auto-flow: row;
	grid-template-areas: "sidebar page";
	width: 100%;
	height: 100vh;
	max-height: 100vh;
	overflow: hidden;

	.grid-sidebar {
		grid-area: sidebar;
	}

	.grid-page {
		grid-area: page;
	}
}

.main-loading {
	margin: auto;
}

.main-empty {
	margin: auto;
	height: 100%;

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		height: 100%;

		h1 {
			font-weight: bold;
			color: #7a2ee6;
		}
	}
}
</style>
