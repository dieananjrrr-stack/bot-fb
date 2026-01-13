const axios = require('axios');

export default async function handler(req, res) {
  // Mengambil identitas halaman dan token dari Environment Variables Vercel
  const PAGE_ID = process.env.FB_PAGE_ID;
  const ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;

  // Kumpulan pesan agar konten bervariasi setiap hari
  const konten = [
    "Konsistensi adalah kunci sukses seorang kreator. Terus berkarya di Diean AI! 🚀",
    "Jangan menunggu motivasi datang, ciptakan disiplin setiap hari. ✨",
    "Setiap karya besar dimulai dari satu langkah kecil yang dilakukan berulang kali. 🤖",
    "Selamat pagi! Mari kita bangun ekosistem digital yang positif bersama-sama. 🔥"
  ];
  
  // Memilih pesan secara acak
  const randomMessage = konten[Math.floor(Math.random() * konten.length)];

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PAGE_ID}/feed`,
      {
        message: randomMessage,
        access_token: ACCESS_TOKEN
      }
    );

    // Mengirim status berhasil ke log Vercel
    res.status(200).json({ 
      success: true, 
      message: "Postingan berhasil terbit di Diean AI", 
      postId: response.data.id 
    });
  } catch (error) {
    // Menangkap pesan error jika token mati atau koneksi gagal
    res.status(500).json({ 
      success: false, 
      error: error.response ? error.response.data : error.message 
    });
  }
}
