import { getSession, useSession } from "next-auth/client";
import Layout from "../../sections/Layout";
import InfiniteDataList from "../../components/InfiniteDataList";
import faunaQueries from "../../lib/fauna";

const MyPost = ({ initialData }) => {
  const { session, loading } = useSession();

  const queryKey = session?.user
    ? `api/drafts?author=${session.user.email}`
    : "/api/drafts";

  return (
    <Layout>
      <section className="text-center pt-12 sm:pt-24 pb-16">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">My drafts</h1>
      </section>
      {!loading ? (
        <InfiniteDataList queryKey={queryKey} initialData={initialData} />
      ) : null}
    </Layout>
  );
};

export async function getStaticProps(context) {
  try {
    const session = await getSession(context);
    const initialData = await faunaQueries.getDrafts({
      author: session?.user?.email,
    });
    return {
      props: {
        data: initialData,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
}

export default MyPost;
