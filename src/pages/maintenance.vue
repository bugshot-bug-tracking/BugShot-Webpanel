<template>
	<main flex flex-col items-center justify-around>
		<n-h1 m-0>{{ $t("maintenance_in_progress") }}</n-h1>

		<p>
			{{ $t("maintenance_in_progress_subtext") }}
		</p>

		<div></div>
	</main>
</template>

<script setup lang="ts"></script>

<style scoped>
main {
	width: 100vw;
	height: 100vh;
}
</style>

<route lang="yaml">
name: maintenance

meta:
    layout: empty
</route>
