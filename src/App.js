
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [duzenlemeVarMi, setDuzenlemeVarMi] = useState(false);
  const [duzenlenecekTodo,setDuzenlenecekTodo]=useState(null)
  const [duzenlenecekTitle,setDuzenlenecekTitle]=useState("")

  const todoSil = (id) => {
    axios
      .delete(`http://localhost:3005/todos/${id}`)
      .then((response) => {
        setResult(true);
        setResultMessage("Todo was deleted succesfully.");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("An error occured!");
      });
  };

  const changeTodosCompleted = (todo) => {
    console.log(todo);
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };
    axios
      .put(`http://localhost:3005/todos/${todo.id}`, updatedTodo)
      .then((response) => {
        setResult(true);
        setResultMessage("Todo was updated successfully.");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("An error occured!");
      });
  };

  

  useEffect(() => {
    axios
      .get("http://localhost:3005/todos")
      .then((response) => {
        console.log(response.data);
        setTodolar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [result]);

  const formuDenetle = (event) => {
    event.preventDefault();
    //validation
    if (title === "") {
      alert("Todo cannot be left blank.");
      return;
    }
    //create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false,
    };

    axios
      .post("http://localhost:3005/todos", newTodo)
      .then((response) => {
        setTitle("");
        setResult(true);
        setResultMessage("Todo cretaed succesfully.");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("An error occured!");
      });
  };

  const todoGuncelleFormunuDenetle=(event)=>{
    event.preventDefault()
    //validation
    if(duzenlenecekTitle === ""){
      alert("Todo cannot be left blank!")
      return
    }
    // update todo and send server
    const updatedTodo={
      ...duzenlenecekTodo,
      title: duzenlenecekTitle
    }
    axios.put(`http://localhost:3005/todos/${duzenlenecekTodo.id}`,updatedTodo)
    .then((response)=>{
      setResult(true)
      setResultMessage("Todo was updated succesfully.")
      setDuzenlemeVarMi(false)
    })
    .catch((error)=>{
      setResult(true)
      setResultMessage("An error occured!")
    })
  }

  if (todolar === null) {
    return null;
  }

  return (
    <div className="container">
      {result === true && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}>
          <div className="alert alert-success" role="alert">
            <p>{resultMessage}</p>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => setResult(false)}
                className="btn btn-sm btn-outline-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="row my-5">
        <form onSubmit={formuDenetle}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type your todo..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
      {duzenlemeVarMi === true && (
        <div className="row m-5">
          <form onSubmit={todoGuncelleFormunuDenetle}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Type your todo..."
                value={duzenlenecekTitle}
                onChange={(event)=>setDuzenlenecekTitle(event.target.value)}
              />
              <button
                onClick={() => setDuzenlemeVarMi(false)}
                className="btn btn-danger"
               >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      )}
      {todolar.map((todo) => (
        <div
          key={todo.id}
          className="alert alert-secondary d-flex justify-content-between align-items-center"
          role="alert">
          <div>
            <h1
              style={{
                textDecoration:
                  todo.completed === true ? "line-through" : "none",
                color: todo.completed === true ? "red" : "black",
              }}>
              {todo.title}
            </h1>
            <p>{new Date(todo.date).toLocaleString()}</p>
          </div>
          <div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                onClick={() => {
                  setDuzenlemeVarMi(true);
                  setDuzenlenecekTodo(todo)
                  setDuzenlenecekTitle(todo.title)
                }}
                type="button"
                className="btn btn-sm btn-warning">
                Edit
              </button>
              <button
                onClick={() => todoSil(todo.id)}
                type="button"
                className="btn btn-sm btn-danger">
                Delete
              </button>
              <button
                onClick={() => changeTodosCompleted(todo)}
                type="button"
                className="btn btn-sm btn-primary">
                {todo.completed === true ? "Undone" : "Done"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
