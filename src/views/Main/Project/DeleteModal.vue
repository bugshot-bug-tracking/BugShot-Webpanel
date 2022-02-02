<template>
	<Modal :show="show" @close="close">
		<div class="wrapper">
			<span class="text">
				<p>Are you sure you want to delete</p>
				<p>
					<b> {{ project?.attributes.designation }}</b> ?
				</p>
			</span>

			<div class="actions">
				<a class="btn bs bf-red" @click.prevent="deleteProject">Yes</a>
				<a class="btn bs be-green" @click="close">No</a>
			</div>
		</div>
	</Modal>
</template>

<script>
import { ref } from "@vue/reactivity";
import Modal from "../../../components/Modal.vue";
import { computed, nextTick, onMounted } from "@vue/runtime-core";
import store from "../../../store";
export default {
	name: "DeleteProjectModal",
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

		const project = computed(() => {
			return store.getters.getProjectById(props.id);
		});

		const deleteProject = () => {
			store.dispatch("deleteProject", props.id);
		};

		return {
			show,
			close,
			project,
			deleteProject,
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
