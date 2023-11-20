'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import type { ProposalInfo } from '@/api/requests';

export const columns: ColumnDef<ProposalInfo>[] = [
  {
    accessorKey: 'title',
    header: () => <div className="text-xs">Title</div>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
          <span className="text-muted-foreground">by {row.original.proposer}</span>
        </div>
      );
    },
  },
  // },
  // {
  //   accessorKey: '',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Voting Date" />,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {/* {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />} */}
  //         <span>{new Date(row.getValue('votingDate')).toUTCString()}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: 'votingDeadline',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Voting Deadline" />,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {/* {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />} */}
  //         <span>{new Date(row.getValue('votingDeadline')).toUTCString()}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: 'votesFor',
    accessorFn: (row) => row.votes.pro,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Votes For" />,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <span className="text-primary-foreground">{row.getValue('votesFor')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'votesAgainst',
    accessorFn: (row) => row.votes.contra,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Votes Against" />,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <span className="text-destructive-foreground">{row.getValue('votesAgainst')}</span>
        </div>
      );
    },
  },
];
