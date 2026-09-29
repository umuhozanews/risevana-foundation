import{t as e}from"./AstroRouterBoundary.DKT7Epde.js";import{jt as t}from"./shared.BqJ3DuPa.js";import{t as n}from"./Image.LdxrQz0g.js";import{n as r,t as i}from"./responsive-images.CKfFwDuI.js";import{a,p as o}from"./open-house.DFRaFcs-.js";import{n as s,t as c}from"./SectionContentCard.Bql_wrhr.js";import{t as l}from"./EntranceCell.N5N4TPq9.js";var u=t(),{seen:d,structured:f,smallClasses:p,teamSupport:m}=o.cards;function h(){return(0,u.jsxs)(`section`,{className:`relative bg-[#1B1B1B] px-5 pt-[50px] pb-8 md:px-6 md:pt-14 md:pb-0 xl:px-6 xl:pt-24`,"aria-labelledby":`why-families-title`,children:[(0,u.jsx)(`h2`,{id:`why-families-title`,className:`sr-only`,children:o.title}),(0,u.jsx)(`style`,{children:`
        .oh-wf-card-title { min-height: 10.25rem; }
        .oh-wf-card { min-height: 27.56rem; }
        .oh-wf-card-short { min-height: 21.81rem; }

        .oh-wf-title-cell      { order: 1; }
        .oh-wf-seen-cell       { order: 2; }
        .oh-wf-small-cell      { order: 3; }
        .oh-wf-structured-cell { order: 4; }
        .oh-wf-team-cell       { order: 5; }

        /* All card illustrations span full card width via right:0 + width:auto;
           preserve negative left offsets where intentional bleed-past-edge was specified. */
        /* Mobile: image is anchored to the bottom and occupies a fixed 65% of
           card height — the upper 35% stays free for the title so image
           content can never overlap the text. object-fit:cover (default) fills
           the box with no side gaps. */
        .oh-wf-seen-art       { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: 65%; object-fit: cover; object-position: center bottom; }
        .oh-wf-structured-art { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: 65%; object-fit: cover; object-position: center bottom; }
        .oh-wf-small-art      { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: 65%; object-fit: cover; object-position: center bottom; }
        .oh-wf-team-art       { left: 0; right: 0; bottom: 0; top: auto; width: 100%; height: 65%; object-fit: cover; object-position: center bottom; }

        @media (min-width: 768px) {
          .oh-wf-card-title { min-height: 23.75rem; }
          .oh-wf-card { min-height: 23.75rem; }
          .oh-wf-card-short { min-height: 23.75rem; }
          /* Team card on tablet spans the full 8-col row — at 380px the wide
             team asset only shows torsos. Bump just this card so the heads/lake
             scene fits properly. */
          .oh-wf-team-cell > .oh-wf-card-short { min-height: 28.75rem; }

          .oh-wf-title-cell      { order: 0; grid-column: 1 / span 4; grid-row: 1 / span 1; }
          .oh-wf-seen-cell       { order: 0; grid-column: 5 / span 4; grid-row: 1 / span 1; }
          .oh-wf-structured-cell { order: 0; grid-column: 1 / span 4; grid-row: 2 / span 1; }
          .oh-wf-small-cell      { order: 0; grid-column: 5 / span 4; grid-row: 2 / span 1; }
          .oh-wf-team-cell       { order: 0; grid-column: 1 / span 8; grid-row: 3 / span 1; }

          /* Image is pinned to the bottom and capped at 75% of card height so
             the top 25% stays reserved for the title at every tablet width —
             the picture can never bleed under the text regardless of viewport. */
          .oh-wf-seen-art       { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center bottom; }
          .oh-wf-structured-art { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center bottom; }
          .oh-wf-small-art      { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center bottom; }
          /* Team card on tablet: cover + top anchor reveals the people's heads
             and wands at the upper edge of the image bbox. Combined with the
             460px min-height bump above, full upper bodies stay visible. No
             side gaps (width 100% + cover). */
          .oh-wf-team-art       { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 80%; object-fit: cover; object-position: center top; }
        }

        @media (min-width: 1280px) {
          .oh-wf-card-title { min-height: 27.75rem; }
          .oh-wf-card { min-height: 27.75rem; }
          /* Bottom row (small-classes + team) was 444 — heads of the teacher
             and team members crowded the top edge. Bump so the 75% image bbox
             gets more height and the figures sit lower in the card. */
          .oh-wf-card-short { min-height: 33.75rem; }

          .oh-wf-title-cell      { grid-column: 1 / span 4; grid-row: 1 / span 4; }
          .oh-wf-seen-cell       { grid-column: 5 / span 4; grid-row: 1 / span 4; }
          .oh-wf-structured-cell { grid-column: 9 / span 4; grid-row: 1 / span 4; }
          .oh-wf-small-cell      { grid-column: 1 / span 6; grid-row: 5 / span 4; }
          .oh-wf-team-cell       { grid-column: 7 / span 6; grid-row: 5 / span 4; }

          /* Same 75% bottom-anchor rule on desktop — guarantees the title zone
             stays free. Team uses center anchor (asset's people are vertically
             middle-of-frame) — bottom-anchor crops faces. */
          .oh-wf-seen-art       { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center bottom; }
          .oh-wf-structured-art { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center bottom; }
          .oh-wf-small-art      { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center bottom; }
          .oh-wf-team-art       { left: 0; right: 0; top: auto; bottom: 0; width: 100%; height: 75%; object-fit: cover; object-position: center center; }
        }

        /* Otter group.
           On MOBILE, the title-cell is static so the otters anchor to the
           section itself (which is position:relative) — placing them near
           the bottom of the section, just above the team-support card, per
           the user's intent. On TABLET/DESKTOP, the title-cell is the
           relative ancestor and a single combined PNG rides above the
           title card. */
        .oh-wf-otters         { position: absolute; left: 0; width: clamp(15rem, 65vw, 19.56rem); aspect-ratio: 313 / 191; height: auto; pointer-events: none; z-index: 4; }
        .oh-wf-otter-combined { position: absolute; left: 0; bottom: 0; width: 15rem; height: auto; z-index: 3; }
        .oh-wf-otter-pair     { position: absolute; left: 0; bottom: 0; width: 100%; height: auto; z-index: 3; }

        /* Mobile: only the mobile-combined PNG is shown; the tablet/desktop
           pair is hidden. Anchored to the section, just bleeding past the
           bottom edge. */
        .oh-wf-otters { bottom: -1.25rem; }
        .oh-wf-otter-pair { display: none; }

        @media (min-width: 768px) {
          /* Title-cell becomes the relative ancestor at tablet+; mobile uses
             the section directly. */
          .oh-wf-title-cell { position: relative; }
          .oh-wf-otters { bottom: 70%; }
          /* Tablet/desktop swap to the single combined pair asset. */
          .oh-wf-otter-combined { display: none; }
          .oh-wf-otter-pair     { display: block; }
        }

        @media (min-width: 768px) and (max-width: 1279px) {
          .oh-wf-otters { width: clamp(18rem, 30vw, 23.75rem); aspect-ratio: 380 / 275; height: auto; }
        }

        @media (min-width: 1280px) {
          .oh-wf-otters { width: clamp(24rem, 35vw, 31.38rem); aspect-ratio: 502 / 363; height: auto; }
        }
      `}),(0,u.jsxs)(`div`,{className:`grid grid-cols-1 gap-5 md:grid-cols-8 md:gap-5 xl:grid-cols-12`,children:[(0,u.jsxs)(`div`,{className:`oh-wf-title-cell oh-wf-card-title`,children:[(0,u.jsx)(l,{index:0,className:`h-full`,children:(0,u.jsx)(s,{title:o.title,color:a.green,className:`text-[clamp(2.1rem,2.78vw,4.5rem)] md:text-[clamp(2.45rem,3.24vw,5.25rem)] xl:text-[clamp(2.8rem,3.7vw,6rem)]`,align:`center`,textAlign:`center`})}),(0,u.jsxs)(`div`,{className:`oh-wf-otters`,"aria-hidden":`true`,children:[(0,u.jsx)(n,{src:`/images/open-house/deco-otters-mobile.png`,alt:``,"aria-hidden":`true`,className:`oh-wf-otter-combined`}),(0,u.jsx)(n,{src:`/images/open-house/deco-otters.png`,alt:``,"aria-hidden":`true`,className:`oh-wf-otter-pair`})]})]}),(0,u.jsx)(l,{index:1,className:`oh-wf-seen-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:d.text,bgColor:a.green,illustration:d.illustration,illustrationClassName:`oh-wf-seen-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.4rem,1.85vw,3rem)]`,className:`oh-wf-card`})}),(0,u.jsx)(l,{index:2,className:`oh-wf-structured-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:f.text,bgColor:a.green,illustration:f.illustration,illustrationClassName:`oh-wf-structured-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.4rem,1.85vw,3rem)]`,className:`oh-wf-card`})}),(0,u.jsx)(l,{index:0,className:`oh-wf-small-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:p.text,bgColor:a.green,illustration:p.illustration,illustrationClassName:`oh-wf-small-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.4rem,1.85vw,3rem)]`,className:`oh-wf-card-short`})}),(0,u.jsx)(l,{index:1,className:`oh-wf-team-cell`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:m.text,bgColor:a.green,illustration:m.illustration,illustrationClassName:`oh-wf-team-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.53rem,2.03vw,3.28rem)]`,textStyle:{maxWidth:460},className:`oh-wf-card-short`})})]})]})}function g(){return(0,u.jsx)(e,{location:`/open-house`,children:(0,u.jsx)(h,{})})}export{g as default};