import { useAuth } from '@loopstudio/react-auth';

export default function Welcome() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.firstName}!</h1>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}
