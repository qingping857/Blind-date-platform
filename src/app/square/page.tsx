"use client";

import { UserList } from "./user-list";
import { UserFilter } from "./user-filter";

export default function SquarePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-4 md:py-8">
        <div className="flex flex-col gap-6">
          <UserFilter />
          <UserList />
        </div>
      </div>
    </main>
  );
} 