import PostListView from "./PostListView";
import CreatePost from "../../components/CreatePost";
import CreatePostModal from "../../components/CreatePost/modal";
import useFileUpload from "../../hooks/useFileUpload";

const DiscoverPage = () => {
  const {
    showModal,
    postImage,
    imageBase64,
    handleFileUpload,
    handleTogglePostModal,
  } = useFileUpload();

  return (
    <>
      <PostListView />
      <CreatePost
        classes={
          "fixed bottom-0 left-1/2 -translate-x-1/2 px-4 py-3.5 pointer-events-none"
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
        onToggleModal={handleTogglePostModal}
      />
    </>
  );
};

export default DiscoverPage;
