import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { AppContext } from "../layout";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {

	// const { user, setUser, } = useContext(AppContext);

	const { userEmail, setUserEmail, password, setPassword, user, setUser, toDo, setToDo } = useContext(AppContext);

	const [inputValue, setInputValue] = useState("")

	var navigate = useNavigate()



	const addItem = (item) => {
		var newList = [...toDo, item];
		setToDo(newList);
		setInputValue("");

	}

	useEffect(() => {
		// Whatever you code here will execute only after the first time the component renders
		if (user.id) {
			fetch(`https://miniature-capybara-rrrpgrw999jcpjpj-3001.app.github.dev/api/todos/user/${user.id}`)
				.then(response => {
					if (!response.ok) {
						throw Error(response.statusText);
					}
					// Read the response as JSON
					return response.json();
				})
				.then(responseAsJson => {
					// Do stuff with the JSONified response
					console.log(responseAsJson);
					setToDo(responseAsJson)
				})
				.catch(error => {
					console.log('Looks like there was a problem: \n', error);
				});
		}


	}, [user]);

	const addTask = () => {
		if (inputValue && user.email) {
			fetch(`https://miniature-capybara-rrrpgrw999jcpjpj-3001.app.github.dev/api/todos/${user.id}`, {
				method: 'POST', // or 'PUT'
				body: JSON.stringify(
					{
						"task": inputValue,
						"done": false
					}
				), // data can be a 'string' or an {object} which comes from somewhere further above in our application
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => {
					if (!res.ok) throw Error(res.statusText);
					return res.json();
				})
				.then(responseAsJson => {
					setToDo(responseAsJson);
					setInputValue("")
					console.log('Success:', responseAsJson)
				})
				.catch(error => console.error(error));

		}


	}

	const deleteTask = async (toDo_id) => {
		const response = await
			fetch(`https://miniature-capybara-rrrpgrw999jcpjpj-3001.app.github.dev/api/todos/user/${user.id}/${toDo_id}`, {
				method: 'DELETE',
			});
		if (response.ok) {
			const data = await response.json();
			setToDo(data.results)
			return data;
		} else {
			console.log('error: ', response.status, response.statusText);
			/* Handle the error returned by the HTTP request */
			return { error: { status: response.status, statusText: response.statusText } };
		};
	};

	const toggleDone = (doneStatus, todo_id) => {
		var flipStatus = !doneStatus
		console.log(flipStatus)

		fetch(`https://miniature-capybara-rrrpgrw999jcpjpj-3001.app.github.dev/api/todos/user/${user.id}/${todo_id}`, {
			method: 'PUT', // or 'POST'
			body: JSON.stringify(
				{
					"done": flipStatus
				}
			), // data can be a 'string' or an {object} which comes from somewhere further above in our application
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => {
				if (!res.ok) throw Error(res.statusText);
				return res.json();
			})
			.then(responseAsJson => {
				setToDo(responseAsJson.results)
			})
			.catch(error => console.error(error));

	}

	const handleLogout = () => {
		setUser({})
		navigate("/")
	}




	if (user.email) {
		var emailFields = user.email.split('@')
		var justEmailName = emailFields[0];
	}

	else {
		var justEmailName = ""
	}






	return (
		<div className="row d-flex justify-content-center">
			<div className="col-5 bg-light text-center myDiv">
				<div className="row d-flex justify-content-between text-wrap">
					<div className="col text-break userEmail text-capitalize fst-italic"
						style={user.email ? { display: "inline" } : { display: "none" }}>{justEmailName}</div>
					<div className="col text-break userEmail text-capitalize fst-italic"
						style={user.email ? { display: "none" } : { display: "block" }}></div>
					<div className="col text-break logout text-capitalize fst-italic"
						style={user.email ? { display: "inline" } : { display: "none" }}
						onClick={() => handleLogout()}
					>Logout</div>
					<div className="col text-break logout text-capitalize fst-italic"
						style={user.email ? { display: "none" } : { display: "block" }}></div>
				</div>
				<div className="row d-flex justify-content-center text-wrap">
					<div className="col-7"><h2 className="text-secondary pt-2">ToDos</h2></div>
				</div>
				{user.email ?
					<div className="row d-flex justify-content-start">
						<div className="col-12">
							<input className="myInput" placeholder="New ToDo"
								type="text" onChange={e => setInputValue(e.target.value)} value={inputValue}
								onKeyDown={(e) => {
									if (e.key === "Enter")
										addTask(inputValue)
								}}
							/>

						</div>
						{toDo.length ?
							toDo.map((elm, ind) => {
								return (
									<>
										<div
											className="col-12 py-2 border-top text-start fs-5 listRow px-3 pe-3 text-wrap"
											style={{ textDecoration: elm.done ? "line-through" : "none" }}
											key={elm.id}>
											{elm.task}
											<i className="fa-solid fa-square-xmark float-end xOut fs-3"
												onClick={() => deleteTask(elm.id)}
											></i>
											<span className="float-end asDone fs-7 pe-3 me-5 pt-1"
												onClick={() => toggleDone(elm.done, elm.id)}
											>mark as done</span>
										</div>
									</>
								)
							}
							) :
							<div
								className="col-12 py-2 border-top text-start fs-5 listRow px-3">
								Create Your First ToDo Above
							</div>
						}
					</div> :
					<div className="row d-flex justify-content-center text-wrap">
						<div className="col warning">
							<h5 className="text-secondary pt-2">You Must</h5>
							<h5 className="pt-2 createAccount2 fw-bolder"
								onClick={() => navigate("/signup")}
							>
								<i className="fa-solid fa-right-long"></i>  Create An Account  <i className="fa-solid fa-left-long"></i></h5>
							<h5 className="text-secondary pt-2">to add ToDos</h5>
						</div>
					</div>
				}
			</div>
		</div>
	);
};
