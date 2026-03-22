// Temporary module declaration for AsyncStorage types if they are not detected by TypeScript.
// This prevents "Cannot find module" errors. If the package adds proper types later,
// you can remove this file.
declare module "@react-native-async-storage/async-storage" {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    // allow any additional members
    [key: string]: any;
  };
  export default AsyncStorage;
}

