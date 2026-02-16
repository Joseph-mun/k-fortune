import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-sm space-y-4">
        <h2 className="text-4xl font-bold text-text-primary font-[family-name:var(--font-heading)]">
          404
        </h2>
        <p className="text-sm text-text-secondary">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
