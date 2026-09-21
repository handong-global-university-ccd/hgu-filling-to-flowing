import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center text-center">
      <div>
        <p className="text-h1">404</p>
        <Link href="/" className="mt-4 inline-block text-body-sm underline">
          홈으로
        </Link>
      </div>
    </main>
  );
}
