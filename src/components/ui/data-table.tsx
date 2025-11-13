import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData> {
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData extends Record<string, any>>({
  data,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showColumnFilter, setShowColumnFilter] = React.useState(false);

  const columns = data[0] ? Object.keys(data[0]) : [];
  
  // Initialize selected columns with first 5 columns by default
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(() => 
    columns.slice(0, 5)
  );

  // Update selected columns when data changes
  React.useEffect(() => {
    if (columns.length > 0 && selectedColumns.length === 0) {
      setSelectedColumns(columns.slice(0, 5));
    }
  }, [columns]);

  // Get visible columns based on selection
  const visibleColumns = React.useMemo(() => {
    return selectedColumns.filter((col) => columns.includes(col));
  }, [selectedColumns, columns]);

  // Toggle column selection
  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  // Select/Deselect all columns
  const toggleAllColumns = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns(columns.slice(0, 5));
    } else {
      setSelectedColumns(columns);
    }
  };

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((row) =>
      visibleColumns.some((col) =>
        String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, visibleColumns]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColumnFilter && !target.closest('.column-filter-container')) {
        setShowColumnFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnFilter]);

  // Function to safely render cell values
  const renderCellValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return Array.isArray(value)
        ? JSON.stringify(value)
        : JSON.stringify(value);
    }
    return value ?? "";
  };

  return (
    <div className="space-y-2">
      {/* Search Bar and Column Filter */}
      <div className="flex gap-2 items-start">
        <Input
          placeholder="Search all columns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm text-xs h-8"
        />
        <div className="relative column-filter-container">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnFilter(!showColumnFilter)}
            className="h-8 text-xs whitespace-nowrap"
          >
            Columns ({selectedColumns.length}/{columns.length})
          </Button>
          
          {/* Column Filter Dropdown */}
          {showColumnFilter && (
            <div className="absolute right-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
              <div className="p-2 border-b sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Select Columns</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAllColumns}
                    className="h-6 text-xs px-2"
                  >
                    {selectedColumns.length === columns.length ? "Reset" : "All"}
                  </Button>
                </div>
              </div>
              <div className="p-2 space-y-1">
                {columns.map((column) => (
                  <label
                    key={column}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => toggleColumn(column)}
                      className="rounded"
                    />
                    <span className="truncate">{column}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded overflow-x-auto overflow-y-auto max-h-80 max-w-full">
        <Table className="text-xs min-w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHead key={col} className="font-semibold whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <TableRow key={i}>
                  {visibleColumns.map((col) => (
                    <TableCell key={col} className="py-1 whitespace-nowrap">
                      {renderCellValue(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length || 1}
                  className="h-24 text-center text-gray-400"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            results
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="h-7 px-2 text-xs"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="h-7 px-2 text-xs"
            >
              Previous
            </Button>
            <div className="flex items-center px-2">
              Page {currentPage + 1} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage >= totalPages - 1}
              className="h-7 px-2 text-xs"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="h-7 px-2 text-xs"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

