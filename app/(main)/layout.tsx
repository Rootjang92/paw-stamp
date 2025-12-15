import { Header } from '@/widgets/header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Paw Stamp" />
      {children}
    </div>
  );
}
