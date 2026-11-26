import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Secure Account Link | AIMILLE VOYAGES",
    robots: { index: false, follow: false },
};

export default function AuthCallbackFragmentLayout({ children }: { children: React.ReactNode }) {
    return children;
}
