<template>
	<div class="bs-container" p5>
		<a :href="links.zapier"
			><img
				src="/src/assets/images/interfaces/zapier-logo.svg"
				:href="links.zapier"
				alt="BugShot"
				m6
		/></a>

		<span flex flex-col items-center>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("interface.create_zaps") }}
			</p>

			<p mt-4>
				{{ $t("interface.zaps_desc") }}
			</p>
		</span>
		<span flex flex-col items-center mt-4>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("interface.work_steps") }}
			</p>

			<ol class="steps">
				<li>{{ $t("interface.first_step") }}</li>
				<li>{{ $t("interface.second_step") }}</li>
				<li>{{ $t("interface.third_step") }}</li>
				<li>{{ $t("interface.fourth_step") }}</li>
				<li>{{ $t("interface.fifth_step") }}</li>
			</ol>

			<n-button type="primary" tag="a" :href="links.zapier" round size="large" mt-10>
				{{ $t("interface.go_to_zapier") }}
			</n-button>
		</span>
	</div>
</template>

<script setup lang="ts">
const links = {
	zapier: "https://zapier.com/webintent/create-zap?entry-point-method=make_a_zap_call_to_action",
};
</script>

<style lang="scss" scoped>
.bs-container > img {
	max-height: 3.5rem;
}

.steps {
	list-style: decimal;
	text-align: left;
	margin-left: 1.25rem;

	> li {
		margin-top: 0.5rem;
	}
}

span > div {
	width: 100%;
}
</style>
