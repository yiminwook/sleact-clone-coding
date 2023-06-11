import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SWRDevTools from '@jjordy/swr-devtools';
import App from '@layouts/App';
import axios from 'axios';

const root = createRoot(document.getElementById('app') as HTMLElement);
const isDevelopment = process.env.NODE_ENV === 'development';

const app = isDevelopment ? (
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
