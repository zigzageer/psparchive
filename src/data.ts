export type PSPModel = {
  id: string;
  name: string;
  year: string;
  description: string;
  colors: { name: string; hex: string; type: 'standard' | 'limited'; imageUrl?: string }[];
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
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp-1000-pb-piano-black-playstation-portable-color-variation.png"
      },
      {
        "name": "Ceramic White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp-1000-cw-ceramic-white-playstation-portable-color-variation.png"
      },
      {
        "name": "Pink",
        "hex": "#FFC0CB",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_1000-pink.png"
      },
      {
        "name": "Metallic Blue",
        "hex": "#2A52BE",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/metallic-blue-psp-1000-altar-of-gaming.png"
      },
      {
        "name": "Champagne Gold",
        "hex": "#F7E7CE",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/champagne-gold-psp-1000-altar-of-gaming.png"
      },
      {
        "name": "Coca-cola",
        "hex": "#F40009",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/coca-cola-psp-1000-altar-of-gaming.png"
      },
      {
        "name": "Metal Gear Solid Portable Ops",
        "hex": "#555D50",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/metal-gear-solid-black-ops-psp-1000-altar-of-gaming.png"
      },
      {
        "name": "Signature Model 000001 Tsukimi",
        "hex": "#1A1A1A",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/signature-model-000001-tsukimi-psp-1000-altar-of-gaming.png"
      },
      {
        "name": "Signature Model 000002 Kachofugetsu",
        "hex": "#1A1A1A",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/signature-model-000002-kachofugetsu-psp-1000-altar-of-gaming.png"
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
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/piano-black-psp-2000-altar-of-gaming-1.png"
      },
      {
        "name": "Ceramic White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/ceramic-white-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Ice Silver",
        "hex": "#C0C0C0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/ice-silver-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Rose Pink",
        "hex": "#FF66CC",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/rose-pink-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Lavender Purple",
        "hex": "#E6E6FA",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/lavender-purple-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Felicia Blue",
        "hex": "#6699FF",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/felicia-blue-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Mint Green",
        "hex": "#98FF98",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mint-green-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Deep Red",
        "hex": "#8B0000",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/deep-red-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Matte Bronze",
        "hex": "#CD7F32",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/matte-bronze-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Metallic Blue",
        "hex": "#2A52BE",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/metallic-blue-psp-2000-altar-of-gaming.png"
      },
      {
        "name": "Final Fantasy VII 10th Anniversary",
        "hex": "#C0C0C0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/final-fantasy-psp-2000-altar-of-gaming-front.png"
      },
      {
        "name": "God of War Chains of Olympus",
        "hex": "#8B0000",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-chains-of-olympus-psp-2000-altar-of-gaming-front.png"
      },
      {
        "name": "Mobile Suit Gundam Giren no Yabou",
        "hex": "#8B0000",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mobile-suit-gundam-giren-no-yabou-psp-2000-altar-of-gaming-front.png"
      },
      {
        "name": "Monster Hunter Portable 2nd G Hunter Pack",
        "hex": "#B87333",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-2nd-g-hunter-pack-psp-2000-altar-of-gaming-front.png"
      },
      {
        "name": "Spider-Man Edition",
        "hex": "#8B0000",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/spider-man-psp-2000-altar-of-gaming-front.png"
      },
      {
        "name": "Star Wars Battlefront Renegade Squadron",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/star-wars-psp-2000-altar-of-gaming-front.png"
      },
      {
        "name": "The Simpsons",
        "hex": "#FFD90F",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/the-simpson-psp-2000-altar-of-gaming-front.png"
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
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/piano-black-psp-3000-altar-of-gaming-1.png"
      },
      {
        "name": "Pearl White",
        "hex": "#FDFDD0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/pearl-white-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Mystic Silver",
        "hex": "#C0C0C0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mystic-silver-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Radiant Red",
        "hex": "#FF0000",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/radiant-red-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Vibrant Blue",
        "hex": "#0000FF",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/vibrant-blue-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Spirited Green",
        "hex": "#00FF00",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/spirited-green-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Blossom Pink",
        "hex": "#FFB6C1",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/blossom-pink-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Bright Yellow",
        "hex": "#FFFF00",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/bright-yellow-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Lilac Purple",
        "hex": "#C8A2C8",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/lilac-purple-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Marine Blue",
        "hex": "#000080",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/marine-blue-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Turquoise Green",
        "hex": "#40E0D0",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/turquoise-green-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Red/Black Value Pack",
        "hex": "#800000",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/black-red-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "White Blue",
        "hex": "#87CEEB",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-blue-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "AKB1/48 Premier",
        "hex": "#FF69B4",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-AKB148-Premier-front-altar-of-gaming.png"
      },
      {
        "name": "Dissidia 012 Duodecim Final Fantasy",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/dissidia-012-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Dissidia: Final Fantasy 20th Anniversary",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/dissidia-final-fantasy-20th-anniverasry-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "God of War Ghost of Sparta",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gow-ghost-of-sparta-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Gran Turismo Edition",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/psp_3000-gran-turismo-altar-of-gaming.png"
      },
      {
        "name": "Gundam Vs Gundam",
        "hex": "#C0C0C0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/gundam-vs-gundam-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Hatsune Miku Project Diva 2nd Pack",
        "hex": "#40E0D0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/08/hatsune-miku-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Kingdom Hearts Birth by Sleep Edition",
        "hex": "#C0C0C0",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/kingdom-heart-birth-by-sleep-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Metal Gear Solid Peace Walker Edition",
        "hex": "#556B2F",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/mgs-peace-walker-psp-3000-altar-of-gaming.png"
      },
      {
        "name": "Monster Hunter Portable Black Golden Limited",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/monster-hunter-portable-blackgolden-limited-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "One Piece Edition",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/one-piece-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Uta No Prince Console",
        "hex": "#F5F5F5",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/uta-no-prince-psp-3000-altar-of-gaming-front.png"
      },
      {
        "name": "Winning Eleven 2010",
        "hex": "#111111",
        "type": "limited",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/winning-eleven-2010-psp-3000-altar-of-gaming-front.png"
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
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/black-psp-go-altar-of-gaming.png"
      },
      {
        "name": "White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-psp-go-altar-of-gaming.png"
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
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/black-psp-street-altar-of-gaming.png"
      },
      {
        "name": "White",
        "hex": "#F5F5F5",
        "type": "standard",
        "imageUrl": "https://assets.altarofgaming.com/wp-content/uploads/2022/06/white-psp-street-altar-of-gaming.png"
      }
    ]
  }
];
