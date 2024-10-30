import { createContext } from "react";

const SessionContext = createContext();

export const SessionProvider = SessionContext.Provider;

export default SessionContext;
