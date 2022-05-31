<template>
	<div class="file-name">{{ name }}</div>
	<div class="controls">
		<div
			v-if="download"
			class="btn download"
			@click="$emit('download', id)"
		/>
		<div class="btn delete" @click="$emit('delete', id)" />
	</div>
</template>

<script setup>
const props = defineProps({
	name: {
		required: true,
		type: String,
	},
	id: {
		required: true,
		type: Number,
	},
	download: {
		required: false,
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["download", "delete"]);
</script>

<style lang="scss" scoped>
.file-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.controls {
	opacity: 0;
	display: inline-flex;

	> * {
		margin: 0px 6px;
	}

	> .btn {
		background-repeat: no-repeat;
		width: 24px;
		height: 24px;

		&.download {
			background-image: url("../../assets/icons/download.svg");
		}

		&.delete {
			background-image: url("../../assets/icons/trash.svg");
		}
	}
}
</style>
