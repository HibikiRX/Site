# CLAUDE.md : Giant Egg Escape (jeu Roblox)

Tu construis ce jeu étape par étape en suivant `docs/ROADMAP.md`. Le design de référence est `docs/GDD.md`. Si un point de design n'y est pas tranché, **pose la question** au lieu d'inventer une mécanique. Note chaque décision dans `docs/DECISIONS.md`.

## Stack

- **Luau**, avec `--!strict` dans chaque fichier.
- **Rojo 7** synchronise les fichiers dans Studio. **Rokit** installe les outils. **Wally** gère les paquets.
- **StyLua** formate, **Selene** fait le lint, **Lune** exécute les tests en dehors de Roblox.
- **ProfileStore** (loleris) gère les données des joueurs. Récupère-le via Wally ou copie-le dans `Packages/`.
- **MCP de Roblox Studio**, intégré à Studio :
  - `execute_luau` en mode Edit pour construire ou inspecter, en mode Server ou Client pendant un playtest ;
  - `start_stop_play`, `character_navigation`, `user_keyboard_input` et `user_mouse_input` pour jouer ;
  - `get_console_output` et `screen_capture` pour observer ;
  - `generate_mesh`, `generate_procedural_model`, `search_asset` et `insert_asset` pour les assets.
- **Open Cloud** :
  - la CI publie le place TEST ;
  - Luau Execution permet, si besoin, de lancer en CI des tests qui ont besoin du moteur (5 min maximum par tâche).

## Commandes

```
rokit install                    # installe les outils
lune run test                    # tests unitaires (script .lune/test.luau)
stylua --check src tests .lune   # format
selene src                       # lint
rojo build -o build/game.rbxl    # build du place
rojo serve                       # sync vers Studio (le plugin Rojo doit être connecté)
```

## Arborescence

```
src/
  server/          Services (*Service.luau) et Bootstrap
  client/          Controllers : UI, FX, tutoriel, entrées
  shared/
    Config/        TOUTES les données : Eggs, Creatures, Map, Upgrades, Quests, Events, Products, Assets
    Logic/         Logique pure, sans API Roblox, testée par Lune (horloge et RNG injectés)
    Net/           Déclaration centralisée des Remotes
tests/             *.spec.luau
.lune/             Scripts Lune (test runner, outils)
docs/              GDD, ROADMAP, CHANGELOG, DECISIONS
```

## Règles non négociables

1. **Git est la source de vérité.** Rien d'important ne vit seulement dans le place Studio. La carte est construite par du code (`MapBuilder`), et les assets générés sont référencés par leur ID dans `Config/Assets`. Le place produit par `rojo build` doit être complet et publiable.
2. **Ne modifie jamais un script via le MCP** (`multi_edit`). Modifie les fichiers de `src/` ; Rojo s'occupe de la synchronisation.
3. **Le serveur fait autorité.** Le client demande, le serveur valide : distance, délai entre deux actions, possession, fonds. Aucune valeur de gameplay ne vient du client.
4. **Pas de nombre magique.** Chaque valeur d'équilibrage vit dans `Config`.
5. **La logique pure va dans `shared/Logic`.** Elle reçoit `now` en paramètre et utilise `Logic/Rng` (générateur maison à graine), jamais `math.random` ni `Random`. C'est ce qui la rend déterministe et testable, sous Lune comme dans Roblox.
6. **Achats** :
   - `ProcessReceipt` est idempotent : le PurchaseId est mémorisé dans le profil, l'achat n'est accordé qu'après la sauvegarde ;
   - on ne vend jamais de pièces contre des Robux ;
   - tout ce qui est aléatoire affiche ses probabilités ;
   - on respecte `PolicyService`.
7. **Données** : ProfileStore avec un schéma versionné. Chaque changement de schéma s'accompagne d'une migration et de son test.
8. **Mobile d'abord.** Toute interface est vérifiée en émulation téléphone, capture à l'appui. Les zones tactiles font au moins 44 px et le texte reste lisible sur un petit écran.
9. **Performances.** Respecte les budgets du GDD (§3). Pas de boucle serveur à chaque frame sans nécessité : préfère des pas de 0,1 à 0,25 s. Pour la détection, utilise des requêtes spatiales plutôt que `Touched`.
10. **Analytics.** Chaque fonctionnalité enregistre ses évènements AnalyticsService (GDD §15).
11. **Publication.** Ne publie jamais en PROD sans mon accord explicite. Ne colle jamais une clé API dans le code ni dans le chat : elles vont dans les secrets GitHub ou dans les Secrets de l'expérience.

## Définition de « terminé » pour une étape

- `lune run test`, `stylua --check`, `selene` et `rojo build` passent tous.
- Un playtest via le MCP a joué le scénario de l'étape :
  - la console est sans erreur ;
  - l'état côté serveur a été vérifié avec `execute_luau` ;
  - les captures sont jointes, avec une description de ce qu'on y voit.
- `docs/CHANGELOG.md` est à jour. Le GDD ne change que si une décision de design a changé, et seulement avec mon accord.
- Le message final contient :
  - ce qui a été fait ;
  - 3 à 5 actions pour que je teste à la main ;
  - les limites connues.
- Le travail est sur une branche, avec une PR.

## Utiliser le MCP de Studio

- Commence par `get_studio_state`. Vérifie que la synchronisation Rojo est active : le Bootstrap affiche `Server ready <BUILD_VERSION>` au démarrage d'un playtest.
- Pour les tests à plusieurs joueurs, utilise des PNJ factices côté serveur (outil de debug). Pour un vrai test multi-clients, demande-moi de le lancer.
- Arrête toujours le playtest à la fin avec `start_stop_play`. Ne laisse dans le place aucun objet créé pour un test.
- Si le MCP n'est pas disponible (par exemple dans une session cloud sans Studio), limite-toi à `Logic`, `Config`, aux tests et à la documentation. Dis clairement ce qui reste à vérifier dans Studio.
