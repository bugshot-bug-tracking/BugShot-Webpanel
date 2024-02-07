<template>
	<TSidebar>
		<template #header>
			<slot name="pre-header" />

			<header>
				<div flex flex-col flex-1>
					<slot name="header-content">
						<n-h2 m-0 mb-2>
							<slot name="header-text"> [PH] resource </slot>
						</n-h2>
					</slot>

					<RouterLink
						:to="{ name: 'home' }"
						style="
							text-decoration: underline;
							color: var(--bs-purple);
							font-size: 0.875rem;
						"
					>
						{{ $t("back_to_al_projects") }}
					</RouterLink>
				</div>

				<div>
					<OrderPopover v-model:value="orderRef" :header="$t(`order.${resource}`)" />
				</div>
			</header>
		</template>

		<template #main>
			<div class="list-wrapper sh-navbar-list">
				<n-scrollbar pr-2>
					<ul>
						<li v-for="item in orderedList(list)" :key="item.id">
							<slot name="item" v-bind="{ item }"> </slot>

							<hr />
						</li>
					</ul>
				</n-scrollbar>
			</div>
		</template>

		<template #footer v-if="$slots['footer']">
			<slot name="footer"> </slot>
		</template>
	</TSidebar>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import useOrderResource from "~/composables/OrderResource";
import { Company } from "~/models/Company";
import { Organization } from "~/models/Organization";

const props = defineProps({
	order: {
		type: Number,
		required: true,
	},

	list: {
		type: Array as PropType<Company[] | Organization[]>,
		required: true,
	},

	resource: {
		type: String as PropType<"organization" | "company">,
		required: true,
	},
});

const emit = defineEmits<{ (event: "update:order", value: number): void }>();

const { orderRef, orderedList } = useOrderResource();

onMounted(() => {
	orderRef.value = props.order;
});

watch(orderRef, () => {
	emit("update:order", orderRef.value);
});
</script>

<style lang="scss" scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	text-align: left;
	padding: 1rem;
	gap: 1rem;

	a.router-link-exact-active {
		color: #9ba5d7 !important;
	}
}

.list-wrapper {
	padding: 0.5rem 0 0.5rem 0.5rem;
	height: 100%;
	width: 100%;

	ul {
		list-style-type: none;
		padding: 0.5rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		li {
			&:last-of-type {
				hr {
					display: none;
				}
			}
		}
	}
}
</style>
