# 🟢 Grow a Slime : concept de jeu Roblox

> **Titre de travail.** Un jeu coop où l'on collectionne et élève des slimes. Tu les nourris, tu les fusionnes, la météo du serveur les fait muter, et certaines créatures ne s'obtiennent **qu'avec un ami**.
>
> Ce dossier contient le concept (ce fichier), la [feuille de route étape par étape](./ROADMAP.md) et un [`CLAUDE.md`](./CLAUDE.md) qui fixe les conventions pour les sessions Claude qui construiront le jeu.

---

## 1. Le pitch

**« Élève des slimes, fusionne-les, attrape des mutations pendant les tempêtes arc-en-ciel, et fusionne avec tes potes pour créer des hybrides introuvables en solo. »**

- **Genre** : collection / élevage / fusion (la famille de *Grow a Garden*, *Steal a Brainrot* et *Steal an Egg*), mais **coopératif** plutôt que basé sur le vol.
- **Public** : 7-14 ans, mobile d'abord.
- **Session type** : de 15 à 40 min, avec une raison de revenir chaque jour pendant 28 jours.

### Boucle de jeu

```
 Nourrir (clic) ──► Le slime grandit ──► Il produit du Goo ──► Récolter
      ▲                                                          │
      │                                                          ▼
 Fusionner 2 slimes identiques ◄── Acheter des œufs (stock qui tourne toutes les 5 min)
      │
      ├──► Mutations pendant la météo du serveur ──► Slimedex à compléter
      └──► Fusion d'amitié avec un ami (1×/jour) ──► Hybrides exclusifs ──► Renaissance
```

---

## 2. Pourquoi cette idée colle à l'algorithme Roblox (état octobre 2026)

### Ce que Roblox mesure aujourd'hui

Le 15 juin 2026, Roblox a refondu « Recommended For You », la principale source de trafic de la page d'accueil :

- **Fenêtre de 28 jours** au lieu de 7, découpée en 3 tranches : **J1**, **J2-7** et **J8-28**. Dans chaque tranche, l'algorithme regarde : temps de jeu, **jours de jeu**, sessions qualifiées, **jours de co-play intentionnel**, **jours de dépense** et Robux dépensés.
- **Signal phare, le co-play intentionnel** : le nombre de jours où un joueur revient jouer **avec des amis** (en rejoignant un ami, par invitation ou en serveur privé).
- **Le QPTR disparaît.** Il est remplacé par le **play-through rate** (impressions → parties) et le **taux de rebond à la première partie** (joueurs qui quittent tout de suite).
- La fréquence de retour pèse plus que le temps de jeu brut.

Deux règles à respecter en plus :

- **Depuis le 25 août 2026**, les jeux qui récompensent le visionnage continu d'un flux de vidéos courtes en lecture auto ou en défilement infini sont exclus de Roblox Kids et Roblox Select. C'est l'affaire du tapis roulant de *Steal an Egg*. **On n'en met aucun.**
- **Catalogues Roblox Kids (5-8 ans) et Roblox Select (9-15 ans)** : Kids n'accepte que les jeux de maturité *Minimal* ou *Mild*, après une sélection en 3 étapes. Le développeur doit vérifier son identité, activer la 2FA et avoir un abonnement Roblox Plus.

### Signal par signal : la mécanique qui le pousse

| Signal de l'algorithme | Mécanique de *Grow a Slime* |
|---|---|
| **Play-through rate** (clic sur la vignette) | Promesse lisible en 0,5 s : un slime arc-en-ciel géant sur l'icône. Titre court avec le mot-clé reconnu « Grow a ». Les miniatures montrent la fusion et les amis. Icône et miniatures sont testées en A/B dans le Creator Hub. |
| **Rebond à la 1re partie** | Le premier slime arrive dans tes bras en moins de 5 s, la première récompense tombe avant 10 s, la première fusion a lieu avant 60 s. Aucun menu, aucun mur de texte. Chargement léger, car tout est procédural. |
| **Temps de jeu J1 et sessions qualifiées** | Une boucle courte (nourrir → récolter → acheter → fusionner, environ 30 s). Une **météo serveur toutes les ~12 min** donne une raison de rester « encore un peu ». |
| **Jours de jeu J2-7** | Gains hors-ligne **plafonnés à 8 h**, donc revenir au moins une fois par jour paie. S'y ajoutent une série quotidienne, l'« œuf de demain » qui n'éclot que le lendemain et une offre du jour dans la boutique. |
| **Jours de jeu J8-28** | Une **saison de 28 jours**, calée sur la fenêtre de l'algorithme. Le Slimedex à compléter, la renaissance, et une mise à jour hebdomadaire pilotée par la config. |
| **Co-play intentionnel** (signal phare) | La **fusion d'amitié** est limitée à 1 par ami et par jour, ce qui donne une raison de revenir **avec** un ami chaque jour. Bonus de production par ami présent, bouton « Inviter », serveurs privés gratuits, événement coop « Slime Géant ». |
| **Jours de dépense** | Des petits achats pas chers et utiles au quotidien : restock, potion de 15 min, « météo offerte à tout le serveur ». On évite de tout miser sur un seul gros achat. Un passe de saison. |
| **Éligibilité Kids/Select** (accès au plus gros public) | Pas de combat, pas de vol, pas besoin du chat. On vise le questionnaire de maturité **Minimal**. |

> Pourquoi pas un énième « Steal a … » ? Le vol fait du bruit sur TikTok, mais il frustre les petits, crée de la toxicité et colle mal à Kids et Minimal. Le **co-play** est le signal que Roblox valorise le plus en 2026. *Grow a Slime* en fait sa mécanique centrale au lieu de le traiter en bonus.

---

## 3. Pourquoi c'est réalisable étape par étape par Claude

| Contrainte | Solution |
|---|---|
| Claude ne modélise pas en 3D et n'anime pas à la main | **Tout est procédural.** Un slime, c'est une `Part` en boule, un matériau (Glass, Neon, ForceField), des yeux et un écrasement/étirement fait au `TweenService`. Les mutations ne sont que des couleurs, des matériaux, des particules et des tailles. On obtient des centaines de variantes sans aucun asset. |
| Ajouter du contenu doit rester facile | Le jeu est **piloté par les données** : une nouvelle espèce, mutation ou météo, c'est une ligne dans une table Luau. Les updates hebdomadaires tiennent en un seul prompt. |
| Claude travaille sur des fichiers, pas dans Studio | Le code vit en fichiers `.luau` synchronisés par **Rojo** et versionnés dans git. Claude Code les édite comme n'importe quel projet. |
| Il faut pouvoir vérifier sans cliquer | La logique pure (économie, fusion, tirage des mutations, gains hors-ligne) n'a aucune dépendance Roblox. Elle se **teste avec Lune** en ligne de commande. Le reste se teste par le **serveur MCP intégré à Roblox Studio**, avec lequel Claude lance un playtest, exécute du Luau et lit la sortie. |
| Des étapes de taille « une session » | La [feuille de route](./ROADMAP.md) compte 22 étapes, numérotées de 0 à 21. Chacune a un prompt prêt à copier et un critère « c'est fini quand… » vérifiable. |

**Ce que Claude ne peut pas faire seul :**
- L'icône et les miniatures finales (Claude fournit les briefs et les prompts d'image, et tu valides).
- Le choix des sons dans le Creator Store.
- La publication et les réglages du Creator Hub : questionnaire de maturité, prix, serveurs privés, vérification d'identité.

---

## 4. Contenu de lancement

**10 paliers de slimes** (deux slimes identiques fusionnent en un slime du palier suivant) :
Gouttelette → Gelée → Bulle → Pudding → Marmelade → Lave → Cristal → Nuage → Étoile → Cosmos

**8 mutations**, jusqu'à 3 cumulées par slime, chacune multiplie la production :
Doré · Arc-en-ciel · Galaxie · Gelé · Électrique · Géant · Mini · Fantôme

**5 météos serveur** :

| Météo | Fréquence | Mutations boostées | Effet visuel |
|---|---|---|---|
| Pluie dorée | fréquente | Doré | Particules dorées, ciel chaud |
| Orage arc-en-ciel | moyenne | Arc-en-ciel, Électrique | Éclairs, arc-en-ciel au-dessus de la place |
| Pluie de météores | rare | Galaxie | Ciel nocturne, traînées lumineuses |
| Blizzard | moyenne | Gelé | Neige, brouillard bleu |
| Nuit fantôme | très rare | Fantôme | Brume, slimes semi-transparents |

**Slimedex** : 10 paliers × 8 mutations = 80 entrées de base, plus les **hybrides d'amitié**, qu'on n'obtient qu'en fusionnant avec un ami.

**La carte** : 8 ranchs (1 par joueur, 8 joueurs par serveur) disposés autour d'une place centrale. La place regroupe la boutique, l'autel de l'amitié, la statue du Slimedex et le Slime Géant des événements coop.

---

## 5. Monétisation éthique

| Type | Produit | Pourquoi |
|---|---|---|
| Gamepass | VIP (tag + petit bonus), Goo ×2, Récolte auto, +4 places de ranch | Des achats permanents classiques. |
| Produit dev | Restock instantané, Potion de chance 15 min, packs de Goo | Peu chers et utiles chaque jour, ce qui pousse les **jours de dépense**. |
| Produit dev | **Météo offerte** : déclenche une météo pour tout le serveur, avec l'annonce « Léa a offert une Pluie dorée ! » | Un achat social qui profite à tout le monde. |
| Produit dev | Passe de saison premium (28 jours) | Un objectif long, calé sur la fenêtre J8-28. |

**Interdits volontaires :**
- **Aucun objet aléatoire payant**, ce qui évite les obligations de transparence des probabilités et les restrictions par pays.
- **Aucun flux vidéo récompensé.**
- **Aucune récompense** pour avoir quitté le jeu ou partagé un lien externe.

---

## 6. Nom et positionnement

- **Titre de travail** : `Grow a Slime 🟢`
- **Alternatives** : `Slime Fusion Ranch`, `Merge Slimes with Friends`
- Des jeux de slimes existent déjà, comme *Build A Slime Garden* et *Slime RNG*. On s'en distingue par la **fusion d'amitié** et les **mutations météo**. À afficher dès l'icône et la première ligne de la description.
- Vérifier sur Roblox que le titre exact est libre au moment de publier.

---

## 7. Risques et parades

| Risque | Parade |
|---|---|
| Le genre « Grow a… » est saturé | Différenciation coop, updates hebdomadaires rapides grâce à la config, A/B test de l'icône dès la sortie |
| Exploits (RemoteEvents) | Serveur autoritaire : le client n'envoie que des intentions, le serveur valide et limite le débit |
| Perte de données ou duplication | ProfileStore (verrouillage de session), `ProcessReceipt` idempotent |
| La majorité joue sur mobile | UI pensée pour le tactile d'abord, budget de parts, `StreamingEnabled`, tests sur appareil bas de gamme |
| Politique Roblox qui évolue | Aucune mécanique limite. Relire les règles de Roblox Kids et Select avant chaque grosse update |

---

## Sources

- [Recommended For You Algorithm Improvements That Better Value Long-Term Retention (DevForum, juin 2026)](https://devforum.roblox.com/t/recommended-for-you-algorithm-improvements-that-better-value-long-term-retention/4684575)
- [Optimizing Discovery: How Great Games Reach Millions of Players on Roblox (Roblox Newsroom, juin 2026)](https://about.roblox.com/newsroom/2026/06/optimizing-discovery-great-games-reach-millions-players-roblox)
- [Roblox docs : Discovery](https://create.roblox.com/docs/discovery)
- [Roblox Blocks "Rewarded Infinite Scroll" on Kids' Accounts (Inven Global)](https://www.invenglobal.com/articles/25146/roblox-blocks-rewarded-infinite-scroll-on-kids-accounts)
- [Roblox Forces Its Biggest Game To Axe Doomscrolling Mechanic (Kotaku)](https://kotaku.com/roblox-cracks-down-on-doomscrolling-games-like-steal-an-egg-that-forces-players-to-watch-reels-while-running-on-a-treadmill-2000727952)
- [Roblox Introduces New Age Based Accounts… (Business Wire, avril 2026)](https://www.businesswire.com/news/home/20260413497398/en/Roblox-Introduces-New-Age-Based-Accounts-and-Expanded-Parental-Controls-for-Users-Under-16)
- [Roblox Studio MCP server (docs)](https://create.roblox.com/docs/en-us/studio/mcp.md) · [Roblox/studio-rust-mcp-server](https://github.com/Roblox/studio-rust-mcp-server)
