# Lesson 4 — review following classroom-owner feedback

Date: 2026-10-16. Scope: the six Number Studio activities only.

## Verdict

The functional release remains delivered, but its visual and interaction quality has not been accepted by the user. Reopen the design checkpoint. Functional tests, asset counts and library integration do not establish engagement or finished motion quality.

Evidence: six user-supplied screenshots and direct inspection of shared/number-studio.js and shared/number-studio.css. Screenshots establish composition, scale and integration problems; they do not establish frame pacing or the full temporal experience. The motion observations below are based on implementation inspection; a new real-time before/after review remains required.

## Priority findings

1. Major — weak direct manipulation / real-world mapping. Gift Workshop toggle() calls drawItems(), replacing the inventory and packed-object DOM immediately. The toy becomes a selected tile in front of the illustrated box. There is no persistent visual journey from inventory to container. Keep each toy's identity and visual instance through pickup, travel, insertion and undo. Retain accessible controls independently of the renderer.
2. Major — all six activities share the same visual hierarchy and interaction rhythm. Large title, numbered dots, framed instruction, framed scene, choices, status, controls and score dominate each screen. Move the primary manipulation into its scene; reduce repeated framing and competing progress displays. Keep routes, common navigation and stored progress.
3. Major — spatial integration. Regular floating grids and translucent panels obscure the detective room and gift workshop. The background offers little evidence of what children can affect. Give countable objects explicit shelf/table/room positions, coherent scale and contact shadows. Do not place decorative items where they can be mistaken for additional countable targets.
4. Major — motion is mostly a separate reward. The shared reward() animates prop/part/accent sprites after success; successful Number Snap selections change text immediately. Build causal motion into the actual task: pickup -> travel -> contact -> settle. Do not add perpetual bouncing, particles or moving counting targets.
5. Major — the six learning tasks have insufficiently distinct play outcomes. A changed label and points leave much of the pictured world unchanged. Each game needs a short, cumulative, visible goal tied to correct quantity or number recognition.
6. Moderate — art is not sufficiently prepared for its action. A single scaled paper sprite and whole-book rotation do not depict a hinged page. A generic puzzle reward in a corner does not represent the child's three choices. Supplement only the necessary moving parts, pivots, masks, occlusion layers and shadows. Preserve existing source art and approved audio.

Principles used: visibility of system status, real-world mapping, direct manipulation, visual hierarchy, reducing visual/physical excise, meaningful feedback and deliberate success endings. These are design findings, not claims of measured child learning outcomes.

## Per-game revision brief

| Activity | Current limitation | Target play experience |
| --- | --- | --- |
| Number Parade | Cars appear as repeated floating icons on separate pads. | A small theatre performance: objects enter and come to rest at a shared readable stage line; counting begins only when they are still. Choosing the correct word completes an actual stage sign. Each round contributes to the final show. |
| Toy Detective | A selection grid sits over a furnished room. | Toys occupy clear positions in the room without overlap. The child discovers and marks targets; a discovered object gains a readable marker without changing location. An optional collection step follows counting, preserving target cardinality. No searching behind tiny occluders. |
| Gift Workshop | Inventory and selected tiles swap instantly; packed cars appear on the front of the box. | A close packing table with a real tray and open box. Each toy follows the finger, passes behind the front wall, settles at a stable visible position inside; undo reverses the action. Correct quantity closes the lid, ties the bow and adds one completed gift to the shelf. |
| Number Snap | Three questions use the same four answer buttons; separate puzzle art moves at the end. | The chosen numeral, word and quantity become the actual three persistent pieces. Each piece seats in the child's board, with a small contact/settle response; the completed object is the reward. Text and quantities remain legible. |
| Say & Open | An open blank book waits behind a number; a paper/toy group stretches up at success. | A visible page goal and a prepared pop-up mechanism. Neutral listening/processing feedback, then a hinged page/paper action reveals the exact recognized quantity. No decorative sound during capture. Retry preserves the page state. |
| Toy Town Relay | Two small flags and a score label bear most of the team identity. | Two clearly readable team work areas; equal alternating tasks complete a visible shared construction or two equivalent constructions. Every valid success adds a real piece. No speed scoring or unequal task advantage; support a tie. |

These are revision targets, not implemented features.

## First reference implementation: Gift Workshop

Keep the selected PixiJS + GSAP stack. No new engine/dependency choice is required. GCompris/Sugarizer remain education references; they do not supply a ready-made premium motion treatment.

1. Layout reference: one packing table, order card near the work area, stable inventory, open box, a visible place for completed gifts. Remove the floating inventory overlay and selected-state check tiles from the visual scene.
2. Rig inventory: box back/interior/front lip, lid with hinge pivot, bow parts, toy contact shadows and packed-object positions. Test foreground occlusion and scale before generating supplementary art. Do not regenerate the entire art kit by default.
3. Pickup: immediate feedback; the toy lifts slightly while its shadow changes. Pointer and keyboard/tap alternatives act on the same item ID.
4. Place: pointer release or tap initiates a continuous path into the box. The front lip occludes the toy appropriately. A short settle ends in a stable countable position. Invalid placement returns to the source; quick taps cannot duplicate an object or reward.
5. Count and undo: all deposited objects remain readable and still during counting. Packed-object removal is reversible, including through an accessible list/control.
6. Finish: correct quantity -> answer audio ends -> lid closes about its hinge -> bow completes -> wrapped gift reaches the collection position. Incorrect quantity leaves the box editable and gives specific add/remove guidance.
7. Rhythm: tune pickup, travel, contact and settle together using GSAP. Draft timings are not acceptance criteria; review normal-speed video. Use actual sourced material SFX only where they fit; no stock UI click presented as a physical wrapping recording.
8. Reduced motion: preserve every quantity/state and input alternative without requiring animated travel. Cancel owned motion/audio on exit or backgrounding; preserve stable activity/progress IDs and current AI boundary.

## Acceptance for the revised design checkpoint

- Show one complete representative round, including wrong count, undo, correct count and transition, at normal speed. Provide a before/after capture.
- Review composition at 320/390/768/1024/1366 px. The action and its result must stay in the child's primary field of view; no answer or control hidden by scene art.
- Keep exact object identities, quantities, stable positions, keyboard/tap alternative, audio-ended sequencing, no duplicate points, mute, reduced motion, exit cleanup and unchanged saved achievements.
- Inspect asset pivots, occlusion, edge quality, material consistency and the relationship between contact and sound. Screenshot approval alone cannot accept motion.
- Do not propagate the new treatment to the other five merely because this reference passes automated tests. First review the completed reference visually and with the user's feedback, then apply each game's own brief.

## Skills and current checkpoint

Read/applied for this review: design-skills:design-critique and design-skills:interaction-design. frontend-design, imagegen and official GSAP motion guidance are implementation-stage responsibilities, not newly completed work in this review.

Completed in this checkpoint: audit, code-level causes, six revision briefs and the Gift Workshop reference brief. No game runtime, audio, assets or public deployment changed by this review. No engagement, smoothness or learning-effectiveness acceptance is claimed.
