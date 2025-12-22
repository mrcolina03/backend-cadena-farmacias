// src/components/ui/Input.tsx

import React from 'react';

// Define las propiedades que puede recibir el componente Input
// Usamos React.InputHTMLAttributes para incluir todas las propiedades estándar de un <input> (type, name, value, onChange, etc.)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Opcional para mostrar una etiqueta
  className?: string;
  error?: string; // Opcional para mostrar mensajes de error de validación
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, className = '', error, ...rest }, ref) => {
  return (
    <div className={`input-group ${className}`} style={{ marginBottom: '15px' }}>
      {/* Etiqueta opcional */}
      {label && <label htmlFor={rest.id || rest.name} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>}
      
      {/* Campo de input */}
      <input
        ref={ref} // Permite el uso de ref/forwardRef para formularios
        style={{
          width: '100%',
          padding: '10px',
          border: `1px solid ${error ? '#ff4d4f' : '#ccc'}`,
          borderRadius: '4px',
          boxSizing: 'border-box',
          fontSize: '1em'
        }}
        {...rest}
      />
      
      {/* Mensaje de error */}
      {error && <p style={{ color: '#ff4d4f', margin: '5px 0 0 0', fontSize: '0.85em' }}>{error}</p>}
    </div>
  );
});

// Es importante asignar el displayName para componentes que usan forwardRef
Input.displayName = 'Input'; 

export default Input;