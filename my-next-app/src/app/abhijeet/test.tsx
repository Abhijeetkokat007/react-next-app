'use client';

import React from 'react';

// Define an interface for the component props
interface TestProps {
  name: string;
  age?: number; // Optional prop with ?
  onSubmit: (data: string) => void;
}

// Define an interface for user data
interface UserData {
  id: number;
  username: string;
  isActive: boolean;
}

// Use the props interface in the component
const Test: React.FC<TestProps> = ({ name, age, onSubmit }) => {
  // Type annotation for state
  const [count, setCount] = React.useState<number>(0);
  
  // Example user data with type safety
  const userData: UserData = {
    id: 1,
    username: name,
    isActive: true
  };

  // Function with type annotations
  const handleClick = (): void => {
    setCount(prev => prev + 1);
    onSubmit(userData.username);
  };

  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
      <p>Click count: {count}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default Test;