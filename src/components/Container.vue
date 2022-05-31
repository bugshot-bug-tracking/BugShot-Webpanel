<template>
	<div class="content-container">
		<slot />
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.content-container {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	background: hsl(0, 0%, 100%) 0% 0% no-repeat padding-box;
	border: 1px solid hsl(240, 100%, 95%);
	border-radius: 16px;
	padding: 20px;
	box-shadow: hsla(0, 0%, 0%, 0.35) 10px 10px 10px -11px;
	margin-bottom: 1.25em;
	position: relative;
}
</style>
