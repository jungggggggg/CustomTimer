import { createContext, useState } from 'react';

const TimeContext = createContext(null);

export default function Time({ children }) {
  const [startTimer, setStartTimer] = useState(true);

  const [chooseSecondTime, setchooseSecondTime] = useState(0);
  const [chooseMinuteTime, setchooseMinuteTime] = useState(0);

  return (
    <TimeContext.Provider
      value={{
        startTimer,
        chooseMinuteTime,
        chooseSecondTime,
        setStartTimer,
        setchooseMinuteTime,
        setchooseSecondTime,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export { TimeContext };
