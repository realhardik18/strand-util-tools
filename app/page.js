import Link from "next/link";

export default function Home() {
  return (
  <div className="bg-black h-screen">
    <h1 className="text-white text-4xl text-center py-10">utility tools</h1>
    <div className="flex flex-row grid-cols-2 justify-center gap-20">
      <Link href={"/clip-maker"}>
        <button className="bg-white text-black p-15 rounded border-zinc-800 hover:bg-pink-200">
          clip
        </button>
      </Link>
      <Link href={"/screenshot-generator"}>
      <button className="bg-white text-black p-15 rounded border-zinc-800 hover:bg-pink-200">
        screenshot
      </button>
      </Link>
    </div>
    
  </div>
  );
}
