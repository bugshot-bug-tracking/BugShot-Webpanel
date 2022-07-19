<template>
	<div class="home-layout">
		<section name="sidebar">
			<SettingsNavbar />
		</section>

		<section name="page">
			<RouterView />
		</section>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.home-layout {
	display: grid;
	grid-template-columns: fit-content(20rem) 1.75fr;
	grid-template-rows: 1fr;
	gap: 0px 0px;
	grid-auto-flow: row;
	grid-template-areas: "sidebar page";
	width: 100%;
	height: 100vh;
	max-height: 100vh;
	overflow: hidden;
}

section[name="sidebar"] {
	grid-area: sidebar;
}

section[name="page"] {
	grid-area: page;
}
</style>
