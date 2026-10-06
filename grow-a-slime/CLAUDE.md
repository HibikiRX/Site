# CLAUDE.md : conventions du projet Grow a Slime

Jeu Roblox écrit en Luau, synchronisé dans Studio avec Rojo.

- Concept : `README.md`.
- Plan de travail : `ROADMAP.md`. **Ne réalise que l'étape demandée**, puis coche-la.

## Arborescence cible

```
default.project.json
rokit.toml             # rojo, wally, stylua, selene, lune
wally.toml
src/
  shared/              → ReplicatedStorage.Shared
    Config/            # TOUT l'équilibrage et le contenu (tables pures)
    Logic/             # fonctions pures, sans API Roblox, testées sous Lune
    Net/               # définition des RemoteEvents/Functions
  server/              → ServerScriptService.Server
    Main.server.luau   # démarre les services dans l'ordre
    Services/          # DataService, RanchService, SlimeService, WeatherService…
    World/             # MapBuilder (génération procédurale)
  client/              → StarterPlayer.StarterPlayerScripts.Client
    Main.client.luau
    Controllers/       # UI, tutoriel, météo, etc.
    Visual/            # SlimeBuilder, SlimeAnimator
tests/                 # *.spec.luau + run.luau (Lune)
tools/                 # simulate.luau (simulation d'économie)
docs/
```

## Règles

1. **Serveur autoritaire.** Le client n'envoie que des intentions, par exemple « je veux nourrir le slime X ». Le serveur vérifie le propriétaire, la distance, le débit et le coût, puis applique. Le client ne fixe jamais de montant de Goo, ni de palier, ni de mutation.
2. **Contenu dans la config.** Les nombres magiques et les listes d'espèces, de mutations, de météos et de produits restent dans `src/shared/Config`. Ajouter du contenu ne doit demander aucun changement de code.
3. **Logique pure dans `src/shared/Logic`.** Ces modules n'utilisent ni `game`, ni `workspace`, ni `Instance`, ni `task`, ni services Roblox. L'aléatoire et l'heure sont passés en paramètres (`rng`, `now`) pour rester testables sous Lune. Ils sont importés par chemin relatif (`require("./Economy")`). Si l'étape 0 a documenté une autre méthode, suivre celle-là.
4. **Un seul accès aux données** : `DataService`. Les autres services passent par ses fonctions.
5. **Achats** : `ProcessReceipt` est idempotent (PurchaseId mémorisé dans le profil). Aucun objet aléatoire payant.
6. **Conformité Roblox.**
   - Aucun flux de vidéos courtes récompensé.
   - Aucune récompense pour quitter le jeu ou partager un lien externe.
   - Pas de violence : on vise la maturité *Minimal*.
   - Pas de faux comptes à rebours sur les achats.
7. **Mobile d'abord.**
   - Zones tactiles d'au moins 44 px.
   - UI à l'échelle (`UIScale` / `UIAspectRatioConstraint`).
   - Texte court : 5 mots maximum dans le tutoriel.
8. **Style Luau.**
   - `--!strict` en tête de chaque module.
   - Types exportés pour les données joueur et la config.
   - Noms en anglais dans le code, textes joueur en français dans `Config/Strings.luau`, pour préparer l'anglais.
9. **Analytics.**
   - Étapes du tutoriel : `AnalyticsService:LogOnboardingFunnelStepEvent`.
   - Flux de Goo : `LogEconomyEvent`.
   - Paliers : `LogProgressionEvent`.

## Avant chaque commit

```
lune run tests/run          # tous les tests passent
selene src                  # aucun avertissement
stylua --check src tests    # formatage OK
```

Pour les étapes 🎮, lancer en plus un playtest via le serveur MCP de Studio et vérifier qu'aucune erreur n'apparaît dans la sortie.

Message de commit : `Étape N : <résumé>`. Mettre à jour la case correspondante dans `ROADMAP.md`.
