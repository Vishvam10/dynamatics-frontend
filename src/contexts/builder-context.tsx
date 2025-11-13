import { createContext, useContext, useState, type ReactNode } from "react";

interface BuilderContextValue {
  nodeFieldsTypeMap: Record<string, any>;
  setNodeFieldsTypeMap: (map: Record<string, any>) => void;
  executedFlowData: any[];
  setExecutedFlowData: (data: any[]) => void;
  flowUid: string;
  setFlowUid: (uid: string) => void;
}

const BuilderContext = createContext<BuilderContextValue | undefined>(
  undefined
);

export const BuilderProvider = ({ children }: { children: ReactNode }) => {
  const [nodeFieldsTypeMap, setNodeFieldsTypeMap] = useState({});
  const [executedFlowData, setExecutedFlowData] = useState<any[]>([]);
  const [flowUid, setFlowUid] = useState<string>("");
  
  return (
    <BuilderContext.Provider
      value={{
        nodeFieldsTypeMap,
        setNodeFieldsTypeMap,
        executedFlowData,
        setExecutedFlowData,
        flowUid,
        setFlowUid,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context)
    throw new Error("useBuilder must be used within BuilderProvider");
  return context;
};
