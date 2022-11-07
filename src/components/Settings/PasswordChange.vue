<template>
	<div class="bs-container">
		<div class="bs-input2">
			<label>{{ $t("current_password") }}</label>

			<input
				type="password"
				placeholder="**********"
				disabled
				class="!pr-44"
			/>

			<ChangePasswordModal />
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
