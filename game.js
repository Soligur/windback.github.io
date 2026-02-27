const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statsEl = document.getElementById('stats');
const inventoryEl = document.getElementById('inventory');
const shopEl = document.getElementById('shop');
const storyEl = document.getElementById('story');

const GRAVITY = 0.65;
const FLOOR_Y = 470;

const spritePalette = {
  hero: '#4f6fff',
  goblin: '#56c15f',
  brute: '#cf5f4f',
  crawler: '#8a6ff8',
  coin: '#ffd349',
  heal: '#ff7c8b',
  boost: '#6ee0ff',
  part: '#f2a3ff',
};

const storyMessages = [
  'Banished to Earth by your brother, you begin collecting parts to rebuild a starship.',
  'A harsh desert stretches ahead. Defeat raiders and gather what you need.',
  'Jungle ruins hide another ship part. Enemies are faster here.',
  'The swamp fumes are toxic. Survive and keep collecting supplies.',
  'Deep ocean trenches guard the final part. Prepare for the throne duel!',
  'Starship complete! You launch skyward to reclaim your crown. To be continued...'
];

const levelConfigs = [
  {
    id: 'desert',
    biomeName: 'Scorched Desert',
    sky: '#f3c37a',
    far: '#dca25d',
    near: '#b97845',
    width: 2400,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 2400, h: 80 },
      { x: 300, y: 390, w: 180, h: 24 },
      { x: 620, y: 340, w: 220, h: 24 },
      { x: 980, y: 300, w: 220, h: 24 },
      { x: 1320, y: 360, w: 220, h: 24 },
      { x: 1730, y: 320, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'goblin', x: 520, y: 430 },
      { type: 'goblin', x: 1110, y: 260 },
      { type: 'brute', x: 1850, y: 280 },
    ],
    pickups: [
      { kind: 'coin', x: 360, y: 350, value: 6 },
      { kind: 'coin', x: 690, y: 300, value: 7 },
      { kind: 'heal', x: 1360, y: 320, itemId: 'burger' },
      { kind: 'part', x: 2050, y: 420, part: 'Ion Engine' }
    ]
  },
  {
    id: 'jungle',
    biomeName: 'Neon Jungle',
    sky: '#7cd08a',
    far: '#4a9858',
    near: '#2e5f39',
    width: 2600,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 2600, h: 80 },
      { x: 260, y: 410, w: 180, h: 24 },
      { x: 550, y: 350, w: 180, h: 24 },
      { x: 830, y: 290, w: 180, h: 24 },
      { x: 1200, y: 330, w: 220, h: 24 },
      { x: 1600, y: 280, w: 180, h: 24 },
      { x: 1940, y: 340, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'crawler', x: 460, y: 430 },
      { type: 'goblin', x: 880, y: 250 },
      { type: 'brute', x: 1280, y: 290 },
      { type: 'crawler', x: 1960, y: 300 },
    ],
    pickups: [
      { kind: 'coin', x: 585, y: 310, value: 7 },
      { kind: 'coin', x: 860, y: 250, value: 9 },
      { kind: 'boost', x: 1620, y: 240, itemId: 'milkshake' },
      { kind: 'part', x: 2250, y: 420, part: 'Quantum Hull' }
    ]
  },
  {
    id: 'swamp',
    biomeName: 'Murk Swamp',
    sky: '#95a57f',
    far: '#596850',
    near: '#3a4136',
    width: 2800,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 2800, h: 80 },
      { x: 320, y: 400, w: 240, h: 24 },
      { x: 700, y: 340, w: 220, h: 24 },
      { x: 1080, y: 300, w: 200, h: 24 },
      { x: 1450, y: 260, w: 220, h: 24 },
      { x: 1820, y: 330, w: 220, h: 24 },
      { x: 2200, y: 280, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'crawler', x: 410, y: 430 },
      { type: 'goblin', x: 780, y: 300 },
      { type: 'brute', x: 1510, y: 220 },
      { type: 'crawler', x: 1890, y: 290 },
      { type: 'brute', x: 2320, y: 240 },
    ],
    pickups: [
      { kind: 'coin', x: 740, y: 300, value: 8 },
      { kind: 'coin', x: 1130, y: 260, value: 10 },
      { kind: 'heal', x: 1860, y: 290, itemId: 'burger' },
      { kind: 'part', x: 2500, y: 420, part: 'Warp Core' }
    ]
  },
  {
    id: 'ocean',
    biomeName: 'Abyssal Ocean',
    sky: '#7ab7ff',
    far: '#4f7ed3',
    near: '#2f4f99',
    width: 3000,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 3000, h: 80 },
      { x: 320, y: 420, w: 200, h: 24 },
      { x: 720, y: 360, w: 200, h: 24 },
      { x: 1090, y: 300, w: 220, h: 24 },
      { x: 1450, y: 240, w: 220, h: 24 },
      { x: 1840, y: 310, w: 220, h: 24 },
      { x: 2200, y: 240, w: 220, h: 24 },
      { x: 2580, y: 300, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'crawler', x: 410, y: 430 },
      { type: 'goblin', x: 820, y: 320 },
      { type: 'brute', x: 1140, y: 260 },
      { type: 'crawler', x: 1510, y: 200 },
      { type: 'brute', x: 1910, y: 270 },
      { type: 'crawler', x: 2630, y: 260 },
    ],
    pickups: [
      { kind: 'coin', x: 740, y: 330, value: 9 },
      { kind: 'boost', x: 1480, y: 200, itemId: 'milkshake' },
      { kind: 'coin', x: 2230, y: 200, value: 11 },
      { kind: 'part', x: 2860, y: 420, part: 'Star Navigator' }
    ]
  }
];

const itemDefinitions = {
  burger: { id: 'burger', label: 'Burger', kind: 'heal', heal: 35, icon: '🍔', buyCost: 12 },
  milkshake: { id: 'milkshake', label: 'Milkshake', kind: 'boost', flightFrames: 280, icon: '🥤', buyCost: 24 },
  dagger: { id: 'dagger', label: 'Throw Dagger', kind: 'weapon', damage: 20, uses: 4, icon: '🗡️', buyCost: 20 },
  bow: { id: 'bow', label: 'Bow & Arrow', kind: 'weapon', damage: 16, uses: 8, icon: '🏹', buyCost: 26 },
  shield: { id: 'shield', label: 'Shield Charm', kind: 'special', armor: 0.35, duration: 250, icon: '🛡️', buyCost: 30 },
};

const enemyDefinitions = {
  goblin: { w: 34, h: 40, hp: 35, speed: 1.2, damage: 9, coinReward: 8 },
  crawler: { w: 32, h: 30, hp: 28, speed: 1.8, damage: 8, coinReward: 10 },
  brute: { w: 44, h: 52, hp: 60, speed: 0.9, damage: 16, coinReward: 22 },
};

const state = {
  keys: {},
  player: {
    x: 120,
    y: 260,
    w: 40,
    h: 58,
    vx: 0,
    vy: 0,
    speed: 3.2,
    jumpPower: 12.5,
    hp: 120,
    maxHp: 120,
    coins: 0,
    facing: 1,
    onGround: false,
    attackCooldown: 0,
    invulnFrames: 0,
    flightFrames: 0,
    shieldFrames: 0,
  },
  levelIndex: 0,
  platforms: [],
  enemies: [],
  pickups: [],
  projectiles: [],
  inventory: {},
  shipParts: [],
  shopOpen: false,
  won: false,
};

function cloneItem(itemId) {
  return { ...itemDefinitions[itemId], usesLeft: itemDefinitions[itemId].uses ?? 1 };
}

function addInventoryItem(itemId, qty = 1) {
  if (!state.inventory[itemId]) state.inventory[itemId] = [];
  for (let i = 0; i < qty; i++) state.inventory[itemId].push(cloneItem(itemId));
}

function spendInventoryItem(itemId) {
  const stack = state.inventory[itemId];
  if (!stack?.length) return null;
  const item = stack[0];
  if (item.usesLeft > 1) item.usesLeft -= 1;
  else stack.shift();
  if (stack.length === 0) delete state.inventory[itemId];
  return item;
}

function loadLevel(index) {
  const config = levelConfigs[index];
  state.levelIndex = index;
  state.platforms = config.platforms.map((p) => ({ ...p }));
  state.enemies = config.enemies.map((entry) => {
    const def = enemyDefinitions[entry.type];
    return {
      ...entry,
      ...def,
      hp: def.hp,
      y: entry.y,
      vx: def.speed,
      dir: Math.random() > 0.5 ? 1 : -1,
      hitFrames: 0,
    };
  });
  state.pickups = config.pickups.map((p) => ({ ...p, picked: false }));
  state.projectiles = [];
  state.player.x = 90;
  state.player.y = 210;
  state.player.vx = 0;
  state.player.vy = 0;
  storyEl.textContent = storyMessages[index + 1] ?? storyMessages[0];
}

function nextLevel() {
  if (state.levelIndex >= levelConfigs.length - 1) {
    state.won = true;
    storyEl.textContent = storyMessages[storyMessages.length - 1];
    return;
  }
  loadLevel(state.levelIndex + 1);
}

function getCurrentLevel() {
  return levelConfigs[state.levelIndex];
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function resolvePlatformCollision(entity, prevY) {
  entity.onGround = false;
  state.platforms.forEach((p) => {
    const hit = rectsOverlap(entity, p);
    if (!hit) return;

    const fallingOnto = prevY + entity.h <= p.y;
    const risingInto = prevY >= p.y + p.h;

    if (fallingOnto && entity.vy >= 0) {
      entity.y = p.y - entity.h;
      entity.vy = 0;
      if (entity === state.player) entity.onGround = true;
    } else if (risingInto && entity.vy < 0) {
      entity.y = p.y + p.h;
      entity.vy = 0;
    }
  });
}

function applyPlayerInput() {
  const p = state.player;
  p.vx = 0;
  if (state.keys.ArrowLeft) {
    p.vx = -p.speed;
    p.facing = -1;
  }
  if (state.keys.ArrowRight) {
    p.vx = p.speed;
    p.facing = 1;
  }
  if (state.keys.ArrowUp && p.onGround) {
    p.vy = -p.jumpPower;
    p.onGround = false;
  }
  if (p.flightFrames > 0 && state.keys.ArrowUp) {
    p.vy -= 0.45;
  }
}

function createMeleeHitbox() {
  const p = state.player;
  return {
    x: p.facing > 0 ? p.x + p.w : p.x - 50,
    y: p.y + 8,
    w: 50,
    h: p.h - 12,
    damage: 18,
  };
}

function useBestWeapon() {
  const weaponPriority = ['dagger', 'bow'];
  for (const id of weaponPriority) {
    if (state.inventory[id]?.length) {
      const used = spendInventoryItem(id);
      state.projectiles.push({
        x: state.player.x + state.player.w / 2,
        y: state.player.y + state.player.h / 2,
        w: 14,
        h: 6,
        vx: state.player.facing * 8,
        damage: used.damage,
        life: 80,
        color: id === 'dagger' ? '#d8ddff' : '#ffd484',
      });
      return true;
    }
  }
  return false;
}

function tryAttack() {
  const p = state.player;
  if (p.attackCooldown > 0) return;
  p.attackCooldown = 22;

  if (useBestWeapon()) return;

  const hitbox = createMeleeHitbox();
  state.enemies.forEach((e) => {
    if (e.hp > 0 && rectsOverlap(hitbox, e)) {
      e.hp -= hitbox.damage;
      e.hitFrames = 10;
      if (e.hp <= 0) state.player.coins += e.coinReward;
    }
  });
}

function applyPhysics() {
  const p = state.player;
  const prevY = p.y;

  p.x += p.vx;
  p.y += p.vy;
  p.vy += GRAVITY;

  resolvePlatformCollision(p, prevY);

  const maxX = getCurrentLevel().width - p.w;
  p.x = Math.max(0, Math.min(maxX, p.x));
  if (p.y > canvas.height + 250) {
    p.hp -= 18;
    p.x = 40;
    p.y = 40;
    p.vy = 0;
  }
}

function updateEnemies() {
  const p = state.player;
  state.enemies.forEach((e) => {
    if (e.hp <= 0) return;

    e.hitFrames = Math.max(0, e.hitFrames - 1);

    const prevY = e.y;
    e.x += e.vx * e.dir;
    e.vy = (e.vy ?? 0) + GRAVITY;
    e.y += e.vy;

    let onGround = false;
    state.platforms.forEach((platform) => {
      const entity = { x: e.x, y: e.y, w: e.w, h: e.h };
      if (!rectsOverlap(entity, platform)) return;
      if (prevY + e.h <= platform.y && e.vy >= 0) {
        e.y = platform.y - e.h;
        e.vy = 0;
        onGround = true;
      }
    });

    const atEdge = !state.platforms.some((platform) => {
      const footX = e.x + (e.dir > 0 ? e.w + 6 : -6);
      return footX >= platform.x && footX <= platform.x + platform.w && Math.abs(platform.y - (e.y + e.h)) < 5;
    });

    if (atEdge || e.x < 0 || e.x > getCurrentLevel().width - e.w) e.dir *= -1;

    if (rectsOverlap(p, e) && p.invulnFrames === 0) {
      const armor = p.shieldFrames > 0 ? 1 - itemDefinitions.shield.armor : 1;
      p.hp -= Math.round(e.damage * armor);
      p.invulnFrames = 45;
      p.vx = p.facing * -4;
      p.vy = -4;
    }

    if (!onGround && e.y > canvas.height + 300) e.hp = 0;
  });
}

function updateProjectiles() {
  state.projectiles.forEach((proj) => {
    proj.x += proj.vx;
    proj.life -= 1;
    state.enemies.forEach((e) => {
      if (e.hp > 0 && rectsOverlap(proj, e)) {
        e.hp -= proj.damage;
        e.hitFrames = 10;
        proj.life = 0;
        if (e.hp <= 0) state.player.coins += e.coinReward;
      }
    });
  });

  state.projectiles = state.projectiles.filter((p) => p.life > 0);
}

function collectPickups() {
  const p = state.player;
  state.pickups.forEach((pick) => {
    if (pick.picked) return;
    const hitbox = { x: pick.x - 10, y: pick.y - 10, w: 24, h: 24 };
    if (!rectsOverlap(p, hitbox)) return;

    pick.picked = true;
    if (pick.kind === 'coin') p.coins += pick.value;
    if (pick.kind === 'heal' || pick.kind === 'boost') addInventoryItem(pick.itemId, 1);
    if (pick.kind === 'part') state.shipParts.push(pick.part);
  });
}

function tryProgressLevel() {
  const p = state.player;
  const curr = getCurrentLevel();
  if (p.x > curr.width - 90) nextLevel();
}

function clampPlayerState() {
  const p = state.player;
  p.attackCooldown = Math.max(0, p.attackCooldown - 1);
  p.invulnFrames = Math.max(0, p.invulnFrames - 1);
  p.flightFrames = Math.max(0, p.flightFrames - 1);
  p.shieldFrames = Math.max(0, p.shieldFrames - 1);
  p.hp = Math.min(p.maxHp, p.hp);
  if (p.hp <= 0) {
    p.hp = p.maxHp;
    p.coins = Math.max(0, p.coins - 20);
    p.x = 70;
    p.y = 80;
    storyEl.textContent = 'You were knocked out! You recover and keep moving.';
  }
}

function useConsumablesHotkeys() {
  if (state.keys.Digit1) {
    const item = spendInventoryItem('burger');
    if (item) state.player.hp = Math.min(state.player.maxHp, state.player.hp + item.heal);
    state.keys.Digit1 = false;
  }
  if (state.keys.Digit2) {
    const item = spendInventoryItem('milkshake');
    if (item) state.player.flightFrames = item.flightFrames;
    state.keys.Digit2 = false;
  }
  if (state.keys.Digit3) {
    const item = spendInventoryItem('shield');
    if (item) state.player.shieldFrames = item.duration;
    state.keys.Digit3 = false;
  }
}

function drawBackground(cameraX) {
  const lvl = getCurrentLevel();
  ctx.fillStyle = lvl.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = lvl.far;
  for (let i = 0; i < 8; i++) {
    const x = ((i * 260 - cameraX * 0.3) % 2200) - 180;
    ctx.beginPath();
    ctx.moveTo(x, FLOOR_Y + 80);
    ctx.lineTo(x + 120, 200 + (i % 3) * 35);
    ctx.lineTo(x + 240, FLOOR_Y + 80);
    ctx.fill();
  }

  ctx.fillStyle = lvl.near;
  for (let i = 0; i < 12; i++) {
    const x = ((i * 190 - cameraX * 0.55) % 2200) - 120;
    ctx.fillRect(x, 320 + (i % 4) * 25, 48, 220);
  }
}

function drawWorld() {
  const cameraX = Math.max(0, Math.min(getCurrentLevel().width - canvas.width, state.player.x - canvas.width * 0.35));
  drawBackground(cameraX);

  ctx.save();
  ctx.translate(-cameraX, 0);

  state.platforms.forEach((p) => {
    ctx.fillStyle = '#5f4f3b';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#7c6a50';
    ctx.fillRect(p.x, p.y, p.w, 8);
  });

  state.pickups.forEach((pick) => {
    if (pick.picked) return;
    const color = spritePalette[pick.kind];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pick.x, pick.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  state.enemies.forEach((e) => {
    if (e.hp <= 0) return;
    ctx.fillStyle = e.hitFrames > 0 ? '#fff5f5' : spritePalette[e.type];
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = '#00000066';
    ctx.fillRect(e.x, e.y - 8, e.w, 4);
    ctx.fillStyle = '#ff6b81';
    ctx.fillRect(e.x, e.y - 8, (e.w * e.hp) / enemyDefinitions[e.type].hp, 4);
  });

  state.projectiles.forEach((proj) => {
    ctx.fillStyle = proj.color;
    ctx.fillRect(proj.x, proj.y, proj.w, proj.h);
  });

  const p = state.player;
  ctx.fillStyle = p.invulnFrames > 0 ? '#a4bcff' : spritePalette.hero;
  ctx.fillRect(p.x, p.y, p.w, p.h);
  if (p.shieldFrames > 0) {
    ctx.strokeStyle = '#8ff0ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + p.h / 2, p.h * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffe18f';
  ctx.fillRect(getCurrentLevel().width - 30, FLOOR_Y - 70, 12, 70);
  ctx.fillStyle = '#ff5666';
  ctx.fillRect(getCurrentLevel().width - 18, FLOOR_Y - 70, 30, 20);

  ctx.restore();
}

function refreshHud() {
  const p = state.player;
  const lvl = getCurrentLevel();
  const defeated = state.enemies.filter((e) => e.hp <= 0).length;
  statsEl.innerHTML = `
    <strong>Biome:</strong> ${lvl.biomeName}<br>
    <strong>HP:</strong> ${p.hp}/${p.maxHp}<br>
    <strong>Coins:</strong> ${p.coins}<br>
    <strong>Ship Parts:</strong> ${state.shipParts.length}/4 (${state.shipParts.join(', ') || 'none'})<br>
    <strong>Enemies Defeated:</strong> ${defeated}/${state.enemies.length}<br>
    <strong>Consumables:</strong> [1] Burger [2] Milkshake [3] Shield
  `;

  const entries = Object.entries(state.inventory)
    .map(([id, stack]) => `${itemDefinitions[id].icon} ${itemDefinitions[id].label} x${stack.length}`)
    .join(' • ');
  inventoryEl.textContent = `Inventory: ${entries || 'empty'}`;
}

function renderShop() {
  if (!state.shopOpen) {
    shopEl.classList.add('hidden');
    return;
  }

  shopEl.classList.remove('hidden');
  const cards = Object.values(itemDefinitions)
    .map((item) => `<button data-buy="${item.id}">${item.icon} ${item.label} - ${item.buyCost} coins</button>`)
    .join('');

  shopEl.innerHTML = `
    <h2>Supply Shop</h2>
    <p>Spend coins to prepare for stronger monsters. Press <kbd>E</kbd> to close.</p>
    <div>${cards}</div>
  `;

  [...shopEl.querySelectorAll('[data-buy]')].forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-buy');
      const item = itemDefinitions[id];
      if (state.player.coins >= item.buyCost) {
        state.player.coins -= item.buyCost;
        addInventoryItem(id, 1);
        refreshHud();
      }
    };
  });
}

function tick() {
  if (!state.shopOpen && !state.won) {
    applyPlayerInput();
    useConsumablesHotkeys();
    applyPhysics();
    updateEnemies();
    updateProjectiles();
    collectPickups();
    tryProgressLevel();
    clampPlayerState();
  }

  drawWorld();
  refreshHud();
  renderShop();

  if (state.won) {
    ctx.fillStyle = '#00000088';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '36px Trebuchet MS';
    ctx.fillText('You rebuilt your starship!', 250, 210);
    ctx.font = '24px Trebuchet MS';
    ctx.fillText('Next stop: duel your brother for the throne 👑', 210, 270);
  }

  requestAnimationFrame(tick);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!state.shopOpen) tryAttack();
    return;
  }
  if (e.code === 'KeyE') {
    state.shopOpen = !state.shopOpen;
    renderShop();
    return;
  }

  state.keys[e.code] = true;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) e.preventDefault();
});

window.addEventListener('keyup', (e) => {
  state.keys[e.code] = false;
});

function startGame() {
  storyEl.textContent = storyMessages[0];
  addInventoryItem('burger', 1);
  addInventoryItem('dagger', 1);
  loadLevel(0);
  tick();
}

startGame();
