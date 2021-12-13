<template>
	<div class="companies">
		<h1>Companies Settings</h1>

		<ul>
			<li v-for="[, company] of companies" :key="company.company.id">
				<div class="company">
					<router-link
						:to="{
							name: 'CompanyGeneral',
							params: { id: company.company.id },
						}"
					>
						{{ company.company.attributes.designation }}
					</router-link>

					<img src="@/assets/icons/icn_left_arrow.svg" />
				</div>

				<ul>
					<li class="entry">
						<router-link
							:to="{
								name: 'CompanyGeneral',
								params: { id: company.company.id },
							}"
						>
							General
						</router-link>
					</li>

					<li class="entry">
						<router-link
							:to="{
								name: 'CompanyInvoices',
								params: { id: company.company.id },
							}"
						>
							Invoices
						</router-link>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<script>
import { computed } from "@vue/reactivity";
import store from "../../../store";
export default {
	name: "CompanySettings",
	setup(props) {
		const record = computed(() => {
			//!!!!!!!!!!!!!!!!! !TODO! update after UUID Changes
			return store.getters.getCompanyById(parseInt(props.id));
		});
		const companies = computed(() => {
			return store.getters.getCompanies;
		});

		return {
			record,
			companies,
		};
	},
};
</script>

<style lang="scss" scoped>
.companies {
	padding: 10px;
	font-size: 20px;

	ul {
		list-style-type: none;
		padding: 0;
		text-align: left;
		display: flex;
		flex-direction: column;

		> li {
			padding: 10px 10px 10px 20px;
		}
	}

	a {
		text-decoration: none;
		color: black;
	}

	.company {
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		margin-bottom: 10px;

		> img {
			transform: rotateZ(-90deg);
			cursor: pointer;
		}

		&.open {
			> img {
				transform: rotateZ(90deg);
			}
		}
	}

	.entry {
		display: inline-flex;
		align-items: center;

		&:hover {
			background-color: hsl(263, 79%, 94%);
			width: 100%;
			border-radius: 6px;
		}
		> .dot {
			border-radius: 100%;
			background-color: red;
			padding: 7px;
			margin: 0 10px 0 0;
		}
	}
	a.router-link-exact-active {
		text-decoration: underline;
	}
}
</style>
