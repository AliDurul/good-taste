# Using graphify in this repo (and new projects)

This repo has a graphify knowledge graph for each service: `api/`, `mobile/`, `web/`.
Each one has its own `graphify-out/` (gitignored) with `graph.json`, `GRAPH_REPORT.md`,
and `graph.html`. Claude Code is wired up via each service's `CLAUDE.md` + `.claude/settings.json`
to query the graph instead of grepping/reading the whole tree.

## What it gives you

- `graph.json` - nodes (files/functions/classes/concepts) + edges (calls, imports, etc.)
- `GRAPH_REPORT.md` - communities, "god nodes" (most-connected), suggested questions
- `graph.html` - interactive visualization, open in a browser

## Day-to-day usage

Run these from inside the relevant service directory (`api/`, `mobile/`, `web/`):

```bash
graphify query "how does order creation work"     # BFS - broad context
graphify query "how does X reach Y" --dfs         # DFS - trace a specific chain
graphify path "OrderController" "StockService"    # shortest path between two concepts
graphify explain "ProductService"                 # everything connected to one node
```

Claude Code will do this automatically for codebase questions (see "How the integration
works" below) - you usually don't need to type these yourself.

## Keeping the graph fresh

After editing code:

```bash
graphify update .
```

This re-extracts only changed files via AST (free, no LLM tokens) and merges into the
existing graph. Run it whenever you've made a meaningful batch of changes, or set up
the git hook to do it automatically:

```bash
graphify hook install     # rebuilds graph.json after every commit (AST-only, free)
```

## How the integration works

`graphify claude install` (already run for all 3 services) did two things per service:

1. Added a `## graphify` section to `CLAUDE.md` telling Claude to prefer
   `graphify query/path/explain` over reading raw files for codebase questions.
2. Registered `PreToolUse` hooks in `.claude/settings.json` that nudge Claude
   toward `graphify query` whenever it's about to grep or read source files.

To remove from a service: `graphify claude uninstall`.

---

## Setting up a new project from scratch

### 1. Install (one-time, machine-wide)

```bash
pip install graphifyy && graphify install
```

(`graphifyy` is the PyPI package name; the CLI is `graphify`.)

### 2. Decide: AST-only vs. full semantic build

`/graphify <path>` normally does two passes:
- **AST extraction** (tree-sitter) - free, instant, no LLM. Gives you functions,
  classes, imports, call graphs, file structure.
- **Semantic extraction** - dispatches subagents to read every file and add
  conceptual/business-logic edges and doc summaries. This is genuinely useful but
  **expensive**: roughly 5,000 tokens per file. For a few hundred files that's
  hundreds of thousands to low millions of tokens.

**Recommendation: start AST-only.** It already gives you the structural map that
stops Claude from reading the whole repo to answer "what calls what" / "where is X
defined" questions - which is most of the token cost in practice. Add semantic
extraction later, selectively, only for the parts you query most (e.g.
`graphify extract ./src/payments --mode deep`).

> Known issue (as of v0.8.36 on Windows): when semantic-extraction subagents are
> dispatched as **background** agents, they're denied filesystem write access and
> the chunk JSON is lost after doing the (expensive) analysis. If you do want the
> semantic layer, dispatch the extraction subagents in the **foreground** (not
> `run_in_background`) so any write-permission prompt can be approved interactively,
> or have the subagent return the JSON in its reply and write it yourself.

### 3. Build the graph

For a single project:
```bash
/graphify .
```

For a monorepo with independent services (like this one), build one graph per
service rather than one giant graph - each is more focused and `web`-sized corpora
(500+ files) hit graphify's "narrow to a subfolder?" prompt:
```bash
graphify extract ./api      # -> api/graphify-out/graph.json
graphify extract ./mobile
graphify extract ./web
```
Then, if you need cross-service queries (e.g. "where does mobile call this API
endpoint"), merge them:
```bash
graphify merge-graphs api/graphify-out/graph.json mobile/graphify-out/graph.json \
  web/graphify-out/graph.json --out graphify-out/graph.json
```

### 4. Wire it into Claude Code

Run once per project/service:
```bash
graphify claude install
```

### 5. Add to .gitignore

```
graphify-out/
```

It's a derived/local cache - regenerate with `graphify update .`.

### 6. Keep it current

```bash
graphify hook install   # auto-rebuild (AST-only) after each commit
# or manually:
graphify update .
```

---

## Troubleshooting

- **PowerShell scrolling breaks after running graphify**: caused by ANSI codes from
  `graspologic`. Use Windows Terminal, or `pip uninstall graspologic` to fall back to
  NetworkX's Louvain clustering (no ANSI output).
- **Hooks silently do nothing on Windows**: the generated `.claude/settings.json`
  hooks call `python3`, which on stock Windows Python installs is an unusable
  Microsoft Store stub. Replace `python3` with `python` in the hook commands
  (already done for `api`, `mobile`, `web` in this repo).
