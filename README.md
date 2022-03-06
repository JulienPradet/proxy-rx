## Suite de la discussion Twitter

https://twitter.com/boileau_thomas/status/1500456413713387535

Thomas Boileau est en train d'imaginer un moyen de récupérer des données depuis une API côté client.

De ce que j'ai compris, le but est de cacher les requêtes API via des objets (avec Rx/BehaviorSubject) qui feront donc les appels de manière lazy (= uniquement quand il y en a besoin) + ne les doubleront pas s'ils ont déjà été faits.

Du coup ça m'a rendu trop curieux, et j'ai développé ce truc pour mieux comprendre comment ça pourrait marcher.

Par rapport aux contraintes initiales décrites dans le thread, il est à noter que :

- je n'ai pas mis en place une vraie API REST, mais je l'ai simulé avec des promises
- je ne connais pas le concept d'UnitOfWork et donc j'ai potentiellement mal compris une partie des contraintes. Notamment, mon plus gros doute vient du fait que je me suis concentré sur le fait que c'est la vue qui dicte quelles sont les données dont elle a besoin.

## Repo

Pour lancer la démo en local:

```
npm i && npm run dev
```

Pour naviguer dans le repo:

- `src/api.ts`: Définition de données et execution des fausses requêtes HTTP. Ce qui est exposé au reste de l'application est donc uniquement un observable qui donne accès à des sous observables.
- `src/model.ts`: Gère le cache des observables afin de ne pas refaire une requête si elle a déjà été effectuée. On peut par exemple constater que `author-1` n'est fetché qu'une seule fois même s'il est affiché 3 fois.
- L'application est en React, mais on peut imaginer utiliser n'importe quel autre outil pour transformer un Observable en éléments du DOM. La transformation stream -> React element se fait via `src/Stream.tsx`

## Ce que j'ai appris

Les problèmes que j'ai pu voir :

- Si `fakeApiDuration` est long, on met beaucoup de temps à avoir accès à la totalité de la page
- Si mes appels API ne sont pas très intelligents (exemple les posts sont récupérés 1 par 1 et non en batch), ça peut faire un peu bizarre au niveau des spinners qui disparaissent un par un, faisant bouger le contenu. Selon le type de site qu'on veut faire ça peut être plus ou moins gênant. (sûrement gérable en améliorant le ResourceManager dans `src/model.tsx` en adoptant le pattern DataLoader fréquemment utilisé en GraphQL)

Les trucs cools :

- L'API est plutôt agréable à utiliser - on n'a jamais besoin de savoir où et comment aller chercher les infos
- On pourrait faire en sorte que toutes les données soient résolues au démarrage de la page en ajoutant un joli `pipe` sur `site$`. Les requêtes se feraient toujours en cascade mais on pourrait espérer moins de scintillement pour les utilisateur·rice·s. Cela dit, selon la complexité des données, ça peut vite devenir un travail difficile.
