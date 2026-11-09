import type { ComponentPropsWithoutRef, FormEvent, ReactNode } from "react";

// Reutiliza la apariencia base de todos los <input> sin ocultar sus props nativas.
export function FormInput({ className = "", ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={`border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none ${className}`} {...props} />;
}

// Igual que FormInput, pero para los campos <select>.
export function FormSelect({ className = "", children, ...props }: ComponentPropsWithoutRef<"select">) {
  return <select className={`border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none ${className}`} {...props}>{children}</select>;
}

// El formulario recibe la acción desde su página. Así el componente visual no conoce ningún servicio HTTP.
export function FormPanel({ children, onSubmit, className = "" }: {
  children: ReactNode;
  onSubmit: () => void | Promise<void>;
  className?: string;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    // Evita que el navegador recargue la página al enviar el formulario.
    event.preventDefault();
    void onSubmit();
  }

  return <form onSubmit={submit} className={className}>{children}</form>;
}
