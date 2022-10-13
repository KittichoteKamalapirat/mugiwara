import Install from "./components/Install";
import Home from "./components/Home";

function App() {
  console.log("window", window.ethereum);
  console.log("hi");
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}

export default App;
