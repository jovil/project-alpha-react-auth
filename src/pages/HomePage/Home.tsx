import PostListView from "./PostListView";
import CreatePost from "../../components/CreatePost";
import CreatePostModal from "../../components/CreatePost/modal";
import useFileUpload from "../../hooks/useFileUpload";

export default function Home() {
  const {
    showModal,
    postImage,
    imageBase64,
    handleFileUpload,
    handleToggleModal,
  } = useFileUpload();

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
        onFileUpload={handleFileUpload}
      />
      <CreatePostModal
        isShowModal={showModal}
        isPostImage={postImage}
        isImageBase64={imageBase64}
        onToggleModal={handleToggleModal}
      />
    </>
  );
}
