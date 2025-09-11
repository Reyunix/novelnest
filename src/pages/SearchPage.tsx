import { useEffect, useState } from "react";
import { BookCard } from "../components/BookCard";
import { useFetch } from "../hooks/useFetch";
import type { fetchType } from "../interfaces/interfaces";

export const SearchPage = () => {
  const [queryInput, setQueryInput] = useState("");
  const [apiResponse, setApiResponse] = useState<fetchType | undefined>(undefined)
  const [triggerInput, setTriggerInput] = useState(false)

  const API_KEY = String(import.meta.env.VITE_API_KEY);
  const API_BASE_URL = String(import.meta.env.VITE_BASE_URL);

  const url = `${API_BASE_URL}${queryInput}&key=${API_KEY}`;

  const { data, loading, error } = apiResponse;

  const handleQueryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const encodedUrlQueryInput = encodeURIComponent(query.trim());
    setQueryInput(encodedUrlQueryInput);
  };

  const querySubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (event.key === "Enter" && queryInput){
      setTriggerInput(true)
    }

  }

  useEffect(()=>{
    const response = useFetch(url !== "" ? url : null)
    setApiResponse(response)
    setTriggerInput(false)
  },[triggerInput])
  console.log("trigger: ",triggerInput);

  return (
    <div className="search-page-layout">
      <input
        type="text"
        className="search-bar"
        onChange={(event) => {
          handleQueryInput(event);
        }}
        onKeyDown={(event) =>{querySubmit(event)}}
      />
      <section className="grid-layout">
        {loading && <span>Cargando...</span>}
        {error && <span key="2">Error</span>}
        {data
          ? data.items.map((bookItem) => {
              return <BookCard bookItem={bookItem} />;
            })
          : !loading && <span key="3">No hay usuarios</span>}
      </section>
    </div>
  );
};
