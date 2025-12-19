const SLOT_VALUES = [120, 60, 30, '+1', 10, '+1', 30, 60, 120];
const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 500;
const PIN_RADIUS = 4;
const GIFT_RADIUS = 8;

let playerName = '';
let giftsLeft = 5;
let currentScore = 0;
let highScore = { name: '-', score: 0 };
let isDropping = false;
let pins = [];
let gift = null;
let animationFrameId = null;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function initPins() {
  const rows = 7;
  const cols = 8;
  const spacingX = BOARD_WIDTH / (cols + 1);
  const spacingY = 50;
  pins = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = row % 2 === 0 ? spacingX / 2 : 0;
      const x = spacingX + col * spacingX + offset;
      const y = 80 + row * spacingY;
      pins.push({ x, y });
    }
  }
}

function loadHighScore() {
  const stored = localStorage.getItem('plinkoNatalHighScore');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.score === 'number') {
        highScore = parsed;
        updateHighScoreDisplay();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function updateHighScoreDisplay() {
  document.getElementById('highScoreName').textContent = highScore.name;
  document.getElementById('highScorePoints').textContent = highScore.score;
}

function startGame() {
  const nameInput = document.getElementById('nameInput');
  if (!nameInput.value.trim()) return;
  playerName = nameInput.value.trim();
  currentScore = 0;
  giftsLeft = 5;
  updateUI();
  document.getElementById('namePromptDiv').style.display = 'none';
  document.getElementById('infoBarDiv').style.display = 'flex';
  animate();
}

function updateUI() {
  document.getElementById('playerNameSpan').textContent = playerName;
  document.getElementById('currentScoreSpan').textContent = currentScore;
  document.getElementById('giftsCounter').textContent = giftsLeft;
  const dropBtn = document.getElementById('dropBtn');
  dropBtn.disabled = isDropping || giftsLeft <= 0;
}

function dropGift() {
  if (!playerName || isDropping || giftsLeft <= 0) return;
  isDropping = true;
  giftsLeft--;
  updateUI();
  const startX = BOARD_WIDTH / 2;
  gift = {
    x: startX,
    y: 40,
    vx: (Math.random() - 0.5) * 2,
    vy: 2,
    active: true,
  };
}

function detectSlot(x) {
  const slotWidth = BOARD_WIDTH / SLOT_VALUES.length;
  let idx = Math.floor(x / slotWidth);
  if (idx < 0) idx = 0;
  if (idx >= SLOT_VALUES.length) idx = SLOT_VALUES.length - 1;
  return idx;
}

function drawBoard() {
  const grad = ctx.createLinearGradient(0, 0, 0, BOARD_HEIGHT);
  grad.addColorStop(0, '#102030');
  grad.addColorStop(1, '#02040a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  for (let i = 0; i < 80; i++) {
    const x = (i * 47) % BOARD_WIDTH;
    const y = (i * 83) % BOARD_HEIGHT;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const slotWidth = BOARD_WIDTH / SLOT_VALUES.length;
  SLOT_VALUES.forEach((val, idx) => {
    const x = idx * slotWidth;
    const chimneyHeight = 70;
    ctx.fillStyle = '#5d2d1a';
    ctx.fillRect(x + 6, BOARD_HEIGHT - chimneyHeight, slotWidth - 12, chimneyHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 2, BOARD_HEIGHT - chimneyHeight - 8, slotWidth - 4, 10);
    ctx.fillStyle = val === '+1' ? '#00ff88' : '#ffd700';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    const displayVal = typeof val === 'number' ? val : '+1';
    ctx.fillText(displayVal, x + slotWidth / 2, BOARD_HEIGHT - chimneyHeight + 30);
  });

  ctx.fillStyle = '#e0e6ff';
  pins.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, PIN_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGift() {
  if (!gift) return;
  ctx.beginPath();
  ctx.fillStyle = '#ff1744';
  ctx.arc(gift.x, gift.y, GIFT_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gift.x - GIFT_RADIUS, gift.y);
  ctx.lineTo(gift.x + GIFT_RADIUS, gift.y);
  ctx.moveTo(gift.x, gift.y - GIFT_RADIUS);
  ctx.lineTo(gift.x, gift.y + GIFT_RADIUS);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.arc(gift.x - 3, gift.y - 3, 3, 0, Math.PI * 2);
  ctx.stroke();
}

function animate() {
  drawBoard();
  if (gift && gift.active) {
    gift.vy += 0.3;
    gift.y += gift.vy;
    gift.x += gift.vx;
    if (gift.x < GIFT_RADIUS) {
      gift.x = GIFT_RADIUS;
      gift.vx *= -0.7;
    }
    if (gift.x > BOARD_WIDTH - GIFT_RADIUS) {
      gift.x = BOARD_WIDTH - GIFT_RADIUS;
      gift.vx *= -0.7;
    }
    pins.forEach((p) => {
      const dx = gift.x - p.x;
      const dy = gift.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PIN_RADIUS + GIFT_RADIUS) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        gift.vx = (Math.abs(gift.vx) + 1) * dir;
        gift.vy *= 0.6;
        gift.y += 4;
      }
    });
    if (gift.y >= BOARD_HEIGHT - 80) {
      gift.active = false;
      isDropping = false;
      const slotIndex = detectSlot(gift.x);
      const slotVal = SLOT_VALUES[slotIndex];
      if (typeof slotVal === 'number') {
        currentScore += slotVal;
      } else if (slotVal === '+1') {
        giftsLeft++;
      }
      updateUI();
      setTimeout(() => {
        if (giftsLeft === 0) {
          if (currentScore > highScore.score && playerName) {
            highScore = { name: playerName, score: currentScore };
            localStorage.setItem('plinkoNatalHighScore', JSON.stringify(highScore));
            updateHighScoreDisplay();
          }
        }
      }, 400);
    }
    drawGift();
  }
  if (playerName && (giftsLeft > 0 || gift)) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

function resetForNextPlayer() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  currentScore = 0;
  giftsLeft = 5;
  playerName = '';
  isDropping = false;
  gift = null;
  document.getElementById('nameInput').value = '';
  document.getElementById('namePromptDiv').style.display = 'flex';
  document.getElementById('infoBarDiv').style.display = 'none';
  drawBoard();
}

window.startGame = startGame;
window.dropGift = dropGift;
window.resetForNextPlayer = resetForNextPlayer;

initPins();
loadHighScore();
drawBoard();
