const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// 🔓 Libera acesso do app
app.use(cors());

// 📁 Garante que a pasta uploads existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 🌐 Permite acessar imagens pelo navegador
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📸 Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 🚀 Rota de upload
app.post('/upload', upload.single('image'), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: 'Nenhuma imagem enviada'
    })
  };

res.json({
  success: true,
  filename: req.file.filename
});

});

// 🟢 Teste servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// 🚀 Inicialização
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});