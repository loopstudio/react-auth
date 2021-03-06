import { useAuth } from '@loopstudio/react-auth';
import AuthForms from './components/AuthForms';
import Welcome from './components/Welcome';

const App = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return isAuthenticated ? <Welcome /> : <AuthForms />;
};

export default App;
