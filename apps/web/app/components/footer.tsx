export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TaskApp
      </div>
    </footer>
  );
}
