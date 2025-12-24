import "./globals.css";
import Navbar from "../components/layout/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#070b13]">
        <Navbar />
        <div className="h-20" />
        {children}
      </body>
    </html>
  );
}
