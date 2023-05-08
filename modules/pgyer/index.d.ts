import App from "./App";
declare class Pgyer {
    private apiKey;
    app: App | null;
    private static instance;
    static getInstance(apiKey: string): Pgyer;
    private constructor();
}
export default Pgyer;
