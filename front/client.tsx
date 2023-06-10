import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SWRDevTools from '@jjordy/swr-devtools';

import App from '@layouts/App';

const root = createRoot(document.getElementById('app') as HTMLElement);

const app =
  process.env.NODE_ENV === 'development' ? (
    <SWRDevTools>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SWRDevTools>
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

root.render(app);
