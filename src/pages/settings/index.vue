<template>
	<article class="bs-scroll s-purple">
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

		<div class="component-group bs-bl bs-br" px4 style="height: 100%">
			<div class="group-header">{{ $t("project", 2) }}</div>
			<div class="group-content" style="height: 96%">
				<UserProjects />
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

		<div class="component-group" w-24rem max-h-37rem>
			<div class="group-header">
				{{ $t("extension.extension") }}
			</div>
			<div class="group-content">
				<Clients />
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
}
</style>

<route lang="yaml">
name: settings
</route>
