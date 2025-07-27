"use strict"

function Game(renderer) {
	const pointersX = [], pointersY = [], keysDown = [],
		mapCols = 16, mapRows = 128, map = [], nodes = [],
		mapCenterX = mapCols >> 1, mapCenterY = mapRows >> 1,
		entities = [], particles = [], clock = [],
		blockables = [], dust = [], pain = [],
		threatLevel = 4,
		message = document.getElementById('M'),
		shakePattern = [.1, -.4, .7, -.3, .5, .2],
		shakeLength = shakePattern.length,
		shakeDuration = 300,
		dustLife = 150

	let seed = 1, pointers = 0,
		stickX, stickY, stickDelta, sayId = 0,
		viewXMin, viewXMax, viewYMin, viewYMax,
		lookX = mapCols >> 1, lookY = mapRows - 4,
		start = Date.now(), cursed = 0, cease = 0,
		shakeUntil = 0, fadeIn = start, fadeOut = 0,
		now, warp, last = start, finish = 0

	// Prevent pinch/zoom on iOS 11.
	if ('ontouchstart' in document) {
		document.addEventListener('gesturestart', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gesturechange', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gestureend', function(event) {
			event.preventDefault()
		}, false)
	}

	function say(what, after) {
		const text = what.shift()
		message.innerHTML = text
		message.style.display = "block"
		clearTimeout(sayId)
		sayId = setTimeout(() => {
			if (what.length < 1) {
				message.style.display = "none"
				after && after()
			} else {
				say(what, after)
			}
		}, 1000 + 200 * text.split(' ').length)
	}
	say([
		"In search of the lost city of S,",
		"S for superstition,",
		"where exactly that was invented,",
		"as legend has it. And to this day,",
		"a mishap happens here every 13 seconds.",
		"Head north and be careful!",
	])

	function spawn(what, a, en, x, y) {
		if (now - en.lastSpawn < 50) {
			return
		}
		en.lastSpawn = now
		for (let i = a.length; i--; ) {
			const e = a[i]
			if (e.alive < now) {
				e.sprite = what
				e.alive = now + dustLife
				e.x = x + (Math.random() - .5) / 2
				e.y = y + (Math.random() - .5) / 2
				break
			}
		}
	}

	function offset(x, y) {
		return Math.round(y) * mapCols + Math.round(x)
	}

	function canMoveTo(e, x, y) {
		x = Math.round(x)
		y = Math.round(y)
		const cell = nodes[offset(e.x, e.y)]
		if (cell.x == x && cell.y == y) {
			return 1
		}
		const neighbors = cell.neighbors
		for (let i = neighbors.length; i--; ) {
			const n = neighbors[i]
			if (n.x == x && n.y == y) {
				return 1
			}
		}
		return 0
	}

	function blocks(x, y) {
		return map[offset(x, y)] & 128
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max)
	}

	function isWater(x, y) {
		const tile = map[offset(x, y)]
		return tile >= 22 && tile < 26
	}

	function moveTo(e, tx, ty, speed) {
		if (e.stunned > now) {
			return
		}
		let dx = tx - e.x, dy = ty - e.y
		if (!(e.moving = Math.abs(dx) + Math.abs(dy) > 0)) {
			return
		}
		const f = Math.min(1, speed * warp / Math.sqrt(dx*dx + dy*dy))
		let x = clamp(e.x + dx * f, 0, mapCols - 1),
			y = clamp(e.y + dy * f, 0, mapRows - 1)
		if (e === player) {
			cease = 0
			if ((blocks(x, y) || !canMoveTo(e, x, y))) {
				if (!blocks(x, e.y) && canMoveTo(e, x, e.y)) {
					y = e.y
				} else if (!blocks(e.x, y) && canMoveTo(e, e.x, y)) {
					x = e.x
				} else {
					return 1
				}
			}
		}
		e.x = x
		e.y = y
		e.dx = dx < 0 ? -1 : 1
		e.sink = isWater(x, y)
		spawn(2, dust, e, x, y)
		return f == 1
	}

	function setPointer(event, down) {
		const touches = event.touches
		if (touches) {
			pointers = touches.length
			for (let i = pointers; i--;) {
				const t = touches[i]
				pointersX[i] = t.pageX
				pointersY[i] = t.pageY
			}
		} else if (!down) {
			pointers = 0
		} else {
			pointers = 1
			pointersX[0] = event.pageX
			pointersY[0] = event.pageY
		}

		// Map to WebGL coordinates.
		for (let i = pointers; i--;) {
			pointersX[i] = (2 * pointersX[i]) / renderer.width - 1
			pointersY[i] = 1 - (2 * pointersY[i]) / renderer.height
		}

		event.stopPropagation()
	}

	function pointerCancel(event) {
		pointers = 0
	}

	function pointerUp(event) {
		setPointer(event, 0)
	}

	function pointerMove(event) {
		setPointer(event, pointers)
	}

	function pointerDown(event) {
		setPointer(event, 1)
		stickX = pointersX[0]
		stickY = pointersY[0]
	}

	document.onmousedown = pointerDown
	document.onmousemove = pointerMove
	document.onmouseup = pointerUp
	document.onmouseout = pointerCancel

	document.ontouchstart = pointerDown
	document.ontouchmove = pointerMove
	document.ontouchend = pointerUp
	document.ontouchleave = pointerCancel
	document.ontouchcancel = pointerCancel

	document.onkeyup = function(event) {
		keysDown[event.keyCode] = false
	}
	document.onkeydown = function(event) {
		keysDown[event.keyCode] = true
	}

	function input() {
		if (player.life <= 0) {
			return
		}
		const max = player.speed
		let x = 0, y = 0
		if (keysDown[37] || keysDown[72]) {
			x -= max
		}
		if (keysDown[39] || keysDown[76]) {
			x += max
		}
		if (keysDown[38] || keysDown[75]) {
			y -= max
		}
		if (keysDown[40] || keysDown[74]) {
			y += max
		}
		if (pointers) {
			const dx = stickX - pointersX[0],
				dy = stickY - pointersY[0]
			stickDelta = dx*dx + dy*dy
			x = -Math.max(-max, Math.min(dx * warp, max))
			y = Math.max(-max, Math.min(dy * warp, max))
		}
		if (cursed && (x || y)) {
			x = -x
			y = -y
		}
		moveTo(player, player.x + x, player.y + y, max)
	}

	function random() {
		// http://indiegamr.com/generate-repeatable-random-numbers-in-js/
		return (seed = (seed * 9301 + 49297) % 233280) / 233280
	}

	// Initialize map.
	const map3 = Math.floor(mapRows / 3),
			waterRow = map3,
			sandRow = map3 * 2,
			areas = [
		{sprite: 22, y: waterRow}, // water
		{sprite: 21, y: waterRow + 1}, // water to sand
		{sprite: 20, y: sandRow}, // sand
		{sprite: 19, y: sandRow + 1}, // sand to soil
		{sprite: 12, y: mapRows}, // soil
	]
	for (let y = 0, i = 0, area = 0, a = areas[area]; y < mapRows; ++y) {
		for (let x = 0; x < mapCols; ++x, ++i) {
			if (y > a.y) {
				a = areas[++area]
			}
			map[i] = a.sprite
			nodes[i] = {
				x: x,
				y: y
			}
		}
	}
	for (let i = 0, y = 0; y < mapRows; ++y) {
		for (let x = 0; x < mapCols; ++x, ++i) {
			const neighbors = []
			if (x > 0) {
				neighbors.push(nodes[offset(x - 1, y)])
			}
			if (x < mapCols - 1) {
				neighbors.push(nodes[offset(x + 1, y)])
			}
			if (y > 0) {
				neighbors.push(nodes[offset(x, y - 1)])
			}
			if (y < mapRows - 1) {
				neighbors.push(nodes[offset(x, y + 1)])
			}
			nodes[i].neighbors = neighbors
		}
	}

	// Create player.
	const player = {
		x: lookX,
		y: lookY,
		dx: 1,
		speed: .05,
		lastSpawn: 0,
		moving: 0,
		life: 100,
		stunned: 0,
		resurrect: function() {
			setTimeout(() => {
				fadeIn = now
				cease = now + 5000
				this.life = 100
			}, 2000)
		},
		update: function() {
			if (this.life <= 0) {
				seeStars(this)
				return 4
			}
			if (this.moving) {
				let frame = Math.round((now % 600) / 150) % 4
				if (frame > 1) {
					frame -= 2
					this.dx = -this.dx
				}
				return 5 + frame
			}
			this.dx = Math.round((now % 2000) / 1000) % 2 ? -1 : 1
			return 3
		}
	}
	entities.push(player)

	// Create idol.
	const idol = {
		x: mapCenterX,
		y: 4.5,
		update: () => 25
	}
	map[offset(mapCenterX, 4)] |= 128
	entities.push(idol)

	function nearPlayer(x, y) {
		const dx = x - player.x,
			dy = y - player.y
		return dx*dx + dy*dy < 3
	}

	// Put blocking tiles on the map.
	for (let y = 0; y < mapRows; ++y) {
		for (let x = 0; x < mapCols; ++x) {
			if (random() < .2 && !nearPlayer(x, y)) {
				map[offset(x, y)] |= 128
			}
		}
	}

	// Remove diagonal corners because they are visually irritating.
	for (let y = 1; y < mapRows - 1; ++y) {
		for (let x = 1; x < mapCols - 1; ++x) {
			const o = offset(x, y - 1)
			if (map[o] & 128 && (
					map[offset(x - 1, y)] & 128 ||
					map[offset(x + 1, y)] & 128)) {
				map[o] &= 127
			}
		}
	}

	// Set entities over blocking tiles.
	for (let y = 0; y < mapRows; ++y) {
		for (let x = 0; x < mapCols; ++x) {
			if (x == Math.floor(idol.x) &&
					y == Math.floor(idol.y)) {
				continue
			}
			const o = offset(x, y)
			if (map[o] & 128) {
				let sprite
				if (y < waterRow) {
					sprite = random() < .2 ? 23 : 24
					map[o] = sprite | 128
					continue
				} else if (y == waterRow) {
					continue
				} else if (y < sandRow) {
					sprite = 17
				} else if (y == sandRow) {
					continue
				} else {
					sprite = random() < .2 ? 18 : 17
				}
				entities.push({
					x: x,
					y: y + .5,
					dx: random() > .5 ? 1 : -1,
					update: () => sprite
				})
			}
		}
	}

	function freeSpot(l, t, w, h) {
		let x, y
		do {
			x = l + random() * w - .5
			y = t + random() * h - .5
		} while (nearPlayer(x, y) || blocks(x, y))
		return {
			x: x,
			y: y
		}
	}

	// Create fauna.
	const jungleRows = Math.round((mapRows - sandRow) * .8)
	for (let i = 0; i < 1000; ++i) {
		const p = freeSpot(0, mapRows - jungleRows, mapCols, jungleRows)
		entities.push({
			x: p.x,
			y: p.y,
			dx: random() > .5 ? 1 : -1,
			update: () => 11
		})
	}
	const desertStart = waterRow + 2
	for (let i = 0; i < 200; ++i) {
		const sprite = 13 + (i % 3),
			p = freeSpot(0, desertStart, mapCols, mapRows - desertStart)
		entities.push({
			x: p.x,
			y: p.y,
			dx: random() > .5 ? 1 : -1,
			update: () => sprite
		})
	}

	function dist(a, b) {
		return Math.abs(Math.round(a.x - b.x)) + Math.abs(Math.round(a.y - b.y))
	}

	function findPath(e, target) {
		for (let i = mapCols * mapRows; i-- > 0; ) {
			const n = nodes[i]
			n.p = null
			n.g = n.f = n.h = 0
		}
		const start = nodes[offset(e.x, e.y)],
			goal = nodes[offset(target.x, target.y)],
			openSet = [start],
			closedSet = []
		start.h = dist(e, target)
		while (openSet.length > 0) {
			let low = 0
			for (let i = 0, l = openSet.length; i < l; ++i) {
				if (openSet[i].f < openSet[low].f) {
					low = i
				}
			}

			const current = openSet[low]
			if (current === goal) {
				const path = []
				let n = current
				path.push(n)
				for (; n.p; n = n.p) {
					path.push(n.p)
				}
				let i = path.length - 2, tx, ty
				if (i > -1) {
					// Move to next tile on the way.
					tx = path[i].x
					ty = path[i].y
				} else {
					// Move within the same tile.
					tx = target.x
					ty = target.y
				}
				moveTo(e, tx, ty, e.speed)
				return 1
			}

			openSet.splice(low, 1)
			closedSet.push(current)

			const neighbors = current.neighbors
			for (let i = 0, l = neighbors.length; i < l; ++i) {
				const neighbor = neighbors[i]
				if (!closedSet.includes(neighbor) &&
						!blocks(neighbor.x, neighbor.y)) {
					const tg = current.g + 1
					let newPath = false
					if (openSet.includes(neighbor)) {
						if (tg < neighbor.g) {
							neighbor.g = tg
							newPath = true
						}
					} else {
						neighbor.g = tg
						newPath = true
						openSet.push(neighbor)
					}
					if (newPath) {
						neighbor.h = dist(neighbor, goal)
						neighbor.f = neighbor.g + neighbor.h
						neighbor.p = current
					}
				}
			}
		}
		return 0
	}

	function seeStars(e) {
		spawn(16, pain, e, e.x, e.y - 1)
	}

	function attack(e, prey) {
		e.attacking = 1
		if (prey.life > 0) {
			prey.life -= warp
			prey.stunned = now + e.stun
			if (prey.life <= 0) {
				const messages = [
					"Phew, that was surprisingly painful!",
					"No need to get excited big guy!",
					"I'm taking a break.",
					"How very unkind.",
					"I'm just going to lie down here. And cry a little.",
					"Wait until I'm that strong too!",
					"That was a set of whistles!",
					"That did the trick!",
					"Over and out.",
					"That stings!",
					"Boys don't cry.",
					"I think I take a little nap.",
					"Let's not do this again.",
				]
				say([messages[Math.floor(Math.random() * messages.length)]])
				fadeOut = now
				prey.resurrect()
			}
		}
		shakeUntil = now + shakeDuration
		seeStars(prey)
	}

	function hunt(e, prey, top, bottom) {
		e.attacking = 0
		if (!finish && cease < now &&
				prey.life > 0 && prey.y > top && prey.y < bottom) {
			const dx = prey.x - e.x,
				dy = prey.y - e.y,
				d = dx*dx + dy*dy
			if (d < .3) {
				attack(e, prey)
				return
			}
			if (d < e.sight && findPath(e, prey)) {
				return
			}
		}
		if (!findPath(e, e.waypoint) ||
				(Math.round(e.x) == Math.round(e.waypoint.x) &&
				Math.round(e.y) == Math.round(e.waypoint.y))) {
			e.nextWaypoint()
		}
	}

	// Create gorillas.
	const gorillas = Math.round((mapRows - sandRow) / threatLevel)
	for (let i = 0, y = mapRows - 11; i < gorillas; ++i, y -= 2) {
		const p = freeSpot(0, y, mapCols, 1),
				e = {
			x: p.x,
			y: p.y,
			sight: 20,
			attacking: 0,
			stun: 10,
			speed: .03 + random() * .01,
			lastSpawn: 0,
			update: function() {
				hunt(this, player, sandRow, mapRows)
				if (this.attacking) {
					return Math.round((now % 200) / 100) % 2 ? 7 : 10
				}
				let frame = Math.round((now % 500) / 100) % 5
				if (frame > 2) {
					frame -= 2
					this.dx = -this.dx
				}
				return 7 + frame
			},
			nextWaypoint: function() {
				this.waypoint = freeSpot(0, y, mapCols, 1)
			}
		}
		e.nextWaypoint()
		entities.push(e)
	}

	// Create scorpions.
	const scorpions = Math.round((sandRow - waterRow) / threatLevel)
	for (let i = 0, y = sandRow; i < scorpions; ++i, y -= 2) {
		const p = freeSpot(0, y, mapCols, 1),
				e = {
			x: p.x,
			y: p.y,
			sight: 20,
			attacking: 0,
			stun: 5,
			speed: .04 + random() * .01,
			lastSpawn: 0,
			update: function() {
				hunt(this, player, waterRow, sandRow)
				return 26 + Math.round((now % 200) / 100) % 2
			},
			nextWaypoint: function() {
				this.waypoint = freeSpot(0, y, mapCols, 1)
			}
		}
		e.nextWaypoint()
		entities.push(e)
	}

	// Create piranhas.
	const piranhas = Math.round(waterRow / threatLevel)
	for (let i = 0, y = waterRow; i < piranhas; ++i, y -= 2) {
		const p = freeSpot(0, y, mapCols, 1),
				e = {
			x: p.x,
			y: p.y,
			sight: 80,
			attacking: 0,
			stun: 5,
			speed: .03 + random() * .02,
			lastSpawn: 0,
			update: function() {
				hunt(this, player, 6, waterRow)
				return 28 + Math.round((now % 200) / 100) % 2
			},
			nextWaypoint: function() {
				this.waypoint = freeSpot(0, y, mapCols, 1)
			}
		}
		e.nextWaypoint()
		entities.push(e)
	}

	// Create dust and pain particles.
	for (let i = 0; i < 32; ++i) {
		dust.push({alive: 0})
	}
	for (let i = 0; i < 16; ++i) {
		pain.push({alive: 0})
	}

	// Create particles.
	for (let i = 0; i < 16; ++i) {
		particles.push({
			vx: .002 + Math.random() * .002,
			vy: .002 + Math.random() * .002,
			update: function() {
				if (this.x === undefined) {
					this.x = -renderer.viewX + (Math.random() - .5) * 2
					this.y = renderer.viewY + (Math.random() - .5) * 2
				}
				this.x += this.vx * warp
				this.y += this.vy * warp
				const rx = this.x + renderer.viewX,
					ry = this.y - renderer.viewY
				if (Math.abs(rx) > 1.1) {
					this.x = -renderer.viewX - 1.1
				}
				if (Math.abs(ry) > 1.1) {
					this.y = renderer.viewY - 1.1
				}
				return 2
			}
		})
	}

	window.onresize = function() {
		renderer.resize()

		const x2 = renderer.xscale / 2, y2 = renderer.yscale / 2
		viewXMin = -1 + x2
		viewXMax = -mapCols * renderer.xscale + 1 + x2
		viewYMin = 1 - y2
		viewYMax = mapRows * renderer.yscale - 1 - y2

		// Update clock geometry.
		clock.length = 0
		const aspect = renderer.width / renderer.height,
			xr = .1, yr = xr * aspect,
			cx = -1 + xr + xr / 2, cy = 1 - yr - yr / 2
		for (let i = 13, a = Math.PI / 2, step = Math.PI * 2 / 13;
				i--; a -= step) {
			const x = cx + Math.cos(a) * xr,
				y = cy + Math.sin(a) * yr
			clock.push({
				x: x,
				y: y
			})
		}
	}
	window.onresize()

	function compareY(a, b) {
		return b.y - a.y
	}

	function fade() {
		if (fadeOut > fadeIn) {
			const fo = now - fadeOut
			return 1 - Math.min(1, fo / 1000)
		}
		return Math.min(1, (now - fadeIn) / 1000)
	}

	function run() {
		requestAnimationFrame(run)

		now = Date.now()
		warp = Math.min(2, (now - last) / 16)
		last = now

		const elapsed = (now - start) / 1000,
				elapsedMod13 = elapsed % 13
		if (!finish) {
			cursed = elapsed < 3 ? 0 : 1 - Math.min(elapsedMod13, 1) / 1

			if (Math.abs(lookY - idol.y) < 2) {
				finish = 1
				say([
					"I found it!",
					"The lost idol of superstition!",
					"With the power to end all superstition.",
					"Or so they say.",
				], function() {
					fadeOut = now
					setTimeout(function() {
						document.getElementById("E").style.display = "block"
					}, 2000)
				})
			}
		}

		input()

		// Animate view to player position.
		const px = player.x, py = player.y,
			dx = lookX - px, dy = lookY - py
		if (dx*dx + dy*dy > .0001) {
			lookX = lookX * .9 + px * .1
			lookY = lookY * .9 + py * .1
		}

		// Fade in/out.
		const f = fade()
		let r = f, g = f, b = f

		// Shake view.
		const xscale = renderer.xscale,
			yscale = renderer.yscale
		let vx = clamp(-lookX * xscale, viewXMax, viewXMin),
			vy = clamp(lookY * yscale, viewYMin, viewYMax)
		if (shakeUntil > now) {
			const power = (shakeUntil - now) / shakeDuration,
				shakePower = power * .05
			vx += shakePattern[(now + 1) % shakeLength] * shakePower
			vy += shakePattern[now % shakeLength] * shakePower
			g = b = 1 - power
		}
		renderer.viewX = vx
		renderer.viewY = vy

		// Push Map.
		{
			const l = Math.max(0, Math.floor((viewXMin - vx) / xscale)),
				r = Math.min(mapCols, l + Math.ceil(2 / xscale) + 1),
				t = Math.max(0, Math.floor((vy - viewYMin) / yscale)),
				b = Math.min(mapRows, t + Math.ceil(2 / yscale) + 1),
				skip = mapCols - (r - l)
			for (let i = t * mapCols + l, y = t; y < b; ++y, i += skip) {
				for (let x = l; x < r; ++x, ++i) {
					renderer.push(map[i] & 127, x * xscale, -y * yscale)
				}
			}
		}

		// Push dust.
		for (let i = dust.length; i--; ) {
			const e = dust[i]
			if (e.alive > now) {
				const s = (e.alive - now) / dustLife
				renderer.push(e.sprite, e.x * xscale, -e.y * yscale, s, s)
			}
		}

		// Push entities.
		entities.sort(compareY)
		for (let i = entities.length; i--; ) {
			const e = entities[i]
			renderer.push(e.update(),
					e.x * xscale,
					-e.y * yscale,
					e.dx, e.dy,
					1, e.sink)
		}

		// Push pain.
		for (let i = pain.length; i--; ) {
			const e = pain[i]
			if (e.alive > now) {
				renderer.push(e.sprite, e.x * xscale, -e.y * yscale)
			}
		}

		// Push particles.
		for (let i = particles.length; i--; ) {
			const e = particles[i]
			renderer.push(e.update(), e.x, -e.y)
		}

		if (!finish) {
			if (cursed) {
				const power = 1 + cursed * .5
				r *= power
				g *= power
				b *= power
			}

			// Push time.
			for (let i = 0; i < elapsedMod13; ++i) {
				const e = clock[i]
				renderer.push(1, e.x - vx, e.y - vy)
			}
		}

		// Virtual touch stick.
		if (pointers) {
			const scale = .5 / Math.max(renderer.xscale, renderer.yscale),
				size = clamp(1 - stickDelta / .05, .1, 1) * scale * 1.5
			renderer.push(0, -vx + stickX, -vy + stickY, size, size)
			renderer.push(0, -vx + pointersX[0], -vy + pointersY[0],
				scale, scale)
		}

		renderer.render(r, g, b)
	}
	run()
}

function Renderer(atlas) {
	const elementsPerVertex = 4,
		bufferData = new Float32Array(1024 * 64 * elementsPerVertex),
		gl = document.getElementById('C').getContext('webgl'),
		tx = gl.createTexture(),
		program = gl.createProgram()

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)

	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

	gl.bindTexture(gl.TEXTURE_2D, tx)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		atlas.canvas)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.generateMipmap(gl.TEXTURE_2D)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, tx)

	function compileShader(type, src) {
		const shader = gl.createShader(type)
		gl.shaderSource(shader, src)
		gl.compileShader(shader)
		return shader
	}
	gl.attachShader(program, compileShader(gl.VERTEX_SHADER,
		document.getElementById('VertexShader').textContent))
	gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER,
		document.getElementById('FragmentShader').textContent))
	gl.linkProgram(program)
	gl.useProgram(program)

	function enableVertexAttrib(name, count, size, offset) {
		const loc = gl.getAttribLocation(program, name)
		gl.enableVertexAttribArray(loc)
		gl.vertexAttribPointer(loc, count, gl.FLOAT, false,
			size * 4, offset * 4)
	}
	enableVertexAttrib('v', 2, elementsPerVertex, 0)
	enableVertexAttrib('t', 2, elementsPerVertex, 2)

	const camLoc = gl.getUniformLocation(program, 'c'),
		moodLoc = gl.getUniformLocation(program, 'm'),
		nudge = .5 / atlas.canvas.width

	gl.clearColor(0, 0, 0, 1)

	function setQuad(
		idx,
		sprite,
		x1, y1,
		x2, y2,
		x3, y3,
		x4, y4,
		sy, sv
	) {
		const offset = sprite << 3,
			l = atlas.coords[offset] + nudge,
			t = atlas.coords[offset + 1] + nudge,
			r = atlas.coords[offset + 6] - nudge

		// Sink.
		let b = atlas.coords[offset + 7]
		b -= (b - t) * sv
		b -= nudge
		y1 -= sy
		y2 -= sy

		// Unwrapped for speed.
		let i = idx * elementsPerVertex

		bufferData[i++] = x1
		bufferData[i++] = y1
		bufferData[i++] = l
		bufferData[i++] = t

		bufferData[i++] = x2
		bufferData[i++] = y2
		bufferData[i++] = r
		bufferData[i++] = t

		bufferData[i++] = x3
		bufferData[i++] = y3
		bufferData[i++] = l
		bufferData[i++] = b

		bufferData[i++] = x2
		bufferData[i++] = y2
		bufferData[i++] = r
		bufferData[i++] = t

		bufferData[i++] = x3
		bufferData[i++] = y3
		bufferData[i++] = l
		bufferData[i++] = b

		bufferData[i++] = x4
		bufferData[i++] = y4
		bufferData[i++] = r
		bufferData[i++] = b
	}

	let verts = 0, x2, y2
	return {
		xscale: 0,
		yscale: 0,
		resize: function() {
			this.width = gl.canvas.clientWidth
			this.height = gl.canvas.clientHeight

			gl.canvas.width = this.width
			gl.canvas.height = this.height
			gl.viewport(0, 0, this.width, this.height)

			this.xscale = .2
			this.yscale = this.xscale * (this.width / this.height)

			x2 = this.xscale / 2
			y2 = this.yscale / 2

			verts = 0
		},
		push: function(sprite, x, y, h, v, ground, sink) {
			const fx = x + this.viewX, fy = y + this.viewY
			if (fx < -2 || fy > 2 || fx > 2 || fy < -2) {
				// Skip out of view sprites.
				return
			}
			const size = atlas.sizes[sprite], sy = size[1]
			h = (h || 1) * size[0]
			v = (v || 1) * sy
			sink = sink ? .2 : 0
			if (ground) {
				y += sy * y2
			}
			setQuad(
				verts,
				sprite,
				// 0---1
				// |  /|
				// | o |
				// |/  |
				// 2---3
				x - x2 * h, y + y2 * v,
				x + x2 * h, y + y2 * v,
				x - x2 * h, y - y2 * v,
				x + x2 * h, y - y2 * v,
				sink * this.yscale, sink
			)
			verts += 6
		},
		render: function(r, g, b) {
			gl.uniform2f(camLoc, this.viewX, this.viewY)
			gl.uniform4f(moodLoc, r, g, b, 1)
			gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.drawArrays(gl.TRIANGLES, 0, verts)
			verts = 0
		}
	}
}

window.onload = function() {
	function svgToImg(svg, sw, sh, dw, dh) {
		const img = new Image()
		img.src = `data:image/svg+xml;base64,${btoa(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
			sw} ${sh}" width="${dw}" height="${dh}">${svg}</svg>`)}`
		return img
	}

	// Packing algorithm from:
	// http://www.blackpawn.com/texts/lightmaps/default.html
	function atlasInsert(node, w, h) {
		if (node.l) {
			// Try to insert image into left and then into right node.
			return atlasInsert(node.l, w, h) || atlasInsert(node.r, w, h)
		}
		if (node.img) {
			// Node already has an image.
			return
		}
		const rc = node.rc,
			rw = rc.r - rc.l,
			rh = rc.b - rc.t
		if (rw < w || rh < h) {
			// Node is too small.
			return
		}
		if (rw == w && rh == h) {
			// Node fits exactly.
			return node
		}
		// Put image into node and split the remaining space into two
		// new nodes.
		node.l = {}
		node.r = {}
		if (rw - w > rh - h) {
			// +-------+---+
			// | image |   |
			// +-------+   |
			// |       | l |
			// |   r   |   |
			// |       |   |
			// +-------+---+
			node.l.rc = {
				l: rc.l + w,
				t: rc.t,
				r: rc.r,
				b: rc.b
			}
			node.r.rc = {
				l: rc.l,
				t: rc.t + h,
				r: rc.l + w,
				b: rc.b,
			}
		} else {
			// +-------+---+
			// | image | l |
			// +-------+---+
			// |           |
			// |     r     |
			// |           |
			// +-----------+
			node.l.rc = {
				l: rc.l + w,
				t: rc.t,
				r: rc.r,
				b: rc.t + h,
			}
			node.r.rc = {
				l: rc.l,
				t: rc.t + h,
				r: rc.r,
				b: rc.b,
			}
		}
		// Fit rectangle to image.
		node.rc.r = rc.l + w - 1
		node.rc.b = rc.t + h - 1
		return node
	}

	function createAtlas(sources) {
		const atlasSize = 1024,
			svgSize = 100,
			tileSize = 128,
			scale = tileSize / svgSize,
			border = 1,
			uvPixel = 1 / atlasSize,
			pad = (border + 2) * uvPixel,
			nodes = {rc: {l: 0, t: 0, r: atlasSize, b: atlasSize}},
			coords = [],
			sizes = [],
			canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			len = sources.length
		canvas.width = canvas.height = atlasSize
		canvas.pending = len
		for (let i = 0; i < len; ++i) {
			const src = sources[i],
				size = src.split('<')[0].trim().split('x'),
				sw = size[0] || svgSize,
				sh = size[1] || svgSize,
				dw = sw * scale | 0,
				dh = sh * scale | 0,
				node = atlasInsert(nodes, dw + border * 2, dh + border * 2)
			if (!node) {
				return
			}
			const rc = node.rc,
				l = rc.l * uvPixel,
				t = rc.t * uvPixel,
				r = l + dw * uvPixel,
				b = t + dh * uvPixel
			// A--C
			// | /|
			// |/ |
			// B--D
			coords.push(
				l + pad, t + pad,
				l + pad, b - pad,
				r - pad, t + pad,
				r - pad, b - pad,
			)
			sizes.push([dw / tileSize, dh / tileSize])
			node.img = svgToImg(src, sw, sh, dw, dh).onload = function() {
				ctx.drawImage(this,
					node.rc.l + border,
					node.rc.t + border)
				--canvas.pending
			}
		}
		return {
			canvas: canvas,
			coords: coords,
			sizes: sizes
		}
	}

	function waitForAtlas(atlas) {
		if (atlas.canvas.pending > 0) {
			setTimeout(function() {
				waitForAtlas(atlas)
			}, 100)
		} else {
			Game(Renderer(atlas))
		}
	}

	const sources = [],
		gs = document.getElementsByTagName('g')
	for (let i = 0, l = gs.length; i < l; ++i) {
		sources.push(gs[i].innerHTML)
	}
	waitForAtlas(createAtlas(sources))
}
