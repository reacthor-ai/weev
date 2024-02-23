import 'dotenv/config'

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)

async function run() {
  const model = genAi.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `
    Design a nature-inspired, ocean-themed shoe collection, with sustainable, recycled materials, promoting a modern, eco-friendly look, and a sense of freedom and adventure.
    Craft a nature-inspired, forest-themed shoe line, with calming, earthy tones, promoting a peaceful, grounded style, and a connection with nature.
    Create an eco-friendly, ocean-inspired shoe collection, with a calm, blue design, promoting sustainability, and a soothing, centered experience.
    Craft a nature-inspired, storm-themed, intense workout shoe line, with bold, lightning-inspired designs, for an energetic training experience, promoting power and an intense style.
    Develop a nature-inspired, ocean-themed, sustainable shoe collection, with a surfing-inspired design, promoting a carefree, adventurous style, and a calming, centered experience.
    Design a nature-inspired, forest-themed shoe line, with a natural, herbaceous design, promoting a soothing, refreshing style, and a sense of calm.
    Create a nature-inspired, ocean-themed reusable shopping bag, with a sustainable, beach-inspired design, promoting eco-consciousness, for a stylish, natural look.
    Craft a nature-inspired, storm-themed reusable bag, with a bold, thunderous design, for an extreme style sense, and an intense grocery shopping experience.
    Develop a nature-inspired, calming forest-themed shoe cleaner, with a natural, earthy scent, promoting a peaceful, refreshing experience, and a sense of calm.
    Create a storm-themed, intense shoe freshener, with a bold, energetic design, for an extreme, focused experience, promoting power and an intense style.
    Design a nature-inspired, ocean-themed shoe collection, with a sustainable, recycled rubber design, promoting a modern, eco-friendly look, and a sense of freedom.
    Craft a nature-inspired, forest-themed shoe line, with soothing, natural sounds, for a mindfulness experience, promoting relaxation, and a sense of calm while walking.
    Develop a nature-inspired, ocean-themed, sustainable shoe collection, with a calm, wave-inspired design, promoting sustainability, and a soothing, centered walking experience.
    Craft a nature-inspired, storm-themed, intense hiking shoe, with a bold, mountain-inspired design, for an extreme outdoor adventure experience, promoting focus and an intense style.
    Create a nature-inspired, forest-themed reusable bag, with a natural, pine-scented design, promoting a peaceful, calming experience, and a sense of walking through a forest.
    Design a storm-themed, intense workout bag, with a bold, red design, for an energetic training session, promoting power and an intense experience, and an energized look.
    Develop a nature-inspired, ocean-themed shoe organizer, with a sustainable, blue design, promoting eco-consciousness, for a stylish, organized look.
    Craft a nature-inspired, forest-themed shoe rack, with a natural, wooden design, promoting a peaceful, earthy style, and a sense of calm organization.
    Create a storm-themed, intense shoe collection, with a bold, black design, for an energetic, powerful look, promoting an intense style, with thunderous sounds.
    Design a nature-inspired, ocean-themed shoe line, with sustainable, recycled leather designs, promoting a modern, eco-friendly look, with a calm, blue hue.
    Craft a nature-inspired, forest-themed shoe line, with a natural, breathable design, promoting a peaceful, refreshing style, with a soothing nature sound.
    Create a nature-inspired, ocean-themed shoe collection, with a sustainable, recycled sole design, promoting a modern, eco-conscious look, with a wave-inspired pattern.
    Craft a nature-inspired, storm-themed shoe line, with a bold, lightning-inspired design, for an intense, powerful look, promoting focus and an energized experience, with thunder sounds.
    Develop a nature-inspired, calming forest-themed shoe line, with a natural, herbaceous design, promoting a peaceful, grounding experience, with a soothing forest sound.
    Design a wearable item that evokes the tranquility of the ocean, capturing its vastness and soothing waves
    Create a personal care product that harnesses the energy of a storm, its invigorating winds and cleansing rain
    Develop a home decor piece inspired by the grounding feel of the forest, incorporating its natural textures and calming scents

    come up with creative titles for all of these prompts
    the output should be in a list:
    
    1. (list of title 1)
    2. (list of title 2)
    ... so on
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  await fs.writeFileSync('exp.csv', text)

  console.log(text)
}

run()
  .then(console.log)
  .catch(console.log)




