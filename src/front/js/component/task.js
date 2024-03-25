import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Task = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="row d-flex justify-content-center">
            <div className="col-6 bg-light text-center">
                <h1>ToDo List</h1>
            </div>


        </div>
    );
};