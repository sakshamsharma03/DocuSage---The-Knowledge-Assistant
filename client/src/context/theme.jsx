// import React,{createContext,useState,useContext, Children} from 'react';


// const ThemeContext =createContext();

// export const useTheme=()=> useContext(ThemeContext);


// export const ThemeProvider=({Children})=>{
//     const [theme,setTheme]=useState('light');

//     const toggleTheme=()=>{
//         setTheme((prevTheme)=>(prevTheme==='light'?'dark':'light'))
//     };
//     return (
//         <ThemeContext.Provider value={{theme,toggleTheme}}>
//             {Children}
//         </ThemeContext.Provider>
//     )
// }

import React, { createContext, useState, useContext } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // Manage the theme state ('light' or 'dark')
  const [theme, setTheme] = useState('light');

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
