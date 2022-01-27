<template>
	<div class="wrapper">
		<div class="container loading" v-if="status === 0">
			<img src="../../assets/global/loading.svg" alt="loading" />
			<div class="text">Processing...</div>
		</div>

		<div class="container success" v-if="status === 1">
			<img src="../../assets/gif/bug_confirmation.gif" alt="loading" />
			<div class="text">Success!</div>
		</div>

		<div class="container error" v-if="status === 2">
			<img src="../../assets/gif/error_bug.gif" alt="loading" />
			<div class="text">Error!</div>
		</div>
	</div>

	<img
		src="../../assets/extern/plugin-trans.svg"
		alt="half-logo"
		class="decoration-right"
	/>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import axios from "axios";
import { useRoute } from "vue-router";
import router from "../../router";
export default {
	props: {
		user_id: {
			required: true,
			type: String,
		},
		token: {
			required: true,
			type: String,
		},
	},

	setup(props) {
		// 0 means loading, 1 means success, 2 means error
		const status = ref(0);

		const route = useRoute();

		const verify = () => {
			status.value = 0;

			axios
				.get(
					`/auth/email/verify/${props.user_id}/${props.token}?expires=${route.query.expires}&signature=${route.query.signature}`
				)
				.then((response) => {
					status.value = 1;

					setTimeout(() => {
						router.push({ name: "Login" });
					}, 3000);
				})
				.catch((error) => {
					console.log(error);

					status.value = 2;

					setTimeout(() => {
						router.push({ name: "Login" });
					}, 5000);
				});
		};

		verify();

		return {
			status,
			verify,
		};
	},
};
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
