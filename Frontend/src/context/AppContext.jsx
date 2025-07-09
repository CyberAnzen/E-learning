import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FingerPrintJS from "../../utils/Fingerprint";

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(true);
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedLinks, setSavedLinks] = useState(null); // final saved data
  //Admin Add card Toggle
  const [LearnAdd, setLearnAdd] = useState(false);
  const [Admin, setAdmin] = useState(true);
  //Classification globalState
  const [classificationId, setClassificationId] = useState();
  const [fp, setFp] = useState(null); // State to store fingerprint
  const [csrf, setCSRF] = useState(null);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await FingerPrintJS(); // Get fingerprint
        setFp(fp); // Store fingerprint in state
      } catch (error) {
        console.error("Failed to generate fingerprint:", error);
      }
    };

    getFingerprint();
  }, []);

  const value = {
    navigate,
    user,
    savedSkills,
    setSavedSkills,
    savedLinks,
    setSavedLinks,
    LearnAdd,
    setLearnAdd,
    Admin,
    classificationId,
    setClassificationId,
    fp,
    csrf,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
