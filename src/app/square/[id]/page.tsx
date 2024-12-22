"use client";

import { UserDetail } from "./user-detail";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-4 md:py-8">
        <UserDetail userId={params.id} />
      </div>
    </main>
  );
} 