<template>
	<div class="bs-container" p5>
		<a :href="links.zapier"><img src="/src/assets/images/interfaces/zapier-logo.svg" :href="links.zapier" alt="BugShot" m6 /></a>

		<span flex flex-col items-center>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("interface.create_zaps") }}
			</p>

			<p class="createZapsDesc">
				{{ $t("interface.zaps_desc") }}
			</p>
		</span>
		<span class="stepsHeader" flex flex-col items-center>
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

			<a data-v-8e58ff39="" :href="links.zapier" class="">
				{{$t("interface.go_to_zapier") }}
			</a>

		</span>
	</div>
</template>

<script setup lang="ts">
const links = {
	zapier: "https://zapier.com/webintent/create-zap?entry-point-method=make_a_zap_call_to_action"
};

</script>

<style lang="scss" scoped>
.stores {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;

	>img {
		width: 10rem;
	}
}

.bs-container img {
	max-height: 56px;
    max-width: 295px;
    width: 100%;
}

.stepsHeader {
	margin-top: 10px;

	>a {
		text-decoration: underline;
		color: rgb(122, 46, 230);
		font-size: 20px;
		margin: 50px 0 20px 0;
	}
}

.steps {
	list-style: decimal;
	text-align: left;
	margin-left: 20px;

	>li {
		margin-top: 10px;
	}
}

.createZapsDesc{
	margin-top: 10px;
}

span>div {
	width: 100%;
}
</style>
