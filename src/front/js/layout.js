import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Signup } from "./pages/signup";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Landing } from "./pages/landing";

export const AppContext = React.createContext(null);

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    const [user, setUser] = useState({})

    const [toDo, setToDo] = useState([])

    const [userEmail, setUserEmail] = useState("")

    const [password, setPassword] = useState("")

    return (
        <div>
            <AppContext.Provider value={{ userEmail, setUserEmail, password, setPassword, user, setUser, toDo, setToDo }}>
                <BrowserRouter basename={basename}>
                    <ScrollToTop>
                        <Navbar />
                        <Routes>
                            <Route element={<Landing />} path="/" />
                            <Route element={<Home />} path="/home" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<Single />} path="/single/:theid" />
                            <Route element={<h1>Not found!</h1>} />
                        </Routes>
                        <Footer />
                    </ScrollToTop>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
};

export default injectContext(Layout);
