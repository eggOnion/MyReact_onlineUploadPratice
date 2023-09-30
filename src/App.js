import "./App.css";
import SimpleForm from "./components/SimpleForm";

function App() {
  return (
    <div className="App">
      <h3>{process.env.REACT_APP_MESSAGE}</h3>
      <SimpleForm />
      <footer>Current Env: {process.env.NODE_ENV}</footer>
    </div>
  );
}

export default App;
