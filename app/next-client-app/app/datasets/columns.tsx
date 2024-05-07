"use client";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { archiveDataSets } from "@/api/datasets";
import { EyeNoneIcon, EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/error";
import { format } from "date-fns/format";

export const columns: ColumnDef<DataSet>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" sortName="id" />
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" sortName="name" />
    ),
    enableHiding: true,
    enableSorting: true,
  },
  {
    id: "Data Partner",
    accessorKey: "data_partner",
    accessorFn: (row) => row.data_partner.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Data Partner"
        sortName="data_partner"
      />
    ),
    enableHiding: true,
    enableSorting: true,
  },
  {
    accessorKey: "visibility",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Visibility"
        sortName="visibility"
      />
    ),
    enableHiding: true,
    enableSorting: true,
  },

  {
    id: "Creation Date",
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Creation Date"
        sortName="created_at"
      />
    ),
    enableHiding: true,
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return format(date, "MMM dd, yyyy h:mm a");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, hidden } = row.original;

      const handleArchive = async () => {
        const message = hidden ? "Unarchive" : "Archive";
        try {
          await archiveDataSets(id, !hidden);
          toast.success(`${message} ${row.original.name} succeeded.`);
        } catch (error) {
          const errorObj = JSON.parse((error as ApiError).message);
          toast.error(
            `${message} ${row.original.name} has failed: ${errorObj.detail}`,
          );
          console.error(error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleArchive}>
              {hidden ? "Unarchive" : "Archive"}
              {hidden ? (
                <EyeOpenIcon className="ml-auto" />
              ) : (
                <EyeNoneIcon className="ml-auto" />
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Details <Pencil2Icon className="ml-auto" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.name)}
            >
              Copy Dataset's Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    header: "Actions",
    enableHiding: false,
  },
];