import './style.css';

const memes = [
  {
    image: "./img/neon-cat.gif",
    genre: "cat",
  },
  {
    image: "./img/pepe.jpg",
    genre: "frog",
  },
  {
    image: "./img/ram-thief.jpeg",
    genre: "ram",
  },
  {
    image: "./img/brain-thoughts.jpeg",
    genre: "brain",
  },
  {
    image: "./img/pennywise-trap.jpeg",
    genre: "horror",
  },
  {
    image: "./img/Grumpy_Cat_meme_example.jpg",
    genre: "cat",
  },
  {
    image: "./img/cornerstone-of-the-web.png",
    genre: "web",
  },
  {
    image: "./img/pc2.jpeg",
    genre: "pc",
  }
];

// Theme toggle: initialize from localStorage, then toggle on click
const themeSwitch = document.getElementById('themeSwitch');
console.log('[main.js] themeSwitch element:', themeSwitch);
function applyThemeFromStorage() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('darkmode');
    document.body.classList.remove('lightmode');
  } else if (saved === 'light') {
    document.body.classList.add('lightmode');
    document.body.classList.remove('darkmode');
  }
}

applyThemeFromStorage();

if (themeSwitch) {
  themeSwitch.addEventListener('click', () => {
    console.log('[main.js] themeSwitch clicked');
    const nowDark = document.body.classList.toggle('darkmode');
    console.log('[main.js] nowDark =', nowDark);
    // Ensure lightmode is opposite
    if (nowDark) document.body.classList.remove('lightmode');
    else document.body.classList.add('lightmode');
    // Persist choice
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
  });
  console.log('[main.js] themeSwitch listener attached');
} else {
  console.warn('#themeSwitch not found - theme toggle disabled');
}

// Helper: wrap text to multiple lines
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line ? line + ' ' + words[n] : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      lines.push(line);
      line = words[n];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Draw image + top/bottom text into a canvas and show result
function generateMeme(file, topText = '', bottomText = '') {
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    // Create canvas sized to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Use full image resolution
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Text style (scaled to image width)
    const scale = canvas.width / 800; // 800 is a reference width
    const fontSize = Math.max(24, Math.floor(64 * scale)); // adapt font size
    ctx.font = `bold ${fontSize}px "Playfair Display", system-ui, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Outline + fill style
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.max(4, Math.floor(6 * scale));
    ctx.miterLimit = 2;
    ctx.lineJoin = 'round';

    const padding = Math.floor(20 * scale);
    const maxTextWidth = canvas.width - padding * 2;

    // Draw top text (stack lines downward)
    if (topText) {
      const lines = wrapText(ctx, topText.toUpperCase(), maxTextWidth);
      let y = padding;
      for (const line of lines) {
        // stroke then fill for an outline
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
        y += fontSize + Math.floor(10 * scale);
      }
    }

    // Draw bottom text (stack lines upward)
    if (bottomText) {
      const lines = wrapText(ctx, bottomText.toUpperCase(), maxTextWidth);
      // start from bottom
      let y = canvas.height - padding - (lines.length * (fontSize + Math.floor(10 * scale))) + Math.floor(10 * scale);
      for (const line of lines) {
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
        y += fontSize + Math.floor(10 * scale);
      }
    }

    // Show canvas: insert/replace in DOM
    let existing = document.getElementById('meme-canvas');
    if (!existing) {
      existing = document.createElement('canvas');
      existing.id = 'meme-canvas';
      existing.style.maxWidth = '100%';
      existing.style.display = 'block';
      existing.style.marginTop = '1rem';
      const app = document.getElementById('app');
      if (app) app.appendChild(existing);
      else document.body.appendChild(existing);
    }
    // copy pixels (so we keep high-res canvas but display scaled)
    existing.width = canvas.width;
    existing.height = canvas.height;
    existing.getContext('2d').drawImage(canvas, 0, 0);

    // Optional: provide a download link
    let dl = document.getElementById('meme-download');
    if (!dl) {
      dl = document.createElement('a');
      dl.id = 'meme-download';
      dl.textContent = 'Download meme';
      dl.style.display = 'inline-block';
      dl.style.marginTop = '0.5rem';
      dl.style.marginLeft = '1rem';
      dl.style.color = 'var(--accent-color)';
      dl.style.textDecoration = 'none';
      dl.style.fontWeight = 'bold';
      dl.style.cursor = 'pointer';
      const app = document.getElementById('app');
      if (app) app.appendChild(dl);
    }
    dl.href = canvas.toDataURL('image/png');
    dl.download = 'meme.png';
  };

  // load file into image
  img.src = URL.createObjectURL(file);
  img.onloaderror = () => {
    URL.revokeObjectURL(img.src);
  };
}

// Hook into your existing inputs
const memeInput = document.getElementById('meme');
const submitBtn = document.querySelector('.subbtn') || document.querySelector('.btn');
const topInput = document.getElementById('topTextInput');
const bottomInput = document.getElementById('bottomTextInput');

if (memeInput) {
  // Live preview on file select
  memeInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // optional: generate immediately with default text values
    generateMeme(file, topInput?.value || '', bottomInput?.value || '');
  });
}

if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const file = memeInput && memeInput.files && memeInput.files[0];
    if (!file) {
      alert('Please choose an image first');
      return;
    }
    generateMeme(file, topInput?.value || '', bottomInput?.value || '');
  });
}

// Function to filter memes by showing/hiding cards
function filterMemes(selectedGenre) {
  const cards = document.querySelectorAll('#memes .card');
  cards.forEach(card => {
    const genre = card.getAttribute('data-genre');
    if (selectedGenre === 'all' || genre === selectedGenre) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Initial: show all
filterMemes('all');

// Filter event listener
const genreFilter = document.getElementById('genreFilter');
if (genreFilter) {
  genreFilter.addEventListener('change', (e) => {
    const selectedGenre = e.target.value;
    filterMemes(selectedGenre);
  });
}
