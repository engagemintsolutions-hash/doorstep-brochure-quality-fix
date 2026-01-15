# Property Listing Generator V10 - ACCURATE Demo Script
## Complete Agency Portal Walkthrough with Sales Narrative

**IMPORTANT**: This script reflects the ACTUAL V10 workflow with multi-tenant login, photographer portal, and agency collaboration features.

---

## 🎬 OPENING (0:00 - 0:45)

**[Screen: Desktop, browser ready]**

**Script:**
> "Hello to everyone who's made the decision to explore what might be the most transformative shift in property marketing you'll see this year.
>
> I'm about to show you a complete agency management system—not just a tool, but an entire **ecosystem** that connects photographers, agents, and AI into one seamless workflow.
>
> The time you invest watching this demo? You'll win it back in your first property listing. And then some.
>
> What you're about to witness is a full-stack solution built for modern agencies. Real collaboration. Real automation. Real results.
>
> Because here's the truth: AI can't build relationships with clients. It can't negotiate offers. It can't close deals. **But it can handle everything else.** Let's show you how."

**[Action: Navigate to localhost:8000/static/login.html]**

---

## 🔐 SECTION 1: AGENCY PORTAL LOGIN (0:45 - 2:30)

**[Screen: Multi-tenant login page with Doorstep branding]**

**Script:**
> "This is the agency portal. Multi-tenant, role-based access. Let me show you how this works in practice.
>
> **Scenario**: We're Savills London. I'm an agent, and we have a photographer who just came back from a shoot."

**[Action: Select from dropdown fields while narrating]**

**Script:**
> "First, I select my organization—**Savills**. Notice it shows '2 offices' in the dropdown. This system handles multi-branch agencies seamlessly.
>
> Office location: **London**.
>
> Now here's where collaboration starts. I can log in as either an **Agent** or a **Photographer**.
>
> Let's start from the photographer's perspective first—because that's where the workflow begins."

**[Action: Select Role: Photographer]**

**Script:**
> "See these names? **Real team members**, each with their own login. No generic 'admin@company.com' nonsense. Proper user management.
>
> I'll select **Anya Rowlings**, our photographer."

**[Action: Select Agent Name: Anya Rowlings (photographer@savills.com)]**
**[Action: Enter PIN: 2025]**
**[Action: Click "Sign In"]**

**Script:**
> "Secure PIN authentication. Each office has its own PIN. If you're a franchise with 50 locations, each gets isolated access. **True multi-tenancy.**"

**[Screen: Redirect animation]**

---

## 📸 SECTION 2: PHOTOGRAPHER PORTAL - UPLOAD WORKFLOW (2:30 - 5:00)

**[Screen: Photographer portal dashboard]**

**Script:**
> "Welcome to the **Photographer Portal**. This is Anya's workspace.
>
> She just finished shooting a beautiful 4-bed property on Avenue Road. Now she needs to get those photos to the agents—fast."

**[Action: Enter Property Name: "Avenue Road"]**

**Script:**
> "Property name gets entered once. This creates a unique folder that agents will see when they log in.
>
> Now, uploading photos..."

**[Action: Drag and drop 15-20 property photos into the upload zone]**

**Script:**
> "Watch this. I'm dropping 20 raw photos straight from her camera. No pre-organization. No renaming files. Just drag, drop, done.
>
> **Real-time preview grid** appears. She can see exactly what's being uploaded.
>
> But here's the powerful part—she doesn't need to categorize these. The agents will have AI tools to do that automatically.
>
> Mobile feature coming soon: photographers will be able to upload directly from their phone on-site. Shoot, upload, move to next property. **Zero downtime.**"

**[Action: Select which agent to send to]**

**Script:**
> "Now she selects **which agent** gets these photos. See this list? Every agent in the Savills London office.
>
> Let's send them to **James Smith**, our senior agent."

**[Action: Click "Upload & Notify Agent"]**

**Script:**
> "**Upload & Notify.** James gets an instant notification. Photos are already in his workspace. No email chains. No Dropbox links. No lost files.
>
> **Cross-team collaboration** in real-time.
>
> Okay, photographer's job done. Let's switch to the agent's view."

**[Action: Click Logout]**

---

## 👔 SECTION 3: AGENT LOGIN & PHOTOGRAPHER PHOTOS (5:00 - 7:00)

**[Screen: Back to login page]**

**Script:**
> "Now I'm **James Smith**, the agent. I just got the notification that Anya uploaded photos."

**[Action: Select Organization: Savills, Office: London, Role: Agent, Name: James Smith]**
**[Action: Enter PIN: 2025, Click Sign In]**

**[Screen: Agent dashboard - index.html with photographer uploads section visible]**

**Script:**
> "This is the agent dashboard. And look—**Photographer Uploads** section right at the top.
>
> There's **Avenue Road**, uploaded 2 minutes ago by Anya. 20 photos ready to use."

**[Action: Click to expand photographer uploads, show thumbnails]**

**Script:**
> "I can preview everything she sent. If I like them, one click—**'Use These Photos'**—and they populate into my listing form automatically.
>
> Or, I can upload additional photos myself if I have extras from the vendor, drone shots, etc.
>
> Let's use Anya's photos and start building this listing."

**[Action: Click "Use These Photos" button]**

---

## 📝 SECTION 4: INTELLIGENT FORM WITH AUTO-ENRICHMENT (7:00 - 10:30)

**[Screen: Form populates with photos, now scroll down to property details]**

**Script:**
> "Photos loaded. Now, property details. This is where traditional platforms make you fill out 30 fields manually.
>
> Watch what happens when I enter the **postcode first**."

**[Action: Type postcode "GU6 8SE" in the postcode field]**

**Script:**
> "I typed GU6 8SE and... see that? **Instant location enrichment.**
>
> Behind the scenes, our system just:
> - Pulled GPS coordinates from postcodes.io (free UK API)
> - Queried OpenStreetMap Overpass API for nearby amenities
> - Analyzed school catchment areas with Ofsted ratings
> - Calculated transport links and commute times
> - Gathered demographic data and area statistics
>
> All of this will automatically flow into the brochure copy. **The AI already knows the area.**
>
> Competitors make you research this manually. You're already 15 minutes ahead."

**[Action: Start filling in property details]**

**Property Type:** House
**Bedrooms:** 4
**Bathrooms:** 3
**Price:** £1,250,000
**Square Footage:** 2,400 sqft
**Address:** Avenue Road, Cranleigh

**Script:**
> "Basic details entered. Now here's what makes this intelligent..."

**[Action: Scroll to Target Audience section]**

**Script:**
> "**Target Audience**. This isn't just metadata—this fundamentally changes how the AI writes.
>
> Are we targeting families with children? The AI will emphasize school ratings, garden space, bedroom sizes.
>
> Professionals and commuters? It'll focus on transport links, home office potential, commute times.
>
> Investors? ROI language, rental yield, appreciation potential.
>
> Let's say this is a family home."

**[Action: Select "Families with Children"]**

**[Action: Select Tone: "Warm & Inviting"]**

**Script:**
> "Tone matters. A £300k terrace needs different language than a £3M estate.
>
> - **Warm & Inviting** = homey, cozy, family-focused
> - **Professional & Factual** = Rightmove-ready, data-driven
> - **Luxury & Aspirational** = high-end magazine quality
>
> The AI adapts completely."

**[Action: Scroll to floorplan upload]**

**Script:**
> "Floorplan upload—optional but recommended. Gets its own dedicated page in the brochure with professional formatting."

**[Action: Upload floorplan image]**

**Script:**
> "Done. Now, the magic part—**AI photo analysis**."

---

## 🧠 SECTION 5: AI PHOTO CATEGORIZATION (10:30 - 12:00)

**[Screen: Scroll back up to photo section]**

**Script:**
> "Remember, Anya just dumped 20 uncategorized photos. No labels. No organization.
>
> Watch what happens when I click **'Analyze Photos with AI'**."

**[Action: Click "Auto-Categorize Photos" button or similar]**

**Script:**
> "Computer vision AI is now analyzing every single image:
> - Identifying room types (kitchen, bedroom, bathroom, living room, exterior, garden)
> - Assessing photo quality and composition
> - Scoring each image for marketing effectiveness
> - Detecting staging opportunities
> - Ranking photos for optimal placement
>
> This takes... 8 seconds."

**[Action: Watch as photos auto-sort into categories]**

**Script:**
> "**Boom.** Perfectly organized.
>
> - **Cover Photo** - best exterior shot, automatically selected
> - **Kitchen** - 2 photos
> - **Bedrooms** - 4 photos assigned to Bedroom 1, 2, 3, 4
> - **Bathrooms** - 3 photos
> - **Living Areas** - 3 photos
> - **Garden** - 2 photos
> - **Exterior** - 3 additional angles
>
> How long does this take manually? 10 minutes? 15? We just did it in 8 seconds.
>
> And see these quality scores? **Photo performance ratings.** The AI is telling you which images will perform best on Rightmove, social media, in print.
>
> You're not guessing. You're operating with data."

---

## ⚡ SECTION 6: GENERATION - THE AI AT WORK (12:00 - 13:30)

**[Screen: Scroll down to completion tracker showing form is ready]**

**Script:**
> "Completion tracker shows 100%. Form filled. Photos categorized. Location enriched. Ready to generate.
>
> When I click this button, here's what happens in parallel:
>
> **1. Location Enrichment** (if not already done)
> - Schools within 1 mile (Ofsted ratings, distances)
> - Transport links (train stations, bus stops, commute times to London)
> - Amenities (supermarkets, cafes, parks, gyms)
> - Area demographics and property trends
>
> **2. Computer Vision Analysis**
> - Every photo gets analyzed for features visible in the image
> - Kitchen: modern appliances, island, natural light
> - Bedrooms: size, light, views, storage
> - Bathrooms: fixtures, condition, style
>
> **3. GPT-4 Text Generation with 25 Critical Rules**
> - NO corporate jargon ('exemplifies', 'epitomizes', 'distinguished')
> - Natural flowing prose, NO bullet points in descriptions
> - Warm, personal tone—not stiff corporate speak
> - Evidence-based claims only
> - Compliance-checked (RICS, TPO, Property Ombudsman standards)
>
> **4. Professional Layout Design**
> - Savills brand colors, logo, fonts automatically applied
> - Page templates: Cover, Gallery, Room Features, Location, Floorplan
> - Print-ready formatting
>
> All in under 60 seconds."

**[Action: Click "Generate Brochure"]**

**[Screen: Progress tracker animating]**

**Script:**
> "Watch the progress tracker:
> - Analyzing photos... ✓
> - Enriching location data... ✓
> - Generating property description... ✓
> - Writing room descriptions... ✓
> - Building compliance checks... ✓
> - Assembling brochure layout... ✓
>
> And... **complete.**"

---

## ✏️ SECTION 7: BROCHURE EDITOR - WORD-LIKE CONTROL (13:30 - 17:00)

**[Screen: Brochure editor opens - brochure_editor_v3.html]**

**Script:**
> "This is your brochure. Professional. On-brand. Compliance-checked.
>
> But here's what separates us from every 'automated' platform out there:
>
> **You have complete creative control.**
>
> Watch—I'm clicking directly on this headline."

**[Action: Click headline text, cursor appears, start editing]**

**Script:**
> "I'm editing it. Live. In-place. Like Microsoft Word, but in a professional brochure layout.
>
> No 'edit mode.' No switching between screens. I'm working directly on the design.
>
> Now, let's say I want this opening paragraph to sound more luxurious."

**[Action: Highlight the main description paragraph]**
**[Action: Click "Transform Text" button in the AI assistant panel]**

**Script:**
> "This is the **Transform Text AI Assistant**. I can rewrite any section in 7 different styles:
>
> 1. **Professional** - Corporate, factual, Rightmove-style
> 2. **Luxury** - High-end, aspirational, Country Life magazine quality
> 3. **Family-Friendly** - Warm, homey, practical language
> 4. **Investment Focus** - ROI, yield, opportunity framing
> 5. **Modern** - Contemporary, design-focused
> 6. **Traditional** - Classic, heritage, character emphasis
> 7. **Regenerate** - Completely rewrite from scratch with new creative direction
>
> Let's make it **Luxury**."

**[Action: Click "Luxury Style"]**

**Script:**
> "Three seconds. The paragraph rewrites itself—maintaining all factual details, but now with elevated, aspirational language.
>
> Competitors give you one AI output: take it or leave it. We give you **infinite variations** until it's perfect.
>
> This is **AI as a co-pilot, not an autopilot.** You're in control."

**[Action: Click through pages]**

**Script:**
> "Let me show you the full brochure structure:
>
> **Page 1: Cover** - Hero image with property headline and price
> **Page 2: Photo Gallery** - Multiple images with captions
> **Page 3: Main Description** - Full property story with location enrichment
> **Page 4: Bedrooms** - Individual bedroom descriptions with photos
> **Page 5: Kitchen & Living** - Feature rooms highlighted
> **Page 6: Location** - Schools, transport, amenities (all auto-populated!)
> **Page 7: Floorplan** - Clean, professional layout
>
> Every page editable. Every photo can be reordered with drag-and-drop. Layout stays professional automatically."

**[Action: Navigate to Location page]**

**Script:**
> "Look at this location page. See all this data?
>
> - **Schools**: Glebelands School (Ofsted: Good) - 0.8 miles
> - **Transport**: Cranleigh Railway Station - 1.2 miles, 45 min to London Waterloo
> - **Amenities**: Waitrose - 0.3 miles, Costa Coffee - 0.2 miles, Cranleigh Leisure Centre - 0.5 miles
>
> **You didn't research any of this.** The AI did it automatically from the postcode.
>
> How long does this take manually? 20 minutes of Googling, measuring distances, checking Ofsted reports?
>
> **Automatic. Accurate. Always up-to-date.**"

---

## 🎨 SECTION 8: ADVANCED AI FEATURES - THE ECOSYSTEM (17:00 - 20:00)

**[Screen: Click "Repurpose This Brochure" button]**

**Script:**
> "Alright, brochure looks perfect. Most platforms stop here. You download a PDF. Congratulations, you still have 40 more marketing tasks ahead of you.
>
> **Not us.** Watch what happens when I click 'Repurpose.'"

**[Action: Repurpose modal opens with 7 feature cards]**

**Script:**
> "This is your **marketing command center.** From this one brochure, you can now generate:
>
> **1. AI Visual Staging** 🎨
> Empty property? Transform bare rooms into beautifully furnished spaces. Multiple design styles: Scandinavian, Modern Luxury, Traditional, Industrial. No physical staging costs (saves £500-£2000 per property).
>
> **2. Automated Video Tours** 📹
> AI-generated narrated property tour videos. Professional voiceover, background music, smooth transitions. Upload directly to YouTube, Instagram, TikTok. Zero video editing skills required.
>
> **3. Hire Photographer & Drone** 📸
> One-click booking with verified local professionals. Scheduling, payment, delivery—all handled in the platform. Coming soon: instant quotes and availability.
>
> **4. Social Media Campaigns** 📱
> Auto-generate platform-specific content:
> - Instagram carousels (10 slides optimized for swipe)
> - Facebook property posts (link preview optimized)
> - LinkedIn commercial features (professional tone)
> - TikTok short-form video scripts
> Each platform gets different formatting, different CTAs, different hashtags.
>
> **5. Email Marketing** 📧
> Targeted campaigns to your database. Segmented by budget, location preferences, property type. A/B testing built in. Open rate tracking. Click-through analytics.
>
> **6. SEO-Optimized Listings** 🔍
> Generate portal-specific descriptions:
> - Rightmove (max 80 words, compliance-checked)
> - Zoopla (different character limits, different SEO keywords)
> - OnTheMarket (unique angle, different tone)
> All variations from one source of truth.
>
> **7. Print Materials** 🖨️
> Export print-ready formats:
> - Window cards (A4, CMYK, 300dpi)
> - Magazine ads (various sizes)
> - Newspaper listings (column-width formatted)
> Bleed settings, color profiles—all handled automatically."

**[Action: Click on "AI Visual Staging" card]**

**Script:**
> "Let's look at Visual Staging. This feature alone transforms how you market vacant properties.
>
> You'd upload empty room photos, select a design style, and in 30 seconds—furnished rooms. Photorealistic AI staging.
>
> Perfect for new builds, repossessions, rental properties. **Game-changer for conversions.**"

**[Action: Close modal, return to brochure]**

---

## 💾 SECTION 9: EXPORT & DISTRIBUTION (20:00 - 21:30)

**[Screen: Click Export button in brochure editor]**

**Script:**
> "Brochure is perfect. Time to export. Multiple formats for every use case:"

**[Action: Show export options dropdown]**

- **PDF (Print)** - High resolution, CMYK, 300dpi, bleed marks
- **PDF (Digital)** - Optimized file size for email (<5MB)
- **Interactive PDF** - Clickable links, embedded virtual tour
- **Web Page** - Shareable URL, mobile-responsive, analytics tracking
- **Word Document** - Fully editable for client-requested changes
- **Images (PNG/JPG)** - Individual pages for social media posting

**Script:**
> "One brochure. Six formats. Every channel covered.
>
> And here's the detail that protects you: **every export is compliance-logged** with timestamp, content hash, and approval trail.
>
> If a client disputes something 6 months later, you have forensic-level proof of exactly what was sent and when."

**[Action: Click "Export PDF (Digital)"]**

**[Screen: Download notification]**

**Script:**
> "Downloaded. Ready to send. Ready to print. Ready to post.
>
> **Total time from photographer upload to finished brochure: 12 minutes.**
>
> Traditional manual process? 90 minutes minimum. More like 2 hours if you include location research.
>
> You just saved 1 hour and 48 minutes. **Per property.**"

---

## 📊 SECTION 10: THE BUSINESS CASE (21:30 - 23:00)

**[Screen: Stay on completed brochure or switch to dashboard if you have usage stats]**

**Script:**
> "Let's talk real numbers. Because this isn't a 'nice to have'—this is a **business transformation.**
>
> **Scenario 1: Small Independent Agency**
> - 10 new listings per month
> - 1.5 hours manual work per listing = 15 hours/month
> - At £50/hour value = £750/month in labor costs
> - Platform cost: **£99/month**
> - **Net savings: £651/month = £7,812/year**
> - Plus: Higher quality, faster turnaround, happier clients
>
> **Scenario 2: Medium Agency (3-5 Agents)**
> - 30 listings per month
> - 45 hours of manual marketing work
> - At £50/hour = £2,250/month
> - Platform cost: **£199/month** (multi-user, unlimited listings)
> - **Net savings: £2,051/month = £24,612/year**
>
> **Scenario 3: Large Agency or Franchise**
> - 100+ listings per month across multiple branches
> - You're currently paying someone £30k-£35k salary full-time for marketing
> - Platform cost: **£499/month** (enterprise, white-label, unlimited users)
> - **Net savings: £25,000+/year**
> - That employee can now do revenue-generating work (viewings, valuations, deal management)
>
> **The Real ROI**:
> - Time saved: 1.8 hours per listing
> - Quality improvement: Professional, consistent, on-brand every time
> - Collaboration efficiency: Photographer-agent workflow cuts handoff time by 70%
> - Competitive edge: First to market with professional materials
>
> This isn't a cost center. It's a **10x ROI investment.**"

---

## 🔄 SECTION 11: CONTINUOUS IMPROVEMENT (23:00 - 24:00)

**[Screen: Show feedback button or mention the machine learning aspect]**

**Script:**
> "Here's what separates us from every legacy software company in property tech:
>
> **We never stop improving.**
>
> Every time you edit AI-generated text, the system learns. Every time you prefer one photo over another, it notes the pattern. Every bit of feedback trains the model to match your style.
>
> **Machine learning that adapts to your agency.**
>
> Savills writes differently than Foxtons. Foxtons writes differently than a boutique independent. The AI learns your voice, your preferences, your brand personality.
>
> Over 3 months, the system generates copy that needs 80% less editing. Over 6 months, it's writing in your exact style from the first draft.
>
> Most software releases an update once a year. We're shipping improvements **weekly.** Your feedback from Monday becomes a feature by Friday.
>
> This platform you're seeing—**Version 10**. We launched Version 1 six months ago. That's how fast we move."

---

## 🚀 SECTION 12: THE ECOSYSTEM VISION (24:00 - 25:00)

**[Screen: Show repurpose modal again or a workflow diagram if available]**

**Script:**
> "Let me paint the full picture of where this ecosystem is going.
>
> The brochure is the **heart**. It pumps data to every organ of your marketing body:
>
> **Today (Production Ready)**:
> - Professional brochures in 12 minutes
> - Multi-tenant agency portal
> - Photographer-agent collaboration
> - AI photo categorization
> - Location enrichment
> - Transform Text assistant
> - Multi-format exports
> - Repurposing to 7 channels
>
> **Coming in Q1 2025**:
> - **AI Personal Assistant** - Your inbox auto-filtered by urgency. Client amendments flagged. Completion-critical emails prioritized. Smart notifications based on deal risk.
> - **Rightmove/Zoopla Auto-Sync** - Property details flow directly to portals. No re-entry. One source of truth.
> - **CRM Integration** - Connects to your existing systems (Alto, Reapit, Dezrez, etc.). Property data flows seamlessly.
> - **Analytics Dashboard** - Track which properties get the most brochure downloads, email opens, social engagement. Data-driven marketing decisions.
>
> You go from **author to editor.** From creating everything manually to reviewing AI-generated excellence.
>
> Your job stops being 'make marketing materials.' Your job becomes 'grow the business.'"

---

## 🎯 SECTION 13: USPs VS COMPETITORS (25:00 - 26:00)

**[Screen: Can show a comparison table or just speak over the brochure]**

**Script:**
> "Let's be direct about competition.
>
> **Traditional Design Agencies:**
> - 3-5 day turnaround
> - £200-£500 per brochure
> - No revisions without extra fees
> - No collaboration tools
> - No data enrichment
>
> **Template Platforms (Canva, etc.):**
> - Generic templates
> - You do all the work
> - No AI intelligence
> - No team collaboration
> - Static output
>
> **Property Portal Tools (Rightmove, Zoopla):**
> - Limited to their platform
> - No brochure generation
> - No photo analysis
> - No location enrichment
> - Locked into their ecosystem
>
> **Us:**
> - **12-minute turnaround** from photographer upload to finished brochure
> - **Unlimited listings** for one monthly fee
> - **Infinite AI variations** until perfect
> - **Multi-tenant collaboration** (photographers, agents, admins)
> - **Automatic location enrichment** with 7 data categories
> - **6 export formats** + full repurposing ecosystem
> - **Continuous learning** - improves with every use
> - **You stay in control** - AI assists, you approve
>
> We're not competing with design agencies. We're not competing with Canva. We're in a category of one."

---

## 🏁 CLOSING - THE CALL TO ACTION (26:00 - 28:00)

**[Screen: Return to dashboard or show a clean summary screen]**

**Script:**
> "So here's where we are.
>
> You just watched a complete agency workflow—from photographer upload to agent collaboration to AI-powered generation to professional brochure to multi-channel repurposing—executed in **12 minutes.**
>
> You've seen:
> - **Multi-tenant agency portal** with role-based access
> - **Photographer-agent collaboration** with instant notifications
> - **AI photo categorization** with quality scoring
> - **Automatic location enrichment** (schools, transport, amenities)
> - **GPT-4 copy generation** with 25 anti-jargon rules
> - **Word-like editing** with 7 transformation styles
> - **Full marketing ecosystem** (staging, video, social, email, SEO, print)
> - **6 export formats** for every use case
>
> This isn't a prototype. This is **production-ready, today.**
>
> **The Question:**
>
> How many listings do you handle per month? Multiply that by 1.8 hours. That's how much time you're losing to manual work that a machine does better, faster, cheaper.
>
> What could you do with that time? More viewings? More valuations? More negotiations? More closed deals?
>
> **What This Costs:**
>
> Less than your office coffee budget.
>
> - **Starter Plan:** £99/month - 1-2 users, 50 brochures
> - **Professional Plan:** £199/month - Up to 10 users, unlimited brochures
> - **Enterprise Plan:** £499/month - Unlimited users, white-label options, custom integrations
>
> **The Offer:**
>
> **14-day free trial.** Full access. No credit card required. Cancel anytime.
>
> If this doesn't save you 10+ hours in the first month, you shouldn't pay us.
>
> **How to Start:**
>
> Link in the description. Sign up takes 2 minutes. Upload one property. See the results.
>
> Or, if you're a larger agency with specific needs—book a custom demo. We'll walk through your workflows, integrate with your existing systems, train your entire team, set up your branding.
>
> **Final Thought:**
>
> The property industry in 2025 isn't about who has the best graphic designer. It's about who has the best **technology infrastructure.**
>
> AI isn't replacing estate agents. But estate agents **using AI** are absolutely outpacing those who don't.
>
> Early adopters aren't just saving time—they're winning more instructions because they're professional, fast, and consistent.
>
> So the question isn't 'Should I try this?' The question is: **'Can I afford to let my competitors get there first?'**
>
> Thanks for watching. See you in the platform."

**[Screen: Fade to final CTA screen]**

**Final Screen Text:**
```
🚀 Start Your Free Trial
www.doorstepai.com

Questions?
📧 hello@doorstepai.com
📞 020 XXXX XXXX

Follow us:
LinkedIn | Twitter | Instagram
```

---

## 📋 COMPLETE DEMO CHECKLIST

### Before Recording:

**✅ Backend Running:**
```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"
python -m uvicorn backend.main:app --reload --port 8000
```

**✅ Test Login Credentials:**
- Organization: Savills
- Office: London
- Photographer: photographer@savills.com (Anya Rowlings)
- Agent: james.smith@savills.com (James Smith)
- PIN: 2025

**✅ Property Data Ready:**
- Property Name: Avenue Road
- Postcode: GU6 8SE (good enrichment data)
- 4 bed, 3 bath, £1,250,000
- Address: Avenue Road, Cranleigh, Surrey
- Target: Families with Children
- Tone: Warm & Inviting

**✅ 15-20 Property Photos:**
- Cover/exterior shots
- Kitchen photos
- Multiple bedroom shots
- Bathroom photos
- Living room/dining room
- Garden/outdoor space
- One floorplan image

**✅ Browser Setup:**
- Clear cache
- Close unnecessary tabs
- Full screen mode
- Zoom: 100%
- Have photographer photos pre-uploaded OR be ready to upload live

**✅ Recording Setup:**
- Screen recording software ready (OBS, Loom, etc.)
- Microphone tested
- Script on second monitor or printed
- Do ONE practice run-through

**✅ URLs to Have Ready:**
- http://localhost:8000/static/login.html (starting point)
- http://localhost:8000/static/photographer_portal.html (photographer view)
- http://localhost:8000/static/index.html (agent dashboard)
- http://localhost:8000/static/brochure_editor_v3.html?session=XXX (editor)

---

## 🎬 PRODUCTION NOTES

**Pacing:**
- Speak with confidence and energy
- Pause after key features for visual emphasis
- Don't narrate every single click—let actions breathe
- Speed: Conversational but professional

**Tone:**
- Confident, not arrogant
- Consultative, not salesy
- Data-driven, not hype-driven
- Use "we" (team) not "I" (solo)

**Visual Editing:**
- Add text overlays for key stats (10x ROI, 12 minutes, 90% time savings)
- Speed up repetitive actions (photo uploads at 1.5-2x)
- Add zooms on important UI elements (transform text button, repurpose modal)
- Background music: subtle, professional, energetic (not distracting)
- Chapter markers for YouTube: Login, Upload, Form, Generation, Editing, Repurpose, Export

**Length Targets:**
- Full demo: 26-28 minutes
- Can create shorter versions:
  - Quick tour: 8-10 minutes (skip some detailed explanations)
  - Feature highlight: 5 minutes (just AI categorization + Transform Text)
  - ROI pitch: 3 minutes (business case only)

---

## 📊 POST-LAUNCH METRICS TO TRACK

Once published:
- **View count** (target: 1000+ views in first month)
- **Average watch time** (should be >65% completion rate)
- **Click-through rate** to trial signup (target: >5%)
- **Trial signups** within 48 hours of watching
- **Comments/questions** (respond within 24 hours—build community)
- **Social shares** (LinkedIn, Twitter)

**A/B Test Ideas:**
- Different thumbnails (person vs. UI screenshot vs. results graphic)
- Different titles ("Save 10 Hours Per Week" vs. "AI Property Marketing" vs. "Agency Automation Demo")
- Different CTAs (free trial vs. book demo vs. download case study)
- Short vs. long versions (5 min vs. 28 min)

---

## 🎯 READY TO RECORD!

This script shows the REAL V10 system with:
✅ Multi-tenant login
✅ Photographer portal
✅ Agent collaboration
✅ AI auto-categorization
✅ Location enrichment
✅ Transform Text
✅ Repurpose ecosystem
✅ Business value at every step

**This will convert. Good luck!** 🚀💪
