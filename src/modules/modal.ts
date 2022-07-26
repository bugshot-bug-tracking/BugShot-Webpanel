import { UserModule } from "~/types";
import VueUniversalModal from "vue-universal-modal";
import "vue-universal-modal/dist/index.css";

export const install: UserModule = ({ app }) => {
	app.use(VueUniversalModal, {
		teleportTarget: "#modals",
		modalComponent: "MyModal",
	});
};
