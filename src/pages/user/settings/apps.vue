<template>
	<n-scrollbar max-h-100vh pr-4 x-scrollable>
		<article>
			<div class="component-group">
				<div class="group-header">
					{{ $t("extension.extension", 2) }}
				</div>
				<div class="group-content">
					<Clients />
				</div>
			</div>

			<div class="component-group">
				<div class="group-header">
					{{ $t("interface.interface") }}
				</div>
				<div class="group-content">
					<Zapier />
				</div>
			</div>
		</article>
	</n-scrollbar>
</template>

<style lang="scss" scoped>
article {
	display: grid;
	grid-template-columns: repeat(auto-fit, 27.5rem);
	grid-auto-flow: dense;
	padding: 2.5rem;
	padding-right: 1.5rem;
	gap: 2rem;
}
</style>

<route lang="yaml">
name: settings-apps
</route>
