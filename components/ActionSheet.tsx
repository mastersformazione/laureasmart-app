"use client";

import Button from "@/components/ui/Button";

type Props = {
  title: string;
  description: string;
  actions: string[];
  onAction: (action: string) => void;
};

export default function ActionSheet({
  title,
  description,
  actions,
  onAction,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-6 space-y-3">
          {actions.map((action) => (
            <Button
              key={action}
              label={action}
              onClick={() => onAction(action)}
              variant={action === "Home" ? "danger" : "secondary"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
