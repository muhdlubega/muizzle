import { useTour } from "@reactour/tour";

export const tourConfig = {
  styles: {
    popover: (base: any) => ({
      ...base,
      backgroundColor: '#1a1a1a',
      color: 'white',
      borderRadius: '8px',
    }),
  close: (base: any) => ({
    ...base,
    width: '16px',
    height: '16px',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      color: '#FF2247',
    },
  }),
  arrow: (base: any) => ({
    ...base,
    width: '32px',
    height: '32px',
    fontSize: '24px',
    '&:hover': {
      color: '#FF2247',
    },
  }),
  dot: (base: any) => ({
    ...base,
    width: '12px',
    height: '12px',
  }),
},
};


const TourContent = ({ children, isLastStep = false }: {children: JSX.Element, isLastStep?: boolean}) => {
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
        cursor: isLastStep ? 'default' : 'pointer',
        padding: '10px'
      }}
    >
      {children}
    </div>
  );
};

export const getSteps = (hasStats: boolean) => {
  const baseSteps = [
    {
      selector: ".onboarding01",
      content: () => (
        <TourContent>
          <div>
            <h2 style={{
              color: '#FF2247',
              fontSize: '24px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontFamily: 'Lobster'
            }}>
              Muizzle
            </h2>
            <p>
              Welcome to Muizzle! Wordle Tamil movie guesser.
              Everyday at 4pm MYT a new movie will be displayed
            </p>
          </div>
        </TourContent>
      )
    },
    {
      selector: ".onboarding02",
      content: () => (
        <TourContent>
          <p>You have <strong>6 attempts</strong> to guess the title of the movie based on the screenshots displayed</p>
        </TourContent>
      )
    },
    {
      selector: ".onboarding03",
      content: () => (
        <TourContent>
          <div>
            <p>Input your guess and select an option</p>
            <p>On winning or losing your first game your statistics modal will be displayed</p>
          </div>
        </TourContent>
      )
    },
  ];

  if (hasStats) {
    baseSteps.push(
      {
        selector: ".onboarding04",
        content: () => (
          <TourContent>
            <div>
              <p>Click on this button to check and share your stats.</p>
              <p>
                <strong>Disclaimer:</strong> Stats are stored in your cookies and will be reset if cookies are cleared
              </p>
            </div>
          </TourContent>
        )
      },
      {
        selector: ".onboarding05",
        content: () => (
          <TourContent isLastStep={true}>
            <p>To check and try out previous games check the <strong>Archives</strong> here</p>
          </TourContent>
        )
      }
    );
  }

  return baseSteps;
};

// export const getSteps = (hasStats: boolean) => {
//   const baseSteps = [
//     {
//       selector: ".onboarding01",
//       content: () => (
//         <div>
//           <h2 style={{
//             color: '#FF2247',
//             fontSize: '24px',
//             marginBottom: '10px',
//             fontWeight: 'bold',
//             fontFamily: 'Lobster'
//           }}>
//             Muizzle
//           </h2>
//           <p>
//             Welcome to Muizzle! Wordle Tamil movie guesser.
//             Everyday at 4pm MYT a new movie will be displayed
//           </p>
//         </div>
//       )
//     },
//     {
//       selector: ".onboarding02",
//       content: () => (
//         <p>You have <strong>6 attempts</strong> to guess the title of the movie based on the screenshots displayed</p>
//       )
//     },
//     {
//       selector: ".onboarding03",
//       content:
//         () => (
//           <div>
//             <p>Input your guess and select an option</p>
//             <p>On winning or losing your first game your statistics modal will be displayed</p>
//           </div>
//         )
//     },
//   ];

//   if (hasStats) {
//     baseSteps.push(
//       {
//         selector: ".onboarding04",
//         content: () => (
//           <div>
//             <p>Click on this button to check and share your stats.</p>
//             <p>
//               <strong>Disclaimer:</strong> Stats are stored in your cookies and will be reset if cookies are cleared
//             </p>
//           </div>
//         )
//       },
//       {
//         selector: ".onboarding05",
//         content: () => (
//           <p>To check and try out previous games check the <strong>Archives</strong> here</p>
//         )
//       }
//     );
//   }

//   return baseSteps;
// };