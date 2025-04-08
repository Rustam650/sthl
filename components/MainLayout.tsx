import React, { ReactNode } from 'react';
import Layout from './Layout';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <div className="container">
        {children}
      </div>
    </Layout>
  );
};

export default MainLayout; 