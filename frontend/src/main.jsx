import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { setupInterceptors } from './api/axios';
import App from './App';
import './index.css';

setupInterceptors(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider makes the Redux store available to every component (useSelector, useDispatch) */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
