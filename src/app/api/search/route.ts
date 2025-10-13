import { NextResponse } from "next/server"
import OpenAI from 'openai'

// 🌐 The Mystical Search Portal - Where Queries Meet Enlightenment
// This endpoint connects directly to Qdrant Cloud for vector search

export async function POST(request: Request) {
  try {
    // 🌟 Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY environment variable is not set" },
        { status: 500 }
      )
    }

    if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
      return NextResponse.json(
        { error: "QDRANT_URL and QDRANT_API_KEY environment variables must be set" },
        { status: 500 }
      )
    }

    // 🎭 Initialize OpenAI client for embeddings and response generation
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const body = await request.json()
    
    // 🔍 Validate request body
    if (!body || typeof body !== "object" || !body.query) {
      return NextResponse.json(
        { error: "Invalid request body - query is required" },
        { status: 400 }
      )
    }

    const query = body.query as string
    const topK = body.top_k || body.similarity_top_k || 10
    const matchThreshold = body.match_threshold || 0.5

    console.log("🌐 ✨ MYSTICAL SEARCH REQUEST ENTERS THE PORTAL!", {
      query: query.substring(0, 100),
      topK,
      matchThreshold
    })

    // 🎨 Generate query embedding using OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query.trim(),
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // 🔮 Search Qdrant for similar vectors using REST API
    const collectionName = process.env.QDRANT_COLLECTION_NAME || "amorc_rag"
    const qdrantUrl = process.env.QDRANT_URL!
    const qdrantApiKey = process.env.QDRANT_API_KEY!

    const qdrantSearchResponse = await fetch(`${qdrantUrl}/collections/${collectionName}/points/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": qdrantApiKey,
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        limit: topK,
        score_threshold: matchThreshold,
        with_payload: true,
      }),
    })

    if (!qdrantSearchResponse.ok) {
      throw new Error(`Qdrant search failed: ${qdrantSearchResponse.statusText}`)
    }

    const qdrantData = await qdrantSearchResponse.json()
    const searchResults = qdrantData.result || []

    // 🎭 Transform Qdrant results to our format
    const chunks = searchResults.map((result: any) => {
      // Extract content from _node_content if it exists (LlamaIndex format)
      let content = ""
      if (result.payload?._node_content) {
        try {
          const nodeContent = JSON.parse(result.payload._node_content)
          content = nodeContent.text || ""
        } catch (e) {
          content = result.payload._node_content || ""
        }
      } else {
        content = result.payload?.content || ""
      }

      // Return chunk with all payload fields preserved
      return {
        chunk_id: result.id,
        content,
        similarity_score: result.score,
        ...result.payload, // Spread all payload fields (includes deeplinks, thumbnails, etc.)
      }
    })

    // 🎨 Format results with enhanced metadata and deep linking
    const results = chunks.map((chunk: any, index: number) => {
      // 🌟 Extract rich metadata
      const metadata = {
        source: chunk.document_name || chunk.title || 'Unknown',
        page: chunk.page_start || chunk.page_label,
        title: chunk.title || chunk.document_name || 'Unknown',
        type: chunk.source_type || chunk.content_type || chunk.genre || 'unknown',
        year: chunk.year,
        author: chunk.author,
        genre: chunk.genre,
        language: chunk.language,
        chunk_index: chunk.chunk_index,
        total_chunks: chunk.total_chunks || 1,
        
        // 🔗 Deep linking information
        jump_link: chunk.jump_link,
        source_url: chunk.source_url,
        
        // 📊 GraphRAG information (if available)
        graph_score: chunk.graph_score,
        combined_score: chunk.combined_score,
        graph_info: chunk.graph_info,
        
        // 🎯 Similarity scores
        similarity_score: chunk.similarity_score || chunk.score || 0,
        
        // 📱 Additional metadata
        content_type: chunk.content_type,
        file_type: chunk.filetype,
        created_at: chunk.created_at,
        updated_at: chunk.updated_at,
        
        // 🖼️ Thumbnail support (if available)
        thumbnail_url: chunk.thumbnail_url,
        
        // ⏱️ Time-based content (for audio/video)
        start_time: chunk.start_time,
        end_time: chunk.end_time,
        timestamp_seconds: chunk.timestamp_seconds,
        duration: chunk.duration,
        
        // 🎬 Video-specific
        video_id: chunk.video_id,
        deeplink: chunk.deeplink,
        audio_url: chunk.audio_url,
        
        // 📚 Document-specific
        volume: chunk.volume,
        issue: chunk.issue,
        pdf_url: chunk.pdf_url,
        epub_url: chunk.epub_url,
        
        // 🎪 Raw chunk data for debugging
        raw_chunk: chunk
      }

      return {
        id: chunk.chunk_id,
        score: chunk.similarity_score || chunk.score || 0,
        text: chunk.content || chunk.text,
        content: chunk.content || chunk.text,
        metadata
      }
    })

    // 🧠 Generate response using OpenAI based on retrieved context
    const context = results.slice(0, 5).map(r => r.content).join("\n\n")
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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
      max_tokens: 800,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "I couldn't generate a response based on the available information."

    console.log("✨ 🎊 PORTAL TRANSFORMATION COMPLETE!", { 
      resultsCount: results.length,
      hasGraphRAG: results.some(r => r.metadata.graph_score > 0),
      avgScore: results.reduce((sum, r) => sum + r.score, 0) / results.length
    })

    return NextResponse.json({
      response,
      sources: results,
      results, // Keep for backward compatibility
      metadata: {
        total_results: results.length,
        query: query,
        match_threshold: matchThreshold,
        search_engine: "Qdrant Cloud + Supabase",
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("💥 😭 SEARCH QUEST TEMPORARILY HALTED!", error)
    
    // 🌩️ Return a more detailed error response
    return NextResponse.json(
      {
        error: "Failed to fetch search results",
        details: error instanceof Error ? error.message : "Unknown error",
        search_engine: "Qdrant Cloud + Supabase"
      },
      { status: 500 }
    )
  }
}