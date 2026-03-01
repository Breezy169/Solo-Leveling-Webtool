import { createContext, useState, useEffect } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile');
      const data = await response.json();
      setProfile(data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchProfile();
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        refreshProfile: fetchProfile  // 👈 DAS ist wichtig
      }}
    >
      {!isLoading && children}
    </ProfileContext.Provider>
  );
};