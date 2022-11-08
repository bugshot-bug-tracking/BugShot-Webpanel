<template>
	<div class="home-layout">
		<section class="sidebar">
			<CompanyNavbar />
		</section>

		<section class="page">
			<RouterView />
		</section>
	</div>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";

useMainStore().init();
</script>

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

section.sidebar {
	grid-area: sidebar;
}

section.page {
	grid-area: page;
}
</style>
