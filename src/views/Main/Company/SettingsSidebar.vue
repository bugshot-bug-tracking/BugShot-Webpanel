<template>
	<div class="sidebar">
		<h3>Companies</h3>
		<div class="companies c-scroll s-purple">
			<ul>
				<li v-for="[, company] of companies" :key="company.company.id">
					<div class="company">
						<router-link
							@click="linkOpen"
							:to="{
								name: 'CompanyGeneral',
								params: { id: company.company.id },
							}"
						>
							{{ company.company.attributes.designation }}
						</router-link>

						<img
							src="@/assets/icons/icn_left_arrow.svg"
							@click="collapse"
						/>
					</div>

					<ul class="list">
						<router-link
							class="entry"
							:to="{
								name: 'CompanyGeneral',
								params: { id: company.id },
							}"
						>
							General
						</router-link>

						<router-link
							class="entry"
							:to="{
								name: 'CompanyInvoices',
								params: { id: company.id },
							}"
						>
							Invoices
						</router-link>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { computed } from "@vue/reactivity";
import store from "../../../store";
export default {
	name: "CompanySettings",
	setup() {
		const companies = computed(() => {
			return store.getters.getCompanies;
		});

		const collapse = (event) => {
			if (event.target.parentNode.classList.contains("open")) {
				event.target.parentNode.classList.remove("open");
			} else {
				event.target.parentNode.classList.add("open");
			}
		};

		const linkOpen = (event) => {
			event.target.parentNode.classList.add("open");
		};

		return {
			companies,
			collapse,
			linkOpen,
		};
	},
};
</script>

<style lang="scss" scoped>
.sidebar {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	> h3:first-child {
		padding: 20px;
		text-align: left;
	}
	.companies {
		padding: 10px;
		font-size: 20px;
		border-top: 1px solid #ede4fc;
		overflow: auto;
		height: 100%;

		ul {
			list-style-type: none;
			padding: 0;
			text-align: left;
			display: flex;
			flex-direction: column;

			> li {
				padding: 10px;
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
			padding: 6px 12px;

			&:hover {
				background-color: hsl(263, 79%, 94%);
				width: 100%;
				border-radius: 6px;
			}

			> img {
				transform: rotateZ(-90deg);
				cursor: pointer;
				transition: 0.3s;
				user-select: none;
			}

			&.open {
				> img {
					transform: rotateZ(90deg);
				}
			}

			a.router-link-exact-active {
				color: #7a2de6;
			}
		}

		.company.open + .list {
			display: flex;
		}

		.company > a.router-link-exact-active + .list {
			display: flex;
		}

		.list {
			display: none;
			overflow: hidden;
		}

		.entry {
			display: inline-flex;
			align-items: center;
			padding: 10px 10px 10px 30px;

			&:hover {
				background-color: hsl(263, 79%, 94%);
				width: 100%;
				border-radius: 6px;
			}

			&.router-link-exact-active {
				border-radius: 6px;
				background: hsl(158, 79%, 87%);
			}
		}
	}
}
</style>
