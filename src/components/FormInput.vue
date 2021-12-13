<template>
	<div class="form-group">
		<input
			:type="type"
			class="field"
			:class="{ img: image }"
			:placeholder="placeholder"
			required
			maxlength="255"
			:autocomplete="autocomplete"
			v-model="value"
		/>

		<img v-if="image" class="image" :src="image" />
	</div>
</template>

<script>
export default {
	name: "FormInput",
	props: {
		value: {
			required: true,
			type: String,
		},
		type: {
			required: false,
			type: String,
			default: "text",
		},
		placeholder: {
			required: false,
			type: String,
		},
		autocomplete: {
			required: false,
			type: String,
		},
		image: {
			required: false,
			type: String,
		},
	},
};
</script>

<style lang="scss" scoped>
.form-group {
	width: 95%;
	display: flex;
	position: relative;
	align-items: center;

	.field {
		border: 1px solid hsl(264, 78%, 77%);
		border-radius: 8px;
		margin: 16px 0;
		width: 100%;
		padding: 10px;
		// padding-right: 40px;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: hsl(265, 79%, 41%);
			outline-color: hsl(265, 79%, 41%);
		}

		&.img {
			padding-right: 40px;
		}
	}
	.image {
		width: 20px;
		position: absolute;
		right: 12px;
	}
}
</style>
