<template>
	<div class="wrapper">
		<img src="/src/assets/gif/bugshot_404_error.gif" alt="404" />
		<div class="text">{{ $t("problem_encountered") }}</div>

		<router-link
			class="btn bs bf-green"
			:to="{
				name: 'Home',
			}"
		>
			{{ $t("go_to_home") }}
		</router-link>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	width: 100vw;
	height: 100vh;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 40px;

	.text {
		color: #5916b9;
		font-size: 1.7rem;
		font-weight: bold;
	}
}
</style>
