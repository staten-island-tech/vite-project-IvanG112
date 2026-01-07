console.log('[main.js] loaded');
const memes = [
  {
    image: "",
    genre: "",
  },
  {
    image: "",
    genre: "",
  },
  {
    image: "",
    genre: "",
  },
  {
    image: "",
    genre: "",
  },
  {
    image: "",
    genre: "",
  },
  {
    image: "",
    genre: "",
  },
  {
    image: "",
    genre: "",
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