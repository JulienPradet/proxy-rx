import {
  AuthorResource,
  PostResource,
  ResourceManager,
  SiteResource,
} from "./model";

// Mes fetchs sont juste des timeout. Pas de serveur.
// Mais la Promise simule la durée que pourrait prendre un appel.
const fakeApiDuration = () => Math.random() * 1000 + 1000; // entre 1s et 2s

const siteManager = ResourceManager(fetchSite);
const postManager = ResourceManager(fetchPost);
const authorManager = ResourceManager(fetchAuthor);

function fetchSite(id: string): Promise<SiteResource> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "site-1",
        title: "Welcome",
        posts: [
          postManager.createObservable("post-1"),
          postManager.createObservable("post-2"),
          postManager.createObservable("post-3"),
        ],
      });
    }, fakeApiDuration());
  });
}

function fetchPost(id: string): Promise<PostResource> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        title: `Welcome on post ${id}`,
        author: authorManager.createObservable("author-1"),
      });
    }, fakeApiDuration());
  });
}

function fetchAuthor(id: string): Promise<AuthorResource> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        name: "SuperRoiPatate",
      });
    }, fakeApiDuration());
  });
}

const site$ = siteManager.createObservable("site-1");

export { site$ };
