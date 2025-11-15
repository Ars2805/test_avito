import React, { createContext, useState } from "react";

export const AdsContext = createContext();

export const AdsProvider = ({ children }) => {
  const [allAds, setAllAds] = useState([]);

  return (
    <AdsContext.Provider value={{ allAds, setAllAds }}>
      {children}
    </AdsContext.Provider>
  );
};
