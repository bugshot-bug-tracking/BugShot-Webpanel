<template>
	<div class="wrapper">
		<div class="people">
			<div class="item" v-for="item in list" :key="item.id">
				<div
					class="avatar"
					:style="{
						'background-color':
							colors[
								(item.user.attributes.first_name.charCodeAt(0) +
									item.user.attributes.last_name.charCodeAt(
										0
									)) %
									7
							],
					}"
				>
					{{
						item.user.attributes.first_name[0] +
						item.user.attributes.last_name[0]
					}}
				</div>
			</div>

			<a class="add" @click="$emit('add')">
				<img src="../assets/icons/add.svg" alt="Add button" />
			</a>
		</div>
	</div>
</template>

<script setup>
import colors from "/src/util/colors";

const props = defineProps({
	list: {
		type: Array,
		required: true,
		default: [],
	},
});

const emit = defineEmits(["add"]);
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
}

.people {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
	flex-wrap: wrap;
}

.item {
	display: flex;
	align-items: center;
	gap: 8px;

	.avatar {
		color: hsl(0, 0%, 100%);
		background-color: hsl(265, 80%, 50%);
		font-size: 12px;
		padding: 8px;
		border-radius: 25px;
		height: 32px;
		width: 32px;

		text-align: center;
		text-transform: uppercase;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		text-align: left;

		.name {
			font-weight: bold;
		}
		.email {
			word-break: normal;
		}
	}
}

.add {
	cursor: pointer;
	transition: 0.2s;

	img {
		// color: #18d992;
		filter: brightness(0) saturate(1) invert(63%) sepia(74%) saturate(493%)
			hue-rotate(104deg) brightness(96%) contrast(88%);
	}

	&:hover {
		img {
			// color: #7a2ee6;
			filter: brightness(0) saturate(1) invert(18%) sepia(72%)
				saturate(5384%) hue-rotate(263deg) brightness(94%) contrast(92%);
		}
	}
}
</style>
