declare global {
    interface Window {
        UnicornStudio?: {
            init: () => void;
            isInitialized?: boolean;
        };
    }
}
declare function App(): import("react/jsx-runtime").JSX.Element;
export default App;
