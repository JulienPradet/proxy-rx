import { BehaviorSubject, defer, from, Observable, share } from "rxjs";

interface Resource {
  id: string;
}

export interface SiteResource extends Resource {
  id: string;
  title: string;
  posts: Array<Observable<PostResource>>;
}

export interface PostResource extends Resource {
  id: string;
  title: string;
  author: Observable<AuthorResource>;
}

export interface AuthorResource extends Resource {
  id: string;
  name: string;
}

// Le but du resource manager ici est de faire la gestion de cache des observables:
// si on a déjà un observable qui fait ou a fait la requête précédemment, on le réutilise.
export function ResourceManager<T extends Resource>(
  fetcher: (id: string) => Promise<T>
) {
  const cache: { [key in string]: Observable<T> } = {};

  return {
    createObservable: (id: string): Observable<T> => {
      if (cache[id]) {
        return cache[id];
      }

      cache[id] = defer(() => {
        console.log(`API: start ${id}`);
        return from(
          fetcher(id).then((response) => {
            console.log(`API: end ${id}`);
            return response;
          })
        );
      }).pipe(share());
      return cache[id];
    },
  };
}
