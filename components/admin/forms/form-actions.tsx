import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  isPending: boolean;
  submitText: string;
  onCancel: () => void;
  viewUrl?: string;
  className?: string;
}

export function FormActions({
  isPending,
  submitText,
  onCancel,
  viewUrl,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border border-border bg-card p-6",
        className
      )}
    >
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {isPending ? "SAVING..." : submitText}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-border font-mono text-primary"
        >
          CANCEL
        </Button>
      </div>
      {viewUrl && (
        <Button
          type="button"
          variant="outline"
          className="border-border font-mono text-primary"
          asChild
        >
          <Link href={viewUrl}>
            <Eye />
          </Link>
        </Button>
      )}
    </div>
  );
}
