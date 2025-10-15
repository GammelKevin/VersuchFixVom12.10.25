import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Seite nicht gefunden
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
