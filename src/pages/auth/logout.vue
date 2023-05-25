<template></template>

<script setup lang="ts">
const router = useRouter();
onMounted(() => {
	router.push({ name: "login" });
});
</script>

<route lang="yaml">
name: logout
</route>
