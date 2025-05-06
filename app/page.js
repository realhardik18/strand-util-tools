import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-black text-6xl font-bold text-center mb-6">
          Utility Tools
        </h1>
        
        <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
          <Link href={"/clip-maker"}>
            <button className="w-64 h-32 bg-black text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1">              
              Clip Maker
            </button>
          </Link>
          
          <Link href={"/screenshot-generator"}>
            <button className="w-64 h-32 bg-black text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1">              
              Screenshot Generator
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
