"use client"
import type { ReactNode } from "react";
type Group<T = any> = {
  id?: string | number;
  name: string;
  direccion?: string;
  items: T[];
};

type Props<T = any> = {
  groups: Array<Group<T>>;
  renderItem: (item: T) => ReactNode;
};

export default function ListByStore<T = any>({ groups, renderItem }: Props<T>) {
  return (
    <div className="max-w-120 w-full xl:w-auto 2xl:w-full">
      {groups.map((group) => (
        <div key={group.name} className="flex flex-col gap-y-4 mb-8">
          <div className="border-b pb-2">
            <h2 className=" font-bold text-primary">{group.name}</h2>
            {group.direccion && (
              <p className="text-sm text-gray-500 ">
                <span className="text-accent font-bold">dirección:</span>{" "}
                {group.direccion}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-4 items-center justify-center">
            {group.items.map((item) => renderItem(item))}
          </div>
        </div>
      ))}
    </div>
  );
}
