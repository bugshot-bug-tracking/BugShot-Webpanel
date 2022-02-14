<template>
	<div class="wrapper">
		<div class="people">
			<div class="item" v-for="item in list" :key="item.id">
				<div
					class="avatar"
					:style="{
						'background-color':
							colors[
								(item.attributes.first_name.charCodeAt(0) +
									item.attributes.last_name.charCodeAt(0)) %
									7
							],
					}"
				>
					{{
						item.attributes.first_name[0] +
						item.attributes.last_name[0]
					}}
				</div>
			</div>

			<a class="add" @click="$emit('add')" v-if="false">
				<img src="../assets/extern/add.svg" alt="Add button" />
			</a>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			required: true,
			default: [],
		},
	},
	emits: ["add"],
	setup(props) {
		const colors = [
			"#F23838", // red
			"#F66808", // orange
			"#FFB157", // yellow
			"#7A2EE6", // purple <- default [3]
			"#15BE80", // green
			"#1849CF", // blue
			"#89A3EB", // gray
		];

		return {
			colors,
		};
	},
};
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
			word-break: break-all;
		}
	}
}

.add {
	cursor: pointer;
	transition: 0.2s;

	img {
		filter: invert(64%) sepia(35%) saturate(5578%) hue-rotate(118deg)
			brightness(97%) contrast(84%);
	}

	&:hover {
		img {
			filter: invert(22%) sepia(58%) saturate(4259%) hue-rotate(258deg)
				brightness(89%) contrast(102%);
		}
	}
}
</style>
