import { useTour } from "@reactour/tour";
import { TourContentProps } from "../types/types";

export const TourContent = ({
  children,
  isLastStep = false,
}: TourContentProps) => {
  const { setCurrentStep } = useTour();

  const handleClick = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: isLastStep ? "default" : "pointer",
        padding: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default TourContent;
