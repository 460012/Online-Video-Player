import Link from 'next/link';

export default function DashboardPage() {
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p>Select a category to explore:</p>
            <ul className="list-disc list-inside mt-4">
                <li>
                    <Link href="/Dashboard/movies">Movies</Link>
                </li>
                <li>
                    <Link href="/Dashboard/series">Series</Link>
                </li>
                <li>
                    <Link href="/Dashboard/anime">Anime</Link>
                </li>
            </ul>
        </main>
    );
}
