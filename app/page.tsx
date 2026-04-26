export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          magmag
        </h1>
        <ul className="mt-8 space-y-3 text-zinc-700 dark:text-zinc-300 list-disc list-inside text-lg">
          <li>Improves flexibility and range of motion</li>
          <li>Builds strength and muscle tone</li>
          <li>Reduces stress and promotes relaxation</li>
          <li>Enhances mental clarity and focus</li>
          <li>Supports better posture and balance</li>
          <li>Boosts energy levels and overall well-being</li>
        </ul>
      </main>
    </div>
  );
}
