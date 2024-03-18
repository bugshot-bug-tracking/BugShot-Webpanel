<template>
	<n-scrollbar max-h-100vh pr-4 x-scrollable>
		<article>
			<div>
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
			</div>

			<div>
				<div class="component-group">
					<div class="group-header">
						{{ $t("language_options") }}
					</div>
					<div class="group-content">
						<LanguageChange />
					</div>
				</div>

				<div class="component-group">
					<div class="group-header">
						{{ $t("user_settings.main_page.advanced.advanced_and_notifications") }}
					</div>
					<div class="group-content">
						<AdvancedSettings />
					</div>
				</div>
			</div>
		</article>
	</n-scrollbar>
</template>

<style lang="scss" scoped>
article {
	display: grid;
	grid-template-columns: repeat(auto-fit, 32rem);
	grid-auto-flow: dense;
	padding: 2.5rem;
	padding-right: 1.5rem;
	gap: 2rem;
}
</style>

<route lang="yaml">
name: settings
</route>
