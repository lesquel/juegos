function SfxrParams() {
  this.setSettings = function (t) {
    for (var e = 0; e < 24; e++) this[String.fromCharCode(97 + e)] = t[e] || 0;
    this.c < 0.01 && (this.c = 0.01);
    var i = this.b + this.c + this.e;
    if (i < 0.18) {
      var n = 0.18 / i;
      (this.b *= n), (this.c *= n), (this.e *= n);
    }
  };
}
function SfxrSynth() {
  this._params = new SfxrParams();
  var t, e, i, n, o, r, s, a, h, c, p, f;
  (this.reset = function () {
    var t = this._params;
    (n = 100 / (t.f * t.f + 0.001)),
      (o = 100 / (t.g * t.g + 0.001)),
      (r = 1 - t.h * t.h * t.h * 0.01),
      (s = -t.i * t.i * t.i * 1e-6),
      t.a || ((p = 0.5 - t.n / 2), (f = 5e-5 * -t.o)),
      (a = 1 + t.l * t.l * (t.l > 0 ? -0.9 : 10)),
      (h = 0),
      (c = 1 == t.m ? 0 : (1 - t.m) * (1 - t.m) * 2e4 + 32);
  }),
    (this.totalReset = function () {
      this.reset();
      var n = this._params;
      return (
        (t = n.b * n.b * 1e5),
        (e = n.c * n.c * 1e5),
        (i = n.e * n.e * 1e5 + 12),
        3 * (((t + e + i) / 3) | 0)
      );
    }),
    (this.synthWave = function (u, d) {
      var l = this._params,
        m = 1 != l.s || l.v,
        w = l.v * l.v * 0.1,
        x = 1 + 3e-4 * l.w,
        v = l.s * l.s * l.s * 0.1,
        y = 1 + 1e-4 * l.t,
        g = 1 != l.s,
        S = l.x * l.x,
        b = l.g,
        k = l.q || l.r,
        G = l.r * l.r * l.r * 0.2,
        q = l.q * l.q * (l.q < 0 ? -1020 : 1020),
        P = l.p ? 32 + (((1 - l.p) * (1 - l.p) * 2e4) | 0) : 0,
        A = l.d,
        M = l.j / 2,
        E = l.k * l.k * 0.01,
        j = l.a,
        I = t,
        R = 1 / t,
        B = 1 / e,
        T = 1 / i,
        V = (5 / (1 + l.u * l.u * 20)) * (0.01 + v);
      V > 0.8 && (V = 0.8), (V = 1 - V);
      for (
        var Y,
          K,
          W,
          F,
          C,
          O,
          L = !1,
          J = 0,
          Q = 0,
          Z = 0,
          H = 0,
          U = 0,
          D = 0,
          X = 0,
          N = 0,
          z = 0,
          _ = 0,
          $ = new Array(1024),
          tt = new Array(32),
          et = $.length;
        et--;

      )
        $[et] = 0;
      for (et = tt.length; et--; ) tt[et] = 2 * Math.random() - 1;
      for (et = 0; et < d; et++) {
        if (L) return et;
        if (
          (P && ++z >= P && ((z = 0), this.reset()),
          c && ++h >= c && ((c = 0), (n *= a)),
          (r += s),
          (n *= r) > o && ((n = o), b > 0 && (L = !0)),
          (K = n),
          M > 0 && ((_ += E), (K *= 1 + Math.sin(_) * M)),
          (K |= 0) < 8 && (K = 8),
          j || ((p += f) < 0 ? (p = 0) : p > 0.5 && (p = 0.5)),
          ++Q > I)
        )
          switch (((Q = 0), ++J)) {
            case 1:
              I = e;
              break;
            case 2:
              I = i;
          }
        switch (J) {
          case 0:
            Z = Q * R;
            break;
          case 1:
            Z = 1 + 2 * (1 - Q * B) * A;
            break;
          case 2:
            Z = 1 - Q * T;
            break;
          case 3:
            (Z = 0), (L = !0);
        }
        k && ((W = 0 | (q += G)) < 0 ? (W = -W) : W > 1023 && (W = 1023)),
          m && x && ((w *= x) < 1e-5 ? (w = 1e-5) : w > 0.1 && (w = 0.1)),
          (O = 0);
        for (var it = 8; it--; ) {
          if (++X >= K && ((X %= K), 3 == j))
            for (var nt = tt.length; nt--; ) tt[nt] = 2 * Math.random() - 1;
          switch (j) {
            case 0:
              C = X / K < p ? 0.5 : -0.5;
              break;
            case 1:
              C = 1 - (X / K) * 2;
              break;
            case 2:
              C =
                0.225 *
                  (((C =
                    1.27323954 *
                      (F = 6.28318531 * ((F = X / K) > 0.5 ? F - 1 : F)) +
                    0.405284735 * F * F * (F < 0 ? 1 : -1)) < 0
                    ? -1
                    : 1) *
                    C *
                    C -
                    C) +
                C;
              break;
            case 3:
              C = tt[Math.abs(((32 * X) / K) | 0)];
          }
          m &&
            ((Y = D),
            (v *= y) < 0 ? (v = 0) : v > 0.1 && (v = 0.1),
            g ? ((U += (C - D) * v), (U *= V)) : ((D = C), (U = 0)),
            (H += (D += U) - Y),
            (C = H *= 1 - w)),
            k && (($[N % 1024] = C), (C += $[(N - W + 1024) % 1024]), N++),
            (O += C);
        }
        (O *= 0.125 * Z * S),
          (u[et] = O >= 1 ? 32767 : O <= -1 ? -32768 : (32767 * O) | 0);
      }
      return d;
    });
}
var __extends =
    (this && this.__extends) ||
    (function () {
      var t =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (t, e) {
            t.__proto__ = e;
          }) ||
        function (t, e) {
          for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
        };
      return function (e, i) {
        function n() {
          this.constructor = e;
        }
        t(e, i),
          (e.prototype =
            null === i
              ? Object.create(i)
              : ((n.prototype = i.prototype), new n()));
      };
    })(),
  synth = new SfxrSynth();
window.jsfxr = function (t) {
  synth._params.setSettings(t);
  var e = synth.totalReset(),
    i = new Uint8Array(4 * (((e + 1) / 2) | 0) + 44),
    n = 2 * synth.synthWave(new Uint16Array(i.buffer, 44), e),
    o = new Uint32Array(i.buffer, 0, 44);
  return (
    (o[0] = 1179011410),
    (o[1] = n + 36),
    (o[2] = 1163280727),
    (o[3] = 544501094),
    (o[4] = 16),
    (o[5] = 65537),
    (o[6] = 44100),
    (o[7] = 88200),
    (o[8] = 1048578),
    (o[9] = 1635017060),
    (o[10] = n),
    i.buffer
  );
};
var Game;
!(function (t) {
  var e = (function () {
    function e(t, e, i) {
      (this.pos = t), (this.w = e), (this.h = i);
    }
    return (
      (e.prototype.test = function (t) {
        return (
          this.pos.x < t.pos.x + t.w &&
          this.pos.x + this.w > t.pos.x &&
          this.pos.y < t.pos.y + t.h &&
          this.h + this.pos.y > t.pos.y
        );
      }),
      (e.prototype.contains = function (t) {
        return (
          this.pos.x <= t.pos.x &&
          this.pos.x + this.w >= t.pos.x + t.w &&
          this.pos.y <= t.pos.y &&
          this.pos.y + this.h >= t.pos.y + t.h
        );
      }),
      (e.prototype.intersect = function (i) {
        var n = Math.round(this.pos.x),
          o = Math.round(this.pos.y),
          r = n + this.w,
          s = o + this.h,
          a = Math.round(i.pos.x),
          h = Math.round(i.pos.y),
          c = a + i.w,
          p = h + i.h,
          f = n < a ? a : n,
          u = o < h ? h : o,
          d = r < c ? r : c,
          l = s < p ? s : p;
        return new e(new t.Vec(f, u), d - f, l - u);
      }),
      (e.prototype.clone = function () {
        return new e(this.pos.clone(), this.w, this.h);
      }),
      e
    );
  })();
  t.Box = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(i, n, o) {
      (this.tick = 0),
        (this.frame = 0),
        (this.end = !1),
        (this.color = n),
        (this.box = new t.Box(i, 16, 16)),
        o && e.sfx.play();
    }
    return (
      (e.prototype.render = function (t) {
        this.frame < 3 && e.sprite.render(t, this.box, this.color, this.frame);
      }),
      (e.prototype.update = function (t) {
        this.tick++ % 4 == 0 && (this.end = ++this.frame > 2);
      }),
      e
    );
  })();
  t.Bumm = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(i, n, o) {
      (this.collided = new t.Vec(0, 0)),
        (this.frame = 0),
        (this.tick = 0),
        (this.flip = Math.random() < 0.5);
      var r = this.flip ? 240 : 0,
        s = Math.round(136 * Math.random()) + 32;
      (this.box = new t.Box(new t.Vec(r, s), 16, 16)),
        (this.speed = new t.Vec(this.flip ? -i : i, n)),
        (this.color = (e.count++ % 4) + 1),
        (this.type = o);
    }
    return (
      (e.prototype.render = function (t) {
        var i = 2 * this.type;
        String(this.speed.x).charAt(0);
        this.flip && null !== e.sprites[i + 1] && i++,
          e.sprites[i].render(
            t,
            this.box,
            this.color,
            3 != this.frame ? this.frame : 1
          );
      }),
      (e.prototype.update = function (t) {
        this.tick++ % 7 == 0 && (this.frame = ++this.frame % 3);
      }),
      (e.sprites = []),
      (e.count = 0),
      e
    );
  })();
  t.Enemy = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(e, i) {
      (this.face = 0),
        (this.lasers = []),
        (this.jetSound = null),
        (this.pos = new t.Vec(e, i)),
        (this.box = new t.Box(null, 16, 24)),
        this.spawn();
    }
    return (
      (e.prototype.spawn = function (e) {
        void 0 === e && (e = -200),
          (this.tick = e),
          (this.walk = !0),
          (this.pick = !1),
          (this.face = 0),
          (this.frame = 1),
          (this.shoot = !1),
          (this.speed = new t.Vec(0, 1)),
          (this.collided = new t.Vec(0, 1)),
          (this.box.pos = this.pos.clone());
      }),
      (e.prototype.mute = function () {
        this.jetSound && (this.jetSound.stop(), (this.jetSound = null));
      }),
      (e.prototype.inactive = function () {
        return this.tick < -100;
      }),
      (e.prototype.spawning = function () {
        return this.tick < 0;
      }),
      (e.prototype.render = function (t) {
        var i = this.box,
          n = this.frame;
        this.lasers.forEach(function (e) {
          e.render(t);
        }),
          this.inactive() ||
            (this.spawning() && this.tick % 30 < -15 && (t.globalAlpha = 0.3),
            this.walk
              ? ((n = n < 3 ? n : 1), e.sprite.render(t, i, this.face, n + 1))
              : e.sprite.render(t, i, this.face, 0),
            this.walk ||
              e.jetSprite.render(t, this.box, this.face + 2, this.frame),
            (t.globalAlpha = 1));
      }),
      (e.prototype.update = function (t) {
        t % 8 == 0 &&
          (this.shoot && this.shot(),
          this.walk
            ? 0 != this.speed.x && (this.frame = ++this.frame % 4)
            : (this.frame = ++this.frame % 3)),
          this.walk && this.mute(),
          this.walk ||
            this.jetSound ||
            (this.jetSound = e.jetSfx.play(0.1, !0)),
          this.tick++;
      }),
      (e.prototype.shot = function () {
        this.lasers.push(new t.Laser(this));
      }),
      e
    );
  })();
  t.Hero = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(i) {
      (this.collided = new t.Vec(0, 0)),
        (this.speed = new t.Vec(-6, 0)),
        (this.end = !1),
        (this.add = 5),
        (this.width = 112),
        (this.tick = 15);
      var n = i.box.clone(),
        o = n.pos;
      i.face
        ? ((this.speed.x = -this.speed.x), (o.x += n.w))
        : (o.x -= this.add),
        (o.y += 12),
        (n.h = 1),
        (n.w = this.add),
        (this.box = n),
        (this.color = Math.round(2 * Math.random()) + 1),
        (this.face = i.face),
        e.sfx.play(0.5);
    }
    return (
      (e.prototype.render = function (t) {
        var i = this.box;
        this.face
          ? e.sprite2.render(t, i, this.color, 0, this.width - i.w)
          : e.sprite1.render(t, i, this.color, 0);
      }),
      (e.prototype.update = function (t) {
        var e = this.box,
          i = --this.tick < 0 ? -this.add : this.add;
        (e.w += i), this.face && (e.pos.x -= i), (this.end = e.w <= this.add);
      }),
      e
    );
  })();
  t.Laser = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e() {
      (this.collided = new t.Vec(0, 0)), (this.speed = new t.Vec(0, 0.5));
      var e = 8 * Math.round(30 * Math.random());
      (this.box = new t.Box(new t.Vec(e, 16), 16, 12)),
        (this.type = Math.round(4 * Math.random())),
        (this.color = Math.round(2 * Math.random()) + 1);
    }
    return (
      (e.prototype.render = function (t) {
        e.sprite.render(t, this.box, this.color, this.type);
      }),
      (e.prototype.update = function (t) {}),
      e
    );
  })();
  t.Loot = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(e, i) {
      (this.tick = 0),
        (this.active = 0),
        (this.planet = new t.Planet()),
        (this.title = new t.Txt(128 - 3 * e.length, 56, e, 0)),
        (this.items = [
          new t.Txt(86, 80, "Start New Game"),
          new t.Txt(80, 96, "Reset High Score"),
          new t.Txt(92, 112),
        ]),
        (this.hint = new t.Txt(
          8,
          184,
          "Move with Arrow keys and fire with Shift",
          2
        )),
        (this.onstart = i);
    }
    return (
      (e.prototype.stop = function () {}),
      (e.prototype.input = function (i, n) {
        if (n) {
          var o = !1;
          if (i[0]) {
            switch (this.active) {
              case 0:
                this.onstart();
                break;
              case 1:
                t.Session.get().clear();
                break;
              case 2:
                var r = t.Sfx.master.gain;
                r.value = r.value ? 0 : 1;
            }
            o = !0;
          } else
            i[38] || i[87] || i[90]
              ? (--this.active < 0 && (this.active += this.items.length),
                (o = !0))
              : (i[40] || i[83]) &&
                (++this.active >= this.items.length &&
                  (this.active -= this.items.length),
                (o = !0));
          o && e.sfx.play();
        }
      }),
      (e.prototype.render = function (t) {
        this.planet.render(t),
          this.title.render(t),
          this.items.forEach(function (e) {
            e.render(t);
          }),
          this.hint.render(t);
      }),
      (e.prototype.update = function () {
        var e = this;
        (this.items[2].text =
          "Sound FX " + (t.Sfx.master.gain.value ? " On" : "Off")),
          this.items.forEach(function (t, i) {
            t.invert = i == e.active && e.tick % 50 > 25;
          }),
          this.tick++;
      }),
      (e.prototype.complete = function () {
        return !1;
      }),
      e
    );
  })();
  t.Menu = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(e, i, n, o, r, s) {
      void 0 === e && (e = []),
        void 0 === i && (i = [32, 32, 64, 0]),
        void 0 === n && (n = "#000"),
        void 0 === o && (o = 200),
        void 0 === r && (r = ["#ccc"]),
        void 0 === s && (s = 0),
        (this.sky = i),
        (this.rocks = n),
        (this.stars = o),
        (this.moons = r),
        (this.txts = [
          new t.Txt(0, 0, "Score"),
          new t.Txt(120, 0, "HP", 2),
          new t.Txt(231, 0, "High"),
        ]),
        (this.platforms = e),
        e.length &&
          e.unshift(
            new t.Platform(-50, 184, 350, s || e[0].color),
            new t.Platform(-50, 8, 350, -1)
          );
    }
    return (
      (e.prototype.render = function (e) {
        if (this.cache) e.drawImage(this.cache, 0, 0);
        else {
          var i = e.canvas;
          (e.fillStyle = "#000"), e.fillRect(0, 0, i.width, i.height);
          for (var n = 0; n < this.stars; n++) {
            var o = t.Rand.get(0.5);
            (e.fillStyle = "rgba(255,255,255," + o + ")"),
              e.fillRect(
                Math.round(t.Rand.get(255)),
                Math.round(t.Rand.get(192)),
                1,
                1
              );
          }
          this.moons.forEach(function (i) {
            var n = t.Rand.get(200, 40),
              o = t.Rand.get(130, 80),
              r = t.Rand.get(40, 10);
            (e.fillStyle = i),
              e.beginPath(),
              e.arc(n, o, r, 0, 2 * Math.PI),
              e.closePath(),
              e.fill();
          });
          var r = e.createLinearGradient(0, 0, 0, i.height);
          r.addColorStop(0, "rgba(" + this.sky.join(",") + ")"),
            r.addColorStop(1, "rgba(" + this.sky.slice(0, 3).join(",") + ",1)"),
            (e.fillStyle = r),
            e.fillRect(0, 0, i.width, i.height);
          var s = 0,
            a = i.width,
            h = i.height,
            c = (h / 3) * 2;
          for (e.beginPath(), e.moveTo(s, c + t.Rand.get(30)); s < a; ) {
            var p = s + t.Rand.get(30, 20),
              f = p + t.Rand.get(30, 20),
              u = c + t.Rand.get(20),
              d = c + t.Rand.get(20);
            e.lineTo(p < a ? p : a, u), e.lineTo(f < a ? f : a, d), (s = f);
          }
          e.lineTo(a, h),
            e.lineTo(0, h),
            e.closePath(),
            (e.fillStyle = this.rocks),
            e.fill(),
            this.txts.forEach(function (t) {
              return t.render(e);
            }),
            this.platforms.forEach(function (t) {
              return t.render(e);
            }),
            (this.cache = new Image()),
            (this.cache.src = e.canvas.toDataURL());
        }
        t.Session.get().render(e);
      }),
      e
    );
  })();
  t.Planet = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(e, i, n, o) {
      void 0 === o && (o = 0);
      var r = Math.round(t.Rand.get(1, -1));
      i || ((e -= 8 * r), (i = 8 * Math.round(t.Rand.get(10, 6)))),
        (this.box = new t.Box(new t.Vec(e, i), n || 8 * (r + 5), 8)),
        (this.color = o);
    }
    return (
      (e.prototype.render = function (t) {
        if (!(this.color < 0)) {
          var i = this.color,
            n = this.box.clone(),
            o = Math.round(n.w / 8) - 1;
          (n.w = 8), e.sprite.render(t, n, i, 0);
          for (var r = 1; r < o; r++)
            (n.pos.x += n.w), e.sprite.render(t, n, i, 1);
          (n.pos.x += n.w), e.sprite.render(t, n, i, 2);
        }
      }),
      e
    );
  })();
  t.Platform = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(t) {
      (this.tick = 1),
        (this.loot = null),
        (this.width = 256),
        (this.bumms = []),
        (this.level = t);
    }
    return (
      (e.prototype.stop = function () {
        this.hero.mute();
      }),
      (e.prototype.complete = function () {
        return this.ship.gone();
      }),
      (e.prototype.ai = function () {
        this.enemies.items.forEach(function (t) {
          t.collided.y && (t.speed.y = -t.speed.y),
            t.collided.x && (t.speed.x = -t.speed.x);
        });
      }),
      (e.prototype.render = function (t) {
        this.planet.render(t),
          this.ship.render(t),
          this.loot && this.loot.render(t),
          this.ship.go() || this.hero.render(t),
          this.enemies.render(t),
          this.bumms.forEach(function (e) {
            e.render(t);
          });
      }),
      (e.prototype.input = function (t, e) {
        var i = this.hero;
        i.inactive() ||
          ((i.shoot = t[0]),
          (i.speed.y = t[38] || t[87] || t[90] ? -1 : 1),
          t[37] || t[65] || t[81]
            ? ((i.speed.x = -1), (i.face = 0))
            : t[39] || t[68]
            ? ((i.speed.x = 1), (i.face = 1))
            : (i.speed.x = 0));
      }),
      (e.prototype.update = function () {
        this.updateHero(),
          this.updateShip(),
          this.updateLoot(),
          this.updateEnemies(),
          this.updateBumms(),
          this.tick++;
      }),
      (e.prototype.updateShip = function () {
        var e = this.ship,
          i = this.hero;
        if (
          (e.update(this.tick),
          e.ready() &&
            e.box.contains(i.box) &&
            (e.status++,
            i.mute(),
            t.Ship.goSfx.play(),
            t.Session.get().add(250),
            this.level % 4 == 3 && t.Session.get().inc()),
          !e.go() && e.land())
        ) {
          var n = e.complete(),
            o = e.parts[n ? 0 : e.status - 1],
            r = n ? e.fuel : e.parts[e.status],
            s = Math.abs(o.box.pos.x - r.box.pos.x);
          if ((this.move(r), s < 1))
            (i.pick = !1),
              (r.box.pos.x = o.box.pos.x),
              r.box.test(o.box) &&
                (n
                  ? (e.fuel = new t.Fuel(e))
                  : (r.box.pos = o.box.pos.clone().sub(0, r.box.h)),
                e.status++,
                t.Ship.buildSfx.play(),
                t.Session.get().add(25));
          else if (!i.inactive() && !e.ready()) {
            var a = i.box.clone(),
              h = r.box.pos,
              c = this.width,
              p = a.test(r.box);
            p || ((a.pos.x -= c), (p = a.test(r.box))),
              p || ((a.pos.x += 2 * c), (p = a.test(r.box))),
              p &&
                (i.pick || (t.Hero.pickSfx.play(), (i.pick = !0)),
                h.add(a.pos.add(0, 8).sub(h).scale(0.2)),
                h.x < 0 ? (h.x += c) : h.x > c && (h.x -= c));
          }
        }
      }),
      (e.prototype.updateHero = function () {
        var t = this.hero,
          e = this.ship;
        if (e.land() && !e.go()) {
          this.move(t);
          var i = t.collided.y && t.speed.y > 0;
          t.walk &&
            !i &&
            this.addBumm(t.box.pos.clone().add(t.face ? -8 : 8, 12), 0, !1),
            (t.walk = i),
            this.hero.update(this.tick);
          for (var n = 0; n < t.lasers.length; ) {
            var o = t.lasers[n];
            this.updateLaser(o), o.end ? t.lasers.splice(n, 1) : n++;
          }
        }
      }),
      (e.prototype.updateLaser = function (e) {
        var i = e.box.pos;
        if (
          ((i.x += e.speed.x),
          i.x > this.width
            ? (i.x -= this.width)
            : i.x < 0 && (i.x += this.width),
          e.update(this.tick),
          !e.end)
        )
          for (var n = 0, o = this.enemies.items; n < o.length; ) {
            var r = o[n];
            this.collide(e, r)
              ? (o.splice(n, 1),
                this.addBumm(r.box.pos.clone()),
                t.Session.get().add(15))
              : n++;
          }
      }),
      (e.prototype.updateLoot = function () {
        if (null !== this.loot) {
          var e = this.loot;
          this.move(e),
            e.update(this.tick),
            !this.ship.go() &&
              this.collide(e, this.hero) &&
              (t.Loot.sfx.play(), t.Session.get().add(125), (this.loot = null));
        } else this.tick % 1e3 == 0 && (this.loot = new t.Loot());
      }),
      (e.prototype.updateEnemies = function () {
        var e = this,
          i = this.hero,
          n = this.enemies;
        n.items.forEach(function (t) {
          e.move(t);
        }),
          this.ai(),
          i.spawning() ||
            this.ship.go() ||
            n.items.forEach(function (n) {
              e.collide(i, n) &&
                (e.addBumm(i.box.pos.clone()),
                e.addBumm(i.box.pos.clone().add(0, 8), 1, !1),
                t.Session.get().dec(),
                i.spawn());
            }),
          n.update(this.tick);
      }),
      (e.prototype.addBumm = function (e, i, n) {
        void 0 === i && (i = 1),
          void 0 === n && (n = !0),
          this.bumms.push(new t.Bumm(e, i, n));
      }),
      (e.prototype.updateBumms = function () {
        for (var t = 0; t < this.bumms.length; ) {
          var e = this.bumms[t];
          e.update(this), e.end ? this.bumms.splice(t, 1) : t++;
        }
      }),
      (e.prototype.collide = function (t, i) {
        var n = e.sprite.ictx,
          o = this.width,
          r = t.box.clone(),
          s = i.box.clone(),
          a = !1;
        if (
          !r.test(s) &&
          (r.pos.x + r.w >= o && ((r.pos.x -= o), (a = !0)),
          s.pos.x + s.w >= o && ((s.pos.x -= o), (a = !0)),
          !a || !r.test(s))
        )
          return !1;
        var h = r.intersect(s),
          c = h.pos.x,
          p = h.pos.y,
          f = h.w + 1,
          u = h.h + 1;
        n.clearRect(c, p, f, u), t.render(n);
        var d = n.getImageData(c, p, f, u);
        n.clearRect(c, p, f, u), i.render(n);
        for (
          var l = n.getImageData(c, p, f, u), m = d.data.length, w = 3;
          w < m;
          w += 20
        )
          if (d.data[w] && l.data[w]) return !0;
        return !1;
      }),
      (e.prototype.move = function (t) {
        var e = this.planet.platforms,
          i = t.collided,
          n = t.speed,
          o = t.box.pos,
          r = o.clone();
        (i.x = 0),
          (i.y = 0),
          n.x &&
            ((o.x += n.x),
            o.x >= this.width
              ? (o.x -= this.width)
              : o.x < 0 && (o.x += this.width),
            e.forEach(function (e) {
              e.box.test(t.box) && ((o.x = r.x), (i.x = 1));
            })),
          n.y &&
            ((o.y += n.y),
            e.forEach(function (e) {
              e.box.test(t.box) && ((o.y = r.y), (i.y = 1));
            }));
      }),
      e
    );
  })();
  t.Scene = e;
  var i = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(96, 160)),
        (n.ship = new t.Ship(
          i,
          new t.Vec(160, 136),
          new t.Vec(128, 80),
          new t.Vec(48, 56)
        )),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 72, 48, 1),
            new t.Platform(120, 96, 32, 1),
            new t.Platform(184, 48, 48, 1),
          ],
          [32, 32, 64, 0],
          "#000",
          200,
          ["#ccc"],
          2
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.5, Math.random() / 2 - 0.25, 0);
        }, i)),
        n
      );
    }
    return (
      __extends(i, e),
      (i.prototype.ai = function () {
        for (var t = 0, e = this.enemies.items; t < e.length; ) {
          var i = e[t];
          i.collided.x || i.collided.y
            ? (this.addBumm(i.box.pos), e.splice(t, 1))
            : t++;
        }
      }),
      i
    );
  })(e);
  t.Scene0 = i;
  var n = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(96, 160)),
        (n.ship = new t.Ship(i, new t.Vec(136, -120))),
        (n.planet = new t.Planet(
          [
            new t.Platform(48, 96, 64, 3),
            new t.Platform(200, 48, 32, 3),
            new t.Platform(184, 112, 56, 3),
          ],
          [128, 64, 0, 0.5],
          "#500",
          0,
          ["#cfc", "#ccf"]
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.5, Math.random() < 0.5 ? -0.5 : 0.5, 7);
        }, i)),
        n
      );
    }
    return __extends(i, e), i;
  })(e);
  t.Scene1 = n;
  var o = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(160, 160)),
        (n.ship = new t.Ship(i, new t.Vec(96, -120))),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 48, 48, 4),
            new t.Platform(120, 64, 32, 4),
            new t.Platform(192, 96, 48, 4),
          ],
          [40, 40, 40, 0],
          "#555",
          200,
          ["#06c"]
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.5, 0, 6);
        }, i)),
        n
      );
    }
    return (
      __extends(i, e),
      (i.prototype.ai = function () {
        e.prototype.ai.call(this),
          this.enemies.items.forEach(function (t) {
            t.tick % 64 == 0 &&
              (t.speed.y = (Math.round(2 * Math.random()) - 1) / 2);
          });
      }),
      i
    );
  })(e);
  t.Scene2 = o;
  var r = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(96, 160)),
        (n.ship = new t.Ship(i, new t.Vec(160, -120))),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 96, 32, 0),
            new t.Platform(96, 48, 48, 0),
            new t.Platform(184, 80, 48, 0),
          ],
          [128, 128, 255, 0.5],
          "#ccc",
          200,
          []
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0, 0, 1);
        }, i)),
        n
      );
    }
    return (
      __extends(i, e),
      (i.prototype.ai = function () {
        for (var t = 0, e = this.hero, i = this.enemies.items; t < i.length; ) {
          var n = i[t];
          n.tick % 80 == 0 &&
            0 == n.speed.x &&
            (n.speed = e.box.pos.clone().sub(n.box.pos).normalize()),
            n.collided.x
              ? (this.addBumm(n.box.pos), i.splice(t, 1))
              : (n.collided.y && (n.speed.y = -n.speed.y), t++);
        }
      }),
      i
    );
  })(e);
  t.Scene3 = r;
  var s = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(160, 160)),
        (n.ship = new t.Ship(
          i,
          new t.Vec(120, 136),
          new t.Vec(212, 80),
          new t.Vec(48, 64)
        )),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 80, 56, 1),
            new t.Platform(152, 56, 32, 1),
            new t.Platform(204, 96, 32, 1),
          ],
          [40, 160, 160, 0.5],
          "#060",
          0,
          ["#fff"]
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.5, -0.5, 4);
        }, i)),
        n
      );
    }
    return (
      __extends(i, e),
      (i.prototype.ai = function () {
        var t = this;
        this.enemies.items.forEach(function (e) {
          var i = t.hero;
          e.tick % 80 != 0 ||
            i.inactive() ||
            (e.speed = i.box.pos.clone().sub(e.box.pos).normalize().scale(0.7));
        });
      }),
      i
    );
  })(e);
  t.Scene4 = s;
  var a = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(160, 160)),
        (n.ship = new t.Ship(i, new t.Vec(96, -120))),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 48, 48, 2),
            new t.Platform(120, 96, 32, 2),
            new t.Platform(192, 72, 48, 2),
          ],
          [240, 160, 40, 0.5],
          "#960",
          0,
          ["#f90"]
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.5, Math.random() < 0.5 ? -0.7 : 0.7, 5);
        }, i)),
        n
      );
    }
    return __extends(i, e), i;
  })(e);
  t.Scene5 = a;
  var h = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(80, 160)),
        (n.ship = new t.Ship(i, new t.Vec(135, -120))),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 56, 32, 5),
            new t.Platform(56, 104, 48, 5),
            new t.Platform(176, 72, 56, 5),
          ],
          [40, 80, 40, 0],
          "#000",
          200,
          ["#666", "#999", "#ccc"]
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.7, Math.random() / 2 - 0.25, 2);
        }, i)),
        n
      );
    }
    return __extends(i, e), i;
  })(i);
  t.Scene6 = h;
  var c = (function (e) {
    function i(i) {
      var n = e.call(this, i) || this;
      return (
        (n.hero = new t.Hero(144, 160)),
        (n.ship = new t.Ship(i, new t.Vec(80, -120))),
        (n.planet = new t.Planet(
          [
            new t.Platform(32, 96, 32, 6),
            new t.Platform(104, 80, 48, 6),
            new t.Platform(192, 48, 48, 6),
          ],
          [40, 200, 200, 0],
          "#000",
          200,
          []
        )),
        (n.enemies = new t.Spawner(function () {
          return new t.Enemy(0.5, -0.5, 3);
        }, i)),
        n
      );
    }
    return __extends(i, e), i;
  })(s);
  t.Scene7 = c;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e() {
      (this.lives = 0),
        (this.score = 0),
        (this.high = JSON.parse(localStorage.getItem(e.store)) || 0),
        (this.livesTxt = new t.Txt(120, 8, "", 1)),
        (this.scoreTxt = new t.Txt(0, 8, "", 1)),
        (this.highTxt = new t.Txt(213, 8, "", 1));
    }
    return (
      (e.get = function () {
        return e.insta || (e.insta = new e()), e.insta;
      }),
      (e.prototype.init = function () {
        (this.lives = 3), (this.score = 0);
      }),
      (e.prototype.clear = function () {
        (this.high = 0), localStorage.setItem(e.store, null);
      }),
      (e.prototype.add = function (t) {
        (this.score += t),
          this.score > this.high &&
            ((this.high = this.score),
            localStorage.setItem(e.store, JSON.stringify(this.high)));
      }),
      (e.prototype.inc = function () {
        this.lives++;
      }),
      (e.prototype.dec = function () {
        this.lives && this.lives--;
      }),
      (e.prototype.render = function (t) {
        (this.scoreTxt.text = ("000000" + this.score).slice(-7)),
          this.scoreTxt.render(t),
          (this.livesTxt.text = ("0" + this.lives).slice(-2)),
          this.livesTxt.render(t),
          (this.highTxt.text = ("000000" + this.high).slice(-7)),
          this.highTxt.render(t);
      }),
      (e.store = "LoST_hi"),
      e
    );
  })();
  t.Session = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function t(e) {
      var i = this;
      t.load++;
      var n = jsfxr(e);
      t.ctx ||
        ((t.ctx = window.AudioContext
          ? new AudioContext()
          : new window.webkitAudioContext()),
        (t.master = t.ctx.createGain()),
        t.master.connect(t.ctx.destination)),
        t.ctx.decodeAudioData(n, function (e) {
          (i.buffer = e), t.loaded++;
        });
    }
    return (
      (t.ready = function () {
        return t.load == t.loaded;
      }),
      (t.prototype.play = function (e, i) {
        void 0 === e && (e = 1), void 0 === i && (i = !1);
        var n = t.ctx.createGain(),
          o = t.ctx.createBufferSource();
        return (
          n.connect(t.master),
          (n.gain.value = e),
          (o.loop = i),
          (o.buffer = this.buffer),
          o.connect(n),
          o.start(t.ctx.currentTime),
          o
        );
      }),
      (t.load = 0),
      (t.loaded = 0),
      t
    );
  })();
  t.Sfx = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
      function e(e, i) {
        (this.collided = new t.Vec(0, 0)),
          (this.speed = new t.Vec(0, 0.5)),
          (this.box = new t.Box(e, 16, 16)),
          (this.top = i);
      }
      return (
        (e.prototype.render = function (t) {}),
        (e.prototype.update = function (t) {}),
        e
      );
    })(),
    i = (function () {
      function e(e) {
        (this.collided = new t.Vec(0, 0)), (this.speed = new t.Vec(0, 0.5));
        var i;
        do {
          i = 16 * Math.round(15 * Math.random());
        } while (i == e.box.pos.x);
        this.box = new t.Box(new t.Vec(i, 16), 16, 12);
      }
      return (
        (e.prototype.render = function (t) {
          e.sprite.render(t, this.box, 1, 0);
        }),
        (e.prototype.update = function (t) {}),
        e
      );
    })();
  t.Fuel = i;
  var n = (function () {
    function n(o, r, s, a) {
      void 0 === s && (s = null),
        void 0 === a && (a = null),
        (this.collided = new t.Vec(0, 0)),
        (this.speed = new t.Vec(0, -1)),
        (this.fuels = 6),
        (this.tick = 0),
        (this.box = new t.Box(r, 16, 48)),
        s ? (this.status = 1) : ((this.status = 3), n.landSfx.play()),
        (this.parts = [
          new e(r.clone().add(0, 32), 2),
          new e(s || r.clone().add(0, 16), 1),
          new e(a || r.clone(), 0),
        ]),
        (this.type = Math.floor(o / 4) % 4),
        (this.fuel = new i(this));
    }
    return (
      (n.prototype.complete = function () {
        return this.status >= this.parts.length;
      }),
      (n.prototype.ready = function () {
        return this.status == this.parts.length + this.fuels;
      }),
      (n.prototype.land = function () {
        return 136 == this.box.pos.y;
      }),
      (n.prototype.go = function () {
        return this.status > this.parts.length + this.fuels;
      }),
      (n.prototype.gone = function () {
        return this.go() && this.box.pos.y <= -120;
      }),
      (n.prototype.render = function (t) {
        var e = this.type;
        if (this.ready() || this.go())
          n.sprite.render(t, this.box, Math.floor((this.tick % 4) / 2), e);
        else if (this.complete()) {
          var i = this.box.clone(),
            o = this.fuels,
            r = o - (this.status - this.parts.length);
          i.h /= o;
          for (var s = 0; s < o; s++) {
            var a = r > s ? s : s + o;
            n.sprite.render(t, i, a, e), (i.pos.y += i.h);
          }
          this.land() && this.fuel.render(t);
        } else
          this.parts.forEach(function (i, o) {
            n.sprite.render(t, i.box, i.top, e);
          });
        (this.land() && !this.go()) ||
          (((i = this.box.clone()).pos.y += i.h),
          (i.h = 16),
          n.jetSprite.render(t, i, 1, this.tick % 3));
      }),
      (n.prototype.update = function (t) {
        t % 8 == 0 && this.tick++,
          this.go()
            ? this.box.pos.add(this.speed)
            : this.land() ||
              (this.box.pos.sub(this.speed),
              this.parts[0].box.pos.sub(this.speed));
      }),
      n
    );
  })();
  t.Ship = n;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      void 0 === e && (e = 0), (this.items = []), (this.index = 0);
      var i = 64 - e,
        n = 4 + Math.floor(e / 8);
      (this.freq = i < 8 ? 8 : i),
        (this.limit = n < 8 ? n : 8),
        (this.factory = t);
    }
    return (
      (t.prototype.update = function (t) {
        if (t % this.freq == 0 && this.items.length < this.limit) {
          var e = this.factory.call(this, this.index++);
          this.items.push(e);
        }
        this.items.forEach(function (e) {
          e.update(t);
        });
      }),
      (t.prototype.render = function (t) {
        this.items.forEach(function (e) {
          e.render(t);
        });
      }),
      t
    );
  })();
  t.Spawner = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function t(e, i, n, o) {
      void 0 === o && (o = null);
      var r = this;
      t.load++,
        (this.img = new Image()),
        (this.img.onload = function () {
          t.loaded++, o && o.call(r);
        }),
        (this.img.src = i),
        (this.ictx = e),
        (this.width = n);
    }
    return (
      (t.ready = function () {
        return t.load == t.loaded;
      }),
      (t.prototype.render = function (t, e, i, n, o) {
        void 0 === o && (o = 0);
        var r = e.pos,
          s = Math.round(r.x),
          a = Math.round(r.y),
          h = e.w,
          c = e.h;
        (i *= c),
          (o += h * n),
          t.drawImage(this.img, o, i, h, c, s, a, h, c),
          s + h >= this.width &&
            t.drawImage(this.img, o, i, h, c, s - this.width, a, h, c);
      }),
      (t.prototype.crop = function (e, i, n, o, r, s, a) {
        void 0 === r && (r = []),
          void 0 === s && (s = !1),
          void 0 === a && (a = !1);
        var h = this.ictx,
          c = h.canvas,
          p = c.width,
          f = c.height,
          u = r.length,
          d = r.map(function (t) {
            for (var e = [0, 0, 0, 0], i = 0; i < t.length; i++) {
              var n = parseInt(t.substr(i, 1), 16);
              e[i] = 16 * n + n;
            }
            return e;
          });
        if (
          ((c.width = n),
          (c.height = o * (u + 1)),
          h.save(),
          h.translate(s ? n : 0, a ? o : 0),
          h.scale(s ? -1 : 1, a ? -1 : 1),
          h.drawImage(this.img, e, i, n, o, 0, 0, n, o),
          h.restore(),
          u > 0)
        ) {
          for (
            var l = h.getImageData(0, 0, c.width, c.height),
              m = l.data.length / (u + 1),
              w = 0;
            w < m;
            w += 4
          )
            if (l.data[w + 3])
              for (var x = 0; x < 4; x++)
                for (var v = 0; v < u; v++) {
                  var y = l.data[w + x];
                  r[v].length > x && (y -= 255 - d[v][x]);
                  var g = (v + 1) * m + w + x;
                  l.data[g] = y > 0 ? y : 0;
                }
          h.putImageData(l, 0, 0);
        }
        var S = new t(h, c.toDataURL(), this.width);
        return (c.width = p), (c.height = f), S;
      }),
      (t.load = 0),
      (t.loaded = 0),
      t
    );
  })();
  t.Sprite = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function e(e, i, n, o, r) {
      void 0 === n && (n = ""),
        void 0 === o && (o = 0),
        void 0 === r && (r = !1),
        (this.box = new t.Box(new t.Vec(e, i), 6, 7)),
        (this.text = n),
        (this.color = o),
        (this.invert = r);
    }
    return (
      (e.prototype.render = function (t) {
        var i = this.box.clone(),
          n = i.pos,
          o = this.text.length;
        this.invert &&
          ((t.fillStyle = "#fff"), t.fillRect(n.x, n.y, i.w * o + 1, i.h + 1));
        for (var r = 0; r < o; r++) {
          var s = this.text.charCodeAt(r),
            a = this.invert ? 6 : 2 * this.color;
          s >= 48 && s <= 57 && e.sprite.render(t, i, a, s - 48),
            s >= 97 && s <= 122 && (s -= 32),
            s >= 65 &&
              s <= 90 &&
              ((s -= 55) >= 18 && ((s -= 18), a++),
              e.sprite.render(t, i, a, s)),
            (i.pos.x += i.w);
        }
      }),
      e
    );
  })();
  t.Txt = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      (this.x = t), (this.y = e);
    }
    return (
      (t.prototype.clone = function () {
        return new t(this.x, this.y);
      }),
      (t.prototype.add = function (e, i) {
        return (
          e instanceof t
            ? ((this.x += e.x), (this.y += e.y))
            : ((this.x += e), (this.y += i)),
          this
        );
      }),
      (t.prototype.sub = function (e, i) {
        return (
          e instanceof t
            ? ((this.x -= e.x), (this.y -= e.y))
            : ((this.x -= e), (this.y -= i)),
          this
        );
      }),
      (t.prototype.scale = function (t) {
        return (this.x *= t), (this.y *= t), this;
      }),
      (t.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }),
      (t.prototype.normalize = function () {
        var t = this.length();
        return t > 0 && this.scale(1 / t), this;
      }),
      t
    );
  })();
  t.Vec = e;
})(Game || (Game = {}));
var Game;
!(function (t) {
  function e(t, e) {
    return (e || document).querySelector(t);
  }
  function i(t, e, i) {
    t.addEventListener(e, i, !1);
  }
  function n() {
    var t = document.body,
      e = t.clientWidth / t.clientHeight < p.width / p.height;
    (p.style.width = e ? "100%" : ""), (p.style.height = e ? "" : "100%");
  }
  function o() {
    i(document, "keydown", function (e) {
      27 != e.keyCode
        ? ((m[e.keyCode] = !0),
          (m[0] = m[32] || e.shiftKey || e.ctrlKey),
          u.input(m, !0))
        : u instanceof t.Scene && s();
    }),
      i(document, "keyup", function (t) {
        (m[t.keyCode] = !1),
          (m[0] = m[32] || t.shiftKey || t.ctrlKey),
          u.input(m, !1);
      }),
      i(window, "resize", n);
  }
  function r() {
    var t = navigator.getGamepads()[0];
    if (t) {
      var e = { 0: !1 };
      t.axes.forEach(function (t, i) {
        i % 2
          ? ((e[40] = e[40] || t > 0.25), (e[38] = e[38] || t < -0.25))
          : ((e[39] = e[39] || t > 0.25), (e[37] = e[37] || t < -0.25));
      }),
        t.buttons.forEach(function (t, i) {
          if (t.pressed)
            switch (i) {
              case 12:
                e[38] = !0;
                break;
              case 13:
                e[40] = !0;
                break;
              case 14:
                e[37] = !0;
                break;
              case 15:
                e[39] = !0;
                break;
              default:
                e[0] = !0;
            }
        });
      for (var i in e)
        ((m[i] && !e[i]) || (!m[i] && e[i])) &&
          ((m[i] = e[i]), u.input(m, e[i]));
    }
  }
  function s(e) {
    void 0 === e && (e = "L  o  S  T"),
      u && u.stop(),
      (u = new t.Menu(e, function () {
        l.init(), (d = parseInt(location.search.substr(1)) || 0), (u = a(d));
      }));
  }
  function a(e) {
    switch (e % 8) {
      case 1:
        return new t.Scene1(e);
      case 2:
        return new t.Scene2(e);
      case 3:
        return new t.Scene3(e);
      case 4:
        return new t.Scene4(e);
      case 5:
        return new t.Scene5(e);
      case 6:
        return new t.Scene6(e);
      case 7:
        return new t.Scene7(e);
    }
    return new t.Scene0(e);
  }
  function h() {
    requestAnimationFrame(function () {
      h();
    }),
      t.Sprite.ready() &&
        t.Sfx.ready() &&
        (u instanceof t.Scene && !l.lives && u.hero.tick > -120
          ? s("Game Over")
          : u.complete() && (u = a(++d)),
        u.update(),
        u.render(f),
        r());
  }
  var c = (function () {
    function t() {}
    return (
      (t.get = function (e, i) {
        return (
          void 0 === e && (e = 1),
          void 0 === i && (i = 0),
          (t.seed = (9301 * t.seed + 49297) % 233280),
          i + (t.seed / 233280) * (e - i)
        );
      }),
      (t.seed = Math.random()),
      t
    );
  })();
  t.Rand = c;
  var p,
    f,
    u,
    d,
    l,
    m = {};
  i(window, "load", function () {
    (p = e("#game")), (f = p.getContext("2d")), (l = t.Session.get());
    var i = e("#test").getContext("2d"),
      r = new t.Sprite(
        i,
        "data:image/gif;base64,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",
        p.width,
        function () {
          (t.Scene.sprite = r),
            (t.Hero.sprite = r.crop(0, 0, 64, 48)),
            (t.Hero.jetSprite = r.crop(64, 0, 48, 48, ["fc0"])),
            (t.Bumm.sprite = r.crop(0, 152, 48, 16, ["fc0"])),
            (t.Platform.sprite = r.crop(0, 80, 24, 8, [
              "0c0",
              "fc0",
              "930",
              "999",
              "0c9",
              "c09",
            ])),
            (t.Laser.sprite1 = r.crop(0, 180, 112, 1, ["f6f", "f66", "6ff"])),
            (t.Laser.sprite2 = r.crop(
              0,
              180,
              112,
              1,
              ["f6f", "f66", "6ff"],
              !0
            )),
            (t.Loot.sprite = r.crop(16, 168, 80, 12, ["f00", "0ff", "ff0"])),
            (t.Fuel.sprite = r.crop(0, 168, 16, 12, ["f0f"])),
            (t.Ship.sprite = r.crop(0, 88, 64, 48, ["f6f"])),
            (t.Ship.jetSprite = r.crop(0, 136, 48, 16, ["fc0"])),
            (t.Txt.sprite = r.crop(0, 181, 108, 14, ["ff0", "0ff", "000"])),
            (t.Hero.jetSfx = new t.Sfx([
              3,
              ,
              1,
              ,
              ,
              0.61,
              ,
              1,
              1,
              ,
              ,
              -1,
              ,
              ,
              -1,
              ,
              -0.76,
              -0.02,
              0.456,
              0,
              0.18,
              ,
              -1,
              0.5,
            ])),
            (t.Hero.pickSfx = new t.Sfx([
              0,
              ,
              0.09,
              0.37,
              0.18,
              0.47,
              ,
              ,
              ,
              ,
              ,
              0.42,
              0.67,
              ,
              ,
              ,
              ,
              ,
              1,
              ,
              ,
              ,
              ,
              0.5,
            ])),
            (t.Bumm.sfx = new t.Sfx([
              3,
              ,
              0.38,
              0.47,
              0.29,
              0.09,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              0.55,
              0.34,
              -0.13,
              1,
              ,
              ,
              ,
              ,
              0.5,
            ])),
            (t.Laser.sfx = new t.Sfx([
              0,
              ,
              0.12,
              ,
              0.16,
              0.3,
              0.2,
              -0.17,
              ,
              ,
              ,
              ,
              ,
              0.55,
              -0.45,
              ,
              ,
              ,
              1,
              ,
              ,
              ,
              ,
              0.5,
            ])),
            (t.Loot.sfx = new t.Sfx([
              0,
              ,
              0.11,
              ,
              0.19,
              0.23,
              ,
              0.46,
              ,
              ,
              ,
              ,
              ,
              0.44,
              ,
              0.53,
              ,
              ,
              1,
              ,
              ,
              ,
              ,
              0.5,
            ])),
            (t.Ship.goSfx = new t.Sfx([
              3,
              ,
              1,
              ,
              1,
              0.14,
              ,
              0.08,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              1,
              ,
              ,
              ,
              ,
              0.5,
            ])),
            (t.Ship.landSfx = new t.Sfx([
              3,
              ,
              1,
              ,
              1,
              0.2,
              ,
              0.08,
              -0.05,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              1,
              ,
              ,
              ,
              ,
              0.5,
            ])),
            (t.Ship.buildSfx = t.Menu.sfx =
              new t.Sfx([
                0,
                ,
                0.07,
                0.55,
                0.1,
                0.54,
                ,
                ,
                ,
                ,
                ,
                0.35,
                0.69,
                ,
                ,
                ,
                ,
                ,
                1,
                ,
                ,
                ,
                ,
                0.5,
              ]));
          for (e = 48; e <= 64; e += 16)
            t.Enemy.sprites.push(
              r.crop(0, e, 48, 16, ["f66", "f6f", "66f", "6ff"]),
              r.crop(0, e, 48, 16, ["f66", "f6f", "66f", "6ff"], !0)
            );
          for (var e = 48; e <= 128; e += 16)
            t.Enemy.sprites.push(
              r.crop(64, e, 48, 16, ["f66", "f6f", "66f", "6ff"]),
              null
            );
          n(), s(), o(), h();
        }
      );
  });
})(Game || (Game = {}));
