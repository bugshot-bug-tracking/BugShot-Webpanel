<template>
	<Modal :show="show" @close="close"> </Modal>
</template>

<script>
import { ref } from "@vue/reactivity";
import Modal from "../../../components/Modal.vue";
import { nextTick, onMounted } from "@vue/runtime-core";
export default {
	name: "EditProjectModal",
	props: {
		id: {
			required: true,
			type: String,
		},
	},
	emits: ["close"],
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

<style></style>
