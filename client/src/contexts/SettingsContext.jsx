import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext({
    appLogo: '',
    setAppLogo: () => { }
});

export const SettingsProvider = ({ children }) => {
    const [appLogo, setAppLogo] = useState('');

    useEffect(() => {
        // Fetch global settings on app initialization
        axios.get('http://localhost:5001/api/settings')
            .then(res => {
                if (res.data && res.data.appLogo) {
                    setAppLogo(res.data.appLogo);
                }
            })
            .catch(err => console.error("Could not fetch global settings: ", err));
    }, []);

    return (
        <SettingsContext.Provider value={{ appLogo, setAppLogo }}>
            {children}
        </SettingsContext.Provider>
    );
};
