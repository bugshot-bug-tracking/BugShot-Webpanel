<template>
	<n-config-provider
		:locale="enUS"
		:date-locale="dateEnUS"
		style="width: 100vw; position: relative"
		:theme="theme === 'light' ? lightTheme : darkTheme"
		:theme-overrides="overrides"
	>
		<RouterView />
	</n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider } from "naive-ui";
import { enUS, dateEnUS } from "naive-ui";
import { darkTheme, lightTheme, GlobalThemeOverrides } from "naive-ui";

const theme = ref("light");

const lightThemeOverrides: GlobalThemeOverrides = {
	Layout: {
		color: "#f8f8fc",
		siderColor: "#f8f8fc",
		siderBorderColor: "#ede4fc",
		headerColor: "#f8f8fc",
		headerBorderColor: "#ede4fc",
	},

	Button: {
		colorPrimary: "#7a2ee6FF",
		colorDisabledPrimary: "#7a2ee6FF",
		colorHoverPrimary: "#5916b9FF",
		colorFocusPrimary: "#5916b9FF",
		textColorTextHoverPrimary: "#5916b9FF",
		textColorTextFocusPrimary: "#5916b9FF",
		textColorGhostHoverPrimary: "#5916b9FF",
		textColorGhostFocusPrimary: "#5916b9FF",
		rippleColorPrimary: "#5916b9FF",
		textColorGhostDisabledPrimary: "#5916b9FF",
		textColorGhostPrimary: "#5916b9FF",
		textColorTextPrimary: "#5916b9FF",
		colorPressedPrimary: "#5916b9FF",
		textColorTextPressedPrimary: "#5916b9FF",
		textColorGhostPressedPrimary: "#5916b9FF",
		textColorPrimary: "#FFFFFFFF",
		textColorHoverPrimary: "#FFFFFFFF",
		textColorPressedPrimary: "#FFFFFFFF",
		textColorFocusPrimary: "#FFFFFFFF",
		textColorDisabledPrimary: "#FFFFFFFF",
		borderPrimary: "1px solid #7a2ee6FF",
		borderDisabledPrimary: "1px solid #5916b9",
		borderHoverPrimary: "1px solid #7a2ee6",
		borderFocusPrimary: "1px solid #7a2ee6",
		borderPressedPrimary: "1px solid #7a2ee6",
	},
	Switch: {
		buttonHeightSmall: "0.625rem",
		buttonWidthSmall: "0.625rem",
		railHeightSmall: "1rem",
		railWidthSmall: "2rem",
		railBorderRadiusSmall: "0.25rem",
		buttonBorderRadiusSmall: "0.25rem",
		buttonWidthPressedSmall: "1rem",
		buttonColor: "#7a2ee6FF",
		railColorActive: "#eee5fcFF",
		railColor: "#eee5fcFF",
		textColor: "#1a2040FF",
		iconColor: "#FFFFFFFF",
		loadingColor: "#18d992FF",
		boxShadowFocus: "0 0 0.5rem 0 #eee5fc",
	},
};

const darkThemeOverrides: GlobalThemeOverrides = {
	Layout: {
		color: "#1a2040",
		siderColor: "#1a2040",
		siderBorderColor: "#131730",
	},
};

const overrides = computed(() => {
	switch (theme.value) {
		case "dark":
			return darkThemeOverrides;

		default:
		case "light":
			return lightThemeOverrides;
	}
});
</script>

<style scoped>
.n-layout-header {
	padding: 1rem;
}
</style>
