import { useCallback, useEffect, useState } from "react";
import { getStudents } from "../services/studentService";

export function useStudents(enabled) {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const refreshStudents = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setError("");
      setStudents(await getStudents());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load students"
      );
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let cancelled = false;

    getStudents()
      .then((data) => {
        if (!cancelled) {
          setError("");
          setStudents(data);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message || "Unable to load students"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return {
    students,
    setStudents,
    refreshStudents,
    studentsError: error,
  };
}
