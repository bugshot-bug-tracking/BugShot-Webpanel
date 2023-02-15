<template>
	<n-layout :style="{ padding: '2rem', height: '100% ' }">
		<n-layout-content content-style="padding: 1rem;" position="absolute">
			<div gap-8 flex flex-col>
				<h1>{{ $t("first_page.welcome") }}</h1>

				<p>{{ $t("first_page.line_1") }}</p>
				<p>{{ $t("first_page.line_2") }}</p>
				<p>{{ $t("first_page.line_3") }}</p>
			</div>

			<n-button type="primary" @click="openPersonal" mt-16>{{ $t("continue") }}</n-button>
		</n-layout-content>
	</n-layout>
</template>

<script setup lang="ts">
const router = useRouter();

const openPersonal = () => {
	router.push({ name: "new-plans" });
};
</script>

<style lang="scss" scoped>
:deep(.n-layout-scroll-container) {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
