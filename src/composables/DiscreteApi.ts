import { ConfigProviderProps, createDiscreteApi } from "naive-ui";
import { useTheme } from "./useThemes";

export function useDiscreteApi() {
	const { theme } = useTheme();

	const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
		theme: theme.value,
	}));

	const { message, notification } = createDiscreteApi(["message", "notification"], {
		configProviderProps: configProviderPropsRef,
	});

	return { message, notification };
}
