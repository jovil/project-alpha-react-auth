import Grid from "./Grid";

const UserPostsPage = ({
  isUser,
}: {
  isUser: Record<string, any> | undefined;
}) => {
  return (
    <>
      <Grid isUser={isUser} />
    </>
  );
};

export default UserPostsPage;
