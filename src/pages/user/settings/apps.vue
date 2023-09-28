<template>
	<article class="bs-scroll">
		<div class="component-group" w-120>
			<div class="group-header">
				{{ $t("extension.extension", 2) }}
			</div>
			<div class="group-content">
				<Clients />
			</div>
		</div>

		<div class="component-group" w-120>
			<div class="group-header">
				{{ $t("interface.interface") }}
			</div>
			<div class="group-content">
				<Zapier />
			</div>
		</div>
	</article>
</template>

<style lang="scss" scoped>
article {
	display: flex;
	width: 100%;
	height: 100%;
	padding: 2.5rem;
	flex-wrap: wrap;
	flex-direction: column;
	max-height: 100vh;
	column-gap: 2rem;
	align-content: flex-start;
}
</style>
<route lang="yaml">
name: settings-apps
</route>
