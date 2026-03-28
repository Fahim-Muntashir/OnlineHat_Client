// app/(commonlayout)/layout.tsx

import Footer from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar></Navbar>
      {children}
      <Footer></Footer>
    </div>
  );
}
