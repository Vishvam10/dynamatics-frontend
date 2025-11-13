import { createContext, useContext, useState, type ReactNode } from "react";

interface BuilderContextType {
  nodeFieldsTypeMap: Record<string, any>;
  setNodeFieldsTypeMap: (map: Record<string, any>) => void;
  executedFlowData: any[];
  setExecutedFlowData: (data: any[]) => void;
  flowName: string;
  setFlowName: (name: string) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context)
    throw new Error("useBuilder must be used within BuilderProvider");
  return context;
};

export const BuilderProvider = ({ children }: { children: ReactNode }) => {
  const [executedFlowData, setExecutedFlowData] = useState<any[]>([]);
  const [flowName, setFlowName] = useState("");
  const [nodeFieldsTypeMap, setNodeFieldsTypeMap] = useState<
    Record<string, any>
  >({});

  return (
    <BuilderContext.Provider
      value={{
        nodeFieldsTypeMap,
        setNodeFieldsTypeMap,
        executedFlowData,
        setExecutedFlowData,
        flowName,
        setFlowName,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
