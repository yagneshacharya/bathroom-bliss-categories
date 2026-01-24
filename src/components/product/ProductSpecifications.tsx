import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface Specification {
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specifications: Specification[];
}

const ProductSpecifications = ({ specifications }: ProductSpecificationsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Specifications
      </h3>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableBody>
            {specifications.map((spec, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}
              >
                <TableCell className="w-1/3 py-3 font-medium text-muted-foreground">
                  {spec.label}
                </TableCell>
                <TableCell className="py-3 text-foreground">
                  {spec.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductSpecifications;
