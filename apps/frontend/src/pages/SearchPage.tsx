import { useEffect, useState } from "react";
import { BookCard } from "../components/BookCard";
import { useFetch } from "../hooks/useFetch";

export const SearchPage = () => {
  const [queryInput, setQueryInput] = useState("");
  const [triggerInput, setTriggerInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const API_KEY = String(import.meta.env.VITE_API_KEY);
  const API_BASE_URL = String(import.meta.env.VITE_BASE_URL);
  const API_FIELD =  String(import.meta.env.VITE_URL_FIELD)

  const URL = `${API_BASE_URL}${API_FIELD}&q=${queryInput}&startIndex=0&maxResults=40&printType=books&orderBy=newest&key=${API_KEY}`;

  const { data, loading, error } = useFetch({URL:URL, triggerInput:triggerInput});

  const handleQueryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const encoded = encodeURIComponent(query.trim());
    setQueryInput(encoded);
    setInputValue(query);
  };

  const querySubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && queryInput) {
      setTriggerInput((prev) => !prev);
      setInputValue("");
    }
  };

  useEffect(() => {
    setTriggerInput(false);
    setQueryInput("")
  }, [loading]);

  console.log(triggerInput);
  console.log(error);
  console.log(data);
  console.log(URL)

  return (
    <div className="search-page-layout">
      <input
        value={inputValue}
        type="text"
        className="search-bar"
        onChange={(event) => {
          handleQueryInput(event);
        }}
        onKeyDown={(event) => {
          querySubmit(event);
        }}
      />
      <section className="grid-layout">
        {loading && <span className="centered-self">Cargando...</span>}
        {error && <span>Error</span>}
        {data
          ? data.items.map((bookItem) => {
              return <BookCard bookItem={bookItem} />;
            })
          : !loading && <span>No hay usuarios</span>}
      </section>
    </div>
  );
};
