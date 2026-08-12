# Deck Machine Studio — ADM overview

Cursor-branded enablement deck: what the system is, how packaging works, and how ADMs should use it day-of.

| File | Role |
|---|---|
| `Deck_Machine_Studio_for_ADMs.pptx` | Deliverable (21 slides, Cursor Theme Template v2) |
| `outline.yaml` | Source outline — rebuild with create-presentation |

## Rebuild

From the create-presentation skill directory:

```bash
python3 scripts/build_presentation.py \
  /path/to/marriott-deck-machine/examples/adm-studio-overview/outline.yaml \
  -o /path/to/marriott-deck-machine/examples/adm-studio-overview/Deck_Machine_Studio_for_ADMs.pptx
```

## Arc

1. What it is — Studio packages; Cursor runs the demo  
2. How it works — Package wizard → zip → live demo loop → quality gates  
3. How ADMs use it — before / in room / Mission control / field kit / day-2 ownership  

Related: `docs/adm-field-kit.md`, Studio Help → Teaching modules (field kit).
