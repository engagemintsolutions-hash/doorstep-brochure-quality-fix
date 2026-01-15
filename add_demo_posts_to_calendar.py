"""
Inject demo posts directly into social_media_calendar.html
This makes the calendar UI populated by default for UI testing
"""

def inject_demo_posts():
    filepath = 'frontend/social_media_calendar.html'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the loadPosts function and replace it with version that includes demo posts
    old_function = '''        function loadPosts() {
            const postsJson = localStorage.getItem('scheduledPosts');
            allPosts = postsJson ? JSON.parse(postsJson) : [];
            filteredPosts = [...allPosts];

            // Update post count
            document.getElementById('postCount').textContent = `${allPosts.length} post${allPosts.length !== 1 ? 's' : ''}`;
        }'''

    new_function = '''        function getDemoPosts() {
            return [
                {
                    id: 'demo_post_1',
                    caption: '🏡 Stunning 4-bedroom family home in the heart of Didsbury\\n\\nThis beautifully presented property offers spacious living accommodation, modern kitchen with integrated appliances, and a south-facing garden perfect for entertaining.\\n\\nKey features:\\n• 4 double bedrooms\\n• 2 modern bathrooms\\n• Open-plan kitchen/dining\\n• Private garden (approx. 50ft)\\n• Off-street parking\\n\\nGuide Price: £625,000',
                    hashtags: ['#ManchesterProperty', '#DidsburyHomes', '#FamilyHome', '#PropertyForSale', '#RealEstate', '#DreamHome'],
                    images: [],
                    agentContact: { name: 'Sarah Johnson', phone: '0161 123 4567', email: 'sarah@savills.com' },
                    platforms: ['facebook', 'instagram'],
                    propertyId: 'PROP001',
                    scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_2',
                    caption: '✨ NEW TO MARKET - Luxury 2-bed apartment in MediaCityUK\\n\\nStunning waterfront views • Modern finish throughout • Secure parking\\n\\nThis exceptional apartment offers contemporary living at its finest with floor-to-ceiling windows, integrated Bosch appliances, and access to residents gym.\\n\\n£375,000\\n\\nDM for details or call 0161 XXX XXXX',
                    hashtags: ['#MediaCity', '#ManchesterApartment', '#LuxuryLiving', '#WaterfrontProperty', '#NewToMarket'],
                    images: [],
                    agentContact: { name: 'Michael Chen', phone: '0161 234 5678', email: 'michael@savills.com' },
                    platforms: ['instagram'],
                    propertyId: 'PROP002',
                    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_3',
                    caption: 'JUST LISTED: Charming 3-bedroom Victorian terrace in Chorlton\\n\\nOriginal features including high ceilings, cornicing, and fireplaces. Recently renovated kitchen and bathroom. Private rear garden. Close to Chorlton village with excellent schools nearby.\\n\\nAsking £450,000\\n\\nBook your viewing today!',
                    hashtags: ['#Chorlton', '#VictorianHome', '#ManchesterProperty', '#PeriodProperty', '#CharacterHome'],
                    images: [],
                    agentContact: null,
                    platforms: ['facebook'],
                    propertyId: 'PROP003',
                    scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_4',
                    caption: '🔑 INVESTMENT OPPORTUNITY - 2-bed apartment with rental income\\n\\nCurrently tenanted at £1,200pcm • Modern throughout • City centre location • EPC Rating: B\\n\\nIdeal for buy-to-let investors. Gross yield of 5.2%\\n\\n£275,000\\n\\nCall us for full investment pack',
                    hashtags: ['#PropertyInvestment', '#BuyToLet', '#ManchesterInvestment', '#RentalProperty', '#InvestmentProperty'],
                    images: [],
                    agentContact: { name: 'Emma Thompson', phone: '0161 345 6789', email: 'emma@savills.com' },
                    platforms: ['facebook', 'instagram'],
                    propertyId: 'PROP004',
                    scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_5',
                    caption: 'Beautiful 5-bedroom detached home in Altrincham\\n\\nThis impressive family home sits on a generous plot with landscaped gardens. Features include:\\n\\n• 5 spacious bedrooms (2 en-suite)\\n• Large living room with bi-fold doors\\n• State-of-the-art kitchen\\n• Double garage\\n• Close to top grammar schools\\n\\nOffers over £850,000',
                    hashtags: ['#Altrincham', '#FamilyHome', '#LuxuryProperty', '#CheshireHomes', '#DetachedHouse'],
                    images: [],
                    agentContact: null,
                    platforms: ['facebook'],
                    propertyId: 'PROP005',
                    scheduledTime: null,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_6',
                    caption: '🏙️ Penthouse living in the Northern Quarter\\n\\nRoof terrace with 360° views • 3 beds • 2 baths • Parking for 2\\n\\nExperience urban living at its finest in this stunning penthouse apartment. Custom-designed interiors, integrated smart home technology, and breathtaking city views.\\n\\n£595,000\\n\\nPrivate viewings available',
                    hashtags: ['#NorthernQuarter', '#PenthouseLiving', '#ManchesterLuxury', '#CityLiving', '#RoofTerrace'],
                    images: [],
                    agentContact: { name: 'James Parker', phone: '0161 456 7890', email: 'james@savills.com' },
                    platforms: ['instagram'],
                    propertyId: 'PROP006',
                    scheduledTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_7',
                    caption: 'PRICE REDUCTION - Now £325,000!\\n\\nModern 3-bedroom semi in Sale Moor. Recently refurbished, new kitchen and bathroom, private driveway, and conservatory overlooking the garden.\\n\\nDon\\'t miss out on this fantastic opportunity!\\n\\nCall to arrange viewing: 0161 XXX XXXX',
                    hashtags: ['#SaleMoor', '#PriceReduction', '#ManchesterHomes', '#PropertyDeal', '#SemiDetached'],
                    images: [],
                    agentContact: null,
                    platforms: ['facebook', 'instagram'],
                    propertyId: 'PROP007',
                    scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_8',
                    caption: 'First-time buyer special! 2-bedroom terraced house in Levenshulme\\n\\n• Perfect starter home\\n• Walking distance to train station\\n• Modern kitchen and bathroom\\n• Low maintenance rear yard\\n• Shared ownership available\\n\\n£185,000\\n\\nHelp to Buy accepted',
                    hashtags: ['#FirstTimeBuyer', '#Levenshulme', '#StarterHome', '#AffordableHomes', '#HelpToBuy'],
                    images: [],
                    agentContact: { name: 'Lisa Anderson', phone: '0161 567 8901', email: 'lisa@savills.com' },
                    platforms: ['facebook'],
                    propertyId: 'PROP008',
                    scheduledTime: null,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_9',
                    caption: '🌟 OPEN HOUSE THIS SATURDAY 2-4pm\\n\\n4-bed detached in Bramhall • Modern throughout • Double garage • Large garden\\n\\nCome see this stunning family home! No appointment necessary.\\n\\nAddress: Oak Drive, Bramhall, SK7 2XX\\n\\n£675,000',
                    hashtags: ['#OpenHouse', '#Bramhall', '#FamilyHome', '#PropertyViewing', '#Cheshire'],
                    images: [],
                    agentContact: { name: 'David Williams', phone: '0161 678 9012', email: 'david@savills.com' },
                    platforms: ['facebook', 'instagram'],
                    propertyId: 'PROP009',
                    scheduledTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                },
                {
                    id: 'demo_post_10',
                    caption: 'Country living meets modern convenience\\n\\nStunning 4-bedroom barn conversion in Cheshire countryside. Exposed beams, vaulted ceilings, underfloor heating throughout. Set in 1.5 acres with stables.\\n\\nPerfect for equestrian enthusiasts or those seeking a rural retreat while remaining close to Manchester.\\n\\nGuide Price: £925,000',
                    hashtags: ['#BarnConversion', '#CheshireProperty', '#CountryLiving', '#EquestrianProperty', '#RuralProperty', '#LuxuryHomes'],
                    images: [],
                    agentContact: null,
                    platforms: ['instagram'],
                    propertyId: 'PROP010',
                    scheduledTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                    publishedAt: null
                }
            ];
        }

        function loadPosts() {
            const postsJson = localStorage.getItem('scheduledPosts');

            // If no posts in localStorage, load demo posts
            if (!postsJson) {
                allPosts = getDemoPosts();
                localStorage.setItem('scheduledPosts', JSON.stringify(allPosts));
            } else {
                allPosts = JSON.parse(postsJson);
            }

            filteredPosts = [...allPosts];

            // Update post count
            document.getElementById('postCount').textContent = `${allPosts.length} post${allPosts.length !== 1 ? 's' : ''}`;
        }'''

    # Replace the function
    content = content.replace(old_function, new_function)

    # Write the updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Demo posts injected into calendar page!")
    print("  - Calendar will now show 10 demo posts on first load")
    print("  - Posts are stored in localStorage for persistence")
    print("  - Visit http://localhost:8000/frontend/social_media_calendar.html to see")

if __name__ == '__main__':
    inject_demo_posts()
