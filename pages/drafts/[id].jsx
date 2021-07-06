import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";
import axios from "axios";
import { fetcher } from "../../lib/utils";
import Layout from "../../sections/Layout";
import Editor from "../../components/Editor";
import toast from "react-hot-toast";

import {
  CloudIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from "@heroicons/react/outline";

const Draft = () => {
  const router = useRouter();
  const [session] = useSession();
  const [publishing, setPublishing] = useState(false);
  const [savingStatus, setSavingStatus] = useState("saved");

  const { data, error, mutate } = useSWR(
    () => (session?.user ? `/api/posts/${router?.query?.id}` : null),
    fetcher
  );

  const handleOnPublish = async (title, content) => {
    let toastId;
    try {
      if (title) {
        setPublishing(true);
        toastId = toast.loading("Publishing...");
        const { data } = await axios.post(
          `/api/posts/publish/${router?.query?.id}`,
          {
            title,
            content,
          }
        );
        mutate(data, false);
        toast.success("Redirecting...", { id: toastId });
        router.push(`/posts/${data.slug}`);
      } else {
        toast.error("Looks like you forgot to add the title", { id: toastId });
      }
    } catch (error) {
      toast.error("Unable to publish the post", { id: toastId });
      setPublishing(false);
    }
  };

  const handleOnDelete = async () => {
    if (window.confirm("Do you really want to delete this draft?")) {
      let toastId;
      try {
        toastId = toast.loading("Deleting...");
        await axios.delete(`/api/posts/${data.id}`);
        toast.dismiss(toastId);
        router.push("/drafts/me");
      } catch (error) {
        toast.error("Unable to delete this draft", { id: toastId });
      }
    }
  };

  const handleOnChange = async (title, content) => {
    try {
      setSavingStatus("saving");
      const { data } = await axios.patch(`/api.posts/${router?.query?.id}`, {
        title,
        content,
        author: session.user,
      });
      mutate(data, false);
      setSavingStatus("saved");
    } catch (error) {
      setSavingStatus("error");
    }
  };

  if (error) {
    return (
      <Layout pageMeta={{ title: "Error" }}>
        <div className="flex justify-center my-12">
          <p
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md w-full
                  max-w-screen-sm text-center text-lg flex justify-center items-center
                  space-x-1 text-red-500"
          >
            <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0" />
            <span>Unable to retirve post!</span>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageMeta={{ title: "Write blog posts" }}>
      {data ? (
        <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
          <p
            className="flex items-center space-x-1 text-gray-500 bg-gray-100
            dark:bg-gray-800 rounded-md px-2 py-1"
          >
            {savingStatus === "error" ? (
              <>
                <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400" />
                <span className="text-red-500 dark:text-red-400">
                  Saving failed
                </span>
              </>
            ) : savingStatus === "saving" ? (
              <>
                <RefreshIcon className="w-6 h-6 flex-shrink-0 animate-spin" />
                <span>Saving</span>
              </>
            ) : savingStatus === "saved" ? (
              <>
                <CloudIcon className="w-6 h-6 flex-shrink-0" />
                <span>Saved</span>
              </>
            ) : null}
          </p>
          <Editor
            initialData={data}
            showDeleteButton={true}
            showPublishButton={true}
            disabled={publishing}
            onChange={handleOnChange}
            onPublish={handleOnPublish}
            onDelete={handleOnDelete}
          />
        </div>
      ) : null}
    </Layout>
  );
};

export default Draft;
