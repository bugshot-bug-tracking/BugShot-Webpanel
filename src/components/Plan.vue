<template>
	<Container>
		<div class="content">
			<span>You curently use the</span>

			<div class="plan-name">Standard Plan</div>

			<div class="ammenities">
				<span>included in the plan you have:</span>

				<span>[PH] 1</span>
				<span>[PH] 2</span>
				<span>[PH] 3</span>
				<span>[PH] 4</span>
				<span>[PH] 5</span>
			</div>

			<div class="plan-date-info">
				<div class="purchase bold">Purchas Date:</div>
				<div class="plan-type bold">Plan Type:</div>
				<div class="end-date bold">End Date:</div>

				<div class="p-date">dd.mmmm.yyyy</div>
				<div class="type">yearly payment</div>
				<div class="e-date">dd.mmmm.yyyy</div>
			</div>

			<a class="btn bs bf-green"> Upgrade Plan</a>
		</div>
	</Container>
</template>

<script>
import Container from "./Container.vue";
export default {
	components: { Container },
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	align-items: center;
	padding: 20px 60px;

	.plan-name {
		font-size: 44px;
		color: hsl(265, 79%, 54%);
		font-weight: bold;
	}

	.ammenities {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 20px;
		border-top: 1px solid #ede4fc;
	}
}

.plan-date-info {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	gap: 2px 2px;
	grid-auto-flow: row;
	grid-template-areas:
		"purchase p-date"
		"plan-type type"
		"end-date e-date";
	margin: 20px 0;
	padding: 20px 0;
	border-top: 1px solid #ede4fc;
	border-bottom: 1px solid #ede4fc;
	justify-items: start;
	width: 100%;
}

.purchase {
	grid-area: purchase;
}

.plan-type {
	grid-area: plan-type;
}

.end-date {
	grid-area: end-date;
}

.p-date {
	grid-area: p-date;
}

.type {
	grid-area: type;
}

.e-date {
	grid-area: e-date;
}

.bold {
	font-weight: bold;
}
</style>
