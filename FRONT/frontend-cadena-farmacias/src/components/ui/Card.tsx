// src/components/ui/Card.tsx

import React from 'react';

// Define las propiedades que puede recibir el componente Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // 'children' es el contenido que se colocará dentro de la Card
  children: React.ReactNode;
  
  // 'className' para estilos personalizados opcionales
  className?: string;

  // 'title' opcional si la tarjeta necesita un encabezado
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, ...rest }) => {
  return (
    <div
      className={`card ${className}`} // Aplica la clase base 'card' y las clases adicionales
      style={{
        padding: '15px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        backgroundColor: 'white',
        ...rest.style // Permite pasar estilos en línea
      }}
      {...rest}
    >
      {title && <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;