import { useEffect, useState } from "react";

export default function usePersist() {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
}
