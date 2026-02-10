var pd = Object.defineProperty;
var Ei = (e) => {
  throw TypeError(e);
};
var yd = (e, t, r) => t in e ? pd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var fr = (e, t, r) => yd(e, typeof t != "symbol" ? t + "" : t, r), Os = (e, t, r) => t.has(e) || Ei("Cannot " + r);
var J = (e, t, r) => (Os(e, t, "read from private field"), r ? r.call(e) : t.get(e)), We = (e, t, r) => t.has(e) ? Ei("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ce = (e, t, r, n) => (Os(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), dt = (e, t, r) => (Os(e, t, "access private method"), r);
import xc, { ipcMain as is, shell as $d, app as ln, BrowserWindow as el, Menu as bi, dialog as tl } from "electron";
import { fileURLToPath as gd } from "url";
import { dirname as _d, join as Si, resolve as vd } from "path";
import { readFile as wa } from "fs/promises";
import fe from "node:process";
import ae from "node:path";
import { promisify as Se, isDeepStrictEqual as Pi } from "node:util";
import Y from "node:fs";
import Kr from "node:crypto";
import Ni from "node:assert";
import rl from "node:os";
import "node:events";
import "node:stream";
const cr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, nl = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), sl = 1e6, wd = (e) => e >= "0" && e <= "9";
function al(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= sl;
  }
  return !1;
}
function Is(e, t) {
  return nl.has(e) ? !1 : (e && al(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function Ed(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, a = 0;
  for (const o of e) {
    if (a++, s) {
      r += o, s = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${a}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${a}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Is(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Is(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const l = Number.parseInt(r, 10);
            !Number.isNaN(l) && Number.isFinite(l) && l >= 0 && l <= Number.MAX_SAFE_INTEGER && l <= sl && r === String(l) ? t.push(l) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !wd(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Is(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function cs(e) {
  if (typeof e == "string")
    return Ed(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (nl.has(n))
        return [];
      typeof n == "string" && al(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Ri(e, t, r) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = cs(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function _n(e, t, r) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = cs(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!cr(e[o])) {
      const c = typeof s[a + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function bd(e, t) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = cs(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !cr(e))
      return !1;
  }
}
function Ts(e, t) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = cs(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!cr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const It = rl.homedir(), Ea = rl.tmpdir(), { env: vr } = fe, Sd = (e) => {
  const t = ae.join(It, "Library");
  return {
    data: ae.join(t, "Application Support", e),
    config: ae.join(t, "Preferences", e),
    cache: ae.join(t, "Caches", e),
    log: ae.join(t, "Logs", e),
    temp: ae.join(Ea, e)
  };
}, Pd = (e) => {
  const t = vr.APPDATA || ae.join(It, "AppData", "Roaming"), r = vr.LOCALAPPDATA || ae.join(It, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ae.join(r, e, "Data"),
    config: ae.join(t, e, "Config"),
    cache: ae.join(r, e, "Cache"),
    log: ae.join(r, e, "Log"),
    temp: ae.join(Ea, e)
  };
}, Nd = (e) => {
  const t = ae.basename(It);
  return {
    data: ae.join(vr.XDG_DATA_HOME || ae.join(It, ".local", "share"), e),
    config: ae.join(vr.XDG_CONFIG_HOME || ae.join(It, ".config"), e),
    cache: ae.join(vr.XDG_CACHE_HOME || ae.join(It, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ae.join(vr.XDG_STATE_HOME || ae.join(It, ".local", "state"), e),
    temp: ae.join(Ea, t, e)
  };
};
function Rd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), fe.platform === "darwin" ? Sd(e) : fe.platform === "win32" ? Pd(e) : Nd(e);
}
const vt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, ft = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, Od = 250, wt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? Od, l = Date.now() + a;
    return function c(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= l)
          throw u;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise((g) => setTimeout(g, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, Et = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (d) {
          if (!r(d) || Date.now() >= o)
            throw d;
          continue;
        }
    };
  };
}, wr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!wr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Id && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!wr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!wr.isNodeError(e))
      throw e;
    if (!wr.isChangeErrorOk(e))
      throw e;
  }
}, vn = {
  onError: wr.onChangeError
}, ze = {
  onError: () => {
  }
}, Id = fe.getuid ? !fe.getuid() : !1, Pe = {
  isRetriable: wr.isRetriableError
}, Oe = {
  attempt: {
    /* ASYNC */
    chmod: vt(Se(Y.chmod), vn),
    chown: vt(Se(Y.chown), vn),
    close: vt(Se(Y.close), ze),
    fsync: vt(Se(Y.fsync), ze),
    mkdir: vt(Se(Y.mkdir), ze),
    realpath: vt(Se(Y.realpath), ze),
    stat: vt(Se(Y.stat), ze),
    unlink: vt(Se(Y.unlink), ze),
    /* SYNC */
    chmodSync: ft(Y.chmodSync, vn),
    chownSync: ft(Y.chownSync, vn),
    closeSync: ft(Y.closeSync, ze),
    existsSync: ft(Y.existsSync, ze),
    fsyncSync: ft(Y.fsync, ze),
    mkdirSync: ft(Y.mkdirSync, ze),
    realpathSync: ft(Y.realpathSync, ze),
    statSync: ft(Y.statSync, ze),
    unlinkSync: ft(Y.unlinkSync, ze)
  },
  retry: {
    /* ASYNC */
    close: wt(Se(Y.close), Pe),
    fsync: wt(Se(Y.fsync), Pe),
    open: wt(Se(Y.open), Pe),
    readFile: wt(Se(Y.readFile), Pe),
    rename: wt(Se(Y.rename), Pe),
    stat: wt(Se(Y.stat), Pe),
    write: wt(Se(Y.write), Pe),
    writeFile: wt(Se(Y.writeFile), Pe),
    /* SYNC */
    closeSync: Et(Y.closeSync, Pe),
    fsyncSync: Et(Y.fsyncSync, Pe),
    openSync: Et(Y.openSync, Pe),
    readFileSync: Et(Y.readFileSync, Pe),
    renameSync: Et(Y.renameSync, Pe),
    statSync: Et(Y.statSync, Pe),
    writeSync: Et(Y.writeSync, Pe),
    writeFileSync: Et(Y.writeFileSync, Pe)
  }
}, Td = "utf8", Oi = 438, jd = 511, kd = {}, Ad = fe.geteuid ? fe.geteuid() : -1, Cd = fe.getegid ? fe.getegid() : -1, Dd = 1e3, Md = !!fe.getuid;
fe.getuid && fe.getuid();
const Ii = 128, Ld = (e) => e instanceof Error && "code" in e, Ti = (e) => typeof e == "string", js = (e) => e === void 0, Vd = fe.platform === "linux", ol = fe.platform === "win32", ba = ["SIGHUP", "SIGINT", "SIGTERM"];
ol || ba.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Vd && ba.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Fd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (ol && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? fe.kill(fe.pid, "SIGTERM") : fe.kill(fe.pid, t));
      }
    }, this.hook = () => {
      fe.once("exit", () => this.exit());
      for (const t of ba)
        try {
          fe.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const zd = new Fd(), Ud = zd.register, Ie = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Ie.truncate(t(e));
    return n in Ie.store ? Ie.get(e, t, r) : (Ie.store[n] = r, [n, () => delete Ie.store[n]]);
  },
  purge: (e) => {
    Ie.store[e] && (delete Ie.store[e], Oe.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Ie.store[e] && (delete Ie.store[e], Oe.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Ie.store)
      Ie.purgeSync(e);
  },
  truncate: (e) => {
    const t = ae.basename(e);
    if (t.length <= Ii)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Ii;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Ud(Ie.purgeSyncAll);
function il(e, t, r = kd) {
  if (Ti(r))
    return il(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? Dd };
  let a = null, o = null, l = null;
  try {
    const c = Oe.attempt.realpathSync(e), d = !!c;
    e = c || e, [o, a] = Ie.get(e, r.tmpCreate || Ie.create, r.tmpPurge !== !1);
    const u = Md && js(r.chown), h = js(r.mode);
    if (d && (u || h)) {
      const E = Oe.attempt.statSync(e);
      E && (r = { ...r }, u && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = ae.dirname(e);
      Oe.attempt.mkdirSync(E, {
        mode: jd,
        recursive: !0
      });
    }
    l = Oe.retry.openSync(s)(o, "w", r.mode || Oi), r.tmpCreated && r.tmpCreated(o), Ti(t) ? Oe.retry.writeSync(s)(l, t, 0, r.encoding || Td) : js(t) || Oe.retry.writeSync(s)(l, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Oe.retry.fsyncSync(s)(l) : Oe.attempt.fsync(l)), Oe.retry.closeSync(s)(l), l = null, r.chown && (r.chown.uid !== Ad || r.chown.gid !== Cd) && Oe.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Oi && Oe.attempt.chmodSync(o, r.mode);
    try {
      Oe.retry.renameSync(s)(o, e);
    } catch (E) {
      if (!Ld(E) || E.code !== "ENAMETOOLONG")
        throw E;
      Oe.retry.renameSync(s)(o, Ie.truncate(e));
    }
    a(), o = null;
  } finally {
    l && Oe.attempt.closeSync(l), o && Ie.purge(o);
  }
}
function cl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ea = { exports: {} }, ll = {}, xe = {}, Or = {}, fn = {}, Z = {}, un = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(un);
var ta = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = un;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: g } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const $ = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(ta);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = un, r = ta;
  var n = un;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = ta;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return se(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, b, I) {
      super(i, b, I), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let I = b.length;
      for (; I--; ) {
        const j = b[I];
        j.optimizeNames(i, f) || (k(i, j.names), b.splice(I, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class $ extends w {
  }
  $.kind = "else";
  class m extends w {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new $(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(L(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return se(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, b, I) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: I, to: j } = this;
      return `for(${f} ${b}=${I}; ${b}<${j}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = se(super.names, this.from);
      return se(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, b, I) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class X extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  X.kind = "return";
  class de extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, I;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class he extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  he.kind = "catch";
  class ye extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ye.kind = "finally";
  class z {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, b, I) {
      const j = this._scope.toName(f);
      return b !== void 0 && I && (this._constants[j.str] = b), this._leafNode(new o(i, j, b)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new l(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, I] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, b), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (V) => {
          this.var(j, (0, t._)`${F}[${V}]`), b(j);
        });
      }
      return this._for(new O("of", I, j, f), () => b(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => b(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new X();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(X);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new de();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new he(j), f(j);
      }
      return b && (this._currNode = I.finally = new ye(), this.code(b)), this._endBlockNode(he, ye);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, I) {
      return this._blockNode(new K(i, f, b)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = z;
  function H(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function se(y, i) {
    return i instanceof t._CodeOrName ? H(y, i.names) : y;
  }
  function T(y, i, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!I(y))
      return y;
    return new t._Code(y._items.reduce((j, F) => (F instanceof t.Name && (F = b(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function b(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function L(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = L;
  const D = p(e.operators.AND);
  function G(...y) {
    return y.reduce(D);
  }
  e.and = G;
  const M = p(e.operators.OR);
  function P(...y) {
    return y.reduce(M);
  }
  e.or = P;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(Z);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const ie = Z, qd = un;
function Kd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = Kd;
function Gd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (ul(e, t), !dl(t, e.self.RULES.all));
}
A.alwaysValidSchema = Gd;
function ul(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || ml(e, `unknown keyword: "${a}"`);
}
A.checkUnknownRules = ul;
function dl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = dl;
function Hd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = Hd;
function Wd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
A.schemaRefOrVal = Wd;
function Bd(e) {
  return fl(decodeURIComponent(e));
}
A.unescapeFragment = Bd;
function Xd(e) {
  return encodeURIComponent(Sa(e));
}
A.escapeFragment = Xd;
function Sa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = Sa;
function fl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = fl;
function Jd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = Jd;
function ji({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof ie.Name ? (a instanceof ie.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ie.Name ? (t(s, o, a), a) : r(a, o);
    return l === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
A.mergeEvaluated = {
  props: ji({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), Pa(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: hl
  }),
  items: ji({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function hl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && Pa(e, r, t), r;
}
A.evaluatedPropsToName = hl;
function Pa(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
A.setEvaluated = Pa;
const ki = {};
function Yd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: ki[t.code] || (ki[t.code] = new qd._Code(t.code))
  });
}
A.useFunc = Yd;
var ra;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ra || (A.Type = ra = {}));
function Zd(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === ra.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + Sa(e);
}
A.getErrorPath = Zd;
function ml(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = ml;
var Ue = {};
Object.defineProperty(Ue, "__esModule", { value: !0 });
const Ne = Z, Qd = {
  // validation function arguments
  data: new Ne.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ne.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ne.Name("instancePath"),
  parentData: new Ne.Name("parentData"),
  parentDataProperty: new Ne.Name("parentDataProperty"),
  rootData: new Ne.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ne.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ne.Name("vErrors"),
  // null or array of validation errors
  errors: new Ne.Name("errors"),
  // counter of validation errors
  this: new Ne.Name("this"),
  // "globals"
  self: new Ne.Name("self"),
  scope: new Ne.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ne.Name("json"),
  jsonPos: new Ne.Name("jsonPos"),
  jsonLen: new Ne.Name("jsonLen"),
  jsonPart: new Ne.Name("jsonPart")
};
Ue.default = Qd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Z, r = A, n = Ue;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, v, N) {
    const { it: R } = $, { gen: O, compositeRule: K, allErrors: X } = R, de = h($, m, v);
    N ?? (K || X) ? c(O, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function a($, m = e.keywordError, v) {
    const { it: N } = $, { gen: R, compositeRule: O, allErrors: K } = N, X = h($, m, v);
    c(R, X), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: $, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = $.name("err");
    $.forRange("i", R, n.default.errors, (X) => {
      $.const(K, (0, t._)`${n.default.vErrors}[${X}]`), $.if((0, t._)`${K}.instancePath === undefined`, () => $.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), $.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && ($.assign((0, t._)`${K}.schema`, v), $.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c($, m) {
    const v = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: v, validateName: N, schemaEnv: R } = $;
    R.$async ? v.throw((0, t._)`new ${$.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, v) {
    const { createErrors: N } = $.it;
    return N === !1 ? (0, t._)`{}` : E($, m, v);
  }
  function E($, m, v = {}) {
    const { gen: N, it: R } = $, O = [
      g(R, v),
      w($, v)
    ];
    return _($, m, O), N.object(...O);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const v = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${$}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _($, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: X } = $, { opts: de, propertyName: he, topSchemaRef: ye, schemaPath: z } = X;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), de.messages && N.push([u.message, typeof v == "function" ? v($) : v]), de.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${z}`], [n.default.data, O]), he && N.push([u.propertyName, he]);
  }
})(fn);
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.boolOrEmptySchema = Or.topBoolOrEmptySchema = void 0;
const xd = fn, ef = Z, tf = Ue, rf = {
  message: "boolean schema is false"
};
function nf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? pl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(tf.default.data) : (t.assign((0, ef._)`${n}.errors`, null), t.return(!0));
}
Or.topBoolOrEmptySchema = nf;
function sf(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), pl(e)) : r.var(t, !0);
}
Or.boolOrEmptySchema = sf;
function pl(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, xd.reportError)(s, rf, void 0, t);
}
var $e = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.getRules = lr.isJSONType = void 0;
const af = ["string", "number", "integer", "boolean", "null", "object", "array"], of = new Set(af);
function cf(e) {
  return typeof e == "string" && of.has(e);
}
lr.isJSONType = cf;
function lf() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
lr.getRules = lf;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.shouldUseRule = mt.shouldUseGroup = mt.schemaHasRulesForType = void 0;
function uf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && yl(e, n);
}
mt.schemaHasRulesForType = uf;
function yl(e, t) {
  return t.rules.some((r) => $l(e, r));
}
mt.shouldUseGroup = yl;
function $l(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
mt.shouldUseRule = $l;
Object.defineProperty($e, "__esModule", { value: !0 });
$e.reportTypeError = $e.checkDataTypes = $e.checkDataType = $e.coerceAndCheckDataType = $e.getJSONTypes = $e.getSchemaTypes = $e.DataType = void 0;
const df = lr, ff = mt, hf = fn, Q = Z, gl = A;
var br;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(br || ($e.DataType = br = {}));
function mf(e) {
  const t = _l(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
$e.getSchemaTypes = mf;
function _l(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(df.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
$e.getJSONTypes = _l;
function pf(e, t) {
  const { gen: r, data: n, opts: s } = e, a = yf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, ff.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = Na(t, n, s.strictNumbers, br.Wrong);
    r.if(l, () => {
      a.length ? $f(e, t, a) : Ra(e);
    });
  }
  return o;
}
$e.coerceAndCheckDataType = pf;
const vl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function yf(e, t) {
  return t ? e.filter((r) => vl.has(r) || t === "array" && r === "array") : [];
}
function $f(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Q._)`typeof ${s}`), l = n.let("coerced", (0, Q._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Q._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Q._)`${s}[0]`).assign(o, (0, Q._)`typeof ${s}`).if(Na(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, Q._)`${l} !== undefined`);
  for (const d of r)
    (vl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Ra(e), n.endIf(), n.if((0, Q._)`${l} !== undefined`, () => {
    n.assign(s, l), gf(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Q._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, Q._)`"" + ${s}`).elseIf((0, Q._)`${s} === null`).assign(l, (0, Q._)`""`);
        return;
      case "number":
        n.elseIf((0, Q._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Q._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Q._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Q._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Q._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Q._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Q._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Q._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, Q._)`[${s}]`);
    }
  }
}
function gf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Q._)`${t} !== undefined`, () => e.assign((0, Q._)`${t}[${r}]`, n));
}
function na(e, t, r, n = br.Correct) {
  const s = n === br.Correct ? Q.operators.EQ : Q.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Q._)`${t} ${s} null`;
    case "array":
      a = (0, Q._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Q._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Q._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Q._)`typeof ${t} ${s} ${e}`;
  }
  return n === br.Correct ? a : (0, Q.not)(a);
  function o(l = Q.nil) {
    return (0, Q.and)((0, Q._)`typeof ${t} == "number"`, l, r ? (0, Q._)`isFinite(${t})` : Q.nil);
  }
}
$e.checkDataType = na;
function Na(e, t, r, n) {
  if (e.length === 1)
    return na(e[0], t, r, n);
  let s;
  const a = (0, gl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Q._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Q._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Q.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Q.and)(s, na(o, t, r, n));
  return s;
}
$e.checkDataTypes = Na;
const _f = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Q._)`{type: ${e}}` : (0, Q._)`{type: ${t}}`
};
function Ra(e) {
  const t = vf(e);
  (0, hf.reportError)(t, _f);
}
$e.reportTypeError = Ra;
function vf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, gl.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
ls.assignDefaults = void 0;
const hr = Z, wf = A;
function Ef(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ai(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Ai(e, a, s.default));
}
ls.assignDefaults = Ef;
function Ai(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, hr._)`${a}${(0, hr.getProperty)(t)}`;
  if (s) {
    (0, wf.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, hr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, hr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, hr._)`${l} = ${(0, hr.stringify)(r)}`);
}
var it = {}, te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
const le = Z, Oa = A, bt = Ue, bf = A;
function Sf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ta(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
te.checkReportMissingProp = Sf;
function Pf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((a) => (0, le.and)(Ta(e, t, a, r.ownProperties), (0, le._)`${s} = ${a}`)));
}
te.checkMissingProp = Pf;
function Nf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
te.reportMissingProp = Nf;
function wl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
te.hasPropFunc = wl;
function Ia(e, t, r) {
  return (0, le._)`${wl(e)}.call(${t}, ${r})`;
}
te.isOwnProperty = Ia;
function Rf(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${Ia(e, t, r)}` : s;
}
te.propertyInData = Rf;
function Ta(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(Ia(e, t, r))) : s;
}
te.noPropertyInData = Ta;
function El(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
te.allSchemaProperties = El;
function Of(e, t) {
  return El(t).filter((r) => !(0, Oa.alwaysValidSchema)(e, t[r]));
}
te.schemaProperties = Of;
function If({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [bt.default.instancePath, (0, le.strConcat)(bt.default.instancePath, a)],
    [bt.default.parentData, o.parentData],
    [bt.default.parentDataProperty, o.parentDataProperty],
    [bt.default.rootData, bt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([bt.default.dynamicAnchors, bt.default.dynamicAnchors]);
  const E = (0, le._)`${u}, ${r.object(...h)}`;
  return c !== le.nil ? (0, le._)`${l}.call(${c}, ${E})` : (0, le._)`${l}(${E})`;
}
te.callValidateCode = If;
const Tf = (0, le._)`new RegExp`;
function jf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, le._)`${s.code === "new RegExp" ? Tf : (0, bf.useFunc)(e, s)}(${r}, ${n})`
  });
}
te.usePattern = jf;
function kf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Oa.Type.Num
      }, a), t.if((0, le.not)(a), l);
    });
  }
}
te.validateArray = kf;
function Af(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Oa.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, le._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, le.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
te.validateUnion = Af;
Object.defineProperty(it, "__esModule", { value: !0 });
it.validateKeywordUsage = it.validSchemaType = it.funcKeywordCode = it.macroKeywordCode = void 0;
const Te = Z, Qt = Ue, Cf = te, Df = fn;
function Mf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = bl(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Te.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
it.macroKeywordCode = Mf;
function Lf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  Ff(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = bl(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && Ci(e), $(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Ci(e), $(() => Vf(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Te._)`await `), (v) => n.assign(h, !1).if((0, Te._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Te._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Te._)`${u}.errors`;
    return n.assign(m, null), _(Te.nil), m;
  }
  function _(m = t.async ? (0, Te._)`await ` : Te.nil) {
    const v = c.opts.passContext ? Qt.default.this : Qt.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, Cf.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function $(m) {
    var v;
    n.if((0, Te.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
it.funcKeywordCode = Lf;
function Ci(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Vf(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(Qt.default.vErrors, (0, Te._)`${Qt.default.vErrors} === null ? ${t} : ${Qt.default.vErrors}.concat(${t})`).assign(Qt.default.errors, (0, Te._)`${Qt.default.vErrors}.length`), (0, Df.extendErrors)(e);
  }, () => e.error());
}
function Ff({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function bl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function zf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
it.validSchemaType = zf;
function Uf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
it.validateKeywordUsage = Uf;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.extendSubschemaMode = Ct.extendSubschemaData = Ct.getSubschema = void 0;
const at = Z, Sl = A;
function qf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, at._)`${e.schemaPath}${(0, at.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, at._)`${e.schemaPath}${(0, at.getProperty)(t)}${(0, at.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Sl.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Ct.getSubschema = qf;
function Kf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, at._)`${t.data}${(0, at.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, at.str)`${d}${(0, Sl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, at._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof at.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ct.extendSubschemaData = Kf;
function Gf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ct.extendSubschemaMode = Gf;
var Ee = {}, us = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Pl = { exports: {} }, kt = Pl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  zn(t, n, s, e, "", e);
};
kt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
kt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
kt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
kt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function zn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in kt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            zn(e, t, r, h[E], s + "/" + u + "/" + E, a, s, u, n, E);
      } else if (u in kt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            zn(e, t, r, h[g], s + "/" + u + "/" + Hf(g), a, s, u, n, g);
      } else (u in kt.keywords || e.allKeys && !(u in kt.skipKeywords)) && zn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function Hf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Wf = Pl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const Bf = A, Xf = us, Jf = Wf, Yf = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Zf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !sa(e) : t ? Nl(e) <= t : !1;
}
Ee.inlineRef = Zf;
const Qf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function sa(e) {
  for (const t in e) {
    if (Qf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(sa) || typeof r == "object" && sa(r))
      return !0;
  }
  return !1;
}
function Nl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Yf.has(r) && (typeof e[r] == "object" && (0, Bf.eachItem)(e[r], (n) => t += Nl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Rl(e, t = "", r) {
  r !== !1 && (t = Sr(t));
  const n = e.parse(t);
  return Ol(e, n);
}
Ee.getFullPath = Rl;
function Ol(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = Ol;
const xf = /#\/?$/;
function Sr(e) {
  return e ? e.replace(xf, "") : "";
}
Ee.normalizeId = Sr;
function eh(e, t, r) {
  return r = Sr(r), e.resolve(t, r);
}
Ee.resolveUrl = eh;
const th = /^[a-z_][-a-z0-9._]*$/i;
function rh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Sr(e[r] || t), a = { "": s }, o = Rl(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Jf(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let $ = a[w];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = $;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Sr($ ? R($, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Sr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!th.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !Xf(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = rh;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.getData = xe.KeywordCxt = xe.validateFunctionCode = void 0;
const Il = Or, Di = $e, ja = mt, Yn = $e, nh = ls, Qr = it, ks = Ct, U = Z, W = Ue, sh = Ee, pt = A, Gr = fn;
function ah(e) {
  if (kl(e) && (Al(e), jl(e))) {
    ch(e);
    return;
  }
  Tl(e, () => (0, Il.topBoolOrEmptySchema)(e));
}
xe.validateFunctionCode = ah;
function Tl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, U._)`${W.default.data}, ${W.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${Mi(r, s)}`), ih(e, s), e.code(a);
  }) : e.func(t, (0, U._)`${W.default.data}, ${oh(s)}`, n.$async, () => e.code(Mi(r, s)).code(a));
}
function oh(e) {
  return (0, U._)`{${W.default.instancePath}="", ${W.default.parentData}, ${W.default.parentDataProperty}, ${W.default.rootData}=${W.default.data}${e.dynamicRef ? (0, U._)`, ${W.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function ih(e, t) {
  e.if(W.default.valCxt, () => {
    e.var(W.default.instancePath, (0, U._)`${W.default.valCxt}.${W.default.instancePath}`), e.var(W.default.parentData, (0, U._)`${W.default.valCxt}.${W.default.parentData}`), e.var(W.default.parentDataProperty, (0, U._)`${W.default.valCxt}.${W.default.parentDataProperty}`), e.var(W.default.rootData, (0, U._)`${W.default.valCxt}.${W.default.rootData}`), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, U._)`${W.default.valCxt}.${W.default.dynamicAnchors}`);
  }, () => {
    e.var(W.default.instancePath, (0, U._)`""`), e.var(W.default.parentData, (0, U._)`undefined`), e.var(W.default.parentDataProperty, (0, U._)`undefined`), e.var(W.default.rootData, W.default.data), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function ch(e) {
  const { schema: t, opts: r, gen: n } = e;
  Tl(e, () => {
    r.$comment && t.$comment && Dl(e), hh(e), n.let(W.default.vErrors, null), n.let(W.default.errors, 0), r.unevaluated && lh(e), Cl(e), yh(e);
  });
}
function lh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function Mi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function uh(e, t) {
  if (kl(e) && (Al(e), jl(e))) {
    dh(e, t);
    return;
  }
  (0, Il.boolOrEmptySchema)(e, t);
}
function jl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function kl(e) {
  return typeof e.schema != "boolean";
}
function dh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Dl(e), mh(e), ph(e);
  const a = n.const("_errs", W.default.errors);
  Cl(e, a), n.var(t, (0, U._)`${a} === ${W.default.errors}`);
}
function Al(e) {
  (0, pt.checkUnknownRules)(e), fh(e);
}
function Cl(e, t) {
  if (e.opts.jtd)
    return Li(e, [], !1, t);
  const r = (0, Di.getSchemaTypes)(e.schema), n = (0, Di.coerceAndCheckDataType)(e, r);
  Li(e, r, !n, t);
}
function fh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, pt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function hh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, pt.checkStrictMode)(e, "default is ignored in the schema root");
}
function mh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, sh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function ph(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Dl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, U._)`${W.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, U.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, U._)`${W.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function yh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, U._)`${W.default.errors} === 0`, () => t.return(W.default.data), () => t.throw((0, U._)`new ${s}(${W.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, W.default.vErrors), a.unevaluated && $h(e), t.return((0, U._)`${W.default.errors} === 0`));
}
function $h({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function Li(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, pt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Vl(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || gh(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, ja.shouldUseGroup)(a, E) && (E.type ? (s.if((0, Yn.checkDataType)(E.type, o, c.strictNumbers)), Vi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Yn.reportTypeError)(e)), s.endIf()) : Vi(e, E), l || s.if((0, U._)`${W.default.errors} === ${n || 0}`));
  }
}
function Vi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, nh.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, ja.shouldUseRule)(n, a) && Vl(e, a.keyword, a.definition, t.type);
  });
}
function gh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (_h(e, t), e.opts.allowUnionTypes || vh(e, t), wh(e, e.dataTypes));
}
function _h(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Ml(e.dataTypes, r) || ka(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), bh(e, t);
  }
}
function vh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ka(e, "use allowUnionTypes to allow union type keyword");
}
function wh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ja.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Eh(t, o)) && ka(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Eh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Ml(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function bh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Ml(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ka(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, pt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Ll = class {
  constructor(t, r, n) {
    if ((0, Qr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, pt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Fl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Qr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", W.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, U.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, U.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, U._)`${r} !== undefined && (${(0, U.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Gr.reportExtraError : Gr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Gr.reportError)(this, this.def.$dataError || Gr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Gr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = U.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = U.nil, r = U.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, U.or)((0, U._)`${s} === undefined`, r)), t !== U.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== U.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, U.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof U.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, U._)`${(0, Yn.checkDataTypes)(c, r, a.opts.strictNumbers, Yn.DataType.Wrong)}`;
      }
      return U.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, U._)`!${c}(${r})`;
      }
      return U.nil;
    }
  }
  subschema(t, r) {
    const n = (0, ks.getSubschema)(this.it, t);
    (0, ks.extendSubschemaData)(n, this.it, t), (0, ks.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return uh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = pt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = pt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, U.Name)), !0;
  }
};
xe.KeywordCxt = Ll;
function Vl(e, t, r, n) {
  const s = new Ll(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Qr.funcKeywordCode)(s, r) : "macro" in r ? (0, Qr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Qr.funcKeywordCode)(s, r);
}
const Sh = /^\/(?:[^~]|~0|~1)*$/, Ph = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Fl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return W.default.rootData;
  if (e[0] === "/") {
    if (!Sh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = W.default.rootData;
  } else {
    const d = Ph.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, U._)`${a}${(0, U.getProperty)((0, pt.unescapeJsonPointer)(d))}`, o = (0, U._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
xe.getData = Fl;
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
let Nh = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
hn.default = Nh;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
const As = Ee;
let Rh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, As.resolveUrl)(t, r, n), this.missingSchema = (0, As.normalizeId)((0, As.getFullPath)(t, this.missingRef));
  }
};
kr.default = Rh;
var ke = {};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.resolveSchema = ke.getCompilingSchema = ke.resolveRef = ke.compileSchema = ke.SchemaEnv = void 0;
const Be = Z, Oh = hn, Yt = Ue, Ze = Ee, Fi = A, Ih = xe;
let ds = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ze.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
ke.SchemaEnv = ds;
function Aa(e) {
  const t = zl.call(this, e);
  if (t)
    return t;
  const r = (0, Ze.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Be.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: Oh.default,
    code: (0, Be._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Yt.default.data,
    parentData: Yt.default.parentData,
    parentDataProperty: Yt.default.parentDataProperty,
    dataNames: [Yt.default.data],
    dataPathArr: [Be.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Be.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Be.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Be._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Ih.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Yt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Yt.default.self}`, `${Yt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Be.Name ? void 0 : w,
        items: _ instanceof Be.Name ? void 0 : _,
        dynamicProps: w instanceof Be.Name,
        dynamicItems: _ instanceof Be.Name
      }, g.source && (g.source.evaluated = (0, Be.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
ke.compileSchema = Aa;
function Th(e, t, r) {
  var n;
  r = (0, Ze.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Ah.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new ds({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = jh.call(this, a);
}
ke.resolveRef = Th;
function jh(e) {
  return (0, Ze.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Aa.call(this, e);
}
function zl(e) {
  for (const t of this._compilations)
    if (kh(t, e))
      return t;
}
ke.getCompilingSchema = zl;
function kh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Ah(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || fs.call(this, e, t);
}
function fs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ze._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ze.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Cs.call(this, r, e);
  const a = (0, Ze.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = fs.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Cs.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Aa.call(this, o), a === (0, Ze.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, Ze.resolveUrl)(this.opts.uriResolver, s, d)), new ds({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Cs.call(this, r, o);
  }
}
ke.resolveSchema = fs;
const Ch = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Cs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Fi.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Ch.has(l) && d && (t = (0, Ze.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Fi.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Ze.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = fs.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new ds({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Dh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Mh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Lh = "object", Vh = [
  "$data"
], Fh = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, zh = !1, Uh = {
  $id: Dh,
  description: Mh,
  type: Lh,
  required: Vh,
  properties: Fh,
  additionalProperties: zh
};
var Ca = {}, hs = { exports: {} };
const qh = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Ul = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function ql(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const Kh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function zi(e) {
  return e.length = 0, !0;
}
function Gh(e, t, r) {
  if (e.length) {
    const n = ql(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Hh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = Gh;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !l(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!l(s, n, r))
          break;
        l = zi;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (l === zi ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(ql(s))), r.address = n.join(""), r;
}
function Kl(e) {
  if (Wh(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Hh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Wh(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Bh(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function Xh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Jh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Ul(r)) {
      const n = Kl(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Gl = {
  nonSimpleDomain: Kh,
  recomposeAuthority: Jh,
  normalizeComponentEncoding: Xh,
  removeDotSegments: Bh,
  isIPv4: Ul,
  isUUID: qh,
  normalizeIPv6: Kl
};
const { isUUID: Yh } = Gl, Zh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Hl(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Wl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Bl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Qh(e) {
  return e.secure = Hl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function xh(e) {
  if ((e.port === (Hl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function em(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Zh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Da(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function tm(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Da(s);
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function rm(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Yh(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function nm(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Xl = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Wl,
    serialize: Bl
  }
), sm = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Xl.domainHost,
    parse: Wl,
    serialize: Bl
  }
), Un = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Qh,
    serialize: xh
  }
), am = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Un.domainHost,
    parse: Un.parse,
    serialize: Un.serialize
  }
), om = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: em,
    serialize: tm,
    skipNormalize: !0
  }
), im = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: rm,
    serialize: nm,
    skipNormalize: !0
  }
), Zn = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Xl,
    https: sm,
    ws: Un,
    wss: am,
    urn: om,
    "urn:uuid": im
  }
);
Object.setPrototypeOf(Zn, null);
function Da(e) {
  return e && (Zn[
    /** @type {SchemeName} */
    e
  ] || Zn[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var cm = {
  SCHEMES: Zn,
  getSchemeHandler: Da
};
const { normalizeIPv6: lm, removeDotSegments: Jr, recomposeAuthority: um, normalizeComponentEncoding: wn, isIPv4: dm, nonSimpleDomain: fm } = Gl, { SCHEMES: hm, getSchemeHandler: Jl } = cm;
function mm(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  ct(gt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  gt(ct(e, t), t)), e;
}
function pm(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = Yl(gt(e, n), gt(t, n), n, !0);
  return n.skipEscape = !0, ct(s, n);
}
function Yl(e, t, r, n) {
  const s = {};
  return n || (e = gt(ct(e, r), r), t = gt(ct(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Jr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Jr(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = Jr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Jr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function ym(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ct(wn(gt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ct(wn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ct(wn(gt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ct(wn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ct(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = Jl(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = um(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = Jr(l)), o === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const $m = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function gt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match($m);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (dm(n.host) === !1) {
        const c = lm(n.host);
        n.host = c.host.toLowerCase(), s = c.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = Jl(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && s === !1 && fm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (l) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + l;
      }
    (!o || o && !o.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Ma = {
  SCHEMES: hm,
  normalize: mm,
  resolve: pm,
  resolveComponent: Yl,
  equal: ym,
  serialize: ct,
  parse: gt
};
hs.exports = Ma;
hs.exports.default = Ma;
hs.exports.fastUri = Ma;
var Zl = hs.exports;
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Ql = Zl;
Ql.code = 'require("ajv/dist/runtime/uri").default';
Ca.default = Ql;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = xe;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Z;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = hn, s = kr, a = lr, o = ke, l = Z, c = Ee, d = $e, u = A, h = Uh, E = Ca, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, v = 200;
  function N(P) {
    var p, S, y, i, f, b, I, j, F, V, ne, Fe, Mt, Lt, Vt, Ft, zt, Ut, qt, Kt, Gt, Ht, Wt, Bt, Xt;
    const He = P.strict, Jt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Ur = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, qr = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : g, Rs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : He) !== null && b !== void 0 ? b : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : He) !== null && j !== void 0 ? j : !0,
      strictTypes: (V = (F = P.strictTypes) !== null && F !== void 0 ? F : He) !== null && V !== void 0 ? V : "log",
      strictTuples: (Fe = (ne = P.strictTuples) !== null && ne !== void 0 ? ne : He) !== null && Fe !== void 0 ? Fe : "log",
      strictRequired: (Lt = (Mt = P.strictRequired) !== null && Mt !== void 0 ? Mt : He) !== null && Lt !== void 0 ? Lt : !1,
      code: P.code ? { ...P.code, optimize: Ur, regExp: qr } : { optimize: Ur, regExp: qr },
      loopRequired: (Vt = P.loopRequired) !== null && Vt !== void 0 ? Vt : v,
      loopEnum: (Ft = P.loopEnum) !== null && Ft !== void 0 ? Ft : v,
      meta: (zt = P.meta) !== null && zt !== void 0 ? zt : !0,
      messages: (Ut = P.messages) !== null && Ut !== void 0 ? Ut : !0,
      inlineRefs: (qt = P.inlineRefs) !== null && qt !== void 0 ? qt : !0,
      schemaId: (Kt = P.schemaId) !== null && Kt !== void 0 ? Kt : "$id",
      addUsedSchema: (Gt = P.addUsedSchema) !== null && Gt !== void 0 ? Gt : !0,
      validateSchema: (Ht = P.validateSchema) !== null && Ht !== void 0 ? Ht : !0,
      validateFormats: (Wt = P.validateFormats) !== null && Wt !== void 0 ? Wt : !0,
      unicodeRegExp: (Bt = P.unicodeRegExp) !== null && Bt !== void 0 ? Bt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Rs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, $, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(S);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, S) {
      const y = this._addSchema(p, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, S);
      async function i(V, ne) {
        await f.call(this, V.$schema);
        const Fe = this._addSchema(V, ne);
        return Fe.validate || b.call(this, Fe);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function b(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return I.call(this, ne), await j.call(this, ne.missingSchema), b.call(this, V);
        }
      }
      function I({ missingSchema: V, missingRef: ne }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${ne} cannot be resolved`);
      }
      async function j(V) {
        const ne = await F.call(this, V);
        this.refs[V] || await f.call(this, ne.$schema), this.refs[V] || this.addSchema(ne, V, S);
      }
      async function F(V) {
        const ne = this._loading[V];
        if (ne)
          return ne;
        try {
          return await (this._loading[V] = y(V));
        } finally {
          delete this._loading[V];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, y = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let y;
      if (typeof p == "string")
        y = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, y, S), !S)
        return (0, u.eachItem)(y, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)(y, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((b) => k.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const y of S.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const I of f)
          b = b[I];
        for (const I in y) {
          const j = y[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, V = b[I];
          F && V && (b[I] = M(V));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const y in p) {
        const i = p[y];
        (!S || S.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, S, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        b = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(b || y);
      const F = c.getSchemaRefs.call(this, p, y);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: y, localRefs: F }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), i && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function X() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function de() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function he(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function ye() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!se.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? L.call(this, b, I, p.before) : b.rules.push(I), f.all[P] = I, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function L(P, p, S) {
    const y = P.rules.findIndex((i) => i.keyword === S);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, G] };
  }
})(ll);
var La = {}, Va = {}, Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const gm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Fa.default = gm;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.callRef = _t.getValidate = void 0;
const _m = kr, Ui = te, Me = Z, mr = Ue, qi = ke, En = A, vm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = qi.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new _m.default(n.opts.uriResolver, s, r);
    if (u instanceof qi.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (a === d)
        return qn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return qn(e, (0, Me._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = xl(e, w);
      qn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Me.stringify)(w) } : { ref: w }), $ = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Me.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function xl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Me._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
_t.getValidate = xl;
function qn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? mr.default.this : Me.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Me._)`await ${(0, Ui.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Me._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Ui.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Me._)`${w}.errors`;
    s.assign(mr.default.vErrors, (0, Me._)`${mr.default.vErrors} === null ? ${_} : ${mr.default.vErrors}.concat(${_})`), s.assign(mr.default.errors, (0, Me._)`${mr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const $ = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = En.mergeEvaluated.props(s, $.props, a.props));
      else {
        const m = s.var("props", (0, Me._)`${w}.evaluated.props`);
        a.props = En.mergeEvaluated.props(s, m, a.props, Me.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = En.mergeEvaluated.items(s, $.items, a.items));
      else {
        const m = s.var("items", (0, Me._)`${w}.evaluated.items`);
        a.items = En.mergeEvaluated.items(s, m, a.items, Me.Name);
      }
  }
}
_t.callRef = qn;
_t.default = vm;
Object.defineProperty(Va, "__esModule", { value: !0 });
const wm = Fa, Em = _t, bm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  wm.default,
  Em.default
];
Va.default = bm;
var za = {}, Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const Qn = Z, St = Qn.operators, xn = {
  maximum: { okStr: "<=", ok: St.LTE, fail: St.GT },
  minimum: { okStr: ">=", ok: St.GTE, fail: St.LT },
  exclusiveMaximum: { okStr: "<", ok: St.LT, fail: St.GTE },
  exclusiveMinimum: { okStr: ">", ok: St.GT, fail: St.LTE }
}, Sm = {
  message: ({ keyword: e, schemaCode: t }) => (0, Qn.str)`must be ${xn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Qn._)`{comparison: ${xn[e].okStr}, limit: ${t}}`
}, Pm = {
  keyword: Object.keys(xn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Sm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Qn._)`${r} ${xn[t].fail} ${n} || isNaN(${r})`);
  }
};
Ua.default = Pm;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const xr = Z, Nm = {
  message: ({ schemaCode: e }) => (0, xr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, xr._)`{multipleOf: ${e}}`
}, Rm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Nm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, xr._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, xr._)`${o} !== parseInt(${o})`;
    e.fail$data((0, xr._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
qa.default = Rm;
var Ka = {}, Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
function eu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Ga.default = eu;
eu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ka, "__esModule", { value: !0 });
const xt = Z, Om = A, Im = Ga, Tm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, jm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Tm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? xt.operators.GT : xt.operators.LT, o = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, Om.useFunc)(e.gen, Im.default)}(${r})`;
    e.fail$data((0, xt._)`${o} ${a} ${n}`);
  }
};
Ka.default = jm;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const km = te, es = Z, Am = {
  message: ({ schemaCode: e }) => (0, es.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, es._)`{pattern: ${e}}`
}, Cm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Am,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, es._)`(new RegExp(${s}, ${o}))` : (0, km.usePattern)(e, n);
    e.fail$data((0, es._)`!${l}.test(${t})`);
  }
};
Ha.default = Cm;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const en = Z, Dm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, en.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, en._)`{limit: ${e}}`
}, Mm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Dm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? en.operators.GT : en.operators.LT;
    e.fail$data((0, en._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Wa.default = Mm;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Hr = te, tn = Z, Lm = A, Vm = {
  message: ({ params: { missingProperty: e } }) => (0, tn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, tn._)`{missingProperty: ${e}}`
}, Fm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Vm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${$}" (strictRequired)`;
          (0, Lm.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(tn.nil, h);
      else
        for (const g of r)
          (0, Hr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, Hr.checkMissingProp)(e, r, g)), (0, Hr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Hr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, Hr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, tn.not)(w), () => {
          e.error(), t.break();
        });
      }, tn.nil);
    }
  }
};
Ba.default = Fm;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const rn = Z, zm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, rn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, rn._)`{limit: ${e}}`
}, Um = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: zm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? rn.operators.GT : rn.operators.LT;
    e.fail$data((0, rn._)`${r}.length ${s} ${n}`);
  }
};
Xa.default = Um;
var Ja = {}, mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
const tu = us;
tu.code = 'require("ajv/dist/runtime/equal").default';
mn.default = tu;
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Ds = $e, ve = Z, qm = A, Km = mn, Gm = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Hm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Gm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Ds.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, ve._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, ve._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, ve._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const $ = t.name("item"), m = (0, Ds.checkDataTypes)(d, $, l.opts.strictNumbers, Ds.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${w}--;`, () => {
        t.let($, (0, ve._)`${r}[${w}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${$} == "string"`, (0, ve._)`${$} += "_"`), t.if((0, ve._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(_, (0, ve._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${$}] = ${w}`);
      });
    }
    function g(w, _) {
      const $ = (0, qm.useFunc)(t, Km.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${w}--;`, () => t.for((0, ve._)`${_} = ${w}; ${_}--;`, () => t.if((0, ve._)`${$}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Ja.default = Hm;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const aa = Z, Wm = A, Bm = mn, Xm = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, aa._)`{allowedValue: ${e}}`
}, Jm = {
  keyword: "const",
  $data: !0,
  error: Xm,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, aa._)`!${(0, Wm.useFunc)(t, Bm.default)}(${r}, ${s})`) : e.fail((0, aa._)`${a} !== ${r}`);
  }
};
Ya.default = Jm;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const Yr = Z, Ym = A, Zm = mn, Qm = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Yr._)`{allowedValues: ${e}}`
}, xm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Qm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Ym.useFunc)(t, Zm.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, Yr.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, Yr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, Yr._)`${d()}(${r}, ${g}[${w}])` : (0, Yr._)`${r} === ${_}`;
    }
  }
};
Za.default = xm;
Object.defineProperty(za, "__esModule", { value: !0 });
const ep = Ua, tp = qa, rp = Ka, np = Ha, sp = Wa, ap = Ba, op = Xa, ip = Ja, cp = Ya, lp = Za, up = [
  // number
  ep.default,
  tp.default,
  // string
  rp.default,
  np.default,
  // object
  sp.default,
  ap.default,
  // array
  op.default,
  ip.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  cp.default,
  lp.default
];
za.default = up;
var Qa = {}, Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.validateAdditionalItems = void 0;
const er = Z, oa = A, dp = {
  message: ({ params: { len: e } }) => (0, er.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, er._)`{limit: ${e}}`
}, fp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: dp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, oa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    ru(e, n);
  }
};
function ru(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, er._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, er._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, oa.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, er._)`${l} <= ${t.length}`);
    r.if((0, er.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: oa.Type.Num }, d), o.allErrors || r.if((0, er.not)(d), () => r.break());
    });
  }
}
Ar.validateAdditionalItems = ru;
Ar.default = fp;
var xa = {}, Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.validateTuple = void 0;
const Ki = Z, Kn = A, hp = te, mp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return nu(e, "additionalItems", t);
    r.items = !0, !(0, Kn.alwaysValidSchema)(r, t) && e.ok((0, hp.validateArray)(e));
  }
};
function nu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Kn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Ki._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Kn.alwaysValidSchema)(l, h) || (n.if((0, Ki._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const $ = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Kn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Cr.validateTuple = nu;
Cr.default = mp;
Object.defineProperty(xa, "__esModule", { value: !0 });
const pp = Cr, yp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, pp.validateTuple)(e, "items")
};
xa.default = yp;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const Gi = Z, $p = A, gp = te, _p = Ar, vp = {
  message: ({ params: { len: e } }) => (0, Gi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Gi._)`{limit: ${e}}`
}, wp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: vp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, $p.alwaysValidSchema)(n, t) && (s ? (0, _p.validateAdditionalItems)(e, s) : e.ok((0, gp.validateArray)(e)));
  }
};
eo.default = wp;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const Ke = Z, bn = A, Ep = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ke.str)`must contain at least ${e} valid item(s)` : (0, Ke.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ke._)`{minContains: ${e}}` : (0, Ke._)`{minContains: ${e}, maxContains: ${t}}`
}, bp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Ep,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Ke._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, bn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, bn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, bn.alwaysValidSchema)(a, r)) {
      let _ = (0, Ke._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Ke._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ke._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), $ = t.let("count", 0);
      g(_, () => t.if(_, () => w($)));
    }
    function g(_, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: bn.Type.Num,
          compositeRule: !0
        }, _), $();
      });
    }
    function w(_) {
      t.code((0, Ke._)`${_}++`), l === void 0 ? t.if((0, Ke._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ke._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ke._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
to.default = bp;
var ms = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Z, r = A, n = te;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : u;
      E[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: E, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated($, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(ms);
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
const su = Z, Sp = A, Pp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, su._)`{propertyName: ${e.propertyName}}`
}, Np = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Pp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Sp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, su.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ro.default = Np;
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
const Sn = te, Je = Z, Rp = Ue, Pn = A, Op = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Je._)`{additionalProperty: ${e.additionalProperty}}`
}, Ip = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Op,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Pn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Sn.allSchemaProperties)(n.properties), u = (0, Sn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Je._)`${a} === ${Rp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? w($) : t.if(E($), () => w($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const v = (0, Pn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Sn.isOwnProperty)(t, v, $);
      } else d.length ? m = (0, Je.or)(...d.map((v) => (0, Je._)`${$} === ${v}`)) : m = Je.nil;
      return u.length && (m = (0, Je.or)(m, ...u.map((v) => (0, Je._)`${(0, Sn.usePattern)(e, v)}.test(${$})`))), (0, Je.not)(m);
    }
    function g($) {
      t.code((0, Je._)`delete ${s}[${$}]`);
    }
    function w($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Pn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_($, m, !1), t.if((0, Je.not)(m), () => {
          e.reset(), g($);
        })) : (_($, m), l || t.if((0, Je.not)(m), () => t.break()));
      }
    }
    function _($, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: Pn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
ps.default = Ip;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const Tp = xe, Hi = te, Ms = A, Wi = ps, jp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Wi.default.code(new Tp.KeywordCxt(a, Wi.default, "additionalProperties"));
    const o = (0, Hi.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ms.mergeEvaluated.props(t, (0, Ms.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Ms.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Hi.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
no.default = jp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const Bi = te, Nn = Z, Xi = A, Ji = A, kp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Bi.allSchemaProperties)(r), c = l.filter((_) => (0, Xi.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Nn.Name) && (a.props = (0, Ji.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const $ in d)
        new RegExp(_).test($) && (0, Xi.checkStrictMode)(a, `property ${$} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, ($) => {
        t.if((0, Nn._)`${(0, Bi.usePattern)(e, _)}.test(${$})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: $,
            dataPropType: Ji.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, Nn._)`${h}[${$}]`, !0) : !m && !a.allErrors && t.if((0, Nn.not)(u), () => t.break());
        });
      });
    }
  }
};
so.default = kp;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const Ap = A, Cp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Ap.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ao.default = Cp;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const Dp = te, Mp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Dp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
oo.default = Mp;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const Gn = Z, Lp = A, Vp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Gn._)`{passingSchemas: ${e.passing}}`
}, Fp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Vp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let E;
        (0, Lp.alwaysValidSchema)(s, u) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Gn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Gn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), E && e.mergeEvaluated(E, Gn.Name);
        });
      });
    }
  }
};
io.default = Fp;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const zp = A, Up = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, zp.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
co.default = Up;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const ts = Z, au = A, qp = {
  message: ({ params: e }) => (0, ts.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ts._)`{failingKeyword: ${e.ifClause}}`
}, Kp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: qp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, au.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Yi(n, "then"), a = Yi(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, ts.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, ts._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Yi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, au.alwaysValidSchema)(e, r);
}
lo.default = Kp;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const Gp = A, Hp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Gp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
uo.default = Hp;
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Wp = Ar, Bp = xa, Xp = Cr, Jp = eo, Yp = to, Zp = ms, Qp = ro, xp = ps, ey = no, ty = so, ry = ao, ny = oo, sy = io, ay = co, oy = lo, iy = uo;
function cy(e = !1) {
  const t = [
    // any
    ry.default,
    ny.default,
    sy.default,
    ay.default,
    oy.default,
    iy.default,
    // object
    Qp.default,
    xp.default,
    Zp.default,
    ey.default,
    ty.default
  ];
  return e ? t.push(Bp.default, Jp.default) : t.push(Wp.default, Xp.default), t.push(Yp.default), t;
}
Qa.default = cy;
var fo = {}, Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.dynamicAnchor = void 0;
const Ls = Z, ly = Ue, Zi = ke, uy = _t, dy = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => ou(e, e.schema)
};
function ou(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Ls._)`${ly.default.dynamicAnchors}${(0, Ls.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : fy(e);
  r.if((0, Ls._)`!${s}`, () => r.assign(s, a));
}
Dr.dynamicAnchor = ou;
function fy(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: c } = n.opts, d = new Zi.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: l });
  return Zi.compileSchema.call(n, d), (0, uy.getValidate)(e, d);
}
Dr.default = dy;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.dynamicRef = void 0;
const Qi = Z, hy = Ue, xi = _t, my = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => iu(e, e.schema)
};
function iu(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), e.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, Qi._)`${hy.default.dynamicAnchors}${(0, Qi.getProperty)(a)}`);
      r.if(d, l(d, c), l(s.validateName, c));
    } else
      l(s.validateName, c)();
  }
  function l(c, d) {
    return d ? () => r.block(() => {
      (0, xi.callRef)(e, c), r.let(d, !0);
    }) : () => (0, xi.callRef)(e, c);
  }
}
Mr.dynamicRef = iu;
Mr.default = my;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const py = Dr, yy = A, $y = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, py.dynamicAnchor)(e, "") : (0, yy.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ho.default = $y;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const gy = Mr, _y = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, gy.dynamicRef)(e, e.schema)
};
mo.default = _y;
Object.defineProperty(fo, "__esModule", { value: !0 });
const vy = Dr, wy = Mr, Ey = ho, by = mo, Sy = [vy.default, wy.default, Ey.default, by.default];
fo.default = Sy;
var po = {}, yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const ec = ms, Py = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: ec.error,
  code: (e) => (0, ec.validatePropertyDeps)(e)
};
yo.default = Py;
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const Ny = ms, Ry = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, Ny.validateSchemaDeps)(e)
};
$o.default = Ry;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const Oy = A, Iy = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, Oy.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
go.default = Iy;
Object.defineProperty(po, "__esModule", { value: !0 });
const Ty = yo, jy = $o, ky = go, Ay = [Ty.default, jy.default, ky.default];
po.default = Ay;
var _o = {}, vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const Rt = Z, tc = A, Cy = Ue, Dy = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Rt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, My = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Dy,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof Rt.Name ? t.if((0, Rt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), a.props = !0, e.ok((0, Rt._)`${s} === ${Cy.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, tc.alwaysValidSchema)(a, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: tc.Type.Str
        }, E), o || t.if((0, Rt.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, Rt._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, Rt._)`${E} !== ${w}`);
      return (0, Rt.and)(...g);
    }
  }
};
vo.default = My;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const tr = Z, rc = A, Ly = {
  message: ({ params: { len: e } }) => (0, tr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tr._)`{limit: ${e}}`
}, Vy = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Ly,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, tr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, tr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, rc.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, tr._)`${o} <= ${a}`);
      t.if((0, tr.not)(c), () => l(c, a)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: rc.Type.Num }, c), s.allErrors || t.if((0, tr.not)(c), () => t.break());
      });
    }
  }
};
wo.default = Vy;
Object.defineProperty(_o, "__esModule", { value: !0 });
const Fy = vo, zy = wo, Uy = [Fy.default, zy.default];
_o.default = Uy;
var Eo = {}, bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const me = Z, qy = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, Ky = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: qy,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, me._)`${w}[${o}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, me._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign($, (0, me._)`${_}.type || "string"`).assign(m, (0, me._)`${_}.validate`), () => r.assign($, (0, me._)`"string"`).assign(m, _)), e.fail$data((0, me.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? me.nil : (0, me._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, me._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, me._)`${m}(${n})`, O = (0, me._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, me._)`${m} && ${m} !== true && ${$} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, $, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, me.regexpCode)(O) : c.code.formats ? (0, me._)`${c.code.formats}${(0, me.getProperty)(a)}` : void 0, X = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, me._)`${X}.validate`] : ["string", O, X];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, me._)`${m}(${n})` : (0, me._)`${m}.test(${n})`;
      }
    }
  }
};
bo.default = Ky;
Object.defineProperty(Eo, "__esModule", { value: !0 });
const Gy = bo, Hy = [Gy.default];
Eo.default = Hy;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.contentVocabulary = Ir.metadataVocabulary = void 0;
Ir.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ir.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(La, "__esModule", { value: !0 });
const Wy = Va, By = za, Xy = Qa, Jy = fo, Yy = po, Zy = _o, Qy = Eo, nc = Ir, xy = [
  Jy.default,
  Wy.default,
  By.default,
  (0, Xy.default)(!0),
  Qy.default,
  nc.metadataVocabulary,
  nc.contentVocabulary,
  Yy.default,
  Zy.default
];
La.default = xy;
var So = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.DiscrError = void 0;
var sc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(sc || (ys.DiscrError = sc = {}));
Object.defineProperty(So, "__esModule", { value: !0 });
const gr = Z, ia = ys, ac = ke, e$ = kr, t$ = A, r$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ia.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, gr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, n$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: r$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, gr._)`${r}${(0, gr.getProperty)(l)}`);
    t.if((0, gr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: ia.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, gr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: ia.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, gr.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let $ = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, t$.schemaHasRulesButRef)(O, a.self.RULES)) {
          const X = O.$ref;
          if (O = ac.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), O instanceof ac.SchemaEnv && (O = O.schema), O === void 0)
            throw new e$.default(a.opts.uriResolver, a.baseId, X);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (_ || m(O)), v(K, R);
      }
      if (!$)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
So.default = n$;
var Po = {};
const s$ = "https://json-schema.org/draft/2020-12/schema", a$ = "https://json-schema.org/draft/2020-12/schema", o$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, i$ = "meta", c$ = "Core and Validation specifications meta-schema", l$ = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], u$ = [
  "object",
  "boolean"
], d$ = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", f$ = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, h$ = {
  $schema: s$,
  $id: a$,
  $vocabulary: o$,
  $dynamicAnchor: i$,
  title: c$,
  allOf: l$,
  type: u$,
  $comment: d$,
  properties: f$
}, m$ = "https://json-schema.org/draft/2020-12/schema", p$ = "https://json-schema.org/draft/2020-12/meta/applicator", y$ = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, $$ = "meta", g$ = "Applicator vocabulary meta-schema", _$ = [
  "object",
  "boolean"
], v$ = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, w$ = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, E$ = {
  $schema: m$,
  $id: p$,
  $vocabulary: y$,
  $dynamicAnchor: $$,
  title: g$,
  type: _$,
  properties: v$,
  $defs: w$
}, b$ = "https://json-schema.org/draft/2020-12/schema", S$ = "https://json-schema.org/draft/2020-12/meta/unevaluated", P$ = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, N$ = "meta", R$ = "Unevaluated applicator vocabulary meta-schema", O$ = [
  "object",
  "boolean"
], I$ = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, T$ = {
  $schema: b$,
  $id: S$,
  $vocabulary: P$,
  $dynamicAnchor: N$,
  title: R$,
  type: O$,
  properties: I$
}, j$ = "https://json-schema.org/draft/2020-12/schema", k$ = "https://json-schema.org/draft/2020-12/meta/content", A$ = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, C$ = "meta", D$ = "Content vocabulary meta-schema", M$ = [
  "object",
  "boolean"
], L$ = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, V$ = {
  $schema: j$,
  $id: k$,
  $vocabulary: A$,
  $dynamicAnchor: C$,
  title: D$,
  type: M$,
  properties: L$
}, F$ = "https://json-schema.org/draft/2020-12/schema", z$ = "https://json-schema.org/draft/2020-12/meta/core", U$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, q$ = "meta", K$ = "Core vocabulary meta-schema", G$ = [
  "object",
  "boolean"
], H$ = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, W$ = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, B$ = {
  $schema: F$,
  $id: z$,
  $vocabulary: U$,
  $dynamicAnchor: q$,
  title: K$,
  type: G$,
  properties: H$,
  $defs: W$
}, X$ = "https://json-schema.org/draft/2020-12/schema", J$ = "https://json-schema.org/draft/2020-12/meta/format-annotation", Y$ = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Z$ = "meta", Q$ = "Format vocabulary meta-schema for annotation results", x$ = [
  "object",
  "boolean"
], e0 = {
  format: {
    type: "string"
  }
}, t0 = {
  $schema: X$,
  $id: J$,
  $vocabulary: Y$,
  $dynamicAnchor: Z$,
  title: Q$,
  type: x$,
  properties: e0
}, r0 = "https://json-schema.org/draft/2020-12/schema", n0 = "https://json-schema.org/draft/2020-12/meta/meta-data", s0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, a0 = "meta", o0 = "Meta-data vocabulary meta-schema", i0 = [
  "object",
  "boolean"
], c0 = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, l0 = {
  $schema: r0,
  $id: n0,
  $vocabulary: s0,
  $dynamicAnchor: a0,
  title: o0,
  type: i0,
  properties: c0
}, u0 = "https://json-schema.org/draft/2020-12/schema", d0 = "https://json-schema.org/draft/2020-12/meta/validation", f0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, h0 = "meta", m0 = "Validation vocabulary meta-schema", p0 = [
  "object",
  "boolean"
], y0 = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, $0 = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, g0 = {
  $schema: u0,
  $id: d0,
  $vocabulary: f0,
  $dynamicAnchor: h0,
  title: m0,
  type: p0,
  properties: y0,
  $defs: $0
};
Object.defineProperty(Po, "__esModule", { value: !0 });
const _0 = h$, v0 = E$, w0 = T$, E0 = V$, b0 = B$, S0 = t0, P0 = l0, N0 = g0, R0 = ["/properties"];
function O0(e) {
  return [
    _0,
    v0,
    w0,
    E0,
    b0,
    t(this, S0),
    P0,
    t(this, N0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, R0) : n;
  }
}
Po.default = O0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = ll, n = La, s = So, a = Po, o = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
    constructor(g = {}) {
      super({
        ...g,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: g, meta: w } = this.opts;
      w && (a.default.call(this, g), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var c = xe;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = Z;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var u = hn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = kr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(ea, ea.exports);
var I0 = ea.exports, ca = { exports: {} }, cu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, H) {
    return { validate: z, compare: H };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(E(!0), g),
    "iso-time": t(c(), u),
    "iso-date-time": t(E(), w),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ye,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: K },
    // signed 64 bit integer
    int64: { type: "number", validate: X },
    // C-type float
    float: { type: "number", validate: de },
    // C-type double
    double: { type: "number", validate: de },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(z) {
    return z % 4 === 0 && (z % 100 !== 0 || z % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(z) {
    const H = n.exec(z);
    if (!H)
      return !1;
    const se = +H[1], T = +H[2], k = +H[3];
    return T >= 1 && T <= 12 && k >= 1 && k <= (T === 2 && r(se) ? 29 : s[T]);
  }
  function o(z, H) {
    if (z && H)
      return z > H ? 1 : z < H ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(z) {
    return function(se) {
      const T = l.exec(se);
      if (!T)
        return !1;
      const k = +T[1], L = +T[2], D = +T[3], G = T[4], M = T[5] === "-" ? -1 : 1, P = +(T[6] || 0), p = +(T[7] || 0);
      if (P > 23 || p > 59 || z && !G)
        return !1;
      if (k <= 23 && L <= 59 && D < 60)
        return !0;
      const S = L - p * M, y = k - P * M - (S < 0 ? 1 : 0);
      return (y === 23 || y === -1) && (S === 59 || S === -1) && D < 61;
    };
  }
  function d(z, H) {
    if (!(z && H))
      return;
    const se = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), T = (/* @__PURE__ */ new Date("2020-01-01T" + H)).valueOf();
    if (se && T)
      return se - T;
  }
  function u(z, H) {
    if (!(z && H))
      return;
    const se = l.exec(z), T = l.exec(H);
    if (se && T)
      return z = se[1] + se[2] + se[3], H = T[1] + T[2] + T[3], z > H ? 1 : z < H ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(z) {
    const H = c(z);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && a(k[0]) && H(k[1]);
    };
  }
  function g(z, H) {
    if (!(z && H))
      return;
    const se = new Date(z).valueOf(), T = new Date(H).valueOf();
    if (se && T)
      return se - T;
  }
  function w(z, H) {
    if (!(z && H))
      return;
    const [se, T] = z.split(h), [k, L] = H.split(h), D = o(se, k);
    if (D !== void 0)
      return D || d(T, L);
  }
  const _ = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(z) {
    return _.test(z) && $.test(z);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(z) {
    return v.lastIndex = 0, v.test(z);
  }
  const R = -2147483648, O = 2 ** 31 - 1;
  function K(z) {
    return Number.isInteger(z) && z <= O && z >= R;
  }
  function X(z) {
    return Number.isInteger(z);
  }
  function de() {
    return !0;
  }
  const he = /[^\\]\\Z/;
  function ye(z) {
    if (he.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})(cu);
var lu = {}, la = { exports: {} }, uu = {}, et = {}, Tr = {}, pn = {}, ee = {}, dn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(dn);
var ua = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = dn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: g } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const $ = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(ua);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = dn, r = ua;
  var n = dn;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = ua;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return se(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, b, I) {
      super(i, b, I), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let I = b.length;
      for (; I--; ) {
        const j = b[I];
        j.optimizeNames(i, f) || (k(i, j.names), b.splice(I, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class $ extends w {
  }
  $.kind = "else";
  class m extends w {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new $(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(L(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return se(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, b, I) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: I, to: j } = this;
      return `for(${f} ${b}=${I}; ${b}<${j}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = se(super.names, this.from);
      return se(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, b, I) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class X extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  X.kind = "return";
  class de extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, I;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class he extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  he.kind = "catch";
  class ye extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ye.kind = "finally";
  class z {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, b, I) {
      const j = this._scope.toName(f);
      return b !== void 0 && I && (this._constants[j.str] = b), this._leafNode(new o(i, j, b)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new l(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, I] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, b), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (V) => {
          this.var(j, (0, t._)`${F}[${V}]`), b(j);
        });
      }
      return this._for(new O("of", I, j, f), () => b(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => b(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new X();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(X);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new de();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new he(j), f(j);
      }
      return b && (this._currNode = I.finally = new ye(), this.code(b)), this._endBlockNode(he, ye);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, I) {
      return this._blockNode(new K(i, f, b)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = z;
  function H(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function se(y, i) {
    return i instanceof t._CodeOrName ? H(y, i.names) : y;
  }
  function T(y, i, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!I(y))
      return y;
    return new t._Code(y._items.reduce((j, F) => (F instanceof t.Name && (F = b(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function b(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function L(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = L;
  const D = p(e.operators.AND);
  function G(...y) {
    return y.reduce(D);
  }
  e.and = G;
  const M = p(e.operators.OR);
  function P(...y) {
    return y.reduce(M);
  }
  e.or = P;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(ee);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const ce = ee, T0 = dn;
function j0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = j0;
function k0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (du(e, t), !fu(t, e.self.RULES.all));
}
C.alwaysValidSchema = k0;
function du(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || pu(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = du;
function fu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = fu;
function A0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = A0;
function C0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ce._)`${r}`;
  }
  return (0, ce._)`${e}${t}${(0, ce.getProperty)(n)}`;
}
C.schemaRefOrVal = C0;
function D0(e) {
  return hu(decodeURIComponent(e));
}
C.unescapeFragment = D0;
function M0(e) {
  return encodeURIComponent(No(e));
}
C.escapeFragment = M0;
function No(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = No;
function hu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = hu;
function L0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = L0;
function oc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof ce.Name ? (a instanceof ce.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ce.Name ? (t(s, o, a), a) : r(a, o);
    return l === ce.Name && !(c instanceof ce.Name) ? n(s, c) : c;
  };
}
C.mergeEvaluated = {
  props: oc({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ce._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ce._)`${r} || {}`).code((0, ce._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ce._)`${r} || {}`), Ro(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: mu
  }),
  items: oc({
    mergeNames: (e, t, r) => e.if((0, ce._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ce._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ce._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ce._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function mu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ce._)`{}`);
  return t !== void 0 && Ro(e, r, t), r;
}
C.evaluatedPropsToName = mu;
function Ro(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ce._)`${t}${(0, ce.getProperty)(n)}`, !0));
}
C.setEvaluated = Ro;
const ic = {};
function V0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: ic[t.code] || (ic[t.code] = new T0._Code(t.code))
  });
}
C.useFunc = V0;
var da;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(da || (C.Type = da = {}));
function F0(e, t, r) {
  if (e instanceof ce.Name) {
    const n = t === da.Num;
    return r ? n ? (0, ce._)`"[" + ${e} + "]"` : (0, ce._)`"['" + ${e} + "']"` : n ? (0, ce._)`"/" + ${e}` : (0, ce._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ce.getProperty)(e).toString() : "/" + No(e);
}
C.getErrorPath = F0;
function pu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = pu;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
const Re = ee, z0 = {
  // validation function arguments
  data: new Re.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Re.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Re.Name("instancePath"),
  parentData: new Re.Name("parentData"),
  parentDataProperty: new Re.Name("parentDataProperty"),
  rootData: new Re.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Re.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Re.Name("vErrors"),
  // null or array of validation errors
  errors: new Re.Name("errors"),
  // counter of validation errors
  this: new Re.Name("this"),
  // "globals"
  self: new Re.Name("self"),
  scope: new Re.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Re.Name("json"),
  jsonPos: new Re.Name("jsonPos"),
  jsonLen: new Re.Name("jsonLen"),
  jsonPart: new Re.Name("jsonPart")
};
ut.default = z0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ee, r = C, n = ut;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, v, N) {
    const { it: R } = $, { gen: O, compositeRule: K, allErrors: X } = R, de = h($, m, v);
    N ?? (K || X) ? c(O, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function a($, m = e.keywordError, v) {
    const { it: N } = $, { gen: R, compositeRule: O, allErrors: K } = N, X = h($, m, v);
    c(R, X), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: $, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = $.name("err");
    $.forRange("i", R, n.default.errors, (X) => {
      $.const(K, (0, t._)`${n.default.vErrors}[${X}]`), $.if((0, t._)`${K}.instancePath === undefined`, () => $.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), $.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && ($.assign((0, t._)`${K}.schema`, v), $.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c($, m) {
    const v = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: v, validateName: N, schemaEnv: R } = $;
    R.$async ? v.throw((0, t._)`new ${$.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, v) {
    const { createErrors: N } = $.it;
    return N === !1 ? (0, t._)`{}` : E($, m, v);
  }
  function E($, m, v = {}) {
    const { gen: N, it: R } = $, O = [
      g(R, v),
      w($, v)
    ];
    return _($, m, O), N.object(...O);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const v = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${$}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _($, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: X } = $, { opts: de, propertyName: he, topSchemaRef: ye, schemaPath: z } = X;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), de.messages && N.push([u.message, typeof v == "function" ? v($) : v]), de.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${z}`], [n.default.data, O]), he && N.push([u.propertyName, he]);
  }
})(pn);
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.boolOrEmptySchema = Tr.topBoolOrEmptySchema = void 0;
const U0 = pn, q0 = ee, K0 = ut, G0 = {
  message: "boolean schema is false"
};
function H0(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? yu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(K0.default.data) : (t.assign((0, q0._)`${n}.errors`, null), t.return(!0));
}
Tr.topBoolOrEmptySchema = H0;
function W0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), yu(e)) : r.var(t, !0);
}
Tr.boolOrEmptySchema = W0;
function yu(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, U0.reportError)(s, G0, void 0, t);
}
var ge = {}, ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.getRules = ur.isJSONType = void 0;
const B0 = ["string", "number", "integer", "boolean", "null", "object", "array"], X0 = new Set(B0);
function J0(e) {
  return typeof e == "string" && X0.has(e);
}
ur.isJSONType = J0;
function Y0() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ur.getRules = Y0;
var yt = {};
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.shouldUseRule = yt.shouldUseGroup = yt.schemaHasRulesForType = void 0;
function Z0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && $u(e, n);
}
yt.schemaHasRulesForType = Z0;
function $u(e, t) {
  return t.rules.some((r) => gu(e, r));
}
yt.shouldUseGroup = $u;
function gu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
yt.shouldUseRule = gu;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const Q0 = ur, x0 = yt, eg = pn, x = ee, _u = C;
var Pr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Pr || (ge.DataType = Pr = {}));
function tg(e) {
  const t = vu(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
ge.getSchemaTypes = tg;
function vu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Q0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = vu;
function rg(e, t) {
  const { gen: r, data: n, opts: s } = e, a = ng(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, x0.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = Oo(t, n, s.strictNumbers, Pr.Wrong);
    r.if(l, () => {
      a.length ? sg(e, t, a) : Io(e);
    });
  }
  return o;
}
ge.coerceAndCheckDataType = rg;
const wu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function ng(e, t) {
  return t ? e.filter((r) => wu.has(r) || t === "array" && r === "array") : [];
}
function sg(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, x._)`typeof ${s}`), l = n.let("coerced", (0, x._)`undefined`);
  a.coerceTypes === "array" && n.if((0, x._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(o, (0, x._)`typeof ${s}`).if(Oo(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, x._)`${l} !== undefined`);
  for (const d of r)
    (wu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Io(e), n.endIf(), n.if((0, x._)`${l} !== undefined`, () => {
    n.assign(s, l), ag(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(l, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, x._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, x._)`[${s}]`);
    }
  }
}
function ag({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function fa(e, t, r, n = Pr.Correct) {
  const s = n === Pr.Correct ? x.operators.EQ : x.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, x._)`${t} ${s} null`;
    case "array":
      a = (0, x._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, x._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, x._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, x._)`typeof ${t} ${s} ${e}`;
  }
  return n === Pr.Correct ? a : (0, x.not)(a);
  function o(l = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, l, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
ge.checkDataType = fa;
function Oo(e, t, r, n) {
  if (e.length === 1)
    return fa(e[0], t, r, n);
  let s;
  const a = (0, _u.toHash)(e);
  if (a.array && a.object) {
    const o = (0, x._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, x._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = x.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, x.and)(s, fa(o, t, r, n));
  return s;
}
ge.checkDataTypes = Oo;
const og = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function Io(e) {
  const t = ig(e);
  (0, eg.reportError)(t, og);
}
ge.reportTypeError = Io;
function ig(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, _u.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.assignDefaults = void 0;
const pr = ee, cg = C;
function lg(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      cc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => cc(e, a, s.default));
}
$s.assignDefaults = lg;
function cc(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, pr._)`${a}${(0, pr.getProperty)(t)}`;
  if (s) {
    (0, cg.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, pr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, pr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, pr._)`${l} = ${(0, pr.stringify)(r)}`);
}
var lt = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const ue = ee, To = C, Pt = ut, ug = C;
function dg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ko(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = dg;
function fg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((a) => (0, ue.and)(ko(e, t, a, r.ownProperties), (0, ue._)`${s} = ${a}`)));
}
re.checkMissingProp = fg;
function hg(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = hg;
function Eu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ue._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = Eu;
function jo(e, t, r) {
  return (0, ue._)`${Eu(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = jo;
function mg(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${jo(e, t, r)}` : s;
}
re.propertyInData = mg;
function ko(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(jo(e, t, r))) : s;
}
re.noPropertyInData = ko;
function bu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = bu;
function pg(e, t) {
  return bu(t).filter((r) => !(0, To.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = pg;
function yg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, ue._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Pt.default.instancePath, (0, ue.strConcat)(Pt.default.instancePath, a)],
    [Pt.default.parentData, o.parentData],
    [Pt.default.parentDataProperty, o.parentDataProperty],
    [Pt.default.rootData, Pt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Pt.default.dynamicAnchors, Pt.default.dynamicAnchors]);
  const E = (0, ue._)`${u}, ${r.object(...h)}`;
  return c !== ue.nil ? (0, ue._)`${l}.call(${c}, ${E})` : (0, ue._)`${l}(${E})`;
}
re.callValidateCode = yg;
const $g = (0, ue._)`new RegExp`;
function gg({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ue._)`${s.code === "new RegExp" ? $g : (0, ug.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = gg;
function _g(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, ue._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: To.Type.Num
      }, a), t.if((0, ue.not)(a), l);
    });
  }
}
re.validateArray = _g;
function vg(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, To.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, ue._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ue.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
re.validateUnion = vg;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
const je = ee, rr = ut, wg = re, Eg = pn;
function bg(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = Su(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: je.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
lt.macroKeywordCode = bg;
function Sg(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  Ng(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = Su(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && lc(e), $(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && lc(e), $(() => Pg(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, je._)`await `), (v) => n.assign(h, !1).if((0, je._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, je._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, je._)`${u}.errors`;
    return n.assign(m, null), _(je.nil), m;
  }
  function _(m = t.async ? (0, je._)`await ` : je.nil) {
    const v = c.opts.passContext ? rr.default.this : rr.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, je._)`${m}${(0, wg.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function $(m) {
    var v;
    n.if((0, je.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
lt.funcKeywordCode = Sg;
function lc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, je._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Pg(e, t) {
  const { gen: r } = e;
  r.if((0, je._)`Array.isArray(${t})`, () => {
    r.assign(rr.default.vErrors, (0, je._)`${rr.default.vErrors} === null ? ${t} : ${rr.default.vErrors}.concat(${t})`).assign(rr.default.errors, (0, je._)`${rr.default.vErrors}.length`), (0, Eg.extendErrors)(e);
  }, () => e.error());
}
function Ng({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Su(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, je.stringify)(r) });
}
function Rg(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
lt.validSchemaType = Rg;
function Og({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
lt.validateKeywordUsage = Og;
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.extendSubschemaMode = Dt.extendSubschemaData = Dt.getSubschema = void 0;
const ot = ee, Pu = C;
function Ig(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, ot._)`${e.schemaPath}${(0, ot.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, ot._)`${e.schemaPath}${(0, ot.getProperty)(t)}${(0, ot.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Pu.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Dt.getSubschema = Ig;
function Tg(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, ot._)`${t.data}${(0, ot.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, ot.str)`${d}${(0, Pu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ot._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof ot.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Dt.extendSubschemaData = Tg;
function jg(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Dt.extendSubschemaMode = jg;
var be = {}, Nu = { exports: {} }, At = Nu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Hn(t, n, s, e, "", e);
};
At.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
At.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
At.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
At.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Hn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in At.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Hn(e, t, r, h[E], s + "/" + u + "/" + E, a, s, u, n, E);
      } else if (u in At.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Hn(e, t, r, h[g], s + "/" + u + "/" + kg(g), a, s, u, n, g);
      } else (u in At.keywords || e.allKeys && !(u in At.skipKeywords)) && Hn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function kg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Ag = Nu.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const Cg = C, Dg = us, Mg = Ag, Lg = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Vg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ha(e) : t ? Ru(e) <= t : !1;
}
be.inlineRef = Vg;
const Fg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ha(e) {
  for (const t in e) {
    if (Fg.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ha) || typeof r == "object" && ha(r))
      return !0;
  }
  return !1;
}
function Ru(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Lg.has(r) && (typeof e[r] == "object" && (0, Cg.eachItem)(e[r], (n) => t += Ru(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ou(e, t = "", r) {
  r !== !1 && (t = Nr(t));
  const n = e.parse(t);
  return Iu(e, n);
}
be.getFullPath = Ou;
function Iu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
be._getFullPath = Iu;
const zg = /#\/?$/;
function Nr(e) {
  return e ? e.replace(zg, "") : "";
}
be.normalizeId = Nr;
function Ug(e, t, r) {
  return r = Nr(r), e.resolve(t, r);
}
be.resolveUrl = Ug;
const qg = /^[a-z_][-a-z0-9._]*$/i;
function Kg(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Nr(e[r] || t), a = { "": s }, o = Ou(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Mg(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let $ = a[w];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = $;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Nr($ ? R($, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Nr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!qg.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !Dg(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = Kg;
Object.defineProperty(et, "__esModule", { value: !0 });
et.getData = et.KeywordCxt = et.validateFunctionCode = void 0;
const Tu = Tr, uc = ge, Ao = yt, rs = ge, Gg = $s, nn = lt, Vs = Dt, q = ee, B = ut, Hg = be, $t = C, Wr = pn;
function Wg(e) {
  if (Au(e) && (Cu(e), ku(e))) {
    Jg(e);
    return;
  }
  ju(e, () => (0, Tu.topBoolOrEmptySchema)(e));
}
et.validateFunctionCode = Wg;
function ju({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, q._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${dc(r, s)}`), Xg(e, s), e.code(a);
  }) : e.func(t, (0, q._)`${B.default.data}, ${Bg(s)}`, n.$async, () => e.code(dc(r, s)).code(a));
}
function Bg(e) {
  return (0, q._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${e.dynamicRef ? (0, q._)`, ${B.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function Xg(e, t) {
  e.if(B.default.valCxt, () => {
    e.var(B.default.instancePath, (0, q._)`${B.default.valCxt}.${B.default.instancePath}`), e.var(B.default.parentData, (0, q._)`${B.default.valCxt}.${B.default.parentData}`), e.var(B.default.parentDataProperty, (0, q._)`${B.default.valCxt}.${B.default.parentDataProperty}`), e.var(B.default.rootData, (0, q._)`${B.default.valCxt}.${B.default.rootData}`), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, q._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    e.var(B.default.instancePath, (0, q._)`""`), e.var(B.default.parentData, (0, q._)`undefined`), e.var(B.default.parentDataProperty, (0, q._)`undefined`), e.var(B.default.rootData, B.default.data), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function Jg(e) {
  const { schema: t, opts: r, gen: n } = e;
  ju(e, () => {
    r.$comment && t.$comment && Mu(e), e_(e), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && Yg(e), Du(e), n_(e);
  });
}
function Yg(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function dc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function Zg(e, t) {
  if (Au(e) && (Cu(e), ku(e))) {
    Qg(e, t);
    return;
  }
  (0, Tu.boolOrEmptySchema)(e, t);
}
function ku({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Au(e) {
  return typeof e.schema != "boolean";
}
function Qg(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Mu(e), t_(e), r_(e);
  const a = n.const("_errs", B.default.errors);
  Du(e, a), n.var(t, (0, q._)`${a} === ${B.default.errors}`);
}
function Cu(e) {
  (0, $t.checkUnknownRules)(e), xg(e);
}
function Du(e, t) {
  if (e.opts.jtd)
    return fc(e, [], !1, t);
  const r = (0, uc.getSchemaTypes)(e.schema), n = (0, uc.coerceAndCheckDataType)(e, r);
  fc(e, r, !n, t);
}
function xg(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, $t.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function e_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, $t.checkStrictMode)(e, "default is ignored in the schema root");
}
function t_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Hg.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function r_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Mu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${B.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${B.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function n_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, q._)`${B.default.errors} === 0`, () => t.return(B.default.data), () => t.throw((0, q._)`new ${s}(${B.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, B.default.vErrors), a.unevaluated && s_(e), t.return((0, q._)`${B.default.errors} === 0`));
}
function s_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function fc(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, $t.schemaHasRulesButRef)(a, u))) {
    s.block(() => Fu(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || a_(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Ao.shouldUseGroup)(a, E) && (E.type ? (s.if((0, rs.checkDataType)(E.type, o, c.strictNumbers)), hc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, rs.reportTypeError)(e)), s.endIf()) : hc(e, E), l || s.if((0, q._)`${B.default.errors} === ${n || 0}`));
  }
}
function hc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Gg.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Ao.shouldUseRule)(n, a) && Fu(e, a.keyword, a.definition, t.type);
  });
}
function a_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (o_(e, t), e.opts.allowUnionTypes || i_(e, t), c_(e, e.dataTypes));
}
function o_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Lu(e.dataTypes, r) || Co(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), u_(e, t);
  }
}
function i_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Co(e, "use allowUnionTypes to allow union type keyword");
}
function c_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ao.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => l_(t, o)) && Co(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function l_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Lu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function u_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Lu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Co(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, $t.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Vu {
  constructor(t, r, n) {
    if ((0, nn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, $t.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", zu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, nn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", B.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Wr.reportExtraError : Wr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Wr.reportError)(this, this.def.$dataError || Wr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Wr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, q.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, rs.checkDataTypes)(c, r, a.opts.strictNumbers, rs.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Vs.getSubschema)(this.it, t);
    (0, Vs.extendSubschemaData)(n, this.it, t), (0, Vs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Zg(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = $t.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = $t.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
et.KeywordCxt = Vu;
function Fu(e, t, r, n) {
  const s = new Vu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, nn.funcKeywordCode)(s, r) : "macro" in r ? (0, nn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, nn.funcKeywordCode)(s, r);
}
const d_ = /^\/(?:[^~]|~0|~1)*$/, f_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function zu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return B.default.rootData;
  if (e[0] === "/") {
    if (!d_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = B.default.rootData;
  } else {
    const d = f_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, q._)`${a}${(0, q.getProperty)((0, $t.unescapeJsonPointer)(d))}`, o = (0, q._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
et.getData = zu;
var yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
class h_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
yn.default = h_;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
const Fs = be;
class m_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Fs.resolveUrl)(t, r, n), this.missingSchema = (0, Fs.normalizeId)((0, Fs.getFullPath)(t, this.missingRef));
  }
}
Lr.default = m_;
var Ve = {};
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.resolveSchema = Ve.getCompilingSchema = Ve.resolveRef = Ve.compileSchema = Ve.SchemaEnv = void 0;
const Xe = ee, p_ = yn, Zt = ut, Qe = be, mc = C, y_ = et;
class gs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Qe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Ve.SchemaEnv = gs;
function Do(e) {
  const t = Uu.call(this, e);
  if (t)
    return t;
  const r = (0, Qe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Xe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: p_.default,
    code: (0, Xe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Zt.default.data,
    parentData: Zt.default.parentData,
    parentDataProperty: Zt.default.parentDataProperty,
    dataNames: [Zt.default.data],
    dataPathArr: [Xe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Xe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Xe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Xe._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, y_.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Zt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Zt.default.self}`, `${Zt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Xe.Name ? void 0 : w,
        items: _ instanceof Xe.Name ? void 0 : _,
        dynamicProps: w instanceof Xe.Name,
        dynamicItems: _ instanceof Xe.Name
      }, g.source && (g.source.evaluated = (0, Xe.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ve.compileSchema = Do;
function $_(e, t, r) {
  var n;
  r = (0, Qe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = v_.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new gs({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = g_.call(this, a);
}
Ve.resolveRef = $_;
function g_(e) {
  return (0, Qe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Do.call(this, e);
}
function Uu(e) {
  for (const t of this._compilations)
    if (__(t, e))
      return t;
}
Ve.getCompilingSchema = Uu;
function __(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function v_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || _s.call(this, e, t);
}
function _s(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Qe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Qe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return zs.call(this, r, e);
  const a = (0, Qe.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = _s.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : zs.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Do.call(this, o), a === (0, Qe.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, Qe.resolveUrl)(this.opts.uriResolver, s, d)), new gs({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return zs.call(this, r, o);
  }
}
Ve.resolveSchema = _s;
const w_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function zs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, mc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !w_.has(l) && d && (t = (0, Qe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, mc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Qe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = _s.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new gs({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const E_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", b_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", S_ = "object", P_ = [
  "$data"
], N_ = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, R_ = !1, O_ = {
  $id: E_,
  description: b_,
  type: S_,
  required: P_,
  properties: N_,
  additionalProperties: R_
};
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const qu = Zl;
qu.code = 'require("ajv/dist/runtime/uri").default';
Mo.default = qu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = et;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ee;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = yn, s = Lr, a = ur, o = Ve, l = ee, c = be, d = ge, u = C, h = O_, E = Mo, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, v = 200;
  function N(P) {
    var p, S, y, i, f, b, I, j, F, V, ne, Fe, Mt, Lt, Vt, Ft, zt, Ut, qt, Kt, Gt, Ht, Wt, Bt, Xt;
    const He = P.strict, Jt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Ur = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, qr = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : g, Rs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : He) !== null && b !== void 0 ? b : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : He) !== null && j !== void 0 ? j : !0,
      strictTypes: (V = (F = P.strictTypes) !== null && F !== void 0 ? F : He) !== null && V !== void 0 ? V : "log",
      strictTuples: (Fe = (ne = P.strictTuples) !== null && ne !== void 0 ? ne : He) !== null && Fe !== void 0 ? Fe : "log",
      strictRequired: (Lt = (Mt = P.strictRequired) !== null && Mt !== void 0 ? Mt : He) !== null && Lt !== void 0 ? Lt : !1,
      code: P.code ? { ...P.code, optimize: Ur, regExp: qr } : { optimize: Ur, regExp: qr },
      loopRequired: (Vt = P.loopRequired) !== null && Vt !== void 0 ? Vt : v,
      loopEnum: (Ft = P.loopEnum) !== null && Ft !== void 0 ? Ft : v,
      meta: (zt = P.meta) !== null && zt !== void 0 ? zt : !0,
      messages: (Ut = P.messages) !== null && Ut !== void 0 ? Ut : !0,
      inlineRefs: (qt = P.inlineRefs) !== null && qt !== void 0 ? qt : !0,
      schemaId: (Kt = P.schemaId) !== null && Kt !== void 0 ? Kt : "$id",
      addUsedSchema: (Gt = P.addUsedSchema) !== null && Gt !== void 0 ? Gt : !0,
      validateSchema: (Ht = P.validateSchema) !== null && Ht !== void 0 ? Ht : !0,
      validateFormats: (Wt = P.validateFormats) !== null && Wt !== void 0 ? Wt : !0,
      unicodeRegExp: (Bt = P.unicodeRegExp) !== null && Bt !== void 0 ? Bt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Rs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, $, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(S);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, S) {
      const y = this._addSchema(p, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, S);
      async function i(V, ne) {
        await f.call(this, V.$schema);
        const Fe = this._addSchema(V, ne);
        return Fe.validate || b.call(this, Fe);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function b(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return I.call(this, ne), await j.call(this, ne.missingSchema), b.call(this, V);
        }
      }
      function I({ missingSchema: V, missingRef: ne }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${ne} cannot be resolved`);
      }
      async function j(V) {
        const ne = await F.call(this, V);
        this.refs[V] || await f.call(this, ne.$schema), this.refs[V] || this.addSchema(ne, V, S);
      }
      async function F(V) {
        const ne = this._loading[V];
        if (ne)
          return ne;
        try {
          return await (this._loading[V] = y(V));
        } finally {
          delete this._loading[V];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, y = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let y;
      if (typeof p == "string")
        y = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, y, S), !S)
        return (0, u.eachItem)(y, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)(y, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((b) => k.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const y of S.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const I of f)
          b = b[I];
        for (const I in y) {
          const j = y[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, V = b[I];
          F && V && (b[I] = M(V));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const y in p) {
        const i = p[y];
        (!S || S.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, S, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        b = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(b || y);
      const F = c.getSchemaRefs.call(this, p, y);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: y, localRefs: F }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), i && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function X() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function de() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function he(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function ye() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!se.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? L.call(this, b, I, p.before) : b.rules.push(I), f.all[P] = I, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function L(P, p, S) {
    const y = P.rules.findIndex((i) => i.keyword === S);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, G] };
  }
})(uu);
var Lo = {}, Vo = {}, Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const I_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Fo.default = I_;
var dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.callRef = dr.getValidate = void 0;
const T_ = Lr, pc = re, Le = ee, yr = ut, yc = Ve, Rn = C, j_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = yc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new T_.default(n.opts.uriResolver, s, r);
    if (u instanceof yc.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (a === d)
        return Wn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return Wn(e, (0, Le._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = Ku(e, w);
      Wn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Le.stringify)(w) } : { ref: w }), $ = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Le.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function Ku(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Le._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
dr.getValidate = Ku;
function Wn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? yr.default.this : Le.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Le._)`await ${(0, pc.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Le._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, pc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Le._)`${w}.errors`;
    s.assign(yr.default.vErrors, (0, Le._)`${yr.default.vErrors} === null ? ${_} : ${yr.default.vErrors}.concat(${_})`), s.assign(yr.default.errors, (0, Le._)`${yr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const $ = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = Rn.mergeEvaluated.props(s, $.props, a.props));
      else {
        const m = s.var("props", (0, Le._)`${w}.evaluated.props`);
        a.props = Rn.mergeEvaluated.props(s, m, a.props, Le.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = Rn.mergeEvaluated.items(s, $.items, a.items));
      else {
        const m = s.var("items", (0, Le._)`${w}.evaluated.items`);
        a.items = Rn.mergeEvaluated.items(s, m, a.items, Le.Name);
      }
  }
}
dr.callRef = Wn;
dr.default = j_;
Object.defineProperty(Vo, "__esModule", { value: !0 });
const k_ = Fo, A_ = dr, C_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  k_.default,
  A_.default
];
Vo.default = C_;
var zo = {}, Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const ns = ee, Nt = ns.operators, ss = {
  maximum: { okStr: "<=", ok: Nt.LTE, fail: Nt.GT },
  minimum: { okStr: ">=", ok: Nt.GTE, fail: Nt.LT },
  exclusiveMaximum: { okStr: "<", ok: Nt.LT, fail: Nt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Nt.GT, fail: Nt.LTE }
}, D_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, ns.str)`must be ${ss[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ns._)`{comparison: ${ss[e].okStr}, limit: ${t}}`
}, M_ = {
  keyword: Object.keys(ss),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: D_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ns._)`${r} ${ss[t].fail} ${n} || isNaN(${r})`);
  }
};
Uo.default = M_;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
const sn = ee, L_ = {
  message: ({ schemaCode: e }) => (0, sn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, sn._)`{multipleOf: ${e}}`
}, V_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: L_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, sn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, sn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, sn._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
qo.default = V_;
var Ko = {}, Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
function Gu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Go.default = Gu;
Gu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ko, "__esModule", { value: !0 });
const nr = ee, F_ = C, z_ = Go, U_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, nr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, nr._)`{limit: ${e}}`
}, q_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: U_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? nr.operators.GT : nr.operators.LT, o = s.opts.unicode === !1 ? (0, nr._)`${r}.length` : (0, nr._)`${(0, F_.useFunc)(e.gen, z_.default)}(${r})`;
    e.fail$data((0, nr._)`${o} ${a} ${n}`);
  }
};
Ko.default = q_;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const K_ = re, as = ee, G_ = {
  message: ({ schemaCode: e }) => (0, as.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, as._)`{pattern: ${e}}`
}, H_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: G_,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, as._)`(new RegExp(${s}, ${o}))` : (0, K_.usePattern)(e, n);
    e.fail$data((0, as._)`!${l}.test(${t})`);
  }
};
Ho.default = H_;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const an = ee, W_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, an.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, an._)`{limit: ${e}}`
}, B_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: W_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? an.operators.GT : an.operators.LT;
    e.fail$data((0, an._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Wo.default = B_;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Br = re, on = ee, X_ = C, J_ = {
  message: ({ params: { missingProperty: e } }) => (0, on.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, on._)`{missingProperty: ${e}}`
}, Y_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: J_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${$}" (strictRequired)`;
          (0, X_.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(on.nil, h);
      else
        for (const g of r)
          (0, Br.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, Br.checkMissingProp)(e, r, g)), (0, Br.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Br.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, Br.propertyInData)(t, s, g, l.ownProperties)), t.if((0, on.not)(w), () => {
          e.error(), t.break();
        });
      }, on.nil);
    }
  }
};
Bo.default = Y_;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const cn = ee, Z_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, cn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, cn._)`{limit: ${e}}`
}, Q_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Z_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? cn.operators.GT : cn.operators.LT;
    e.fail$data((0, cn._)`${r}.length ${s} ${n}`);
  }
};
Xo.default = Q_;
var Jo = {}, $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
const Hu = us;
Hu.code = 'require("ajv/dist/runtime/equal").default';
$n.default = Hu;
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Us = ge, we = ee, x_ = C, ev = $n, tv = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, rv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: tv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Us.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, we._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, we._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, we._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const $ = t.name("item"), m = (0, Us.checkDataTypes)(d, $, l.opts.strictNumbers, Us.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${w}--;`, () => {
        t.let($, (0, we._)`${r}[${w}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${$} == "string"`, (0, we._)`${$} += "_"`), t.if((0, we._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(_, (0, we._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${$}] = ${w}`);
      });
    }
    function g(w, _) {
      const $ = (0, x_.useFunc)(t, ev.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${w}--;`, () => t.for((0, we._)`${_} = ${w}; ${_}--;`, () => t.if((0, we._)`${$}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Jo.default = rv;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const ma = ee, nv = C, sv = $n, av = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ma._)`{allowedValue: ${e}}`
}, ov = {
  keyword: "const",
  $data: !0,
  error: av,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ma._)`!${(0, nv.useFunc)(t, sv.default)}(${r}, ${s})`) : e.fail((0, ma._)`${a} !== ${r}`);
  }
};
Yo.default = ov;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Zr = ee, iv = C, cv = $n, lv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Zr._)`{allowedValues: ${e}}`
}, uv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: lv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, iv.useFunc)(t, cv.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, Zr.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, Zr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, Zr._)`${d()}(${r}, ${g}[${w}])` : (0, Zr._)`${r} === ${_}`;
    }
  }
};
Zo.default = uv;
Object.defineProperty(zo, "__esModule", { value: !0 });
const dv = Uo, fv = qo, hv = Ko, mv = Ho, pv = Wo, yv = Bo, $v = Xo, gv = Jo, _v = Yo, vv = Zo, wv = [
  // number
  dv.default,
  fv.default,
  // string
  hv.default,
  mv.default,
  // object
  pv.default,
  yv.default,
  // array
  $v.default,
  gv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  _v.default,
  vv.default
];
zo.default = wv;
var Qo = {}, Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.validateAdditionalItems = void 0;
const sr = ee, pa = C, Ev = {
  message: ({ params: { len: e } }) => (0, sr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sr._)`{limit: ${e}}`
}, bv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Ev,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, pa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Wu(e, n);
  }
};
function Wu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, sr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, sr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, pa.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, sr._)`${l} <= ${t.length}`);
    r.if((0, sr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: pa.Type.Num }, d), o.allErrors || r.if((0, sr.not)(d), () => r.break());
    });
  }
}
Vr.validateAdditionalItems = Wu;
Vr.default = bv;
var xo = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.validateTuple = void 0;
const $c = ee, Bn = C, Sv = re, Pv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Bu(e, "additionalItems", t);
    r.items = !0, !(0, Bn.alwaysValidSchema)(r, t) && e.ok((0, Sv.validateArray)(e));
  }
};
function Bu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Bn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, $c._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Bn.alwaysValidSchema)(l, h) || (n.if((0, $c._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const $ = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Bn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Fr.validateTuple = Bu;
Fr.default = Pv;
Object.defineProperty(xo, "__esModule", { value: !0 });
const Nv = Fr, Rv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Nv.validateTuple)(e, "items")
};
xo.default = Rv;
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const gc = ee, Ov = C, Iv = re, Tv = Vr, jv = {
  message: ({ params: { len: e } }) => (0, gc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, gc._)`{limit: ${e}}`
}, kv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: jv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Ov.alwaysValidSchema)(n, t) && (s ? (0, Tv.validateAdditionalItems)(e, s) : e.ok((0, Iv.validateArray)(e)));
  }
};
ei.default = kv;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const Ge = ee, On = C, Av = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ge.str)`must contain at least ${e} valid item(s)` : (0, Ge.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ge._)`{minContains: ${e}}` : (0, Ge._)`{minContains: ${e}, maxContains: ${t}}`
}, Cv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Av,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Ge._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, On.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, On.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, On.alwaysValidSchema)(a, r)) {
      let _ = (0, Ge._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Ge._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ge._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), $ = t.let("count", 0);
      g(_, () => t.if(_, () => w($)));
    }
    function g(_, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: On.Type.Num,
          compositeRule: !0
        }, _), $();
      });
    }
    function w(_) {
      t.code((0, Ge._)`${_}++`), l === void 0 ? t.if((0, Ge._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ge._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ge._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
ti.default = Cv;
var Xu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ee, r = C, n = re;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : u;
      E[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: E, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated($, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Xu);
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const Ju = ee, Dv = C, Mv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ju._)`{propertyName: ${e.propertyName}}`
}, Lv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Mv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Dv.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Ju.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ri.default = Lv;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
const In = re, Ye = ee, Vv = ut, Tn = C, Fv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ye._)`{additionalProperty: ${e.additionalProperty}}`
}, zv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Fv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Tn.alwaysValidSchema)(o, r))
      return;
    const d = (0, In.allSchemaProperties)(n.properties), u = (0, In.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ye._)`${a} === ${Vv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? w($) : t.if(E($), () => w($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const v = (0, Tn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, In.isOwnProperty)(t, v, $);
      } else d.length ? m = (0, Ye.or)(...d.map((v) => (0, Ye._)`${$} === ${v}`)) : m = Ye.nil;
      return u.length && (m = (0, Ye.or)(m, ...u.map((v) => (0, Ye._)`${(0, In.usePattern)(e, v)}.test(${$})`))), (0, Ye.not)(m);
    }
    function g($) {
      t.code((0, Ye._)`delete ${s}[${$}]`);
    }
    function w($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Tn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_($, m, !1), t.if((0, Ye.not)(m), () => {
          e.reset(), g($);
        })) : (_($, m), l || t.if((0, Ye.not)(m), () => t.break()));
      }
    }
    function _($, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: Tn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
vs.default = zv;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const Uv = et, _c = re, qs = C, vc = vs, qv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && vc.default.code(new Uv.KeywordCxt(a, vc.default, "additionalProperties"));
    const o = (0, _c.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = qs.mergeEvaluated.props(t, (0, qs.toHash)(o), a.props));
    const l = o.filter((h) => !(0, qs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, _c.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
ni.default = qv;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const wc = re, jn = ee, Ec = C, bc = C, Kv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, wc.allSchemaProperties)(r), c = l.filter((_) => (0, Ec.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof jn.Name) && (a.props = (0, bc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const $ in d)
        new RegExp(_).test($) && (0, Ec.checkStrictMode)(a, `property ${$} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, ($) => {
        t.if((0, jn._)`${(0, wc.usePattern)(e, _)}.test(${$})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: $,
            dataPropType: bc.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, jn._)`${h}[${$}]`, !0) : !m && !a.allErrors && t.if((0, jn.not)(u), () => t.break());
        });
      });
    }
  }
};
si.default = Kv;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const Gv = C, Hv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Gv.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ai.default = Hv;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const Wv = re, Bv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Wv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
oi.default = Bv;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const Xn = ee, Xv = C, Jv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Xn._)`{passingSchemas: ${e.passing}}`
}, Yv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Jv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let E;
        (0, Xv.alwaysValidSchema)(s, u) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Xn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Xn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), E && e.mergeEvaluated(E, Xn.Name);
        });
      });
    }
  }
};
ii.default = Yv;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const Zv = C, Qv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Zv.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ci.default = Qv;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const os = ee, Yu = C, xv = {
  message: ({ params: e }) => (0, os.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, os._)`{failingKeyword: ${e.ifClause}}`
}, ew = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: xv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Yu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Sc(n, "then"), a = Sc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, os.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, os._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Sc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Yu.alwaysValidSchema)(e, r);
}
li.default = ew;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const tw = C, rw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, tw.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ui.default = rw;
Object.defineProperty(Qo, "__esModule", { value: !0 });
const nw = Vr, sw = xo, aw = Fr, ow = ei, iw = ti, cw = Xu, lw = ri, uw = vs, dw = ni, fw = si, hw = ai, mw = oi, pw = ii, yw = ci, $w = li, gw = ui;
function _w(e = !1) {
  const t = [
    // any
    hw.default,
    mw.default,
    pw.default,
    yw.default,
    $w.default,
    gw.default,
    // object
    lw.default,
    uw.default,
    cw.default,
    dw.default,
    fw.default
  ];
  return e ? t.push(sw.default, ow.default) : t.push(nw.default, aw.default), t.push(iw.default), t;
}
Qo.default = _w;
var di = {}, fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const pe = ee, vw = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, ww = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: vw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, pe._)`${w}[${o}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign($, (0, pe._)`${_}.type || "string"`).assign(m, (0, pe._)`${_}.validate`), () => r.assign($, (0, pe._)`"string"`).assign(m, _)), e.fail$data((0, pe.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? pe.nil : (0, pe._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, pe._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, O = (0, pe._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, pe._)`${m} && ${m} !== true && ${$} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, $, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, pe.regexpCode)(O) : c.code.formats ? (0, pe._)`${c.code.formats}${(0, pe.getProperty)(a)}` : void 0, X = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, pe._)`${X}.validate`] : ["string", O, X];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, pe._)`${m}(${n})` : (0, pe._)`${m}.test(${n})`;
      }
    }
  }
};
fi.default = ww;
Object.defineProperty(di, "__esModule", { value: !0 });
const Ew = fi, bw = [Ew.default];
di.default = bw;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.contentVocabulary = jr.metadataVocabulary = void 0;
jr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
jr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Sw = Vo, Pw = zo, Nw = Qo, Rw = di, Pc = jr, Ow = [
  Sw.default,
  Pw.default,
  (0, Nw.default)(),
  Rw.default,
  Pc.metadataVocabulary,
  Pc.contentVocabulary
];
Lo.default = Ow;
var hi = {}, ws = {};
Object.defineProperty(ws, "__esModule", { value: !0 });
ws.DiscrError = void 0;
var Nc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Nc || (ws.DiscrError = Nc = {}));
Object.defineProperty(hi, "__esModule", { value: !0 });
const _r = ee, ya = ws, Rc = Ve, Iw = Lr, Tw = C, jw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ya.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, _r._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, kw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: jw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, _r._)`${r}${(0, _r.getProperty)(l)}`);
    t.if((0, _r._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: ya.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, _r._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: ya.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, _r.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let $ = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, Tw.schemaHasRulesButRef)(O, a.self.RULES)) {
          const X = O.$ref;
          if (O = Rc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), O instanceof Rc.SchemaEnv && (O = O.schema), O === void 0)
            throw new Iw.default(a.opts.uriResolver, a.baseId, X);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (_ || m(O)), v(K, R);
      }
      if (!$)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
hi.default = kw;
const Aw = "http://json-schema.org/draft-07/schema#", Cw = "http://json-schema.org/draft-07/schema#", Dw = "Core schema meta-schema", Mw = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Lw = [
  "object",
  "boolean"
], Vw = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Fw = {
  $schema: Aw,
  $id: Cw,
  title: Dw,
  definitions: Mw,
  type: Lw,
  properties: Vw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = uu, n = Lo, s = hi, a = Fw, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = et;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = ee;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = yn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Lr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(la, la.exports);
var zw = la.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = zw, r = ee, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: c }) => (0, r.str)`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: E } = l, { opts: g, self: w } = E;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(E, w.RULES.all.format.definition, "format");
      _.$data ? $() : m();
      function $() {
        const N = c.scopeValue("formats", {
          ref: w.formats,
          code: g.code.formats
        }), R = c.const("fmt", (0, r._)`${N}[${_.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, v(R)));
      }
      function m() {
        const N = _.schema, R = w.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const O = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        l.fail$data(v(O));
      }
      function v(N) {
        return (0, r._)`${N}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = o;
})(lu);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = cu, n = lu, s = ee, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, a), d;
    const [h, E] = u.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], g = u.formats || r.formatNames;
    return c(d, g, h, E), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const E = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function c(d, u, h, E) {
    var g, w;
    (g = (w = d.opts.code).formats) !== null && g !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(ca, ca.exports);
var Uw = ca.exports;
const qw = /* @__PURE__ */ cl(Uw), Kw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Gw(s, a) && n || Object.defineProperty(e, r, a);
}, Gw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Hw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Ww = (e, t) => `/* Wrapped ${e}*/
${t}`, Bw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Xw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Jw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Ww.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Xw);
  const { writable: a, enumerable: o, configurable: l } = Bw;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: l });
};
function Yw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Kw(e, t, s, r);
  return Hw(e, t), Jw(e, t, n), e;
}
const Oc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, l, c;
  const d = function(...u) {
    const h = this, E = () => {
      o = void 0, l && (clearTimeout(l), l = void 0), a && (c = e.apply(h, u));
    }, g = () => {
      l = void 0, o && (clearTimeout(o), o = void 0), a && (c = e.apply(h, u));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(g, n)), w && (c = e.apply(h, u)), c;
  };
  return Yw(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var $a = { exports: {} };
const Zw = "2.0.0", Zu = 256, Qw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, xw = 16, eE = Zu - 6, tE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Es = {
  MAX_LENGTH: Zu,
  MAX_SAFE_COMPONENT_LENGTH: xw,
  MAX_SAFE_BUILD_LENGTH: eE,
  MAX_SAFE_INTEGER: Qw,
  RELEASE_TYPES: tE,
  SEMVER_SPEC_VERSION: Zw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const rE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var bs = rE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Es, a = bs;
  t = e.exports = {};
  const o = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], w = ($) => {
    for (const [m, v] of g)
      $ = $.split(`${m}*`).join(`${m}{0,${v}}`).split(`${m}+`).join(`${m}{1,${v}}`);
    return $;
  }, _ = ($, m, v) => {
    const N = w(m), R = h++;
    a($, R, m), u[$] = R, c[R] = m, d[R] = N, o[R] = new RegExp(m, v ? "g" : void 0), l[R] = new RegExp(N, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${E}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})($a, $a.exports);
var gn = $a.exports;
const nE = Object.freeze({ loose: !0 }), sE = Object.freeze({}), aE = (e) => e ? typeof e != "object" ? nE : e : sE;
var mi = aE;
const Ic = /^[0-9]+$/, Qu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Ic.test(e), n = Ic.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, oE = (e, t) => Qu(t, e);
var xu = {
  compareIdentifiers: Qu,
  rcompareIdentifiers: oE
};
const kn = bs, { MAX_LENGTH: Tc, MAX_SAFE_INTEGER: An } = Es, { safeRe: Cn, t: Dn } = gn, iE = mi, { compareIdentifiers: Ks } = xu;
let cE = class nt {
  constructor(t, r) {
    if (r = iE(r), t instanceof nt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Tc)
      throw new TypeError(
        `version is longer than ${Tc} characters`
      );
    kn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Cn[Dn.LOOSE] : Cn[Dn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > An || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > An || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > An || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < An)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (kn("SemVer.compare", this.version, this.options, t), !(t instanceof nt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new nt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof nt || (t = new nt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof nt || (t = new nt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (kn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ks(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof nt || (t = new nt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (kn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ks(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Cn[Dn.PRERELEASELOOSE] : Cn[Dn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), Ks(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ae = cE;
const jc = Ae, lE = (e, t, r = !1) => {
  if (e instanceof jc)
    return e;
  try {
    return new jc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var zr = lE;
const uE = zr, dE = (e, t) => {
  const r = uE(e, t);
  return r ? r.version : null;
};
var fE = dE;
const hE = zr, mE = (e, t) => {
  const r = hE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var pE = mE;
const kc = Ae, yE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new kc(
      e instanceof kc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var $E = yE;
const Ac = zr, gE = (e, t) => {
  const r = Ac(e, null, !0), n = Ac(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, l = a ? n : r, c = !!o.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(o) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var _E = gE;
const vE = Ae, wE = (e, t) => new vE(e, t).major;
var EE = wE;
const bE = Ae, SE = (e, t) => new bE(e, t).minor;
var PE = SE;
const NE = Ae, RE = (e, t) => new NE(e, t).patch;
var OE = RE;
const IE = zr, TE = (e, t) => {
  const r = IE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var jE = TE;
const Cc = Ae, kE = (e, t, r) => new Cc(e, r).compare(new Cc(t, r));
var tt = kE;
const AE = tt, CE = (e, t, r) => AE(t, e, r);
var DE = CE;
const ME = tt, LE = (e, t) => ME(e, t, !0);
var VE = LE;
const Dc = Ae, FE = (e, t, r) => {
  const n = new Dc(e, r), s = new Dc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var pi = FE;
const zE = pi, UE = (e, t) => e.sort((r, n) => zE(r, n, t));
var qE = UE;
const KE = pi, GE = (e, t) => e.sort((r, n) => KE(n, r, t));
var HE = GE;
const WE = tt, BE = (e, t, r) => WE(e, t, r) > 0;
var Ss = BE;
const XE = tt, JE = (e, t, r) => XE(e, t, r) < 0;
var yi = JE;
const YE = tt, ZE = (e, t, r) => YE(e, t, r) === 0;
var ed = ZE;
const QE = tt, xE = (e, t, r) => QE(e, t, r) !== 0;
var td = xE;
const eb = tt, tb = (e, t, r) => eb(e, t, r) >= 0;
var $i = tb;
const rb = tt, nb = (e, t, r) => rb(e, t, r) <= 0;
var gi = nb;
const sb = ed, ab = td, ob = Ss, ib = $i, cb = yi, lb = gi, ub = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return sb(e, r, n);
    case "!=":
      return ab(e, r, n);
    case ">":
      return ob(e, r, n);
    case ">=":
      return ib(e, r, n);
    case "<":
      return cb(e, r, n);
    case "<=":
      return lb(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var rd = ub;
const db = Ae, fb = zr, { safeRe: Mn, t: Ln } = gn, hb = (e, t) => {
  if (e instanceof db)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Mn[Ln.COERCEFULL] : Mn[Ln.COERCE]);
  else {
    const c = t.includePrerelease ? Mn[Ln.COERCERTLFULL] : Mn[Ln.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return fb(`${n}.${s}.${a}${o}${l}`, t);
};
var mb = hb;
class pb {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var yb = pb, Gs, Mc;
function rt() {
  if (Mc) return Gs;
  Mc = 1;
  const e = /\s+/g;
  class t {
    constructor(k, L) {
      if (L = s(L), k instanceof t)
        return k.loose === !!L.loose && k.includePrerelease === !!L.includePrerelease ? k : new t(k.raw, L);
      if (k instanceof a)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = L, this.loose = !!L.loose, this.includePrerelease = !!L.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((G) => !_(G[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && $(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let k = 0; k < this.set.length; k++) {
          k > 0 && (this.formatted += "||");
          const L = this.set[k];
          for (let D = 0; D < L.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += L[D].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(k) {
      const D = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + k, G = n.get(D);
      if (G)
        return G;
      const M = this.options.loose, P = M ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      k = k.replace(P, H(this.options.includePrerelease)), o("hyphen replace", k), k = k.replace(c[d.COMPARATORTRIM], u), o("comparator trim", k), k = k.replace(c[d.TILDETRIM], h), o("tilde trim", k), k = k.replace(c[d.CARETTRIM], E), o("caret trim", k);
      let p = k.split(" ").map((f) => v(f, this.options)).join(" ").split(/\s+/).map((f) => z(f, this.options));
      M && (p = p.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), o("range list", p);
      const S = /* @__PURE__ */ new Map(), y = p.map((f) => new a(f, this.options));
      for (const f of y) {
        if (_(f))
          return [f];
        S.set(f.value, f);
      }
      S.size > 1 && S.has("") && S.delete("");
      const i = [...S.values()];
      return n.set(D, i), i;
    }
    intersects(k, L) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => m(D, L) && k.set.some((G) => m(G, L) && D.every((M) => G.every((P) => M.intersects(P, L)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new l(k, this.options);
        } catch {
          return !1;
        }
      for (let L = 0; L < this.set.length; L++)
        if (se(this.set[L], k, this.options))
          return !0;
      return !1;
    }
  }
  Gs = t;
  const r = yb, n = new r(), s = mi, a = Ps(), o = bs, l = Ae, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = gn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = Es, _ = (T) => T.value === "<0.0.0-0", $ = (T) => T.value === "", m = (T, k) => {
    let L = !0;
    const D = T.slice();
    let G = D.pop();
    for (; L && D.length; )
      L = D.every((M) => G.intersects(M, k)), G = D.pop();
    return L;
  }, v = (T, k) => (T = T.replace(c[d.BUILD], ""), o("comp", T, k), T = K(T, k), o("caret", T), T = R(T, k), o("tildes", T), T = de(T, k), o("xrange", T), T = ye(T, k), o("stars", T), T), N = (T) => !T || T.toLowerCase() === "x" || T === "*", R = (T, k) => T.trim().split(/\s+/).map((L) => O(L, k)).join(" "), O = (T, k) => {
    const L = k.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return T.replace(L, (D, G, M, P, p) => {
      o("tilde", T, D, G, M, P, p);
      let S;
      return N(G) ? S = "" : N(M) ? S = `>=${G}.0.0 <${+G + 1}.0.0-0` : N(P) ? S = `>=${G}.${M}.0 <${G}.${+M + 1}.0-0` : p ? (o("replaceTilde pr", p), S = `>=${G}.${M}.${P}-${p} <${G}.${+M + 1}.0-0`) : S = `>=${G}.${M}.${P} <${G}.${+M + 1}.0-0`, o("tilde return", S), S;
    });
  }, K = (T, k) => T.trim().split(/\s+/).map((L) => X(L, k)).join(" "), X = (T, k) => {
    o("caret", T, k);
    const L = k.loose ? c[d.CARETLOOSE] : c[d.CARET], D = k.includePrerelease ? "-0" : "";
    return T.replace(L, (G, M, P, p, S) => {
      o("caret", T, G, M, P, p, S);
      let y;
      return N(M) ? y = "" : N(P) ? y = `>=${M}.0.0${D} <${+M + 1}.0.0-0` : N(p) ? M === "0" ? y = `>=${M}.${P}.0${D} <${M}.${+P + 1}.0-0` : y = `>=${M}.${P}.0${D} <${+M + 1}.0.0-0` : S ? (o("replaceCaret pr", S), M === "0" ? P === "0" ? y = `>=${M}.${P}.${p}-${S} <${M}.${P}.${+p + 1}-0` : y = `>=${M}.${P}.${p}-${S} <${M}.${+P + 1}.0-0` : y = `>=${M}.${P}.${p}-${S} <${+M + 1}.0.0-0`) : (o("no pr"), M === "0" ? P === "0" ? y = `>=${M}.${P}.${p}${D} <${M}.${P}.${+p + 1}-0` : y = `>=${M}.${P}.${p}${D} <${M}.${+P + 1}.0-0` : y = `>=${M}.${P}.${p} <${+M + 1}.0.0-0`), o("caret return", y), y;
    });
  }, de = (T, k) => (o("replaceXRanges", T, k), T.split(/\s+/).map((L) => he(L, k)).join(" ")), he = (T, k) => {
    T = T.trim();
    const L = k.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return T.replace(L, (D, G, M, P, p, S) => {
      o("xRange", T, D, G, M, P, p, S);
      const y = N(M), i = y || N(P), f = i || N(p), b = f;
      return G === "=" && b && (G = ""), S = k.includePrerelease ? "-0" : "", y ? G === ">" || G === "<" ? D = "<0.0.0-0" : D = "*" : G && b ? (i && (P = 0), p = 0, G === ">" ? (G = ">=", i ? (M = +M + 1, P = 0, p = 0) : (P = +P + 1, p = 0)) : G === "<=" && (G = "<", i ? M = +M + 1 : P = +P + 1), G === "<" && (S = "-0"), D = `${G + M}.${P}.${p}${S}`) : i ? D = `>=${M}.0.0${S} <${+M + 1}.0.0-0` : f && (D = `>=${M}.${P}.0${S} <${M}.${+P + 1}.0-0`), o("xRange return", D), D;
    });
  }, ye = (T, k) => (o("replaceStars", T, k), T.trim().replace(c[d.STAR], "")), z = (T, k) => (o("replaceGTE0", T, k), T.trim().replace(c[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), H = (T) => (k, L, D, G, M, P, p, S, y, i, f, b) => (N(D) ? L = "" : N(G) ? L = `>=${D}.0.0${T ? "-0" : ""}` : N(M) ? L = `>=${D}.${G}.0${T ? "-0" : ""}` : P ? L = `>=${L}` : L = `>=${L}${T ? "-0" : ""}`, N(y) ? S = "" : N(i) ? S = `<${+y + 1}.0.0-0` : N(f) ? S = `<${y}.${+i + 1}.0-0` : b ? S = `<=${y}.${i}.${f}-${b}` : T ? S = `<${y}.${i}.${+f + 1}-0` : S = `<=${S}`, `${L} ${S}`.trim()), se = (T, k, L) => {
    for (let D = 0; D < T.length; D++)
      if (!T[D].test(k))
        return !1;
    if (k.prerelease.length && !L.includePrerelease) {
      for (let D = 0; D < T.length; D++)
        if (o(T[D].semver), T[D].semver !== a.ANY && T[D].semver.prerelease.length > 0) {
          const G = T[D].semver;
          if (G.major === k.major && G.minor === k.minor && G.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Gs;
}
var Hs, Lc;
function Ps() {
  if (Lc) return Hs;
  Lc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, h) {
      if (h = r(h), u instanceof t) {
        if (u.loose === !!h.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), o("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = u.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new l(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Hs = t;
  const r = mi, { safeRe: n, t: s } = gn, a = rd, o = bs, l = Ae, c = rt();
  return Hs;
}
const $b = rt(), gb = (e, t, r) => {
  try {
    t = new $b(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ns = gb;
const _b = rt(), vb = (e, t) => new _b(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var wb = vb;
const Eb = Ae, bb = rt(), Sb = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new bb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new Eb(n, r));
  }), n;
};
var Pb = Sb;
const Nb = Ae, Rb = rt(), Ob = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new Rb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new Nb(n, r));
  }), n;
};
var Ib = Ob;
const Ws = Ae, Tb = rt(), Vc = Ss, jb = (e, t) => {
  e = new Tb(e, t);
  let r = new Ws("0.0.0");
  if (e.test(r) || (r = new Ws("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const l = new Ws(o.semver.version);
      switch (o.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || Vc(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Vc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var kb = jb;
const Ab = rt(), Cb = (e, t) => {
  try {
    return new Ab(e, t).range || "*";
  } catch {
    return null;
  }
};
var Db = Cb;
const Mb = Ae, nd = Ps(), { ANY: Lb } = nd, Vb = rt(), Fb = Ns, Fc = Ss, zc = yi, zb = gi, Ub = $i, qb = (e, t, r, n) => {
  e = new Mb(e, n), t = new Vb(t, n);
  let s, a, o, l, c;
  switch (r) {
    case ">":
      s = Fc, a = zb, o = zc, l = ">", c = ">=";
      break;
    case "<":
      s = zc, a = Ub, o = Fc, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Fb(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((g) => {
      g.semver === Lb && (g = new nd(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : o(g.semver, E.semver, n) && (E = g);
    }), h.operator === l || h.operator === c || (!E.operator || E.operator === l) && a(e, E.semver))
      return !1;
    if (E.operator === c && o(e, E.semver))
      return !1;
  }
  return !0;
};
var _i = qb;
const Kb = _i, Gb = (e, t, r) => Kb(e, t, ">", r);
var Hb = Gb;
const Wb = _i, Bb = (e, t, r) => Wb(e, t, "<", r);
var Xb = Bb;
const Uc = rt(), Jb = (e, t, r) => (e = new Uc(e, r), t = new Uc(t, r), e.intersects(t, r));
var Yb = Jb;
const Zb = Ns, Qb = tt;
var xb = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => Qb(u, h, r));
  for (const u of o)
    Zb(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === o[0] ? l.push("*") : h ? u === o[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const qc = rt(), vi = Ps(), { ANY: Bs } = vi, Xr = Ns, wi = tt, eS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new qc(e, r), t = new qc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = rS(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, tS = [new vi(">=0.0.0-0")], Kc = [new vi(">=0.0.0")], rS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Bs) {
    if (t.length === 1 && t[0].semver === Bs)
      return !0;
    r.includePrerelease ? e = tS : e = Kc;
  }
  if (t.length === 1 && t[0].semver === Bs) {
    if (r.includePrerelease)
      return !0;
    t = Kc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = Gc(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = Hc(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = wi(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !Xr(g, String(s), r) || a && !Xr(g, String(a), r))
      return null;
    for (const w of t)
      if (!Xr(g, String(w), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (u = u || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (E && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === E.major && g.semver.minor === E.minor && g.semver.patch === E.patch && (E = !1), g.operator === ">" || g.operator === ">=") {
        if (l = Gc(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Xr(s.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = Hc(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Xr(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || E || h);
}, Gc = (e, t, r) => {
  if (!e)
    return t;
  const n = wi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Hc = (e, t, r) => {
  if (!e)
    return t;
  const n = wi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var nS = eS;
const Xs = gn, Wc = Es, sS = Ae, Bc = xu, aS = zr, oS = fE, iS = pE, cS = $E, lS = _E, uS = EE, dS = PE, fS = OE, hS = jE, mS = tt, pS = DE, yS = VE, $S = pi, gS = qE, _S = HE, vS = Ss, wS = yi, ES = ed, bS = td, SS = $i, PS = gi, NS = rd, RS = mb, OS = Ps(), IS = rt(), TS = Ns, jS = wb, kS = Pb, AS = Ib, CS = kb, DS = Db, MS = _i, LS = Hb, VS = Xb, FS = Yb, zS = xb, US = nS;
var qS = {
  parse: aS,
  valid: oS,
  clean: iS,
  inc: cS,
  diff: lS,
  major: uS,
  minor: dS,
  patch: fS,
  prerelease: hS,
  compare: mS,
  rcompare: pS,
  compareLoose: yS,
  compareBuild: $S,
  sort: gS,
  rsort: _S,
  gt: vS,
  lt: wS,
  eq: ES,
  neq: bS,
  gte: SS,
  lte: PS,
  cmp: NS,
  coerce: RS,
  Comparator: OS,
  Range: IS,
  satisfies: TS,
  toComparators: jS,
  maxSatisfying: kS,
  minSatisfying: AS,
  minVersion: CS,
  validRange: DS,
  outside: MS,
  gtr: LS,
  ltr: VS,
  intersects: FS,
  simplifyRange: zS,
  subset: US,
  SemVer: sS,
  re: Xs.re,
  src: Xs.src,
  tokens: Xs.t,
  SEMVER_SPEC_VERSION: Wc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Wc.RELEASE_TYPES,
  compareIdentifiers: Bc.compareIdentifiers,
  rcompareIdentifiers: Bc.rcompareIdentifiers
};
const $r = /* @__PURE__ */ cl(qS), KS = Object.prototype.toString, GS = "[object Uint8Array]", HS = "[object ArrayBuffer]";
function sd(e, t, r) {
  return e ? e.constructor === t ? !0 : KS.call(e) === r : !1;
}
function ad(e) {
  return sd(e, Uint8Array, GS);
}
function WS(e) {
  return sd(e, ArrayBuffer, HS);
}
function BS(e) {
  return ad(e) || WS(e);
}
function XS(e) {
  if (!ad(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function JS(e) {
  if (!BS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Js(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    XS(s), r.set(s, n), n += s.length;
  return r;
}
const Vn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Fn(e, t = "utf8") {
  return JS(e), Vn[t] ?? (Vn[t] = new globalThis.TextDecoder(t)), Vn[t].decode(e);
}
function YS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const ZS = new globalThis.TextEncoder();
function Ys(e) {
  return YS(e), ZS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Xc = "aes-256-cbc", od = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), QS = (e) => typeof e == "string" && od.has(e), ht = () => /* @__PURE__ */ Object.create(null), Jc = (e) => e !== void 0, Zs = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Ot = "__internal__", Qs = `${Ot}.migrations.version`;
var Tt, jt, ar, De, qe, or, ir, Rr, st, _e, id, cd, ld, ud, dd, fd, hd, md;
class xS {
  constructor(t = {}) {
    We(this, _e);
    fr(this, "path");
    fr(this, "events");
    We(this, Tt);
    We(this, jt);
    We(this, ar);
    We(this, De);
    We(this, qe, {});
    We(this, or, !1);
    We(this, ir);
    We(this, Rr);
    We(this, st);
    fr(this, "_deserialize", (t) => JSON.parse(t));
    fr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = dt(this, _e, id).call(this, t);
    Ce(this, De, r), dt(this, _e, cd).call(this, r), dt(this, _e, ud).call(this, r), dt(this, _e, dd).call(this, r), this.events = new EventTarget(), Ce(this, jt, r.encryptionKey), Ce(this, ar, r.encryptionAlgorithm ?? Xc), this.path = dt(this, _e, fd).call(this, r), dt(this, _e, hd).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (J(this, De).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Ot} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (Zs(a, o), J(this, De).accessPropertiesByDotNotation)
        _n(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, l] of Object.entries(a))
        s(o, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return J(this, De).accessPropertiesByDotNotation ? Ts(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Zs(t, r);
    const n = J(this, De).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Jc(J(this, qe)[r]) && this.set(r, J(this, qe)[r]);
  }
  delete(t) {
    const { store: r } = this;
    J(this, De).accessPropertiesByDotNotation ? bd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = ht();
    for (const r of Object.keys(J(this, qe)))
      Jc(J(this, qe)[r]) && (Zs(r, J(this, qe)[r]), J(this, De).accessPropertiesByDotNotation ? _n(t, r, J(this, qe)[r]) : t[r] = J(this, qe)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = Y.readFileSync(this.path, J(this, jt) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return J(this, or) || this._validate(o), Object.assign(ht(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), ht();
      if (J(this, De).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return ht();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Ts(t, Ot))
      try {
        const r = Y.readFileSync(this.path, J(this, jt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        Ts(s, Ot) && _n(t, Ot, Ri(s, Ot));
      } catch {
      }
    J(this, or) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    J(this, ir) && (J(this, ir).close(), Ce(this, ir, void 0)), J(this, Rr) && (Y.unwatchFile(this.path), Ce(this, Rr, !1)), Ce(this, st, void 0);
  }
  _decryptData(t) {
    const r = J(this, jt);
    if (!r)
      return typeof t == "string" ? t : Fn(t);
    const n = J(this, ar), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Fn(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = (g) => {
      if (s === 0)
        return { ciphertext: g };
      const w = g.length - s;
      if (w < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: g.slice(0, w),
        authenticationTag: g.slice(w)
      };
    }, d = t.slice(0, 16), u = t.slice(17), h = typeof u == "string" ? Ys(u) : u, E = (g) => {
      const { ciphertext: w, authenticationTag: _ } = c(h), $ = Kr.pbkdf2Sync(r, g, 1e4, 32, "sha512"), m = Kr.createDecipheriv(n, $, d);
      return _ && m.setAuthTag(_), Fn(Js([m.update(w), m.final()]));
    };
    try {
      return E(d);
    } catch {
      try {
        return E(d.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : Fn(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Pi(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Pi(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!J(this, Tt) || J(this, Tt).call(this, t) || !J(this, Tt).errors)
      return;
    const n = J(this, Tt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Y.mkdirSync(ae.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = J(this, jt);
    if (n) {
      const s = Kr.randomBytes(16), a = Kr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = Kr.createCipheriv(J(this, ar), a, s), l = Js([o.update(Ys(r)), o.final()]), c = [s, Ys(":"), l];
      J(this, ar) === "aes-256-gcm" && c.push(o.getAuthTag()), r = Js(c);
    }
    if (fe.env.SNAP)
      Y.writeFileSync(this.path, r, { mode: J(this, De).configFileMode });
    else
      try {
        il(this.path, r, { mode: J(this, De).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          Y.writeFileSync(this.path, r, { mode: J(this, De).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Y.existsSync(this.path) || this._write(ht()), fe.platform === "win32" || fe.platform === "darwin") {
      J(this, st) ?? Ce(this, st, Oc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ae.dirname(this.path), r = ae.basename(this.path);
      Ce(this, ir, Y.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof J(this, st) == "function" && J(this, st).call(this);
      }));
    } else
      J(this, st) ?? Ce(this, st, Oc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Y.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof J(this, st) == "function" && J(this, st).call(this);
      }), Ce(this, Rr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(Qs, "0.0.0");
    const a = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let o = structuredClone(this.store);
    for (const l of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: a
        });
        const c = t[l];
        c == null || c(this), this._set(Qs, l), s = l, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !$r.eq(s, r)) && this._set(Qs, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Ot || t.startsWith(`${Ot}.`);
  }
  _isVersionInRangeFormat(t) {
    return $r.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && $r.satisfies(r, t) ? !1 : $r.satisfies(n, t) : !($r.lte(t, r) || $r.gt(t, n));
  }
  _get(t, r) {
    return Ri(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    _n(n, t, r), this.store = n;
  }
}
Tt = new WeakMap(), jt = new WeakMap(), ar = new WeakMap(), De = new WeakMap(), qe = new WeakMap(), or = new WeakMap(), ir = new WeakMap(), Rr = new WeakMap(), st = new WeakMap(), _e = new WeakSet(), id = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = Xc), !QS(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...od].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = Rd(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, cd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = qw.default, n = new I0.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const s = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  Ce(this, Tt, n.compile(s)), dt(this, _e, ld).call(this, t.schema);
}, ld = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (J(this, qe)[n] = a);
  }
}, ud = function(t) {
  t.defaults && Object.assign(J(this, qe), t.defaults);
}, dd = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, fd = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ae.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, hd = function(t) {
  if (t.migrations) {
    dt(this, _e, md).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(ht(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Ni.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, md = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ce(this, or, !0);
    try {
      const s = this.store, a = Object.assign(ht(), t.defaults ?? {}, s);
      try {
        Ni.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Ce(this, or, !1);
    }
  }
};
const { app: Jn, ipcMain: ga, shell: eP } = xc;
let Yc = !1;
const Zc = () => {
  if (!ga || !Jn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Jn.getPath("userData"),
    appVersion: Jn.getVersion()
  };
  return Yc || (ga.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Yc = !0), e;
};
class tP extends xS {
  constructor(t) {
    let r, n;
    if (fe.type === "renderer") {
      const s = xc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ga && Jn && ({ defaultCwd: r, appVersion: n } = Zc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ae.isAbsolute(t.cwd) ? t.cwd : ae.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Zc();
  }
  async openInEditor() {
    const t = await eP.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
class rP {
  constructor() {
    fr(this, "store");
    this.store = new tP({
      name: "markdown-viewer-config",
      defaults: {
        customCSS: "",
        windowState: {
          width: 1200,
          height: 800,
          x: void 0,
          y: void 0,
          isMaximized: !1
        }
      }
    });
  }
  /**
   * カスタムCSSを取得
   */
  getCustomCSS() {
    return this.store.get("customCSS");
  }
  /**
   * ウィンドウ状態を取得
   */
  getWindowState() {
    return this.store.get("windowState");
  }
  /**
   * ウィンドウ状態を保存
   */
  setWindowState(t) {
    this.store.set("windowState", t);
  }
  /**
   * カスタムCSSを保存
   */
  setCustomCSS(t) {
    this.store.set("customCSS", t);
  }
}
function nP(e, t) {
  e.handle("get-custom-css", async () => t.getCustomCSS()), e.handle("set-custom-css", async (r, n) => (t.setCustomCSS(n), !0));
}
const sP = gd(import.meta.url), xs = _d(sP);
let oe = null;
const _a = new rP();
let va = null, Er = null;
function Qc() {
  const e = _a.getWindowState();
  oe = new el({
    width: e.width,
    height: e.height,
    x: e.x,
    y: e.y,
    webPreferences: {
      preload: Si(xs, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !0
    }
  }), e.isMaximized && oe.maximize();
  const t = process.env.VITE_DEV_SERVER_URL;
  if (console.log("🔍 VITE_DEV_SERVER_URL:", t), console.log("🔍 __dirname:", xs), t)
    console.log("📱 Loading from dev server:", t), oe.loadURL(t), oe.webContents.openDevTools();
  else {
    const n = Si(xs, "../dist/index.html");
    console.log("📦 Loading from file:", n), oe.loadFile(n);
  }
  oe.webContents.on("did-finish-load", async () => {
    va && oe && await oP(va, oe);
  });
  const r = () => {
    oe && !oe.isDestroyed() && _a.setWindowState({
      width: oe.getNormalBounds().width,
      height: oe.getNormalBounds().height,
      x: oe.getNormalBounds().x,
      y: oe.getNormalBounds().y,
      isMaximized: oe.isMaximized()
    });
  };
  oe.on("resize", r), oe.on("move", r), oe.on("maximize", r), oe.on("unmaximize", r), oe.on("closed", () => {
    oe = null;
  });
}
nP(is, _a);
is.handle("open-external", async (e, t) => {
  try {
    return await $d.openExternal(t), !0;
  } catch (r) {
    return console.error("Failed to open external URL:", r), !1;
  }
});
is.handle("reload-file", async () => {
  if (console.log("reload-file IPC handler called"), !Er)
    return console.log("No file to reload"), null;
  try {
    const t = (await import("fs")).statSync(Er), r = 10 * 1024 * 1024;
    if (t.size > r)
      throw new Error("ファイルサイズが大きすぎます（最大10MB）");
    const n = await wa(Er, "utf-8");
    return { filePath: Er, content: n };
  } catch (e) {
    throw console.error("File reload error:", e), e;
  }
});
is.handle("select-file", async () => {
  if (console.log("select-file IPC handler called"), !oe)
    return console.log("mainWindow is null"), null;
  console.log("Showing file dialog...");
  const e = await tl.showOpenDialog(oe, {
    properties: ["openFile"],
    filters: [
      { name: "Markdown", extensions: ["md", "markdown"] },
      { name: "Text", extensions: ["txt"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (console.log("Dialog result:", e), e.canceled || e.filePaths.length === 0)
    return console.log("User canceled or no files selected"), null;
  const t = e.filePaths[0];
  try {
    const n = (await import("fs")).statSync(t), s = 10 * 1024 * 1024;
    if (n.size > s)
      throw new Error("ファイルサイズが大きすぎます（最大10MB）");
    const a = await wa(t, "utf-8");
    return Er = t, { filePath: t, content: a };
  } catch (r) {
    throw console.error("File read error:", r), r;
  }
});
function aP() {
  const e = [
    {
      label: "ファイル",
      submenu: [
        {
          label: "ファイルを開く...",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            oe && oe.webContents.send("trigger-file-open");
          }
        },
        {
          label: "ファイルを再読み込み",
          accelerator: "CmdOrCtrl+R",
          click: async () => {
            oe && oe.webContents.send("trigger-file-reload");
          }
        },
        { type: "separator" },
        {
          label: "終了",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            ln.quit();
          }
        }
      ]
    },
    {
      label: "表示",
      submenu: [
        {
          label: "設定...",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            oe && oe.webContents.send("toggle-settings");
          }
        },
        { type: "separator" },
        { role: "forceReload", label: "ページを再読み込み" },
        { role: "toggleDevTools", label: "開発者ツール" },
        { type: "separator" },
        { role: "resetZoom", label: "実際のサイズ" },
        { role: "zoomIn", label: "拡大" },
        { role: "zoomOut", label: "縮小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "フルスクリーン" }
      ]
    },
    {
      label: "編集",
      submenu: [
        { role: "undo", label: "元に戻す" },
        { role: "redo", label: "やり直す" },
        { type: "separator" },
        { role: "cut", label: "切り取り" },
        { role: "copy", label: "コピー" },
        { role: "paste", label: "貼り付け" },
        { role: "selectAll", label: "すべて選択" }
      ]
    }
  ], t = bi.buildFromTemplate(e);
  bi.setApplicationMenu(t);
}
async function oP(e, t) {
  try {
    const r = vd(e);
    console.log("📄 Loading file from CLI:", r);
    const n = await wa(r, "utf-8");
    Er = r, t.webContents.send("load-file-from-cli", {
      filePath: r,
      content: n
    });
  } catch (r) {
    console.error("Failed to load file from CLI:", r), tl.showErrorBox(
      "ファイル読み込みエラー",
      `ファイルを開けませんでした: ${e}`
    );
  }
}
function iP() {
  const t = process.argv.slice(process.defaultApp ? 2 : 1).find(
    (r) => !r.startsWith("-") && (r.endsWith(".md") || r.endsWith(".markdown") || r.endsWith(".txt"))
  );
  t && (va = t, console.log("📋 File specified in CLI:", t));
}
ln.whenReady().then(() => {
  iP(), aP(), Qc(), ln.on("activate", () => {
    el.getAllWindows().length === 0 && Qc();
  });
});
ln.on("window-all-closed", () => {
  process.platform !== "darwin" && ln.quit();
});
