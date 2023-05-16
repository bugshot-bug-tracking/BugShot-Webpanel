<template>
	<n-icon size="24">
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
			<path
				v-if="!filled"
				d="M120 896V444q-17-11-28.5-28T80 376V256q0-33 23.5-56.5T160 176h640q33 0 56.5 23.5T880 256v120q0 23-11.5 40T840 444v452q0 33-23.5 56.5T760 976H200q-33 0-56.5-23.5T120 896Zm80-440v440h560V456H200Zm600-80V256H160v120h640ZM360 656h240v-80H360v80ZM200 896V456v440Z"
			/>

			<path
				v-else
				d="M120 896V444q-17-11-28.5-28T80 376V256q0-33 23.5-56.5T160 176h640q33 0 56.5 23.5T880 256v120q0 23-11.5 40T840 444v452q0 33-23.5 56.5T760 976H200q-33 0-56.5-23.5T120 896Zm680-520V256H160v120h640ZM360 656h240v-80H360v80Z"
			/>
		</svg>
	</n-icon>
</template>

<script setup lang="ts">
defineProps({
	filled: Boolean,
});
</script>
