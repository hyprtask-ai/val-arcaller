import { PRIVACY_URL, TERMS_URL } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background px-6 py-4">
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Privacy Policy
        </a>
        <span className="text-border">|</span>
        <a
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
