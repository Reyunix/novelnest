import { useState, useEffect } from "react";
import type { ApiResponse } from "../interfaces/interfaces";

interface Props {
  URL: string
  triggerInput: boolean
}

export const useFetch = ({URL, triggerInput}:Props) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!triggerInput){ return}

    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error("Ha ocurrido un error al cargar los usuarios");
        }
        const data: ApiResponse = (await response.json()) as ApiResponse;
        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocurrió un error inesperado");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [triggerInput]);

  return { data, loading, error };
};
