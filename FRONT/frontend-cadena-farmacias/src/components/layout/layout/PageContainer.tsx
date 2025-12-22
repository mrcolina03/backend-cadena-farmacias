// src/components/layout/PageContainer.tsx

import React from 'react';
import Navbar from './Navbar';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;