# 🌋🥚 Giant Egg Escape : idée de jeu Roblox « taillée pour l'algorithme »

> **Titre de travail.** Alternatives : *Lava Egg Escape*, *Volcano Egg Rush*. Vérifie sur Roblox qu'aucun jeu ne porte déjà le nom avant de choisir.
> Ce dossier est prêt à devenir la racine d'un dépôt dédié au jeu :
> - `CLAUDE.md` : les règles techniques que Claude suit à chaque session ;
> - `docs/GDD.md` : le design complet, avec des chiffres de départ ;
> - `docs/ROADMAP.md` : les étapes, avec le prompt à donner à Claude pour chacune.

## Le pitch

**Une île volcanique entre en éruption toutes les 4 minutes.** Tu fonces chercher des œufs. Plus ils sont près du cratère, plus ils sont rares… et lourds. Ramène-les à ton nid avant que la lave te rattrape, fais-les éclore en temps réel et collectionne des créatures. **Les œufs géants ? Impossible à porter seul : il faut appeler tes amis.**

| | |
|---|---|
| Genre | Collection d'œufs et de créatures (tycoon) + « escape ». Ces deux familles dominent les tendances de fin 2026. |
| Ce qui le distingue | Les œufs géants se portent **à plusieurs**. L'éruption est cyclique, et un œuf tombé dans la lave devient une mutation **Molten** que n'importe qui peut récupérer. |
| Public | Tout public (maturité « Minimal »), pensé d'abord pour le mobile, serveurs de 8 joueurs |
| Boucle de base | Courir → ramasser → revenir (plus lentement si l'œuf est lourd) → incuber → encaisser → améliorer |

## 1. Ce que l'algorithme récompense (octobre 2026)

- **Mi-juin 2026** : « Recommended For You », l'algorithme de la page d'accueil, passe d'une fenêtre de 7 jours à **28 jours**. Il mesure la rétention séparément à **J1, J2–7 et J8–28**.
- **Signaux principaux** : le *play-through rate* (part des affichages qui deviennent des parties), les **jours joués par joueur** et le **temps de jeu par joueur**. **Signaux suivants** : les jours de *co-play intentionnel* (rejoindre des amis), les sessions qualifiées, les jours avec achat et les Robux dépensés.
- Le QPTR disparaît. Il est remplacé par le *play-through rate* et le ***first play bounce rate***, qui compte les sessions de moins de 60 s et celles de 61 à 180 s. Les trois premières minutes sont donc jugées à part.
- **Fin août 2026** : un jeu fort à la fois en rétention **et** en monétisation est plus diffusé qu'un jeu fort sur un seul de ces deux axes.
- **RDC 2026 (septembre)** : le classement tient compte de l'âge (les plus jeunes préfèrent les jeux courts, les plus âgés les jeux profonds). Roblox teste aussi un signal de **croissance directe** : le nombre de *nouveaux* joueurs qu'un jeu fait venir sur Roblox.
- Roblox combat les clones avec un outil dédié (≈ 40 000 jeux clonés retirés). Copier un hit est donc risqué ; s'en inspirer avec un vrai twist ne l'est pas.

## 2. À chaque signal, une mécanique

| Signal de l'algorithme | Ce que le jeu fait pour lui |
|---|---|
| Play-through rate | Un titre avec des mots-clés porteurs (*Egg* + *Escape*). Une vignette lisible en une seconde : 4 avatars portent un œuf géant devant une coulée de lave. 2 à 5 vignettes actives grâce à la personnalisation des vignettes. |
| Bounce < 60 s | Le joueur apparaît face à un œuf brillant à 15 studs, avec une flèche. On le ramasse en un tap. Pas de menu, chargement léger. |
| Bounce 61–180 s | Un œuf tutoriel éclot en 5 s. La première amélioration est achetable avant 60 s. Le compte à rebours de l'éruption est visible tout de suite. |
| Temps de jeu, sessions qualifiées | Le cycle de 4 min crée un pic de tension toutes les 4 min. Les œufs éclosent en 20 s pour les plus simples et jusqu'à 8 h pour les plus rares : il y a toujours un prochain objectif. |
| Jours joués, J1 | Les éclosions longues se terminent pendant l'absence du joueur, avec une notification (13 ans et plus, sur accord). Les revenus hors ligne sont plafonnés à 8 h. |
| Jours joués, J2–7 | 3 quêtes quotidiennes, une série de connexion qui pénalise peu les oublis, et un Marchand dont le stock change toutes les 10 min, identique sur tous les serveurs. |
| Jours joués, J8–28 | L'**Œuf Ancestral** se réchauffe une fois par jour joué et éclot au 28e réchauffement. S'y ajoutent une saison de 28 jours, une Méga-éruption chaque samedi et un nouvel œuf chaque semaine. |
| Co-play intentionnel | La vitesse d'un œuf géant dépend de la force cumulée de ses porteurs, et chaque porteur reçoit l'œuf. Chaque ami présent ajoute un bonus de chance. On propose d'inviter un ami au moment où le joueur en a besoin. Les serveurs privés sont gratuits. |
| Jours avec achat, Robux dépensés | De petits achats utiles et répétables (éclosion instantanée, totem de chance pour tout le serveur), des passes et une saison premium. Aucune loot box payante. |
| Croissance directe | Des moments faits pour être filmés : fuir la lave, porter un œuf Titan à quatre, une éclosion mythique annoncée à tout le serveur. S'y ajoutent les liens de parrainage (Friend Referral System) et les liens de partage. |
| Âge | En surface, c'est simple et mignon pour les plus jeunes. En profondeur, les mutations, l'optimisation et les échanges occupent les plus âgés. |

## 3. Pourquoi ce concept plutôt qu'un autre

- **Un clone de *Steal An Egg*** (n° 1 avec ≈ 1,6 M de joueurs simultanés fin septembre 2026) : le marché est saturé et l'outil anti-clone guette. On garde ce qui est familier et donne envie de cliquer (œufs, vitesse, fuite), mais on change le verbe (porter **ensemble**) et le danger (l'éruption).
- **Le brainrot** : la vague retombe (*Steal a Brainrot* a perdu ≈ 99 % de joueurs depuis son record).
- **L'horreur coop à anomalies** : très bon co-play et très streamable, mais une rétention J8–28 et une monétisation faibles. Or l'algorithme pèse désormais lourdement sur ces deux points.

## 4. Pourquoi Claude peut le construire

- **Tout est code et données.** La carte est construite par un script. Les œufs sont des ellipsoïdes. Les créatures sont d'abord procédurales, puis remplacées par des meshes générés. L'interface est écrite en code, et tout le contenu (œufs, créatures, évènements) tient dans des tables.
- **Le MCP officiel de Roblox Studio**, intégré à Studio, prend en charge Claude Code. Avec lui, Claude exécute du Luau, lance des playtests, déplace le personnage, simule clavier et souris, lit la console, prend des captures d'écran et génère des meshes et des assets.
- **Rojo + Git** : Claude écrit des fichiers `.luau` que Rojo synchronise dans Studio. **Lune** lance les tests de logique sans Studio. **Open Cloud** publie le place de test et peut exécuter des tests Luau sans interface (5 min maximum par tâche).
- **Ce que tu fais toi-même** : les comptes et réglages Roblox, les clés API, la connexion de Studio, la page du jeu et la communauté. Et surtout, **jouer** : Claude ne ressent pas le fun.

**Limites à connaître :**
- Le MCP de Studio fonctionne avec Studio, donc sous **Windows ou macOS**. Les étapes avec playtest se font avec Claude Code **en local**. Une session cloud peut s'occuper de la logique, des données, des tests Lune et de la documentation.
- Les notifications ne concernent que les 13 ans et plus. Les publicités vidéo récompensées sont réservées aux jeux éligibles, avec un seuil d'audience.

## 5. Comment s'en servir

1. Crée un dépôt dédié (par exemple `giant-egg-escape`) et copie ce dossier à sa racine.
2. Fais l'étape 0 de `docs/ROADMAP.md`. Elle te revient et prend environ 1 h.
3. Ouvre Claude Code **sur ton ordinateur**, là où tourne Studio. Donne-lui le prompt de l'étape 1, puis celui de l'étape 2, et ainsi de suite. Compte une étape par session.
4. Aux jalons A, B et C, joue avec des amis, puis rapporte à Claude ton ressenti et les chiffres.

Ordre de grandeur : une vingtaine de sessions avec Claude, plus tes playtests, soit environ **4 à 8 semaines à temps partiel** jusqu'au lancement public.

## 6. Objectifs chiffrés

| Métrique | Médiane Roblox | Top 1 % | Notre cible |
|---|---|---|---|
| Rétention J1 | 10,3 % | 22,2 % | ≥ 15 % |
| Rétention J7 | 1,6 % | 9,1 % | ≥ 4 % |
| Rétention J30 | 0,5 % | 4,7 % | ≥ 1,5 % |
| Durée moyenne de session | 9,8 min | 14,7 min (90e percentile) | ≥ 15 min |

Les colonnes Médiane et Top 1 % viennent du GameAnalytics *2026 Roblox Benchmark Report* (plus de 500 jeux Roblox, août 2025 à juillet 2026). Dans Creator Analytics, suis aussi le *play-through rate* et le *first play bounce rate* (Acquisition → Home Recommendations), et compare les vignettes entre elles.

## Sources

- Roblox Creator Docs, Discovery : <https://create.roblox.com/docs/discovery>
- Roblox DevForum, *Recommended For You Algorithm Improvements That Better Value Long-Term Retention* (juin 2026) : <https://devforum.roblox.com/t/recommended-for-you-algorithm-improvements-that-better-value-long-term-retention/4684575>
- Roblox Newsroom, *Optimizing Discovery* (juin 2026) : <https://about.roblox.com/newsroom/2026/06/optimizing-discovery-great-games-reach-millions-players-roblox>
- Roblox DevForum, *Boost Your Discovery by Building Games People Want to Play* (20 août 2026) : <https://devforum.roblox.com/t/boost-your-discovery-by-building-games-people-want-to-play/4779042>
- Roblox Investor Relations, RDC 2026 : <https://ir.roblox.com/news/news-details/2026/Roblox-Unveils-New-Ways-to-Play-Build-and-Grow-at-the-Roblox-Developers-Conference-RDC/default.aspx>
- GameAnalytics, *2026 Roblox Benchmark Report* : <https://www.gameanalytics.com/reports/2026-roblox-report>
- Top des jeux de septembre 2026 : <https://studiokrew.com/blog/top-roblox-games-september-2026/>
- Déclin du brainrot : <https://rowatcher.com/news/is-the-brainrot-trend-dying-what-ccu-data-from-three-top-games-reveals>
- Anti-clonage : <https://www.gamedeveloper.com/programming/-i-roblox-i-takes-aim-at-game-cloning-in-new-developer-update>
- MCP intégré à Studio (liste des outils) : <https://create.roblox.com/docs/studio/mcp>
- Luau Execution (Open Cloud) : <https://create.roblox.com/docs/en-us/cloud/reference/features/luau-execution.md>
- Personnalisation des vignettes : <https://create.roblox.com/docs/production/publishing/thumbnails>
- Friend Referral System : <https://create.roblox.com/docs/production/promotion/referral-system>
- Experience Notifications : <https://create.roblox.com/docs/production/promotion/experience-notifications>
- Paid random items : <https://create.roblox.com/docs/production/monetization/paid-random-items>
