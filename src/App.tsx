import { Route, Routes } from "react-router";
import { DetailPage } from "@/components/DetailPage";
import { HomePage } from "@/components/HomePage";
import { PokemonContext } from "@/Providers/PokemonProvider";
import "@/index.css";
import { useState } from "react";

function App() {
  const [max, setMax] = useState<number>(1000);

  return (
    <PokemonContext.Provider value={{ max, setMax }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
      </Routes>
    </PokemonContext.Provider>
  );
}

export default App;
