import { notifyError } from "@/utils/toast";

const useDisableForDemo = () => {
  const handleDisableForDemo = () => {
    const isDisableForDemoEnable = false
    if (isDisableForDemoEnable) {
      notifyError("This feature is disabled for demo!");
      // return true; // Indicate that the feature is disabled
    } else {
      console.log("This feature is enabled for demo!");
    }
    // return false; // Indicate that the feature is enabled
  };

  return {
    handleDisableForDemo,
  };
};

export default useDisableForDemo;
