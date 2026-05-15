import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { FeedbackProvider } from "@/context/FeedbackContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProfileProvider } from "@/context/ProfileContext";

export const metadata: Metadata = {
  title: "Hintro — Dashboard",
  description: "Make your next call smarter with Hintro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ToastProvider>
            <ProfileProvider>
              <FeedbackProvider>{children}</FeedbackProvider>
            </ProfileProvider>
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
