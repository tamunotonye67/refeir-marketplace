export interface SurveyOption {
  id: string;
  letter: string;
  text: string;
  subtext: string;
}

export interface SurveyQuestionDef {
  id: string;
  category: string;
  title: string;
  scenario: string;
  question: string;
  options: SurveyOption[];
  notePlaceholder: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. TECHNOLOGY & CORE PROTOCOL SQUAD (10 QUESTIONS)
// ══════════════════════════════════════════════════════════════════════════════
const TECHNOLOGY_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'tech_1',
    category: 'Architecture & Ambiguity',
    title: 'Navigating Incomplete Backend Specifications',
    scenario: 'You are implementing an asynchronous payout webhook integration due in 48 hours. The third-party payment gateway documentation is incomplete regarding retry-idempotency headers, and your lead architect is traveling.',
    question: 'How do you structure your implementation to avoid blocking sprint delivery while guarding against double-credit bugs?',
    options: [
      {
        id: 't1_a', letter: 'A',
        text: 'Implement an in-memory or database idempotency-key table with strict distributed lock verification, document your exact edge-case assumptions in an architectural briefing, and build the MVP against that standard.',
        subtext: 'You unblock execution with defensive engineering while preparing clean documentation for review.'
      },
      {
        id: 't1_b', letter: 'B',
        text: 'Halt all coding until the architect returns to prevent any risk of non-conforming architecture.',
        subtext: 'You prioritize safety over momentum, taking zero initiative.'
      },
      {
        id: 't1_c', letter: 'C',
        text: 'Ship a basic endpoint without idempotency guards and assume payment webhooks won’t duplicate during the staging demo.',
        subtext: 'You gamble with transactional integrity under delivery pressure.'
      },
      {
        id: 't1_d', letter: 'D',
        text: 'Refactor the entire repository to an unfamiliar library you saw on Twitter without informing the team.',
        subtext: 'You introduce massive unreviewed architectural drift.'
      }
    ],
    notePlaceholder: 'Briefly explain your architectural trade-offs (optional)...'
  },
  {
    id: 'tech_2',
    category: 'Production Crisis & Ethics',
    title: 'The Pre-Release Concurrency Flaw',
    scenario: 'Ninety minutes before a live demo to institutional enterprise partners, load-testing reveals a race condition where two simultaneous referral claims can occasionally reward duplicate bounty tokens. Nobody else has spotted it.',
    question: 'What is your immediate response?',
    options: [
      {
        id: 't2_a', letter: 'A',
        text: 'Immediately alert the demo presenter and squad lead, apply a safe mutex constraint or isolate the live payout button with a mock ledger for the demo, and schedule a permanent transactional atomic lock fix immediately after.',
        subtext: 'Radical transparency and platform integrity are non-negotiable.'
      },
      {
        id: 't2_b', letter: 'B',
        text: 'Stay silent and pray the presenter does not click the bounty claim twice in rapid succession.',
        subtext: 'Hoping for luck in production is a reckless gamble.'
      },
      {
        id: 't2_c', letter: 'C',
        text: 'Silently delete the load test logs so the build pipeline passes green.',
        subtext: 'Active concealment of critical platform vulnerabilities.'
      },
      {
        id: 't2_d', letter: 'D',
        text: 'Blame the previous junior developer who touched the schema and demand the demo be canceled.',
        subtext: 'Deflecting personal accountability and creating team panic.'
      }
    ],
    notePlaceholder: 'What principles guide your production incident handling? (optional)...'
  },
  {
    id: 'tech_3',
    category: 'Technical Debt vs Speed',
    title: 'The "Quick-and-Dirty" Patch Dilemma',
    scenario: 'A high-impact enterprise partner requests an immediate custom CSV export feature by tomorrow morning. A proper modular service will take 2 days, while a hardcoded SQL query inside the client controller can be hacked in 2 hours.',
    question: 'How do you navigate this trade-off?',
    options: [
      {
        id: 't3_a', letter: 'A',
        text: 'Build a lightweight sanitized query service separated from UI logic, write a regression test for authorization leakage, and file a tracked technical debt ticket for full pagination in the next sprint.',
        subtext: 'You balance immediate business utility with essential security and separation of concerns.'
      },
      {
        id: 't3_b', letter: 'B',
        text: 'Paste raw unescaped SQL directly into the frontend view controller and never document it.',
        subtext: 'You introduce severe SQL injection risks and fragile unmaintainable code.'
      },
      {
        id: 't3_c', letter: 'C',
        text: 'Flatly refuse the request and lecture the client on agile software engineering purity.',
        subtext: 'Zero business empathy and rigid hostility to client deadlines.'
      },
      {
        id: 't3_d', letter: 'D',
        text: 'Tell the client it is done without implementing it and hope they don’t click the download link.',
        subtext: 'Fraudulent reporting of deliverable status.'
      }
    ],
    notePlaceholder: 'How do you manage technical debt in fast-moving startups? (optional)...'
  },
  {
    id: 'tech_4',
    category: 'Code Review & Humility',
    title: 'The Disputed Pull Request',
    scenario: 'You spent 3 days crafting a complex state management architecture. A peer reviewer submits 15 critical comments arguing your state pattern is overly convoluted and recommends standardizing on simpler compound hooks.',
    question: 'How do you resolve this review stalemate?',
    options: [
      {
        id: 't4_a', letter: 'A',
        text: 'Review their benchmark concerns objectively, schedule a 15-minute pairing session to compare maintainability and bundle size, and champion whichever design makes the codebase easiest for the whole squad to extend.',
        subtext: 'Ego detached from code; relentless focus on developer ergonomics and project longevity.'
      },
      {
        id: 't4_b', letter: 'B',
        text: 'Reject all comments, declare the reviewer lacks architectural depth, and push your branch regardless.',
        subtext: 'Defensive arrogance that fractures squad trust.'
      },
      {
        id: 't4_c', letter: 'C',
        text: 'Silently approve and merge your own pull request using administrative privileges.',
        subtext: 'Breach of engineering governance and peer accountability.'
      },
      {
        id: 't4_d', letter: 'D',
        text: 'Delete the branch entirely and refuse to work on frontend components again.',
        subtext: 'Emotional overreaction that damages team delivery.'
      }
    ],
    notePlaceholder: 'How do you process critical technical feedback? (optional)...'
  },
  {
    id: 'tech_5',
    category: 'Security & Data Privacy',
    title: 'The Accidental API Credential Exposure',
    scenario: 'While reviewing a colleague’s recent commit, you notice they mistakenly committed a live Supabase Service Role Key or Stripe Secret Key into a public feature branch.',
    question: 'What is your immediate protocol?',
    options: [
      {
        id: 't5_a', letter: 'A',
        text: 'Immediately notify the squad lead and the author, invalidate and rotate the leaked key in the provider dashboard, remove the secret from git history using git filter-branch or BFG, and audit access logs for unauthorized traffic.',
        subtext: 'Swift, complete security containment prioritizing system safety over etiquette.'
      },
      {
        id: 't5_b', letter: 'B',
        text: 'Leave a mild comment on GitHub and wait for the author to notice whenever they wake up.',
        subtext: 'Passive response that leaves production keys exposed to scrapers.'
      },
      {
        id: 't5_c', letter: 'C',
        text: 'Ignore it because it is not your repository branch.',
        subtext: 'Bystander apathy in critical security incidents.'
      },
      {
        id: 't5_d', letter: 'D',
        text: 'Post the leaked key in a public WhatsApp community group to mock the developer.',
        subtext: 'Malicious endangerment of company infrastructure.'
      }
    ],
    notePlaceholder: 'Share your perspective on security hygiene (optional)...'
  },
  {
    id: 'tech_6',
    category: 'Network Resilience & Low-Bandwidth',
    title: 'Optimizing for African Infrastructure Realities',
    scenario: 'Refeir users in several African cities experience high mobile data costs and spotty 3G/EDGE connectivity. Your dashboard bundle size has grown to 4.2 MB, causing slow 12-second load times on budget mobile devices.',
    question: 'How do you address this performance bottleneck?',
    options: [
      {
        id: 't6_a', letter: 'A',
        text: 'Audit bundle dependencies with webpack-bundle-analyzer, implement route-level dynamic code splitting, convert heavy uncompressed images to WebP/AVIF, and add optimistic offline caching with Service Workers.',
        subtext: 'Engineering for the actual lived constraints of African builders.'
      },
      {
        id: 't6_b', letter: 'B',
        text: 'Do nothing and assume all real developers have high-speed 5G or fiber optic connections.',
        subtext: 'Detached elitism out of touch with target demographics.'
      },
      {
        id: 't6_c', letter: 'C',
        text: 'Add an animated spinner that runs for 12 seconds so users think the app is thinking hard.',
        subtext: 'Superficial aesthetic bandage masking catastrophic performance.'
      },
      {
        id: 't6_d', letter: 'D',
        text: 'Tell users to purchase high-end iPhones if they want to use Refeir smoothly.',
        subtext: 'Exclusionary mindset counter to Refeir’s sovereign mission.'
      }
    ],
    notePlaceholder: 'How do you design systems for bandwidth and latency constraints? (optional)...'
  },
  {
    id: 'tech_7',
    category: 'Ecosystem Vouching & Talent Referral',
    title: 'The Specialized Smart Contract Bounties',
    scenario: 'An enterprise client offers a $4,000 bounty on Refeir for an EVM/Solidity escrow contract. You have basic Solidity knowledge, but you know another Pioneer in the Tech squad is a verified smart contract security auditor.',
    question: 'What is your action?',
    options: [
      {
        id: 't7_a', letter: 'A',
        text: 'Enthusiastically vouch for and refer your peer for the lead smart-contract implementation, assist them with backend API integration and test coverage, and share in the ecosystem’s referral tier and long-term reputational trust.',
        subtext: 'You recognize that putting the best person on high-risk tasks protects client funds and grows the entire network.'
      },
      {
        id: 't7_b', letter: 'B',
        text: 'Take the contract alone and copy-paste unverified code from ChatGPT without auditing it.',
        subtext: 'Greed that puts platform security and escrow funds at risk.'
      },
      {
        id: 't7_c', letter: 'C',
        text: 'Sign the contract under your name and secretly sub-contract it to the peer for $1,500 without their knowledge of the true fee.',
        subtext: 'Exploitative middleman rent-seeking counter to Refeir’s ethos.'
      },
      {
        id: 't7_d', letter: 'D',
        text: 'Block the client from contacting the peer so they cannot take any gigs from you.',
        subtext: 'Toxic territorialism that strangles platform liquidity.'
      }
    ],
    notePlaceholder: 'How do you evaluate ecosystem value vs individual fee? (optional)...'
  },
  {
    id: 'tech_8',
    category: 'Testing & Reliability',
    title: 'The Untested Hotfix Dilemma',
    scenario: 'A bug in task submission prevents 15 pioneers from submitting proofs on deadline night. A quick 3-line regex hotfix resolves it in local testing, but running the full automated integration test suite takes 25 minutes.',
    question: 'How do you safely ship this resolution?',
    options: [
      {
        id: 't8_a', letter: 'A',
        text: 'Run a targeted unit test specifically for the regex edge-cases, deploy to the staging environment for a 5-minute sanity verification, and monitor live Sentry logs during deployment to catch regressions immediately.',
        subtext: 'Pragmatic urgency combined with disciplined sanity verification.'
      },
      {
        id: 't8_b', letter: 'B',
        text: 'SSH directly into production and edit the minified JavaScript bundle live on the server without any git commit.',
        subtext: 'Cowboy coding that guarantees future server desync and outages.'
      },
      {
        id: 't8_c', letter: 'C',
        text: 'Wait until tomorrow morning and let the deadline expire for the 15 contributors.',
        subtext: 'Lack of empathy for contributors whose livelihoods depend on bounty proofs.'
      },
      {
        id: 't8_d', letter: 'D',
        text: 'Disable all error logging in production so errors don’t trigger alerts.',
        subtext: 'Willful blindness to live production failure.'
      }
    ],
    notePlaceholder: 'How do you balance rapid hotfixes with automated safeguards? (optional)...'
  },
  {
    id: 'tech_9',
    category: 'Documentation & Knowledge Sovereignty',
    title: 'The Silent Architecture Commit',
    scenario: 'You built a novel real-time notification engine using WebSockets and Redis pub/sub. It works flawlessly, but nobody else on the squad understands how the channel authentication lifecycle works.',
    question: 'What is your responsibility before closing the task?',
    options: [
      {
        id: 't9_a', letter: 'A',
        text: 'Author a clean architectural markdown guide in the docs directory, include an ASCII/Mermaid sequence diagram, document environment variables, and host a 10-minute squad walkthrough to empower peers.',
        subtext: 'True senior craftsmanship leaves behind zero proprietary knowledge silos.'
      },
      {
        id: 't9_b', letter: 'B',
        text: 'Keep the system undocumented so you become irreplaceable and impossible to fire or replace.',
        subtext: 'Insecure gatekeeping that makes you an organizational liability.'
      },
      {
        id: 't9_c', letter: 'C',
        text: 'Write a one-line comment reading "it works, do not touch" and move on.',
        subtext: 'Unprofessional neglect of team maintainability.'
      },
      {
        id: 't9_d', letter: 'D',
        text: 'Delete the test fixtures so other engineers cannot run audits against your code.',
        subtext: 'Malicious obfuscation.'
      }
    ],
    notePlaceholder: 'How do you maintain documentation hygiene? (optional)...'
  },
  {
    id: 'tech_10',
    category: 'Engineering Philosophy & Reflection',
    title: 'The Sovereign Standard of Code',
    scenario: 'In decentralized engineering ecosystems, code is law, execution is verifiable, and there is no middle management checking your screen hours.',
    question: 'In your own words: what standard of engineering craftsmanship do you hold yourself to when nobody is auditing your commits, and how do you ensure the software you build creates enduring sovereign wealth for African builders?',
    options: [],
    notePlaceholder: 'Type your qualitative technical reflection here (minimum 30 characters)... Share how you approach architecture, error handling, security, and your personal standard of excellence.'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// 2. GROWTH & NETWORK SPRINTS SQUAD (10 QUESTIONS)
// ══════════════════════════════════════════════════════════════════════════════
const GROWTH_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'growth_1',
    category: 'Acquisition vs Retention',
    title: 'The High-Dropoff Signup Spike',
    scenario: 'A recent campus influencer campaign drove 3,000 new account signups in 72 hours, but Day-7 retention analytics show that 85% of them never submitted an application or linked a portfolio.',
    question: 'How do you diagnose and solve this growth bottleneck?',
    options: [
      {
        id: 'g1_a', letter: 'A',
        text: 'Map the full onboarding funnel drop-off points, interview 10 dropped-off users to pinpoint friction, and implement a targeted activation loop with WhatsApp onboarding sprints and portfolio teardowns.',
        subtext: 'Rigorous data-driven funnel optimization focused on true activation over vanity metrics.'
      },
      {
        id: 'g1_b', letter: 'B',
        text: 'Double down on the same influencer ads to brute-force another 5,000 low-intent signups.',
        subtext: 'Burning budget on an unpatched leaky bucket.'
      },
      {
        id: 'g1_c', letter: 'C',
        text: 'Blame the engineering team for having a form with more than two input fields.',
        subtext: 'Deflecting growth responsibility onto other squads.'
      },
      {
        id: 'g1_d', letter: 'D',
        text: 'Hide the retention chart from the weekly metrics report to present a misleading success story.',
        subtext: 'Fraudulent reporting of key performance indicators.'
      }
    ],
    notePlaceholder: 'Share your approach to activation and cohort retention (optional)...'
  },
  {
    id: 'growth_2',
    category: 'Referral Integrity & Fraud',
    title: 'The Synthetic Referral Ring',
    scenario: 'You notice an applicant account has referred 42 new "users" in 4 hours, claiming the top spot on the referral sprint leaderboard. Quick verification shows all referred emails originate from temporary disposable domains.',
    question: 'How do you handle this growth anomaly?',
    options: [
      {
        id: 'g2_a', letter: 'A',
        text: 'Flag the suspicious cluster for immediate administrative review, collaborate with Tech to block disposable email domains, disqualify the fraudulent entries, and protect the legitimacy of honest contributors.',
        subtext: 'Upholding strict meritocracy and protecting community incentive pools.'
      },
      {
        id: 'g2_b', letter: 'B',
        text: 'Count them anyway because it makes the monthly growth graph look parabolic.',
        subtext: 'Compromising platform integrity for fake vanity numbers.'
      },
      {
        id: 'g2_c', letter: 'C',
        text: 'Privately contact the fraudster and ask them to share their bot scripts.',
        subtext: 'Complicity in exploiting platform bounty reserves.'
      },
      {
        id: 'g2_d', letter: 'D',
        text: 'Shut down the entire referral program for all genuine contributors without investigating.',
        subtext: 'Knee-jerk punishment of honest community builders.'
      }
    ],
    notePlaceholder: 'How do you protect viral growth loops from manipulation? (optional)...'
  },
  {
    id: 'growth_3',
    category: 'Authentic Storytelling vs Hype',
    title: 'The Exaggerated Earnings Dilemma',
    scenario: 'A marketing teammate proposes running social media ads promising "Earn $2,000 every week working 2 hours on your phone" to drive massive clicks from desperate job seekers.',
    question: 'What is your position on this campaign?',
    options: [
      {
        id: 'g3_a', letter: 'A',
        text: 'Reject the campaign firmly; champion authentic proof-of-work marketing spotlighting real verified projects, transparent skill tiers, and the dignified craftsmanship required to earn sustainably on Refeir.',
        subtext: 'Refeir is built on sovereign trust, not predatory get-rich-quick scams.'
      },
      {
        id: 'g3_b', letter: 'B',
        text: 'Approve the ad copy because high click-through rates are all that matters for growth.',
        subtext: 'Attracting low-intent, disillusioned users and poisoning brand credibility.'
      },
      {
        id: 'g3_c', letter: 'C',
        text: 'Stay quiet and let them run it so you can blame them if it backfires.',
        subtext: 'Passive avoidance of leadership and brand protection.'
      },
      {
        id: 'g3_d', letter: 'D',
        text: 'Increase the fake number to $5,000 to get even more clicks.',
        subtext: 'Deliberate escalation of deceptive marketing.'
      }
    ],
    notePlaceholder: 'How do you build high-trust brand equity in competitive markets? (optional)...'
  },
  {
    id: 'growth_4',
    category: 'Channel Saturation & Innovation',
    title: 'The Exhausted Community Broadcast Loop',
    scenario: 'Your WhatsApp community broadcast channels, which once generated 40% of applicant conversions, have seen click-through rates decline by 65% over the past 6 weeks as members grow numb to repetitive link drops.',
    question: 'How do you revitalize community acquisition?',
    options: [
      {
        id: 'g4_a', letter: 'A',
        text: 'Shift from one-way broadcasting to interactive value-first experiences: live portfolio teardown sessions, bounty speedruns, and peer vouching challenges that reward active engagement.',
        subtext: 'Transforming passive broadcast fatigue into high-energy peer collaboration.'
      },
      {
        id: 'g4_b', letter: 'B',
        text: 'Spam the broadcast list 5 times a day with ALL CAPS text and urgent siren emojis.',
        subtext: 'Accelerating group muting and mass unsubscriptions.'
      },
      {
        id: 'g4_c', letter: 'C',
        text: 'Scrape phone numbers from competing tech groups and add them without consent.',
        subtext: 'Violating spam laws, privacy ethics, and provoking bans.'
      },
      {
        id: 'g4_d', letter: 'D',
        text: 'Give up on community growth and declare that WhatsApp is completely dead.',
        subtext: 'Premature resignation without attempting creative distribution.'
      }
    ],
    notePlaceholder: 'Share your tactics for re-engaging saturated channels (optional)...'
  },
  {
    id: 'growth_5',
    category: 'Competitive Differentiation',
    title: 'Competing with Deep-Pocket Legacy Gig Boards',
    scenario: 'An established international freelance platform launches a $100,000 ad blitz in Lagos and Nairobi with zero platform fees for 3 months to capture top local talent.',
    question: 'How should Refeir position its growth messaging in response?',
    options: [
      {
        id: 'g5_a', letter: 'A',
        text: 'Double down on Refeir’s sovereign differentiators: high-trust peer vouching, direct referral equity royalties, transparent milestone escrows in local currencies, and lifelong community equity.',
        subtext: 'Competing on structural ownership and dignity rather than fleeting subsidies.'
      },
      {
        id: 'g5_b', letter: 'B',
        text: 'Try to match their venture-backed ad spending dollar for dollar until we run out of cash.',
        subtext: 'Financial suicide against deep-pocketed competitors.'
      },
      {
        id: 'g5_c', letter: 'C',
        text: 'Post disparaging fake reviews on the competitor’s Google Play store page.',
        subtext: 'Unethical sabotage that degrades Refeir’s reputation.'
      },
      {
        id: 'g5_d', letter: 'D',
        text: 'Tell our pioneers to join the competitor since they have more money.',
        subtext: 'Total surrender and abandonment of the mission.'
      }
    ],
    notePlaceholder: 'How do you position sovereign communities against corporate incumbents? (optional)...'
  },
  {
    id: 'growth_6',
    category: 'Campus Node Mobilization',
    title: 'Activating Dormant University Nodes',
    scenario: 'Three university campuses have registered campus ambassador chapters, but zero student task proofs have been submitted in the last 30 days.',
    question: 'How do you re-ignite student contributor velocity?',
    options: [
      {
        id: 'g6_a', letter: 'A',
        text: 'Host a structured 48-hour "Bounty Sprint" with clear beginner task packages, pair freshman builders with senior Pioneer mentors, and publicly celebrate the first students to earn task payouts.',
        subtext: 'Lowering the psychological barrier to entry through structured momentum.'
      },
      {
        id: 'g6_b', letter: 'B',
        text: 'Threaten to ban all students from the campus if they do not complete a task by Friday.',
        subtext: 'Coercive leadership that destroys genuine enthusiasm.'
      },
      {
        id: 'g6_c', letter: 'C',
        text: 'Falsify completed tasks in the database so the campus appears active on the map.',
        subtext: 'Data fabrication that erodes internal decision-making.'
      },
      {
        id: 'g6_d', letter: 'D',
        text: 'Close the chapters entirely and ignore student talent.',
        subtext: 'Throwing away critical grassroots pipeline.'
      }
    ],
    notePlaceholder: 'How do you motivate student builders to take action? (optional)...'
  },
  {
    id: 'growth_7',
    category: 'Cross-Squad Sprints',
    title: 'The Growth vs Engineering Bottleneck',
    scenario: 'The Growth squad needs a custom viral referral landing page by Friday for a major tech summit, but the Tech squad has locked its sprint for security updates and refuses unplanned requests.',
    question: 'How do you resolve this operational tension?',
    options: [
      {
        id: 'g7_a', letter: 'A',
        text: 'Propose a collaborative compromise: build a high-converting lightweight static page using existing design tokens, conduct QA testing internally, and request only a 20-minute DNS/routing review from Tech.',
        subtext: 'Resourceful cross-functional ownership that respects engineering bandwidth.'
      },
      {
        id: 'g7_b', letter: 'B',
        text: 'Complain publicly in the all-hands Slack channel that developers hate growth and are sabotaging the company.',
        subtext: 'Destructive inter-team hostility.'
      },
      {
        id: 'g7_c', letter: 'C',
        text: 'Cancel the summit campaign entirely and blame the developers for lost revenue.',
        subtext: 'Victim mentality without searching for tactical workarounds.'
      },
      {
        id: 'g7_d', letter: 'D',
        text: 'Secretly buy an external WordPress template and route traffic to a disconnected third-party domain.',
        subtext: 'Fragmenting user data and undermining platform security.'
      }
    ],
    notePlaceholder: 'How do you navigate cross-departmental friction? (optional)...'
  },
  {
    id: 'growth_8',
    category: 'Referral Psychology & Vouching',
    title: 'The High-Value Peer Recommendation',
    scenario: 'A growth campaign uncovers a brilliant product designer who is hesitant to apply because she is burned out by traditional freelance bidding platforms.',
    question: 'How do you articulate Refeir’s proposition to win her over?',
    options: [
      {
        id: 'g8_a', letter: 'A',
        text: 'Explain that Refeir replaces demeaning bidding wars with peer-vouched meritocracy: once admitted, she receives direct curated task bounties, verified credential attribution, and perpetual referral rewards.',
        subtext: 'Appealing to dignity, professional respect, and long-term economic alignment.'
      },
      {
        id: 'g8_b', letter: 'B',
        text: 'Tell her she has no other choice if she wants to survive in the African market.',
        subtext: 'Condescending and tone-deaf communication.'
      },
      {
        id: 'g8_c', letter: 'C',
        text: 'Offer to write her application and fake her portfolio links for her.',
        subtext: 'Subverting admissions integrity.'
      },
      {
        id: 'g8_d', letter: 'D',
        text: 'Ignore her and look for someone less experienced who asks fewer questions.',
        subtext: 'Settling for mediocrity over recruiting top-tier excellence.'
      }
    ],
    notePlaceholder: 'How do you communicate Refeir’s ethos to elite talent? (optional)...'
  },
  {
    id: 'growth_9',
    category: 'Metrics & Data Discipline',
    title: 'The Misleading Conversion Report',
    scenario: 'Your monthly analytics dashboard shows a 400% surge in website visitors, but actual accepted Pioneer applications remained completely flat.',
    question: 'How do you present this reality to leadership?',
    options: [
      {
        id: 'g9_a', letter: 'A',
        text: 'Present the brutal truth transparently: celebrate top-of-funnel reach, but dissect the exact qualification drop-off, analyze applicant friction, and present a clear 3-point remediation plan.',
        subtext: 'Intellectual honesty and accountability earn enduring executive respect.'
      },
      {
        id: 'g9_b', letter: 'B',
        text: 'Highlight only the 400% visitor graph with confetti and avoid mentioning the zero conversion impact.',
        subtext: 'Intellectual dishonesty that misleads strategic decisions.'
      },
      {
        id: 'g9_c', letter: 'C',
        text: 'Alter the conversion numbers on the slides and hope nobody verifies database records.',
        subtext: 'Direct professional fraud.'
      },
      {
        id: 'g9_d', letter: 'D',
        text: 'Blame the admissions committee for being "too picky" about applicant quality.',
        subtext: 'Refusing to accept responsibility for poorly targeted traffic.'
      }
    ],
    notePlaceholder: 'What does data integrity mean to you in growth? (optional)...'
  },
  {
    id: 'growth_10',
    category: 'Growth Philosophy & Reflection',
    title: 'The Sovereign Growth Standard',
    scenario: 'Growth in Refeir is not about algorithmic manipulation or deceptive clickbait. It is about building an organic economic movement across the African continent.',
    question: 'In your own words: what is your philosophy of organic viral growth, how do you balance rapid acquisition with high user quality, and what unique growth engine will you build for Refeir?',
    options: [],
    notePlaceholder: 'Type your qualitative growth reflection here (minimum 30 characters)... Share how you think through virality, retention, community psychology, and your standard of excellence.'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// 3. CREATIVE, MEDIA & IDENTITY SQUAD (10 QUESTIONS)
// ══════════════════════════════════════════════════════════════════════════════
const CREATIVE_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'crt_1',
    category: 'Design Systems & Brand Identity',
    title: 'The Inconsistent Component Creep',
    scenario: 'A developer implements a new landing page feature using non-brand neon purples, random 17px font sizes, and unaligned border radii that break Refeir’s deep green sovereign design tokens.',
    question: 'How do you address this design deviation?',
    options: [
      {
        id: 'c1_a', letter: 'A',
        text: 'Conduct a supportive design-QA review, provide the exact Figma token variables and CSS custom properties (RF_DEEP_GREEN, RF_MINT_ACCENT, 8px grid), and pair with the developer to polish the implementation.',
        subtext: 'Constructive design systems stewardship that bridges design and code.'
      },
      {
        id: 'c1_b', letter: 'B',
        text: 'Post a public screenshot on Twitter mocking the developer’s eye for aesthetics.',
        subtext: 'Hostile behavior that shatters cross-squad collaboration.'
      },
      {
        id: 'c1_c', letter: 'C',
        text: 'Ignore it because coding is not the designer’s problem.',
        subtext: 'Abandoning brand quality control in production.'
      },
      {
        id: 'c1_d', letter: 'D',
        text: 'Redesign the entire brand identity overnight around their neon purple mistakes.',
        subtext: 'Reactive chaos that dismantles established visual recognition.'
      }
    ],
    notePlaceholder: 'How do you enforce design system consistency? (optional)...'
  },
  {
    id: 'crt_2',
    category: 'Authentic Craft vs AI Slop',
    title: 'The Generic AI Generation Temptation',
    scenario: 'You are tasked with creating 6 illustrations celebrating African freelancers for the homepage. Due to tight deadlines, a squad member suggests generating generic Midjourney/DALL-E images with weird fingers and stereotypical tropes.',
    question: 'How do you respond?',
    options: [
      {
        id: 'c2_a', letter: 'A',
        text: 'Insist on authentic visual representation: create bespoke vector artwork or direct real photography featuring genuine African builders, celebrating modern tech hubs, real workspaces, and dignified sovereign craftsmanship.',
        subtext: 'Protecting the brand from soulless visual clichés and lazy AI artifacts.'
      },
      {
        id: 'c2_b', letter: 'B',
        text: 'Accept the generic AI images with deformed hands because nobody will look closely anyway.',
        subtext: 'Compromising craftsmanship and conveying amateurism to enterprise partners.'
      },
      {
        id: 'c2_c', letter: 'C',
        text: 'Download watermarked images from Google Images and paste them in the repo.',
        subtext: 'Copyright infringement and legal liability.'
      },
      {
        id: 'c2_d', letter: 'D',
        text: 'Refuse to provide any visuals and leave the section completely blank.',
        subtext: 'Obstinate abandonment of squad deliverables.'
      }
    ],
    notePlaceholder: 'How do you balance modern AI tools with authentic human craftsmanship? (optional)...'
  },
  {
    id: 'crt_3',
    category: 'Vague Creative Briefs',
    title: 'Designing for "World-Class Elegance"',
    scenario: 'The product leadership requests a hero banner design with the brief: "Make it look like Apple meets sovereign African Wakanda, ultra-clean and futuristic, deliver in 24 hours."',
    question: 'How do you deconstruct this ambiguous creative mandate?',
    options: [
      {
        id: 'c3_a', letter: 'A',
        text: 'Create a quick 3-direction moodboard highlighting typography, lighting, and geometric African motif references, confirm the preferred aesthetic archetype within 2 hours, and build the chosen direction with high velocity.',
        subtext: 'Translating subjective buzzwords into concrete visual alignment before wasting design cycles.'
      },
      {
        id: 'c3_b', letter: 'B',
        text: 'Spend 20 hours working in total secrecy on a design you hope they might like.',
        subtext: 'High-risk isolation that often leads to total creative misalignment.'
      },
      {
        id: 'c3_c', letter: 'C',
        text: 'Complain that leadership has no idea what they want and refuse to start.',
        subtext: 'Paralyzed by ambiguity instead of exercising creative leadership.'
      },
      {
        id: 'c3_d', letter: 'D',
        text: 'Copy the stripe.com homepage pixel-for-pixel and change the logo.',
        subtext: 'Blatant plagiarism that destroys brand uniqueness.'
      }
    ],
    notePlaceholder: 'How do you clarify ambiguous creative direction? (optional)...'
  },
  {
    id: 'crt_4',
    category: 'Accessibility & Low-End Devices',
    title: 'The High-Performance UI Conflict',
    scenario: 'You designed a breathtaking 3D WebGL hero interaction with particle physics. Testing shows it crashes Android mobile browsers with less than 3GB RAM (common among campus applicants).',
    question: 'What is your creative compromise?',
    options: [
      {
        id: 'c4_a', letter: 'A',
        text: 'Design a progressive enhancement strategy: implement an ultra-lightweight CSS/SVG animated fallback that loads instantly on budget mobile devices, while serving the rich WebGL centerpiece on capable hardware.',
        subtext: 'World-class visual beauty that never sacrifices universal accessibility.'
      },
      {
        id: 'c4_b', letter: 'B',
        text: 'Keep the heavy WebGL experience and force low-end phone users to deal with crashing.',
        subtext: 'Excluding the very talent Refeir is founded to empower.'
      },
      {
        id: 'c4_c', letter: 'C',
        text: 'Delete all visual design from the website and make everything plain unstyled text.',
        subtext: 'Surrendering aesthetic ambition out of frustration.'
      },
      {
        id: 'c4_d', letter: 'D',
        text: 'Blame the users for owning budget smartphones.',
        subtext: 'Contempt for the primary audience.'
      }
    ],
    notePlaceholder: 'How do you design for aesthetic elegance and performance? (optional)...'
  },
  {
    id: 'crt_5',
    category: 'Critique & Intellectual Humility',
    title: 'The Rejected Concept Direction',
    scenario: 'You invested 3 days into a radical editorial brand concept. During executive squad review, the founder and team leads explain that while beautiful, it feels too much like an art magazine and fails to convert enterprise clients.',
    question: 'How do you handle this critique?',
    options: [
      {
        id: 'c5_a', letter: 'A',
        text: 'Listen intently to the business rationale, extract the successful typography and texture elements, and pivot the layout toward high-converting clarity without defensive ego.',
        subtext: 'Senior designers view critique as business intelligence, not a personal attack.'
      },
      {
        id: 'c5_b', letter: 'B',
        text: 'Take it as a personal insult, argue that the leadership has poor taste, and sulk for a week.',
        subtext: 'Childish attachment to personal artifacts over company success.'
      },
      {
        id: 'c5_c', letter: 'C',
        text: 'Publicly post internal design concepts to Reddit to solicit validation from strangers.',
        subtext: 'Breach of internal trust and confidentiality.'
      },
      {
        id: 'c5_d', letter: 'D',
        text: 'Purposely design an ugly version to prove a point.',
        subtext: 'Passive-aggressive sabotage.'
      }
    ],
    notePlaceholder: 'How do you separate your ego from creative output? (optional)...'
  },
  {
    id: 'crt_6',
    category: 'Licensing & Asset Integrity',
    title: 'The Unlicensed Typography Risk',
    scenario: 'A contributor on your team downloads a pirated commercial font family from a torrent site and embeds it into the core Refeir web application repository.',
    question: 'What is your action upon discovering this?',
    options: [
      {
        id: 'c6_a', letter: 'A',
        text: 'Immediately replace the font with a verified open-source alternative (e.g. Google Fonts / Newsreader / Inter) or arrange a legitimate commercial license, ensuring zero legal liability for the platform.',
        subtext: 'Ethical compliance and rigorous protection of company intellectual property.'
      },
      {
        id: 'c6_b', letter: 'B',
        text: 'Leave it in production and hope the font foundry’s legal team never notices.',
        subtext: 'Exposing Refeir to massive copyright infringement lawsuits.'
      },
      {
        id: 'c6_c', letter: 'C',
        text: 'Rename the font file to "custom_font" thinking that makes piracy legal.',
        subtext: 'Childish misunderstanding of digital copyright law.'
      },
      {
        id: 'c6_d', letter: 'D',
        text: 'Delete the entire CSS styling across the website in protest.',
        subtext: 'Destructive overreaction.'
      }
    ],
    notePlaceholder: 'Share your view on creative asset integrity (optional)...'
  },
  {
    id: 'crt_7',
    category: 'Storytelling & Emotional Resonance',
    title: 'Documenting the Pioneer Journey',
    scenario: 'You are filming and editing a 60-second video case study of a Pioneer in Ibadan who earned his first $1,500 milestone payout on Refeir.',
    question: 'What story arc creates the most powerful authentic connection?',
    options: [
      {
        id: 'c7_a', letter: 'A',
        text: 'Focus on his dedication, the rigorous peer review process, the technical problem he solved, and the sovereign dignity of building world-class products from home without middlemen.',
        subtext: 'Inspiring through authentic craft, perseverance, and genuine human achievement.'
      },
      {
        id: 'c7_b', letter: 'B',
        text: 'Film him holding stacks of physical cash next to a rented sports car like a forex scammer.',
        subtext: 'Cheapening the brand and attracting greedy, low-integrity opportunists.'
      },
      {
        id: 'c7_c', letter: 'C',
        text: 'Portray him as a pitiful charity case who needed rescue by an NGO.',
        subtext: 'Demeaning narrative counter to African sovereign excellence.'
      },
      {
        id: 'c7_d', letter: 'D',
        text: 'Use an AI synthetic voiceover with generic stock footage from North America.',
        subtext: 'Total disconnection from the lived reality of African talent.'
      }
    ],
    notePlaceholder: 'How do you approach authentic visual storytelling? (optional)...'
  },
  {
    id: 'crt_8',
    category: 'Design-to-Code Collaboration',
    title: 'The Responsive Breakpoint Breakdown',
    scenario: 'Your design looks stunning at 1440px desktop, but testing on tablet and medium mobile viewports reveals overlapping text and broken padding in production.',
    question: 'How do you collaborate with frontend engineers to fix this?',
    options: [
      {
        id: 'c8_a', letter: 'A',
        text: 'Provide fluid typography guidelines (clamp formulas), auto-layout mobile frames, and pair directly in CSS inspection to verify responsive behavior at 360px, 768px, and 1024px.',
        subtext: 'End-to-end responsibility for the visual experience across all screen sizes.'
      },
      {
        id: 'c8_b', letter: 'B',
        text: 'Tell the developers that responsive design is their job and refuse to inspect mobile views.',
        subtext: 'Abdication of design ownership.'
      },
      {
        id: 'c8_c', letter: 'C',
        text: 'Disable mobile access entirely and tell users to view only on 27-inch monitors.',
        subtext: 'Absurd negligence in a mobile-first continent.'
      },
      {
        id: 'c8_d', letter: 'D',
        text: 'Insist that the developer re-code everything from scratch without providing mobile specs.',
        subtext: 'Unreasonable demands without actionable guidance.'
      }
    ],
    notePlaceholder: 'How do you ensure responsive design fidelity? (optional)...'
  },
  {
    id: 'crt_9',
    category: 'Ecosystem Vouching & Talent Elevation',
    title: 'The 3D Brand Mascot Opportunity',
    scenario: 'Refeir needs a bespoke 3D interactive icon set for the rewards ladder. You are an expert 2D graphic designer but have never modeled in Blender or Spline, while a peer in the Creative squad is a master 3D artist.',
    question: 'How do you approach this project?',
    options: [
      {
        id: 'c9_a', letter: 'A',
        text: 'Advocate for your peer to take the lead on 3D modeling while you collaborate on creative direction and 2D vector texture guides, ensuring the platform gets award-winning quality.',
        subtext: 'Putting collective excellence above personal territorialism.'
      },
      {
        id: 'c9_b', letter: 'B',
        text: 'Hoard the task, spend 2 weeks struggling with basic Blender tutorials, and deliver deformed low-quality assets.',
        subtext: 'Ego-driven failure that hurts the platform aesthetic.'
      },
      {
        id: 'c9_c', letter: 'C',
        text: 'Steal 3D models from an online repository without attribution.',
        subtext: 'Intellectual property theft.'
      },
      {
        id: 'c9_d', letter: 'D',
        text: 'Convince leadership that 3D icons are a terrible idea so nobody gets the gig.',
        subtext: 'Toxic sabotage to prevent peers from shining.'
      }
    ],
    notePlaceholder: 'How do you collaborate across creative disciplines? (optional)...'
  },
  {
    id: 'crt_10',
    category: 'Creative Philosophy & Reflection',
    title: 'The Sovereign Aesthetic Standard',
    scenario: 'Creative media at Refeir is the visual mirror of Africa’s premier builders. It defines how the continent’s talent is perceived by global enterprises.',
    question: 'In your own words: what is your creative philosophy, how do you infuse authenticity into modern digital design, and what visual standard of excellence will you bring to Refeir?',
    options: [],
    notePlaceholder: 'Type your qualitative creative reflection here (minimum 30 characters)... Share how you balance beauty with utility, your visual influences, and your standard of craftsmanship.'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// 4. CAMPUS AMBASSADORS & UNIVERSITY NODES SQUAD (10 QUESTIONS)
// ══════════════════════════════════════════════════════════════════════════════
const CAMPUS_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'cmp_1',
    category: 'Grassroots Leadership & Crisis',
    title: 'The Last-Minute Venue Revocation',
    scenario: 'Forty-eight hours before your scheduled 150-student Refeir Pioneer Hackathon on campus, the university administration revokes the auditorium permit due to an unexpected faculty meeting.',
    question: 'How do you rescue the event without dampening student trust?',
    options: [
      {
        id: 'c1_a', letter: 'A',
        text: 'Negotiate with nearby tech hub/co-working spaces, secure a hybrid decentralized venue, inform registered students via WhatsApp and Telegram with clear transit directions, and proceed with energy.',
        subtext: 'Resilient community problem-solving under bureaucratic adversity.'
      },
      {
        id: 'c1_b', letter: 'B',
        text: 'Cancel the hackathon, delete the registration group, and disappear from campus.',
        subtext: 'Abandoning student peers and destroying reputation.'
      },
      {
        id: 'c1_c', letter: 'C',
        text: 'Break into the locked faculty auditorium and hold the event illegally.',
        subtext: 'Criminal trespass endangering student safety and university enrollment.'
      },
      {
        id: 'c1_d', letter: 'D',
        text: 'Post inflammatory attacks against university deans on Twitter.',
        subtext: 'Alienating university stakeholders and getting student groups banned.'
      }
    ],
    notePlaceholder: 'How do you handle unexpected event roadblocks? (optional)...'
  },
  {
    id: 'cmp_2',
    category: 'Integrity vs Phantom Signups',
    title: 'The Fake Attendance Roster',
    scenario: 'To earn the monthly ambassador milestone stipend, you need 50 verified student attendees at your workshop. Only 28 attend in person. A friend suggests writing in 22 fake names from the student union directory.',
    question: 'What is your response?',
    options: [
      {
        id: 'c2_a', letter: 'A',
        text: 'Submit the honest roster of 28 highly engaged students, document their real feedback and project demos, and ask headquarters for advice on improving turnout for the next sprint.',
        subtext: 'Uncompromising integrity and transparency over superficial vanity metrics.'
      },
      {
        id: 'c2_b', letter: 'B',
        text: 'Forge the 22 names and take the full stipend hoping nobody calls the numbers.',
        subtext: 'Direct fraud that leads to permanent expulsion and blacklisting.'
      },
      {
        id: 'c2_c', letter: 'C',
        text: 'Bribe strangers on the street outside to write down their names and leave.',
        subtext: 'Wasting budget on zero-value phantom metrics.'
      },
      {
        id: 'c2_d', letter: 'D',
        text: 'Blame the university students for being uneducated and lazy.',
        subtext: 'Arrogant condescension toward the community you were chosen to serve.'
      }
    ],
    notePlaceholder: 'What does community integrity mean to you? (optional)...'
  },
  {
    id: 'cmp_3',
    category: 'Addressing Student Skepticism',
    title: 'The "Is This a Ponzi Scheme?" Challenge',
    scenario: 'During a lecture-hall presentation, a vocal student leader interrupts and claims that Refeir is just another crypto scam or multi-level marketing scheme taking advantage of African youth.',
    question: 'How do you de-escalate and educate the audience?',
    options: [
      {
        id: 'c3_a', letter: 'A',
        text: 'Acknowledge valid skepticism calmly, distinguish Refeir’s proof-of-work protocol: there are zero membership fees, real client task bounties, verified milestone escrows, and demonstrate a live code review and instant payout on screen.',
        subtext: 'Winning hearts and minds through radical transparency and live proof-of-work.'
      },
      {
        id: 'c3_b', letter: 'B',
        text: 'Shout at the student, call him ignorant, and demand campus security escort him out.',
        subtext: 'Defensive hostility that makes the audience suspect you are hiding something.'
      },
      {
        id: 'c3_c', letter: 'C',
        text: 'Leave the stage in tears and abandon the session.',
        subtext: 'Total collapse of ambassador presence and authority.'
      },
      {
        id: 'c3_d', letter: 'D',
        text: 'Promise that everyone who signs up will get free money tomorrow without doing any work.',
        subtext: 'Feeding the exact scam perception you are trying to disprove.'
      }
    ],
    notePlaceholder: 'How do you handle tough public objections? (optional)...'
  },
  {
    id: 'cmp_4',
    category: 'Exam Season Adaptation',
    title: 'The Exam Period Drop-Off',
    scenario: 'University midterm examinations arrive across all faculties. Campus node attendance drops by 75% as students focus exclusively on academic survival for the next 3 weeks.',
    question: 'How do you adapt the campus node cadence?',
    options: [
      {
        id: 'c4_a', letter: 'A',
        text: 'Transition from intensive hackathons to low-friction, bite-sized "Study & Build" study lounges, asynchronous task challenges, and celebrate academic focus while keeping community warmth alive.',
        subtext: 'Empathy with student reality; harmonizing academic success with career building.'
      },
      {
        id: 'c4_b', letter: 'B',
        text: 'Demand that students skip their university examinations to prioritize Refeir tasks.',
        subtext: 'Irresponsible guidance that endangers student futures.'
      },
      {
        id: 'c4_c', letter: 'C',
        text: 'Complain that students do not care about building their future and close the node.',
        subtext: 'Inflexible inability to adapt to seasonal community rhythms.'
      },
      {
        id: 'c4_d', letter: 'D',
        text: 'Spam students’ personal WhatsApp inboxes during their exam hall hours.',
        subtext: 'Invasive harassment that breeds resentment.'
      }
    ],
    notePlaceholder: 'How do you maintain community momentum during exam seasons? (optional)...'
  },
  {
    id: 'cmp_5',
    category: 'Talent Discovery & Mentorship',
    title: 'Spotting the Quiet Genius',
    scenario: 'A shy freshman student sits in the back row of every Refeir meetup, never speaking during Q&A, but you discover on GitHub that he has quietly built a lightning-fast Rust compiler utility.',
    question: 'How do you empower him within Refeir?',
    options: [
      {
        id: 'c5_a', letter: 'A',
        text: 'Reach out personally for a one-on-one coffee chat, review his GitHub project with genuine praise, introduce him to the Tech squad lead, and mentor him to submit his first task proof.',
        subtext: 'True ambassador leadership seeks out and elevates hidden brilliance.'
      },
      {
        id: 'c5_b', letter: 'B',
        text: 'Ignore him because he does not speak loudly or contribute to hype on Twitter.',
        subtext: 'Superficial bias toward loud extroverts over real engineering depth.'
      },
      {
        id: 'c5_c', letter: 'C',
        text: 'Force him on stage against his will and demand he give an impromptu presentation.',
        subtext: 'Humiliating introverted talent.'
      },
      {
        id: 'c5_d', letter: 'D',
        text: 'Take his open-source code and submit it under your own name for a bounty.',
        subtext: 'Reprehensible intellectual theft.'
      }
    ],
    notePlaceholder: 'How do you identify and nurture quiet talent? (optional)...'
  },
  {
    id: 'cmp_6',
    category: 'Co-Ambassador Team Dynamics',
    title: 'The Inactive Campus Co-Lead',
    scenario: 'You are appointed co-ambassador with a peer. While you do 90% of the logistics, planning, and student onboarding, the co-lead only shows up for photos and claims equal leadership credit.',
    question: 'How do you resolve this teamwork friction?',
    options: [
      {
        id: 'c6_a', letter: 'A',
        text: 'Initiate a respectful private conversation with the co-lead to establish clear split responsibilities; if neglect continues, document the distribution of work and consult the Operations lead objectively.',
        subtext: 'Mature, transparent conflict resolution focused on organizational delivery.'
      },
      {
        id: 'c6_b', letter: 'B',
        text: 'Vent and slander them in public student WhatsApp groups.',
        subtext: 'Immature drama that destroys campus credibility.'
      },
      {
        id: 'c6_c', letter: 'C',
        text: 'Stop doing any work yourself out of spite so the campus node collapses.',
        subtext: 'Childish sabotage of the community.'
      },
      {
        id: 'c6_d', letter: 'D',
        text: 'Pretend everything is fine while harboring bitter resentment.',
        subtext: 'Passive-aggressive avoidance.'
      }
    ],
    notePlaceholder: 'How do you handle accountability with peer co-leads? (optional)...'
  },
  {
    id: 'cmp_7',
    category: 'Budgeting & Resource Stewardship',
    title: 'The Event Sponsorship Allocation',
    scenario: 'Headquarters allocates a $300 micro-grant for your campus launch event. You can spend it on heavy catering (shawarma/drinks) or on subsidizing mobile data vouchers and internet routers for student hackathon sprint teams.',
    question: 'How do you prioritize this budget?',
    options: [
      {
        id: 'c7_a', letter: 'A',
        text: 'Prioritize productivity: allocate the bulk of funds to reliable high-speed data access, workstation power banks, and modest refreshments, ensuring students actually ship working code.',
        subtext: 'Pragmatic stewardship focused on tangible student output over fleeting luxury.'
      },
      {
        id: 'c7_b', letter: 'B',
        text: 'Spend 100% of the money on expensive gourmet food and let the students struggle with zero internet.',
        subtext: 'Throwing a party instead of building an engineering launchpad.'
      },
      {
        id: 'c7_c', letter: 'C',
        text: 'Pocket half the money privately and pretend the venue cost was double.',
        subtext: 'Embezzlement of community resources.'
      },
      {
        id: 'c7_d', letter: 'D',
        text: 'Buy fireworks and novelty t-shirts for yourself.',
        subtext: 'Selfish vanity.'
      }
    ],
    notePlaceholder: 'How do you maximize impact on a constrained budget? (optional)...'
  },
  {
    id: 'cmp_8',
    category: 'Ecosystem Vouching & Referral Mindset',
    title: 'The Cross-University Collaboration',
    scenario: 'Your campus node in Lagos has an abundance of talented mobile developers, while the campus node in Kumasi has top-notch UI designers. A large client bounty arrives needing both skills.',
    question: 'What is your action?',
    options: [
      {
        id: 'c8_a', letter: 'A',
        text: 'Connect the student builders across campuses through Refeir’s collaborative squad channels, help them form an inter-university dream team, and celebrate cross-border African synergy.',
        subtext: 'Fostering pan-African collaboration that demonstrates the sovereign Refeir vision.'
      },
      {
        id: 'c8_b', letter: 'B',
        text: 'Refuse to let your students collaborate with another campus because you want your campus to "win".',
        subtext: 'Petty parochial tribalism that undermines network effects.'
      },
      {
        id: 'c8_c', letter: 'C',
        text: 'Tell the Kumasi campus that their designers are terrible.',
        subtext: 'Toxic antagonism.'
      },
      {
        id: 'c8_d', letter: 'D',
        text: 'Tell the client to cancel the project because one campus cannot do it alone.',
        subtext: 'Killing commercial opportunities for fellow students.'
      }
    ],
    notePlaceholder: 'How do you drive cross-campus collaboration? (optional)...'
  },
  {
    id: 'cmp_9',
    category: 'Sustained Community Cadence',
    title: 'Post-Launch Engagement Longevity',
    scenario: 'After a wildly successful launch week with 200 attendees, momentum begins to fizzle in week 3 as novelty wears off and daily student routines take over.',
    question: 'How do you build a repeatable, enduring rhythm?',
    options: [
      {
        id: 'c9_a', letter: 'A',
        text: 'Establish weekly recurring rituals: Friday "Show & Tell" demo nights, bi-weekly bounty sprints, and appoint sub-chapter leads (Tech lead, Design lead, Community lead) to distribute ownership.',
        subtext: 'Institutionalizing decentralized leadership and predictable community rituals.'
      },
      {
        id: 'c9_b', letter: 'B',
        text: 'Organize another expensive launch party every two weeks until money runs out.',
        subtext: 'Unsustainable hype addiction.'
      },
      {
        id: 'c9_c', letter: 'C',
        text: 'Accept defeat and conclude that African students have short attention spans.',
        subtext: 'Lazy stereotyping and leadership surrender.'
      },
      {
        id: 'c9_d', letter: 'D',
        text: 'Send automated bot messages every hour to student phones.',
        subtext: 'Annoying spam.'
      }
    ],
    notePlaceholder: 'How do you transition hype into habit? (optional)...'
  },
  {
    id: 'cmp_10',
    category: 'Campus Philosophy & Reflection',
    title: 'The Sovereign Campus Standard',
    scenario: 'Campus Ambassadors are the frontline missionaries of Refeir. You are cultivating Africa’s next generation of sovereign wealth creators right from lecture halls.',
    question: 'In your own words: what drives your leadership on campus, how will you turn university students into verifiable global builders, and what enduring legacy will you leave at your university node?',
    options: [],
    notePlaceholder: 'Type your qualitative campus leadership reflection here (minimum 30 characters)... Share your grassroots vision, how you mobilize peers, and your personal standard of excellence.'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// 5. OPERATIONS, GOVERNANCE & VETTING SQUAD (10 QUESTIONS)
// ══════════════════════════════════════════════════════════════════════════════
const OPERATIONS_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'ops_1',
    category: 'Vetting Backlog & High Volume',
    title: 'The Admissions Surge Crisis',
    scenario: 'Following a national media feature, 1,800 new Pioneer applications flood the vetting queue in 48 hours. The SLA target is 72 hours, but thorough manual portfolio evaluation takes 15 minutes per candidate.',
    question: 'How do you maintain rigorous admission standards without creating a 3-week backlog?',
    options: [
      {
        id: 'o1_a', letter: 'A',
        text: 'Implement a tiered triage protocol: deploy automated pre-screening checks for broken portfolio links and verification compliance, mobilize an expedited review squad with rubric scoring, and prioritize top-scoring submissions for deep review.',
        subtext: 'Disciplined operational triage combining automation with uncompromised human verification.'
      },
      {
        id: 'o1_b', letter: 'B',
        text: 'Mass-approve all 1,800 applicants with a single click to clear the dashboard.',
        subtext: 'Total destruction of the elite Pioneer quality barrier.'
      },
      {
        id: 'o1_c', letter: 'C',
        text: 'Mass-reject everyone who applied after the first 100 candidates without reading.',
        subtext: 'Unfairly penalizing high-caliber applicants due to operational failure.'
      },
      {
        id: 'o1_d', letter: 'D',
        text: 'Shut down admissions entirely and tell people to stop applying.',
        subtext: 'Strangling the network’s growth momentum.'
      }
    ],
    notePlaceholder: 'How do you manage high-volume operational bottlenecks? (optional)...'
  },
  {
    id: 'ops_2',
    category: 'Integrity & Conflict of Interest',
    title: 'The Personal Friend Application',
    scenario: 'You are reviewing applications for the Technology squad. Your close friend from university submits an application with an incomplete portfolio and non-functional GitHub links, asking you on WhatsApp to "hook him up with acceptance."',
    question: 'How do you handle this evaluation?',
    options: [
      {
        id: 'o2_a', letter: 'A',
        text: 'Recuse yourself immediately from evaluating his application to prevent bias, pass it to an independent reviewer, and explain to your friend privately that Refeir is a strict meritocracy where credentials must stand on their own merit.',
        subtext: 'Radical impartiality and professional governance upholding institutional trust.'
      },
      {
        id: 'o2_b', letter: 'B',
        text: 'Approve him immediately and fake his scoring rubrics because friendship comes before company policy.',
        subtext: 'Nepotism and corruption that rots organizations from the inside.'
      },
      {
        id: 'o2_c', letter: 'C',
        text: 'Block your friend everywhere without explanation.',
        subtext: 'Immature avoidance of professional boundaries.'
      },
      {
        id: 'o2_d', letter: 'D',
        text: 'Charge your friend a bribe to guarantee acceptance.',
        subtext: 'Criminal extortion.'
      }
    ],
    notePlaceholder: 'How do you navigate conflicts of interest? (optional)...'
  },
  {
    id: 'ops_3',
    category: 'Bounty Dispute Resolution',
    title: 'The Contested Task Deliverable',
    scenario: 'A contributor delivers a task proof for a $500 client bounty. The enterprise client claims the work is 60% incomplete and refuses to release escrow, while the contributor insists they fulfilled all specifications in the original brief.',
    question: 'How do you arbitrate this dispute fairly?',
    options: [
      {
        id: 'o3_a', letter: 'A',
        text: 'Review the written Statement of Work line by line against the git commit history, identify the exact delta between agreed scope and delivered code, facilitate a 15-minute resolution session, and determine fair partial release with an agreed completion checklist.',
        subtext: 'Objective, evidence-based dispute arbitration that protects both talent and clients.'
      },
      {
        id: 'o3_b', letter: 'B',
        text: 'Automatically side with the client because "the customer is always right" and confiscate the contributor’s earnings.',
        subtext: 'Exploitative bias that alienates top talent.'
      },
      {
        id: 'o3_c', letter: 'C',
        text: 'Automatically side with the contributor and ban the client from Refeir.',
        subtext: 'Reckless disregard for commercial client partnerships.'
      },
      {
        id: 'o3_d', letter: 'D',
        text: 'Keep the $500 in platform reserves and refuse to give it to either party.',
        subtext: 'Illegal platform theft.'
      }
    ],
    notePlaceholder: 'What principles guide your dispute arbitration? (optional)...'
  },
  {
    id: 'ops_4',
    category: 'Fraud Detection & Collusion Rings',
    title: 'The Coordinated Vouching Cartel',
    scenario: 'Your operational audit flags 4 accounts that constantly vouch for each other on tasks, giving 5-star reviews within seconds of completion on suspicious internal tasks without public repository proofs.',
    question: 'What is your investigation protocol?',
    options: [
      {
        id: 'o4_a', letter: 'A',
        text: 'Conduct a forensic review of transaction records, git commit trees, and IP session history; freeze suspicious bounty disbursements pending inquiry, interview the accounts, and enforce permanent de-platforming if collusion is proven.',
        subtext: 'Vigilant governance protecting the authenticity of Refeir’s trust graph.'
      },
      {
        id: 'o4_b', letter: 'B',
        text: 'Ignore it because higher review scores look good to outsiders.',
        subtext: 'Allowing cancer to metastasize in the reputation engine.'
      },
      {
        id: 'o4_c', letter: 'C',
        text: 'Immediately delete their accounts without checking any logs or data.',
        subtext: 'Arbitrary governance lacking procedural due process.'
      },
      {
        id: 'o4_d', letter: 'D',
        text: 'Join their circle so you can get free 5-star reviews too.',
        subtext: 'Corruption in the governance body.'
      }
    ],
    notePlaceholder: 'How do you detect and deter reputation gaming? (optional)...'
  },
  {
    id: 'ops_5',
    category: 'Escrow & Payout Delays',
    title: 'The Friday Banking Rail Outage',
    scenario: 'On Friday evening, a regional clearing switch experiences a nationwide downtime, preventing 80 Pioneers from receiving their weekly verified milestone bounty payouts.',
    question: 'How do you communicate and mitigate this failure?',
    options: [
      {
        id: 'o5_a', letter: 'A',
        text: 'Issue an immediate transparent briefing via SMS/Telegram acknowledging the banking gateway disruption, provide transaction batch reference numbers, offer alternative stablecoin/MoMo instant routing for urgent needs, and provide hourly status updates.',
        subtext: 'Proactive crisis communication preserving trust when financial rails fail.'
      },
      {
        id: 'o5_b', letter: 'B',
        text: 'Turn off your phone, disable support chat, and ignore the contributors until Monday morning.',
        subtext: 'Callous disregard for freelancers whose bills depend on on-time pay.'
      },
      {
        id: 'o5_c', letter: 'C',
        text: 'Lie to the contributors and tell them they typed their own bank account numbers incorrectly.',
        subtext: 'Gaslighting users to mask operational failures.'
      },
      {
        id: 'o5_d', letter: 'D',
        text: 'Post on social media that banks are obsolete and everyone should just wait indefinitely.',
        subtext: 'Unhelpful ideological posturing instead of solving logistical problems.'
      }
    ],
    notePlaceholder: 'How do you handle critical financial disbursement failures? (optional)...'
  },
  {
    id: 'ops_6',
    category: 'Standard Operating Procedures',
    title: 'The Fragmented Task Submission Chaos',
    scenario: 'Different squads are submitting task proofs in completely mismatched formats: some submit Loom videos, some drop raw Google Docs links, others send unformatted WhatsApp voice notes.',
    question: 'How do you streamline platform-wide operational flow?',
    options: [
      {
        id: 'o6_a', letter: 'A',
        text: 'Standardize a unified Task Proof Submission Template across all squads with required fields (PR link, live demo URL, verification checklist, test proof), and automate validation before a task can be submitted for review.',
        subtext: 'Systematic process engineering that eliminates friction and accelerates review turnaround.'
      },
      {
        id: 'o6_b', letter: 'B',
        text: 'Accept random formats and spend 4 hours every night manually transcribing voice notes.',
        subtext: 'Unscalable operational martyrdom.'
      },
      {
        id: 'o6_c', letter: 'C',
        text: 'Reject 100% of all submitted tasks without explaining what format was needed.',
        subtext: 'Punishing users for leadership’s failure to establish clear guidelines.'
      },
      {
        id: 'o6_d', letter: 'D',
        text: 'Eliminate task reviews entirely and let everyone approve their own bounties.',
        subtext: 'Complete operational anarchy.'
      }
    ],
    notePlaceholder: 'How do you design scalable standard operating procedures? (optional)...'
  },
  {
    id: 'ops_7',
    category: 'Public Backlash Management',
    title: 'The Disgruntled Rejected Applicant',
    scenario: 'An applicant rejected due to verifiable plagiarized code posts a viral thread on Twitter accusing Refeir’s admissions team of regional tribal bias and corruption.',
    question: 'How do you handle this public relations challenge?',
    options: [
      {
        id: 'o7_a', letter: 'A',
        text: 'Draft a calm, objective, respectful official statement reiterating Refeir’s standardized code of conduct and automated plagiarism rubrics without publicly naming or humiliating the individual, and invite independent peer review of the rubric.',
        subtext: 'Dignified institutional composure grounded in objective proof.'
      },
      {
        id: 'o7_b', letter: 'B',
        text: 'Engage in a heated insult match with the user in Twitter replies.',
        subtext: 'Degrading the company to the level of internet drama.'
      },
      {
        id: 'o7_c', letter: 'C',
        text: 'Panic and immediately accept the applicant with an apology to make the tweet go away.',
        subtext: 'Surrendering institutional standards to public bullying.'
      },
      {
        id: 'o7_d', letter: 'D',
        text: 'Doxx the applicant’s private contact information online.',
        subtext: 'Gross violation of privacy laws and basic ethics.'
      }
    ],
    notePlaceholder: 'How do you maintain composure during public backlash? (optional)...'
  },
  {
    id: 'ops_8',
    category: 'Cross-Squad Resource Allocation',
    title: 'The Budget Tug-of-War',
    scenario: 'The Tech squad demands $4,000 for database server upgrades, while the Growth squad demands $4,000 for a university campus marketing push. The available platform reserve for the month is $5,000.',
    question: 'How do you structure the operational compromise?',
    options: [
      {
        id: 'o8_a', letter: 'A',
        text: 'Analyze return on investment: fund essential database optimization to prevent site outages during growth surges ($2,500), allocate $2,500 to targeted high-conversion campus nodes, and monitor weekly milestones before releasing subsequent tranches.',
        subtext: 'Data-driven capital allocation balancing platform infrastructure with customer acquisition.'
      },
      {
        id: 'o8_b', letter: 'B',
        text: 'Give all $5,000 to whichever squad lead shouts the loudest in the meeting.',
        subtext: 'Management by intimidation.'
      },
      {
        id: 'o8_c', letter: 'C',
        text: 'Refuse to allocate any money to anyone and let both squads stall.',
        subtext: 'Organizational gridlock.'
      },
      {
        id: 'o8_d', letter: 'D',
        text: 'Flip a coin in front of both squads to decide.',
        subtext: 'Abdicating executive responsibility to chance.'
      }
    ],
    notePlaceholder: 'How do you approach capital allocation under scarcity? (optional)...'
  },
  {
    id: 'ops_9',
    category: 'Continuous Improvement & Root Cause',
    title: 'The Chronic Squad Deadline Failure',
    scenario: 'A specific squad has missed their committed sprint delivery deadlines for 3 consecutive weeks, frustrating enterprise clients and slowing platform releases.',
    question: 'How do you diagnose and rectify this systemic failure?',
    options: [
      {
        id: 'o9_a', letter: 'A',
        text: 'Facilitate a blameless root-cause retrospective using the "5 Whys" method, evaluate whether scopes were over-estimated or dependencies blocked, recalibrate sprint velocity metrics, and implement daily 10-minute unblocking standups.',
        subtext: 'Focusing on process improvements and structural support over toxic finger-pointing.'
      },
      {
        id: 'o9_b', letter: 'B',
        text: 'Publicly humiliate the squad members in the all-hands meeting and threaten to cut their pay.',
        subtext: 'Fear-based management that guarantees high turnover.'
      },
      {
        id: 'o9_c', letter: 'C',
        text: 'Ignore the missed deadlines and pretend the clients didn’t notice.',
        subtext: 'Destroying client trust and enterprise retention.'
      },
      {
        id: 'o9_d', letter: 'D',
        text: 'Disband the entire squad and do the work yourself.',
        subtext: 'Hero complex that destroys team scalability.'
      }
    ],
    notePlaceholder: 'How do you conduct root-cause retrospectives? (optional)...'
  },
  {
    id: 'ops_10',
    category: 'Operations Philosophy & Reflection',
    title: 'The Sovereign Operational Standard',
    scenario: 'Operations is the backbone of trust at Refeir. Without immaculate governance, fair vetting, and reliable escrows, a decentralized freelance economy cannot survive.',
    question: 'In your own words: what is your philosophy of operational discipline, how do you uphold radical fairness and meritocracy, and what standard of excellence will you bring to Refeir’s governance?',
    options: [],
    notePlaceholder: 'Type your qualitative operational reflection here (minimum 30 characters)... Share your principles on governance, equity, dispute resolution, and system discipline.'
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// 6. ENTERPRISE PARTNERSHIPS & CLIENT ENGAGEMENTS SQUAD (10 QUESTIONS)
// ══════════════════════════════════════════════════════════════════════════════
const ENTERPRISE_QUESTIONS: SurveyQuestionDef[] = [
  {
    id: 'ent_1',
    category: 'Scope Management & Integrity',
    title: 'The Corporate Scope Creep Ambush',
    scenario: 'Two weeks into a $15,000 enterprise contract, the client’s project manager requests 4 major additional modules not included in the original Statement of Work, claiming: "We assumed this was obvious and expected it in this budget."',
    question: 'How do you manage this commercial confrontation?',
    options: [
      {
        id: 'e1_a', letter: 'A',
        text: 'Acknowledge the value of the new modules, reference the signed SOW transparently, and present a structured Change Order proposal detailing timeline impacts and additional budget requirements for Pioneer compensation.',
        subtext: 'Defending Pioneer wages and contractual boundaries while preserving collaborative corporate trust.'
      },
      {
        id: 'e1_b', letter: 'B',
        text: 'Force the Pioneers to work 80-hour weeks for free to accommodate the client’s unbudgeted demands.',
        subtext: 'Exploiting African talent to please corporate clients.'
      },
      {
        id: 'e1_c', letter: 'C',
        text: 'Send a rude email terminating the contract immediately and forfeiting the relationship.',
        subtext: 'Unprofessional volatility that damages enterprise reputation.'
      },
      {
        id: 'e1_d', letter: 'D',
        text: 'Silently accept the scope creep without telling the Pioneers until the deadline.',
        subtext: 'Cowardly avoidance that causes burnout and substandard delivery.'
      }
    ],
    notePlaceholder: 'How do you manage corporate scope creep? (optional)...'
  },
  {
    id: 'ent_2',
    category: 'Ethics & Anti-Corruption',
    title: 'The Procurement Kickback Solicitation',
    scenario: 'The procurement manager of a major telecommunications firm hints that they will award a $50,000 enterprise engineering contract to Refeir, but only if 10% is wired privately to his personal offshore bank account as an "advisory fee."',
    question: 'What is your immediate response?',
    options: [
      {
        id: 'e2_a', letter: 'A',
        text: 'Firmly decline the proposal, document the correspondence for compliance, consult executive leadership, and refuse any transaction that violates Refeir’s anti-corruption standards and global legal integrity.',
        subtext: 'Zero tolerance for bribery, safeguarding the ethical foundation of Refeir.'
      },
      {
        id: 'e2_b', letter: 'B',
        text: 'Agree immediately and hide the kickback as a "miscellaneous design expense."',
        subtext: 'Criminal bribery that destroys enterprise credibility and creates legal liability.'
      },
      {
        id: 'e2_c', letter: 'C',
        text: 'Agree and deduct the 10% bribe directly from the Pioneers’ bounty payouts.',
        subtext: 'Stealing from contributors to fund corporate corruption.'
      },
      {
        id: 'e2_d', letter: 'D',
        text: 'Blackmail the procurement manager on LinkedIn.',
        subtext: 'Reckless criminal conduct.'
      }
    ],
    notePlaceholder: 'What is your stance on corporate ethics and bribery? (optional)...'
  },
  {
    id: 'ent_3',
    category: 'Talent Matching & Meritocracy',
    title: 'The High-Stakes Skill Match',
    scenario: 'A fintech enterprise needs a senior systems architect for a high-throughput payment switch. An outspoken Pioneer who is popular on Discord insists on taking the lead, but you know another quiet Pioneer has 5x deeper experience in banking gateways.',
    question: 'Who do you assign to lead the contract?',
    options: [
      {
        id: 'e3_a', letter: 'A',
        text: 'Assign the quiet specialist with demonstrated high-throughput gateway mastery to ensure flawless delivery for the enterprise, and pair the enthusiastic Pioneer on a secondary module where they can learn and contribute safely.',
        subtext: 'Meritocratic talent matching that guarantees client success while cultivating talent.'
      },
      {
        id: 'e3_b', letter: 'B',
        text: 'Give it to the popular contributor to avoid awkward social dynamics in the community chat.',
        subtext: 'Sacrificing client delivery quality for social popularity.'
      },
      {
        id: 'e3_c', letter: 'C',
        text: 'Take the contract yourself despite having zero fintech knowledge.',
        subtext: 'Selfish arrogance that leads to catastrophic client failure.'
      },
      {
        id: 'e3_d', letter: 'D',
        text: 'Tell the enterprise client to find someone on Upwork instead.',
        subtext: 'Surrendering platform business.'
      }
    ],
    notePlaceholder: 'How do you match talent to enterprise projects? (optional)...'
  },
  {
    id: 'ent_4',
    category: 'Pricing Power & Value Defense',
    title: 'The Corporate Lowball Negotiation',
    scenario: 'An international multinational offers a contract for 4 full-stack developers but offers to pay local Nigerian minimum rates ($300/month per engineer), arguing that "living costs are cheap in Africa."',
    question: 'How do you negotiate this commercial positioning?',
    options: [
      {
        id: 'e4_a', letter: 'A',
        text: 'Reject the exploitative rate with professional dignity; benchmark Refeir’s Pioneers against global software engineering standards, highlight the verified speed and vetting rigor, and negotiate a premium rate that delivers fair sovereign value.',
        subtext: 'Championing the economic dignity of African talent against predatory wage exploitation.'
      },
      {
        id: 'e4_b', letter: 'B',
        text: 'Accept the $300 rate gratefully and tell Pioneers they should be thankful for crumbs.',
        subtext: 'Perpetuating the very colonial gig-economy exploitation Refeir was born to eradicate.'
      },
      {
        id: 'e4_c', letter: 'C',
        text: 'Insult the multinational executives on Twitter.',
        subtext: 'Unprofessional emotionalism that burns commercial bridges.'
      },
      {
        id: 'e4_d', letter: 'D',
        text: 'Accept the contract and tell the engineers to intentionally produce broken code.',
        subtext: 'Passive-aggressive bad faith delivery.'
      }
    ],
    notePlaceholder: 'How do you defend premium pricing for African talent? (optional)...'
  },
  {
    id: 'ent_5',
    category: 'Client Relationship Recovery',
    title: 'The Unhappy Enterprise Executive',
    scenario: 'The VP of Technology at an enterprise client leaves a scathing review after milestone 1, stating that the delivered dashboard architecture was "unusable for their internal compliance standards."',
    question: 'How do you turn around this client relationship?',
    options: [
      {
        id: 'e5_a', letter: 'A',
        text: 'Request an urgent 30-minute alignment huddle with their compliance team, audit their specific corporate security framework, present a revised architecture within 24 hours, and deploy a senior Pioneer lead to oversee compliance.',
        subtext: 'Rapid, humble, and competent response turning a crisis into long-term enterprise loyalty.'
      },
      {
        id: 'e5_b', letter: 'B',
        text: 'Argue defensively that their compliance standards are outdated and stupid.',
        subtext: 'Arrogance that guarantees contract termination and legal dispute.'
      },
      {
        id: 'e5_c', letter: 'C',
        text: 'Ghost the client and keep the initial escrow deposit.',
        subtext: 'Fraudulent commercial behavior.'
      },
      {
        id: 'e5_d', letter: 'D',
        text: 'Blame the Pioneer contributors in front of the client and fire them publicly.',
        subtext: 'Spineless leadership that destroys team morale.'
      }
    ],
    notePlaceholder: 'How do you recover at-risk client partnerships? (optional)...'
  },
  {
    id: 'ent_6',
    category: 'Cross-Silo Stakeholder Management',
    title: 'Contradictory Enterprise Feedback',
    scenario: 'During milestone sign-off, the enterprise client’s Marketing team approves the frontend design, but their Security and Legal departments reject the authentication flow, giving conflicting instructions.',
    question: 'How do you navigate this corporate gridlock?',
    options: [
      {
        id: 'e6_a', letter: 'A',
        text: 'Convene an integrated stakeholder alignment workshop with all three departments, present an architecture that satisfies security compliance without breaking marketing conversion goals, and secure a single unified sign-off.',
        subtext: 'Masterful enterprise stakeholder facilitation that unblocks cross-silo deadlock.'
      },
      {
        id: 'e6_b', letter: 'B',
        text: 'Pick one department at random, build their preferences, and ignore the other two.',
        subtext: 'Guaranteed rejection by the neglected department.'
      },
      {
        id: 'e6_c', letter: 'C',
        text: 'Tell the client to fix their own internal company politics and stop calling you.',
        subtext: 'Tactless hostility that destroys enterprise engagements.'
      },
      {
        id: 'e6_d', letter: 'D',
        text: 'Stop work for 3 months until they resolve it themselves.',
        subtext: 'Abdicating consultative leadership.'
      }
    ],
    notePlaceholder: 'How do you handle conflicting corporate stakeholders? (optional)...'
  },
  {
    id: 'ent_7',
    category: 'Account Expansion & Retainers',
    title: 'The Project-to-Retainer Conversion',
    scenario: 'A one-month pilot project with a fintech client has concluded successfully. The client is satisfied, but their standard practice is to hire one-off freelancers and disengage.',
    question: 'How do you convert this engagement into an ongoing quarterly retainer?',
    options: [
      {
        id: 'e7_a', letter: 'A',
        text: 'Present an executive post-project value report detailing metrics achieved, highlight a strategic roadmap of 3 future high-ROI initiatives, and propose a dedicated Pioneer squad retainer that guarantees priority capacity and ongoing code audits.',
        subtext: 'Consultative value-based selling that turns transactional gigs into predictable recurring revenue.'
      },
      {
        id: 'e7_b', letter: 'B',
        text: 'Send a generic invoice and wait passively to see if they ever email you back.',
        subtext: 'Zero commercial initiative.'
      },
      {
        id: 'e7_c', letter: 'C',
        text: 'Beg the client for more work because our Pioneers need money.',
        subtext: 'Weak, unprofessional desperation that lowers perceived value.'
      },
      {
        id: 'e7_d', letter: 'D',
        text: 'Introduce a bug into their code so they are forced to hire us to fix it.',
        subtext: 'Extortionate criminal malpractice.'
      }
    ],
    notePlaceholder: 'How do you structure long-term enterprise retainers? (optional)...'
  },
  {
    id: 'ent_8',
    category: 'Confidentiality & IP Protection',
    title: 'The Proprietary Algorithm Leak Risk',
    scenario: 'A Pioneer working on a sensitive enterprise health-tech contract shares a screenshot of the client’s proprietary patient routing logic in a public Twitter thread to show what he is working on.',
    question: 'What is your immediate remediation?',
    options: [
      {
        id: 'e8_a', letter: 'A',
        text: 'Instruct the Pioneer to delete the tweet immediately, assess exposure with the enterprise client transparently, reinforce NDA and confidentiality protocols across the squad, and take appropriate disciplinary action.',
        subtext: 'Decisive containment of IP leakage to preserve enterprise trust.'
      },
      {
        id: 'e8_b', letter: 'B',
        text: 'Retweet the post from the official Refeir account for engagement.',
        subtext: 'Catastrophic breach of client NDA and commercial suicide.'
      },
      {
        id: 'e8_c', letter: 'C',
        text: 'Pretend the tweet does not exist and deny everything if the client asks.',
        subtext: 'Deceit that guarantees lawsuits upon discovery.'
      },
      {
        id: 'e8_d', letter: 'D',
        text: 'Blame the enterprise for having poor security.',
        subtext: 'Absurd deflection of accountability.'
      }
    ],
    notePlaceholder: 'How do you enforce client confidentiality and NDAs? (optional)...'
  },
  {
    id: 'ent_9',
    category: 'Ecosystem Vouching & Referral Elevation',
    title: 'The Multi-Division Enterprise Mandate',
    scenario: 'An enterprise client who came to Refeir for a Mobile App (Technology) reveals they also need an overhaul of their brand identity, marketing video production, and on-ground campus activation.',
    question: 'How do you coordinate this commercial opportunity?',
    options: [
      {
        id: 'e9_a', letter: 'A',
        text: 'Structure an integrated cross-division consortium package: bring in leads from Creative and Campus squads, co-author a unified high-value proposal, and distribute bounties equitably across squads.',
        subtext: 'Maximizing the multi-disciplinary network effect of Refeir’s sovereign ecosystem.'
      },
      {
        id: 'e9_b', letter: 'B',
        text: 'Try to do the design, video editing, and campus marketing yourself to keep all the money.',
        subtext: 'Greedy amateurism delivering terrible results across all disciplines.'
      },
      {
        id: 'e9_c', letter: 'C',
        text: 'Tell the client that Refeir only writes code and they should hire external agencies for everything else.',
        subtext: 'Leaving massive commercial value on the table.'
      },
      {
        id: 'e9_d', letter: 'D',
        text: 'Recommend your brother’s unvetted agency instead of Refeir Pioneer squads.',
        subtext: 'Nepotistic diversion of platform pipeline.'
      }
    ],
    notePlaceholder: 'How do you orchestrate cross-squad enterprise deals? (optional)...'
  },
  {
    id: 'ent_10',
    category: 'Enterprise Philosophy & Reflection',
    title: 'The Sovereign Enterprise Standard',
    scenario: 'Enterprise partnerships bridge African sovereign talent with the highest corridors of global commerce. You represent the professionalism and economic power of our continent.',
    question: 'In your own words: what is your commercial philosophy, how do you defend fair compensation while delivering world-class enterprise value, and what standard of excellence will you bring to Refeir’s partnerships?',
    options: [],
    notePlaceholder: 'Type your qualitative enterprise reflection here (minimum 30 characters)... Share your philosophy on commercial negotiation, client retention, ethical boundaries, and excellence.'
  }
];

// Helper to look up 10 questions for any squad
export const getSurveyQuestionsForSquad = (division: string): SurveyQuestionDef[] => {
  const normalized = (division || '').toUpperCase().trim();
  if (normalized.includes('TECH') || normalized === 'TECHNOLOGY') {
    return TECHNOLOGY_QUESTIONS;
  }
  if (normalized.includes('GROWTH')) {
    return GROWTH_QUESTIONS;
  }
  if (normalized.includes('CREATIVE') || normalized.includes('DESIGN')) {
    return CREATIVE_QUESTIONS;
  }
  if (normalized.includes('CAMPUS') || normalized.includes('AMBASSADOR') || normalized.includes('COMMUNITY')) {
    return CAMPUS_QUESTIONS;
  }
  if (normalized.includes('OPERATIONS') || normalized.includes('OPS') || normalized.includes('GOVERNANCE')) {
    return OPERATIONS_QUESTIONS;
  }
  if (normalized.includes('ENTERPRISE') || normalized.includes('BUSINESS') || normalized.includes('PARTNERSHIP') || normalized.includes('CLIENT')) {
    return ENTERPRISE_QUESTIONS;
  }
  // Default to Technology if not specified
  return TECHNOLOGY_QUESTIONS;
};

