import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { PageLink } from './utils/links';
import MainPage from './pages/main/main';
import NotFoundPage from './pages/not-found/not-found';
import styled from '@emotion/styled';
import { NavigationMenu } from './components/navigation-menu/navigation-menu';

const AppContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
`;

function AppRoutes() {
    return useRoutes(
        [
            {path: PageLink.main, element: <MainPage />},
            {path: '*', element: <NotFoundPage />}
        ]
    );
}

const App = () => {
  return (
      <AppContainer>
          <BrowserRouter>
              <NavigationMenu />
              <AppRoutes />
          </BrowserRouter>
      </AppContainer>
  );
}

export default App;
