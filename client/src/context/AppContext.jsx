import {createContext, useState} from 'react';


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [showStudentLogin, setShowStudentLogin] = useState(false)

    const [isLoggedIn, setIsLoggedIn] = useState(false)


    const value = {
        showStudentLogin, setShowStudentLogin,
        isLoggedIn, setIsLoggedIn
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}