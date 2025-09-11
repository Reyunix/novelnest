import { useState, useEffect } from "react";
import type { ApiResponse } from "../interfaces/interfaces";
export const useFetch = (url: string) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(url);
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
  }, []);

  return { data, loading, error };
};
