import { site$ } from "./api";
import { Post } from "./Post";
import { Stream } from "./Stream";

const App = () => {
  return (
    // Afin d'éviter de m'embêter avec un système de proxy (j'ai eu des galères avec les types)
    // je passe plutôt par un composant qui m'aplatit ce qu'il y a dans le stream rx.
    // La conséquence est la même de ce que j'ai compris des contraintes du tweet:
    // On ne fait la requête qu'au moment où on en a besoin (= le moment où React commence à
    // afficher le composant qui se base sur le stream rx)
    <Stream data$={site$}>
      {(site) => {
        if (!site) {
          return <div>Loading site...</div>;
        }

        return (
          <>
            <header>
              <h1>{site.title}</h1>
            </header>
            <main>
              {site.posts?.map((post$, index) => {
                return (
                  // La conséquence du fait de ne récupérer les requêtes uniquement quand on a besoin
                  // c'est que j'ai dû récupérer le "site" pour savoir quels sont les ids de posts dont
                  // j'ai besoin. Une fois que je les ai, je fais mon observable qui fait la requête ajax.
                  // Et plus mes entités sont profondes, plus j'ai une grosse cascade.
                  // Par exemple, un <Post /> affiche un auteur qu'il faut aussi aller chercher.
                  // S'il n'y a qu'un seul auteur, on va le chercher une seule fois (cf. console du navigateur).
                  // Mais toujours est-il qu'on doit aller le chercher *après* avoir récupéré les posts.

                  // On peut imaginer un système à la JSON API pour limiter le nombre d'appel. Mais dans ce cas,
                  // il faut que je sache que je veux afficher l'auteur d'un post *avant* de fetch le post.
                  // Ce qui ne me paraît pas compatible avec les proxies.
                  <Stream data$={post$} key={index}>
                    {(post) => {
                      if (!post) {
                        return <div>Loading...</div>;
                      }

                      return <Post post={post} />;
                    }}
                  </Stream>
                );
              })}
            </main>
          </>
        );
      }}
    </Stream>
  );
};

export { App };
