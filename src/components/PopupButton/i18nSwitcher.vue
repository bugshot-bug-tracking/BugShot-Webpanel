<template>
	<div class="language-switch">
		<div class="locale" @click="toggle" :class="{ active: showLangs }">
			<img
				src="/src/assets/icons/language.svg"
				alt="language"
				class="black-to-green"
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
					:key="locale"
					@click="changeLocale(locale)"
				>
					{{ locale }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";

const store = useI18nStore();

const auto = ref(false);

const locale = computed(() => {
	let locale = store.getLocale;
	auto.value = false;
	if (locale.toLowerCase() === "auto") {
		auto.value = true;
		return store.getAutoLocale;
	}
	return locale;
});

const showLangs = ref(false);

const toggle = () => {
	showLangs.value = !showLangs.value;
};

const changeLocale = (value: string) => {
	showLangs.value = false;

	store.setLocale(value);
};

const supportedLocales = computed(() => ["auto", ...store.getSupportedLocales]);
</script>

<style lang="scss" scoped>
.language-switch {
	position: relative;
	min-width: 4rem;
}

.locale {
	color: #18d891;
	font-weight: bold;
	cursor: pointer;
	text-transform: uppercase;
	border-radius: 0.375rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.125rem;
	padding: 0.125rem;
	font-size: 1rem;

	&.active {
		background-color: #c4f8e5;
	}

	img {
		width: 1.5rem;
		height: 1.5rem;
	}
}

.selection {
	position: absolute;
	background: white;
	bottom: 2rem;
	width: 100%;
	border-radius: 0.375rem;
	font-weight: bold;
	text-transform: uppercase;
	z-index: 10;
	font-size: 1rem;
	box-shadow: 0 0.25rem 0.375rem hsla(0, 0%, 0%, 0.4);

	ul {
		list-style: none;
		padding: 0.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
	}

	li {
		cursor: pointer;

		&:hover {
			color: #18d891;
		}
	}
}

.auto-locale > span:last-of-type {
	font-size: 0.5rem;
	vertical-align: super;
	margin-left: 0.2rem;
}
</style>
