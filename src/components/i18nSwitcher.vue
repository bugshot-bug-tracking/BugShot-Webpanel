<template>
	<div class="language-switch">
		<div class="locale mt-4" @click="toggle" :class="{ active: showLangs }">
			<img
				src="../assets/icons/lang.svg"
				alt="language"
				class="bs-to-green"
			/>

			<span v-if="!auto">{{ locale }}</span>
			<div v-else class="auto-locale">
				<span>{{ locale }}</span>
				<span>(Auto)</span>
			</div>
		</div>

		<div class="selection" v-if="showLangs">
			<ul>
				<li
					v-for="locale in supportedLocales"
					:key="locale.code"
					@click="changeLocale(locale.code)"
				>
					{{ locale.code }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "@vue/runtime-core";
import store from "../store";

const auto = ref(false);
const locale = computed(() => {
	let locale = store.getters.getLocale;
	auto.value = false;
	if (locale.toLowerCase() === "auto") {
		auto.value = true;
		return store.getters.getAutoLocale;
	}
	return locale;
});

const showLangs = ref(false);

const toggle = () => {
	showLangs.value = !showLangs.value;
};

const changeLocale = (value) => {
	showLangs.value = false;

	store.dispatch("setLocale", value);
};

const supportedLocales = computed(() => {
	return store.getters.getSupportedLocales;
});
</script>

<style lang="scss" scoped>
.language-switch {
	position: relative;
}

.locale {
	color: #18b984;
	font-weight: bold;
	cursor: pointer;
	text-transform: uppercase;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2px;
	padding: 2px;
	font-size: 14px;

	&.active {
		background-color: #c4f8e5;
	}
}

.selection {
	position: absolute;
	background: white;
	bottom: 32px;
	width: 100%;
	border-radius: 6px;
	font-weight: bold;
	text-transform: uppercase;
	z-index: 10;
	font-size: 14px;

	ul {
		list-style: none;
		padding: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	li {
		cursor: pointer;

		&:hover {
			color: #18b984;
		}
	}
}

.auto-locale > span:last-of-type {
	font-size: 8px;
	vertical-align: super;
	margin-left: 2px;
}
</style>
