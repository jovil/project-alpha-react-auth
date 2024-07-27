import PostListView from "./PostListView";
import CreatePost from "../../components/CreatePost";

export default function Home() {
  return (
    <>
      <PostListView />
      <CreatePost
        classes={
          "fixed bottom-0 right-0 left-0 px-4 py-3.5 pointer-events-none"
        }
        btnClasses={
          "btn-primary rounded-full text-sm flex gap-2 justify-center items-center"
        }
      />
    </>
  );
}
