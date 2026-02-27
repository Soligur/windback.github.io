const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statsEl = document.getElementById('stats');
const inventoryEl = document.getElementById('inventory');
const shopEl = document.getElementById('shop');
const storyEl = document.getElementById('story');

const GRAVITY = 0.6;
const FLOOR_Y = 470;

const spritePalette = {
  hero: '#4f6fff',
  goblin: '#56c15f',
  brute: '#cf5f4f',
  crawler: '#8a6ff8',
  boss: '#ff446d',
  coin: '#ffd349',
  heal: '#ff7c8b',
  boost: '#6ee0ff',
  part: '#f2a3ff',
};

const storyMessages = [
  'Banished to Earth by your brother, you must gather ship parts and return to the throne.',
  'Desert raiders guard old wreckage. Salvage your first part.',
  'Vines and beasts in the jungle test your resolve.',
  'Through the swamp fog, tougher monsters stalk every platform.',
  'Ocean ruins hide rare tech. Collect and survive.',
  'Volcanic canyons shake as your ship nears completion.',
  'You launch into the Sky Citadel for one final duel: brother vs. exiled king.',
  'Victory! The throne is reclaimed.'
];

const levelConfigs = [
  {
    id: 'desert', biomeName: 'Scorched Desert', sky: '#f3c37a', far: '#dca25d', near: '#b97845', width: 3000,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 3000, h: 80 },
      { x: 260, y: 410, w: 180, h: 24 },
      { x: 500, y: 370, w: 180, h: 24 },
      { x: 760, y: 335, w: 200, h: 24 },
      { x: 1030, y: 305, w: 210, h: 24 },
      { x: 1300, y: 350, w: 220, h: 24 },
      { x: 1600, y: 320, w: 220, h: 24 },
      { x: 1900, y: 290, w: 220, h: 24 },
      { x: 2220, y: 330, w: 220, h: 24 },
    ],
    enemies: [{ type: 'goblin', x: 520, y: 330 }, { type: 'goblin', x: 1370, y: 310 }, { type: 'brute', x: 2300, y: 278 }],
    pickups: [
      { kind: 'coin', x: 300, y: 380, value: 8 }, { kind: 'coin', x: 820, y: 300, value: 9 },
      { kind: 'heal', x: 1630, y: 280, itemId: 'burger' }, { kind: 'part', x: 2720, y: 420, part: 'Ion Engine' }
    ]
  },
  {
    id: 'jungle', biomeName: 'Neon Jungle', sky: '#7cd08a', far: '#4a9858', near: '#2e5f39', width: 3200,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 3200, h: 80 }, { x: 260, y: 420, w: 180, h: 24 }, { x: 520, y: 380, w: 180, h: 24 },
      { x: 790, y: 340, w: 180, h: 24 }, { x: 1060, y: 300, w: 180, h: 24 }, { x: 1330, y: 340, w: 220, h: 24 },
      { x: 1620, y: 300, w: 200, h: 24 }, { x: 1890, y: 270, w: 180, h: 24 }, { x: 2190, y: 320, w: 220, h: 24 },
      { x: 2520, y: 280, w: 200, h: 24 },
    ],
    enemies: [
      { type: 'crawler', x: 430, y: 390 }, { type: 'goblin', x: 1120, y: 260 }, { type: 'brute', x: 1700, y: 248 },
      { type: 'crawler', x: 2260, y: 280 }, { type: 'goblin', x: 2580, y: 240 },
    ],
    pickups: [
      { kind: 'coin', x: 840, y: 305, value: 10 }, { kind: 'boost', x: 1930, y: 230, itemId: 'milkshake' },
      { kind: 'coin', x: 2220, y: 280, value: 10 }, { kind: 'part', x: 2960, y: 420, part: 'Quantum Hull' }
    ]
  },
  {
    id: 'swamp', biomeName: 'Murk Swamp', sky: '#95a57f', far: '#596850', near: '#3a4136', width: 3300,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 3300, h: 80 }, { x: 260, y: 420, w: 220, h: 24 }, { x: 560, y: 380, w: 220, h: 24 },
      { x: 860, y: 340, w: 220, h: 24 }, { x: 1160, y: 300, w: 220, h: 24 }, { x: 1470, y: 340, w: 220, h: 24 },
      { x: 1780, y: 300, w: 220, h: 24 }, { x: 2090, y: 260, w: 220, h: 24 }, { x: 2420, y: 300, w: 220, h: 24 },
      { x: 2740, y: 260, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'crawler', x: 360, y: 390 }, { type: 'goblin', x: 920, y: 300 }, { type: 'brute', x: 1540, y: 288 },
      { type: 'crawler', x: 1840, y: 260 }, { type: 'brute', x: 2470, y: 248 }, { type: 'crawler', x: 2800, y: 220 },
    ],
    pickups: [
      { kind: 'coin', x: 610, y: 340, value: 11 }, { kind: 'coin', x: 1200, y: 260, value: 12 },
      { kind: 'heal', x: 2120, y: 220, itemId: 'burger' }, { kind: 'part', x: 3060, y: 420, part: 'Warp Core' }
    ]
  },
  {
    id: 'ocean', biomeName: 'Abyssal Ocean', sky: '#7ab7ff', far: '#4f7ed3', near: '#2f4f99', width: 3400,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 3400, h: 80 }, { x: 260, y: 420, w: 200, h: 24 }, { x: 540, y: 380, w: 200, h: 24 },
      { x: 820, y: 340, w: 200, h: 24 }, { x: 1110, y: 300, w: 220, h: 24 }, { x: 1420, y: 260, w: 220, h: 24 },
      { x: 1730, y: 300, w: 220, h: 24 }, { x: 2040, y: 260, w: 220, h: 24 }, { x: 2360, y: 220, w: 220, h: 24 },
      { x: 2670, y: 260, w: 220, h: 24 }, { x: 2980, y: 220, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'crawler', x: 350, y: 390 }, { type: 'goblin', x: 870, y: 300 }, { type: 'brute', x: 1170, y: 248 },
      { type: 'crawler', x: 1790, y: 260 }, { type: 'brute', x: 2410, y: 208 }, { type: 'crawler', x: 3040, y: 180 },
    ],
    pickups: [
      { kind: 'coin', x: 560, y: 340, value: 12 }, { kind: 'boost', x: 1450, y: 220, itemId: 'milkshake' },
      { kind: 'coin', x: 2380, y: 180, value: 13 }, { kind: 'part', x: 3250, y: 420, part: 'Star Navigator' }
    ]
  },
  {
    id: 'volcanic', biomeName: 'Volcanic Rim', sky: '#f17f70', far: '#b74949', near: '#6a2b2b', width: 3600,
    platforms: [
      { x: 0, y: FLOOR_Y, w: 3600, h: 80 }, { x: 260, y: 420, w: 200, h: 24 }, { x: 550, y: 380, w: 200, h: 24 },
      { x: 840, y: 340, w: 210, h: 24 }, { x: 1130, y: 300, w: 220, h: 24 }, { x: 1430, y: 340, w: 220, h: 24 },
      { x: 1730, y: 300, w: 220, h: 24 }, { x: 2050, y: 260, w: 220, h: 24 }, { x: 2370, y: 220, w: 220, h: 24 },
      { x: 2690, y: 260, w: 220, h: 24 }, { x: 3010, y: 220, w: 220, h: 24 },
    ],
    enemies: [
      { type: 'brute', x: 620, y: 328 }, { type: 'crawler', x: 1200, y: 260 }, { type: 'brute', x: 1770, y: 248 },
      { type: 'crawler', x: 2400, y: 180 }, { type: 'brute', x: 3060, y: 180 },
    ],
    pickups: [
      { kind: 'coin', x: 900, y: 300, value: 14 }, { kind: 'heal', x: 2080, y: 220, itemId: 'burger' },
      { kind: 'part', x: 3440, y: 420, part: 'Royal Reactor' }
    ]
  },
  {
    id: 'boss', biomeName: 'Sky Citadel', sky: '#b39dff', far: '#6d5ac8', near: '#3d327f', width: 2200,
    boss: { x: 1700, y: 390, w: 70, h: 80, hp: 420, speed: 1.6, damage: 20, coinReward: 200, name: 'Usurper King' },
    platforms: [
      { x: 0, y: FLOOR_Y, w: 2200, h: 80 }, { x: 280, y: 410, w: 220, h: 24 }, { x: 620, y: 350, w: 220, h: 24 },
      { x: 980, y: 300, w: 250, h: 24 }, { x: 1360, y: 350, w: 220, h: 24 },
    ],
    enemies: [],
    pickups: [
      { kind: 'coin', x: 680, y: 310, value: 20 }, { kind: 'heal', x: 1010, y: 260, itemId: 'burger' },
      { kind: 'boost', x: 1400, y: 310, itemId: 'milkshake' }
    ]
  }
];

const itemDefinitions = {
  burger: { id: 'burger', label: 'Burger', kind: 'heal', heal: 24, icon: '🍔', buyCost: 10 },
  milkshake: { id: 'milkshake', label: 'Milkshake', kind: 'boost', flightFrames: 220, icon: '🥤', buyCost: 20 },
  dagger: { id: 'dagger', label: 'Throw Dagger', kind: 'weapon', damage: 20, uses: 5, icon: '🗡️', buyCost: 18 },
  bow: { id: 'bow', label: 'Bow & Arrow', kind: 'weapon', damage: 16, uses: 10, icon: '🏹', buyCost: 24 },
  shield: { id: 'shield', label: 'Shield Charm', kind: 'special', armor: 0.35, duration: 220, icon: '🛡️', buyCost: 28 },
};

const enemyDefinitions = {
  goblin: { w: 34, h: 40, hp: 34, speed: 1.3, damage: 11, coinReward: 10 },
  crawler: { w: 32, h: 30, hp: 30, speed: 2.0, damage: 10, coinReward: 12 },
  brute: { w: 44, h: 52, hp: 68, speed: 1.0, damage: 18, coinReward: 24 },
};

const state = {
  keys: {},
  player: {
    x: 120, y: 260, w: 40, h: 58, vx: 0, vy: 0, speed: 3.4, jumpPower: 13.8,
    hp: 80, maxHp: 80, coins: 0, facing: 1, onGround: false, attackCooldown: 0,
    invulnFrames: 0, flightFrames: 0, shieldFrames: 0,
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
  finalBoss: null,
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
    return { ...entry, ...def, hp: def.hp, vx: def.speed, dir: Math.random() > 0.5 ? 1 : -1, hitFrames: 0 };
  });
  state.finalBoss = config.boss ? { ...config.boss, maxHp: config.boss.hp, dir: -1, vy: 0, hitFrames: 0 } : null;
  state.pickups = config.pickups.map((p) => ({ ...p, picked: false }));
  state.projectiles = [];
  state.player.x = 90;
  state.player.y = 180;
  state.player.vx = 0;
  state.player.vy = 0;
  storyEl.textContent = storyMessages[Math.min(index + 1, storyMessages.length - 1)];
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
  if (entity === state.player) entity.onGround = false;
  state.platforms.forEach((p) => {
    if (!rectsOverlap(entity, p)) return;
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
  if (state.keys.ArrowLeft) { p.vx = -p.speed; p.facing = -1; }
  if (state.keys.ArrowRight) { p.vx = p.speed; p.facing = 1; }
  if (state.keys.ArrowUp && p.onGround) { p.vy = -p.jumpPower; p.onGround = false; }
  if (p.flightFrames > 0 && state.keys.ArrowUp) p.vy -= 0.45;
}

function attackDirection() {
  if (state.keys.ArrowLeft && !state.keys.ArrowRight) return -1;
  if (state.keys.ArrowRight && !state.keys.ArrowLeft) return 1;
  return state.player.facing;
}

function createMeleeHitbox(dir) {
  const p = state.player;
  return { x: dir > 0 ? p.x + p.w : p.x - 50, y: p.y + 8, w: 50, h: p.h - 12, damage: 20 };
}

function applyDamageToTargets(hitbox, damage) {
  state.enemies.forEach((e) => {
    if (e.hp > 0 && rectsOverlap(hitbox, e)) {
      e.hp -= damage;
      e.hitFrames = 10;
      if (e.hp <= 0) state.player.coins += e.coinReward;
    }
  });

  const b = state.finalBoss;
  if (b && b.hp > 0 && rectsOverlap(hitbox, b)) {
    b.hp -= damage;
    b.hitFrames = 10;
    if (b.hp <= 0) {
      state.player.coins += b.coinReward;
      state.won = true;
      storyEl.textContent = storyMessages[storyMessages.length - 1];
    }
  }
}

function useBestWeapon(dir) {
  const weaponPriority = ['dagger', 'bow'];
  for (const id of weaponPriority) {
    if (state.inventory[id]?.length) {
      const used = spendInventoryItem(id);
      state.projectiles.push({
        x: state.player.x + state.player.w / 2,
        y: state.player.y + state.player.h / 2,
        w: 14,
        h: 6,
        vx: dir * 8,
        damage: used.damage,
        life: 90,
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
  p.attackCooldown = 18;
  const dir = attackDirection();
  p.facing = dir;

  if (useBestWeapon(dir)) return;

  const hitbox = createMeleeHitbox(dir);
  applyDamageToTargets(hitbox, hitbox.damage);
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
    p.hp -= 16;
    p.x = 40; p.y = 40; p.vy = 0;
  }
}

function updateEnemyEntity(e) {
  if (e.hp <= 0) return;
  const p = state.player;
  e.hitFrames = Math.max(0, e.hitFrames - 1);

  const prevY = e.y;
  e.x += e.vx * e.dir;
  e.vy = (e.vy ?? 0) + GRAVITY;
  e.y += e.vy;

  let onGround = false;
  state.platforms.forEach((platform) => {
    if (!rectsOverlap({ x: e.x, y: e.y, w: e.w, h: e.h }, platform)) return;
    if (prevY + e.h <= platform.y && e.vy >= 0) {
      e.y = platform.y - e.h;
      e.vy = 0;
      onGround = true;
    }
  });

  const atEdge = !state.platforms.some((platform) => {
    const footX = e.x + (e.dir > 0 ? e.w + 5 : -5);
    return footX >= platform.x && footX <= platform.x + platform.w && Math.abs(platform.y - (e.y + e.h)) < 6;
  });

  if (atEdge || e.x < 0 || e.x > getCurrentLevel().width - e.w) e.dir *= -1;

  if (rectsOverlap(p, e) && p.invulnFrames === 0) {
    const armor = p.shieldFrames > 0 ? 1 - itemDefinitions.shield.armor : 1;
    p.hp -= Math.round(e.damage * armor);
    p.invulnFrames = 42;
    p.vx = p.facing * -4;
    p.vy = -4;
  }

  if (!onGround && e.y > canvas.height + 300) e.hp = 0;
}

function updateEnemies() {
  state.enemies.forEach(updateEnemyEntity);

  const b = state.finalBoss;
  if (!b || b.hp <= 0 || state.won) return;
  const p = state.player;
  b.hitFrames = Math.max(0, b.hitFrames - 1);

  b.dir = p.x < b.x ? -1 : 1;
  b.x += b.speed * b.dir;

  const prevY = b.y;
  b.vy += GRAVITY;
  b.y += b.vy;
  state.platforms.forEach((platform) => {
    if (!rectsOverlap({ x: b.x, y: b.y, w: b.w, h: b.h }, platform)) return;
    if (prevY + b.h <= platform.y && b.vy >= 0) {
      b.y = platform.y - b.h;
      b.vy = 0;
    }
  });

  if (Math.abs(p.x - b.x) < 180 && Math.random() < 0.02 && b.vy === 0) b.vy = -11;

  if (rectsOverlap(p, b) && p.invulnFrames === 0) {
    const armor = p.shieldFrames > 0 ? 1 - itemDefinitions.shield.armor : 1;
    p.hp -= Math.round(b.damage * armor);
    p.invulnFrames = 42;
    p.vx = -b.dir * 4;
    p.vy = -5;
  }
}

function updateProjectiles() {
  state.projectiles.forEach((proj) => {
    proj.x += proj.vx;
    proj.life -= 1;
    applyDamageToTargets(proj, proj.damage);
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
  if (state.won || state.finalBoss) return;
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
    p.x = 70; p.y = 80;
    storyEl.textContent = 'You were defeated and regrouped at your last camp.';
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
  for (let i = 0; i < 10; i++) {
    const x = ((i * 250 - cameraX * 0.3) % 2400) - 200;
    ctx.beginPath();
    ctx.moveTo(x, FLOOR_Y + 80);
    ctx.lineTo(x + 120, 190 + (i % 3) * 35);
    ctx.lineTo(x + 240, FLOOR_Y + 80);
    ctx.fill();
  }

  ctx.fillStyle = lvl.near;
  for (let i = 0; i < 15; i++) {
    const x = ((i * 180 - cameraX * 0.55) % 2400) - 130;
    ctx.fillRect(x, 320 + (i % 4) * 25, 48, 220);
  }
}

function drawHealthBar(x, y, w, hp, maxHp) {
  ctx.fillStyle = '#00000088';
  ctx.fillRect(x, y, w, 6);
  ctx.fillStyle = '#ff6b81';
  ctx.fillRect(x, y, (w * Math.max(hp, 0)) / maxHp, 6);
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
    ctx.fillStyle = spritePalette[pick.kind];
    ctx.beginPath();
    ctx.arc(pick.x, pick.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  state.enemies.forEach((e) => {
    if (e.hp <= 0) return;
    ctx.fillStyle = e.hitFrames > 0 ? '#fff5f5' : spritePalette[e.type];
    ctx.fillRect(e.x, e.y, e.w, e.h);
    drawHealthBar(e.x, e.y - 8, e.w, e.hp, enemyDefinitions[e.type].hp);
  });

  const b = state.finalBoss;
  if (b && b.hp > 0) {
    ctx.fillStyle = b.hitFrames ? '#ffe6eb' : spritePalette.boss;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    drawHealthBar(b.x - 5, b.y - 10, b.w + 10, b.hp, b.maxHp);
  }

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

  if (!state.finalBoss) {
    ctx.fillStyle = '#ffe18f';
    ctx.fillRect(getCurrentLevel().width - 30, FLOOR_Y - 70, 12, 70);
    ctx.fillStyle = '#ff5666';
    ctx.fillRect(getCurrentLevel().width - 18, FLOOR_Y - 70, 30, 20);
  }

  ctx.restore();

  if (b && b.hp > 0) {
    ctx.fillStyle = '#111111aa';
    ctx.fillRect(210, 18, 540, 32);
    ctx.fillStyle = '#ffc8d2';
    ctx.font = '16px Trebuchet MS';
    ctx.fillText(`${b.name} HP`, 220, 39);
    ctx.fillStyle = '#ff446d';
    ctx.fillRect(320, 24, (420 * b.hp) / b.maxHp, 18);
  }
}

function refreshHud() {
  const p = state.player;
  const lvl = getCurrentLevel();
  const defeated = state.enemies.filter((e) => e.hp <= 0).length;
  statsEl.innerHTML = `
    <strong>Biome:</strong> ${lvl.biomeName}<br>
    <strong>HP:</strong> ${p.hp}/${p.maxHp}<br>
    <strong>Coins:</strong> ${p.coins}<br>
    <strong>Ship Parts:</strong> ${state.shipParts.length}/6 (${state.shipParts.join(', ') || 'none'})<br>
    <strong>Enemies Defeated:</strong> ${defeated}/${state.enemies.length}${state.finalBoss ? ' + Final Boss' : ''}<br>
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
    .map((item) => `<button type="button" data-buy="${item.id}">${item.icon} ${item.label} - ${item.buyCost} coins</button>`)
    .join('');

  shopEl.innerHTML = `
    <h2>Supply Shop</h2>
    <p>Spend coins to prepare for stronger monsters. Press <kbd>E</kbd> to close.</p>
    <div>${cards}</div>
  `;
}

shopEl.addEventListener('click', (event) => {
  const target = event.target.closest('[data-buy]');
  if (!target) return;
  const id = target.getAttribute('data-buy');
  const item = itemDefinitions[id];
  if (!item) return;
  if (state.player.coins < item.buyCost) return;
  state.player.coins -= item.buyCost;
  addInventoryItem(id, 1);
  refreshHud();
});

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
    ctx.fillStyle = '#00000099';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '34px Trebuchet MS';
    ctx.fillText('You defeated your brother and reclaimed the throne!', 110, 230);
    ctx.font = '23px Trebuchet MS';
    ctx.fillText('The exiled king rises again 👑', 300, 280);
  }

  requestAnimationFrame(tick);
}

window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Space') {
    if (!state.shopOpen && !e.repeat) tryAttack();
    return;
  }
  if (e.code === 'KeyE') {
    if (!e.repeat) state.shopOpen = !state.shopOpen;
    return;
  }
  state.keys[e.code] = true;
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
