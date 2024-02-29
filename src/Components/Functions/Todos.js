import React from 'react'
import {useSelector,useDispatch} from "react-redux";
import { removeTodo } from '../Feauters/Todo/TodoSlice';
const Todos = () => {
   const todos= useSelector(state => state.todos)
   console.log(todos);
   const dispatch=useDispatch();
  return (
    <>
      <div>Todos</div>
      {todos.map((todo)=>(
         <li key={todo.id}>
            {todo.text}
            <button onClick={()=>dispatch(removeTodo(todo.id))}>X</button>

         </li>
      ))}
    </>
  )
}

export default Todos
