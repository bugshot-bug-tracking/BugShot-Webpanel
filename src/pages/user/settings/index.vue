<template>
	<article class="bs-scroll">
		<div class="component-group">
			<div class="group-header">
				{{ $t("profile_informations") }}
			</div>
			<div class="group-content">
				<UserSettings />
			</div>
		</div>

		<div class="component-group">
			<div class="group-header">{{ $t("password") }}</div>
			<div class="group-content">
				<PasswordChange />
			</div>
		</div>

		<div class="component-group">
			<div class="group-header">
				{{ $t("language_options") }}
			</div>
			<div class="group-content">
				<LanguageChange />
			</div>
		</div>

		<div class="component-group" w-24rem v-if="false">
			<div class="group-header">
				{{ $t("advanced_settings") }}
			</div>
			<div class="group-content">
				<AdvancedSettings />
			</div>
		</div>

		<div class="component-group" w-24rem>
			<div class="group-header">
				{{ $t("extension.extension", 2) }}
			</div>
			<div class="group-content">
				<Clients />
			</div>
		</div>

		<div class="component-group" w-24rem>
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
	column-gap: 1rem;
	align-content: flex-start;
}
</style>

<route lang="yaml">
name: settings
</route>
