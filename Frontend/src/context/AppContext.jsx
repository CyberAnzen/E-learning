import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FingerPrintJS from "../../utils/Fingerprint";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

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
    axios,
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
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
