<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ t("organization") }}
				</template>

				<template #l-bottom>
					{{ resource.attributes.designation }}
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 content-start flex gap-16>
			<div class="component-group" min-w-128 max-w-128>
				<div class="group-header">
					{{ t("license", 2) }}
				</div>
				<div class="group-content">
					<Container>
						<template #title>
							<div flex gap-4>
								<div
									:class="{
										'black-to-purple': type === 0,
										'black-to-gray': type !== 0,
									}"
									@click="type = 0"
									cursor-pointer
								>
									Monthly
								</div>
								<div
									:class="{
										'black-to-green': type === 1,
										'black-to-gray': type !== 1,
									}"
									@click="type = 1"
									cursor-pointer
								>
									Yearly
								</div>
							</div>
						</template>

						<ul>
							<li
								v-for="plan in type === 0 ? monthlyPlans : yearlyPlans"
								:key="plan.id"
							>
								<div class="plan-item">
									<p>
										{{ plan.attributes.designation }}
									</p>

									<div grid grid-cols-2>
										<div class="left">
											<span>PERKS</span>

											<ul>
												<li>Free drinks</li>
												<li>Free food</li>
												<li>1h/day massage</li>
												<li>Parking slot</li>
											</ul>
										</div>
										<div class="right">
											<p>{{ plan.attributes.price }} /member/month</p>

											<p>10/88 licenses in use</p>

											<a class="bs-btn purple">
												<img
													src="/src/assets/icons/password_view.svg"
													alt=""
													class="black-to-white"
												/>

												View details
											</a>
										</div>
									</div>
								</div>
							</li>
						</ul>

						<button class="bs-btn green" mt-8>Buy More</button>
					</Container>
				</div>
			</div>

			<div class="component-group" max-w-176 min-w-160 h-80vh>
				<div class="group-header">
					{{ t("team_members") }}
				</div>

				<div class="group-content" v-if="resource">
					<OrganizationUserPlans />
				</div>
			</div>
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

// const props =
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const { t } = useI18n();

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization!);

const monthlyPlans = [
	{
		id: "1",
		attributes: {
			designation: "Plan #1",
			quantity: 10,
			price: 110,
		},
	},
	{
		id: "2",
		attributes: {
			designation: "Plan #2",
			quantity: 6,
			price: 120,
		},
	},
	{
		id: "3",
		attributes: {
			designation: "Plan #3",
			quantity: 1,
			price: 130,
		},
	},
];

const yearlyPlans = [
	{
		id: "1",
		attributes: {
			designation: "Plan #1",
			quantity: 50,
			price: 1100,
		},
	},
	{
		id: "2",
		attributes: {
			designation: "Plan #2",
			quantity: 34,
			price: 1200,
		},
	},
	{
		id: "3",
		attributes: {
			designation: "Plan #3",
			quantity: 2,
			price: 1300,
		},
	},
];

const type = ref(0);
</script>

<style scoped></style>

<route lang="yaml">
name: organization-payments
</route>
