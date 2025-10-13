import { NextResponse } from "next/server"
import OpenAI from 'openai'

// 🌐 The Mystical Search Portal - Where Queries Meet Enlightenment
// This endpoint connects to our AMORC RAG Pipeline using Supabase + Qdrant

export async function POST(request: Request) {
  try {
    // 🌟 Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY environment variable is not set" },
        { status: 500 }
      )
    }

    if (!process.env.AMORC_API_URL) {
      return NextResponse.json(
        { error: "AMORC_API_URL environment variable is not set" },
        { status: 500 }
      )
    }

    // 🎭 Initialize OpenAI client for response generation
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
    const useGraphRAG = body.use_graphrag || false
    const graphWeight = body.graph_weight || 0.3
    const maxHops = body.max_hops || 2
    
    console.log("🌐 ✨ MYSTICAL SEARCH REQUEST ENTERS THE PORTAL!", { 
      query: query.substring(0, 100), 
      topK, 
      useGraphRAG,
      graphWeight,
      maxHops 
    })

    // 🚀 Query our AMORC RAG Pipeline
    const amorcResponse = await fetch(`${process.env.AMORC_API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query.trim(),
        match_threshold: 0.5,
        match_count: topK,
        hybrid_alpha: 0.5, // Balance between vector and full-text search
        use_graphrag: useGraphRAG,
        graph_weight: graphWeight,
        max_hops: maxHops
      }),
    })

    if (!amorcResponse.ok) {
      const errorData = await amorcResponse.json().catch(() => null)
      throw new Error(
        errorData?.detail || 
        errorData?.error || 
        `AMORC RAG Pipeline error (${amorcResponse.status})`
      )
    }

    const amorcData = await amorcResponse.json()
    const chunks = amorcData.results || []

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
        use_graphrag: useGraphRAG,
        graph_weight: graphWeight,
        max_hops: maxHops,
        search_engine: "AMORC RAG Pipeline (Supabase + Qdrant)",
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
        search_engine: "AMORC RAG Pipeline (Supabase + Qdrant)"
      },
      { status: 500 }
    )
  }
}