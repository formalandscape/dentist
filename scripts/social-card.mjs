import sharp from 'sharp'
await sharp('public/images/social-card.svg').png().toFile('public/images/social-card.png')
