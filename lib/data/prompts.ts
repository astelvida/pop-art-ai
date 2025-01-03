import { shuffle } from 'lodash'

export const PROMPTS = {
  fresh_meat: [
    "A striking pop art comic book scene features a glamorous woman with exaggerated facial features, her expression a blend of despair and defiance, capturing the turmoil of society's relentless beauty standards. Her hair, a vibrant cascade of candy-colored strands, contrasts sharply with the stark graphic lin  es that dissect the vibrant color field. In a cleverly designed speech bubble, emblazoned with a bold, comic-style font in electric blue, it proclaims, 'Why isn't beauty enough?' The background is a dizzying blend of abstract shapes and colors, evoking the chaotic nature of modern beauty standards, while a series of pill bottles artfully interspersed among the vibrant elements comment on the all-too-common reliance on substances to meet these unattainable ideals, creating an ironic juxtaposition between allure and sadness.",
    "Within a dynamic pop art comic book composition, a woman stands alone, her exaggerated wide eyes encapsulating the anxiety felt under the weight of societal expectations. With her mouth agape, she gasps, 'Is this what happiness looks like?'—the speech bubble bursting forth in a playful yet unsettling hot pink font that captures the viewer's attention. The background, a swirling vortex of monochromatic tones, symbolizes the overwhelming pressure and noise of the outside world, while the figure is adorned with opulent yet hollow symbols of wealth, like diamond-studded sunglasses and a designer handbag. This satirical take on wealth and beauty criticism reveals the empty pursuit hidden behind society's glamorous façade, a hallmark of Lichtenstein's style.",
    "The pop art comic book illustration features a heartbroken woman, her stylized tears cascading down like comic book raindrops, as she gazes at her shattered reflection in a cracked mirror. Her expression radiates both despair and longing, captured beautifully with bold, expressive lines. Above her, a speech bubble dramatically states, 'Why can't I just be me?' rendered in a cacophony of vibrant yellows and blacks that holds the chaotic essence of the comic style. In the background, a cityscape filled with towering, gleaming skyscrapers symbolizes the unreachable ideals and superficial nature of fame, while heavy shadows loom, representing the oppressive patriarchy she seeks to escape. This piece combines high-brow humor with stark criticism, showcasing the internal struggles of individuals against societal norms.",
    "Capturing a moment of profound irony, this pop art comic book piece depicts a confidently smiling woman holding a cocktail adorned with colorful pills, her glistening lipstick oozing a cheeky charm. The powerful visual expression of her eyes embodies a facade of serenity that contrasts with the chaotic world surrounding her, filled with screaming advertisements promoting unrealistic beauty. A vibrant green and orange speech bubble bursts with the question, 'What's a little dopamine on the side?' in a punchy, stylized font indicative of classic comic book aesthetics. The background, drenched in splashes of color and drama, accentuates the absurdity of glossing over deep-rooted issues of addiction and superficiality, all while embracing Lichtenstein's tongue-in-cheek sensibility.",
    "This captivating pop art comic book tableau centers on a distinguished woman, elegantly seated amidst an assemblage of discarded beauty products and empty champagne bottles, with an expression suffused with irony that questions the price of perfection. Her speech bubble exclaims, 'Cheers to the emptiness!' in an exaggerated, retro font colored in shades of shimmering gold. The setting is crafted with swirls of pastel shades, reflecting an atmosphere that mixes glamor with an unsettling sense of hollowness, as pastel-hued clouds swirl menacingly overhead. Each element in the background acts as a stark reminder of the societal standards that ensnare women, echoing themes of critique towards the pursuit of unrealistic beauty, while the artistic execution echoes the playful yet poignant artistry reminiscent of Lichtenstein's golden era.",
  ],
  general: [
    "a woman crying silently in a crowded room, feeling invisible. The scene is in pop art style with dark undertones, reflecting sadness and isolation. Speech Bubble: 'Can anyone see me?'",
    "a man staring at his shattered reflection in a broken mirror, his face twisted in anger and despair. The pop art style emphasizes his frustration. There is a well-defined speech bubble with the exact text, 'This isn't who I am!'",
    "a person lost in a confusing labyrinth, feeling hopeless. The scene is dark, showing mental breakdown. In the image, a clear and accurate speech bubble says, 'Will I ever escape this maze?'",
    "a young woman sitting in a dimly lit room, staring at an empty phone screen, waiting. There is a speech bubble above her that reads, 'I thought you'd call.'",
    "a couple standing under a stormy sky, locked in an intense argument. The pop art design shows emotional tension and sadness. There is a prominent speech bubble containing the precise text, 'You never listened!'",
    "a character tearing up a photograph, their face showing bitter sarcasm. The pop art style enhances the sense of brokenness and emotional turmoil. There is a clear and well-rendered speech bubble with the text, 'Happily ever after—what a joke!'",
    "a woman sitting alone on a park bench at night, looking defeated. The scene is dark and melancholic, with a speech bubble that says, 'I don't know how much longer I can keep pretending.'",
    "a manson walking away from a house engulfed in flames, their face expressionless. A speech bubble behind them reads, 'I had no choice.' Ensure the text in the speech bubble is clearly readable and precisely rendered.",
    "a woman drowning in a pool of her own tears, her face reflecting despair. In a speech bubble, she mutters, 'Why does it hurt so much?' The speech bubble text should be clear and properly displayed.",
    "a man standing on a bridge, looking down at the water, contemplating. The pop art design is filled with dark tones, and the speech bubble says, 'Would anyone even notice?' Ensure the speech bubble text is clearly legible and not distorted.",
    "a couple, their backs turned to each other in a dark room filled with broken glass. The woman has a speech bubble with the exact text: 'We were never meant to last, were we ?'. The speech bubble text is accurate, no extra words or letters. Both characters are lost in their own despair.",
    "a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' The speech bubble text is accurate, no extra words or letters. Her face reflects anger and deep sorrow.",
    "a woman standing alone in a dimly lit room, tears streaming down her face as she clutches a broken mirror. Speech bubble: 'How did it all go wrong?'",
    "a man and woman in a heated argument, the man turning away in anger while the woman shouts, 'You never listened!' Their broken relationship is the focus.",
    "a young woman staring out a rainy window, her reflection distorted by tears. Speech bubble: 'It’s always the same, isn’t it?' Sadness and despair fill the scene.",
    "a man kneeling on the floor, holding his head in his hands, overwhelmed by his own thoughts. Speech bubble: 'I can’t take this anymore!'",
    "two young lovers saying goodbye at a train station, the train’s shadow casting a line between them. Speech bubble: 'Goodbye forever.' Their faces are filled with regret.",
    "a woman crying while applying lipstick in a broken compact mirror. Speech bubble: 'I have to smile through this, don’t I?' Despair is hidden under vibrant colors.",
    "a man shouting in frustration, smashing his fist against a wall. Speech bubble: 'It’s all falling apart!' His anger contrasts with the bold, exaggerated lines.",
    "a woman walking away from a shattered phone, tears running down her face. Speech bubble: 'I should have known you’d never call.' Broken pieces symbolize her emotional breakdown.",
    "a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' Her face reflects anger and deep sorrow.",
    "a couple, their backs turned to each other in a dark room filled with broken glass. Speech bubble from the woman: 'We were never meant to last, were we?' Both characters are lost in their own despair.",
  ],
  sarcastic: [
    "a woman surrounded by a pile of work, smiling sarcastically. Speech bubble: 'Sure, I love working overtime for free!' The exaggerated smile contrasts with her exhausted eyes.",
    "a man standing in traffic, rolling his eyes. Speech bubble: 'Oh great, just what I needed today!' His annoyance is highlighted by the vibrant city colors.",
    "a woman with a broken heel, wincing in pain. Speech bubble: 'Perfect! Exactly how I wanted this day to go.' Her frustration pops against the bold background.",
    "a man holding an empty wallet, laughing sarcastically. Speech bubble: 'Money well spent, I’m sure!' His exaggerated grin contrasts with the bright, gaudy colors.",
    "a woman talking to her cat, who’s knocked over a vase. Speech bubble: 'Of course, I wasn’t using that anyway.' Her eyes are filled with faux amusement.",
    "a man holding a burnt toast, staring at it blankly. Speech bubble: 'Breakfast of champions, obviously.' His frustration contrasts with the colorful kitchen.",
    "a woman looking at a flat tire, smirking. Speech bubble: 'Just my luck! Couldn’t be better timing.' Her sarcasm stands out in the bold, saturated colors.",
    "a man getting rained on while holding a closed umbrella. Speech bubble: 'I mean, who needs an umbrella anyway?' His dry humor is mirrored by the bright, ironic colors.",
    "a woman on the phone with customer service, eyes rolling. Speech bubble: 'Yes, your service has been very helpful. Totally.' Her sarcastic smile contrasts with the vibrant background.",
    "a man holding a tiny, empty gift box, raising an eyebrow. Speech bubble: 'Oh, you shouldn’t have. Really, you shouldn’t have.' His sarcastic delight is highlighted with the bold, colorful patterns.",
  ],
  witty: [
    "a woman staring at a bouquet of dead flowers. Speech bubble: 'Well, at least they lasted longer than you did.' Her dry humor contrasts with the once-bright petals.",
    "a man holding a love letter and smirking. Speech bubble: 'Oh, another apology letter? How original.' His face reflects weary sarcasm amidst the vibrant background.",
    "a woman sitting by herself at a fancy dinner table. Speech bubble: 'Ah, nothing like a romantic dinner for one.' Her forced smile contrasts with the empty chair opposite her.",
    "a man looking at a framed photo of his ex. Speech bubble: 'We were such a great team at making bad decisions.' His ironic smile highlighted by the bright pop colors.",
    "a woman wiping away tears with a tissue. Speech bubble: 'I swear, my mascara loves drama more than I do.' Her watery eyes sparkle against the exaggerated makeup colors.",
    "a man watching a romantic movie alone, popcorn in hand. Speech bubble: 'Yeah, sure, love conquers all—except my life, apparently.' His sarcastic expression stands out in the vivid color scheme.",
    "a woman tearing up an old love letter. Speech bubble: 'You said forever, but I guess you meant two months.' Her eyes roll dramatically, contrasting the bold colors around her.",
    "a couple arguing in the kitchen, the man holding a burnt meal. Speech bubble from the woman: 'Just like our relationship, overcooked and bitter.' Her expression is a mix of annoyance and amusement.",
    "a woman sitting by the phone, smirking. Speech bubble: 'Of course you’ll call—right after pigs fly and hell freezes over.' Her sarcastic smile is paired with the exaggerated brightness of the phone.",
    "a man sitting alone on a bench, with a suitcase beside him. Speech bubble: 'Guess I packed too much trust, not enough common sense.' His eyes show sadness under his sarcastic smile, set against the vibrant surroundings.",
  ],
  sarcastic_no_speech_bubbles: [
    'a woman sitting alone at a fancy restaurant, dramatically raising a glass of champagne while rolling her eyes.',
    'a man holding a box of chocolates, realizing they’re all empty, with a look of forced amusement.',
    "a woman putting a 'Welcome Back' banner in the trash, her expression mixing exhaustion and sarcasm.",
    'a couple standing on opposite sides of a broken heart-shaped mirror, each one looking away with an exaggerated sigh.',
    'a man throwing a love letter into a fireplace, his face filled with an exaggerated, sarcastic smile.',
    'a woman in bed, surrounded by a pile of tissues, staring at a romantic movie poster on the wall with an eye-roll.',
    'a man trying to fix a broken heart-shaped necklace, with a smirk that says he knows it’s pointless.',
    'a woman staring at a shattered snow globe with a once-romantic scene inside, her face filled with ironic disappointment.',
    'a man sitting in front of a birthday cake with only one slice missing, his forced smile revealing a sarcastic acceptance of his loneliness.',
    'a woman in front of a mailbox, holding a stack of unopened letters, with an unimpressed, sarcastic expression.',
  ],
  complex: [
    "a stylish woman with exaggerated, tear-filled eyes and vibrant Life Magazine red lips stands at the edge of a bustling cityscape, clutching a shattered mirror that reflects distorted fragments of her face adorned with Ben-Day dots. Her flowing hair cascades in waves of acid yellow and purplish-blue, dramatically framing her anguished expression. The background is a chaotic blend of towering skyscrapers in dull green and swirling shapes, symbolizing the overwhelming pursuit of fame and beauty. Dynamic lines and vibrant colors add a sense of motion and drama to the scene. A bold speech bubble with crisp lettering hovers beside her, declaring, 'Is chasing perfection my only flaw?' The image satirically pokes fun at impossible beauty standards with tongue-in-cheek, high-brow humor.",
    "an anxious woman with exaggerated wide eyes and vibrant Life Magazine red lips sits at a desk piled high with stacks of money, yet looks unsatisfied. Her face is adorned with Ben-Day dots, and her hair flows in dramatic waves of acid yellow and purplish-blue. The background is a swirl of dull green and bold shapes, representing the emptiness of material wealth. A dynamic speech bubble with crisp lettering states: 'Why does success still feel so empty?' The image humorously critiques the pursuit of money at the expense of happiness.",
    'a woman with exaggerated, tear-filled eyes and vibrant Life Magazine red lips stands at the edge of a bustling cityscape, clutching a shattered mirror that reflects distorted fragments of her face adorned with Ben-Day dots. Her flowing hair cascades in waves of acid yellow and purplish-blue, dramatically framing her anguished expression. The background is a chaotic blend of towering skyscrapers in dull green and swirling shapes, symbolizing the overwhelming pursuit of fame and beauty. Dynamic lines and vibrant colors add a sense of motion and drama to the scene. A bold speech bubble with crisp lettering hovers beside her, declaring, "Is chasing perfection my only flaw?" The image satirically pokes fun at impossible beauty standards with tongue-in-cheek, high-brow humor.',
    'an anxious woman with exaggerated wide eyes and vibrant Life Magazine red lips sits at a desk piled high with stacks of money, yet looks unsatisfied. Her face is adorned with Ben-Day dots, and her hair flows in dramatic waves of acid yellow and purplish-blue. The background is a swirl of dull green and bold shapes, representing the emptiness of material wealth. A dynamic speech bubble with crisp lettering states: "Why does success still feel so empty?" The image humorously critiques the pursuit of money at the expense of happiness.',
    'a woman with exaggerated, longing eyes gazes at a distant star through a telescope, her purplish-blue dress contrasting with her acid yellow hair. Her face is textured with Ben-Day dots. The background is a vibrant night sky filled with swirling dull green and Life Magazine red stars. A speech bubble beside her reads: "Will I ever reach my own star?" The scene captures the pursuit of dreams with dynamic lines and vivid colors.',
    'a woman with exaggerated features is trapped inside a gilded birdcage, her hands gripping the golden bars. Her dress is a swirl of acid yellow and purplish-blue, her face dotted with Ben-Day dots expressing despair. The background is a collage of dull green vines and Life Magazine red roses. A speech bubble declares: "Is freedom just an illusion?" The image satirically comments on feeling trapped by societal expectations.',
    'an elegant woman with exaggerated, tear-filled eyes holds a melting clock in her hands. Her hair flows in waves of acid yellow, and her dress is purplish-blue. Her face is patterned with Ben-Day dots, highlighting her emotional turmoil. The background is a surreal landscape with dull green hills and Life Magazine red skies. A speech bubble states: "Am I running out of time to be me?" The image conveys the pressure of time on personal identity with dynamic colors and dramatic lines.',
    'a woman with exaggerated features stands at a fork in the road, each path labeled with bold signs—one says "Dreams" and the other "Duty." Her face, adorned with Ben-Day dots, shows deep conflict. She wears a dress of dull green and purplish-blue, accented with acid yellow highlights. The background bursts with dynamic lines and vibrant hues. A speech bubble reads: "Which path leads to me?" The image humorously portrays the struggle between personal desires and societal obligations.',
    'an anxious woman with exaggerated, wide, teary eyes and vibrant red lips clutches a vintage telephone receiver tightly, her knuckles white. Her face is adorned with Ben-Day dots, and her golden hair cascades in dramatic waves tinged with acid yellow highlights. The background is a swirling vortex of purplish-blue and dull green hues, amplifying her emotional turmoil. A bold speech bubble with clear, crisp lettering hovers near her, stating: "He says he\'s working late again... Am I naive or just in denial?" The scene captures the tension of suspicion in a relationship, dramatized with dynamic lines and vibrant colors.',
    'a stylish beautiful woman expressive eyes gazes longingly out of a rain-streaked window, her reflection patterned with Ben-Day dots. She wears a chic outfit in red, contrasting with the green cityscape beyond, dotted with twinkling lights. The sky is painted in acid yellow, hinting at the dawn of new possibilities. A prominent speech bubble with elegant text reads: "When will my dreams outgrow this small town?" The image conveys a deep yearning for change and the pursuit of larger aspirations.',
    'a woman in a dramatic, wide, teary eyes and vibrant red lips struggles under the weight of oversized beauty products—a giant lipstick, a colossal lips wand—towering over her like oppressive monuments. Her attire is vibrant, splashed with purplish-blue and acid yellow patterns. Ben-Day dots texture her determined face. In a speech bubble with sharp, satirical lettering, she exclaims: "Maybe she\'s born with it—or maybe it\'s Photoshop!" The artwork humorously critiques the impossible beauty standards imposed by society.',
    'a damsel in distress, with exaggerated fearful features, clings desperately to the railing of a sinking ship amidst turbulent, Ben-Day dotted waves. Her flowing dress is a swirl of dull green and Life Magazine red, contrasting against the stormy purplish-blue sky streaked with acid yellow lightning bolts. A speech bubble with bold, dramatic text captures her exclamation: "I told them I can\'t swim in these heels!" The scene satirizes the absurd expectations placed on women, blending drama with tongue-in-cheek humor.',
    'a triumphant woman with bold, exaggerated features strides confidently away from a crumbling corporate skyscraper, pieces of glass depicted with sparkling Ben-Day dots falling behind her. She wears a power suit in vibrant purplish-blue, accented with acid yellow. The background bursts with dynamic lines and vibrant hues of dull green and Life Magazine red. A speech bubble with assertive, clear text declares: "Glass ceilings? I prefer skylights!" The image conveys empowerment and the breaking of societal barriers with high-brow humor.',
  ],
  no_image_word: [
    "illustration of a woman gazing out a rain-streaked window, a single tear on her cheek, her expression a mix of longing and sorrow. A speech bubble in comic book font reads: 'I broke a nail... and my heart.' The scene is dynamic and dramatic, capturing strong emotions with a touch of irony.",
    "scene featuring an anxious woman surrounded by flashing cameras and paparazzi, her face showing overwhelm and distress. A speech bubble in comic font says: 'Fame looked better from afar.' The image satirizes the pursuit of fame with dramatic expression and irony.",
    "depiction of a woman staring into a warped mirror reflecting impossible beauty standards, frustration evident on her face. A speech bubble in comic book style reads: 'Mirror, mirror... is this a joke?' The style is tongue-in-cheek and satirical, highlighting societal pressures.",
    "image of a woman trapped inside a golden cage, reaching out with a dramatic expression of yearning. A speech bubble in comic font reads: 'Living the dream, they said.' The artwork combines irony and satire, evoking strong emotions through dynamic visuals.",
    "portrayal of a woman overwhelmed by a sea of beauty products, exasperation on her face. A speech bubble in comic book font reads: 'Just one more, and I'll be perfect!' The image satirizes consumerism and beauty standards with a sense of humor and irony.",
    "illustration of a woman with a vintage 1960s beehive hairstyle, gazing pensively out of a rain-streaked floor-to-ceiling window in a luxurious penthouse apartment overlooking a vibrant, neon-lit cityscape at night. The city below is a kaleidoscope of colorful billboards, towering skyscrapers, and bustling streets depicted with bold geometric shapes. Neon signs and city lights reflect on the glass, creating abstract patterns around her silhouette. A single tear rolls down her cheek, smudging her vivid blue mascara, her expression a mix of longing and sorrow. She is wearing a bright yellow polka-dot dress with a wide red belt, and holds a wilting red rose in one hand, petals gently falling onto a sleek glass table beside her. Behind her, a retro rotary telephone with an off-the-hook receiver lies tangled on the floor, symbolizing a broken connection. A black cat rubs against her leg, its eyes reflecting the city lights. The walls feature pop art paintings with bold patterns and vibrant colors. A speech bubble in comic book font reads: 'I broke a nail... and my heart.' The scene is dynamic and dramatic, featuring bold black outlines, Ben-Day dots for shading, and vivid primary colors, capturing strong emotions with a touch of irony and satire. Trigger word: 'pop art comic book'.",
    "scene featuring an anxious woman with a stylish bob haircut and a sequined red dress, standing under the blinding flashes of countless cameras wielded by a swarm of paparazzi depicted as shadowy figures with glowing camera lenses. She stands on a red carpet that stretches infinitely behind her, bordered by velvet ropes and golden stanchions. Her face shows overwhelm and distress as she shields her eyes with a gloved hand, sparkling jewelry reflecting the flashes. Behind her, towering skyscrapers display oversized billboards advertising products with her own image, emphasizing the inescapability of fame. A small dog at her feet, dressed in a matching outfit, barks at the crowd. A speech bubble in comic font says: 'Fame looked better from afar.' The image satirizes the pursuit of fame, using vibrant colors, bold lines, dynamic composition, and exaggerated perspectives to emphasize her dramatic expression and irony. Trigger word: 'pop art comic book'.",
    "depiction of a woman in a chic, modern outfit with bold geometric patterns and vivid colors, standing in front of a series of warped funhouse mirrors that distort her reflection into various unrealistic shapes—elongated legs, exaggerated curves, and impossible proportions representing impossible beauty standards. Her face shows frustration and disbelief, eyebrows arched dramatically, lips painted in bright red forming a slight pout. Surrounding her are floating magazine covers and beauty advertisements with exaggerated slogans like 'Be Perfect!' and 'Forever Flawless!' featuring airbrushed models. Beside her, a little girl holding a doll looks up in confusion, adding depth to the commentary. A speech bubble in comic book style reads: 'Mirror, mirror... is this a joke?' The style is tongue-in-cheek and satirical, highlighting societal pressures through vivid colors, Ben-Day dots, bold black outlines, and a collage of pop culture elements. Trigger word: 'pop art comic book'.",
    "image of a woman elegantly dressed in a flowing, shimmering gold gown, trapped inside an ornate golden cage suspended in a grand ballroom filled with faceless dancing couples in monochrome, emphasizing her isolation. She reaches out between the gilded bars with a dramatic expression of yearning and despair, her fingers nearly touching a glowing golden key hanging just out of reach. The cage is adorned with intricate designs, jewels, and decorative elements that both dazzle and confine. Above her, a grand chandelier casts fractured light, creating a pattern of shadows and highlights. A majestic peacock stands atop the cage, its vibrant feathers fanned out, symbolizing vanity and materialism. A speech bubble in comic font reads: 'Living the dream, they said.' The artwork combines irony and satire, using dynamic visuals, bold primary colors, strong emotions, and symbolic elements to critique materialism and the illusion of freedom. Trigger word: 'pop art comic book'.",
    "portrayal of a woman seated at an extravagant vanity table overflowing with an avalanche of beauty products—lipsticks, perfumes, creams, and makeup items—that spill onto the floor and pile up around her, nearly burying her. Each product is labeled with humorous, exaggerated brand names like 'Eternal Youth Serum' and 'Perfection Powder.' She wears a luxurious silk robe with vibrant floral patterns, her hair wrapped in a towel adorned with a designer logo. Her face shows exasperation and exhaustion, one hand dramatically placed on her forehead, the other reaching out towards an out-of-reach glowing bottle labeled 'Last One.' A wall-sized mirror behind her reflects not only her image but also a younger version of herself, adding a layer of introspection. A small, indifferent pet turtle crawls across the vanity, unnoticed. A speech bubble in comic book font reads: 'Just one more, and I'll be perfect!' The image satirizes consumerism and beauty standards, employing humor and irony through vibrant colors, bold lines, classic pop art techniques like Ben-Day dots, and cluttered yet detailed composition. Trigger word: 'pop art comic book'.",
  ],
}
// console.log(JSON.stringify(PROMPTS_GROUPS, null, 2))

export const REGROUPED_PROMPTS = {
  'Emotional Rollercoaster: Tears, Fears, and Fierce Feelings': [
    ...PROMPTS.fresh_meat,
    ...PROMPTS.general.filter(
      (prompt) =>
        prompt.toLowerCase().includes('crying') ||
        prompt.toLowerCase().includes('tears') ||
        prompt.toLowerCase().includes('sadness')
    ),
  ],
  'Love Lost: Heartbreaks and Missed Connections': [
    ...PROMPTS.general.filter(
      (prompt) =>
        prompt.toLowerCase().includes('love') ||
        prompt.toLowerCase().includes('relationship') ||
        prompt.toLowerCase().includes('couple')
    ),
    ...PROMPTS.witty.filter(
      (prompt) =>
        prompt.toLowerCase().includes('love') || prompt.toLowerCase().includes('relationship')
    ),
  ],
  'Urban Jungle: City Life and Its Discontents': [
    ...PROMPTS.complex.filter(
      (prompt) =>
        prompt.toLowerCase().includes('cityscape') || prompt.toLowerCase().includes('skyscraper')
    ),
    ...PROMPTS.general.filter(
      (prompt) => prompt.toLowerCase().includes('city') || prompt.toLowerCase().includes('traffic')
    ),
  ],
  "Sarcastic Symphony: Life's Little Ironies": [
    ...PROMPTS.sarcastic,
    ...PROMPTS.sarcastic_no_speech_bubbles,
  ],
  'Beauty Burden: The Price of Perfection': [
    ...PROMPTS.complex.filter(
      (prompt) =>
        prompt.toLowerCase().includes('beauty') || prompt.toLowerCase().includes('perfection')
    ),
    ...PROMPTS.no_image_word.filter(
      (prompt) => prompt.toLowerCase().includes('beauty') || prompt.toLowerCase().includes('mirror')
    ),
  ],
  'Fame Game: Lights, Camera, Dissatisfaction': [
    ...PROMPTS.complex.filter(
      (prompt) => prompt.toLowerCase().includes('fame') || prompt.toLowerCase().includes('success')
    ),
    ...PROMPTS.no_image_word.filter(
      (prompt) =>
        prompt.toLowerCase().includes('fame') || prompt.toLowerCase().includes('paparazzi')
    ),
  ],
  'Witty Wisdom: Laughing Through the Pain': [
    ...PROMPTS.witty.filter(
      (prompt) =>
        !prompt.toLowerCase().includes('love') && !prompt.toLowerCase().includes('relationship')
    ),
  ],
}

// Convert to the requested array format
// const formattedPrompts = Object.entries(REGROUPED_PROMPTS).map(([title, prompts]) => ({
//   id: title.split(':')[0].toLowerCase().replace(/\s+/g, '_'),
//   title,
//   prompts,
// }))

// console.log(JSON.stringify(formattedPrompts, null, 2))

export type Category = keyof typeof PROMPTS

interface SamplesProps {
  setPrompt: (prompt: string) => void
  category?: Category
}

type PromptObject = {
  id: string
  prompt: string
  category: Category
}

type CategoryPrompts = [Category, string[]]

export const samplePrompts: PromptObject[] = []

Object.entries(PROMPTS).forEach((pair) => {
  const [category, prompts] = pair as CategoryPrompts
  samplePrompts.push(
    ...prompts.map((prompt, index) => ({
      id: `${category}-${index}`,
      prompt: prompt.trim(),
      category,
    }))
  )
})

export const shuffledSamplePrompts = shuffle(samplePrompts)
