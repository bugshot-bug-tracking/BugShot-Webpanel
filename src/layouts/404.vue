<template>
	<main>
		<div>
			<img src="/src/assets/animations/bugshot_404_error.gif" alt="404" />

			<span>
				{{ t("problem_encountered") }}
			</span>

			<RouterLink class="bs-btn green" to="/">
				{{ t("go_to_home") }}
			</RouterLink>
		</div>
	</main>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style scoped lang="scss">
div {
	display: flex;
	width: 100vw;
	height: 100vh;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 2.5rem;

	span {
		color: #5916b9;
		font-size: 1.875rem;
		font-weight: bold;
	}
}
</style>
