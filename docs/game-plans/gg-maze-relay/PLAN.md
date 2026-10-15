# Gg Maze Relay - implementation plan

Date: 2026-10-15. Status: implemented and verified on GitHub Pages, functional release 4fd997b.

## Scope and chosen approach

User chose Gg Maze Relay, two teams alternating, replacing Unit 3 Lesson 3 Activity 4. Preserve route big-small, game u3ggsort and progress key 3/3/big-small. Four equivalent task categories per team (eight scored turns), no mic. First-correct 2 points; supported 1. Tie is a shared win; no speed bonus. No server, accounts or new framework. Practice stars derive from accuracy of the shared match and retain best prior stars; temporary team scores are not individual proficiency evidence.

## Repos and skills

Existing local PixiJS 8.22.0 (MIT) for layered garden, paths, avatars and finite particles; GSAP 3.15.0 under existing vendor license for gate/player choreography. Same approved stack, no additional runtime dependency. Official references: https://pixijs.com/8.x/guides/components/scene-objects/container and https://gsap.com/docs/v3/GSAP/gsap.timeline()/ . Existing shared/learning-motion.js owns timelines. Skills read/applied: frontend-design (scene hierarchy/palette), interaction-design (state and fairness), imagegen (new decorative art), design-critique (visual review). No claim that library installation itself improves learning.

## Art direction and layers

Matte storybook garden: mint #dceccf, hedge #47764f, path honey #edd6a5, ink #244e57, sun orange #e8a03f, moon lavender #8b76c8. App fonts retained; G/g uses existing original SVG model. Scene is the main surface with visible intersecting paths and cul-de-sacs. New quiet garden background behind code-native paths, illustrated blank wooden arch at each reachable gate, separate approved girl avatar and guitar destination, ticket collectibles and restrained sparkle burst. Letter/word gate controls are large DOM overlays; prompts remain outside rendering canvas for accessibility. Wide view: board beside mission panel. Mobile: prompt, compact board, readable gate controls without horizontal overflow.

## Storyboard/state flow

Setup (Sun/Moon, first-team choice) -> mission -> choose (three reachable gates) -> wrong (gate stays closed, retry) / hint (support mark) -> correct (lock input, play approved word feedback where relevant, await audio-ended) -> gate open -> avatar follows route -> ticket/score -> explicit next-team button -> next mission. End after eight resolved turns: winner/shared win, both score totals, stars, replay/activities. Audio-error keeps score uncommitted until retry or continue muted; reduce motion replaces travel with final position. Background stops when document hidden; leave cancels all owned work. Rendering failure uses static board and same DOM choices.

## Gates

- [x] User concept/stack choice recorded; rules and scope frozen.
- [x] Existing routes, glyphs, artwork/audio and progress API inspected.
- [x] New background and gate art copied locally with provenance and alpha check.
- [x] Implement renderer, DOM controls, turn/scoring state and lifecycle.
- [x] Test correct/wrong/hint, both starting teams, ties, equal exposure, replay and old best stars.
- [x] Audio-error/mute/rapid clicks/keyboard/hidden/exit/render fallback/reduced motion.
- [x] Five widths, actual-speed motion recording and visual critique.
- [x] Public served-source/asset verification and complete live match.

## Evidence/limits

Public gate PASS: Pages run 38690254914 completed successfully; gg-maze-public-assets.spec.cjs verified served index, Activity 4 metadata, both modules and both new WebP hashes. gg-maze-relay.spec.cjs passed against the live Pages URL: two full matches, both starting teams, score/hint/tie behavior, old best stars, five widths/visible gate bounds, reduced motion and cleanup. Desktop mirror synchronized. Final visual review used the shipped source; no claims of measured learning gains or device performance.

Local tests PASS: gg-maze-relay.spec.cjs completed two matches (both starters), exact wrong/hint score and tie behavior, prior best stars, all five widths with visible 48px gates, reduced motion and cleanup. gg-maze-edges.spec.cjs covers blocked Pixi/static fallback, audio-error/retry/silent without penalty, audio-ended gating, mute, keyboard and rapid-click deduplication. Existing five Gg workshop activities regression passed. Visual critique found unequal letter sizes and clipped mobile board; both corrected and test asserts actual gate bounds. Main recordings in tests/gg-maze-video; six timestamped frames reviewed from actual-speed source via gg-maze-motion-review.cjs. watch-video was attempted but lacked ffprobe; browser video decoding used locally without transcription. Movement uses the approved still girl sprite along a GSAP path, not a skeletal walking animation. Shared practice stars do not measure individual reading or pronunciation.

Technical tests will not establish children's learning gains or actual classroom competition quality. New team scores stay in the active match; no persistent student leaderboard.
