import toast from "react-hot-toast";
import useInfiniteQuery from "../hooks/use-infinite-query";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import Card from "./Card";
import CardSkeleton from "./CardSkeleton";
import { useEffect, useRef } from "react";
import { isInViewport } from "../lib/utils";
import { useDebouncedCallback } from "use-debounce";

const InfiniteDataList = ({ queryKey, initialData }) => {
  const moreRef = useRef();

  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingInitialData,
    isFetchingNextPage,
  } = useInfiniteQuery(queryKey, initialData);

  const loadMore = useDebouncedCallback(() => {
    if (isInViewport(moreRef.current)) {
      fetchNextPage();
    }
  }, 500);

  useEffect(() => {
    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, []);

  if (error) {
    toast.error("Unable to fetch data...");
  }

  if (!isFetchingInitialData && data?.length === 0) {
    return (
      <div className="flex justify-center">
        <p
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md w-full
        max-w-screen-sm text-center text-lg flex justify-center items-center space-x-1"
        >
          <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0" />
          <span>No blog posts yet</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
        {data?.map((item) => (
          <Card key={item.id} {...item} />
        ))}

        {isFetchingNextPage
          ? [...new Array(10)].map((_, i) => <CardSkeleton key={i} />)
          : null}
      </div>

      {hasNextPage ? (
        <div ref={moreRef} />
      ) : (
        <p className="text-gray-500 text-center text-lg mt-20">
          No more data...
        </p>
      )}
    </div>
  );
};

export default InfiniteDataList;
