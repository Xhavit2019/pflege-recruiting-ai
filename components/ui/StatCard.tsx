import Card from "./Card";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <Card className="transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="rounded-xl bg-slate-100 p-3">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}