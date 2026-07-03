import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-50">
        <Header />

        <main className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}