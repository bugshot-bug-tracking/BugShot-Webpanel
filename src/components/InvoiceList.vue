<template>
	<div class="bs-container">
		<img
			src="/src/assets/animations/loading.svg"
			alt="loading circle"
			v-if="invoices == undefined"
			w-20
			h-20
			m-a
		/>

		<n-list :show-divider="false" v-else-if="invoices != undefined && invoices.length > 0">
			<n-list-item v-for="invoice in filteredInvoices" :key="invoice.id">
				<div flex justify-between text-start>
					<div>
						<p>
							<b>{{ invoice.number }}</b>
						</p>
						<p style="color: var(--bs-gray)">
							{{ $d(new Date(invoice.created * 1000), "short") }}
						</p>
					</div>

					<n-button
						text
						type="tertiary"
						tag="a"
						:href="invoice.invoice_pdf"
						target="_blank"
					>
						<template #icon>
							<img
								src="/src/assets/icons/download.svg"
								alt="download"
								w-4
								h-4
								class="black-to-purple"
							/>
						</template>

						{{ $t("download_invoice") }}
					</n-button>
				</div>
			</n-list-item>
		</n-list>

		<n-empty v-else :description="$t('no_invoices')" />
	</div>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

const store = useOrganizationStore();
const organization = computed(() => store.getOrganization);
const invoices = computed(() => store.getInvoices);

const filteredInvoices = computed(() => {
	return invoices.value?.sort((a, b) => a.created - b.created).slice(0, 3);
});

onMounted(() => {
	store.fetchInvoices();
});

watch(organization, async (newOrg, oldOrg) => {
	if (newOrg?.id !== oldOrg?.id) store.fetchInvoices();
});
</script>

<style scoped lang="scss"></style>
