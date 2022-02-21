<template>
	<div class="language-switch">
		<div class="locale mt-4" @click="toggle" :class="{ active: showLangs }">
			{{ locale }}
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

const locale = computed(() => {
	return store.getters.getLocale;
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
	padding: 2px;

	&.active {
		background-color: white;
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
</style>
