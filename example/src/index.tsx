import ReactDOM from 'react-dom';
import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { AuthProvider } from '@loopstudio/react-auth';
import App from './App';

const httpClient = axios.create({
  baseURL: 'https://rails-api-boilerplate.herokuapp.com/api/v1',
  headers: { accept: 'application/json' },
  params: {},
});

applyCaseMiddleware(httpClient);

ReactDOM.render(
  <AuthProvider httpClient={httpClient}>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
