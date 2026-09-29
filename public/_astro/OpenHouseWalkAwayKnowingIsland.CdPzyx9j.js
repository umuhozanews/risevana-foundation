import{t as e}from"./AstroRouterBoundary.DKT7Epde.js";import{jt as t}from"./shared.BqJ3DuPa.js";import{t as n}from"./Image.LdxrQz0g.js";import{n as r,t as i}from"./responsive-images.CKfFwDuI.js";import{a,d as o}from"./open-house.DFRaFcs-.js";import{n as s,t as c}from"./SectionContentCard.Bql_wrhr.js";import{t as l}from"./EntranceCell.N5N4TPq9.js";var u=t();function d(){let[e,t,d]=o.cards;return(0,u.jsxs)(`section`,{className:`relative bg-[#1B1B1B] px-5 pt-[50px] md:px-6 md:pt-14 xl:pt-24`,"aria-labelledby":`walk-away-title`,children:[(0,u.jsx)(`h2`,{id:`walk-away-title`,className:`sr-only`,children:o.title}),(0,u.jsxs)(`div`,{"aria-hidden":`true`,className:`oh-wa-dragonflies pointer-events-none absolute inset-x-0 z-[1]`,children:[(0,u.jsx)(n,{src:`/images/open-house/deco-dragonfly-female.png`,alt:``,"aria-hidden":`true`,className:`oh-wa-dragonfly-female pointer-events-none absolute`}),(0,u.jsx)(n,{src:`/images/open-house/deco-dragonfly-male.png`,alt:``,"aria-hidden":`true`,className:`oh-wa-dragonfly-male pointer-events-none absolute`}),(0,u.jsx)(n,{src:`/images/open-house/deco-dragonfly-floating.png`,alt:``,"aria-hidden":`true`,className:`oh-wa-dragonfly-floating pointer-events-none absolute`})]}),(0,u.jsx)(`style`,{children:`
        /* Dragonfly overlay — sits at the top of the section (just below hero)
           and partially overlaps the title card top so they decorate the card
           rather than float in empty space. Sizes/offsets in vw. z-index above
           the title card content (which has its own z-index 2 inside the card). */
        /* Mobile (≤768): spec-base 390px viewport */
        .oh-wa-dragonflies { top: 1vw; height: 30vw; }
        .oh-wa-dragonfly-female   { left: 0vw;    top: 0;    width: 27vw;   transform: rotate(68.36deg); }
        .oh-wa-dragonfly-male     { left: 32vw;   top: 7vw;  width: 12.5vw; transform: rotate(119.77deg); }
        .oh-wa-dragonfly-floating { left: 47vw;   top: 4vw;  width: 6.5vw;  transform: scaleY(-1) rotate(-160.69deg); }
        /* Tablet (768–1280): spec-base 768px viewport */
        @media (min-width: 768px) {
          .oh-wa-dragonflies { top: 1vw; height: 24vw; }
          .oh-wa-dragonfly-female   { left: 0vw;    top: 0;     width: 24vw;   }
          .oh-wa-dragonfly-male     { left: 28.5vw; top: 6.3vw; width: 11vw;   }
          .oh-wa-dragonfly-floating { left: 41vw;   top: 4vw;   width: 5.6vw;  }
        }
        /* Desktop (≥1280): spec-base 1280px viewport */
        @media (min-width: 1280px) {
          .oh-wa-dragonflies { top: 1vw; height: 15vw; }
          .oh-wa-dragonfly-female   { left: -1vw;   top: 0;     width: 14.5vw; }
          .oh-wa-dragonfly-male     { left: 16.5vw; top: 3.5vw; width: 6.5vw;  }
          .oh-wa-dragonfly-floating { left: 23vw;   top: 2.5vw; width: 3.4vw;  }
        }
        .oh-wa-card { min-height: 23.75rem; }
        .oh-wa-card-title { min-height: 11.25rem; }
        /* Card illustrations: pinned bottom-right; full-width with natural aspect, top overflow clipped by card overflow:hidden.
           Card1 mobile-only: enlarged to 150% width (centered, clipped) per Figma 870:2451 so the picnic family fills the card bottom. */
        /* Figma 870:2451 (mobile): the full picnic scene spans the card width
           edge-to-edge at natural aspect, bottom-anchored. (An earlier
           width:auto + fixed-height combo was silently distorted by Tailwind
           preflight's img{max-width:100%}.) */
        .oh-wa-card1-art { left: 0; bottom: 0; width: 100%; height: auto; transform: none; }
        .oh-wa-card2-art { left: 50%; bottom: 0; height: 13.75rem; width: auto; transform: translateX(-50%) scaleX(-1); }
        .oh-wa-card3-art { left: 0; right: 0; bottom: 0; width: auto; height: auto; }
        @media (min-width: 768px) {
          .oh-wa-card { min-height: 21.88rem; }
          .oh-wa-card-title { min-height: 21.88rem; }
          /* Reset card1 transform from mobile so tablet/desktop layout is unaffected. */
          .oh-wa-card1-art { left: auto; right: 0; bottom: 0; width: 100%; height: auto; transform: none; }
          .oh-wa-card2-art { left: 0; right: 0; bottom: -15%; width: auto; height: auto; transform: scaleX(-1); }
          .oh-wa-card3-art { left: 0; right: 0; bottom: 0; width: auto; height: auto; }
        }
        /* Desktop geometry from Figma 688:413 (cards 343.86 tall at 1512 → 22.74vw).
           card1 replicates Figma's FILL: the 1.78 picnic PNG squashed into a 2.96
           box (843×285 of a 969-wide card) — intentional, don't "fix" to cover.
           max-width:none everywhere: Tailwind preflight would clamp >100% widths. */
        @media (min-width: 1280px) {
          .oh-wa-card { min-height: clamp(18rem, 22.74vw, 26rem); }
          .oh-wa-card-title { min-height: clamp(18rem, 22.74vw, 26rem); }
          .oh-wa-card1-art { left: 20.3%; right: auto; bottom: 0; width: 87%; height: 82.9%;
            max-width: none; object-fit: fill; transform: none; }
          .oh-wa-card2-art { left: -0.1%; right: auto; bottom: -15.8%; width: 100.1%; height: auto;
            max-width: none; transform: scaleX(-1); }
          .oh-wa-card3-art { left: -1.5%; right: auto; bottom: 0; width: 102%; height: auto;
            max-width: none; }
        }
      `}),(0,u.jsxs)(`div`,{className:`grid grid-cols-4 gap-5 md:grid-cols-8 xl:grid-cols-12`,children:[(0,u.jsx)(l,{index:0,className:`oh-wa-card-title col-span-4 md:col-span-4 xl:col-span-4`,children:(0,u.jsx)(s,{title:o.title,color:a.orange,className:`text-[clamp(2.1rem,2.78vw,4.5rem)] md:text-[clamp(2.45rem,3.24vw,5.25rem)] xl:text-[clamp(2.8rem,3.7vw,6rem)]`,align:`end`,textAlign:`left`})}),(0,u.jsx)(l,{index:1,className:`col-span-4 md:col-span-4 xl:col-span-8`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:e.text,bgColor:a.orange,illustration:e.illustration,illustrationClassName:`oh-wa-card1-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.4rem,1.85vw,3rem)]`,textStyle:{maxWidth:345},className:`oh-wa-card`})}),(0,u.jsx)(l,{index:0,className:`col-span-4 md:col-span-4 xl:col-span-6`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:t.text,bgColor:a.orange,illustration:t.illustration,illustrationClassName:`oh-wa-card2-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.4rem,1.85vw,3rem)]`,textStyle:{maxWidth:427},className:`oh-wa-card`})}),(0,u.jsx)(l,{index:1,className:`col-span-4 md:col-span-4 xl:col-span-6`,children:(0,u.jsx)(c,{illustrationWidths:i,illustrationSizes:r,text:d.text,bgColor:a.orange,illustration:d.illustration,illustrationClassName:`oh-wa-card3-art`,textClassName:`text-[clamp(1.4rem,1.85vw,3rem)] md:text-[clamp(1.4rem,1.85vw,3rem)] xl:text-[clamp(1.4rem,1.85vw,3rem)]`,textStyle:{maxWidth:291},className:`oh-wa-card`})})]})]})}function f(){return(0,u.jsx)(e,{location:`/open-house`,children:(0,u.jsx)(d,{})})}export{f as default};