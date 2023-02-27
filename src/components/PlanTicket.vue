<!-- Note: 
	- if not in use delete
 -->

<template>
	<Container class="wrapper">
		<div class="pre-ticket" v-if="owned">
			<p>{{ $t("owned") }}:</p>
			<p text-12>{{ owned }}</p>
		</div>

		<div class="ticket">
			<div class="title">
				<div flex gap-4 items-center>
					<img v-if="image" :src="image" alt="" />

					<span :class="recurring === 'month' ? 'black-to-purple' : 'black-to-green'">
						{{ name }}
					</span>
				</div>

				<div
					flex
					gap-2
					items-center
					:class="recurring === 'month' ? 'black-to-purple' : 'black-to-green'"
					:style="{ 'white-space': 'nowrap' }"
				>
					<p text-8>{{ price }}€</p>
					<p text-6>/ {{ recurring }}</p>
				</div>
			</div>

			<div :style="{ 'white-space': 'pre-line' }" class="perks">
				<p
					text-6
					class="bs-bb"
					:class="recurring === 'month' ? 'black-to-purple' : 'black-to-green'"
					mb-4
					font-bold
				>
					{{ $t("perks") }}:
				</p>

				<p v-for="feature in feature_list">{{ feature }}</p>
			</div>
		</div>

		<div
			class="post-ticket"
			:style="{ color: recurring === 'month' ? COLOR.PURPLE : COLOR.GREEN }"
		>
			<p :style="{ color: 'white' }">{{ $t("quantity") }}:</p>

			<input
				type="number"
				id="tentacles"
				name="tentacles"
				min="0"
				v-model="quantity"
				@change="emit('change', quantity)"
			/>
		</div>
	</Container>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { COLOR } from "~/util/colors";

const props = defineProps({
	owned: {
		type: Number,
		required: false,
		default: undefined,
	},

	name: {
		type: String,
		required: true,
	},

	image: {
		type: String,
		required: false,
		default: undefined,
	},

	price: {
		type: Number,
		required: true,
	},

	recurring: {
		type: String,
		required: true,
		description: "The interval between payments",
		validate: (value: string) => ["month", "year"].includes(value),
	},

	feature_list: {
		type: Array as PropType<string[]>,
		required: true,
	},

	value: {
		type: Number,
		required: false,
		default: 0,
		description:
			"The quantity of this item. Useful if the recurring prop changes but the item is the same",
	},
});

const emit = defineEmits<{ (event: "change", value: number): void }>();

const quantity = ref(0);

watch(
	props,
	() => {
		quantity.value = props.value;
	},
	{ deep: true }
);
</script>

<style lang="scss" scoped>
@media screen and (max-width: 100rem) {
	.ticket {
		justify-content: center !important;
		.perks {
			display: none;
		}
	}
}

.wrapper {
	flex-direction: row;
	gap: 2rem;
}

.ticket {
	display: flex;
	justify-content: space-between;

	gap: 2rem;
	width: 100%;

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		font-weight: bold;
		font-size: 2rem;

		img {
			height: 2rem;
		}
	}

	.perks {
		width: 100%;
	}
}

.pre-ticket,
.post-ticket {
	width: 14rem;
	background: currentColor;
	margin-top: -1.25rem;
	margin-bottom: -1.25rem;

	font-size: 1.5rem;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
}

.pre-ticket {
	background: hsl(224, 79%, 45%);
	color: white;
	margin-left: -1.25rem;
	border-radius: 0.5rem 0 0 0.5rem;
}
.post-ticket {
	margin-right: -1.25rem;
	border-radius: 0 0.5rem 0.5rem 0;

	input {
		width: 4rem;
		border: 0;
		border-radius: 0.5rem;
		text-align: center;
		margin: 1.0625rem 0;
	}
}
</style>
