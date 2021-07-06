import Layout from "../sections/Layout";
import Editor from "../components/Editor";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const NewDraft = () => {
  const router = useRouter();
  const [session] = useSession();

  const handleOnChange = async (title, content) => {
    try {
      const {
        data: { id },
      } = await axios.post("/api/post", {
        title,
        content,
        author: session.user,
      });
      router.push(`/drafts/${id}`);
    } catch (error) {
      toast.error("Unable to create post");
    }
  };
  return (
    <Layout
      pageMeta={{
        title: "Write blog post",
      }}
    >
      <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
        <Editor onChange={handleOnChange} />
      </div>
    </Layout>
  );
};

export default NewDraft;
