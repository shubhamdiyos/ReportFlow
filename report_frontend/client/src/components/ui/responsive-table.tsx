import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <Card className={cn("border rounded-md", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            {children}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResponsiveTableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTableWrapper({ children, className }: ResponsiveTableWrapperProps) {
  return (
    <div className={cn("border rounded-md overflow-x-auto", className)}>
      {children}
    </div>
  );
}