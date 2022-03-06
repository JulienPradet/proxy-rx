import { AuthorResource } from "./model";

const Author = ({ author }: { author: AuthorResource }) => {
  return <p>{author.name}</p>;
};

export { Author };
