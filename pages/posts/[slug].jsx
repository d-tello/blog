import Layout from "../../sections/Layout";
import Image from "next/image";
import { formatDate } from "../../lib/utils";
import faunaQueries from "../../lib/fauna";
import { useRouter } from "next/router";

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
          </header>
          <main>{content}</main>
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
