import TourContent from "../components/TourContent";
import { REFERENCE_TIME } from "../utils/timeUtils";

const hasArchives = () => {
  const now = new Date();
  const malaysiaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  // Calculate how many 24-hour periods have passed since the reference time
  const diffTime = malaysiaTime.getTime() - REFERENCE_TIME.getTime();
  const periodsPassed = Math.floor(diffTime / (24 * 60 * 60 * 1000));

  // If any 24-hour periods have passed, archives are available
  return periodsPassed > 0;
};

export const getSteps = () => {
  const baseSteps = [
    {
      selector: ".onboarding01",
      content: () => (
        <TourContent>
          <div>
            <h2
              style={{
                color: "#FF2247",
                fontSize: "24px",
                marginBottom: "10px",
                fontWeight: "bold",
                fontFamily: "Lobster",
              }}
            >
              Muizzle
            </h2>
            <p>
              Welcome to Muizzle! Wordle-like movie guesser for Tamil, Hindi,
              East Asian and Hollywood movies. Everyday at 2pm IST (8:30am GMT)
              a new movie will be displayed
            </p>
          </div>
        </TourContent>
      ),
    },
    {
      selector: ".onboarding02",
      content: () => (
        <TourContent>
          <p>
            You have <strong>6 attempts</strong> to guess the title of the movie
            based on the screenshots displayed
          </p>
        </TourContent>
      ),
    },
    {
      selector: ".onboarding03",
      content: () => (
        <TourContent>
          <div>
            <p>
              Input your guess and choose a movie by selecting an option from
              the list or pressing submit to select the first movie listed
            </p>
          </div>
        </TourContent>
      ),
    },
    {
      selector: ".onboarding04",
      content: () => (
        <TourContent>
          <div>
            <p>Click on this button to check and share your stats.</p>
            <p>
              <strong>Disclaimer:</strong> Stats are stored in your local
              storage and will be reset if website data is cleared
            </p>
          </div>
        </TourContent>
      ),
    },
  ];

  if (hasArchives()) {
    baseSteps.push({
      selector: ".onboarding05",
      content: () => (
        <TourContent isLastStep={true}>
          <p>
            To check and try out previous games check the{" "}
            <strong>Archives</strong> here
          </p>
        </TourContent>
      ),
    });
  }
  return baseSteps;
};
