<template>
	<Modal :show="show" @close="$emit('close')" :no_close_button="true">
		<div class="process">
			<div class="loading" v-if="state === 0">
				<img src="../../assets/global/loading.svg" alt="loading" />
			</div>

			<div class="success" v-if="state === 1">
				<img
					src="../../assets/gif/bug_confirmation.gif"
					alt="Success"
				/>

				<div>{{ $t("success") + "!" }}</div>

				<span v-if="message">{{ message }} </span>
			</div>

			<div class="error" v-if="state === 2">
				<img src="../../assets/gif/error_bug.gif" alt="error" />

				<div>{{ $t("error") + "!" }}</div>

				<span v-if="message">{{ message }} </span>
			</div>
		</div>
	</Modal>
</template>

<script setup>
import Modal from "../Modal.vue";

const props = defineProps({
	show: {
		required: true,
		type: Boolean,
		description: "Determine if the modal is visible or not",
	},

	state: {
		required: true,
		type: Number,
		description: "Determine if the state is loading, success or error",
	},

	message: {
		required: false,
		type: String,
		default: null,
		description: "Mesage shown in the success/error state",
	},
});
</script>

<style lang="scss" scoped>
.process {
	inset: 0;
	z-index: 10;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 350px;
	height: 390px;
	padding: 20px;

	> * {
		width: 100%;
		height: 100%;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.success {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		gap: 20px;

		img {
			height: 50%;
		}

		> div {
			color: #5916b9;
			font-weight: bold;
			font-size: 32px;
			width: 100%;
		}
	}

	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		gap: 20px;

		img {
			height: 50%;
		}

		div {
			color: hsl(0, 88%, 58%);
			font-weight: bold;
			font-size: 32px;
			width: 100%;
		}
	}

	span {
		font-size: 18px;
		text-transform: lowercase;
		width: 100%;
		border-top: 1px solid #eee5fc;
		padding: 20px;

		&:first-letter {
			text-transform: uppercase;
		}
	}
}
</style>
