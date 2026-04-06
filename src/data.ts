export type PSPModel = {
  id: string;
  name: string;
  year: string;
  description: string;
  colors: { name: string; hex: string; type: 'standard' | 'limited'; imageUrl?: string; backImageUrl?: string; description: string }[];
};

export const pspData: PSPModel[] = [
  {
    "id": "psp-1000",
    "name": "PSP-1000",
    "year": "2004",
    "description": "The original PlayStation Portable, thicker and heavier than subsequent models.",
    "colors": [
      {
        "name": "Piano Black",
        "hex": "#111111",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp-1000-pb-piano-black-playstation-portable-color-variation.png",
        "description": "The original launch color of the PlayStation Portable, featuring a sleek, glossy black finish that defined the system's premium aesthetic."
      },
      {
        "name": "Ceramic White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp-1000-cw-ceramic-white-playstation-portable-color-variation.png",
        "description": "Released as a stylish alternative to the original black, offering a clean, glossy white finish that became highly sought after."
      },
      {
        "name": "Pink",
        "hex": "#FFC0CB",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_1000-pink.png",
        "description": "A vibrant pink edition introduced to appeal to a broader demographic, often bundled with fashion or pop-culture titles."
      },
      {
        "name": "Metallic Blue",
        "hex": "#2A52BE",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/metallic-blue-psp-1000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/metallic-blue-back-side-psp-1000-altar-of-gaming.png",
        "description": "A striking metallic blue variant, adding a premium sheen to the classic thick PSP-1000 chassis."
      },
      {
        "name": "Champagne Gold",
        "hex": "#F7E7CE",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/champagne-gold-psp-1000-altar-of-gaming.png",
        "description": "An elegant gold finish, often released in limited quantities or specific regions to commemorate special milestones."
      },
      {
        "name": "Coca-cola",
        "hex": "#F40009",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/coca-cola-psp-1000-altar-of-gaming.png",
        "description": "An extremely rare promotional model featuring the iconic Coca-Cola red and branding, exclusively available through special Japanese promotions."
      },
      {
        "name": "Metal Gear Solid Portable Ops",
        "hex": "#555D50",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/metal-gear-solid-black-ops-psp-1000-altar-of-gaming.png",
        "description": "A limited edition featuring a camouflage pattern, bundled with the highly anticipated Metal Gear Solid: Portable Ops."
      },
      {
        "name": "Signature Model 000001 Tsukimi",
        "hex": "#1A1A1A",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/signature-model-000001-tsukimi-psp-1000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/signature-model-000001-tsukimi-back-side-psp-1000-altar-of-gaming.png",
        "description": "An ultra-rare premium edition featuring traditional Japanese aesthetics and high-quality materials."
      },
      {
        "name": "Signature Model 000002 Kachofugetsu",
        "hex": "#1A1A1A",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/signature-model-000002-kachofugetsu-psp-1000-altar-of-gaming.png",
        "description": "Another exquisite premium model showcasing traditional Japanese art motifs, aimed at collectors."
      }
    ]
  },
  {
    "id": "psp-2000",
    "name": "PSP-2000",
    "year": "2007",
    "description": "Also known as the \"Slim & Lite\", featuring a lighter, thinner design.",
    "colors": [
      {
        "name": "Piano Black",
        "hex": "#111111",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/piano-black-psp-2000-altar-of-gaming-1.png",
        "description": "The standard glossy black finish, now on the lighter and slimmer PSP-2000 chassis."
      },
      {
        "name": "Ceramic White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/ceramic-white-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/ceramic-white-back-side-psp-2000-altar-of-gaming.png",
        "description": "A crisp white finish for the Slim & Lite model, maintaining the glossy, premium look."
      },
      {
        "name": "Ice Silver",
        "hex": "#C0C0C0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/ice-silver-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/ice-silver-back-side-psp-2000-altar-of-gaming.png",
        "description": "A sleek, metallic silver finish that highlighted the thinner profile of the PSP-2000."
      },
      {
        "name": "Rose Pink",
        "hex": "#FF66CC",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/rose-pink-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/rose-pink-back-side-psp-2000-altar-of-gaming.png",
        "description": "A soft, metallic pink variation introduced to expand the color lineup for the Slim & Lite."
      },
      {
        "name": "Lavender Purple",
        "hex": "#E6E6FA",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/lavender-purple-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/lavender-purple-back-side-psp-2000-altar-of-gaming.png",
        "description": "A pastel purple finish, offering a unique and softer aesthetic choice."
      },
      {
        "name": "Felicia Blue",
        "hex": "#6699FF",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/felicia-blue-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/felicia-blue-back-side-psp-2000-altar-of-gaming.png",
        "description": "A bright, vibrant blue color option, adding a pop of color to the PSP-2000 range."
      },
      {
        "name": "Mint Green",
        "hex": "#98FF98",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mint-green-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/mint-green-back-side-psp-2000-altar-of-gaming.png",
        "description": "A fresh, pastel green colorway, part of the expanded 'Blossom' color series."
      },
      {
        "name": "Deep Red",
        "hex": "#8B0000",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/deep-red-psp-2000-altar-of-gaming.png",
        "description": "A rich, dark red finish featuring a metallic sheen, offering a bold and sophisticated look."
      },
      {
        "name": "Matte Bronze",
        "hex": "#CD7F32",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/matte-bronze-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/matte-bronze-back-side-psp-2000-altar-of-gaming.png",
        "description": "A unique matte finish in a bronze tone, providing a more subdued and less fingerprint-prone option."
      },
      {
        "name": "Metallic Blue",
        "hex": "#2A52BE",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/metallic-blue-psp-2000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/metallic-blue-back-side-psp-2000-altar-of-gaming.png",
        "description": "A deep, reflective blue finish that gave the Slim & Lite a highly premium appearance."
      },
      {
        "name": "Final Fantasy VII 10th Anniversary",
        "hex": "#C0C0C0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/final-fantasy-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/final-fantasy-psp-2000-altar-of-gaming-back.png",
        "description": "A highly coveted limited edition featuring a silver chassis with engraved Final Fantasy VII artwork, bundled with Crisis Core."
      },
      {
        "name": "God of War Chains of Olympus",
        "hex": "#8B0000",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-chains-of-olympus-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-chains-of-olympus-psp-2000-altar-of-gaming-back.png",
        "description": "A striking deep red model featuring Kratos' face on the rear, bundled with the epic action game."
      },
      {
        "name": "Mobile Suit Gundam Giren no Yabou",
        "hex": "#8B0000",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mobile-suit-gundam-giren-no-yabou-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mobile-suit-gundam-giren-no-yabou-psp-2000-altar-of-gaming-back.png",
        "description": "A special edition featuring a unique red and black color scheme inspired by the Gundam universe."
      },
      {
        "name": "Monster Hunter Portable 2nd G Hunter Pack",
        "hex": "#B87333",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-2nd-g-hunter-pack-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-2nd-g-hunter-pack-psp-2000-altar-of-gaming-back.png",
        "description": "A matte bronze edition bundled with the incredibly popular Monster Hunter game, featuring custom decals."
      },
      {
        "name": "Spider-Man Edition",
        "hex": "#8B0000",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/spider-man-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/spider-man-psp-2000-altar-of-gaming-back.png",
        "description": "A bold red and black model released alongside the Spider-Man movie, featuring web motifs."
      },
      {
        "name": "Star Wars Battlefront Renegade Squadron",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/star-wars-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/star-wars-psp-2000-altar-of-gaming-back.png",
        "description": "A crisp white model featuring a Darth Vader silkscreen on the back, bundled with the Star Wars game."
      },
      {
        "name": "The Simpsons",
        "hex": "#FFD90F",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/the-simpson-psp-2000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/the-simpson-psp-2000-altar-of-gaming-back.png",
        "description": "A bright, unmistakable yellow model released in tandem with The Simpsons Game."
      }
    ]
  },
  {
    "id": "psp-3000",
    "name": "PSP-3000",
    "year": "2008",
    "description": "Introduced an improved LCD screen with an increased color range and built-in microphone.",
    "colors": [
      {
        "name": "Piano Black",
        "hex": "#111111",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/piano-black-psp-3000-altar-of-gaming-1.png",
        "description": "The classic glossy black, now featuring the improved high-contrast LCD screen and built-in microphone."
      },
      {
        "name": "Pearl White",
        "hex": "#FDFDD0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/pearl-white-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/pearl-white-back-cover-psp-3000-altar-of-gaming.png",
        "description": "A pearlescent white finish that sparkles subtly under light, complementing the vibrant new screen."
      },
      {
        "name": "Mystic Silver",
        "hex": "#C0C0C0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mystic-silver-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/mystic-silver-back-cover-psp-3000-altar-of-gaming.png",
        "description": "A refined metallic silver finish, offering a sleek and modern look for the PSP-3000."
      },
      {
        "name": "Radiant Red",
        "hex": "#FF0000",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/radiant-red-psp-3000-altar-of-gaming.png",
        "description": "Released as part of the 'Carnival Colors' series, this vibrant red model was offered in a Value Pack for the holiday season."
      },
      {
        "name": "Vibrant Blue",
        "hex": "#0000FF",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/vibrant-blue-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/vibrant-blue-back-psp-3000-altar-of-gaming.png",
        "description": "A bright, energetic blue finish, also part of the eye-catching 'Carnival Colors' lineup."
      },
      {
        "name": "Spirited Green",
        "hex": "#00FF00",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/spirited-green-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/spirited-green-back-side-psp-3000-altar-of-gaming.png",
        "description": "A lively, bright green colorway introduced to add more vibrant options to the PSP-3000 family."
      },
      {
        "name": "Blossom Pink",
        "hex": "#FFB6C1",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/blossom-pink-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/blossom-pink-back-side-psp-3000-altar-of-gaming.png",
        "description": "A soft, floral pink finish, continuing the tradition of pastel options for the portable console."
      },
      {
        "name": "Bright Yellow",
        "hex": "#FFFF00",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/bright-yellow-psp-3000-altar-of-gaming.png",
        "description": "A bold, sunny yellow finish, standing out as one of the most vibrant standard colors available."
      },
      {
        "name": "Lilac Purple",
        "hex": "#C8A2C8",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/lilac-purple-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/lilac-purple-back-side-psp-3000-altar-of-gaming.png",
        "description": "A gentle pastel purple, offering a unique and stylish alternative to the standard colors."
      },
      {
        "name": "Marine Blue",
        "hex": "#000080",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/marine-blue-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/marine-blue-psp-3000-altar-of-gaming-back.png",
        "description": "A deep, ocean-inspired blue finish, providing a darker alternative to the Vibrant Blue."
      },
      {
        "name": "Turquoise Green",
        "hex": "#40E0D0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/turquoise-green-psp-3000-altar-of-gaming.png",
        "description": "A bright, tropical green-blue finish, adding to the extensive color palette of the PSP-3000."
      },
      {
        "name": "Red/Black Value Pack",
        "hex": "#800000",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/black-red-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/back-black-red-psp-3000-altar-of-gaming.png",
        "description": "A striking dual-tone model featuring a black faceplate and red rear, offering a unique contrast."
      },
      {
        "name": "White Blue",
        "hex": "#87CEEB",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-blue-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/white-blue-back-side-psp-3000-altar-of-gaming.png",
        "description": "A fresh dual-tone design combining a white front with a blue back, creating a sporty aesthetic."
      },
      {
        "name": "AKB1/48 Premier",
        "hex": "#FF69B4",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-AKB148-Premier-front-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-AKB148-Premier-back-altar-of-gaming.png",
        "description": "A special edition featuring pink accents and custom themes, dedicated to the popular Japanese idol group AKB48."
      },
      {
        "name": "Dissidia 012 Duodecim Final Fantasy",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/dissidia-012-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/dissidia-012-psp-3000-altar-of-gaming-back.png",
        "description": "A stunning pearl white model featuring intricate artwork of Chaos and Cosmos from the Final Fantasy universe."
      },
      {
        "name": "Dissidia: Final Fantasy 20th Anniversary",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/dissidia-final-fantasy-20th-anniverasry-psp-3000-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/dissidia-final-fantasy-20th-anniverasry-back-side-psp-3000-altar-of-gaming.png",
        "description": "A limited edition white model with elegant Final Fantasy 20th Anniversary artwork on the rear."
      },
      {
        "name": "God of War Ghost of Sparta",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-ghost-of-sparta-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-ghost-of-sparta-psp-3000-altar-of-gaming-back.png",
        "description": "A sleek black and red model featuring striking God of War artwork, bundled with the game."
      },
      {
        "name": "Gran Turismo Edition",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-gran-turismo-altar-of-gaming.png",
        "description": "A sleek, automotive-inspired black model featuring the Gran Turismo logo, bundled with the racing simulator."
      },
      {
        "name": "Gundam Vs Gundam",
        "hex": "#C0C0C0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gundam-vs-gundam-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gundam-vs-gundam-psp-3000-altar-of-gaming-back.png",
        "description": "A metallic silver edition featuring custom Gundam artwork and themes."
      },
      {
        "name": "Hatsune Miku Project Diva 2nd Pack",
        "hex": "#40E0D0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/hatsune-miku-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/hatsune-miku-back-psp_3000-altar-of-gaming.png",
        "description": "A vibrant turquoise model matching Hatsune Miku's signature color, featuring custom decals."
      },
      {
        "name": "Kingdom Hearts Birth by Sleep Edition",
        "hex": "#C0C0C0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/kingdom-heart-birth-by-sleep-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/kingdom-heart-birth-by-sleep-psp-3000-altar-of-gaming-back.png",
        "description": "A beautiful silver model adorned with Kingdom Hearts motifs, bundled with the highly anticipated prequel."
      },
      {
        "name": "Metal Gear Solid Peace Walker Edition",
        "hex": "#556B2F",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mgs-peace-walker-psp-3000-altar-of-gaming.png",
        "description": "A unique camouflage green model, perfectly matching the military theme of Peace Walker."
      },
      {
        "name": "Monster Hunter Portable Black Golden Limited",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-blackgolden-limited-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-blackgolden-limited-psp-3000-altar-of-gaming-back.png",
        "description": "A premium black model with elegant gold accents and Monster Hunter guild emblems."
      },
      {
        "name": "One Piece Edition",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/one-piece-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/one-piece-psp-3000-altar-of-gaming-back.png",
        "description": "A special edition featuring artwork of the Straw Hat Pirates, released for fans of the hit anime."
      },
      {
        "name": "Uta No Prince Console",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/uta-no-prince-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/uta-no-prince-psp-3000-altar-of-gaming-back.png",
        "description": "A limited edition model featuring custom artwork and themes based on the popular visual novel series."
      },
      {
        "name": "Winning Eleven 2010",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/winning-eleven-2010-psp-3000-altar-of-gaming-front.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/winning-eleven-2010-psp-3000-altar-of-gaming-back.png",
        "description": "A special edition bundled with the popular soccer title, featuring custom branding."
      }
    ]
  },
  {
    "id": "psp-go",
    "name": "PSP Go",
    "year": "2009",
    "description": "A redesign featuring a sliding screen that reveals the controls, lacking a UMD drive.",
    "colors": [
      {
        "name": "Black",
        "hex": "#111111",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/black-psp-go-altar-of-gaming.png",
        "description": "The standard sleek black finish for the sliding PSP Go, emphasizing its compact, pocketable design."
      },
      {
        "name": "White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-psp-go-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/white-back-side-psp-go-altar-of-gaming.png",
        "description": "A clean, glossy white finish that highlights the futuristic sliding mechanism of the digital-only PSP Go."
      }
    ]
  },
  {
    "id": "psp-street",
    "name": "PSP Street",
    "year": "2011",
    "description": "A budget model released in PAL regions, lacking Wi-Fi connectivity and featuring a matte finish.",
    "colors": [
      {
        "name": "Black",
        "hex": "#111111",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/black-psp-street-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/black-back-side-psp-street-altar-of-gaming.png",
        "description": "A cost-effective matte black finish, designed to be durable and fingerprint-resistant for the budget-friendly PSP Street."
      },
      {
        "name": "White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-psp-street-altar-of-gaming.png",
        "backImageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/white-back-side-psp-street-altar-of-gaming.png",
        "description": "A matte white finish offered as a clean alternative for the budget-conscious, PAL-exclusive PSP Street."
      }
    ]
  }
];
