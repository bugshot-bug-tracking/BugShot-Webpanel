<template>
	<div class="modal-wrapper2">
		<div class="modal-header2" v-if="$slots['header'] || $slots['header-text']">
			<slot name="header">
				<n-h3>
					<slot name="header-text">[PH] Header</slot>
				</n-h3>

				<Icon-X
					button
					alternative
					size="2rem"
					color="var(--bs-purple)"
					@click="$emit('close')"
					v-if="!noCloseButton"
				/>
			</slot>
		</div>

		<slot name="content">
			<n-scrollbar max-h-80vh>
				<div class="modal-content2" p-1 pr-2>
					<slot />
				</div>
			</n-scrollbar>
		</slot>

		<footer v-if="$slots['footer']">
			<slot name="footer" />
		</footer>
	</div>
</template>

<script setup lang="ts">
defineProps({
	noCloseButton: {
		required: false,
		type: Boolean,
		default: false,
	},
});

defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.modal-wrapper2 {
	background: white;
	border-radius: 0.5rem;
	padding: 1rem;
	min-width: 28rem;
	max-height: 90vh;
	box-shadow: 0 0.125rem 0.25rem hsla(0, 0%, 0%, 0.161);
	overflow: hidden;
}

.modal-header2 {
	border-bottom: 0.125rem solid #eee5fc;
	padding-bottom: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

h3 {
	margin: unset;
}

.modal-content2 {
	margin: 1rem 0;
}
</style>
