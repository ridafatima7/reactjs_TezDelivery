import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Store } from "../src/Components/Example/Store";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      {/* <Todos />
 <AddTodo />  */}
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
