// app/(commonlayout)/layout.tsx

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
