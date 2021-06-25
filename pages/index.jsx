import Link from "next/link";
import { useSession, signIn } from "next-auth/client";
import Layout from "../sections/Layout";
import { BookOpenIcon, PencilAltIcon } from "@heroicons/react/outline";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <Layout>
      <section className="flex flex-col justify-center items-center space-y-10 mt-12 sm:mt-24 md:mt-32">
        <div className="space-y-4 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-7xl font-bold capitalize">
            <span className="block">The blogging platform</span>
            <span className="block">for developers</span>
          </h1>
          <h2 className="text-xl sm:text-2xl">
            Start your developer blog, share ideas and connect with the dev
            community!
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {loading ? null : !session ? (
            <button
              type="button"
              onClick={signIn}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
            rounded-md border-2 border-blue-600 hover:border-blue-700 text-lg
            sm:text-xl focus:outline-none focus:ring-4 focus:ring-blue-600
            focus:ring-opacity-50 whitespace-nowrap"
            >
              Star you blog for free
            </button>
          ) : (
            <Link href="/new">
              <a
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
            rounded-md border-2 border-blue-600 hover:border-blue-700 text-lg
            sm:text-xl focus:outline-none focus:ring-4 focus:ring-blue-600
            focus:ring-opacity-50 whitespace-nowrap flex justify-center items-center space-x-2"
              >
                <PencilAltIcon className="w-6 h-6 flex-shrink-0" />
                <span>Write a blog post</span>
              </a>
            </Link>
          )}

          <Link href="/posts">
            <a
              className="w-full bg-transparentbg text-blue-600 px-6 py-3 
            rounded-md text-lg sm:text-xl border-2 border-blue-600
            focus:outline-non whitespace-nowrap flex justify-center items-center space-x-2"
            >
              <BookOpenIcon className="w-6 h-6 flex-shrink-0" />
              <span>Read the blog</span>
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
