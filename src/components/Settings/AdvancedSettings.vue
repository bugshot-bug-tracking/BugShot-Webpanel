<template>
	<div class="bs-container">
		<span>
			<p font-bold>
				{{ t("show_ui_elements") }}
			</p>

			<p class="black-to-gray text-3.5">All elements</p>
		</span>

		<hr mb4 />

		<span>
			<p font-bold>{{ t("notify_me_on") }}</p>

			<p class="black-to-gray text-3.5">New bugs only</p>
		</span>

		<RouterLink
			:to="{ name: 'settings-advanced' }"
			self-end
			mt4
			capitalize
			font-bold
		>
			<img
				src="/src/assets/icons/edit.svg"
				alt="edit"
				class="black-to-purple"
			/>

			{{ t("edit.settings") }}
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="scss" scoped>
span {
	width: 100%;
	padding: 0.5rem 0;
	display: flex;
	justify-content: space-between;

	p {
		margin: unset;
	}
}
</style>
