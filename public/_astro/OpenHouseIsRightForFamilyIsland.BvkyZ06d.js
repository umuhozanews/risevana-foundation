import{t as e}from"./AstroRouterBoundary.DKT7Epde.js";import{jt as t}from"./shared.BqJ3DuPa.js";import{t as n}from"./Image.LdxrQz0g.js";import{n as r,t as i}from"./responsive-images.CKfFwDuI.js";import{a,r as o}from"./open-house.DFRaFcs-.js";import{n as s,t as c}from"./SectionContentCard.Bql_wrhr.js";import{t as l}from"./EntranceCell.N5N4TPq9.js";var u=t(),[d,f,p,m,h]=o.cards,g=o.centerTallCard;function _(){return(0,u.jsxs)(`section`,{className:`relative bg-[#1B1B1B] px-5 pb-0 md:px-6 md:pb-24 xl:px-6 xl:pb-24`,"aria-labelledby":`is-right-title`,children:[(0,u.jsx)(`h2`,{id:`is-right-title`,className:`sr-only`,children:o.title}),(0,u.jsx)(`style`,{children:`
        .oh-ir-card-title { min-height: 10.81rem; }
        .oh-ir-card { min-height: 22.88rem; }
        .oh-ir-card-tall { min-height: 41rem; }
        .oh-ir-card-wide { min-height: 28.94rem; }
        /* Card7 is wide-class for tablet/desktop layout, but on mobile it's a
           standard 366h card per Figma 870:2555 (h=366). Mobile-only override.
           Targets the SCC inner div (descendant of the cell wrapper). */
        .oh-ir-card7-cell .oh-ir-card-wide { min-height: 22.88rem; }

        /* Mobile order: Title (1), CenterTall (2), Card1 (3), Card4 (4), Card5 (5), Card6 (6), Card7 (7) */
        .oh-ir-title-cell  { order: 1; }
        .oh-ir-center-cell { order: 2; }
        .oh-ir-card1-cell  { order: 3; }
        .oh-ir-card4-cell  { order: 4; }
        .oh-ir-card5-cell  { order: 5; }
        .oh-ir-card6-cell  { order: 6; }
        .oh-ir-card7-cell  { order: 7; }

        /* Card decorative illustration positions — MOBILE base.
           Mobile: every illustration is full-width, bottom-anchored within
           its card. The bg-art layer is hidden on mobile (only Card1 has one;
           it's used on tablet/desktop where there's a layered landscape). */
        .oh-ir-card1-bg-art { display: none; }
        /* Mobile: object-contain prevents top-crop of figures' heads at any
           viewport width; image fits within bottom 70% of card without crop. */
        .oh-ir-card1-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 70%; object-fit: contain; object-position: center bottom; }
        .oh-ir-center-art   { left: 0; right: 0; bottom: 0; width: 100%; height: 70%; object-fit: contain; object-position: center bottom; }
        .oh-ir-card4-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 70%; object-fit: contain; object-position: center bottom; }
        .oh-ir-card5-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 70%; object-fit: contain; object-position: center bottom; }
        /* Card6/7 on mobile: image is anchored to the BOTTOM of the card and
           occupies a fixed 70% of card height (so the upper 30% always stays
           free for the title — image can never overlap text). object-fit:cover
           keeps the image filling the box with no side gaps; card6 uses
           object-position 100% bottom to shift the visible image content to
           the right, which makes the family appear more to the left of the card. */
        .oh-ir-card6-art    { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: 70%; object-fit: cover; object-position: 100% bottom; }
        .oh-ir-card7-art    { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: 82%; object-fit: contain; object-position: center bottom; transform: scaleX(-1); }

        @media (min-width: 768px) {
          .oh-ir-card { min-height: 20rem; }
          .oh-ir-card-tall { min-height: 50rem; }
          /* card6/7 on tablet were 380 — figures' heads pressed against the
             top edge. Bump to 460 so there's clearance above the heads. */
          .oh-ir-card-wide { min-height: 28.75rem; }
          .oh-ir-card7-cell .oh-ir-card-wide { min-height: 28.75rem; }
          .oh-ir-card-title { min-height: 20rem; }
          /* Tablet grid placements via grid-area */
          .oh-ir-title-cell  { order: 0; grid-column: 1 / span 4; grid-row: 1 / span 1; }
          .oh-ir-card1-cell  { order: 0; grid-column: 5 / span 4; grid-row: 1 / span 1; }
          .oh-ir-center-cell { order: 0; grid-column: 1 / span 4; grid-row: 2 / span 2; }
          .oh-ir-card4-cell  { order: 0; grid-column: 5 / span 4; grid-row: 2 / span 1; }
          .oh-ir-card5-cell  { order: 0; grid-column: 5 / span 4; grid-row: 3 / span 1; }
          .oh-ir-card6-cell  { order: 0; grid-column: 1 / span 8; grid-row: 4 / span 1; }
          .oh-ir-card7-cell  { order: 0; grid-column: 1 / span 8; grid-row: 5 / span 1; }

          /* bg-art content sits left-of-frame in the asset (alpha bbox x 27..100%);
             with a centered cover crop the picnic mat hugged the card's left edge
             and left a purple gap on the right. Right-anchoring re-centres the
             visible scene: purple margins on both sides, no figure cut at the edge. */
          .oh-ir-card1-bg-art { display: block; left: 0; right: 0; bottom: 0; top: 0; width: 100%; height: 100%; opacity: 1; object-fit: cover; object-position: 100% bottom; }
          /* Card1 on tablet: text "Your kid thrives in smaller, more focused
             learning environments" wraps to 3 lines. At 75% image height the
             top-25% (~80px) text band was too short and the last word ran
             behind the cat. Drop image to 60% so the text reserve grows to
             40% (~128px) and fits 3 lines comfortably. */
          .oh-ir-card1-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 60%; object-position: center bottom; }
          /* CenterTall on tablet: was contain at 75% — image rendered
             letterboxed inside the bottom 75% (sides + bottom both showed
             empty purple), AND the 25% top reserve created an additional
             empty band. Switch to cover at 90% so the family-with-chicks
             scene fills the card; the upper 10% (~80px on a 800-tall card)
             is enough for the title to sit above. */
          .oh-ir-center-art   { left: 0; right: 0; bottom: 0; width: 100%; height: 90%; object-fit: cover; object-position: center bottom; }
          .oh-ir-card4-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 75%; object-position: center bottom; }
          .oh-ir-card5-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 75%; object-position: center bottom; }
          /* Tablet: image fills the bottom 75% of card. We anchor object-position
             to center top (instead of bottom) so the kids' heads stay visible
             when the box ratio is wider than the image's natural ratio — only
             the lower part (grass/legs) gets cropped on very wide viewports.
             Card7 is also mirrored horizontally. */
          /* Card6/7 on tablet: image fills the full card. Anchor to top so the
             figures' heads stay visible on iPad-class viewports where the
             cover scale overflows vertically (a 30% anchor cropped into the
             heads). Bottom band of grass is the safer thing to clip.
             Card7 is mirrored. */
          /* Card6 asset has a tall transparent band above the family figures.
             Sizing the img to 175% of card height + bottom-anchoring crops that
             empty band away (parent has overflow-hidden) so the family scales
             up and sits high in the card instead of leaving a wide empty
             purple band above the heading. */
          /* Card6 on tablet: cover (so the image fills card width with no side
             gaps) + a 60% vertical anchor so when the wider tablets force a
             slight vertical overflow, the crop is biased toward the bottom
             grass band — heads and feet both stay inside the card. */
          .oh-ir-card6-art    { left: 0; right: 0; top: 0; bottom: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 60%; }
          /* Card7 specifically: bbox bottom-anchored at 92% so the binoculars
             figures sit a touch lower in the card with a small purple band
             above their heads — without this they pressed against the top edge. */
          .oh-ir-card7-art    { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 92%; object-fit: cover; object-position: center top; transform: scaleX(-1); }
        }

        @media (min-width: 1280px) {
          .oh-ir-card { min-height: 20rem; }
          .oh-ir-card-tall { min-height: 50rem; }
          /* Card6/7 hold tall figures (binoculars users, expat family) — at
             420 their heads pressed against the top edge. Bump so the natural-
             height bottom-anchored image leaves clearance above the heads. */
          .oh-ir-card-wide { min-height: 32.5rem; }
          .oh-ir-card7-cell .oh-ir-card-wide { min-height: 32.5rem; }
          .oh-ir-card-title { min-height: 20rem; }
          .oh-ir-title-cell  { grid-column: 9 / span 4; grid-row: 1 / span 3; }
          .oh-ir-card1-cell  { grid-column: 1 / span 4; grid-row: 1 / span 3; }
          .oh-ir-center-cell { grid-column: 5 / span 4; grid-row: 1 / span 6; }
          .oh-ir-card4-cell  { grid-column: 1 / span 4; grid-row: 4 / span 3; }
          .oh-ir-card5-cell  { grid-column: 9 / span 4; grid-row: 4 / span 3; }
          .oh-ir-card6-cell  { grid-column: 1 / span 6; grid-row: 7 / span 3; }
          .oh-ir-card7-cell  { grid-column: 7 / span 6; grid-row: 7 / span 3; }

          /* Right-anchored for the same re-centring reason as tablet (see above). */
          .oh-ir-card1-bg-art { display: block; left: 0; right: 0; bottom: 0; top: 0; width: 100%; height: 100%; opacity: 1; object-fit: cover; object-position: 100% bottom; }
          /* Same 60% rule as tablet — keeps the 3-line text from running into
             the cat. Card1 desktop is 4 cols × 3 rows, similar aspect to tablet. */
          .oh-ir-card1-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 60%; object-position: center bottom; }
          /* Center tall card on desktop: card is 800px tall (6 rows). At 50%
             the contained image rendered tiny in the bottom 400px and the
             upper half of the card was empty purple. Bump to 80% so the
             family-with-chicks scene fills most of the card; the title still
             gets a comfortable 20% top band. */
          .oh-ir-center-art   { left: 0; right: 0; bottom: 0; width: 100%; height: 80%; object-fit: contain; object-position: center bottom; }
          .oh-ir-card4-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 75%; object-position: center bottom; }
          .oh-ir-card5-art    { left: 0; right: 0; bottom: 0; width: 100%; height: 75%; object-position: center bottom; }
          .oh-ir-card6-art    { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: auto; object-position: center bottom; }
          .oh-ir-card7-art    { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: auto; object-position: center bottom; transform: scaleX(-1); }

          /* Duck family anchored to the title cell. The title sits at the
             bottom of the black card (align="end"), so the ducks ride the TOP
             edge — mama mostly above the card with her body cresting onto it,
             ducklings perched on the top edge of the card.
             Sizes/offsets in vw so the family scales with viewport (design
             baseline 1440 → 1px ≈ 0.0694vw). */
          .oh-ir-duck-mama { right: -3.47vw;  top: -12.5vw; width: 24.58vw; height: 23.19vw; transform: scaleX(-1); z-index: 4; }
          .oh-ir-duck-01   { right: -0.69vw;  top:  2.08vw; width: 10.83vw; height:  7.71vw; transform: scaleY(-1) rotate(180deg); z-index: 5; }
          .oh-ir-duck-02   { right:  7.64vw;  top:  3.47vw; width:  8.19vw; height:  5.76vw; transform: scaleY(-1) rotate(180deg); z-index: 5; }
        }

      `}),(0,u.jsxs)(`div`,{className:`grid grid-cols-1 gap-5 md:grid-cols-8 md:gap-5 xl:grid-cols-12`,children:[(0,u.jsxs)(l,{index:2,className:`oh-ir-title-cell oh-ir-card-title relative`,children:[(0,u.jsx)(s,{title:o.title,color:a.purpleLight,className:`text-[clamp(2.1rem,2.78vw,4.5rem)] md:text-[clamp(2.45rem,3.24vw,5.25rem)] xl:text-[clamp(2.8rem,3.7vw,6rem)]`,align:`end`,textAlign:`left`}),(0,u.jsx)(n,{src:`/images/open-house/deco-duck-mama.png`,alt:``,"aria-hidden":`true`,className:`oh-ir-duck-mama pointer-events-none absolute hidden xl:block`}),(0,u.jsx)(n,{src:`/images/open-house/deco-duckling.png`,alt:``,"aria-hidden":`true`,className:`oh-ir-duck-01 pointer-events-none absolute hidden xl:block`}),(0,u.jsx)(n,{src:`/images/open-house/deco-duckling.png`,alt:``,"aria-hidden":`true`,className:`oh-ir-duck-02 pointer-events-none absolute hidden xl:block`})]}),(0,u.jsx)(l,{index:0,className:`oh-ir-card1-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:d.text,bgColor:a.purpleLight,illustration:d.illustration,illustrationClassName:`oh-ir-card1-art`,bgArt:d.bgArt,bgArtClassName:`oh-ir-card1-bg-art`,textClassName:`text-[clamp(1.75rem,2.31vw,3.75rem)] md:text-[clamp(1.75rem,2.31vw,3.75rem)] xl:text-[clamp(1.75rem,2.31vw,3.75rem)]`,textStyle:{maxWidth:404},className:`oh-ir-card`})}),(0,u.jsx)(l,{index:1,className:`oh-ir-center-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:g.text,bgColor:a.purpleLight,illustration:g.illustration,illustrationClassName:`oh-ir-center-art`,textClassName:`text-[clamp(1.75rem,2.31vw,3.75rem)] md:text-[clamp(1.75rem,2.31vw,3.75rem)] xl:text-[clamp(1.75rem,2.31vw,3.75rem)]`,className:`oh-ir-card-tall`})}),(0,u.jsx)(l,{index:0,className:`oh-ir-card4-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:f.text,bgColor:a.purpleLight,illustration:f.illustration,illustrationClassName:`oh-ir-card4-art`,textClassName:`text-[clamp(1.75rem,2.31vw,3.75rem)] md:text-[clamp(1.75rem,2.31vw,3.75rem)] xl:text-[clamp(1.75rem,2.31vw,3.75rem)]`,className:`oh-ir-card`})}),(0,u.jsx)(l,{index:2,className:`oh-ir-card5-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:p.text,bgColor:a.purpleLight,illustration:p.illustration,illustrationClassName:`oh-ir-card5-art`,textClassName:`text-[clamp(1.75rem,2.31vw,3.75rem)] md:text-[clamp(1.75rem,2.31vw,3.75rem)] xl:text-[clamp(1.75rem,2.31vw,3.75rem)]`,className:`oh-ir-card`})}),(0,u.jsx)(l,{index:0,className:`oh-ir-card6-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:m.text,bgColor:a.purpleLight,illustration:m.illustration,illustrationClassName:`oh-ir-card6-art`,textClassName:`text-[clamp(1.75rem,2.31vw,3.75rem)] md:text-[clamp(1.75rem,2.31vw,3.75rem)] xl:text-[clamp(1.75rem,2.31vw,3.75rem)]`,textStyle:{maxWidth:293},className:`oh-ir-card-wide`})}),(0,u.jsx)(l,{index:1,className:`oh-ir-card7-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:h.text,bgColor:a.purpleLight,illustration:h.illustration,illustrationClassName:`oh-ir-card7-art`,textClassName:`self-end text-right text-[clamp(1.75rem,2.31vw,3.75rem)] md:text-[clamp(1.75rem,2.31vw,3.75rem)] xl:text-[clamp(1.75rem,2.31vw,3.75rem)]`,textStyle:{maxWidth:305},className:`oh-ir-card-wide`})})]})]})}function v(){return(0,u.jsx)(e,{location:`/open-house`,children:(0,u.jsx)(_,{})})}export{v as default};