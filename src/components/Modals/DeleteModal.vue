<template>
	<Modal :show="show" @close="close">
		<div class="wrapper">
			<span class="text">
				<p>Are you sure you want to delete</p>
				<p>
					<b> {{ text }}</b> ?
				</p>
			</span>

			<div class="actions">
				<a class="btn bs bf-red" @click.prevent="$emit('delete')"
					>Yes</a
				>
				<a class="btn bs be-green" @click="close">No</a>
			</div>
		</div>
	</Modal>
</template>

<script>
import { ref } from "@vue/reactivity";
import { nextTick, onMounted } from "@vue/runtime-core";
import Modal from "../Modal.vue";
export default {
	props: {
		text: {
			required: true,
			type: String,
		},
	},
	emits: ["close", "delete"],
	components: { Modal },
	setup(props, context) {
		const show = ref(false);

		onMounted(() => {
			show.value = true;
		});

		const close = () => {
			show.value = false;

			nextTick(() => {
				context.emit("close");
			});
		};

		return {
			show,
			close,
		};
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 400px;
	height: 200px;
	justify-content: center;
	gap: 40px;
	padding: 20px;

	.actions {
		display: flex;
		align-items: center;
		gap: 40px;
	}

	.text {
		white-space: pre-line;
		margin: unset;
	}
}
</style>
