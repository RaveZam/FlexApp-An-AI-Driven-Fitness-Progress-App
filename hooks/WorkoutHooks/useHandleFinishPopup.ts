import { useWorkoutContext } from "../useWorkoutPlanContext";
import { navgationHelpers } from "../../helpers/navigationHelpers";

export const useHandleFinishPopup = () => {
  const { setShowSuccessPopup } = useWorkoutContext();

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    navgationHelpers.goToWorkoutScreen();
  };

  return {
    handleClosePopup,
  };
};
