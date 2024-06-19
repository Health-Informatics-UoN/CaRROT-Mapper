"use client";
import { DataTable } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
import { addConceptsToResults } from "@/lib/concept-utils";
import { columns } from "./columns";
import { useMemo, useState } from "react";

interface ScanReportsValueProps {
  scanReportsValues: ScanReportValue[];
  scanReportsConcepts: ScanReportConcept[];
  conceptsFilter: Concept[];
  permissions: PermissionsResponse;
  scanReportsCount: number;
}

export function DataTableTest({
  scanReportsValues,
  scanReportsConcepts,
  conceptsFilter,
  permissions,
  scanReportsCount,
}: ScanReportsValueProps) {
  const [loading, setLoading] = useState(false);

  const defaultPageSize = 30;
  const filter = <DataTableFilter filter="value" filterText="value" />;
  const memoizedColumns = useMemo(
    () => columns(loading, setLoading),
    [loading, setLoading]
  );
  const scanReportsResult = addConceptsToResults(
    scanReportsValues,
    scanReportsConcepts,
    conceptsFilter,
    permissions
  );

  return (
    <div>
      <DataTable
        columns={memoizedColumns}
        data={scanReportsResult}
        count={scanReportsCount}
        Filter={filter}
        clickableRow={false}
        defaultPageSize={defaultPageSize}
      />
    </div>
  );
}
