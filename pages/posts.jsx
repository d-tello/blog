import Layout from "../sections/Layout";
import Card from "../components/card";
import faunaQueries from "../lib/fauna";

const posts = ({ data }) => {
  return (
    <Layout>
      <section className="text-center pt-12 sm:pt-24 pb-6">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">
          Blog posts
        </h1>
      </section>
      <div>
        {data.map((post) => (
          <Card key={post.id} {...post} />
        ))}
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  try {
    const data = await faunaQueries.getPosts();
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
}

export default Posts;
