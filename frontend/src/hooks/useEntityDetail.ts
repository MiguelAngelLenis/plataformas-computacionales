"use client";

import { useCallback, useEffect, useState } from "react";

// Hook genérico para consultar cualquier entidad que tenga un método getById(id).
// Evita duplicar los estados entity, loading y error en cada ruta dinámica.
export function useEntityDetail<T>(id: string, getById: (id: string) => Promise<T>) {
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setEntity(await getById(id));
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }, [getById, id]);

  useEffect(() => {
    // La promesa programa la carga después del render inicial.
    void Promise.resolve().then(load);
  }, [load]);

  return { entity, loading, error, reload: load };
}
