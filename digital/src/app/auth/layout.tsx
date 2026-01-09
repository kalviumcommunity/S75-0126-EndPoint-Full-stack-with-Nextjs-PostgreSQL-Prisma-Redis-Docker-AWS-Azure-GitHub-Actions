import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* You can add auth-specific UI here */}
      {children}
    </section>
  );
}
