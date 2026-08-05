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
      numbered: true,
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
        {text:"Bottom bar represents only Sports — Casino is not in the bar.", law:"Jakob's Law", severity:"HIGH"},
        {text:"When visiting Live, you are not having quick access in the previous navigation links", law:"Von Restorff Effect", severity:"MEDIUM"},
        {text:"Entering Sports/Live replaces the product switcher with the sports sub-nav — you can’t reach Casino/Virtuals from within Sports without the Menu.", law:"Mental Model", severity:"HIGH"},
        {text:"Three overlapping nav surfaces (header + bottom bar + full-screen Menu) duplicate the same destinations.", law:"Occam's Razor", severity:"MEDIUM"},
        {text:"Help / Support has no top-level entry — it lives only inside the Account drawer.", law:"Jakob's Law", severity:"MEDIUM"},
        {text:"The bottom bar changes between logged-out and logged-in (Join Now ↔ My bets).", law:"Jakob's Law", severity:"LOW"},
        {text:"No labelled “Home” anywhere — the homepage (/) is reachable only via the logo and an unlabelled sub-nav icon; nothing in the header or bottom bar says Home. A dedicated Home in the bottom bar — in the natural thumb zone — would give one clear, predictable way back.", law:"Jakob's Law", severity:"MEDIUM"},
        {text:"The in-content home shortcut is inconsistent — the sub-nav home icon appears on Sports/Casino/Virtuals but is replaced by “Upcoming” on Live, and it’s an icon-only ~40px tap target.", law:"Fitts's Law", severity:"LOW"},
      ],
    }],
  },
  {
    name: 'Live Betting', reviewer: 'Henry', tag: 'severity',
    flows: [
      {flow:'Live event discovery',
       images:[{src:"img/live-betting/lb1-1.png",label:"01 · Landing"},{src:"img/live-betting/lb1-2.png",label:"01 · Landing"},{src:"img/live-betting/lb1-3.png",label:"02 · Live events"},{src:"img/live-betting/lb1-4.png",label:"02 · Live events"},{src:"img/live-betting/lb1-5.png",label:"02 · Live events"}],
       strengths:[
        {n:"1",text:"Live events featured above the fold, easily visible on top navigation."},
        {n:"5",text:"Can find live events on home page, with indication of how many more are available."},
        {n:"9",text:"Can easily sort and filter; applied filters clearly visible and easy to clear."},
        {n:"12",text:"Shows the number of live events under each category."},
       ],
       frictions:[
        {n:"2",text:"Live events is the last option and easily missed. We also don’t show this whole column for other sports besides football; when the user switches to another sport, football is still prioritised on the homepage’s live section.",severity:"MEDIUM"},
        {n:"3",text:"Live event count mismatches within the same session (Home “Live 7” pill vs. “Live 15” section header).",severity:"LOW"},
        {n:"4",text:"Type chips (Outrights/Upcoming/Live) and competition chips (UEFA CL/EL) share one scrollable row with no visual grouping — unclear where one category ends and the next begins.",severity:"NIT"},
        {n:"6",text:"Individual live rows mix sports (football, tennis) with no sport icon, only a text label — recall over recognition.",severity:"LOW"},
        {n:"7",text:"Floating “Back to top” pill overlaps live list content at the bottom of the scroll.",severity:"LOW"},
        {n:"8",text:"User expects to see the 15 more live games, but the default list comes short since other games sit under other categories — misleading.",severity:"MEDIUM"},
        {n:"10",text:"It’s not clear how to search for a specific game from this list; the search icon up top is easy to miss, and search results navigate the user away from the page.",severity:"MEDIUM"},
        {n:"11",text:"Nothing distinguishes “actively updating” from “frozen” — just silent time jumps.",severity:"LOW"},
        {n:"13",text:"No visible default sort logic on the default live page.",severity:"NIT"},
        {n:"14",text:"Some events don’t show market selections on the match card.",severity:"CRITICAL"},
        {n:"15",text:"The 1UP & 2UP fixed section reduces the view area — the user ends up seeing only two match cards per view.",severity:"LOW"},
       ]},
      {flow:'Selecting an event & market',
       images:[{src:"img/live-betting/lb2-1.png",label:"03 · Select an event"},{src:"img/live-betting/lb2-2.png",label:"04 · Find a market"},{src:"img/live-betting/lb2-3.png",label:"04 · Find a market"}],
       strengths:[
        {n:"1",text:"Markets have explainers that show on demand."},
        {n:"3",text:"User can search for a market without exiting the page."},
       ],
       frictions:[
        {n:"2",text:"Tooltip text is cut off and auto-closes on scroll.",severity:"LOW"},
        {n:"4",text:"Search returns different results depending on which tab you’re in, with no indication of why or which tab is being searched — a hidden boundary.",severity:"CRITICAL"},
        {n:"5",text:"Exiting search navigates the user back to the “All” tab even when a different tab was active.",severity:"CRITICAL"},
        {n:"6",text:"Navigating back to the live events list doesn’t update the list right away.",severity:"CRITICAL"},
        {n:"7",text:"Search empty state has no way to broaden the search (e.g. “search all markets”) — a dead end.",severity:"HIGH"},
       ]},
      {flow:'Halftime & market suspension states',
       images:[{src:"img/live-betting/lb3-1.png",label:"05 · Time & score indicators"},{src:"img/live-betting/lb3-2.png",label:"05 · 2nd half resuming"},{src:"img/live-betting/lb3-3.png",label:"05 · Open full stats"},{src:"img/live-betting/lb3-4.png",label:"06 · All markets suspended"}],
       strengths:[
        {n:"1",text:"Half-time indicators are present."},
        {n:"5",text:"Clear ‘why’ and next action for the user."},
       ],
       frictions:[
        {n:"2",text:"Live indicator reverts to the scheduled kickoff time instead of a HT badge while the event is still ongoing — miscommunication between the 3rd-party stats game time and betPawa.",severity:"CRITICAL"},
        {n:"3",text:"Markets disappear and reappear with no genuine loading state (skeleton) to show whether the page loaded.",severity:"CRITICAL"},
        {n:"4",text:"At times the live page shows the second half has started but the details page doesn’t update for ~20 seconds.",severity:"LOW"},
       ]},
      {flow:'Placing a betslip',
       images:[{src:"img/live-betting/lb4-1.png",label:"07 · Open betslip"},{src:"img/live-betting/lb4-2.png",label:"07 · Odds change"},{src:"img/live-betting/lb4-3.png",label:"08 · Unavailable markets"},{src:"img/live-betting/lb4-4.png",label:"08 · Unavailable markets"}],
       strengths:[
        {n:"2",text:"Odds-change direction is shown clearly."},
        {n:"4",text:"“Accept odds change” toggle correctly gates behaviour."},
        {n:"6",text:"Clear indication of locked and unavailable selections."},
       ],
       frictions:[
        {n:"1",text:"No actual time & score for live events — hard to tell if the score changed since your last selection.",severity:"NIT"},
        {n:"3",text:"“Accept odds change” is auto-toggled off when odds change.",severity:"CRITICAL"},
        {n:"5",text:"The “Odds changed” banner doesn’t get dismissed.",severity:"LOW"},
        {n:"7",text:"“Locked” and “Unavailable” are two different badges with no explanation of what distinguishes them (temporarily suspended vs. permanently gone?).",severity:"MEDIUM"},
        {n:"8",text:"Error banner says “Click ‘Place bet without N/A’” but the actual button reads “PLACE BET WITHOUT LOCKED”.",severity:"CRITICAL"},
        {n:"9",text:"Selection order re-shuffles between states (a team moves bottom → top → bottom) with no user action.",severity:"CRITICAL"},
       ]},
      {flow:'Follow-up in betslip',
       images:[{src:"img/live-betting/lb5-1.png",label:"09 · Placed bet"},{src:"img/live-betting/lb5-2.png",label:"09 · Placed bet"},{src:"img/live-betting/lb5-3.png",label:"09 · Placed bet"}],
       strengths:[
        {n:"1",text:"Live legs show the live badge, half and time."},
       ],
       frictions:[
        {n:"2",text:"Distinct visuals for live stats create more inconsistency.",severity:"MEDIUM"},
        {n:"3",text:"There are cases where the ‘minimize stats’ action within the widget doesn’t show up.",severity:"CRITICAL"},
        {n:"4",text:"Opening the inline stats panel pushes the remaining legs a full scroll below, and the viewpoint is off — the maximize/minimize interaction is frustrating.",severity:"HIGH"},
        {n:"5",text:"Two different disclaimer strings cover the same thing.",severity:"LOW"},
       ]},
      {flow:'Other',
       images:[{src:"img/live-betting/lb6-1.png",label:"Search results"},{src:"img/live-betting/lb6-2.png",label:"Events page"},{src:"img/live-betting/lb6-3.png",label:"Events page"},{src:"img/live-betting/lb6-4.png",label:"Events page"}],
       strengths:[],
       frictions:[
        {n:"1",text:"Clicking on events navigates the user back to Upcoming.",severity:"CRITICAL"},
        {n:"2",text:"Sometimes we show full stats, sometimes we don’t.",severity:"MEDIUM"},
        {n:"3",text:"Inconsistent opening behaviour of live stats (expand vs. bottom-sheet).",severity:"MEDIUM"},
       ]},
    ],
  },
  {
    name: 'My Bets & Cashout', reviewer: 'Ajay', tag: 'severity',
    flows: [
      {flow:'Open Bets',
       images:[{src:'img/my-bets-cashout/ob1.png',label:'01 · My Open Bets'},{src:'img/my-bets-cashout/ob2.png',label:'02 · Scroll'},{src:'img/my-bets-cashout/ob3.png',label:'03 · Open bet (single)'},{src:'img/my-bets-cashout/ob4.png',label:'04 · Open bet (multiple)'}],
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
       images:[{src:'img/my-bets-cashout/ca1.png',label:'01 · Empty state'},{src:'img/my-bets-cashout/ca2.png',label:'02 · Open bets'},{src:'img/my-bets-cashout/ca3.png',label:'03 · Card opportunities'},{src:'img/my-bets-cashout/ca4.png',label:'04 · Card full'}],
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
       images:[{src:'img/my-bets-cashout/se1.png',label:'01 · Settled bets'},{src:'img/my-bets-cashout/se2.png',label:'02 · Won bets'},{src:'img/my-bets-cashout/se3.png',label:'03 · Single bet'},{src:'img/my-bets-cashout/se4.png',label:'04 · Multiple bet'},{src:'img/my-bets-cashout/se5.png',label:'05 · Won bet inside'},{src:'img/my-bets-cashout/se6.png',label:'06 · Sharing popup'}],
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
    name: 'Help & Support', reviewer: 'Ishkhan & Aleida', tag: 'severity',
    flows: [
      {flow:'A1 · Account & Wallet',
       images:[{src:'img/help-support/a1-1.png',label:'01 · Account sheet'},{src:'img/help-support/a1-2.png',label:'02 · Deposit'},{src:'img/help-support/a1-3.png',label:'03 · Withdraw'}],
       strengths:[
        {text:"Deposit & Withdraw are pinned to the top of the Account sheet — the two money actions are one tap away.", law:"Fitts's Law"},
        {text:"The NGN/USDC currency toggle carries a plain-language note that switching only changes display, not funds.", law:"Mental Model"},
        {text:"Deposit methods use recognisable provider logos (OPay, PalmPay, MoMo) — recognition over recall.", law:"Jakob's Law"},
       ], frictions:[
        {text:"Seven deposit methods list only a “Max” — no fees, speed or a recommended option to guide the choice.", severity:"MEDIUM", law:"Hick's Law"},
        {text:"The withdraw amount field has no quick presets or a “withdraw all” option — users must type an exact figure within the Min / Max by hand.", severity:"LOW", law:"Fitts's Law"},
       ]},
      {flow:'A2 · Account management & security',
       images:[{src:'img/help-support/a2-1.png',label:'01 · Change password'},{src:'img/help-support/a2-2.png',label:'02 · Self-exclusion'},{src:'img/help-support/a2-3.png',label:'03 · Notifications'}],
       strengths:[
        {text:"Change-password screen states the consequence up front (“we’ll log you out of all devices”).", law:"Mental Model"},
        {text:"Each password field has an inline “Show” toggle — reduces entry errors.", law:"Jakob's Law"},
        {text:"Self-exclusion uses supportive, non-judgmental copy and links to specialist help — a hard moment handled with care.", law:"Peak-End Rule"},
       ], frictions:[
        {text:"Self-exclusion, change-password and notifications hide under a collapsed “Manage account” accordion — safety controls take extra taps.", severity:"MEDIUM", law:"Jakob's Law"},
        {text:"Notifications mix campaigns (casino cashback) with account-critical alerts (failed withdrawal) in one undifferentiated list.", severity:"MEDIUM", law:"Selective Attention"},
        {text:"Password minimum is just “4 characters” — a weak security floor for a real-money wallet.", severity:"HIGH", law:"Jakob's Law"},
       ]},
      {flow:'A3 · Activity & history',
       images:[{src:'img/help-support/a3-1.png',label:'01 · My Bets'},{src:'img/help-support/a3-2.png',label:'02 · Statement'}],
       strengths:[
        {text:"My Bets uses clear Open / Settled / Virtuals tabs — bet status is instantly scannable.", law:"Jakob's Law"},
        {text:"Each bet card surfaces Odds / Stake / Payout in a consistent mini-table — easy comparison across bets.", law:"Law of Proximity"},
        {text:"Statement shows a running balance after every transaction — users can reconcile at a glance.", law:"Mental Model"},
       ], frictions:[
        {text:"Statement rows are labelled only by type (“Sport Bet Placed”) with no event name — users can’t tell which bet a line refers to without expanding.", severity:"MEDIUM", law:"Cognitive Load"},
        {text:"My Bets and Statement live in two different places (bottom-nav vs Account menu) with overlapping content — no single “activity” home.", severity:"LOW", law:"Jakob's Law"},
        {text:"No date-range or type filter on the Statement — finding an old transaction means endless scrolling.", severity:"MEDIUM", law:"Hick's Law"},
       ]},
      {flow:'B1 · Help Center & contact',
       images:[{src:'img/help-support/b1-1.png',label:'01 · Help'},{src:'img/help-support/b1-2.png',label:'02 · Help links (footer)'}],
       strengths:[
        {text:"Help opens with the 7 most common questions in plain language (“How to reset your password”) — matches real intents.", law:"Jakob's Law"},
        {text:"A “Request a Call” form with the number pre-filled turns a support need into a single action.", law:"Fitts's Law"},
        {text:"Several contact routes (call-back, speak to an agent, Contact Us) are offered — users pick their channel.", law:"Postel's Law"},
       ], frictions:[
        {text:"The Help list has no search box — users must scan or scroll to find anything beyond the top 7 topics.", severity:"MEDIUM", law:"Hick's Law"},
        {text:"FAQ links and the “Request a Call” form share one screen with no grouping headers — self-serve vs. contact-us intents blur.", severity:"LOW", law:"Law of Proximity"},
        {text:"Help links are duplicated between the Account “Help Center” accordion and the page footer, with slightly different sets.", severity:"LOW", law:"Jakob's Law"},
       ]},
      {flow:'B2 · Rules & policies',
       images:[{src:'img/help-support/b2-1.png',label:'01 · Rules index'},{src:'img/help-support/b2-2.png',label:'02 · Rules detail'}],
       strengths:[
        {text:"Rules use a numbered, collapsible hierarchy (1 General, 2 Football…) — a huge document stays navigable.", law:"Chunking"},
        {text:"Sections are chunked by sport and bet type, so users can jump to the area that matters to them.", law:"Law of Proximity"},
       ], frictions:[
        {text:"Rules are a deep wall of nested links (3.25 … 3.47) with no search or in-page find — locating one market rule is slow.", severity:"HIGH", law:"Hick's Law"},
        {text:"No summaries, examples or visuals — dense legal-style prose raises the reading effort.", severity:"HIGH", law:"Cognitive Load"},
        {text:"Tiny body type and only a floating “Back to top” — no “back to section” anchor for a document this long.", severity:"LOW", law:"Fitts's Law"},
       ]},
      {flow:'B3 · Responsible Gambling',
       images:[{src:'img/help-support/b3-1.png',label:'01 · Responsible Gambling'},{src:'img/help-support/b3-2.png',label:'02 · Guidance detail'}],
       strengths:[
        {text:"Content leads with actionable tools (self-exclusion, monitor activity) and links straight to them — help is one tap away.", law:"Fitts's Law"},
        {text:"Warning signs and control tips are written in plain, supportive language — reduces stigma and reading effort.", law:"Peak-End Rule"},
        {text:"A request-a-call and a customer-support link sit on the page — distress moments route to a human quickly.", law:"Jakob's Law"},
       ], frictions:[
        {text:"The page is a long single scroll of prose; the tools (self-exclusion, limits) aren’t surfaced as tappable cards up top.", severity:"HIGH", law:"Selective Attention"},
        {text:"Deposit / spending limits are described but there is no visible control to set them here — advice without an in-context action.", severity:"HIGH", law:"Mental Model"},
       ]},
    ],
  },
  {
    name: 'Casino & Virtuals & Other Products', reviewer: 'Ishkhan', tag: 'none',
    flows: [
      {flow:'Casino page',
       images:[{src:'img/casino-virtuals/c1.png',label:'01 · Landing'},{src:'img/casino-virtuals/c2.png',label:'02 · Casino page'},{src:'img/casino-virtuals/c3.png',label:'03 · Remove from favourites'},{src:'img/casino-virtuals/c4.png',label:'04 · Dropdown filter'},{src:'img/casino-virtuals/c5.png',label:'05 · Search'},{src:'img/casino-virtuals/c6.png',label:'06 · Search — no games'},{src:'img/casino-virtuals/c7.png',label:'07 · Game entering'},{src:'img/casino-virtuals/c8.png',label:'08 · Recently played'},{src:'img/casino-virtuals/c9.png',label:'09 · Hero banner'},{src:'img/casino-virtuals/c10.png',label:'10 · All games button'}],
       strengths:[
        {text:"Persistent search with its own screen and removable “Recent Searches” chips — a fast way back to games with minimal re-typing.", n:1, law:"Cognitive Load"},
        {text:"A dedicated Favourites (star) tab lets players save and re-find games — recognition over recall.", n:2, law:"Jakob's Law"},
        {text:"Games have no Demo option or info/description button — no way to preview a game or learn how it works before committing real money.", n:2, law:"Cognitive Load"},
        {text:"Games are grouped into clear themed rails (“Most Popular in Nigeria”, “Hot Games”) — curated, scannable browsing.", n:3, law:"Law of Common Region"},
        {text:"Bold tile art plus “Exclusive” / “Hot” tags and jackpot figures draw the eye and set expectations at a glance.", n:4, law:"Von Restorff Effect"},
        {text:"One-tap category chips (Home / All / Popular / Hot) keep browsing on a single screen.", n:5, law:"Fitts's Law"},
        {text:"The top bar and bottom nav are identical to the sportsbook, so switching Sports ↔ Casino needs no relearning.", n:6, law:"Jakob's Law"},
        {text:"The Win-Bonus progress bar carries into Casino too — consistent reward messaging across products.", n:7, law:"Goal-Gradient Effect"},
       ], frictions:[
        {text:"Too many filter tabs at the top — the user scrolls a long horizontal row just to find the category they want.", n:1},
        {text:"The “Home” tab inside Casino should be renamed to “Recommended”, so users don’t think tapping it leaves Casino for the site homepage.", n:3},
        {text:"A large number of games are hidden behind scrolling — the user might not notice them.", n:4},
        {text:"The confirmation modal for removing from favourites is unnecessary — the action is minor and instantly reversible.", n:5},
        {text:"The sorting may confuse users — there’s “Popular” in sorting and also one at the top.", n:6},
        {text:"With many recent searches, we stop suggesting games — we could limit the number or hide the older ones.", n:7},
        {text:"There’s no action to delete all recent searches at once.", n:8},
        {text:"Users may be more used to seeing the navigation at the top.", n:9},
        {text:"There’s no block with recent wins in casino games.", n:10},
        {text:"Show the number of players / likes / total plays to build interest.", n:11},
        {text:"When the user closes a casino game the app closes immediately, with no attempt to retain them (e.g. suggesting other games).", n:12},
        {text:"Banners between game category blocks look low quality — like static screenshots with a fake baked-in CTA button; the whole banner is the click target, making the button misleading.", n:13},
      ]},
      {flow:'Virtuals',
       images:[{src:'img/casino-virtuals/v1.png',label:'01 · Landing'},{src:'img/casino-virtuals/v2.png',label:'02 · Virtuals page'},{src:'img/casino-virtuals/v3.png',label:'03 · Favourites'},{src:'img/casino-virtuals/v4.png',label:'04 · Match list'},{src:'img/casino-virtuals/v5.png',label:'05 · Leagues'},{src:'img/casino-virtuals/v6.png',label:'06 · Match details'},{src:'img/casino-virtuals/v7.png',label:'07 · Live matches'},{src:'img/casino-virtuals/v8.png',label:'08 · Results'},{src:'img/casino-virtuals/v9.png',label:'09 · League statistics'},{src:'img/casino-virtuals/v10.png',label:'10 · Active betslip'},{src:'img/casino-virtuals/v11.png',label:'11 · Betslip'},{src:'img/casino-virtuals/v12.png',label:'12 · Bet placed'},{src:'img/casino-virtuals/v13.png',label:'13 · My Bets (Virtuals)'}],
       strengths:[
        {text:"Virtuals reuse the exact sportsbook UI (leagues, match list, 1X2 odds, betslip) — players already know how to bet, with zero relearning.", n:1, law:"Jakob's Law"},
        {text:"A coherent end-to-end flow: landing → league → match list → match details → betslip → “Bet Placed” → My Bets.", n:2, law:"Goal-Gradient Effect"},
        {text:"The “Bet Placed” screen gives a clear success confirmation and receipt — strong system-status feedback.", n:3, law:"Peak-End Rule"},
        {text:"League standings and statistics are provided for virtual leagues, so bets feel as informed as real sports.", n:4, law:"Cognitive Load"},
        {text:"A live match visualiser (animated pitch) makes virtual in-play feel like real football — engaging to watch.", n:5, law:"Von Restorff Effect"},
        {text:"Odds use the same 1X2 layout and colours as the sportsbook — instant familiarity.", n:6, law:"Jakob's Law"},
        {text:"A dedicated “My Bets (Virtuals)” view keeps virtual bet history in one place.", n:7, law:"Law of Common Region"},
       ], frictions:[
        {text:"The illustrations don’t catch the eye."},
        {text:"Multiple entries essentially lead to the same Virtuals game and take up a lot of space."},
        {text:"There aren’t many objects here — the layout could show everything to the user at once."},
        {text:"Not much interactivity — no campaigns, banners, etc. to engage the user."},
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
    name: 'Deposits & Withdrawals', reviewer: '—', tag: 'severity',
    flows: [
      {flow:'Deposit · MoMo', subs:[
        {title:'Flow 1 · Deposit journey',
         images:[{src:'img/deposits-withdrawals/mo1.png',label:'01 · Deposit guide'},{src:'img/deposits-withdrawals/mo2.png',label:'02 · Deposit amount'},{src:'img/deposits-withdrawals/mo3.png',label:'03 · Success'}],
         strengths:[
          {text:"Successful-deposit confirmation is shown.", n:1, law:"Peak-End Rule"},
          {text:"Min & max deposit amounts are enforced — the Deposit CTA disables outside the range.", n:2, law:"Jakob's Law"},
          {text:"Deposit-limit validation is in place.", n:3, law:"Jakob's Law"},
         ], frictions:[
          {text:"Too much copy sits before the deposit component, risking it being pushed below the fold — reduce the intro text. (NG)", n:4, severity:"MEDIUM", law:"Serial Position Effect"},
          {text:"The guide copy is inconsistent — headings use the same font size as body text. (NG)", n:5, severity:"LOW", law:"Jakob's Law"},
          {text:"The guide section is text-heavy — consider accordions to cut the wall of text. (NG)", n:6, severity:"MEDIUM", law:"Cognitive Load"},
         ]},
        {title:'Flow 2 · Insufficient funds',
         images:[{src:'img/deposits-withdrawals/mo4.png',label:'01 · Insufficient funds'}],
         strengths:[{text:"An insufficient-funds notification is shown.", n:1, law:"Doherty Threshold"}],
         frictions:[{text:"In some markets (seen in MW) the insufficient-funds error is delayed or never shows on betPawa, even though the Telco already sent the SMS.", n:2, severity:"HIGH", law:"Doherty Threshold"}]},
        {title:'Flow 3 · Error message',
         images:[{src:'img/deposits-withdrawals/mo5.png',label:'01 · Vague error'},{src:'img/deposits-withdrawals/mo6.png',label:'02 · Clearer error'}],
         strengths:[{text:"On the follow-up screen the error message gives a bit more clarity about the issue.", n:1, law:"Cognitive Load"}],
         frictions:[{text:"The error message is vague and doesn’t clarify the actual issue — mirror the clearer message shown on the following screen.", n:2, severity:"MEDIUM", law:"Cognitive Load"}]},
       ]},
      {flow:'Deposit · Opay', subs:[
        {title:'Flow 4 · Online deposit',
         images:[{src:'img/deposits-withdrawals/opa1.png',label:'01 · Deposit method'},{src:'img/deposits-withdrawals/opa2.png',label:'02 · Seamless deposit'}],
         strengths:[{text:"Online deposit via Opay is seamless.", n:1, law:"Jakob's Law"}], frictions:[]},
        {title:'Flow 5 · Return to merchant',
         images:[{src:'img/deposits-withdrawals/opb1.png',label:'01 · Return to Merchant'},{src:'img/deposits-withdrawals/opb2.png',label:'02 · No success message'}],
         strengths:[], frictions:[
          {text:"After tapping “Return to Merchant”, the user lands back on Opay’s deposit page instead of the betPawa site.", n:1, severity:"MEDIUM", law:"Mental Model"},
          {text:"No deposit-success message is shown — you have to reload/refresh the page to see the balance update.", n:2, severity:"HIGH", law:"Doherty Threshold"}]},
        {title:'Flow 6 · Unsuccessful deposit',
         images:[{src:'img/deposits-withdrawals/opc1.png',label:'01 · Unsuccessful message'}],
         strengths:[{text:"A clear deposit-unsuccessful message is shown when it fails.", n:1, law:"Doherty Threshold"}], frictions:[]},
       ]},
      {flow:'Deposit · Monnify', subs:[
        {title:'Flow 7 · Successful transaction',
         images:[{src:'img/deposits-withdrawals/mna1.png',label:'01 · Success'},{src:'img/deposits-withdrawals/mna2.png',label:'02 · Leaves betPawa'}],
         strengths:[{text:"Clear successful-transaction message.", n:1, law:"Peak-End Rule"}], frictions:[
          {text:"The payment reference is too long and spills out of the notification component.", n:2, severity:"LOW", law:"Aesthetic-Usability Effect"},
          {text:"Users have to leave betPawa to complete the transaction.", n:3, severity:"MEDIUM", law:"Mental Model"}]},
        {title:'Flow 8 · Success without deposit',
         images:[{src:'img/deposits-withdrawals/mnb1.png',label:'01 · Delay message'},{src:'img/deposits-withdrawals/mnb2.png',label:'02 · Success without deposit'}],
         strengths:[{text:"Clear communication when there’s a delay.", n:1, law:"Doherty Threshold"}], frictions:[
          {text:"A “successful deposit” notification appears even when no deposit was actually made.", n:2, severity:"HIGH", law:"Mental Model"}]},
        {title:'Flow 9 · Delay handling',
         images:[{src:'img/deposits-withdrawals/mnc1.png',label:'01 · Delay message'},{src:'img/deposits-withdrawals/mnc2.png',label:'02 · Payment reference'},{src:'img/deposits-withdrawals/mnc3.png',label:'03 · Leaves betPawa'}],
         strengths:[{text:"Clear communication when there’s a delay.", n:1, law:"Doherty Threshold"}], frictions:[
          {text:"The payment reference is too long and spills out of the notification component.", n:2, severity:"LOW", law:"Aesthetic-Usability Effect"},
          {text:"Users have to leave betPawa to complete the transaction.", n:3, severity:"MEDIUM", law:"Mental Model"}]},
       ]},
      {flow:'Deposit · Palmpay',
       images:[{src:'img/deposits-withdrawals/ppa1.png',label:'01 · Deposit start'},{src:'img/deposits-withdrawals/ppa2.png',label:'02 · Deposit'},{src:'img/deposits-withdrawals/ppb1.png',label:'03 · Success without deposit'}],
       strengths:[
        {text:"Clear communication when there’s a delay.", n:1, law:"Doherty Threshold"},
       ], frictions:[
        {text:"A “successful deposit” notification appears even when no deposit was actually made.", n:2, severity:"HIGH", law:"Mental Model"},
       ]},
      {flow:'Deposit · Wave',
       images:[{src:'img/deposits-withdrawals/wv1.png',label:'01 · Deposit'},{src:'img/deposits-withdrawals/wv2.png',label:'02 · Deposit'},{src:'img/deposits-withdrawals/wv3.png',label:'03 · Success despite low balance'}],
       strengths:[], frictions:[
        {text:"A “deposit successful” message shows even when the user has insufficient balance.", severity:"HIGH", law:"Mental Model"},
       ]},
      {flow:'Withdrawal — MoMo',
       images:[{src:'img/deposits-withdrawals/wm1.png',label:'01 · Withdraw'},{src:'img/deposits-withdrawals/wm2.png',label:'02 · Insufficient balance'},{src:'img/deposits-withdrawals/wm3.png',label:'03 · Approved'}],
       strengths:[
        {text:"User is notified once the withdrawal request is approved.", law:"Doherty Threshold"},
       ], frictions:[
        {text:"Insufficient-balance should be flagged before the user taps Withdraw, not after.", severity:"MEDIUM", law:"Jakob's Law"},
        {text:"The Withdraw button should disable once the insufficient-balance notice appears.", severity:"MEDIUM", law:"Jakob's Law"},
       ]},
      {flow:'Withdrawal — Bank transfer', subs:[
        {title:'Withdraw to bank',
         images:[{src:'img/deposits-withdrawals/wba2.png',label:'01 · Approved'},{src:'img/deposits-withdrawals/wba3.png',label:'02 · Insufficient balance'}],
         strengths:[
          {text:"Users can add more than one bank account to withdraw to.", n:1, law:"Jakob's Law"},
          {text:"User is notified once the withdrawal request is approved.", n:2, law:"Doherty Threshold"}],
         frictions:[
          {text:"Insufficient-balance should be flagged before the user taps Withdraw, not after.", n:3, severity:"MEDIUM", law:"Jakob's Law"},
          {text:"The Withdraw button should disable once the insufficient-balance notice appears.", n:4, severity:"MEDIUM", law:"Jakob's Law"}]},
        {title:'Add new account',
         images:[{src:'img/deposits-withdrawals/wbb1.png',label:'01 · No contact link'},{src:'img/deposits-withdrawals/wbb2.png',label:'02 · Validation timing'}],
         strengths:[], frictions:[
          {text:"No “Contact us” link is provided in the notification.", n:1, severity:"LOW", law:"Jakob's Law"},
          {text:"Account validation should happen in real time, before the user taps “Add New Account”.", n:2, severity:"MEDIUM", law:"Doherty Threshold"}]},
       ]},
      {flow:'Dark-mode icons (NG)',
       images:[{src:'img/deposits-withdrawals/dk1.png',label:'01 · Deposit method icons (dark)'}],
       strengths:[], frictions:[
        {text:"Some bank / deposit-method icons have poor contrast in dark mode (NG only).", severity:"LOW", law:"Cognitive Load"},
       ]},
    ],
  },
  {
    name: 'Sign-up & Login', reviewer: '—', tag: 'severity',
    flows: [
      {flow:'Sign up',
       images:[{src:'img/sign-up-login/g1.png',label:'01 · Sign-up page'},{src:'img/sign-up-login/g2.png',label:'02 · Empty input field'},{src:'img/sign-up-login/g3.png',label:'03 · Nationality change'},{src:'img/sign-up-login/g4.png',label:'04 · Unsupported network'},{src:'img/sign-up-login/g5.png',label:'05 · Network error'}],
       strengths:[
        {text:"All onboarding requirements are visible, with labels above each input field.", n:1, law:"Cognitive Load"},
       ], frictions:[
        {text:"Validation errors and empty-field errors are shown together as one combined message instead of per-field — and no error appears when Date of Birth is left unselected.", n:2, severity:"MEDIUM", law:"Jakob's Law"},
        {text:"The dropdown arrow icon isn’t clickable, and the input-field label doesn’t match the ID type.", n:3, severity:"MEDIUM", law:"Fitts's Law"},
        {text:"The error message doesn’t list the acceptable registration networks.", n:4, severity:"MEDIUM", law:"Cognitive Load"},
        {text:"After a page refresh you have to re-enter all the details from scratch.", n:5, severity:"MEDIUM", law:"Tesler's Law"},
       ]},
      {flow:'Login',
       images:[{src:'img/sign-up-login/l1.png',label:'01 · Empty state'},{src:'img/sign-up-login/l2.png',label:'02 · Incorrect login detail'},{src:'img/sign-up-login/l3.png',label:'03 · Network error'}],
       strengths:[], frictions:[
        {text:"Validation errors and empty-field errors are shown together, not separated by cause.", n:1, severity:"MEDIUM", law:"Jakob's Law"},
        {text:"Vague error message — it doesn’t address the real issue.", n:2, severity:"MEDIUM", law:"Cognitive Load"},
        {text:"When logging in, a long delay (~10 seconds) happens before the network-error message appears.", n:3, severity:"HIGH", law:"Doherty Threshold"},
       ]},
      {flow:'Password reset & verification',
       images:[{src:'img/sign-up-login/p1.png',label:'02 · Forgot password'},{src:'img/sign-up-login/p2.png',label:'03 · Verification code'},{src:'img/sign-up-login/p3.png',label:'04 · Exhaust SMS codes'},{src:'img/sign-up-login/p4.png',label:'04 · Second preferred method'},{src:'img/sign-up-login/p5.png',label:'USSD verification'},{src:'img/sign-up-login/p6.png',label:'All options used'}],
       strengths:[], frictions:[
        {text:"The note on the Verification page should be updated or removed — password reset isn’t done on that page.", n:1, severity:"LOW", law:"Cognitive Load"},
        {text:"After reaching the daily SMS limit, the alternative-verification methods component should be open by default.", n:2, severity:"MEDIUM", law:"Hick's Law"},
        {text:"“Call” shouldn’t be auto-selected as the next alternative method outside of availability hours.", n:3, severity:"MEDIUM", law:"Mental Model"},
        {text:"The USSD pop-up closes when tapping outside, interrupting the intended action.", n:4, severity:"HIGH", law:"Mental Model"},
        {text:"Text formatting is inconsistent across the flow.", n:5, severity:"LOW", law:"Jakob's Law"},
        {text:"The “Send Verification Code” button stays active after all options are exhausted, and redirects to an unavailable “Call” option.", n:6, severity:"MEDIUM", law:"Mental Model"},
       ]},
      {flow:'Sign up Nigeria',
       images:[{src:'img/sign-up-login/n1.png',label:'01 · Sign-up page'},{src:'img/sign-up-login/n2.png',label:'02 · Empty input field'},{src:'img/sign-up-login/n3.png',label:'04 · Unsupported network'}],
       strengths:[
        {text:"All onboarding requirements are visible, with labels above each input field.", n:1, law:"Cognitive Load"},
       ], frictions:[
        {text:"Validation errors and empty-field errors are shown together, not separated by cause.", n:2, severity:"MEDIUM", law:"Jakob's Law"},
        {text:"After a page refresh you have to re-enter all the details from scratch.", n:3, severity:"MEDIUM", law:"Tesler's Law"},
        {text:"An incorrect “reset password” error is shown for an incomplete sign-up with an unverified number.", n:4, severity:"MEDIUM", law:"Mental Model"},
       ]},
      {flow:'Successful sign-up',
       images:[{src:'img/sign-up-login/s1.png',label:'01 · Landing after verification'},{src:'img/sign-up-login/s2.png',label:'02 · Limit reached'}],
       strengths:[], frictions:[
        {text:"The Terms & Conditions modal appears after verification even though the user already accepted the terms during registration — no need to show it again to new users.", n:1, severity:"LOW", law:"Occam's Razor"},
        {text:"A “limit reached” error shows even for a brand-new user trying to verify, and the alternative-verification component should be open by default.", n:2, severity:"MEDIUM", law:"Mental Model"},
       ]},
    ],
  },
  {
    name: 'Pre-Event Betting', reviewer: '—', tag: 'severity',
    flows: [
      {flow:'Discovery → event card → event page',
       images:[{src:'img/pre-match/pm1-1.png',label:'01 · Homepage / discovery'},{src:'img/pre-match/pm1-2.png',label:'02 · Event card (1X2)'},{src:'img/pre-match/pm1-3.png',label:'03 · Event page · H2H'},{src:'img/pre-match/pm1-4.png',label:'04 · Event page · markets'}],
       strengths:[
        {text:"Quick access to Sports from the top nav.", n:1, law:"Jakob's Law"},
        {text:"Quick filters are available for event search.", n:2, law:"Jakob's Law"},
        {text:"1X2 market buttons are available at the event-card level, so users can bet without opening the event.", n:7, law:"Fitts's Law"},
        {text:"The H2H analytics block provides useful insight on the event.", n:11, law:"Cognitive Load"},
        {text:"Markets can be collapsed / expanded all at once.", n:14, law:"Tesler's Law"},
       ], frictions:[
        {text:"No advanced filters or advanced search on the homepage or in the header.", n:3, severity:"MEDIUM", law:"Hick's Law"},
        {text:"Combo bets show on the first screen, but no event cards are visible without scrolling.", n:4, severity:"MEDIUM", law:"Serial Position Effect"},
        {text:"The stat icon is hard to understand and too small — it needs to be bigger and clearer.", n:5, severity:"LOW", law:"Fitts's Law"},
        {text:"No indication that a selection was already made, unless it’s a 1X2 pick — the chosen market isn’t reflected back to the user.", n:6, severity:"MEDIUM", law:"Von Restorff Effect"},
        {text:"At the card level it isn’t clear how many markets or bet options an event offers.", n:8, severity:"MEDIUM", law:"Cognitive Load"},
        {text:"The “＞” arrow icon buttons look redundant — they do the same thing as tapping the card.", n:9, severity:"LOW", law:"Tesler's Law"},
        {text:"The card header could be more engaging with visuals (team crests, form, etc.).", n:10, severity:"LOW", law:"Aesthetic-Usability Effect"},
        {text:"On opening the event page, the H2H analytics block fills most of the screen by default, pushing the markets below the fold.", n:12, severity:"HIGH", law:"Serial Position Effect"},
        {text:"The market tabs don’t guide the user — they just present a long list of markets; pin functionality exists only in TZ.", n:13, severity:"HIGH", law:"Hick's Law"},
       ]},
      {flow:'Exploring markets within an event',
       images:[{src:'img/pre-match/pm2-1.png',label:'01 · Market search'},{src:'img/pre-match/pm2-2.png',label:'02 · Switching market tabs'},{src:'img/pre-match/pm2-3.png',label:'03 · Making a selection'},{src:'img/pre-match/pm2-4.png',label:'04 · Exploring the event'},{src:'img/pre-match/pm2-5.png',label:'05 · Exploring the event'}],
       strengths:[
        {text:"Users can search for markets by name.", n:2, law:"Jakob's Law"},
        {text:"Tabs act as market filters.", n:3, law:"Law of Common Region"},
        {text:"Info icons and tooltips help users understand what each market means.", n:5, law:"Cognitive Load"},
       ], frictions:[
        {text:"The in-event “Market” search looks like the header “Event” search but behaves differently — creating inconsistency and cognitive dissonance.", n:1, severity:"HIGH", law:"Jakob's Law"},
        {text:"No access to stats while navigating the markets.", n:4, severity:"MEDIUM", law:"Cognitive Load"},
        {text:"Once a selection is made there’s no confirmation — the only way to check is to find it manually in the market list.", n:6, severity:"HIGH", law:"Doherty Threshold"},
       ]},
      {flow:'Additional heuristic suggestions (review team)',
       images:[{src:'img/pre-match/ps1.png',label:'01 · Discovery'},{src:'img/pre-match/ps2.png',label:'02 · Event card'},{src:'img/pre-match/ps3.png',label:'03 · Event page · H2H'},{src:'img/pre-match/ps4.png',label:'04 · Event page · markets'}],
       strengths:[], frictions:[
        {text:"Pre-match cards give no kickoff countdown or clear time-to-start — a countdown as kickoff nears sets expectations and adds urgency (builds on the discovery-scanning findings).", severity:"LOW", law:"Goal-Gradient Effect"},
        {text:"There’s no odds-movement indicator on pre-match markets (up / down since last view) — showing drift helps users decide when to place, and complements the “how many markets” friction.", severity:"LOW", law:"Von Restorff Effect"},
        {text:"Suspended or unavailable selections need a clear locked state before kickoff, so users aren’t surprised when a bet can’t be placed.", severity:"MEDIUM", law:"Von Restorff Effect"},
        {text:"The long, ungrouped market list (finding 13) would benefit from a sticky category index or grouped sections with counts — not just tabs — to cut scanning cost.", severity:"HIGH", law:"Law of Common Region"},
        {text:"Add persistent selection feedback in the betslip mini-bar (relates to finding 6): a running count / confirmation as selections are added avoids the “find it manually” problem.", severity:"MEDIUM", law:"Doherty Threshold"},
        {text:"Make the two searches — event (header) vs market (in-event, finding 1) — visually and behaviourally distinct (different placeholder copy, icon, scope label) so users build one correct mental model.", severity:"MEDIUM", law:"Jakob's Law"},
        {text:"Give the stats / H2H entry (findings 5, 11, 12) a collapsed-by-default summary with a clear expand, so insight stays available without burying the markets.", severity:"MEDIUM", law:"Cognitive Load"},
       ]},
    ],
  },
  {
    name: 'Homepage & Sports Discovery', reviewer: '—', tag: 'severity',
    flows: [
      {flow:"Homepage · Landing & orientation",
       images:[{src:"img/homepage-sports-discovery/a1-1.png",label:"01 · Above the fold"},{src:"img/homepage-sports-discovery/a1-2.png",label:"02 · Campaigns & combos"},{src:"img/homepage-sports-discovery/a1-3.png",label:"03 · More markets"},{src:"img/homepage-sports-discovery/a1-4.png",label:"04 · Bonus nudge"}],
       strengths:[
        {text:"Clear top-to-bottom hierarchy — balance & nav, then campaigns, then combos, then match lists.",law:"Serial Position Effect"},
        {text:"Balance and a one-tap Deposit ‘+’ sit top-right on landing — funding is always one tap away.",law:"Fitts's Law"},
        {text:"The persistent ‘up to 1250% Win Bonus’ footer nudges accumulator building without blocking content.",law:"Goal-Gradient Effect"},
        {text:"Sticky bottom nav keeps Sports / Betslip / My bets / Account one tap away throughout the scroll.",law:"Jakob's Law"},
        {text:"A consistent green marks every actionable odd and CTA — a clear ‘tap here’ visual language.",law:"Von Restorff Effect"},
        {text:"Home leads with 'Popular Match Combos' — pre-built multi-selection bets accelerate the core action right on the homepage.",law:"Goal-Gradient Effect"},
       ],
       frictions:[
        {text:"USPs push real match lists well below the fold.",severity:"HIGH",law:"Hick's Law · Cognitive Load"},
        {text:"Casino Cashback is the first campaign card on a sports home — casino cross-sell ahead of sport.",severity:"MEDIUM",law:""},
        {text:"The three campaign cards are visually near-identical (‘Read More’), so no single offer stands out.",severity:"LOW",law:"Law of Similarity"},
        {text:"Every visit starts by scrolling past campaigns.",severity:"MEDIUM",law:"Cognitive Load"},
       ]},
      {flow:"Homepage · Quick-bet",
       images:[{src:"img/homepage-sports-discovery/a2-1.png",label:"01 · Combos"},{src:"img/homepage-sports-discovery/a2-2.png",label:"02 · One tap adds it"},{src:"img/homepage-sports-discovery/a2-3.png",label:"03 · Accumulator & bonus"}],
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
      {flow:"Homepage · Campaigns discovery",
       images:[{src:"img/homepage-sports-discovery/a3-1.png",label:"01 · Win Bonus"},{src:"img/homepage-sports-discovery/a3-2.png",label:"02 · Early Wins"},{src:"img/homepage-sports-discovery/a3-3.png",label:"03 · Cashback"}],
       strengths:[
        {text:"Each campaign has a dedicated, well-explained page with a single clear CTA.",law:"Hick's Law"},
        {text:"Each campaign page leads with one bold value prop and a single BET NOW CTA — no decision overload.",law:"Von Restorff Effect"},
        {text:"Each campaign page includes a plain-language ‘What makes it different / How it works’ breakdown.",law:""},
        {text:"A single BET NOW / PLAY NOW CTA per page keeps the next step obvious.",law:"Hick's Law"},
       ],
       frictions:[
        {text:"Campaign pages are separate destinations with no ‘back to bet’ shortcut — users can lose their place.",severity:"LOW",law:"Mental Model"},
        {text:"Casino cashback is featured on the homepage home — cross-sell competes with sports intent.",severity:"MEDIUM",law:""},
        {text:"Campaign pages are long marketing scrolls — the actual terms and limits sit well below the fold.",severity:"MEDIUM",law:"Cognitive Load"},
        {text:"Three overlapping bonuses (Win Bonus, Early Wins, Cashback) with no comparison — unclear which applies when.",severity:"LOW",law:"Choice Overload"},
       ]},
      {flow:"Sports Discovery · Browse & filter a sport",
       images:[{src:"img/homepage-sports-discovery/b1-1.png",label:"01 · Football list"},{src:"img/homepage-sports-discovery/b1-2.png",label:"02 · Leagues filter"},{src:"img/homepage-sports-discovery/b1-3.png",label:"03 · Markets filter"}],
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
        {text:"The market filter is a long radio list with no search — finding a specific market is slow.",severity:"LOW",law:"Hick's Law"},
        {text:"Date sits in a separate dropdown from the day tabs — two ways to pick a day is confusing.",severity:"LOW",law:"Jakob's Law"},
       ]},
      {flow:"Sports Discovery · Live → in-play",
       images:[{src:"img/homepage-sports-discovery/b2-1.png",label:"01 · Live list"},{src:"img/homepage-sports-discovery/b2-2.png",label:"02 · In-play event"},{src:"img/homepage-sports-discovery/b2-3.png",label:"03 · In-play markets"}],
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
        {text:"The date picker only allows a single date selection — selecting multiple dates is not supported.",severity:"LOW",law:""},
       ]},
      {flow:"Sports Discovery · Event deep-dive",
       images:[{src:"img/homepage-sports-discovery/b3-1.png",label:"01 · Event & stats"},{src:"img/homepage-sports-discovery/b3-2.png",label:"02 · Statistics"},{src:"img/homepage-sports-discovery/b3-3.png",label:"03 · Markets"}],
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
       ]},
    ],
  },
];

const TODO = [

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
const flowStr=f=>f.subs?f.subs.flatMap(s=>s.strengths||[]):(f.strengths||[]);
const flowFr=f=>f.subs?f.subs.flatMap(s=>s.frictions||[]):(f.frictions||[]);
for(const t of topics){ const map=SEV_ASSIGN[t.name]; if(!map) continue; for(const f of t.flows){ for(const x of flowFr(f)){ if(x.severity) continue; const l=x.text.toLowerCase(); for(const [k,v] of map){ if(l.includes(k)){ x.severity=v; break; } } } } }

// Law-of-UX assignment for topics whose reviewers didn't tag laws (hub-side, first pass — refine per-finding as needed)
const LAW_ASSIGN=[
  // Live Betting
  ["featured above the fold","Serial Position Effect"],["indication of how many more","Goal-Gradient Effect"],["applied filters clearly visible","Jakob's Law"],["number of live events under each category","Von Restorff Effect"],
  ["last option and easily missed","Serial Position Effect"],["count mismatches within the same session","Jakob's Law"],["type chips (outrights","Law of Common Region"],["no sport icon, only a text label","Von Restorff Effect"],
  ["pill overlaps live list content","Fitts's Law"],["expects to see the 15 more","Mental Model"],["not clear how to search for a specific game","Jakob's Law"],["actively updating","Doherty Threshold"],
  ["no visible default sort logic","Cognitive Load"],["market selections on the match card","Cognitive Load"],["fixed section reduces the view area","Serial Position Effect"],
  ["markets have explainers","Cognitive Load"],["search for a market without exiting","Jakob's Law"],["tooltip text is cut off","Cognitive Load"],["different results depending on which tab","Mental Model"],
  ["even when a different tab was active","Mental Model"],["live events list doesn","Doherty Threshold"],["no way to broaden the search","Hick's Law"],
  ["half-time indicators are present","Von Restorff Effect"],["next action for the user","Mental Model"],["reverts to the scheduled kickoff","Mental Model"],["markets disappear and reappear","Doherty Threshold"],["second half has started but the details page","Doherty Threshold"],
  ["odds-change direction is shown clearly","Von Restorff Effect"],["toggle correctly gates behaviour","Jakob's Law"],["indication of locked and unavailable selections","Von Restorff Effect"],["no actual time & score for live events","Cognitive Load"],
  ["auto-toggled off when odds change","Mental Model"],["banner doesn","Cognitive Load"],["two different badges with no explanation","Mental Model"],["actual button reads","Jakob's Law"],["selection order re-shuffles","Mental Model"],
  ["live legs show the live badge","Von Restorff Effect"],["distinct visuals for live stats create more","Jakob's Law"],["minimize stats","Cognitive Load"],["inline stats panel pushes the remaining legs","Serial Position Effect"],["two different disclaimer strings","Jakob's Law"],
  ["navigates the user back to upcoming","Mental Model"],["sometimes we show full stats","Jakob's Law"],["opening behaviour of live stats","Jakob's Law"],
  // My Bets & Cashout
  ["categorized tabs provide structured navigation","Law of Common Region"],["detailed headers and item counts","Cognitive Load"],["granular status labels clearly communicate","Von Restorff Effect"],["active tab highlighting offers strong feedback","Von Restorff Effect"],
  ["return-to-top control enables rapid","Fitts's Law"],["essential wagering details remain clearly grouped","Law of Common Region"],["share trigger occupies a high-visibility","Von Restorff Effect"],["full context: sport type","Cognitive Load"],
  ["header tabs stay fixed but trigger navigation","Mental Model"],["stay pinned during vertical scrolling","Jakob's Law"],["bet id values are static text","Fitts's Law"],["structured visual layout","Jakob's Law"],
  ["grey informational boxes occupy","Cognitive Load"],["lack selection details despite available space","Cognitive Load"],["re-use button sits above match listings","Mental Model"],["no explicit tap-to-copy","Fitts's Law"],
  ["lack rich live visualisations","Cognitive Load"],["tap through to primary event pages","Mental Model"],["leg selection lists blend into general","Law of Common Region"],
  ["cashout section sits in a logical position","Serial Position Effect"],["action happens directly on the page with fast","Doherty Threshold"],["status label is placed in a correct","Von Restorff Effect"],
  ["cashout information is completely absent","Cognitive Load"],["show the cashout amount upfront","Cognitive Load"],["advanced cashout functionality available","Jakob's Law"],["status label after cashout lacks clarity","Mental Model"],["feedback after cashout relies solely","Doherty Threshold"],
  ["differentiation looks well executed","Von Restorff Effect"],["internal card design is strong","Von Restorff Effect"],["share button has an impressive visual","Von Restorff Effect"],["banner permanently occupies too much space","Hick's Law"],
  ["negative aspects from the open bets card persist","Jakob's Law"],["sharing functionality is completely absent directly","Fitts's Law"],["confetti and a trophy","Mental Model"],["dropdown pattern for open bet details","Jakob's Law"],["whether a game is won or lost","Von Restorff Effect"],["sharing is heavily constrained","Jakob's Law"],
  // Casino & Virtuals
  ["too many filter tabs at the top","Hick's Law"],["no demo option","Cognitive Load"],["renamed to","Mental Model"],["hidden behind scrolling","Serial Position Effect"],["confirmation modal for removing from favourites","Tesler's Law"],
  ["sorting may confuse users","Jakob's Law"],["stop suggesting games","Cognitive Load"],["used to seeing the navigation at the top","Jakob's Law"],["number of players","Von Restorff Effect"],["closes immediately","Peak-End Rule"],
  ["banners between game category blocks look low quality","Jakob's Law"],["no block with recent wins in casino","Von Restorff Effect"],["delete all recent searches","Tesler's Law"],
  ["illustrations don","Von Restorff Effect"],["same virtuals game","Occam's Razor"],["many objects here","Cognitive Load"],["not much interactivity","Goal-Gradient Effect"],["big recent wins","Von Restorff Effect"],["timer on the virtual thumbnail","Goal-Gradient Effect"],
  ["league selection at the top","Serial Position Effect"],["next button leads","Mental Model"],["clearly that the match is live","Von Restorff Effect"],["active betslip","Von Restorff Effect"],["dedicated betslip on the virtuals page","Law of Common Region"],
  // Help & Support
  ["play up the block titles","Von Restorff Effect"],["adding screenshots or videos","Cognitive Load"],["a search would make it easier","Hick's Law"],["add navigation within this page","Jakob's Law"],
  // Homepage & Sports Discovery (findings the reviewer left untagged)
  ["casino cashback is the first campaign","Serial Position Effect"],["each combo lists its legs","Cognitive Load"],["plain-language","Cognitive Load"],["cross-sell competes with sports intent","Selective Attention"],
  ["no single view of all active filters","Cognitive Load"],["aren't summarised on the results list","Cognitive Load"],["event sub-tabs","Law of Common Region"],["in-play visualiser dominates","Serial Position Effect"],
  ["date picker only allows a single date","Mental Model"],["grouped into scannable tabs","Law of Common Region"],["market groups carry counts","Von Restorff Effect"],["statistics fill the whole first screen","Serial Position Effect"],
];
for(const t of topics){ for(const f of t.flows){ for(const arr of [flowStr(f),flowFr(f)]){ for(const x of arr){ if(x.law) continue; const l=x.text.toLowerCase(); for(const [k,v] of LAW_ASSIGN){ if(l.includes(k)){ x.law=v; break; } } } } } }

// ---- counts ----
const SEV_ORDER = ['CRITICAL','HIGH','MEDIUM','LOW','NIT'];
function topicCounts(t){
  let s=0,f=0; const sev={CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0,NIT:0};
  for(const fl of t.flows){ const strs=flowStr(fl),frs=flowFr(fl); s+=strs.length; f+=frs.length; for(const x of frs){ if(x.severity&&sev[x.severity]!==undefined) sev[x.severity]++; } }
  return {s,f,sev};
}
// hidden topics — kept in code but not shown (remove from HIDDEN to re-enable)
const HIDDEN=[];
for(let i=topics.length-1;i>=0;i--){ if(HIDDEN.includes(topics[i].name)) topics.splice(i,1); }
const totals = topics.reduce((a,t)=>{const c=topicCounts(t);a.s+=c.s;a.f+=c.f;SEV_ORDER.forEach(k=>a.sev[k]+=c.sev[k]);return a;},{s:0,f:0,sev:{CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0,NIT:0}});

// ---- tab display order (Summary is always first, PreMatch/TODO always last) ----
const ORDER=['Global Navigation','Homepage & Sports Discovery','Pre-Event Betting','Live Betting','My Bets & Cashout','Casino & Virtuals & Other Products','Help & Support','Deposits & Withdrawals','Sign-up & Login'];
topics.sort((a,b)=>{const ia=ORDER.indexOf(a.name),ib=ORDER.indexOf(b.name);return (ia<0?99:ia)-(ib<0?99:ib);});

const FIGMA = {
  'Global Navigation':'https://www.figma.com/design/1H2KzGBaKHKuv9TirkutUM/Global-Navigation-%7C-UX-Review-%7C-Jim',
  'Live Betting':'https://www.figma.com/design/Tfv3EKofMYn6cRzjHR4VLu/Live-Betting-%7C-UX-Review-%7C-Henry',
  'My Bets & Cashout':'https://www.figma.com/design/o0JS6yvcoXhMiRcvzUjawC/My-Bets---Cashout-%7C-UX-Review-%7C-Ajay',
  'Help & Support':'https://www.figma.com/design/7RmAoEilfNK5YhK8yAPPNr/Help---Support-%7C-UX-Review-%7C-Ishkhan---Aleida',
  'Casino & Virtuals & Other Products':'https://www.figma.com/design/Hw0iiubXIIO7ASeTXm7hJI/Casino--Virtuals---Other-Products-%7C-UX-Review-%7C-Ishkhan',
  'Homepage & Sports Discovery':'https://www.figma.com/design/1MQKMFzFTMfBHqu29n5KEY/Homepage---Sports-Discovery-%7C-UX-Review--Copy-',
  'Pre-Event Betting':'https://www.figma.com/design/PoVIhpxPmpC2MtxrIhRHNs/Pre-match-Betting-%7C-UX-Review-%7C-Aleida---Konsta',
  'Sign-up & Login':'https://www.figma.com/design/fuDEdY5Y69N5k0dwhC8AFf/Sign-up-and-Login-Journeys-%7C-UX-Review',
  'Deposits & Withdrawals':'https://www.figma.com/design/gH7U1dLDcBWqNPWwPs1YFZ/Deposit---Withdrawal-%7C-UX-Review',
};
TODO.forEach(t=>{ if(FIGMA[t.name]) t.figma=FIGMA[t.name]; });
// Law-of-UX descriptions (from the Global Nav "Laws of UX" Figma page; * = standard lawsofux.com definition, not on that page)
const LAWS = {
  "Hick's Law":"The time to make a decision increases with the number and complexity of choices available.",
  "Miller's Law":"The average person can hold only about 7 (±2) items in working memory at once.",
  "Jakob's Law":"Users spend most of their time on other sites, so they expect yours to work the way the sites they already know do.",
  "Fitts's Law":"The time to acquire a target depends on its size and distance — bigger, closer, persistent targets are faster to hit.",
  "Tesler's Law":"Every system has an inherent complexity that can't be removed, only shifted — ideally absorbed by the system, not the user.",
  "Von Restorff Effect":"When several similar items are shown, the one that differs is the most likely to be noticed and remembered (e.g. an active tab).",
  "Choice Overload":"Presenting too many options at once overwhelms people and makes deciding harder.",
  "Zeigarnik Effect":"People remember uncompleted or interrupted tasks better than completed ones — a persistent reminder keeps the task alive.",
  "Occam's Razor":"Among options that perform equally well, the simplest — with the fewest elements and redundant paths — is best.",
  "Selective Attention":"We focus on a subset of stimuli (usually goal-related) and filter out the rest — the cause of ‘banner-blindness’.",
  "Cognitive Load":"The mental effort needed to understand and use an interface; excess load slows comprehension and completion.",
  "Mental Model":"People carry a model of how things should work from past experience; interfaces that match it feel intuitive.",
  "Law of Common Region":"Elements are perceived as a group when they share an area with a clearly defined boundary (e.g. cards/tiles).",
  "Peak-End Rule":"People judge an experience largely on how they felt at its peak and at its end — not the average of every moment.",
  "Serial Position Effect":"Users best remember the first and last items in a series; the middle tends to blur together.",
  "Goal-Gradient Effect":"Motivation to reach a goal increases the closer you get to it — visible progress pulls people forward.",
  "Doherty Threshold":"Productivity soars when a system responds fast enough (under ~400 ms) that neither the user nor the system waits.",
  "Law of Similarity":"The eye groups elements that look alike, perceiving them as a set even when they are apart.",
  "Flow":"The state of being fully immersed and focused in an activity, with a good balance of challenge and skill.",
};
// per-screen badge tokens (color g/r + number) → lets a finding map to the exact screen it sits on
const IMG_NUMS = {
  'img/global-navigation/01-home.png':['g1','r1','r7'],'img/global-navigation/02-sports.png':['g3','r3','r8'],'img/global-navigation/03-live.png':['r2','r8'],'img/global-navigation/04-casino.png':['g4'],'img/global-navigation/06-menu.png':['r4'],'img/global-navigation/07-betslip.png':['g2'],'img/global-navigation/09-account.png':['r5'],'img/global-navigation/10-logged-out.png':['r6'],
  'img/live-betting/lb1-1.png':['r2','r3','r4','g1'],'img/live-betting/lb1-2.png':['g5','r3','r6','r7'],'img/live-betting/lb1-3.png':['r10','g9','r8','r11','r13'],'img/live-betting/lb1-4.png':['g1'],'img/live-betting/lb1-5.png':['r14','r15'],
  'img/live-betting/lb2-1.png':['g1','r2'],'img/live-betting/lb2-2.png':['g3'],'img/live-betting/lb2-3.png':['r4','r7','r5','r6'],
  'img/live-betting/lb3-1.png':['g1'],'img/live-betting/lb3-2.png':['r2'],'img/live-betting/lb3-3.png':['r2'],'img/live-betting/lb3-4.png':['r3','g5','r4'],
  'img/live-betting/lb4-1.png':['r1'],'img/live-betting/lb4-2.png':['g2','r3'],'img/live-betting/lb4-3.png':['g4','r5','r9'],'img/live-betting/lb4-4.png':['r8','g5','r7','g6'],
  'img/live-betting/lb5-1.png':['g1','r5'],'img/live-betting/lb5-2.png':['r2','r4','r5'],'img/live-betting/lb5-3.png':['r2','r3'],
  'img/live-betting/lb6-1.png':['r1'],'img/live-betting/lb6-2.png':['r2','r3'],'img/live-betting/lb6-3.png':['r2'],'img/live-betting/lb6-4.png':['r2'],
  'img/my-bets-cashout/ob1.png':['g1','g2','g3','g4','r1','r2','r3','r4','r5','r6'],'img/my-bets-cashout/ob2.png':['g5'],'img/my-bets-cashout/ob3.png':['g6','g7','g8','r7'],'img/my-bets-cashout/ob4.png':['r8','r9','r10','r11'],
  'img/my-bets-cashout/ca1.png':['r1'],'img/my-bets-cashout/ca2.png':['g1','r2'],'img/my-bets-cashout/ca3.png':['g2','r3'],'img/my-bets-cashout/ca4.png':['g3','r4','r5'],
  'img/my-bets-cashout/se1.png':['r1','r2','r3'],'img/my-bets-cashout/se2.png':['g1','r4'],'img/my-bets-cashout/se3.png':['g4','r5'],'img/my-bets-cashout/se4.png':['g5','r6'],'img/my-bets-cashout/se5.png':['g2','g3','g6'],'img/my-bets-cashout/se6.png':['r7'],
  'img/casino-virtuals/c2.png':['r1','r3','r4','g2','g3','g4','g5','g6'],'img/casino-virtuals/c3.png':['r5'],'img/casino-virtuals/c4.png':['r6','g7'],'img/casino-virtuals/c5.png':['r7','r8','g1','g2'],'img/casino-virtuals/c7.png':['r9','r12'],'img/casino-virtuals/c8.png':['r10','r11'],'img/casino-virtuals/c9.png':['r13'],
  'img/casino-virtuals/v2.png':['r1','r2','r3','r4','r5','r6','g2'],'img/casino-virtuals/v4.png':['r7','g1'],'img/casino-virtuals/v6.png':['r8','g6'],'img/casino-virtuals/v7.png':['r9','g5'],'img/casino-virtuals/v9.png':['g4'],'img/casino-virtuals/v10.png':['r10'],'img/casino-virtuals/v11.png':['r11'],'img/casino-virtuals/v12.png':['g3'],'img/casino-virtuals/v13.png':['g7'],
  'img/pre-match/pm1-1.png':['g1','g2','r3','r4'],'img/pre-match/pm1-2.png':['r5','r6','g7','r8','r9'],'img/pre-match/pm1-3.png':['r10','g11','r12'],'img/pre-match/pm1-4.png':['r13','g14'],
  'img/pre-match/pm2-1.png':['g2','r1'],'img/pre-match/pm2-2.png':['g3'],'img/pre-match/pm2-3.png':['g5','r4'],'img/pre-match/pm2-4.png':['r6'],
  'img/pre-match/ps1.png':['r1','r6'],'img/pre-match/ps2.png':['r2','r5'],'img/pre-match/ps3.png':['r7'],'img/pre-match/ps4.png':['r3','r4'],
  'img/help-support/a1-1.png':['g1','g2'],'img/help-support/a1-2.png':['g3','r1'],'img/help-support/a1-3.png':['r2'],
  'img/help-support/a2-1.png':['g1','g2','r3'],'img/help-support/a2-2.png':['g3','r1'],'img/help-support/a2-3.png':['r2'],
  'img/help-support/a3-1.png':['g1','g2','r2'],'img/help-support/a3-2.png':['g3','r1','r3'],
  'img/help-support/b1-1.png':['g1','g2','g3','r1','r2'],'img/help-support/b1-2.png':['r3'],
  'img/help-support/b2-1.png':['g1','g2'],'img/help-support/b2-2.png':['r1','r2','r3'],
  'img/help-support/b3-1.png':['g1','g3','r1'],'img/help-support/b3-2.png':['g2','r2'],
};
for(const t of topics){ for(const f of t.flows){ const ims=f.subs?f.subs.flatMap(s=>s.images||[]):(f.images||[]); for(const im of ims){ if(IMG_NUMS[im.src]) im.nums=IMG_NUMS[im.src]; } } }
const payload = { snapshot: SNAPSHOT, topics: topics.map(t=>({...t, figma:FIGMA[t.name]||null, counts:topicCounts(t)})), todo: TODO, totals, laws: LAWS };
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
header.top{border-bottom:1px solid var(--line);background:linear-gradient(180deg,#10141c,#0d0f14)}
.brand{display:flex;align-items:center;gap:12px;padding:18px 0 6px}
.logo{display:flex;align-items:center;gap:11px;color:var(--ink);cursor:pointer}
.logo:hover{opacity:.82}
.bplogo{height:26px;width:auto;display:block}
.lsub{font-weight:700;font-size:15px;letter-spacing:-.2px;color:var(--mut)}
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
.flow{margin:0 0 26px;scroll-margin-top:64px}
.flow .subhead{font-size:15px;font-weight:700;color:var(--ink);margin:26px 0 12px;padding-top:16px;border-top:1px solid var(--line)}
.flow .subhead:first-child{margin-top:2px;padding-top:0;border-top:0}
.flowtabs{position:sticky;top:0;z-index:15;display:flex;gap:30px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:0 0 18px;background:var(--bg);border-bottom:1px solid var(--line)}
.flowtabs::-webkit-scrollbar{display:none}
.ftab{flex:0 0 auto;font-size:13px;font-weight:600;color:var(--mut);padding:11px 2px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;margin-bottom:-1px}
.ftab:hover{color:var(--ink)}
.ftab.active{color:var(--green2);font-weight:700;border-bottom-color:var(--green2)}
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
.law[data-law]{cursor:help}
.lawtip{position:fixed;z-index:120;max-width:300px;background:var(--panel2);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:12.5px;line-height:1.5;box-shadow:0 12px 34px rgba(0,0,0,.4);display:none}
.lawtip b{display:block;margin-bottom:4px;color:var(--green2);font-size:12px}
.empty{color:var(--mut);font-size:13px;font-style:italic;padding:6px 0}
.todo-note{color:var(--mut);font-size:14px;background:var(--panel);border:1px dashed var(--line);border-radius:12px;padding:20px}
.sumblock{margin:0 0 28px}
.sumblock h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:var(--mut);margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.about-intro{margin:2px 0 16px;font-size:14px;line-height:1.65;color:var(--ink);opacity:.92;max-width:940px}
.sumhead-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.sumhead-row h2{margin:0;padding:0;border:0;flex:0 0 auto}
.dlbtn{font-size:12px;font-weight:600;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:6px 11px;cursor:pointer}
.dlbtn:first-of-type{margin-left:auto}
.dlbtn:hover{border-color:var(--green2)}
.about-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:800px){.about-grid{grid-template-columns:1fr}}
.about-card{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:16px}
.about-card h4{margin:0 0 10px;font-size:13px;display:flex;align-items:center;gap:8px}
.about-card h4 .step{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:var(--green);color:#fff;font-size:11px;font-weight:800;flex:0 0 auto}
.about-card p{margin:0;font-size:13px;color:var(--ink);opacity:.85;line-height:1.55}
.about-list{margin:0;padding-left:18px;font-size:13px;color:var(--ink);opacity:.88;line-height:1.5}
.about-list li{margin:7px 0}
.about-card p b{opacity:1}
.sevdef{display:grid;grid-template-columns:82px 1fr;gap:10px;align-items:start;margin:8px 0;font-size:12.5px;color:var(--ink);opacity:.9}
.sevdef .sev{width:100%;text-align:center;box-sizing:border-box}
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
.lb{position:fixed;inset:0;background:rgba(3,6,12,.92);z-index:140;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:100%;max-height:92vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.lb .hint{position:fixed;top:16px;right:20px;color:#cbd3e0;font-size:12px}
.prio-row{display:flex;gap:14px;align-items:flex-start}
.prio-thumb{width:66px;height:120px;object-fit:cover;object-position:top center;border-radius:8px;border:1px solid var(--line);background:var(--panel);flex:0 0 auto}
.prio-main{flex:1;min-width:0}
.prio-list{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
.prio-list .card{margin:0}
@media(max-width:820px){.prio-list{grid-template-columns:1fr}}
.prio-clickable{cursor:pointer;transition:border-color .15s,transform .1s}
.prio-clickable:hover{border-color:var(--red)}
.prio-hint{margin-top:8px;font-size:11px;font-weight:700;color:var(--mut)}
.dlg{position:fixed;inset:0;background:rgba(3,6,12,.9);z-index:110;display:none;align-items:flex-start;justify-content:center;padding:40px 20px;overflow:auto}
.dlg.open{display:flex}
.dlg-box{background:var(--bg);border:1px solid var(--line);border-radius:16px;max-width:760px;width:100%;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.55)}
.dlg-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.prio-num{display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;padding:0 7px;border-radius:999px;color:#fff;font-weight:800;font-size:12.5px;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.prio-num.r{background:#dc2626}.prio-num.g{background:#16a34a}
.prio-numlab{font-size:11.5px;color:var(--mut);font-weight:600;margin-left:2px}
.dlg-text{font-size:15px;line-height:1.6;margin:0;color:var(--ink)}
.dlg-2col{display:flex;gap:24px;align-items:flex-start}
@media(max-width:640px){.dlg-2col{flex-direction:column;align-items:center}}
.dlg-shots{flex:0 0 300px;max-width:300px;display:flex;flex-direction:column;gap:12px}
@media(max-width:640px){.dlg-shots{flex:none;width:100%;max-width:320px}}
.dshot{margin:0}
.dshotimg{width:100%;display:block;border:1px solid var(--line);border-radius:12px;background:var(--panel);cursor:zoom-in}
.dlg-info{flex:1;min-width:0}
.dlg-topic{font-size:12px;font-weight:600;color:var(--mut);margin:0 0 14px}
.crmeta{margin-bottom:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.crtopic{font-size:11px;color:var(--ink);font-weight:600;background:var(--panel2);border:1px solid var(--line);padding:3px 9px;border-radius:999px;white-space:nowrap}
.crtopic-link{text-decoration:none;cursor:pointer;transition:border-color .15s,background .15s}
.crtopic-link:hover{border-color:var(--green2);background:var(--panel)}
.crtopic-go{color:var(--green2);font-weight:800}
.dlg-share{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}
.dlg-share .dlbtn{margin-left:0;text-decoration:none;font-size:13px;font-weight:700;padding:9px 16px;border-radius:10px;display:inline-flex;align-items:center;gap:7px;transition:filter .12s,border-color .12s,background .12s}
.dlg-share .dlbtn.primary{background:var(--green2);border-color:var(--green2);color:#fff}
.dlg-share .dlbtn.primary:hover{filter:brightness(1.06)}
.dlg-share .dlbtn.secondary{background:var(--panel);color:var(--ink)}
.dlg-share .dlbtn.secondary:hover{border-color:var(--green2);background:var(--panel2)}
.dlg-ref{margin-top:14px;font-size:12px;color:var(--mut);display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.dlg-ref-lab{font-weight:600}
.dlg-ref-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:3px 8px;color:var(--ink);cursor:pointer;word-break:break-all}
.dlg-ref-code:hover{border-color:var(--green2)}
.find-clickable{cursor:pointer;transition:transform .1s,box-shadow .15s,border-color .15s}
.find-clickable:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.10)}
.col.good .find-clickable:hover{border-color:var(--green2)}
.col.bad .find-clickable:hover{border-color:var(--red)}
footer{color:var(--mut);font-size:12px;border-top:1px solid var(--line);padding:18px 0;text-align:center}
</style></head>
<body>
<header class="top"><div class="wrap">
  <div class="brand"><div class="logo" onclick="nav('summary')" title="Back to Overview" role="link" tabindex="0"><svg class="bplogo" viewBox="0 0 250 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="betPawa"><path d="M118.479 0.205976H97.1876L89.4724 42.7891H102.51L104.783 28.9137H117.283C131.876 28.9137 132.534 15.0383 132.534 15.0383C133.969 -0.033254 118.479 0.205976 118.479 0.205976ZM120.273 13.902C120.094 18.8062 113.455 18.7464 113.455 18.7464H106.458L107.953 10.1939H115.608C120.513 10.2537 120.273 13.902 120.273 13.902Z" fill="#9CE800"/><path d="M27.9302 10.0144C27.9302 10.0144 21.1719 9.83499 17.7629 13.7823L20.2748 0.205933H7.47596L0 42.0713H12.5596L13.0381 38.3633C13.0381 38.3633 16.9256 43.0881 22.7269 42.7292C22.7269 42.7292 38.7554 42.9685 38.8152 22.6936C38.7554 22.7535 39.5329 9.95461 27.9302 10.0144ZM26.136 26.2821C25.8369 31.0069 22.6671 33.459 19.6767 33.459C16.6863 33.459 14.6529 30.8275 15.1912 26.641C15.7294 22.0956 18.7198 18.866 22.069 19.1052C27.2723 19.4042 26.136 26.2821 26.136 26.2821Z" fill="currentColor"/><path d="M70.2142 20.3013C70.2142 29.2725 57.2957 30.5285 49.5805 30.4686C49.6522 30.8995 49.7726 31.3209 49.9394 31.7246C50.7767 33.3394 52.87 33.8777 54.5446 33.9375C56.7706 33.9837 58.9845 33.5978 61.0636 32.8011C62.1354 32.3636 63.1419 31.7799 64.054 31.0667L67.7023 37.1073C67.8219 37.2867 65.1903 39.0211 65.0707 39.1408C62.9733 40.456 60.6677 41.4064 58.2526 41.9517C53.5876 43.0283 48.0255 43.2675 43.54 41.2938C42.0372 40.6253 40.7036 39.628 39.6374 38.3756C38.5713 37.1231 37.7998 35.6473 37.3798 34.0571C36.8766 32.1652 36.6351 30.2133 36.6621 28.2558C36.6621 19.2846 43.0017 10.6125 56.4584 10.6125C64.7119 10.6723 70.2142 13.7823 70.2142 20.3013ZM55.7407 17.909C51.7934 17.909 49.2217 20.9592 48.9825 25.2056C53.2288 25.0261 58.8507 23.4711 58.8507 20.421C58.7909 18.866 57.6546 17.909 55.7407 17.909Z" fill="currentColor"/><path d="M87.379 0.205933H76.9724L75.0586 10.7321H70.2142L68.5994 19.1052H73.5036L71.5299 33.8179C71.5299 33.8179 70.3936 42.6694 79.1255 42.789C87.8574 42.9086 92.4028 38.0044 92.4028 38.0044L88.4555 31.3658C88.4555 31.3658 83.0728 33.2796 83.1924 29.8706C83.3121 26.4615 84.5082 19.1052 84.5082 19.1052L91.6253 19.0454L93.1205 10.6125H85.4651L87.379 0.205933Z" fill="currentColor"/><path d="M178.765 11.0909H165.727L170.153 42.789H181.397L189.77 26.94L191.385 42.789H202.748L218.597 11.0909H204.841L198.98 27.8969L197.066 11.0909H187.437L179.662 28.6146L178.765 11.0909Z" fill="#9CE800"/><path d="M154.782 11.091L154.244 14.0216C151.232 11.7229 147.566 10.4448 143.778 10.3733C137.677 10.3733 128.407 15.3373 128.467 29.5118C128.467 37.1671 131.517 43.3273 140.847 42.8489C140.847 42.8489 145.871 42.9087 149.4 39.6193L148.802 42.7293H160.763L166.744 11.091H154.782ZM145.632 33.16C142.701 33.3394 140.608 30.8275 140.369 28.0764C140.07 24.2487 143.18 19.8827 147.187 19.5837C148.227 19.4722 149.279 19.6093 150.257 19.9835C151.234 20.3579 152.109 20.9587 152.809 21.7368L151.134 30.7079C149.617 32.1051 147.685 32.9665 145.632 33.16Z" fill="#9CE800"/><path d="M237.855 11.091L237.317 14.0216C234.305 11.7229 230.639 10.4448 226.85 10.3733C220.75 10.3733 211.48 15.3373 211.54 29.5118C211.54 37.1671 214.59 43.3273 223.92 42.8489C223.92 42.8489 228.944 42.9087 232.472 39.6193L231.874 42.7293H243.836L249.817 11.091H237.855ZM228.705 33.16C225.774 33.3394 223.681 30.8275 223.441 28.0764C223.142 24.2487 226.252 19.8827 230.26 19.5837C231.3 19.4722 232.352 19.6093 233.329 19.9835C234.307 20.3579 235.182 20.9587 235.881 21.7368L234.207 30.7079C232.685 32.0963 230.755 32.9563 228.705 33.16Z" fill="#9CE800"/></svg><span class="lsub">· UX Review Week</span></div><button id="themeBtn" class="themebtn" onclick="_toggleTheme()" title="Toggle light/dark">☀️</button></div>
  <div class="tabs" id="tabs"></div>
</div></header>
<main class="wrap" id="main"></main>
<footer class="wrap">Static snapshot · <span id="snap"></span> · Source: the reviewers' Figma "UX Findings" pages</footer>
<div class="lb" id="lb" onclick="this.classList.remove('open')"><div class="hint">click anywhere to close</div><img id="lbimg" alt=""></div>
<div id="lawtip" class="lawtip"></div>
<div class="dlg" id="dlg" onclick="if(event.target===this)_closeDlg()"><div class="dlg-box" id="dlgbox"></div></div>
<script id="data" type="application/json">__DATA__</script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
let current = 'summary', sevFilter = 'ALL', critFilter = 'ALL', flowIdx = 0;
const SEV=['CRITICAL','HIGH','MEDIUM','LOW','NIT'];
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
window._lb=function(src){const lb=document.getElementById('lb');document.getElementById('lbimg').src=src;lb.classList.add('open');};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('lb').classList.remove('open');document.getElementById('dlg').classList.remove('open');}});
function openPrio(it){var box=document.getElementById('dlgbox');
  var _bk=(it.tok||'').charAt(0)==='g'?'g':'r', _bn=(it.tok||'').slice(1);
  var _badge=_bn?'<span class="prio-num '+_bk+'">'+esc(_bn)+'</span><span class="prio-numlab">← this badge on the screen</span>':'';
  var _loc=esc(it.topic)+' · '+esc(it.flow)+(it.sub?' · '+esc(it.sub):'');
  var _sev=it.severity?'<span class="sev '+it.severity+'">'+esc(it.severity)+'</span>':'';
  var _abs=findAbs(it);
  var _ref='#/'+findPath(it);
  var _share='<div class="dlg-share"><a class="dlbtn primary" href="#/'+flowPath(it)+'" onclick="_closeDlg()">↗ Open this page</a><button class="dlbtn secondary" onclick="_copyLink('+"'"+_abs.replace(/'/g,"\\'")+"'"+',this)">🔗 Copy link</button></div>'
    +'<div class="dlg-ref"><span class="dlg-ref-lab">Direct link to this finding</span><code class="dlg-ref-code" onclick="_selText(this)" title="This link re-opens this exact finding">'+esc(_ref)+'</code></div>';
  box.innerHTML='<div class="dlg-2col"><div class="dlg-shots" id="dlgshots"></div><div class="dlg-info"><div class="dlg-head">'+_sev+(it.law?'<span class="law" data-law="'+esc(it.law)+'">'+esc(it.law)+'</span>':'')+_badge+'</div><div class="dlg-topic">'+_loc+'</div><p class="dlg-text">'+esc(it.text)+'</p>'+_share+'</div></div>';
  var sh=document.getElementById('dlgshots');(it._imgs||it.images||[]).forEach(function(im){var fig=el('figure','dshot');var img=el('img','dshotimg');img.src=im.src;img.loading='lazy';img.onclick=function(){_lb(im.src);};fig.append(img);if(im.label)fig.append(el('figcaption','shotcap',esc(im.label)));sh.append(fig);});
  document.getElementById('dlg').classList.add('open');}
window._closeDlg=function(){document.getElementById('dlg').classList.remove('open');};
function slugify(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
function hashSlug(){let h=location.hash||'';if(h[0]==='#')h=h.slice(1);if(h[0]==='/')h=h.slice(1);return h.trim();}
let pendingFlow=null, pendingFind=null;
function applyHash(){const h=hashSlug();const parts=h.split('/').filter(Boolean);if(!parts.length||parts[0]==='summary'){current='summary';pendingFlow=null;pendingFind=null;return;}const i=DATA.topics.findIndex(t=>slugify(t.name)===parts[0]);current=i>=0?i:'summary';pendingFlow=parts[1]||null;pendingFind=parts.length>=4?{flowSlug:parts[1],subSlug:parts[2],token:parts[3]}:null;}
function nav(slug){if(hashSlug()===slug){route();}else{location.hash='/'+slug;}}
function route(){applyHash();sevFilter='ALL';flowIdx=0;render();window.scrollTo(0,0);}
// shareable deep links: flow-level (open the tab) + finding-level (re-open the modal)
function flowPath(c){return slugify(c.topic)+'/'+slugify(c.flow);}
function findPath(c){return flowPath(c)+'/'+(c.sub?slugify(c.sub):'-')+'/'+(c.tok||'');}
function flowAbs(c){return location.origin+location.pathname+'#/'+flowPath(c);}
function findAbs(c){return location.origin+location.pathname+'#/'+findPath(c);}
function mkItem(topicName,flowName,subTitle,part,tok,x){var imgs=(part.images||[]).filter(function(im){return im.nums&&im.nums.indexOf(tok)>=0;});return {topic:topicName,flow:flowName,sub:subTitle||'',text:x.text,severity:x.severity||'',law:x.law||'',images:part.images||[],_imgs:imgs.length?imgs:(part.images||[]),tok:tok};}
function resolveFind(){var pf=pendingFind;pendingFind=null;var t=DATA.topics[current];if(!t||!pf)return;var flow=t.flows.filter(function(f){return slugify(f.flow)===pf.flowSlug;})[0];if(!flow)return;var part=(flow.subs&&flow.subs.length)?(pf.subSlug!=='-'?flow.subs.filter(function(s){return slugify(s.title||'')===pf.subSlug;})[0]:flow.subs[0]):flow;if(!part)return;var kind=pf.token.charAt(0),nstr=pf.token.slice(1);var arr=kind==='g'?(part.strengths||[]):(part.frictions||[]);var x=arr.filter(function(y,i){return String(y.n!=null?y.n:(i+1))===nstr;})[0];if(!x)return;openPrio(mkItem(t.name,flow.flow,part.title||'',part,pf.token,x));}
window._selText=function(e){try{var r=document.createRange();r.selectNodeContents(e);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}catch(_){}};
window._copyLink=function(url,btn){function done(){if(btn){var o=btn.textContent;btn.textContent='✓ Copied';setTimeout(function(){btn.textContent=o;},1400);}}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,done);}else{var ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();done();}};
(function(){
  function tipEl(){return document.getElementById('lawtip');}
  function descFor(name){var d=DATA.laws[name];if(!d){var f=(name.split('·')[0]||'').trim();d=DATA.laws[f];}return d;}
  function show(el){var t=tipEl();if(!t)return;var name=el.getAttribute('data-law');var d=descFor(name);if(!d){return;}t.innerHTML='<b>'+esc(name)+'</b>'+esc(d);t.style.display='block';var tw=Math.min(300,window.innerWidth-24);t.style.maxWidth=tw+'px';var r=el.getBoundingClientRect();var left=r.left;if(left+tw>window.innerWidth-12)left=window.innerWidth-12-tw;if(left<12)left=12;var th=t.offsetHeight;var top=r.bottom+8;if(top+th>window.innerHeight-12)top=r.top-8-th;t.style.left=left+'px';t.style.top=Math.max(8,top)+'px';t._for=el;}
  function hide(){var t=tipEl();if(t){t.style.display='none';t._for=null;}}
  document.addEventListener('mouseover',function(e){var el=e.target.closest?e.target.closest('.law[data-law]'):null;if(el)show(el);});
  document.addEventListener('mouseout',function(e){var el=e.target.closest?e.target.closest('.law[data-law]'):null;if(el)hide();});
  document.addEventListener('click',function(e){var el=e.target.closest?e.target.closest('.law[data-law]'):null;var t=tipEl();if(el){e.preventDefault();e.stopPropagation();if(t&&t.style.display==='block'&&t._for===el){hide();}else{show(el);}}else if(!(e.target.closest&&e.target.closest('#lawtip'))){hide();}});
  window.addEventListener('scroll',hide,true);
})();

// ---- theme: light by day, dark by night; manual toggle persists ----
(function(){const KEY='uxhub-theme';const saved=localStorage.getItem(KEY);const h=new Date().getHours();const theme=saved||((h>=7&&h<19)?'light':'dark');document.documentElement.dataset.theme=theme;})();
function paintThemeBtn(){const b=document.getElementById('themeBtn');if(b)b.textContent=document.documentElement.dataset.theme==='light'?'🌙':'☀️';}
window._toggleTheme=function(){const cur=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=cur;localStorage.setItem('uxhub-theme',cur);paintThemeBtn();};

function renderStats(){
  const s=document.getElementById('stats');
  if(!s) return;
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
  const sum=el('div','tab'+(current==='summary'?' active':''),'★ Overview');
  sum.onclick=()=>nav('summary');
  tabs.append(sum);
  DATA.topics.forEach((t,i)=>{
    const b=el('div','tab'+(i===current?' active':''),esc(t.name)+' <span class="c">'+(t.counts.s+t.counts.f)+'</span>');
    b.onclick=()=>nav(slugify(t.name));
    tabs.append(b);
  });
  DATA.todo.forEach(t=>{ tabs.append(el('div','tab todo',esc(t.name)+' <span class="c">TODO</span>')); });
}
function figLink(url){ return url?'<a class="figlink" href="'+url+'" target="_blank" rel="noopener"><span class="fi"></span>Open in Figma</a>':''; }
function renderSummary(){
  const m=document.getElementById('main'); m.innerHTML='';
  const t=DATA.totals;
  m.append(el('div','topichead','<h1>Overview</h1>'));
  // how this review was done
  const about=el('div','sumblock');
  about.append(el('p','about-intro','This is a <b>heuristic evaluation</b> — an expert walkthrough of each journey measured against the <b>Laws of UX</b> (established usability principles), rather than live user testing. It is a fast, low-cost way to surface usability issues, inconsistencies, and ideas worth discussing and prioritising across the product as it is live today. Every finding is tied to a real screen, rated by severity, and grounded in a named principle — so the result is a prioritised, evidence-based list the team can act on, not a matter of opinion.'));
  const ag=el('div','about-grid');
  ag.append(el('div','about-card','<h4><span class="step">1</span>Reviewing the flows</h4><ul class="about-list"><li>Each topic is a journey on betPawa Nigeria (mobile), walked <b>flow by flow</b>.</li><li>Key screens are captured in order, with numbered badges dropped on the UI.</li><li>Every observation is logged as a <b>🟢 strength</b> (works well) or a <b>🔴 friction / idea</b>.</li><li>Every finding traces back to a real screen.</li></ul>'));
  const sevDefs=[['CRITICAL','blocks or breaks the task, or misleads the user / loses their action'],['HIGH','significant friction — costs time or trust, but has a workaround'],['MEDIUM','a noticeable issue or inconsistency worth fixing'],['LOW','minor polish — small clarity or consistency gains'],['NIT','cosmetic, nice-to-have']];
  ag.append(el('div','about-card','<h4><span class="step">2</span>Rating severity</h4>'+sevDefs.map(d=>'<div class="sevdef"><span class="sev '+d[0]+'">'+d[0]+'</span><span>'+d[1]+'</span></div>').join('')));
  ag.append(el('div','about-card','<h4><span class="step">3</span>Assigning a Law of UX</h4><p>Every finding is tagged with the usability heuristic it relates to (from <b>lawsofux.com</b>) — e.g. Fitts’s Law, Jakob’s Law, Hick’s Law, Mental Model. The tag grounds the <b>“why”</b> in a known principle rather than opinion, and links to a short explainer.</p>'));
  about.append(ag); m.append(about);
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
    const card=el('div','tcard','<div class="tc-h"><b>'+esc(tp.name)+'</b></div>'+
      '<div class="tc-n"><span class="pill g">'+c.s+' strengths</span><span class="pill r">'+c.f+' friction</span></div>'+
      '<div class="tc-sev">'+(sev||'<span class="by" style="font-size:12px">— no severity —</span>')+'</div>');
    card.onclick=()=>nav(slugify(tp.name));
    addFig(card,tp.figma);
    grid.append(card);
  });
  DATA.todo.forEach(td=>{ const card=el('div','tcard todo','<div class="tc-h"><b>'+esc(td.name)+'</b><span class="by">TODO</span></div><div class="by" style="font-size:12px">'+esc(td.note)+'</div>'); addFig(card,td.figma); grid.append(card); });
  const gw=el('div','sumblock'); gw.append(el('h2',null,'Topics')); gw.append(grid); m.append(gw);
  // top critical across all topics
  const prio=[];
  DATA.topics.forEach(function(tp){tp.flows.forEach(function(f){
    var units=(f.subs&&f.subs.length)?f.subs.map(function(s){return {fr:s.frictions||[],images:s.images||[],sub:s.title||''};}):[{fr:f.frictions||[],images:f.images||[],sub:''}];
    units.forEach(function(u){ u.fr.forEach(function(x,i){ if(x.severity==='CRITICAL'||x.severity==='HIGH') prio.push({topic:tp.name,flow:f.flow,sub:u.sub,text:x.text,severity:x.severity,law:x.law||'',images:u.images,tok:'r'+(x.n||(i+1))}); }); });
  });});
  prio.sort((a,b)=>{
    const sv=(a.severity==='CRITICAL'?0:1)-(b.severity==='CRITICAL'?0:1);
    if(sv!==0) return sv;
    const ta=DATA.topics.findIndex(t=>t.name===a.topic), tb=DATA.topics.findIndex(t=>t.name===b.topic);
    return ta-tb;
  });
  if(prio.length){
    const cb=el('div','sumblock');
    const hr=el('div','sumhead-row'); hr.append(el('h2',null,'Top priority — Critical & High ('+prio.length+')'));
    const csvEsc=s=>{s=String(s==null?'':s);return /[",\\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
    const curRows=()=>critFilter==='ALL'?prio:prio.filter(c=>c.topic===critFilter);
    const dlcsv=el('button','dlbtn','⬇ Download CSV'); dlcsv.title='Download the critical & high issues as a spreadsheet';
    dlcsv.onclick=()=>{const r=curRows();const head=['Severity','Topic','Flow','Law of UX','Issue','Page link'];const lines=[head.join(',')].concat(r.map(c=>[c.severity,c.topic,c.flow,(c.law||'').replace(/·/g,'-'),c.text,findAbs(c)].map(csvEsc).join(',')));const blob=new Blob(['﻿'+lines.join('\\r\\n')],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='betpawa-ux-priority'+(critFilter!=='ALL'?'-'+slugify(critFilter):'')+'.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href);};
    const dlpdf=el('button','dlbtn','🖨 Download PDF'); dlpdf.title='Open a printable view — save as PDF';
    dlpdf.onclick=()=>{const r=curRows();const w=window.open('','_blank');if(!w)return;const rowsH=r.map(c=>'<tr><td class="sev '+(c.severity==='CRITICAL'?'c':'h')+'">'+esc(c.severity)+'</td><td>'+esc(c.topic)+'</td><td>'+esc(c.flow)+'</td><td>'+esc(c.law||'')+'</td><td>'+esc(c.text)+'</td><td><a href="'+esc(findAbs(c))+'">Open page ↗</a></td></tr>').join('');w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>betPawa UX — Top Priority</title><style>body{font:13px -apple-system,Arial,sans-serif;padding:28px;color:#111}h1{font-size:18px;margin:0 0 4px}p{color:#555;margin:0 0 16px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px 10px;text-align:left;vertical-align:top}th{background:#f2f2f2}.sev{font-weight:700;white-space:nowrap}.c{color:#c0392b}.h{color:#d35400}.sub{color:#777;font-weight:400}a{color:#1a73e8}@media print{body{padding:0}}</style></head><body><h1>betPawa UX Review — Top Priority (Critical &amp; High)</h1><p>'+r.length+' issues'+(critFilter!=='ALL'?' · '+esc(critFilter):'')+'</p><table><thead><tr><th>Severity</th><th>Topic</th><th>Flow</th><th>Law of UX</th><th>Issue</th><th>Page link</th></tr></thead><tbody>'+rowsH+'</tbody></table></body></html>');w.document.close();w.focus();setTimeout(function(){w.print();},350);};
    hr.append(dlcsv,dlpdf); cb.append(hr);
    const T=DATA.totals;
    cb.append(el('p','about-intro','The list below pulls together the most severe issues — <b>'+T.sev.CRITICAL+' critical</b> and <b>'+T.sev.HIGH+' high-priority</b> — from across all '+DATA.topics.length+' journeys, so the highest-impact problems sit in one place before you dive into each topic. Filter by topic with the tabs; every row shows the severity, the UX principle it breaks, where it happens, and — where a screen is available — a thumbnail you can open.'));
    const withPrio=DATA.topics.map(t=>t.name).filter(n=>prio.some(c=>c.topic===n));
    const ct=el('div','sevf');
    const list=el('div','prio-list');
    function chipEl(label,key,count){const c=el('span','chip'+(critFilter===key?' active':''),label+' <b style="opacity:.6">'+count+'</b>');c.dataset.key=key;c.onclick=()=>{critFilter=key;[...ct.children].forEach(ch=>ch.classList.toggle('active',ch.dataset.key===key));paint();};return c;}
    function paint(){ list.innerHTML=''; const shown=critFilter==='ALL'?prio:prio.filter(c=>c.topic===critFilter);
      shown.forEach(function(c){ var m=(c.images||[]).filter(function(im){return im.nums&&im.nums.indexOf(c.tok)>=0;}); c._imgs=m.length?m:(c.images||[]); var hasImg=c._imgs.length>0; const card=el('div','card bad'+(hasImg?' prio-clickable':''));
        var loc=esc(c.topic)+' · '+esc(c.flow)+(c.sub?' · '+esc(c.sub):'');
        card.innerHTML='<div class="prio-row">'+(hasImg?'<img class="prio-thumb" loading="lazy" src="'+c._imgs[0].src+'" alt="">':'')+'<div class="prio-main"><div class="crmeta"><span class="sev '+c.severity+'">'+c.severity+'</span>'+(c.law?'<span class="law" data-law="'+esc(c.law)+'">'+esc(c.law)+'</span>':'')+'<a class="crtopic crtopic-link" href="#/'+findPath(c)+'" title="Open this page">'+loc+' <span class="crtopic-go">↗</span></a></div>'+esc(c.text)+(hasImg?'<div class="prio-hint">Click to view the screen →</div>':'')+'</div></div>';
        var lk=card.querySelector('.crtopic-link'); if(lk) lk.onclick=function(e){e.stopPropagation();};
        if(hasImg) card.onclick=function(){openPrio(c);};
        list.append(card); }); }
    ct.append(chipEl('All','ALL',prio.length));
    withPrio.forEach(tn=>ct.append(chipEl(tn,tn,prio.filter(c=>c.topic===tn).length)));
    cb.append(ct); cb.append(list); paint();
    m.append(cb);
  }
}
function renderTopic(){
  const m=document.getElementById('main'); m.innerHTML='';
  const t=DATA.topics[current];
  const cStr=f=>f.subs?f.subs.flatMap(s=>s.strengths||[]):(f.strengths||[]);
  const cFr=f=>f.subs?f.subs.flatMap(s=>s.frictions||[]):(f.frictions||[]);
  const hasSev=t.flows.some(f=>cFr(f).some(x=>x.severity));
  const head=el('div','topichead','<h1>'+esc(t.name)+'</h1>'+figLink(t.figma));
  m.append(head);
  const SEVR=s=>{const i=SEV.indexOf(s);return i<0?99:i;};
  const frSort=arr=>arr.slice().sort((a,b)=>SEVR(a.severity)-SEVR(b.severity));
  const visFlows=t.flows.map((f,i)=>({f,i})).filter(o=> !(t.flows.length>1 && cStr(o.f).length===0 && cFr(o.f).length===0));
  if(pendingFlow){const pj=visFlows.findIndex(o=>slugify(o.f.flow)===pendingFlow);if(pj>=0)flowIdx=pj;pendingFlow=null;}
  if(flowIdx>=visFlows.length) flowIdx=0;
  const tabbed=visFlows.length>1;
  const tslug=slugify(t.name);
  if(tabbed){
    const ft=el('div','flowtabs');
    visFlows.forEach((o,j)=>{const p=o.f.flow.indexOf('·');const lbl=p>=0?o.f.flow.slice(p+1).trim():o.f.flow;const c=el('span','ftab'+(j===flowIdx?' active':''),esc(lbl));c.onclick=()=>{flowIdx=j;history.replaceState(null,'','#/'+tslug+'/'+slugify(o.f.flow));render();window.scrollTo(0,0);};ft.append(c);});
    m.append(ft);
  } else if(visFlows.length===1){ history.replaceState(null,'','#/'+tslug); }
  function renderBody(flow, part, flowName, subTitle){
    const frShown=frSort(part.frictions||[]);
    const strs=part.strengths||[];
    const showNum = part.numbered!==false && !!(part.images && part.images.length);
    const hasImgs = !!(part.images && part.images.length);
    const wire=(card,tok,x)=>{ if(!hasImgs) return; card.classList.add('find-clickable'); card.onclick=()=>{ openPrio(mkItem(t.name,flowName,subTitle,part,tok,x)); }; };
    if(part.images && part.images.length){
      flow.append(el('div','flowimg-cap','Annotated screens — the numbered badges map to the findings below. Click any screen to zoom, or a finding below for its detail.'));
      const w=el('div','shots');
      part.images.forEach(im=>{const fig=el('figure','shot');const img=el('img','shotimg');img.src=im.src;img.alt=esc(im.label||'');img.loading='lazy';img.onclick=()=>_lb(im.src);fig.append(img);if(im.label)fig.append(el('figcaption','shotcap',esc(im.label)));w.append(fig);});
      flow.append(w);
    }
    const cols=el('div','cols');
    const good=el('div','col good'); good.append(el('h3',null,'<span class="dot"></span>Works well'));
    if(strs.length===0) good.append(el('div','empty','—'));
    strs.forEach((s,i)=>{const inner=esc(s.text)+(s.law?'<div class="meta"><span class="law" data-law="'+esc(s.law)+'">'+esc(s.law)+'</span></div>':'');const n=s.n||(i+1);const card=el('div','card good'+(showNum?' hasnum':''), showNum?'<span class="fnum g">'+n+'</span><div class="fbody">'+inner+'</div>':inner);wire(card,'g'+n,s);good.append(card);});
    const bad=el('div','col bad'); bad.append(el('h3',null,'<span class="dot"></span>Friction / ideas'));
    if(frShown.length===0) bad.append(el('div','empty','—'));
    frShown.forEach(x=>{let meta='';if(x.severity)meta+='<span class="sev '+x.severity+'">'+x.severity+'</span>';if(x.law)meta+='<span class="law" data-law="'+esc(x.law)+'">'+esc(x.law)+'</span>';const inner=esc(x.text)+(meta?'<div class="meta">'+meta+'</div>':'');const n=x.n||((part.frictions||[]).indexOf(x)+1);const card=el('div','card bad'+(showNum?' hasnum':''), showNum?'<span class="fnum r">'+n+'</span><div class="fbody">'+inner+'</div>':inner);wire(card,'r'+n,x);bad.append(card);});
    cols.append(good,bad); flow.append(cols);
  }
  (tabbed?[visFlows[flowIdx]]:visFlows).forEach(o=>{
    const f=o.f;
    const flow=el('div','flow'); flow.id='flow-'+o.i; if(!tabbed) flow.append(el('h2',null,esc(f.flow)));
    if(f.subs && f.subs.length){ f.subs.forEach(sub=>{ if(sub.title) flow.append(el('div','subhead',esc(sub.title))); renderBody(flow,sub,f.flow,sub.title||''); }); }
    else if(f.image){ const w=el('div','flowimg-wrap');const img=el('img','flowimg');img.src=f.image;img.alt=esc(f.flow);img.loading='lazy';img.onclick=()=>_lb(f.image);w.append(img);w.append(el('div','flowimg-cap','Annotated screens — click to zoom.'));flow.append(w);const cols=el('div','cols');const good=el('div','col good');good.append(el('h3',null,'<span class="dot"></span>Works well'));if(!f.strengths.length)good.append(el('div','empty','—'));f.strengths.forEach((s,i)=>{const inner=esc(s.text)+(s.law?'<div class="meta"><span class="law" data-law="'+esc(s.law)+'">'+esc(s.law)+'</span></div>':'');good.append(el('div','card good',inner));});const bad=el('div','col bad');bad.append(el('h3',null,'<span class="dot"></span>Friction / ideas'));frSort(f.frictions).forEach(x=>{let meta='';if(x.severity)meta+='<span class="sev '+x.severity+'">'+x.severity+'</span>';if(x.law)meta+='<span class="law" data-law="'+esc(x.law)+'">'+esc(x.law)+'</span>';bad.append(el('div','card bad',esc(x.text)+(meta?'<div class="meta">'+meta+'</div>':'')));});cols.append(good,bad);flow.append(cols); }
    else { renderBody(flow,f,f.flow,''); }
    m.append(flow);
  });
}
function render(){renderTabs(); if(current==='summary') renderSummary(); else {renderTopic(); if(pendingFind) resolveFind();} paintThemeBtn();}
renderStats();window.addEventListener('hashchange',route);route();
</script>
</body></html>`;

fs.writeFileSync(new URL('./index.html', import.meta.url), html.replace('__DATA__', JSON.stringify(payload)));
console.log('Built index.html + data.json  ·  topics:', topics.length, '· strengths:', totals.s, '· friction:', totals.f, '· critical:', totals.sev.CRITICAL);
