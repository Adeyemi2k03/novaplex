import { Client, Account, ID } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

export const account = new Account(client);

export const signUp = async (name: string, email: string, password: string) => {
  await account.create(ID.unique(), email, password, name);
  return await signIn(email, password);
};

export const signIn = async (email: string, password: string) => {
  return await account.createEmailPasswordSession(email, password);
};

export const signOut = async () => {
  return await account.deleteSession('current');
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    // 401 is expected when not logged in — silently return null
    return null;
  }
};
