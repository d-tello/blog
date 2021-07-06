import Layout from "../../sections/Layout";
import Image from "next/image";
import { formatDate } from "../../lib/utils";
import faunaQueries from "../../lib/fauna";
import { useRouter } from "next/router";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/outline";
import ReactMarkdown from "react-markdown";
import MDComponents from "../../components/MDComponents";

const Post = ({
  title = "",
  content = "",
  author = null,
  published_at = "",
}) => {
  const router = useRouter();

  const pageMeta = {
    type: "article",
    title,
    description: content.slice(0, 250),
    data: published_at,
  };

  return (
    <Layout pageMeta={pageMeta}>
      {router.isFallback ? (
        <p className="text-center text-lg py-12">Loading...</p>
      ) : (
        <article className="max-w-screen-lg mx-auto py-12 space-y-16">
          <header>
            <h1
              className="max-w-screen-md lg:text-6xl md:text-5xl mb-4
              sm:text-4xl text-3xl w-full font-extrabold leading-tight"
            >
              {title}
            </h1>
            <div
              className="flex flex-col sm:flex-row sm:justify-between
            sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b
            border-t dark:border-gray-700 py-6"
            >
              <div className="flex items-center space-x-2">
                <Image
                  src={author?.image}
                  alt={author?.name}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                  width={32}
                  height={32}
                />
                <p className="font-semibold">{author?.name}</p>
                <p className="text-gray-500">{formatDate(published_at)}</p>
              </div>
            </div>

            <Link href={`/edit/${id}`}>
              <a
                className="bg-transparent hover:bg-gray-200
              dark:hover:bg-gray-800 rounded-md ox-2 py-1 focus:outline-none
              focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 flex
              items-center space-x-1"
              >
                <PencilIcon className="w-5 h-5 flex-shrink-0" />
                <span>Edit</span>
              </a>
            </Link>
          </header>

          <main className="prose sm:prose-lg lg prose-xl dark:prose-dark max-w-none">
            <ReactMarkdown children={content} components={MDComponents} />
          </main>
        </article>
      )}
    </Layout>
  );
};

export async function getStaticPaths() {
  let slugs = [],
    cursor = null;

  do {
    const { data, after } = await faunaQueries.getAllSlugs({ after: cursor });
    slugs = [...slugs, ...data];
    cursor = after;
  } while (cursor);

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  try {
    const data = await faunaQueries.getPostBySlug(params.slug);
    return {
      props: data,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Post;
