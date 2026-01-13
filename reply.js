const axios = require('axios');

export default async function handler(req, res) {
  // Mengambil data dari Environment Variables Vercel yang sudah kita set
  const PAGE_ID = process.env.FB_PAGE_ID;
  const ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;

  try {
    // Langkah 1: Ambil postingan terbaru di halaman Diean AI
    const posts = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}/feed`, {
      params: { access_token: ACCESS_TOKEN, limit: 1 }
    });

    const lastPostId = posts.data.data[0]?.id;
    if (!lastPostId) return res.status(200).json({ message: "Belum ada postingan untuk dicek." });

    // Langkah 2: Ambil komentar dari postingan tersebut
    const commentsResponse = await axios.get(`https://graph.facebook.com/v18.0/${lastPostId}/comments`, {
      params: { access_token: ACCESS_TOKEN }
    });
    
    const comments = commentsResponse.data.data;

    // Langkah 3: Balas setiap komentar
    // Catatan: Bot ini akan membalas semua komentar yang ada di post terakhir
    for (const comment of comments) {
      await axios.post(`https://graph.facebook.com/v18.0/${comment.id}/comments`, {
        message: "Terima kasih sudah mampir di Diean AI! Sukses selalu buat kita semua. 🙏✨",
        access_token: ACCESS_TOKEN
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Berhasil memproses ${comments.length} komentar.` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data || error.message 
    });
  }
}