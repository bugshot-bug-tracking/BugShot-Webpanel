<template>
	<div class="sidebar">
		<h3>{{ $t("company", 2) }}</h3>

		<div class="companies bs-scroll s-purple">
			<ul>
				<li v-for="[, company] of companies" :key="company.id">
					<div class="company">
						<router-link
							@click="linkOpen"
							:to="{
								name: 'CompanyGeneral',
								params: { id: company.id },
							}"
						>
							{{ company.attributes.designation }}
						</router-link>

						<img
							src="/src/assets/icons/icn_left_arrow.svg"
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
							{{ $t("general") }}
						</router-link>

						<router-link
							v-if="false"
							class="entry"
							:to="{
								name: 'CompanyInvoices',
								params: { id: company.id },
							}"
						>
							{{ $t("invoice", 2) }}
						</router-link>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useMainStore } from "src/stores/main";

const store = useMainStore();

const companies = computed(() => {
	return store.getCompanies;
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
		padding: 10px 0px 10px 10px;
		font-size: 16px;
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
				padding: 4px 4px 8px 4px;
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
			margin-bottom: 4px;
			padding: 6px;

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
			padding: 10px 10px 10px 10px;

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
