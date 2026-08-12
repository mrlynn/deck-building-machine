# Talk track — Govern privacy and review

**Open:** “Security asks two different questions: what happens to our code with the vendor, and what happens before we ship a deck. Answer both.”

**Beats**
1. Privacy Mode — “With Privacy Mode enabled, Cursor’s docs state your code is not used for training by Cursor or model providers.” Link: cursor.com/help/security-and-privacy/privacy and data-use.
2. Enterprise default — Privacy Mode on by default for Enterprise; admins can enforce in the team dashboard so people cannot disable it. Mention Allowed Team IDs / MDM if corporate devices are in the room.
3. Honest edges — Cloud Agents are optional and store repo copies while they run. Some models sit outside ZDR and need admin approval. Personal accounts on corporate laptops break the story — enforce team login.
4. Do not overclaim — Inference still sends prompts and code context to providers. Point GRC to the enterprise privacy docs and account team for DPA/CMEK/residency.
5. Review gates — Flip to the leave-behind: deliberate bad edit → `/brand-check` → optional `/deck-score` → fix → export. That is governance of *their* output.

**Exit line:** “Vendor controls + in-repo review. Neither replaces the other.”

**Time:** ~10–12 minutes. Often after CLI / tokens, or as the security sidebar in a 101.

**Live check:** Re-read enterprise privacy + data-use pages the morning of the session — model-retention exceptions change.
