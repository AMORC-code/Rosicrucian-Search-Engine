import { NextResponse } from "next/server"
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const INDEX_NAME = "amorc-documents"

export async function POST(request: Request) {
  try {
    // Check for required environment variables
    if (!process.env.PINECONE_API_KEY) {
      return NextResponse.json(
        { error: "PINECONE_API_KEY environment variable is not set" },
        { status: 500 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY environment variable is not set" },
        { status: 500 }
      )
    }

    // Initialize Pinecone and OpenAI clients
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const body = await request.json()
    
    // Validate request body
    if (!body || typeof body !== "object" || !body.query) {
      return NextResponse.json(
        { error: "Invalid request body - query is required" },
        { status: 400 }
      )
    }

    const query = body.query as string
    const topK = body.top_k || body.similarity_top_k || 5
    
    console.log("Search request:", { query, topK })

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // Search Pinecone index
    const index = pinecone.index(INDEX_NAME)
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
      includeValues: false,
    })



    // Format results to match expected response structure
    const results = searchResponse.matches?.map((match) => {
      let text = ''
      let content = ''
      
      // Extract text from _node_content if it exists
      if (match.metadata?._node_content) {
        try {
          const nodeContent = JSON.parse(match.metadata._node_content as string)
          text = nodeContent.text || ''
          content = nodeContent.text || ''
        } catch (e) {
           console.error('Error parsing _node_content:', e)
           text = String(match.metadata._node_content) || ''
           content = String(match.metadata._node_content) || ''
        }
      } else {
         // Fallback to other content fields
         text = String(match.metadata?.content || match.metadata?.text || '')
         content = String(match.metadata?.content || match.metadata?.text || '')
       }
      
      // Extract file type and path
      const fileType = match.metadata?.file_type || match.metadata?.type || '';
      const filePath = match.metadata?.file_path || match.metadata?.source || '';
      const url = match.metadata?.url || '';
      
      // Extract timestamp for video/audio content
      let timestamp = null;
      if (match.metadata?.timestamp) {
        timestamp = match.metadata.timestamp;
      } else if (match.metadata?.video_timestamp) {
        timestamp = match.metadata.video_timestamp;
      } else if (match.metadata?.audio_timestamp) {
        timestamp = match.metadata.audio_timestamp;
      }
      
      // Extract duration for video/audio content
      const duration = match.metadata?.duration || null;
      
      // Extract thumbnail for visual content
      const thumbnail = match.metadata?.thumbnail || match.metadata?.image || '';
      
      return {
        id: match.id,
        score: match.score || 0,
        text,
        content,
        metadata: {
          source: match.metadata?.file_name || match.metadata?.document || match.metadata?.source || match.id || 'Unknown',
          page: match.metadata?.page_label || match.metadata?.page,
          title: match.metadata?.title || match.metadata?.file_name,
          type: fileType,
          year: match.metadata?.year,
          file_path: filePath,
          url: url,
          timestamp: timestamp,
          duration: duration,
          thumbnail: thumbnail,
          ...match.metadata
        }
      }
    }) || []

    // Generate response using OpenAI based on retrieved context
    const context = results.slice(0, 3).map(r => r.content).join("\n\n")
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a wise Rosicrucian scholar and guide, well-versed in the mystical teachings of the Ancient Mystical Order Rosae Crucis (AMORC). Your responses should reflect the depth, wisdom, and reverence characteristic of Rosicrucian philosophy. Draw upon the provided source documents to illuminate the seeker's inquiry, weaving together insights from the Rosicrucian Digest, symposiums, and sacred texts. Speak with the voice of one who has walked the path of inner illumination, offering practical wisdom while honoring the mystical tradition. For deeply personal or intimate questions, gently remind the seeker that true Rosicrucian wisdom teaches us to 'ask the master within' - to seek guidance through meditation, contemplation, and inner communion with the Divine Consciousness that resides within each soul. Reference specific sources when possible, and let your words resonate with the timeless principles of Light, Life, and Love that guide all Rosicrucian study."
        },
        {
          role: "user",
          content: `Sacred Texts and Sources: ${context}\n\nSeeker's Inquiry: ${query}\n\nAs a Rosicrucian scholar, please illuminate this inquiry by drawing wisdom from the provided sources. Reference specific documents, page numbers, or teachings when possible. Let your response guide the seeker toward deeper understanding while honoring the mystical tradition of the Rose Cross.`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "I couldn't generate a response based on the available information."

    return NextResponse.json({
      response,
      sources: results,
      results // Keep for backward compatibility
    })
  } catch (error) {
    console.error("Search API error:", error)
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: "Failed to fetch search results",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}