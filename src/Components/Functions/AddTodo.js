import React,{useState,useEffect} from 'react'
import {useDispatch} from "react-redux";
import {addTodo} from "../Feauters/Todo/TodoSlice";
const AddTodo = () => {
    const dispatch=useDispatch();
    const [input,setInput]=useState("");
    const addTodoHandler=(e)=>{
        e.preventDefault();
        dispatch(addTodo(input));
        setInput("");
    }

  return (
    <div>
       <form onSubmit={addTodoHandler}>
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default AddTodo
