import fs from 'fs';
// ---------------------------------------------------------------------------
// betPawa · UX Review Week — Findings Hub
// Static snapshot aggregated from each reviewer's Figma "UX Findings" page.
// Snapshot date passed via argv (Figma is not live-fetchable from a webpage).
// ---------------------------------------------------------------------------
const SNAPSHOT = process.argv[2] || 'snapshot';

const topics = [
  {
    name: 'Global Navigation', reviewer: 'Jim', tag: 'law',
    flows: [{
      flow: 'betPawa.ng — Global Navigation',
      images: [
        {src:'img/global-navigation/01-home.png',label:'01 · Home'},
        {src:'img/global-navigation/02-sports.png',label:'02 · Sports'},
        {src:'img/global-navigation/03-live.png',label:'03 · Live'},
        {src:'img/global-navigation/04-casino.png',label:'04 · Casino'},
        {src:'img/global-navigation/05-virtuals.png',label:'05 · Virtuals'},
        {src:'img/global-navigation/06-menu.png',label:'06 · Menu'},
        {src:'img/global-navigation/07-betslip.png',label:'07 · Betslip'},
        {src:'img/global-navigation/08-my-bets.png',label:'08 · My Bets'},
        {src:'img/global-navigation/09-account.png',label:'09 · Account'},
        {src:'img/global-navigation/10-logged-out.png',label:'10 · Logged-out'},
      ],
      strengths: [
        {text:"Persistent bottom bar keeps the betting loop (Sports · Betslip · My bets · Account) one tap away from anywhere.", law:"Fitts's Law"},
        {text:"Betslip is a self-contained sheet — Betslip↔My bets pill, an “accept odds change” toggle, and clear stake/odds/payout.", law:"Jakob's Law"},
        {text:"Sport + market selections persist in the URL — browser back/refresh keep the user’s place.", law:"Mental Model"},
        {text:"Casino & Virtuals keep the product header (Sports/Live/Casino/Virtuals) — consistent within those products.", law:"Law of Common Region"},
      ],
      frictions: [
        {text:"Bottom bar represents only Sports of the four products — Home/Live/Casino/Virtuals aren’t in the bar.", law:"Jakob's Law"},
        {text:"No active state on Home/Casino/Virtuals; on Live the bar highlights “Sports” — absent/conflicting “you are here”.", law:"Von Restorff Effect"},
        {text:"Entering Sports/Live replaces the product switcher with the sports sub-nav — you can’t reach Casino/Virtuals from within Sports without the Menu.", law:"Mental Model"},
        {text:"Three overlapping nav surfaces (header + bottom bar + full-screen Menu) duplicate the same destinations.", law:"Occam's Razor"},
        {text:"My Bets is reachable three ways (bottom-nav bets page, betslip pill, Account drawer) with different presentations.", law:"Occam's Razor"},
        {text:"Help / Support has no top-level entry — it lives only inside the Account drawer.", law:"Jakob's Law"},
        {text:"The bottom bar changes between logged-out and logged-in (Join Now ↔ My bets).", law:"Jakob's Law"},
        {text:"No labelled “Home” anywhere — the homepage is reachable only via the logo and an unlabelled sub-nav icon; nothing in the header or bottom bar says Home.", law:"Jakob's Law"},
        {text:"No single, obvious “Home”: the logo returns to the homepage while the bottom-nav “Sports” opens the events list — two different pages. A dedicated Home in the bottom bar, in the thumb zone, would give one clear way back.", law:"Mental Model"},
        {text:"The in-content home shortcut is inconsistent — the sub-nav home icon appears on Sports/Casino/Virtuals but is replaced by “Upcoming” on Live, and it’s an icon-only ~40px tap target.", law:"Fitts's Law"},
      ],
    }],
  },
  {
    name: 'Live Betting', reviewer: 'Henry', tag: 'severity',
    flows: [
      {flow:'Live event discovery',
       strengths:[
        {text:"Live events featured above the fold, easily visible on top navigation."},
        {text:"Can find live events on home page, with indication of how many more are available."},
        {text:"Can easily sort and filter; applied filters clearly visible and easy to clear."},
        {text:"Shows the number of live events under each category."},
       ],
       frictions:[
        {text:"Live events is the last option and easily missed. We also don’t show this whole column for other sports besides football; when the user switches to another sport, football is still prioritised on the homepage’s live section.",severity:"MEDIUM"},
        {text:"Live event count mismatches within the same session (Home “Live 7” pill vs. “Live 15” section header).",severity:"LOW"},
        {text:"Type chips (Outrights/Upcoming/Live) and competition chips (UEFA CL/EL) share one scrollable row with no visual grouping — unclear where one category ends and the next begins.",severity:"NIT"},
        {text:"Individual live rows mix sports (football, tennis) with no sport icon, only a text label — recall over recognition.",severity:"LOW"},
        {text:"Floating “Back to top” pill overlaps live list content at the bottom of the scroll.",severity:"LOW"},
        {text:"User expects to see the 15 more live games, but the default list comes short since other games sit under other categories — misleading.",severity:"MEDIUM"},
        {text:"It’s not clear how to search for a specific game from this list; the search icon up top is easy to miss, and search results navigate the user away from the page.",severity:"MEDIUM"},
        {text:"Nothing distinguishes “actively updating” from “frozen” — just silent time jumps.",severity:"LOW"},
        {text:"No visible default sort logic on the default live page.",severity:"NIT"},
        {text:"Some events don’t show market selections on the match card.",severity:"CRITICAL"},
        {text:"The 1UP & 2UP fixed section reduces the view area — the user ends up seeing only two match cards per view.",severity:"LOW"},
       ]},
      {flow:'Selecting an event & market',
       strengths:[
        {text:"Markets have explainers that show on demand."},
        {text:"User can search for a market without exiting the page."},
       ],
       frictions:[
        {text:"Tooltip text is cut off and auto-closes on scroll.",severity:"LOW"},
        {text:"Search returns different results depending on which tab you’re in, with no indication of why or which tab is being searched — a hidden boundary.",severity:"CRITICAL"},
        {text:"Search empty state has no way to broaden the search (e.g. “search all markets”) — a dead end.",severity:"HIGH"},
        {text:"Exiting search navigates the user back to the “All” tab even when a different tab was active.",severity:"CRITICAL"},
        {text:"Navigating back to the live events list doesn’t update the list right away.",severity:"CRITICAL"},
       ]},
      {flow:'Halftime & market suspension states',
       strengths:[
        {text:"Half-time indicators are present."},
        {text:"Clear ‘why’ and next action for the user."},
       ],
       frictions:[
        {text:"Live indicator reverts to the scheduled kickoff time instead of a HT badge while the event is still ongoing — miscommunication between the 3rd-party stats game time and betPawa.",severity:"CRITICAL"},
        {text:"Markets disappear and reappear with no genuine loading state (skeleton) to show whether the page loaded.",severity:"CRITICAL"},
        {text:"At times the live page shows the second half has started but the details page doesn’t update for ~20 seconds.",severity:"LOW"},
       ]},
      {flow:'Placing a betslip',
       strengths:[
        {text:"Odds-change direction is shown clearly."},
        {text:"“Accept odds change” toggle correctly gates behaviour."},
        {text:"Clear indication of locked and unavailable selections."},
       ],
       frictions:[
        {text:"No actual time & score for live events — hard to tell if the score changed since your last selection.",severity:"NIT"},
        {text:"“Accept odds change” is auto-toggled off when odds change.",severity:"CRITICAL"},
        {text:"The “Odds changed” banner doesn’t get dismissed.",severity:"LOW"},
        {text:"“Locked” and “Unavailable” are two different badges with no explanation of what distinguishes them (temporarily suspended vs. permanently gone?).",severity:"MEDIUM"},
        {text:"Error banner says “Click ‘Place bet without N/A’” but the actual button reads “PLACE BET WITHOUT LOCKED”.",severity:"CRITICAL"},
        {text:"Selection order re-shuffles between states (a team moves bottom → top → bottom) with no user action.",severity:"CRITICAL"},
       ]},
      {flow:'Follow-up in betslip',
       strengths:[
        {text:"Live legs show the live badge, half and time."},
       ],
       frictions:[
        {text:"Distinct visuals for live stats create more inconsistency.",severity:"MEDIUM"},
        {text:"There are cases where the ‘minimize stats’ action within the widget doesn’t show up.",severity:"CRITICAL"},
        {text:"Opening the inline stats panel pushes the remaining legs a full scroll below, and the viewpoint is off — the maximize/minimize interaction is frustrating.",severity:"HIGH"},
        {text:"Two different disclaimer strings cover the same thing.",severity:"LOW"},
       ]},
      {flow:'Other',
       strengths:[],
       frictions:[
        {text:"Clicking on events navigates the user back to Upcoming.",severity:"CRITICAL"},
        {text:"Sometimes we show full stats, sometimes we don’t.",severity:"MEDIUM"},
        {text:"Inconsistent opening behaviour of live stats (expand vs. bottom-sheet).",severity:"MEDIUM"},
       ]},
    ],
  },
  {
    name: 'My Bets & Cashout', reviewer: 'Ajay', tag: 'severity',
    flows: [
      {flow:'Open Bets',
       strengths:[
        {text:"Categorized tabs provide structured navigation across primary wagering categories."},
        {text:"Detailed headers and item counts streamline content consumption without cognitive overload."},
        {text:"Granular status labels clearly communicate real-time progress for individual selections inside multi-leg wagers."},
        {text:"Active tab highlighting offers strong feedback vs. competitors (contrasting badge colours would optimise it further)."},
        {text:"A functional return-to-top control enables rapid upward navigation without obscuring card elements."},
        {text:"Essential wagering details remain clearly grouped within the primary visual focus area."},
        {text:"The share trigger occupies a high-visibility position that reinforces social features."},
        {text:"Bet cards display full context: sport type, tournament name, and league details."},
       ],
       frictions:[
        {text:"Header tabs stay fixed but trigger navigation to unrelated screens outside the My Bets section — unexpected flows and navigational confusion.",severity:"CRITICAL"},
        {text:"Secondary navigation tabs don’t stay pinned during vertical scrolling, forcing users to scroll back up to switch views.",severity:"HIGH"},
        {text:"Bet ID values are static text with no copy functionality — reduced utility for support or reference.",severity:"MEDIUM"},
        {text:"Date attributes are correct, but a more structured visual layout (à la BetKing) would improve hierarchy and legibility.",severity:"HIGH"},
        {text:"Grey informational boxes occupy disproportionate screen space — an opportunity for more compact UI.",severity:"HIGH"},
        {text:"Bet cards lack selection details despite available space — preview components or expandable accordions would add instant clarity.",severity:"HIGH"},
        {text:"The Re-use button sits above match listings, creating ambiguity about targeted selections — move it below the specific games.",severity:"HIGH"},
        {text:"No explicit tap-to-copy for unique wagering identifiers.",severity:"HIGH"},
        {text:"Status badges show game state but cards lack rich live visualisations, field movement, and clear event identifiers.",severity:"HIGH"},
        {text:"Users can’t tap through to primary event pages from within bet cards — breaks expected exploration paths.",severity:"CRITICAL"},
        {text:"Leg selection lists blend into general bet info — distinct container boundaries would aid visual parsing.",severity:"MEDIUM"},
       ]},
      {flow:'Cashout',
       strengths:[
        {text:"The Cashout section sits in a logical position within the screen hierarchy."},
        {text:"The action happens directly on the page with fast response times."},
        {text:"The status label is placed in a correct and visually prominent location."},
       ],
       frictions:[
        {text:"Cashout information is completely absent despite the corresponding badge in the UI.",severity:"CRITICAL"},
        {text:"Show the Cashout amount upfront (like competitors); wide spacing between header and Request button creates uncertainty about the outcome.",severity:"MEDIUM"},
        {text:"Advanced Cashout functionality available on competitor platforms is entirely missing.",severity:"MEDIUM"},
        {text:"The status label after Cashout lacks clarity, and the header doesn’t use past tense to signal completion.",severity:"HIGH"},
        {text:"Feedback after Cashout relies solely on the top label — no supporting toast or confirmation popup.",severity:"CRITICAL"},
       ]},
      {flow:'Settled Bets',
       strengths:[
        {text:"Differentiation looks well executed across the layout."},
        {text:"The internal card design is strong and distinguishes itself from a regular win (needs clearer explanations and UI refinement)."},
        {text:"The Share button has an impressive visual design that draws appropriate attention."},
       ],
       frictions:[
        {text:"This banner permanently occupies too much space while limiting sorting — a dedicated filter button with deep customisation would be better.",severity:"HIGH"},
        {text:"All negative aspects from the Open Bets card persist here; Settled cards should be more clearly distinct from Open bets.",severity:"MEDIUM"},
        {text:"Essential sharing functionality is completely absent directly on the card.",severity:"HIGH"},
        {text:"The reason for celebrating this win with confetti and a trophy is unclear, and the iconography looks cluttered/unrecognisable without zooming in.",severity:"MEDIUM"},
        {text:"A dropdown pattern for Open bet details plus full-page navigation for Settled bets would maximise usability.",severity:"HIGH"},
        {text:"The card doesn’t clearly communicate whether a game is won or lost — requires deep analysis vs. immediate visual cues used by competitors.",severity:"CRITICAL"},
        {text:"Sharing is heavily constrained and falls behind competitors — needs significant expansion and customisation.",severity:"CRITICAL"},
       ]},
    ],
  },
  {
    name: 'Help & Support', reviewer: 'Ishkhan & Aleida', tag: 'none',
    flows: [
      {flow:'Help Page', strengths:[], frictions:[
        {text:"Play up the block titles and add illustrations to visually help users."},
        {text:"Adding screenshots or videos would make it more convenient for the user."},
        {text:"A search would make it easier for users to find the information they need."},
      ]},
      {flow:'Rules', strengths:[], frictions:[
        {text:"Play up the block titles and add illustrations to visually help users."},
        {text:"A search would make it easier for users to find the information they need."},
        {text:"Add navigation within this page — by sport types and so on."},
      ]},
    ],
  },
  {
    name: 'Casino & Virtuals & Other Products', reviewer: 'Ishkhan', tag: 'none',
    flows: [
      {flow:'Casino page', strengths:[], frictions:[
        {text:"Too many filter tabs at the top — the user scrolls a long horizontal row just to find the category they want."},
        {text:"Games have no Demo option or info/description button — no way to preview a game or learn how it works before committing real money."},
        {text:"The “Home” tab inside Casino should be renamed to “Recommended”, so users don’t think tapping it leaves Casino for the site homepage."},
        {text:"A large number of games are hidden behind scrolling — the user might not notice them."},
        {text:"The confirmation modal for removing from favourites is unnecessary — the action is minor and instantly reversible."},
        {text:"The sorting may confuse users — there’s “Popular” in sorting and also one at the top."},
        {text:"With many recent searches, we stop suggesting games — we could limit the number or hide the older ones."},
        {text:"Users may be more used to seeing the navigation at the top."},
        {text:"Show the number of players / likes / total plays to build interest."},
        {text:"When the user closes a casino game the app closes immediately, with no attempt to retain them (e.g. suggesting other games)."},
        {text:"Banners between game category blocks look low quality — like static screenshots with a fake baked-in CTA button; the whole banner is the click target, making the button misleading."},
        {text:"There’s no block with recent wins in casino games."},
        {text:"There’s no action to delete all recent searches at once."},
      ]},
      {flow:'Virtuals', strengths:[], frictions:[
        {text:"The illustrations don’t catch the eye."},
        {text:"Multiple entries essentially lead to the same Virtuals game and take up a lot of space."},
        {text:"There aren’t many objects here — the layout could show everything to the user at once."},
        {text:"Not much interactivity — no promotions, banners, etc. to engage the user."},
        {text:"Show some big recent wins to draw the user in."},
        {text:"A timer on the virtual thumbnail could show when the next match starts."},
        {text:"Show the league selection at the top."},
        {text:"It’s unclear where the Next button leads."},
        {text:"Show more clearly that the match is live — maybe with an animation or illustration."},
        {text:"The active betslip isn’t very noticeable."},
        {text:"Consider a dedicated betslip on the Virtuals page to remove noise and focus the user on the action."},
      ]},
    ],
  },
  {
    name: 'Homepage & Sports Discovery', reviewer: '—', tag: 'severity',
    flows: [
      {flow:"Homepage · Landing & orientation",
       strengths:[
        {text:"Clear top-to-bottom hierarchy — balance & nav, then promos, then combos, then match lists.",law:"Serial Position Effect"},
        {text:"Balance and a one-tap Deposit ‘+’ sit top-right on landing — funding is always one tap away.",law:"Fitts's Law"},
        {text:"The persistent ‘up to 1250% Win Bonus’ footer nudges accumulator building without blocking content.",law:"Goal-Gradient Effect"},
        {text:"Sticky bottom nav keeps Sports / Betslip / My bets / Account one tap away throughout the scroll.",law:"Jakob's Law"},
        {text:"A consistent green marks every actionable odd and CTA — a clear ‘tap here’ visual language.",law:"Von Restorff Effect"},
        {text:"Home leads with 'Popular Match Combos' — pre-built multi-selection bets accelerate the core action right on the homepage.",law:"Goal-Gradient Effect"},
       ],
       frictions:[
        {text:"Three promo cards plus the bonus banner push real match lists well below the fold.",severity:"HIGH",law:"Hick's Law · Cognitive Load"},
        {text:"Casino Cashback is the first promo card on a sports home — casino cross-sell ahead of sport.",severity:"MEDIUM",law:""},
        {text:"The three promo cards are visually near-identical (‘Read More’), so no single offer stands out.",severity:"LOW",law:"Law of Similarity"},
        {text:"Every visit starts by scrolling past promos.",severity:"MEDIUM",law:"Cognitive Load"},
       ]},
      {flow:"Homepage · Quick-bet",
       strengths:[
        {text:"One tap adds a full pre-built combo and the win-bonus updates instantly — very low friction.",law:"Doherty Threshold"},
        {text:"Combos surface pre-built multi-leg bets right on the homepage — accelerates the core action.",law:"Goal-Gradient Effect"},
        {text:"Each combo lists its legs (Double Chance, Over 1.5, Multigoals) so bettors see exactly what they’re backing.",law:""},
        {text:"Combined odds are shown on every combo card — the payout is clear before adding to the slip.",law:"Von Restorff Effect"},
       ],
       frictions:[
        {text:"The betslip is only a thin summary bar — no obvious way to review or edit the legs.",severity:"HIGH",law:"Mental Model"},
        {text:"The win-bonus grows as legs stack, but the multiplier mechanic isn't explained inline — low trust.",severity:"MEDIUM",law:"Cognitive Load"},
        {text:"Combos are fixed bundles — there’s no way to drop or swap a leg before adding it.",severity:"LOW",law:"Tesler's Law"},
        {text:"The betslip bar shows odds and bonus but not the number of selections — unclear what’s in the slip.",severity:"MEDIUM",law:"Cognitive Load"},
       ]},
      {flow:"Homepage · Promotions discovery",
       strengths:[
        {text:"Each promo has a dedicated, well-explained page with a single clear CTA.",law:"Hick's Law"},
        {text:"Each promo page leads with one bold value prop and a single BET NOW CTA — no decision overload.",law:"Von Restorff Effect"},
        {text:"Each promo page includes a plain-language ‘What makes it different / How it works’ breakdown.",law:""},
        {text:"A single BET NOW / PLAY NOW CTA per page keeps the next step obvious.",law:"Hick's Law"},
       ],
       frictions:[
        {text:"Promo pages are separate destinations with no ‘back to bet’ shortcut — users can lose their place.",severity:"LOW",law:"Mental Model"},
        {text:"Casino cashback is promoted on the homepage home — cross-sell competes with sports intent.",severity:"MEDIUM",law:""},
        {text:"Promo pages are long marketing scrolls — the actual terms and limits sit well below the fold.",severity:"MEDIUM",law:"Cognitive Load"},
        {text:"Three overlapping bonuses (Win Bonus, Early Wins, Cashback) with no comparison — unclear which applies when.",severity:"LOW",law:"Choice Overload"},
       ]},
      {flow:"Sports Discovery · Browse & filter a sport",
       strengths:[
        {text:"Layered filters — Leagues + Markets + Date — with live event counts give precise control.",law:"Hick's Law"},
        {text:"Filter overlays show a live event count per league, so users pick populated markets.",law:"Von Restorff Effect"},
        {text:"Reset / Apply in the filter overlays gives a clear, reversible commit — no accidental filtering.",law:"Jakob's Law"},
        {text:"Popular Leagues are surfaced first with live counts — a fast path to the biggest markets.",law:"Serial Position Effect"},
        {text:"'Show 1UP & 2UP' toggle and hot-odds markers appear across every list — boosted markets are easy to spot.",law:"Von Restorff Effect"},
       ],
       frictions:[
        {text:"Filters open as separate overlays; there's no single view of all active filters at once.",severity:"MEDIUM",law:""},
        {text:"Applied filters aren't summarised on the results list — easy to forget what's active.",severity:"LOW",law:""},
        {text:"The market filter is a long radio list with no search — finding a specific market is slow.",severity:"MEDIUM",law:"Hick's Law"},
        {text:"Date sits in a separate dropdown from the day tabs — two ways to pick a day is confusing.",severity:"LOW",law:"Jakob's Law"},
       ]},
      {flow:"Sports Discovery · Live → in-play",
       strengths:[
        {text:"Rich in-play: a live match visualiser with continuously updating stats and markets.",law:"Flow"},
        {text:"Live minute and score sit on every in-play row — instant context before opening a match.",law:"Von Restorff Effect"},
        {text:"In-play odds and markets update live without a manual refresh — the slip stays current.",law:"Doherty Threshold"},
        {text:"Event sub-tabs (Match · Statistics · Head-to-head · Standings) keep all context in one place.",law:""},
       ],
       frictions:[
        {text:"Many live markets show as locked with no ETA — dead affordances mid-match.",severity:"HIGH",law:"Mental Model"},
        {text:"The in-play visualiser dominates the first screen, pushing the actual markets down.",severity:"MEDIUM",law:""},
        {text:"The ‘Show 1UP & 2UP’ toggle tops the live list with no hint of what 1UP / 2UP actually does.",severity:"MEDIUM",law:"Mental Model"},
        {text:"No way to filter out finished or one-market live events — the list carries dead rows.",severity:"LOW",law:""},
       ]},
      {flow:"Sports Discovery · Event deep-dive",
       strengths:[
        {text:"Built-in statistics (H2H, form, win probability) support the bet decision in-context.",law:"Cognitive Load"},
        {text:"Markets are grouped into scannable tabs (All/Popular/Goals/Halves) with counts.",law:""},
        {text:"Win-probability bar + previous meetings give quick form context before betting.",law:"Von Restorff Effect"},
        {text:"Market groups carry counts (Popular 18 · Goals 40 · Halves) so bettors gauge depth at a glance.",law:""},
       ],
       frictions:[
        {text:"Statistics fill the whole first screen; the actual markets sit far below the fold.",severity:"HIGH",law:""},
        {text:"Market-group tabs scroll horizontally and can hide options off-screen.",severity:"LOW",law:"Von Restorff Effect"},
        {text:"Every market row has an unlabeled info (i) icon — its purpose isn’t clear.",severity:"LOW",law:"Mental Model"},
        {text:"Stats sections expand / collapse via small carets — the extra data is easy to miss.",severity:"LOW",law:"Fitts's Law"},
       ]},
    ],
  },
];

const TODO = [
  {name:'PreMatch', reviewer:'—', note:'Not ready yet — will be added once complete.'},
];

// ---- clean: drop placeholders + dedupe within a flow ----
function clean(t){
  for(const f of t.flows){
    const dropPlace = s => s && s.text && s.text.trim() && !/^drop screen$/i.test(s.text.trim());
    f.strengths = (f.strengths||[]).filter(dropPlace);
    f.frictions = (f.frictions||[]).filter(dropPlace);
    const dedupe = arr => { const seen=new Set(); return arr.filter(x=>{const k=x.text.trim().toLowerCase(); if(seen.has(k))return false; seen.add(k); return true;}); };
    f.strengths = dedupe(f.strengths); f.frictions = dedupe(f.frictions);
  }
  return t;
}
topics.forEach(clean);

// ---- severity assignment for topics reviewed without severity chips (GN, Casino) ----
const SEV_ASSIGN = {
  'Global Navigation': [
    ['bottom bar represents only sports','HIGH'],['no active state','MEDIUM'],['entering sports/live','HIGH'],
    ['three overlapping nav','MEDIUM'],['reachable three ways','LOW'],['top-level entry','MEDIUM'],
    ['changes between logged-out','LOW'],['no labelled','MEDIUM'],['no single, obvious','MEDIUM'],['in-content home shortcut','LOW'],
  ],
  'Casino & Virtuals & Other Products': [
    ['too many filter tabs','MEDIUM'],['no demo option','MEDIUM'],['renamed to','LOW'],['hidden behind scrolling','LOW'],
    ['confirmation modal','NIT'],['sorting may confuse','LOW'],['stop suggesting','NIT'],['navigation at the top','NIT'],
    ['number of players','NIT'],['closes immediately','MEDIUM'],['low quality','HIGH'],['recent wins in casino','NIT'],
    ['delete all recent','LOW'],['catch the eye','NIT'],['same virtuals game','LOW'],['many objects here','LOW'],
    ['not much interactivity','LOW'],['big recent wins','NIT'],['timer on the virtual','LOW'],['league selection at the top','LOW'],
    ['next button leads','MEDIUM'],['match is live','LOW'],['active betslip','MEDIUM'],['dedicated betslip','LOW'],
  ],
};
for(const t of topics){ const map=SEV_ASSIGN[t.name]; if(!map) continue; for(const f of t.flows){ for(const x of f.frictions){ if(x.severity) continue; const l=x.text.toLowerCase(); for(const [k,v] of map){ if(l.includes(k)){ x.severity=v; break; } } } } }

// ---- counts ----
const SEV_ORDER = ['CRITICAL','HIGH','MEDIUM','LOW','NIT'];
function topicCounts(t){
  let s=0,f=0; const sev={CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0,NIT:0};
  for(const fl of t.flows){ s+=fl.strengths.length; f+=fl.frictions.length; for(const x of fl.frictions){ if(x.severity&&sev[x.severity]!==undefined) sev[x.severity]++; } }
  return {s,f,sev};
}
const totals = topics.reduce((a,t)=>{const c=topicCounts(t);a.s+=c.s;a.f+=c.f;SEV_ORDER.forEach(k=>a.sev[k]+=c.sev[k]);return a;},{s:0,f:0,sev:{CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0,NIT:0}});

// ---- tab display order (Summary is always first, PreMatch/TODO always last) ----
const ORDER=['Global Navigation','Homepage & Sports Discovery','Live Betting','My Bets & Cashout','Casino & Virtuals & Other Products','Help & Support'];
topics.sort((a,b)=>{const ia=ORDER.indexOf(a.name),ib=ORDER.indexOf(b.name);return (ia<0?99:ia)-(ib<0?99:ib);});

const FIGMA = {
  'Global Navigation':'https://www.figma.com/design/1H2KzGBaKHKuv9TirkutUM/Global-Navigation-%7C-UX-Review-%7C-Jim',
  'Live Betting':'https://www.figma.com/design/Tfv3EKofMYn6cRzjHR4VLu/Live-Betting-%7C-UX-Review-%7C-Henry',
  'My Bets & Cashout':'https://www.figma.com/design/o0JS6yvcoXhMiRcvzUjawC/My-Bets---Cashout-%7C-UX-Review-%7C-Ajay',
  'Help & Support':'https://www.figma.com/design/7RmAoEilfNK5YhK8yAPPNr/Help---Support-%7C-UX-Review-%7C-Ishkhan---Aleida',
  'Casino & Virtuals & Other Products':'https://www.figma.com/design/Hw0iiubXIIO7ASeTXm7hJI/Casino--Virtuals---Other-Products-%7C-UX-Review-%7C-Ishkhan',
  'Homepage & Sports Discovery':'https://www.figma.com/design/1MQKMFzFTMfBHqu29n5KEY/Homepage---Sports-Discovery-%7C-UX-Review--Copy-',
};
TODO.forEach(t=>{ if(FIGMA[t.name]) t.figma=FIGMA[t.name]; });
const payload = { snapshot: SNAPSHOT, topics: topics.map(t=>({...t, figma:FIGMA[t.name]||null, counts:topicCounts(t)})), todo: TODO, totals };
fs.writeFileSync(new URL('./data.json', import.meta.url), JSON.stringify(payload,null,2));

// ---- HTML ----
const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>betPawa · UX Review Week — Findings</title>
<style>
:root{--bg:#0d0f14;--panel:#141821;--panel2:#1a1f2b;--line:#242b39;--ink:#eef1f6;--mut:#95a0b3;--green:#12a150;--green2:#1ec46a;--red:#e2483d;--crit:#e23744;--high:#f0663b;--med:#e0a020;--low:#3e7bfa;--nit:#8892a0;--law:#9a63d6;--radius:14px;}
:root[data-theme="light"]{--bg:#f5f7fb;--panel:#ffffff;--panel2:#eceff5;--line:#e0e5ee;--ink:#18202c;--mut:#5f6b7e;--green2:#12a150;}
:root[data-theme="light"] header.top{background:linear-gradient(180deg,#ffffff,#f5f7fb)}
:root[data-theme="light"] .tab .c{background:#eef1f6}
:root[data-theme="light"] .card{box-shadow:0 1px 3px rgba(20,30,50,.06)}
:root[data-theme="light"] .law{color:#6a3fb0;background:rgba(124,79,192,.10);border-color:rgba(124,79,192,.30)}
:root[data-theme="light"] .tab.active{color:var(--ink);background:rgba(18,161,80,.16)}
:root[data-theme="light"] .sevf .chip.active{color:var(--ink)}
.themebtn{margin-left:auto;background:var(--panel);border:1px solid var(--line);color:var(--ink);border-radius:999px;width:36px;height:36px;cursor:pointer;font-size:15px;line-height:1;flex:0 0 auto}
*{box-sizing:border-box}
html{transition:background .2s,color .2s}
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;line-height:1.5}
a{color:inherit}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
header.top{border-bottom:1px solid var(--line);background:linear-gradient(180deg,#10141c,#0d0f14);position:sticky;top:0;z-index:20;backdrop-filter:blur(6px)}
.brand{display:flex;align-items:center;gap:12px;padding:18px 0 6px}
.logo{font-weight:800;font-size:20px;letter-spacing:-.3px}.logo b{color:var(--green2)}
.sub{color:var(--mut);font-size:13px;padding-bottom:14px}
.stats{display:flex;gap:8px;flex-wrap:wrap;padding-bottom:14px}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-size:12px;color:var(--mut)}
.stat b{color:var(--ink)}
.tabs{display:flex;gap:8px;overflow-x:auto;padding:12px 0;scrollbar-width:thin}
.tab{white-space:nowrap;border:1px solid var(--line);background:var(--panel);color:var(--mut);padding:8px 14px;border-radius:999px;font-size:13px;cursor:pointer;font-weight:600;display:flex;gap:8px;align-items:center}
.tab .c{font-size:11px;color:var(--mut);background:#0d0f14;border:1px solid var(--line);border-radius:999px;padding:1px 7px}
.tab.active{border-color:var(--green);color:#fff;background:rgba(18,161,80,.14)}
.tab.todo{opacity:.5;cursor:not-allowed}
main{padding:22px 0 80px}
.topichead{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:4px 0 4px}
.topichead h1{font-size:22px;margin:0;letter-spacing:-.3px}
.by{color:var(--mut);font-size:13px}
.figlink{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;text-decoration:none;color:var(--ink);border:1px solid var(--line);background:var(--panel);border-radius:999px;padding:5px 12px}
.figlink:hover{border-color:var(--green)}
.figlink .fi{width:11px;height:11px;border-radius:3px;background:var(--green2);display:inline-block}
.mini{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 18px}
.pill{font-size:11px;font-weight:700;border-radius:999px;padding:3px 10px;border:1px solid var(--line);color:var(--mut)}
.pill.g{color:var(--green2);border-color:rgba(30,196,106,.4);background:rgba(18,161,80,.10)}
.pill.r{color:#ff7d73;border-color:rgba(226,72,61,.4);background:rgba(226,72,61,.10)}
.sevf{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 18px}
.sevf .chip{cursor:pointer;font-size:11px;font-weight:700;border-radius:999px;padding:4px 11px;border:1px solid var(--line);color:var(--mut);background:var(--panel)}
.sevf .chip.active{color:#fff;border-color:var(--ink)}
.flow{margin:0 0 26px}
.flow h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:var(--mut);margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:760px){.cols{grid-template-columns:1fr}.tab{scroll-snap-align:start}}
.col h3{font-size:12px;font-weight:700;letter-spacing:.5px;margin:0 0 10px;display:flex;align-items:center;gap:8px}
.col h3 .dot{width:9px;height:9px;border-radius:50%}
.col.good h3 .dot{background:var(--green2)} .col.bad h3 .dot{background:var(--red)}
.card{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 10px;background:var(--panel);font-size:13.5px}
.card.good{border-left:3px solid var(--green)} .card.bad{border-left:3px solid var(--red)}
.card .meta{margin-top:8px;display:flex;gap:8px;flex-wrap:wrap}
.sev{font-size:10.5px;font-weight:800;letter-spacing:.5px;border-radius:6px;padding:2px 8px;color:#0d0f14}
.sev.CRITICAL{background:var(--crit);color:#fff} .sev.HIGH{background:var(--high);color:#fff} .sev.MEDIUM{background:var(--med)} .sev.LOW{background:var(--low);color:#fff} .sev.NIT{background:var(--nit);color:#fff}
.law{font-size:11px;font-weight:700;border-radius:6px;padding:2px 8px;color:#cbb3ec;background:rgba(154,99,214,.14);border:1px solid rgba(154,99,214,.35)}
.empty{color:var(--mut);font-size:13px;font-style:italic;padding:6px 0}
.todo-note{color:var(--mut);font-size:14px;background:var(--panel);border:1px dashed var(--line);border-radius:12px;padding:20px}
.sumblock{margin:0 0 28px}
.sumblock h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:var(--mut);margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.sevbar{display:flex;height:16px;border-radius:8px;overflow:hidden;background:var(--panel);border:1px solid var(--line)}
.sevbar .seg{height:100%}
.seg.CRITICAL{background:var(--crit)} .seg.HIGH{background:var(--high)} .seg.MEDIUM{background:var(--med)} .seg.LOW{background:var(--low)} .seg.NIT{background:var(--nit)}
.ldot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:2px;vertical-align:middle}
.ldot.CRITICAL{background:var(--crit)} .ldot.HIGH{background:var(--high)} .ldot.MEDIUM{background:var(--med)} .ldot.LOW{background:var(--low)} .ldot.NIT{background:var(--nit)}
.tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media(max-width:820px){.tgrid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.tgrid{grid-template-columns:1fr}}
.tcard{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:14px;cursor:pointer;transition:border-color .15s,transform .15s}
.tcard:hover{border-color:var(--green);transform:translateY(-2px)}
.tcard.todo{opacity:.55;cursor:default} .tcard.todo:hover{border-color:var(--line);transform:none}
.tc-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:10px}
.tc-h b{font-size:14.5px;letter-spacing:-.2px}
.tc-n{display:flex;gap:6px;margin-bottom:10px}
.tc-sev{display:flex;gap:5px;flex-wrap:wrap}
.tc-fig{margin-top:12px;padding:4px 10px !important;font-size:11px !important}
.flowimg-wrap{margin:0 0 16px;position:relative}
.flowimg{width:100%;display:block;border:1px solid var(--line);border-radius:12px;background:var(--panel);cursor:zoom-in}
.flowimg-cap{font-size:11px;color:var(--mut);margin:0 0 16px}
.shots{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 12px;scrollbar-width:thin}
.shot{flex:0 0 168px;margin:0}
.shotimg{width:168px;display:block;border:1px solid var(--line);border-radius:10px;background:var(--panel);cursor:zoom-in;transition:border-color .15s}
.shotimg:hover{border-color:var(--green)}
.shotcap{font-size:11px;color:var(--mut);margin-top:6px;text-align:center}
.fnum{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;font-size:11px;font-weight:800;margin-right:8px;flex:0 0 auto;vertical-align:middle}
.fnum.g{background:var(--green);color:#fff} .fnum.r{background:var(--red);color:#fff}
.card.hasnum{display:flex;align-items:flex-start;gap:0}
.card .fbody{flex:1;min-width:0}
.lb{position:fixed;inset:0;background:rgba(3,6,12,.92);z-index:100;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:100%;max-height:92vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.lb .hint{position:fixed;top:16px;right:20px;color:#cbd3e0;font-size:12px}
.crmeta{margin-bottom:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.crtopic{font-size:11.5px;color:var(--mut);font-weight:600}
footer{color:var(--mut);font-size:12px;border-top:1px solid var(--line);padding:18px 0;text-align:center}
</style></head>
<body>
<header class="top"><div class="wrap">
  <div class="brand"><div class="logo">bet<b>Pawa</b> · UX Review Week</div><button id="themeBtn" class="themebtn" onclick="_toggleTheme()" title="Toggle light/dark">☀️</button></div>
  <div class="sub">A single view of the UX Findings per topic — a snapshot from each reviewer's Figma "UX Findings" page.</div>
  <div class="stats" id="stats"></div>
  <div class="tabs" id="tabs"></div>
</div></header>
<main class="wrap" id="main"></main>
<footer class="wrap">Static snapshot · <span id="snap"></span> · Source: the reviewers' Figma "UX Findings" pages</footer>
<div class="lb" id="lb" onclick="this.classList.remove('open')"><div class="hint">click anywhere to close</div><img id="lbimg" alt=""></div>
<script id="data" type="application/json">__DATA__</script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
let current = 'summary', sevFilter = 'ALL', critFilter = 'ALL';
const SEV=['CRITICAL','HIGH','MEDIUM','LOW','NIT'];
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
window._lb=function(src){const lb=document.getElementById('lb');document.getElementById('lbimg').src=src;lb.classList.add('open');};
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('lb').classList.remove('open');});

// ---- theme: light by day, dark by night; manual toggle persists ----
(function(){const KEY='uxhub-theme';const saved=localStorage.getItem(KEY);const h=new Date().getHours();const theme=saved||((h>=7&&h<19)?'light':'dark');document.documentElement.dataset.theme=theme;})();
function paintThemeBtn(){const b=document.getElementById('themeBtn');if(b)b.textContent=document.documentElement.dataset.theme==='light'?'🌙':'☀️';}
window._toggleTheme=function(){const cur=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=cur;localStorage.setItem('uxhub-theme',cur);paintThemeBtn();};

function renderStats(){
  const s=document.getElementById('stats');
  const t=DATA.totals;
  s.innerHTML='';
  s.append(el('span','stat','<b>'+DATA.topics.length+'</b> topics ready'));
  s.append(el('span','stat','<b>'+t.s+'</b> strengths'));
  s.append(el('span','stat','<b>'+t.f+'</b> friction points'));
  s.append(el('span','stat','<b style="color:var(--crit)">'+t.sev.CRITICAL+'</b> critical'));
  s.append(el('span','stat','<b style="color:var(--high)">'+t.sev.HIGH+'</b> high'));
  document.getElementById('snap').textContent=DATA.snapshot;
}
function renderTabs(){
  const tabs=document.getElementById('tabs'); tabs.innerHTML='';
  const sum=el('div','tab'+(current==='summary'?' active':''),'★ Summary');
  sum.onclick=()=>{current='summary';render();window.scrollTo(0,0);};
  tabs.append(sum);
  DATA.topics.forEach((t,i)=>{
    const b=el('div','tab'+(i===current?' active':''),esc(t.name)+' <span class="c">'+(t.counts.s+t.counts.f)+'</span>');
    b.onclick=()=>{current=i;sevFilter='ALL';render();window.scrollTo(0,0);};
    tabs.append(b);
  });
  DATA.todo.forEach(t=>{ tabs.append(el('div','tab todo',esc(t.name)+' <span class="c">TODO</span>')); });
}
function figLink(url){ return url?'<a class="figlink" href="'+url+'" target="_blank" rel="noopener"><span class="fi"></span>Open in Figma</a>':''; }
function renderSummary(){
  const m=document.getElementById('main'); m.innerHTML='';
  const t=DATA.totals;
  m.append(el('div','topichead','<h1>Summary</h1><span class="by">all topics at a glance · snapshot '+esc(DATA.snapshot)+'</span>'));
  // severity distribution bar
  const tot=SEV.reduce((a,k)=>a+t.sev[k],0)||1;
  let bar='<div class="sevbar">';
  SEV.forEach(k=>{ if(t.sev[k]) bar+='<span class="seg '+k+'" style="width:'+(t.sev[k]/tot*100).toFixed(1)+'%" title="'+k+' '+t.sev[k]+'"></span>'; });
  bar+='</div>';
  const legend='<div class="mini" style="margin-top:12px">'+SEV.map(k=>'<span class="pill"><span class="ldot '+k+'"></span>'+k+' '+t.sev[k]+'</span>').join('')+'</div>';
  const sb=el('div','sumblock','<h2>Friction by severity — '+t.f+' total ('+t.s+' strengths)</h2>'+bar+legend);
  m.append(sb);
  // per-topic cards
  const grid=el('div','tgrid');
  function addFig(card,url){ if(!url)return; const fl=el('a','figlink tc-fig','<span class="fi"></span>Open in Figma'); fl.href=url; fl.target='_blank'; fl.rel='noopener'; fl.onclick=(e)=>e.stopPropagation(); card.append(fl); }
  DATA.topics.forEach((tp,i)=>{
    const c=tp.counts;
    const sev=SEV.filter(k=>c.sev[k]).map(k=>'<span class="sev '+k+'">'+k+' '+c.sev[k]+'</span>').join(' ');
    const card=el('div','tcard','<div class="tc-h"><b>'+esc(tp.name)+'</b><span class="by">'+esc(tp.reviewer)+'</span></div>'+
      '<div class="tc-n"><span class="pill g">'+c.s+' strengths</span><span class="pill r">'+c.f+' friction</span></div>'+
      '<div class="tc-sev">'+(sev||'<span class="by" style="font-size:12px">— no severity —</span>')+'</div>');
    card.onclick=()=>{current=i;sevFilter='ALL';render();window.scrollTo(0,0);};
    addFig(card,tp.figma);
    grid.append(card);
  });
  DATA.todo.forEach(td=>{ const card=el('div','tcard todo','<div class="tc-h"><b>'+esc(td.name)+'</b><span class="by">TODO</span></div><div class="by" style="font-size:12px">'+esc(td.note)+'</div>'); addFig(card,td.figma); grid.append(card); });
  const gw=el('div','sumblock'); gw.append(el('h2',null,'Topics')); gw.append(grid); m.append(gw);
  // top critical across all topics
  const prio=[];
  DATA.topics.forEach(tp=>tp.flows.forEach(f=>f.frictions.forEach(x=>{ if(x.severity==='CRITICAL'||x.severity==='HIGH') prio.push({topic:tp.name,flow:f.flow,text:x.text,severity:x.severity}); })));
  prio.sort((a,b)=>(a.severity==='CRITICAL'?0:1)-(b.severity==='CRITICAL'?0:1));
  if(prio.length){
    const cb=el('div','sumblock'); cb.append(el('h2',null,'Top priority — Critical & High ('+prio.length+')'));
    const withPrio=[...new Set(prio.map(c=>c.topic))].sort((a,b)=>prio.filter(c=>c.topic===b).length-prio.filter(c=>c.topic===a).length);
    const ct=el('div','sevf');
    const list=el('div');
    function chipEl(label,key,count){const c=el('span','chip'+(critFilter===key?' active':''),label+' <b style="opacity:.6">'+count+'</b>');c.dataset.key=key;c.onclick=()=>{critFilter=key;[...ct.children].forEach(ch=>ch.classList.toggle('active',ch.dataset.key===key));paint();};return c;}
    function paint(){ list.innerHTML=''; const shown=critFilter==='ALL'?prio:prio.filter(c=>c.topic===critFilter); shown.forEach(c=>list.append(el('div','card bad','<div class="crmeta"><span class="sev '+c.severity+'">'+c.severity+'</span><span class="crtopic">'+esc(c.topic)+' · '+esc(c.flow)+'</span></div>'+esc(c.text)))); }
    ct.append(chipEl('All','ALL',prio.length));
    withPrio.forEach(tn=>ct.append(chipEl(tn,tn,prio.filter(c=>c.topic===tn).length)));
    cb.append(ct); cb.append(list); paint();
    m.append(cb);
  }
}
function renderTopic(){
  const m=document.getElementById('main'); m.innerHTML='';
  const t=DATA.topics[current];
  const hasSev=t.flows.some(f=>f.frictions.some(x=>x.severity));
  const head=el('div','topichead','<h1>'+esc(t.name)+'</h1><span class="by">reviewer · '+esc(t.reviewer)+'</span>'+figLink(t.figma));
  m.append(head);
  const mini=el('div','mini');
  mini.append(el('span','pill g',t.counts.s+' strengths'));
  mini.append(el('span','pill r',t.counts.f+' friction'));
  SEV.forEach(k=>{ if(t.counts.sev[k]) mini.append(el('span','pill',k+' '+t.counts.sev[k])); });
  m.append(mini);
  if(hasSev){
    const sf=el('div','sevf');
    ['ALL',...SEV].forEach(k=>{const c=el('span','chip'+(sevFilter===k?' active':''),k);c.onclick=()=>{sevFilter=k;render();};sf.append(c);});
    m.append(sf);
  }
  t.flows.forEach(f=>{
    const frShown = hasSev && sevFilter!=='ALL' ? f.frictions.filter(x=>x.severity===sevFilter) : f.frictions;
    if(t.flows.length>1 && f.strengths.length===0 && frShown.length===0) return;
    const showNum = !!(f.images && f.images.length) || !!f.image;
    const flow=el('div','flow'); flow.append(el('h2',null,esc(f.flow)));
    if(f.images && f.images.length){
      flow.append(el('div','flowimg-cap','Annotated screens — the numbered badges map to the findings below. Click any to zoom.'));
      const w=el('div','shots');
      f.images.forEach(im=>{const fig=el('figure','shot');const img=el('img','shotimg');img.src=im.src;img.alt=esc(im.label||'');img.loading='lazy';img.onclick=()=>_lb(im.src);fig.append(img);if(im.label)fig.append(el('figcaption','shotcap',esc(im.label)));w.append(fig);});
      flow.append(w);
    } else if(f.image){
      const w=el('div','flowimg-wrap');
      const img=el('img','flowimg'); img.src=f.image; img.alt=esc(f.flow); img.loading='lazy'; img.onclick=()=>_lb(f.image);
      w.append(img); w.append(el('div','flowimg-cap','Annotated screens — click to zoom.'));
      flow.append(w);
    }
    const cols=el('div','cols');
    const good=el('div','col good'); good.append(el('h3',null,'<span class="dot"></span>Works well'));
    if(f.strengths.length===0) good.append(el('div','empty','—'));
    f.strengths.forEach((s,i)=>{
      const inner=esc(s.text)+(s.law?'<div class="meta"><span class="law">'+esc(s.law)+'</span></div>':'');
      good.append(el('div','card good'+(showNum?' hasnum':''), showNum?'<span class="fnum g">'+(i+1)+'</span><div class="fbody">'+inner+'</div>':inner));
    });
    const bad=el('div','col bad'); bad.append(el('h3',null,'<span class="dot"></span>Friction / ideas'));
    if(frShown.length===0) bad.append(el('div','empty','—'));
    frShown.forEach(x=>{
      let meta='';
      if(x.severity) meta+='<span class="sev '+x.severity+'">'+x.severity+'</span>';
      if(x.law) meta+='<span class="law">'+esc(x.law)+'</span>';
      const inner=esc(x.text)+(meta?'<div class="meta">'+meta+'</div>':'');
      const n=f.frictions.indexOf(x)+1;
      bad.append(el('div','card bad'+(showNum?' hasnum':''), showNum?'<span class="fnum r">'+n+'</span><div class="fbody">'+inner+'</div>':inner));
    });
    cols.append(good,bad); flow.append(cols); m.append(flow);
  });
}
function render(){renderTabs(); if(current==='summary') renderSummary(); else renderTopic(); paintThemeBtn();}
renderStats();render();
</script>
</body></html>`;

fs.writeFileSync(new URL('./index.html', import.meta.url), html.replace('__DATA__', JSON.stringify(payload)));
console.log('Built index.html + data.json  ·  topics:', topics.length, '· strengths:', totals.s, '· friction:', totals.f, '· critical:', totals.sev.CRITICAL);
