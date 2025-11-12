import { createContext, useContext, useState, ReactNode } from "react";

// Default fallback values
const defaultFields = ["id", "name", "age", "country", "salary"];
const defaultFieldTypes = {
  id: "number",
  name: "string",
  age: "number",
  country: "string",
  salary: "number",
} as const;

interface FieldTypesContextType {
  fields: string[];
  fieldTypes: Record<string, string>;
  setFields: (fields: string[]) => void;
  setFieldTypes: (fieldTypes: Record<string, string>) => void;
  resetToDefaults: () => void;
}

const FieldTypesContext = createContext<FieldTypesContextType | undefined>(
  undefined
);

export function FieldTypesProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<string[]>(defaultFields);
  const [fieldTypes, setFieldTypes] =
    useState<Record<string, string>>(defaultFieldTypes);

  const resetToDefaults = () => {
    setFields(defaultFields);
    setFieldTypes(defaultFieldTypes);
  };

  return (
    <FieldTypesContext.Provider
      value={{
        fields,
        fieldTypes,
        setFields,
        setFieldTypes,
        resetToDefaults,
      }}
    >
      {children}
    </FieldTypesContext.Provider>
  );
}

export function useFieldTypes() {
  const context = useContext(FieldTypesContext);
  if (context === undefined) {
    throw new Error("useFieldTypes must be used within a FieldTypesProvider");
  }
  return context;
}

