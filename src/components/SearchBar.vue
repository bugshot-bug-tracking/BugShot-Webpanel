<template>
	<div v-if="false">
		<n-input
			placeholder="Search"
			round
			text-start
			v-model:value="searchTerm"
			size="large"
			clearable
		>
			<template #prefix>
				<img src="/src/assets/icons/search.svg" alt="Search" />
			</template>
		</n-input>
	</div>
</template>

<script setup lang="ts">
const searchTerm = ref("");

watchEffect(() => {
	if (searchTerm.value.length < 3) return console.log("search term is < 3");

	console.log(searchTerm.value);
});
</script>

<style scoped></style>
