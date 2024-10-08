import Replicate from 'replicate'

const replicateAI = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export default replicateAI



