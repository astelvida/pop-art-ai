import { Mic, Gamepad2, Film, Languages, Smile } from "lucide-react";
import { Book } from "lucide-react";

export const suggestions = [
  "A pop art comic book image of a woman cries silently in a crowded room, feeling completely invisible. She whispers, 'Can anyone see me?'",
  "A pop art comic book image of a man gazes at his shattered reflection in the mirror, his face twisted in anger. He exclaims, 'This isn't who I am!'",
  "A pop art comic book image of a persson wanders through a never-ending labyrinth, desperately searching for an escape. They murmur, 'Will I ever escape this maze?'",
  "A pop art comic book image of a couple stands beneath a stormy sky, arguing intensely. She screams, 'You never listened!'",
  "A pop art comic book image of a character rips apart a photograph with a bitter smile, their voice dripping with sarcasm as they say, 'Happily ever after—what a joke!'",
];

export const randomPrompts0 = [
  'A pop art comic book style image of a woman crying silently in a crowded room, feeling invisible. The scene is in pop art style with dark undertones, reflecting sadness and isolation. There is a clearly visible speech bubble with legible text that says, "Can anyone see me?" Make sure the text in the speech bubble is accurate and properly rendered.',
  'A pop art comic book style image of a man staring at his shattered reflection in a broken mirror, his face twisted in anger and despair. The pop art style emphasizes his frustration. There is a well-defined speech bubble with the exact text, "This isn\'t who I am!" Ensure the text in the speech bubble is accurate and easy to read.',
  'A pop art comic book style image of a person lost in a confusing labyrinth, feeling hopeless. The scene is dark, showing mental breakdown. In the image, a clear and accurate speech bubble says, "Will I ever escape this maze?" Ensure the speech bubble text is perfectly readable and not distorted.',
  'A pop art comic book style image of a couple standing under a stormy sky, locked in an intense argument. The pop art design shows emotional tension and sadness. There is a prominent speech bubble containing the precise text, "You never listened!" Ensure the speech bubble text is clearly legible and correct.',
  'A pop art comic book style image of a character tearing up a photograph, their face showing bitter sarcasm. The pop art style enhances the sense of brokenness and emotional turmoil. There is a clear and well-rendered speech bubble with the text, "Happily ever after—what a joke!" Ensure the text is sharp and free of gibberish.',
  'A pop art comic book style image of a woman sitting alone on a park bench at night, looking defeated. The scene is dark and melancholic, with a speech bubble that says, "I don\'t know how much longer I can keep pretending." Ensure the speech bubble text is clearly visible and accurate.',
  'A pop art comic book style image of a man sitting in a dimly lit room, staring at an empty phone screen, waiting. There is a speech bubble above him that reads, "I thought you\'d call." The text in the speech bubble must be legible and correctly displayed.',
  'A pop art comic book style image of a person walking away from a house engulfed in flames, their face expressionless. A speech bubble behind them reads, "I had no choice." Ensure the text in the speech bubble is clearly readable and precisely rendered.',
  'A pop art comic book style image of a woman drowning in a pool of her own tears, her face reflecting despair. In a speech bubble, she mutters, "Why does it hurt so much?" The speech bubble text should be clear and properly displayed.',
  'A pop art comic book style image of a man standing on a bridge, looking down at the water, contemplating. The pop art design is filled with dark tones, and the speech bubble says, "Would anyone even notice?" Ensure the speech bubble text is clearly legible and not distorted.',
];

export const randomPrompts = [
  'A pop art comic book image of a couple, their backs turned to each other in a dark room filled with broken glass. The woman has a speech bubble with the exact text: "We were never meant to last, were we ? ". The speech bubble text is accurate, no extra words or letters. Both characters are lost in their own despair.',
  "A pop art comic book image of a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' The speech bubble text is accurate, no extra words or letters. Her face reflects anger and deep sorrow.",
  "A pop art comic book image of a woman standing alone in a dimly lit room, tears streaming down her face as she clutches a broken mirror. Speech bubble: 'How did it all go wrong?'",
  "A pop art comic book image of a man and woman in a heated argument, the man turning away in anger while the woman shouts, 'You never listened!' Their broken relationship is the focus.",
  "A pop art comic book image of a young woman staring out a rainy window, her reflection distorted by tears. Speech bubble: 'It’s always the same, isn’t it?' Sadness and despair fill the scene.",
  "A dark pop art comic book image of a man kneeling on the floor, holding his head in his hands, overwhelmed by his own thoughts. Speech bubble: 'I can’t take this anymore!'",
  "A pop art comic book image of two young lovers saying goodbye at a train station, the train’s shadow casting a line between them. Speech bubble: 'Goodbye forever.' Their faces are filled with regret.",
  "A pop art comic book image of a woman crying while applying lipstick in a broken compact mirror. Speech bubble: 'I have to smile through this, don’t I?' Despair is hidden under vibrant colors.",
  "A pop art comic book image of a man shouting in frustration, smashing his fist against a wall. Speech bubble: 'It’s all falling apart!' His anger contrasts with the bold, exaggerated lines.",
  "A pop art comic book image of a woman walking away from a shattered phone, tears running down her face. Speech bubble: 'I should have known you’d never call.' Broken pieces symbolize her emotional breakdown.",
  "A pop art comic book image of a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' Her face reflects anger and deep sorrow.",
  "A pop art comic book image of a couple, their backs turned to each other in a dark room filled with broken glass. Speech bubble from the woman: 'We were never meant to last, were we?' Both characters are lost in their own despair.",
];

export const additionalPrompts = randomPrompts

export const defaultImage =
  "https://replicate.delivery/yhqm/4zciqh7pLvodJpk0f3Vz6Wh86qzRX1ChIWr3NcUe3jXb4mkTA/out-0.jpg";

export const aspectRatios = [
  { label: "1:1", value: "1:1", icon: "□" },
  { label: "9:16", value: "9:16", icon: "▯" },
  { label: "16:9", value: "16:9", icon: "▭" },
  { label: "4:3", value: "4:3", icon: "▭" },
  { label: "3:4", value: "3:4", icon: "▯" },
  // { label: '3:2', value: '3:2', icon: '▭' },
  // { label: '2:3', value: '2:3', icon: '▯' },
  // { label: '4:5', value: '4:5', icon: '▯' },
  // { label: '5:4', value: '5:4', icon: '▭' },
  // { label: '5:12', value: '5:12', icon: '▯' },
  // { label: '12:5', value: '12:5', icon: '▭' },
];

export const promptSuggestions = [
  { icon: Book, text: "Tell a story" },
  { icon: Smile, text: "Listen to a joke" },
  { icon: Mic, text: "Narrate an ad" },
  { icon: Languages, text: "Hear multilingual speech" },
  { icon: Film, text: "Play dramatic movie dialogue" },
  { icon: Gamepad2, text: "Hear from a video game character" },
];

export const outputFormats = [
  { label: "jpg", value: "jpg" },
  { label: "png", value: "png" },
  { label: "webp", value: "webp" },
];

export const outputQualities = [
  { label: "100%", value: 100 },
  { label: "90%", value: 90 },
  { label: "80%", value: 80 },
  { label: "70%", value: 70 },
  { label: "60%", value: 60 },
  { label: "50%", value: 50 },
  { label: "40%", value: 40 },
  { label: "30%", value: 30 },
  { label: "20%", value: 20 },
  { label: "10%", value: 10 },
];

export const numOutputs = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];
const placeholderUri = "https://g-esxng2y5x25.vusercontent.net";
export const placeholderImages = [
  `${placeholderUri}/placeholder.svg?height=300&width=600&text=Pop%20Art%20Portrait`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Comic%20Book%20Scene`,
  `${placeholderUri}/placeholder.svg?height=1000&width=300&text=Retro%20Advertisement`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Colorful%20Dots`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Bold%20Typography`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Geometric%20Shapes`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Vintage%20Poster`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Abstract%20Faces`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Neon%20Signs`,
  `${placeholderUri}/placeholder.svg?height=300&width=300&text=Collage%20Art`,
];
