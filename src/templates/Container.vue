<template>
	<section class="bs-container">
		<header class="bs-bb" v-if="$slots['header'] || $slots['title']">
			<slot name="header">
				<b>
					<slot name="title" />
				</b>

				<slot name="after-title" />
			</slot>
		</header>

		<slot />

		<footer v-if="$slots['footer']">
			<slot name="footer" />
		</footer>
	</section>
</template>

<style lang="scss" scoped>
section {
	max-height: 100%;
}

header {
	padding-bottom: 1rem;
	display: flex;
	align-items: center;
}

footer {
	border-top: 1px solid #eee5fc;
	padding-top: 0.5rem;
}
</style>
