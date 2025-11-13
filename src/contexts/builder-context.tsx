import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

interface BuilderContextType {
  nodeFieldsTypeMap: Record<string, any>;
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

  const nodeFieldsTypeMap = useMemo(
    () => [{ name: "field1" }, { name: "field2" }],
    []
  );

  return (
    <BuilderContext.Provider
      value={{
        nodeFieldsTypeMap,
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
