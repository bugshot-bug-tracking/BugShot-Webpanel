<template>
	<div class="plan">
		<slot name="image">
			<img w-16 ma pt-4 :src="image" alt="plan image" />
		</slot>

		<div class="black-to-purple" text-12 font-bold>
			<slot name="title">
				<p>{{ name }}</p>
			</slot>
		</div>

		<p>
			<b>{{ $t("bugshot_account") }}</b>
		</p>

		<slot name="price">
			<div class="price">
				<p class="black-to-purple">
					<span text-24>
						{{ price }}
					</span>
					<span text-6> €</span>
					<br />
					<span class="black-to-purple">
						/
						{{ type === "month" ? $t("month") : $t("year") }}
					</span>
				</p>
			</div>
		</slot>

		<div class="features">
			<ul>
				<li v-for="(feature, index) in features" :key="index">
					<p>{{ feature }}</p>
				</li>
			</ul>
		</div>

		<p my-8 class="black-to-gray" font-bold>
			<b>
				{{ type === "month" ? $t("monthly_payment") : $t("yearly_payment") }}
			</b>
		</p>

		<div class="choose-button">
			<slot name="button">
				<button class="bs-btn green">{{ $t("choose_plan") }}</button>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	name: {
		required: true,
		type: String,
		description: "Plan name",
	},

	type: {
		required: true,
		type: String,
		validator: (value: string) => ["month", "year"].includes(value),
		description: "Plan payment model",
	},

	price: {
		required: true,
		type: Number,
		description: "Plan payment value",
	},

	features: {
		required: false,
		type: Array,
		description: "Feature list",
	},

	image: {
		required: true,
		type: String,
		description: "Plan image",
		default: "",
	},
});
</script>

<style scoped lang="scss">
.plan {
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;

	background: #ffffff 0% 0% no-repeat padding-box;
	box-shadow: 0px 0.125rem 0.25rem hsla(0, 0%, 0%, 0.161);
	border: 1px solid #d7dbef;
	border-radius: 0.5rem;

	padding: 2rem;

	min-width: 24rem;
}

.price {
	line-height: 1;
	font-weight: bold;
	margin: 2rem 0;
}

.features {
	ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		color: #bc97f2;
	}
}

.choose-button {
	position: absolute;
	bottom: -1.5rem;
	left: 0;
	text-transform: uppercase;
	font-weight: bold;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
