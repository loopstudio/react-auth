import React, { FormEvent, useState } from 'react';
import { useAuth } from '@loopstudio/react-auth';

export default function AuthForms() {
  // @ts-ignore
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<string>>([]);

  const onSignInSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    try {
      await signIn({
        email: target.email.value,
        password: target.password.value,
      });
    } catch (error) {
      setErrors(error.errors);
    }
  };

  const onSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const target = e.target as typeof e.target & {
      firstName: { value: string };
      lastName: { value: string };
      email: { value: string };
      password: { value: string };
    };
    try {
      await signUp({
        firstName: target.firstName.value,
        lastName: target.lastName.value,
        email: target.email.value,
        password: target.password.value,
      });
    } catch (error) {
      setErrors(error.errors);
    }
  };

  const toggleType = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <div>
      <h1>Sign In</h1>
      {errors.length > 0 && (
        <ul>
          {errors.map((error) => (
            <li>{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={isSignUp ? onSignUpSubmit : onSignInSubmit}>
        {isSignUp && (
          <div>
            <input placeholder="First Name" name="firstName" />
            <input placeholder="Last Name" name="lastName" />
          </div>
        )}
        <input placeholder="Email" name="email" type="email" />
        <input placeholder="Password" name="password" type="password" />
        <input type="submit" value={isSignUp ? 'Sign Up' : 'Sign In'} />
      </form>
      <div>
        {isSignUp ? (
          <span>
            Already have an account?{' '}
            <button onClick={toggleType}>Sign In</button>
          </span>
        ) : (
          <span>
            Don't have an account? <button onClick={toggleType}>Sign Up</button>
          </span>
        )}
      </div>
    </div>
  );
}
