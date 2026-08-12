### Answer privacy questions and show how review gates work

**Job:** Give ADMs a clear, doc-backed privacy story for leadership/GRC, then prove that leave-behind quality is gated in-repo — not left to hope.

**Key messages**
1. With Privacy Mode on, Cursor states code is not used for training by Cursor or model providers; ZDR agreements cover most models (see Cursor privacy docs).
2. Privacy Mode is on by default for Enterprise; Teams/Enterprise admins can enforce it org-wide so individuals cannot turn it off.
3. Be honest about edges: Cloud Agents store code temporarily by design (optional); some models need admin opt-in for provider retention; BYOK and personal accounts change the story.
4. Review habit: `/brand-check` (judgment) + `/deck-score` (structure) before export — governance of the artifact, not only of the vendor.

**Content to include**
- Two data flows: LLM requests vs Cloud Agents (enterprise privacy docs)
- Team dashboard enforcement + Allowed Team IDs / MDM for personal-account risk
- Point to official pages — do not paraphrase legal contracts in the room
- Leave-behind Lab 4 / scorecard as the customer-side review ritual

**What to avoid**
- Claiming “zero data leaves the device” — prompts and code context go to providers for inference
- Inventing certifications or DPA terms not on cursor.com/security
- Deep-diving every residency/CMEK option — mention Enterprise extras and hand to account team

**Review note:** Draft for SME + security enablement pass (priority #3). Re-check https://cursor.com/docs/enterprise/privacy-and-data-governance and https://cursor.com/data-use before customer delivery.
