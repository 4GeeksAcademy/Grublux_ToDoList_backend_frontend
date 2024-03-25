import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";
import { AppContext } from "../layout";

export const Signup = () => {
    const { userEmail, setUserEmail, password, setPassword, user, setUser } = useContext(AppContext);

    var navigate = useNavigate();

    const [showSignup, setShowSignup] = useState(false)



    const handleAddUser = () => {
        // setUser(user);
        if (userEmail) {
            fetch(`https://miniature-capybara-rrrpgrw999jcpjpj-3001.app.github.dev/api/user/adduser/${userEmail}`, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(
                    { "password": password }
                ), // data can be a 'string' or an {object} which comes from somewhere further above in our application
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // return the response as JSON
                    return response.json();
                })
                .then(responseAsJson => {
                    if (responseAsJson == "User already exists!") {
                        alert("User already exists!")
                        // navigate('/nulluser');
                        setPassword("");
                        setUserEmail("")
                        console.log("User already exists!")
                    }
                    else {
                        setUser(responseAsJson.results)
                        navigate('/home')
                    }
                })
                .then(() => {
                    setPassword("");
                    setUserEmail("")
                }
                )
        }
    }



    return (
        <div className="row  d-flex justify-content-center">
            <div className="col-5 myDiv bg-light text-center">
                <h1 className="text-secondary pt-2">Create Account</h1>
                <div className="mb-1">
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        placeholder="Enter Email" required
                        onChange={e => setUserEmail(e.target.value)} value={userEmail}
                    />
                    <div id="emailHelp" className="form-text py-1 mt-1"
                        style={showSignup ? { display: "none" } : { display: "block" }}
                    ><p className="py-1">We'll never share your email with anyone else.</p></div>
                    <div className="form-text py-1 mt-1" style={showSignup ? { display: "block" } : { display: "none" }}>
                        <p className="warning py-1"
                            onClick={() => navigate("/signup")}
                        >User does not exist.<span className="createAccount ps-3"> Create an account</span></p>
                    </div>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" required
                        onChange={e => setPassword(e.target.value)} value={password}
                    />
                </div>
                <button type="text" className="btn btn-secondary"
                    onClick={() => handleAddUser()}
                >Submit</button>
            </div>
        </div>
    );
};