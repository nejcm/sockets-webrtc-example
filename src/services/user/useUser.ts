import { useCallback, useState } from 'react';
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface useUserResponse {
  user: User | undefined;
  setUser: (values: Partial<User>) => void;
}

const KEY = 'user';

export const useUser = (): useUserResponse => {
  const [user, setUserState] = useState<User | undefined>(
    JSON.parse(localStorage.getItem(KEY) || ''),
  );

  const setUser = useCallback(
    (values: Partial<User>): void => {
      setUserState((prev) => {
        const newUser = { ...prev, ...values } as User;
        localStorage.setItem(KEY, JSON.stringify(newUser));
        return newUser;
      });
    },
    [setUserState],
  );

  return { user, setUser };
};
