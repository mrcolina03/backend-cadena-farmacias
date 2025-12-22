// src/components/layout/Navbar.tsx

import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav style={{ padding: '10px', background: '#333', color: 'white' }}>
      <a href="/ventas" style={{ color: 'white', marginRight: '15px' }}>Ventas (CRUD)</a>
      <a href="/reportes" style={{ color: 'white' }}>Reportes (Dashboard)</a>
    </nav>
  );
};

export default Navbar;