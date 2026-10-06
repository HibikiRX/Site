# Feuille de route : construire Giant Egg Escape étape par étape avec Claude

## Mode d'emploi

- **Une étape = une session** de Claude Code, parfois deux. Garde chaque session centrée sur une seule étape.
- **Lance Claude Code sur ton ordinateur**, là où tourne Roblox Studio. Les étapes marquées 🖥️ ont besoin du MCP de Studio. Celles marquées ☁️ peuvent aussi se faire dans une session cloud, sans Studio : logique, données, tests Lune, documentation.
- Chaque étape suit le même cycle : Claude propose un plan court, tu valides, il code, teste, prend des captures et ouvre une PR. Tu relis, tu testes à la main, tu fusionnes.
- Si une étape dérape, dis-lui : « Stop. Reviens à la dernière version qui marche et découpe cette étape en deux. »
- Les **jalons 🚩** sont des moments où **tu joues**. On ne passe pas à la phase suivante sans eux.

### Le prompt de départ, à coller au début de chaque session

```
Lis CLAUDE.md, puis l'étape N de docs/ROADMAP.md et les sections du GDD qu'elle cite.
Avant de coder : résume ton plan en 5–10 lignes (fichiers touchés, risques) et attends mon OK.
Ensuite : implémente, vérifie selon la « Définition de terminé » de CLAUDE.md,
et ouvre une PR avec les captures et 3–5 actions de test manuel pour moi.
```

Ajoute ensuite le prompt propre à l'étape, donné ci-dessous.

---

## Étape 0 : fondations (toi, ≈ 1 h)

- [ ] Crée un dépôt GitHub privé `giant-egg-escape` et copie ce dossier à sa racine.
- [ ] Installe Roblox Studio (dernière version) et Claude Code sur ton PC ou ton Mac.
- [ ] Connecte Studio à Claude Code par MCP :
  - dans Studio, ouvre **Assistant**, puis **…**, puis **Manage MCP Servers** ;
  - active **Enable Studio as MCP server** ;
  - choisis le *quick connect* pour Claude Code.
  - Sinon, ajoute le serveur à la main avec `claude mcp add`. La commande à lancer est donnée par la doc : `/Applications/RobloxStudio.app/Contents/MacOS/StudioMCP` sur macOS, `cmd.exe /c %LOCALAPPDATA%\Roblox\mcp.bat` sur Windows.
- [ ] Dans le Creator Hub, crée **2 expériences** :
  - `GEE TEST`, privée ;
  - `Giant Egg Escape`, la version de production, privée jusqu'au lancement.
  - Note leur `universeId` et leur `placeId`.
- [ ] Sur l'expérience TEST, va dans Game Settings → Security et active **Enable Studio Access to API Services** (nécessaire pour tester les DataStores dans Studio).
- [ ] Crée une **clé API Open Cloud** limitée à l'expérience TEST, avec deux droits : publication de place et exécution Luau.
  - Range-la dans les secrets GitHub `ROBLOX_API_KEY`, `TEST_UNIVERSE_ID` et `TEST_PLACE_ID`.
  - **Ne la colle jamais dans le chat.**

---

## Phase 1 : prototype jouable

### Étape 1 : le socle technique (☁️, puis 🖥️ pour la vérification dans Studio)
**Prompt :**
> Étape 1. Mets en place le socle décrit dans CLAUDE.md :
> - Rokit, avec rojo, wally, stylua, selene et lune ;
> - le projet Rojo avec l'arborescence prévue ;
> - ProfileStore ;
> - un lanceur de tests Lune (`lune run test`), qui sort en erreur si un test échoue ;
> - un module `Logic/Rng` (générateur aléatoire maison à graine), avec ses tests ;
> - un Bootstrap serveur qui affiche `Server ready <BUILD_VERSION>` ;
> - un workflow GitHub Actions : stylua --check, selene, tests Lune, rojo build, et publication du place TEST via Open Cloud à chaque push sur main.
>
> Exécute tout en local et montre-moi les sorties. Ensuite, vérifie le MCP de Studio avec `get_studio_state`. Demande-moi de connecter le plugin Rojo, lance un playtest et prouve avec `get_console_output` que la ligne `Server ready` s'affiche.

**Claude prouve que c'est fini :** les sorties des tests, du lint et du build, une CI verte et la ligne de console.
**Toi :** lance `rojo plugin install`, puis clique sur *Connect* dans le plugin Rojo. Relis la PR et fusionne-la.

### Étape 2 : la carte en blocs gris (🖥️)
**Prompt :**
> Étape 2, carte en blocs gris (GDD §3).
> - Écris `Config/Map` : zones, chemins, 5 chenaux, 8 nids, Porte d'éclosion, Marchand, points d'apparition.
> - Écris `MapBuilder`. Il doit être déterministe, utiliser des parts et de l'eau en Terrain, et construire la carte au démarrage si `workspace.Map` n'existe pas. Laisse `CharacterAutoLoads` à false tant que la carte n'est pas prête.
> - Prévisualise en mode Edit avec `execute_luau`. Prends 4 captures : vue d'ensemble, plage et nids, montée vers le cratère, chenaux. Itère jusqu'à ce que les 5 zones se distinguent au premier coup d'œil.
> - Ajoute des tests Lune de cohérence sur `Config/Map`. Mesure le temps de construction et le nombre de parts.

**Preuve :** les 4 captures, une construction en moins de 1 s, moins de 3 000 parts, des tests verts.
**Toi :** donne ton avis sur l'échelle (trop grand ? trop petit ?) et sur la lisibilité.

### Étape 3 : œufs et portage (🖥️)
**Prompt :**
> Étape 3, œufs et portage (GDD §4).
> - Écris `EggService` :
>   - apparitions par zone selon `Config/Eggs`, avec des plafonds ;
>   - contenu de l'œuf tiré à l'apparition ;
>   - ramassage par ProximityPrompt ;
>   - portage au-dessus de la tête avec une pose bras levés ;
>   - vitesse selon la formule du GDD ;
>   - lâcher par une touche et par un bouton mobile ;
>   - retour de l'œuf dans sa zone après 60 s au sol ;
>   - toutes les validations côté serveur.
> - Écris `Logic/EggRoll` et `Logic/CarrySpeed`, avec leurs tests.
> - En playtest via le MCP : va jusqu'à un œuf Commun puis jusqu'à un Rare, ramasse-les, vérifie la WalkSpeed côté serveur avec `execute_luau`, lâche l'œuf et prends des captures.

**Preuve :** des tests verts, un scénario de playtest réussi, une console sans erreur.

### Étape 4 : nid, incubation, créatures, revenus (🖥️)
**Prompt :**
> Étape 4, nid, incubation et créatures (GDD §6, §8).
> - Écris `NestService` (attribution d'un nid libre) et ajoute 2 incubateurs avec le dépôt d'œuf.
> - Fais éclore les œufs en temps réel grâce à un horodatage, pour que ça continue hors ligne. Ajoute la révélation : tremblement, fissures, flash, son.
> - Écris `CreatureBuilder`, qui construit de façon procédurale les 18 espèces de `Config/Creatures`.
> - Ajoute l'enclos de 6 places, le versement des revenus dans un collecteur et un HUD Pièces.
> - Écris `Logic/Incubation` et `Logic/Income`, avec leurs tests et une horloge injectée.
> - En playtest via le MCP, joue le scénario complet : ramasser → incuber → attendre l'éclosion → encaisser. Prends des captures de 3 créatures différentes.

**Preuve :** des tests verts, le scénario complet réussi, les captures des créatures.

### Étape 5 : la sauvegarde (🖥️ ; les migrations peuvent se faire en ☁️)
**Prompt :**
> Étape 5, sauvegarde (CLAUDE.md, règle 7).
> - Écris `DataService` avec ProfileStore : un template v1, des migrations versionnées, `Reconcile` et le verrou de session.
> - Sauvegarde tout l'état : pièces, incubateurs avec leurs horodatages, créatures, améliorations.
> - Plafonne les revenus hors ligne à 8 h.
> - Teste avec Lune les migrations et le calcul hors ligne.
> - Dans Studio, avec l'accès API activé sur TEST : joue, quitte, relance, et vérifie que l'état est identique. Simule 3 h d'absence en décalant l'horloge injectée.

**Preuve :** des tests verts et un aller-retour de sauvegarde réussi dans Studio.

### 🚩 Jalon A : « Porter des œufs, c'est fun ? » (toi)
La CI publie le place TEST. **Joue 15 min avec 1 ou 2 amis.** Ensuite, dis à Claude ce que tu as ressenti : trop lent ? trop rapide ? caméra ? sons ? Claude ajuste le ressenti (vitesses, caméra, sons, petits effets) **avant** d'ajouter de nouvelles fonctionnalités.
Critère : à la fin des 15 min, vous avez envie de continuer.

---

## Phase 2 : le hook

### Étape 6 : l'éruption (🖥️)
**Prompt :**
> Étape 6, l'éruption (GDD §5).
> - Écris `EruptionService` : les phases se calculent depuis l'horloge (cycle de 240 s), et les 2 chenaux actifs sont tirés avec une graine égale au numéro du cycle.
> - Visuels et sons :
>   - des fissures lumineuses pendant l'alerte ;
>   - des coulées animées en parts Neon ou CrackedLava ;
>   - un compte à rebours basé sur `workspace:GetServerTimeNow()`.
> - Toutes les 0,1 s, détecte par requêtes spatiales les joueurs touchés. Un joueur touché lâche son œuf, est projeté et revient à son nid.
> - Un œuf tombé dans la lave devient Molten ; on peut le ramasser une fois la lave refroidie. Des œufs apparaissent au cratère pendant l'alerte.
> - Écris `Logic/EruptionSchedule`, avec ses tests.
> - En playtest via le MCP : une capture par phase, plus un test où le personnage qui porte un œuf se fait toucher par la lave.

**Preuve :** une capture pour chacune des 4 phases, le test de la lave réussi, des tests verts.

### Étape 7 : améliorations et compagnons (🖥️)
**Prompt :**
> Étape 7, améliorations et compagnons (GDD §6, §8).
> - Une boutique pour la vitesse, la force, les incubateurs, l'enclos et le plafond hors ligne, avec les courbes de `Config/Upgrades`. L'interface est pensée d'abord pour le mobile.
> - Les compagnons : 3 équipables, qui suivent le joueur et appliquent leur bonus.
> - Écris `Logic/Economy` et `Logic/CompanionBonuses`, avec leurs tests.
> - Prends des captures de l'interface en émulation de petit téléphone et sur PC.

**Preuve :** des tests verts et des captures de l'interface sur téléphone et sur PC.

### Étape 8 : les œufs géants en coop (🖥️)
**Prompt :**
> Étape 8, œufs géants en coop (GDD §7).
> - Un évènement toutes les 15 min : chute de météorite et annonce.
> - 4 poignées. Le serveur déplace l'œuf selon la force cumulée de ses porteurs et applique le rayon de maintien.
> - Au dépôt à la Porte d'éclosion, chaque porteur reçoit un exemplaire.
> - Quand un joueur essaie seul, propose-lui d'inviter un ami (`SocialService`, après `CanSendGameInviteAsync`). Ajoute le panneau « Amis en ligne » pour rejoindre un ami.
> - Pour tester sans 4 humains, ajoute un outil de debug qui fait apparaître des porteurs PNJ côté serveur. Mesure la vitesse avec 1, 2, 3 et 4 porteurs et compare-la à la formule. Prends des captures.

**Preuve :** les vitesses mesurées collent à la formule, captures à l'appui.
**Toi :** fais un vrai test à 3 ou 4 joueurs sur le place TEST.

### Étape 9 : les 3 premières minutes et la mesure (🖥️)
**Prompt :**
> Étape 9, les 3 premières minutes et l'instrumentation (GDD §12, §15).
> - Le parcours d'accueil :
>   - un œuf tutoriel et une flèche (Beam) qui guide ;
>   - une première éclosion en 5 s, qui donne à coup sûr un Peu commun ;
>   - un bouton « Améliorer » qui pulse ;
>   - la quête « Ramène 3 œufs » et le compte à rebours de l'éruption ;
>   - aucune fenêtre bloquante.
> - Avec AnalyticsService : le funnel d'onboarding en 10 étapes et les évènements d'économie, de progression et personnalisés.
> - Ajoute une commande de debug « reset profil ».
> - Prouve, par un playtest via le MCP sur un profil neuf, que l'étape 6 du funnel (première amélioration) est atteinte en moins de 90 s. Prends des captures en émulation téléphone.

**Preuve :** un profil neuf atteint l'étape 6 en moins de 90 s, captures à l'appui.

### 🚩 Jalon B : test fermé (toi)
Fais tester le jeu par **10 à 30 joueurs** (amis, Discord) pendant 2 ou 3 jours. Ensuite, dis à Claude :
> Voici les chiffres du funnel d'onboarding et les retours des joueurs : (colle-les). Trouve les 3 plus grosses frictions et corrige-les.

---

## Phase 3 : la rétention sur 28 jours

### Étape 10 : collection, mutations, album (🖥️)
**Prompt :**
> Étape 10, collection (GDD §6, §11).
> - Les mutations (taille, Molten, Dorée, Arc-en-ciel) dans le tirage et dans l'affichage.
> - L'album : un index par espèce et par variante, avec des récompenses de complétion.
> - Une fenêtre « Probabilités » pour chaque type d'œuf.
> - Les annonces des éclosions rares (MessagingService pour les Mythiques).
> - Des tests Lune de la distribution : sur 10 000 tirages, l'écart doit rester sous 1 %.

**Preuve :** les tests de distribution passent et les fenêtres Album et Probabilités apparaissent en capture.

### Étape 11 : la boucle quotidienne (☁️ pour la logique, 🖥️ pour l'interface)
**Prompt :**
> Étape 11, boucles quotidiennes (GDD §9).
> - Les quêtes : 3 par jour, remise à zéro à 00:00 UTC, tirées dans `Config/Quests`.
> - La série douce sur 7 jours.
> - Le Marchand : un stock tiré d'une graine liée à l'heure, identique sur tous les serveurs, renouvelé toutes les 10 min.
> - L'écran de retour « Pendant ton absence », qui montre les éclosions et les pièces gagnées hors ligne.
> - Teste toute la logique avec une horloge simulée : changement de jour, jours manqués.

**Preuve :** des tests verts sur les changements de jour et les jours manqués.

### Étape 12 : les 28 jours (☁️ + 🖥️)
**Prompt :**
> Étape 12, les 28 jours (GDD §9).
> - L'Œuf Ancestral :
>   - un réchauffement par jour où l'on joue au moins 5 min ;
>   - des paliers aux jours 7, 14 et 21 ;
>   - l'éclosion au 28e réchauffement.
> - La saison de 28 jours : 30 paliers, de l'XP, une piste gratuite et une piste premium (verrouillée pour l'instant).
> - Un planificateur d'évènements en UTC, piloté par `Config/Events`, pour la Méga-éruption du samedi.
> - Teste en simulant 40 jours de connexions irrégulières.

**Preuve :** la simulation des 40 jours passe ; l'Œuf Ancestral et la saison apparaissent en capture.

### Étape 13 : social et croissance (🖥️)
**Prompt :**
> Étape 13, social et croissance (GDD §7, §10).
> - Le bonus de chance par ami présent.
> - Les invitations au bon moment.
> - La récompense de parrainage, via `GetJoinData().ReferredByPlayerId`.
> - Le bouton « Partager mon éclosion » (Share Link API).
> - Les notifications :
>   - on demande l'accord du joueur (`ExperienceNotificationService`, 13 ans et plus) quand il incube un œuf de 2 h ou plus ;
>   - l'envoi se fait par Open Cloud depuis le serveur, avec une clé rangée dans les Secrets de l'expérience ;
>   - une notification par jour et par joueur au maximum.
> - Enregistre chaque proposition (affichée, puis acceptée ou non).

**Preuve :** chaque proposition est enregistrée (affichée et acceptée) et on peut le constater dans la console.
**Toi :** crée le secret dans le Creator Hub et configure la récompense de parrainage.

---

## Phase 4 : monétisation

### Étape 14 : passes, produits, reçus (🖥️)
**Toi, d'abord :** crée les passes et les produits du GDD §11 dans le Creator Hub, avec leurs icônes et leurs prix, puis donne leurs ID à Claude.
**Prompt :**
> Étape 14, monétisation (GDD §11). Voici les ID : (colle-les dans `Config/Products`).
> - Écris `MonetizationService` :
>   - `ProcessReceipt` idempotent : PurchaseId mémorisé dans le profil, achat accordé seulement après la sauvegarde ;
>   - passes vérifiés à la connexion et à l'achat ;
>   - `PolicyService` appliqué.
> - La boutique Robux.
> - Les offres au bon moment : l'éclosion instantanée quand le joueur incube un œuf long, le pack de départ après son premier Épique.
> - La piste premium de la saison.
> - Test : rejoue le même reçu 3 fois, il ne doit être accordé qu'une seule fois.

**Preuve :** le test de reçu passe et chaque achat a été testé dans Studio (les achats y sont simulés).

---

## Phase 5 : finitions et lancement

### Étape 15 : direction artistique (🖥️)
**Prompt :**
> Étape 15, direction artistique (GDD §13).
> - Génère via le MCP (`generate_mesh`, `generate_procedural_model`) les 18 créatures, les 6 œufs, les nids et les décors. Range leurs ID dans `Config/Assets` ; ils se chargent au lancement, avec un retour au procédural en cas d'échec.
> - L'éclairage : Future, Atmosphere, Bloom, ColorCorrection.
> - Les effets visuels : étincelles, fumée, éclosion.
> - Les sons, trouvés avec `search_asset`.
> - Propose 2 ou 3 styles pour les créatures avant de tout générer. Prends des captures avant/après pour chaque zone.

**Toi :** choisis le style.

### Étape 16 : mobile, performances, sécurité (🖥️)
**Prompt :**
> Étape 16, mobile, performances et sécurité.
> - Prends des captures en émulation (petit téléphone, tablette, PC, console) et corrige l'interface.
> - Mesure et documente les budgets : StreamingEnabled, parts, instances, mémoire, temps de chargement.
> - Audite la sécurité de chaque Remote : validation, limite de fréquence, types.
> - Lance un test de charge avec 8 PNJ simulés pendant une éruption et un œuf géant.
> - Rends-moi un rapport chiffré.

**Preuve :** le rapport chiffré, avec les captures sur chaque type d'appareil.

### Étape 17 : la page du jeu (Claude + toi)
**Prompt :**
> Étape 17, la page du jeu.
> - Propose 3 titres, une description courte et une longue (en anglais et en français), et les mots-clés.
> - Prépare 5 vignettes à partir de vraies captures, avec la caméra placée via `screen_capture` : un œuf Titan porté à quatre devant la lave, une éclosion mythique, une vue de l'île… Prépare aussi l'icône, et décris les retouches à faire.
> - Aide-moi à remplir le questionnaire de maturité (cible : Minimal).

**Toi :**
- mets en ligne l'icône et les vignettes, et garde 2 à 5 vignettes actives pour la personnalisation ;
- renseigne le titre et la description ;
- réponds au questionnaire de maturité ;
- active la traduction automatique.

### Étape 18 : le lancement (toi + Claude)
**Prompt :**
> Étape 18, le lancement.
> - Écris la checklist de lancement : sauvegardes testées, reçus testés, page complète, plan de retour arrière.
> - Prépare le tableau de suivi des 72 premières heures, avec les seuils d'alerte pour : play-through rate, first play bounce (< 60 s et 61–180 s), J1, temps de jeu, co-play et jours avec achat. Indique ce qu'on corrige en premier selon les seuils.

**Toi :**
- configure la publication de PROD : clé Open Cloud de PROD dans les secrets GitHub, puis le workflow PROD manuel ;
- passe le jeu en public ;
- publie des clips courts (TikTok, YouTube Shorts) ;
- si tu le souhaites, ajoute un petit budget de pub Roblox pour amorcer le trafic.

### 🚩 Jalon C : lancement public
Pendant 72 h, colle chaque jour les chiffres de Creator Analytics à Claude. Il diagnostique avec la grille du GDD (§14).

---

## Phase 6 : live ops (chaque semaine)

### Étape 19 et suivantes : la mise à jour du samedi
**Prompt hebdomadaire :**
> Live ops, semaine N. Voici les chiffres de Creator Analytics (copiés-collés ou en capture) et les retours des joueurs.
> 1. Établis un diagnostic avec la grille du GDD (§14).
> 2. Propose 3 changements au maximum, classés par impact.
> 3. Après mon accord, implémente la mise à jour du samedi : une nouvelle famille d'œufs, 3 créatures et un évènement. Mets à jour le CHANGELOG et prépare le texte d'annonce.

**Tous les 28 jours :** une nouvelle saison et un nouvel Œuf Ancestral. Garde un œil sur les échanges (GDD §10) et ajoute-les quand la communauté les réclame.
