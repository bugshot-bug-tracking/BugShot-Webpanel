<template>
	<div class="sidebar">
		<h3>Companies</h3>

		<div class="search">
			<Search />
		</div>

	</div>
</template>

<script>
import Search from "../../../components/Search.vue";

export default {
	components: { Search },
	name: "CompanySidebar",
	setup() {
	},
};
</script>
