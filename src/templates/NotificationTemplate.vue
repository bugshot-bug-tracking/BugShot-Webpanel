<template>
	<div class="notification-entry">
		<div class="notification-header">
			<slot name="header" />
		</div>

		<div class="notification-footer">
			<slot name="footer" />
		</div>

		<div class="notification-action">
			<slot name="action" />

			<n-tooltip trigger="hover" placement="right">
				<template #trigger>
					<n-button
						text
						size="small"
						type="tertiary"
						style="padding: 0; align-self: flex-start"
						@click="emit('delete')"
					>
						<template #icon>
							<Icon-X size="16" />
						</template>
					</n-button>
				</template>
				<n-text style="font-size: 0.875rem"> Delete notification </n-text>
			</n-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(["delete"]);
</script>

<style lang="scss">
.notification-entry {
	display: grid;
	grid-template-areas:
		"header action"
		"footer action";
	grid-template-columns: 1fr auto;
	grid-template-rows: auto 1fr;
	gap: 0.25rem 1rem;
}

.notification-header {
	grid-area: header;
}

.notification-footer {
	grid-area: footer;
	font-size: 0.875rem;
}

.notification-action {
	grid-area: action;
	display: flex;
	align-items: center;
	height: 100%;
	width: 100%;
	gap: 0.5rem;

	button {
		padding: 0.5rem;
	}
}
</style>
