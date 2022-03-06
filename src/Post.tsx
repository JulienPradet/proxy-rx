import { Author } from "./Author";
import { PostResource } from "./model";
import { Stream } from "./Stream";

const Post = ({ post }: { post: PostResource }) => {
  return (
    <article>
      <h2>{post.title}</h2>
      <Stream data$={post.author}>
        {(author) => {
          if (!author) {
            return <p>Loading...</p>;
          }
          return <Author author={author} />;
        }}
      </Stream>
    </article>
  );
};

export { Post };
