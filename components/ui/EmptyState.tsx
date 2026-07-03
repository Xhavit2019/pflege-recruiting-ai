import type { ReactNode } from "react";
import Card from "./Card";
import Button from "./Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}

      <h2 className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-slate-600">
          {description}
        </p>
      )}

      {actionLabel && actionHref && (
        <div className="mt-4">
          <Button href={actionHref}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}