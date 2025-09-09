import { useState } from "react";
import { Header } from "./pages/Header";
import { Footer } from "./pages/Footer";
import { MainContent } from "./pages/MainContent";

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header></Header>
      <MainContent></MainContent>
      <Footer></Footer>
    </>
  );
}

export default App;
