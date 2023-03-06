<template>
	<div class="wrapper">
		<div class="container loading" v-if="status === 0">
			<img src="/src/assets/animations/loading.svg" alt="loading" />
			<div class="text">{{ $t("verifying") + "..." }}</div>
		</div>

		<div class="container success" v-if="status === 1">
			<img src="/src/assets/animations/bug_confirmation.gif" alt="loading" />
			<div class="text">{{ $t("success") + "..." }}</div>
		</div>

		<div class="container error" v-if="status === 2">
			<img src="/src/assets/animations/error_bug.gif" alt="loading" />
			<div class="text">{{ $t("error") + "..." }}</div>
		</div>
	</div>

	<img src="/src/assets/images/plugin-trans.svg" alt="half-logo" class="decoration-right" />
</template>

<script setup lang="ts">
const router = useRouter();

const route = useRoute();

const status = ref(0);

if (route.query.status === "success") {
	status.value = 1;
} else {
	status.value = 2;
}

onMounted(() => {
	if (route.query.status === "success") {
		status.value = 1;
	} else {
		status.value = 2;
	}

	if (route.query.org_id) {
		setTimeout(() => {
			router.replace({ name: "organization-payments", params: { id: route.query.org_id } });
		}, 4000);
	} else {
		setTimeout(() => {
			router.replace({ name: "home" });
		}, 4000);
	}
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	width: 100vw;
	height: 100vh;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 500px;
		height: 400px;
		background: #ffffff;
		box-shadow: 0px 2px 4px #1a204029;
		border: 1px solid #eee5fc;
		border-radius: 8px;
		gap: 40px;
		padding: 10px;

		.text {
			font-size: 1.7rem;
			font-weight: bold;
		}

		img {
			width: 200px;
			height: 200px;
		}

		&.loading {
			color: #5916b9;
		}

		&.success {
			color: #15be80;
		}

		&.error {
			color: #f53d3d;

			img {
				width: 280px;
			}
		}
	}
}
.decoration-right {
	position: absolute;
	right: 0;
	top: 50vh;
	transform: translate(0, -50%);
	z-index: -100;
}
</style>

<route lang="yaml">
name: payment-status

meta:
    layout: empty
</route>
