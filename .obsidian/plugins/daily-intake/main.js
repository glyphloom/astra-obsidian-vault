"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/sql.js/dist/sql-wasm.js
var require_sql_wasm = __commonJS({
  "node_modules/sql.js/dist/sql-wasm.js"(exports2, module2) {
    var initSqlJsPromise = void 0;
    var initSqlJs = function(moduleConfig) {
      if (initSqlJsPromise) {
        return initSqlJsPromise;
      }
      initSqlJsPromise = new Promise(function(resolveModule, reject) {
        var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
        var originalOnAbortFunction = Module["onAbort"];
        Module["onAbort"] = function(errorThatCausedAbort) {
          reject(new Error(errorThatCausedAbort));
          if (originalOnAbortFunction) {
            originalOnAbortFunction(errorThatCausedAbort);
          }
        };
        Module["postRun"] = Module["postRun"] || [];
        Module["postRun"].push(function() {
          resolveModule(Module);
        });
        module2 = void 0;
        var k;
        k || (k = typeof Module != "undefined" ? Module : {});
        var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope, ca = globalThis.process?.versions?.node && "renderer" != globalThis.process?.type;
        k.onRuntimeInitialized = function() {
          function a(f, l) {
            switch (typeof l) {
              case "boolean":
                dc(f, l ? 1 : 0);
                break;
              case "number":
                ec(f, l);
                break;
              case "string":
                fc(f, l, -1, -1);
                break;
              case "object":
                if (null === l) lb(f);
                else if (null != l.length) {
                  var n = da(l.length);
                  m.set(l, n);
                  gc(f, n, l.length, -1);
                  ea(n);
                } else va(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                break;
              default:
                lb(f);
            }
          }
          function b(f, l) {
            for (var n = [], p = 0; p < f; p += 1) {
              var r = t(l + 4 * p, "i32"), w = hc(r);
              if (1 === w || 2 === w) r = ic(r);
              else if (3 === w) r = jc(r);
              else if (4 === w) {
                w = r;
                r = kc(w);
                w = lc(w);
                for (var J = new Uint8Array(r), I = 0; I < r; I += 1) J[I] = m[w + I];
                r = J;
              } else r = null;
              n.push(r);
            }
            return n;
          }
          function c(f, l) {
            this.Qa = f;
            this.db = l;
            this.Oa = 1;
            this.mb = [];
          }
          function d(f, l) {
            this.db = l;
            this.fb = fa(f);
            if (null === this.fb) throw Error("Unable to allocate memory for the SQL string");
            this.lb = this.fb;
            this.$a = this.sb = null;
          }
          function e(f) {
            this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
            if (null != f) {
              var l = this.filename, n = "/", p = l;
              n && (n = "string" == typeof n ? n : ha(n), p = l ? ia(n + "/" + l) : n);
              l = ja(true, true);
              p = ka(
                p,
                l
              );
              if (f) {
                if ("string" == typeof f) {
                  n = Array(f.length);
                  for (var r = 0, w = f.length; r < w; ++r) n[r] = f.charCodeAt(r);
                  f = n;
                }
                ma(p, l | 146);
                n = na(p, 577);
                oa(n, f, 0, f.length, 0);
                pa(n);
                ma(p, l);
              }
            }
            this.handleError(q(this.filename, g));
            this.db = t(g, "i32");
            ob(this.db);
            this.gb = {};
            this.Sa = {};
          }
          var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), v = h("sqlite3_close_v2", "number", ["number"]), u = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h(
            "sqlite3_prepare_v2",
            "number",
            ["number", "string", "number", "number", "number"]
          ), pb = h("sqlite3_sql", "string", ["number"]), nc = h("sqlite3_normalized_sql", "string", ["number"]), qb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), oc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), rb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), pc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), qc = h("sqlite3_bind_int", "number", [
            "number",
            "number",
            "number"
          ]), rc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), sc = h("sqlite3_step", "number", ["number"]), tc = h("sqlite3_errmsg", "string", ["number"]), uc = h("sqlite3_column_count", "number", ["number"]), vc = h("sqlite3_data_count", "number", ["number"]), wc = h("sqlite3_column_double", "number", ["number", "number"]), sb = h("sqlite3_column_text", "string", ["number", "number"]), xc = h("sqlite3_column_blob", "number", ["number", "number"]), yc = h("sqlite3_column_bytes", "number", ["number", "number"]), zc = h(
            "sqlite3_column_type",
            "number",
            ["number", "number"]
          ), Ac = h("sqlite3_column_name", "string", ["number", "number"]), Bc = h("sqlite3_reset", "number", ["number"]), Cc = h("sqlite3_clear_bindings", "number", ["number"]), Dc = h("sqlite3_finalize", "number", ["number"]), tb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), hc = h("sqlite3_value_type", "number", ["number"]), kc = h("sqlite3_value_bytes", "number", ["number"]), jc = h("sqlite3_value_text", "string", ["number"]), lc = h(
            "sqlite3_value_blob",
            "number",
            ["number"]
          ), ic = h("sqlite3_value_double", "number", ["number"]), ec = h("sqlite3_result_double", "", ["number", "number"]), lb = h("sqlite3_result_null", "", ["number"]), fc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), gc = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), dc = h("sqlite3_result_int", "", ["number", "number"]), va = h("sqlite3_result_error", "", ["number", "string", "number"]), ub = h("sqlite3_aggregate_context", "number", ["number", "number"]), ob = h(
            "RegisterExtensionFunctions",
            "number",
            ["number"]
          ), vb = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
          c.prototype.bind = function(f) {
            if (!this.Qa) throw "Statement closed";
            this.reset();
            return Array.isArray(f) ? this.Gb(f) : null != f && "object" === typeof f ? this.Hb(f) : true;
          };
          c.prototype.step = function() {
            if (!this.Qa) throw "Statement closed";
            this.Oa = 1;
            var f = sc(this.Qa);
            switch (f) {
              case 100:
                return true;
              case 101:
                return false;
              default:
                throw this.db.handleError(f);
            }
          };
          c.prototype.Ab = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return wc(this.Qa, f);
          };
          c.prototype.Ob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            f = sb(this.Qa, f);
            if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
            return BigInt(f);
          };
          c.prototype.Tb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return sb(this.Qa, f);
          };
          c.prototype.getBlob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            var l = yc(this.Qa, f);
            f = xc(this.Qa, f);
            for (var n = new Uint8Array(l), p = 0; p < l; p += 1) n[p] = m[f + p];
            return n;
          };
          c.prototype.get = function(f, l) {
            l = l || {};
            null != f && this.bind(f) && this.step();
            f = [];
            for (var n = vc(this.Qa), p = 0; p < n; p += 1) switch (zc(this.Qa, p)) {
              case 1:
                var r = l.useBigInt ? this.Ob(p) : this.Ab(p);
                f.push(r);
                break;
              case 2:
                f.push(this.Ab(p));
                break;
              case 3:
                f.push(this.Tb(p));
                break;
              case 4:
                f.push(this.getBlob(p));
                break;
              default:
                f.push(null);
            }
            return f;
          };
          c.prototype.qb = function() {
            for (var f = [], l = uc(this.Qa), n = 0; n < l; n += 1) f.push(Ac(this.Qa, n));
            return f;
          };
          c.prototype.zb = function(f, l) {
            f = this.get(f, l);
            l = this.qb();
            for (var n = {}, p = 0; p < l.length; p += 1) n[l[p]] = f[p];
            return n;
          };
          c.prototype.Sb = function() {
            return pb(this.Qa);
          };
          c.prototype.Pb = function() {
            return nc(this.Qa);
          };
          c.prototype.run = function(f) {
            null != f && this.bind(f);
            this.step();
            return this.reset();
          };
          c.prototype.wb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            f = fa(f);
            this.mb.push(f);
            this.db.handleError(oc(this.Qa, l, f, -1, 0));
          };
          c.prototype.Fb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            var n = da(f.length);
            m.set(f, n);
            this.mb.push(n);
            this.db.handleError(rb(this.Qa, l, n, f.length, 0));
          };
          c.prototype.vb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            this.db.handleError((f === (f | 0) ? qc : pc)(
              this.Qa,
              l,
              f
            ));
          };
          c.prototype.Ib = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            rb(this.Qa, f, 0, 0, 0);
          };
          c.prototype.xb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            switch (typeof f) {
              case "string":
                this.wb(f, l);
                return;
              case "number":
                this.vb(f, l);
                return;
              case "bigint":
                this.wb(f.toString(), l);
                return;
              case "boolean":
                this.vb(f + 0, l);
                return;
              case "object":
                if (null === f) {
                  this.Ib(l);
                  return;
                }
                if (null != f.length) {
                  this.Fb(f, l);
                  return;
                }
            }
            throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
          };
          c.prototype.Hb = function(f) {
            var l = this;
            Object.keys(f).forEach(function(n) {
              var p = rc(l.Qa, n);
              0 !== p && l.xb(f[n], p);
            });
            return true;
          };
          c.prototype.Gb = function(f) {
            for (var l = 0; l < f.length; l += 1) this.xb(f[l], l + 1);
            return true;
          };
          c.prototype.reset = function() {
            this.freemem();
            return 0 === Cc(this.Qa) && 0 === Bc(this.Qa);
          };
          c.prototype.freemem = function() {
            for (var f; void 0 !== (f = this.mb.pop()); ) ea(f);
          };
          c.prototype.Ya = function() {
            this.freemem();
            var f = 0 === Dc(this.Qa);
            delete this.db.gb[this.Qa];
            this.Qa = 0;
            return f;
          };
          d.prototype.next = function() {
            if (null === this.fb) return { done: true };
            null !== this.$a && (this.$a.Ya(), this.$a = null);
            if (!this.db.db) throw this.ob(), Error("Database closed");
            var f = qa(), l = y(4);
            ra(g);
            ra(l);
            try {
              this.db.handleError(qb(this.db.db, this.lb, -1, g, l));
              this.lb = t(l, "i32");
              var n = t(g, "i32");
              if (0 === n) return this.ob(), { done: true };
              this.$a = new c(n, this.db);
              this.db.gb[n] = this.$a;
              return { value: this.$a, done: false };
            } catch (p) {
              throw this.sb = z(this.lb), this.ob(), p;
            } finally {
              sa(f);
            }
          };
          d.prototype.ob = function() {
            ea(this.fb);
            this.fb = null;
          };
          d.prototype.Qb = function() {
            return null !== this.sb ? this.sb : z(this.lb);
          };
          "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
            return this;
          });
          e.prototype.run = function(f, l) {
            if (!this.db) throw "Database closed";
            if (l) {
              f = this.tb(f, l);
              try {
                f.step();
              } finally {
                f.Ya();
              }
            } else this.handleError(u(this.db, f, 0, 0, g));
            return this;
          };
          e.prototype.exec = function(f, l, n) {
            if (!this.db) throw "Database closed";
            var p = qa(), r = null, w = null, J = null;
            try {
              J = w = fa(f);
              var I = y(4);
              for (f = []; 0 !== t(J, "i8"); ) {
                ra(g);
                ra(I);
                this.handleError(qb(this.db, J, -1, g, I));
                var L = t(g, "i32");
                J = t(I, "i32");
                if (0 !== L) {
                  var G = null;
                  r = new c(L, this);
                  for (null != l && r.bind(l); r.step(); ) null === G && (G = { columns: r.qb(), values: [] }, f.push(G)), G.values.push(r.get(null, n));
                  r.Ya();
                }
              }
              return f;
            } catch (la) {
              throw r && r.Ya(), la;
            } finally {
              w && ea(w), sa(p);
            }
          };
          e.prototype.Mb = function(f, l, n, p, r) {
            "function" === typeof l && (p = n, n = l, l = void 0);
            f = this.tb(f, l);
            try {
              for (; f.step(); ) n(f.zb(null, r));
            } finally {
              f.Ya();
            }
            if ("function" === typeof p) return p();
          };
          e.prototype.tb = function(f, l) {
            ra(g);
            this.handleError(D(this.db, f, -1, g, 0));
            f = t(g, "i32");
            if (0 === f) throw "Nothing to prepare";
            var n = new c(f, this);
            null != l && n.bind(l);
            return this.gb[f] = n;
          };
          e.prototype.Ub = function(f) {
            return new d(f, this);
          };
          e.prototype.Nb = function() {
            Object.values(this.gb).forEach(function(l) {
              l.Ya();
            });
            Object.values(this.Sa).forEach(A);
            this.Sa = {};
            this.handleError(v(this.db));
            var f = ta(this.filename);
            this.handleError(q(this.filename, g));
            this.db = t(g, "i32");
            ob(this.db);
            return f;
          };
          e.prototype.close = function() {
            null !== this.db && (Object.values(this.gb).forEach(function(f) {
              f.Ya();
            }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.Za && (A(this.Za), this.Za = void 0), this.handleError(v(this.db)), ua("/" + this.filename), this.db = null);
          };
          e.prototype.handleError = function(f) {
            if (0 === f) return null;
            f = tc(this.db);
            throw Error(f);
          };
          e.prototype.Rb = function() {
            return x(this.db);
          };
          e.prototype.Kb = function(f, l) {
            Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            var n = wa(function(p, r, w) {
              r = b(r, w);
              try {
                var J = l.apply(null, r);
              } catch (I) {
                va(p, I, -1);
                return;
              }
              a(p, J);
            }, "viii");
            this.Sa[f] = n;
            this.handleError(tb(this.db, f, l.length, 1, 0, n, 0, 0, 0));
            return this;
          };
          e.prototype.Jb = function(f, l) {
            var n = l.init || function() {
              return null;
            }, p = l.finalize || function(L) {
              return L;
            }, r = l.step;
            if (!r) throw "An aggregate function must have a step function in " + f;
            var w = {};
            Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            l = f + "__finalize";
            Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
            var J = wa(function(L, G, la) {
              var V = ub(L, 1);
              Object.hasOwnProperty.call(w, V) || (w[V] = n());
              G = b(G, la);
              G = [w[V]].concat(G);
              try {
                w[V] = r.apply(null, G);
              } catch (Fc) {
                delete w[V], va(L, Fc, -1);
              }
            }, "viii"), I = wa(function(L) {
              var G = ub(L, 1);
              try {
                var la = p(w[G]);
              } catch (V) {
                delete w[G];
                va(L, V, -1);
                return;
              }
              a(L, la);
              delete w[G];
            }, "vi");
            this.Sa[f] = J;
            this.Sa[l] = I;
            this.handleError(tb(this.db, f, r.length - 1, 1, 0, 0, J, I, 0));
            return this;
          };
          e.prototype.Zb = function(f) {
            this.Za && (vb(this.db, 0, 0), A(this.Za), this.Za = void 0);
            if (!f) return this;
            this.Za = wa(function(l, n, p, r, w) {
              switch (n) {
                case 18:
                  l = "insert";
                  break;
                case 23:
                  l = "update";
                  break;
                case 9:
                  l = "delete";
                  break;
                default:
                  throw "unknown operationCode in updateHook callback: " + n;
              }
              p = z(p);
              r = z(r);
              if (w > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
              f(l, p, r, Number(w));
            }, "viiiij");
            vb(this.db, this.Za, 0);
            return this;
          };
          c.prototype.bind = c.prototype.bind;
          c.prototype.step = c.prototype.step;
          c.prototype.get = c.prototype.get;
          c.prototype.getColumnNames = c.prototype.qb;
          c.prototype.getAsObject = c.prototype.zb;
          c.prototype.getSQL = c.prototype.Sb;
          c.prototype.getNormalizedSQL = c.prototype.Pb;
          c.prototype.run = c.prototype.run;
          c.prototype.reset = c.prototype.reset;
          c.prototype.freemem = c.prototype.freemem;
          c.prototype.free = c.prototype.Ya;
          d.prototype.next = d.prototype.next;
          d.prototype.getRemainingSQL = d.prototype.Qb;
          e.prototype.run = e.prototype.run;
          e.prototype.exec = e.prototype.exec;
          e.prototype.each = e.prototype.Mb;
          e.prototype.prepare = e.prototype.tb;
          e.prototype.iterateStatements = e.prototype.Ub;
          e.prototype["export"] = e.prototype.Nb;
          e.prototype.close = e.prototype.close;
          e.prototype.handleError = e.prototype.handleError;
          e.prototype.getRowsModified = e.prototype.Rb;
          e.prototype.create_function = e.prototype.Kb;
          e.prototype.create_aggregate = e.prototype.Jb;
          e.prototype.updateHook = e.prototype.Zb;
          k.Database = e;
        };
        var xa = "./this.program", ya = (a, b) => {
          throw b;
        }, za = globalThis.document?.currentScript?.src;
        "undefined" != typeof __filename ? za = __filename : ba && (za = self.location.href);
        var Aa = "", Ba, Ca;
        if (ca) {
          var fs = require("node:fs");
          Aa = __dirname + "/";
          Ca = (a) => {
            a = Da(a) ? new URL(a) : a;
            return fs.readFileSync(a);
          };
          Ba = async (a) => {
            a = Da(a) ? new URL(a) : a;
            return fs.readFileSync(a, void 0);
          };
          1 < process.argv.length && (xa = process.argv[1].replace(/\\/g, "/"));
          process.argv.slice(2);
          "undefined" != typeof module2 && (module2.exports = k);
          ya = (a, b) => {
            process.exitCode = a;
            throw b;
          };
        } else if (aa || ba) {
          try {
            Aa = new URL(".", za).href;
          } catch {
          }
          ba && (Ca = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
          Ba = async (a) => {
            if (Da(a)) return new Promise((c, d) => {
              var e = new XMLHttpRequest();
              e.open("GET", a, true);
              e.responseType = "arraybuffer";
              e.onload = () => {
                200 == e.status || 0 == e.status && e.response ? c(e.response) : d(e.status);
              };
              e.onerror = d;
              e.send(null);
            });
            var b = await fetch(a, { credentials: "same-origin" });
            if (b.ok) return b.arrayBuffer();
            throw Error(b.status + " : " + b.url);
          };
        }
        var Ea = console.log.bind(console), B = console.error.bind(console), Fa, Ga = false, Ha, Da = (a) => a.startsWith("file://"), m, C, Ia, E, F, Ja, Ka, H;
        function La() {
          var a = Ma.buffer;
          m = new Int8Array(a);
          Ia = new Int16Array(a);
          C = new Uint8Array(a);
          new Uint16Array(a);
          E = new Int32Array(a);
          F = new Uint32Array(a);
          Ja = new Float32Array(a);
          Ka = new Float64Array(a);
          H = new BigInt64Array(a);
          new BigUint64Array(a);
        }
        function Na(a) {
          k.onAbort?.(a);
          a = "Aborted(" + a + ")";
          B(a);
          Ga = true;
          throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
        }
        var Oa;
        async function Pa(a) {
          if (!Fa) try {
            var b = await Ba(a);
            return new Uint8Array(b);
          } catch {
          }
          if (a == Oa && Fa) a = new Uint8Array(Fa);
          else if (Ca) a = Ca(a);
          else throw "both async and sync fetching of the wasm failed";
          return a;
        }
        async function Qa(a, b) {
          try {
            var c = await Pa(a);
            return await WebAssembly.instantiate(c, b);
          } catch (d) {
            B(`failed to asynchronously prepare wasm: ${d}`), Na(d);
          }
        }
        async function Ra(a) {
          var b = Oa;
          if (!Fa && !Da(b) && !ca) try {
            var c = fetch(b, { credentials: "same-origin" });
            return await WebAssembly.instantiateStreaming(c, a);
          } catch (d) {
            B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
          }
          return Qa(b, a);
        }
        class Sa {
          constructor(a) {
            __publicField(this, "name", "ExitStatus");
            this.message = `Program terminated with exit(${a})`;
            this.status = a;
          }
        }
        var Ta = (a) => {
          for (; 0 < a.length; ) a.shift()(k);
        }, Ua = [], Va = [], Wa = () => {
          var a = k.preRun.shift();
          Va.push(a);
        }, K = 0, Xa = null;
        function t(a, b = "i8") {
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              return m[a];
            case "i8":
              return m[a];
            case "i16":
              return Ia[a >> 1];
            case "i32":
              return E[a >> 2];
            case "i64":
              return H[a >> 3];
            case "float":
              return Ja[a >> 2];
            case "double":
              return Ka[a >> 3];
            case "*":
              return F[a >> 2];
            default:
              Na(`invalid type for getValue: ${b}`);
          }
        }
        var Ya = true;
        function ra(a) {
          var b = "i32";
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              m[a] = 0;
              break;
            case "i8":
              m[a] = 0;
              break;
            case "i16":
              Ia[a >> 1] = 0;
              break;
            case "i32":
              E[a >> 2] = 0;
              break;
            case "i64":
              H[a >> 3] = BigInt(0);
              break;
            case "float":
              Ja[a >> 2] = 0;
              break;
            case "double":
              Ka[a >> 3] = 0;
              break;
            case "*":
              F[a >> 2] = 0;
              break;
            default:
              Na(`invalid type for setValue: ${b}`);
          }
        }
        var Za = new TextDecoder(), $a = (a, b, c, d) => {
          c = b + c;
          if (d) return c;
          for (; a[b] && !(b >= c); ) ++b;
          return b;
        }, z = (a, b, c) => a ? Za.decode(C.subarray(a, $a(C, a, b, c))) : "", ab = (a, b) => {
          for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var e = a[d];
            "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
          }
          if (b) for (; c; c--) a.unshift("..");
          return a;
        }, ia = (a) => {
          var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
          (a = ab(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
          a && c && (a += "/");
          return (b ? "/" : "") + a;
        }, bb = (a) => {
          var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
          a = b[0];
          b = b[1];
          if (!a && !b) return ".";
          b && (b = b.slice(0, -1));
          return a + b;
        }, cb = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], db = () => {
          if (ca) {
            var a = require("node:crypto");
            return (b) => a.randomFillSync(b);
          }
          return (b) => crypto.getRandomValues(b);
        }, eb = (a) => {
          (eb = db())(a);
        }, fb = (...a) => {
          for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
            c = 0 <= d ? a[d] : "/";
            if ("string" != typeof c) throw new TypeError("Arguments to path.resolve must be strings");
            if (!c) return "";
            b = c + "/" + b;
            c = "/" === c.charAt(0);
          }
          b = ab(b.split("/").filter((e) => !!e), !c).join("/");
          return (c ? "/" : "") + b || ".";
        }, gb = (a) => {
          var b = $a(a, 0);
          return Za.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
        }, hb = [], ib = (a) => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
          }
          return b;
        }, M = (a, b, c, d) => {
          if (!(0 < d)) return 0;
          var e = c;
          d = c + d - 1;
          for (var g = 0; g < a.length; ++g) {
            var h = a.codePointAt(g);
            if (127 >= h) {
              if (c >= d) break;
              b[c++] = h;
            } else if (2047 >= h) {
              if (c + 1 >= d) break;
              b[c++] = 192 | h >> 6;
              b[c++] = 128 | h & 63;
            } else if (65535 >= h) {
              if (c + 2 >= d) break;
              b[c++] = 224 | h >> 12;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | h >> 18;
              b[c++] = 128 | h >> 12 & 63;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
              g++;
            }
          }
          b[c] = 0;
          return c - e;
        }, jb = [];
        function kb(a, b) {
          jb[a] = { input: [], output: [], eb: b };
          mb(a, nb);
        }
        var nb = { open(a) {
          var b = jb[a.node.rdev];
          if (!b) throw new N(43);
          a.tty = b;
          a.seekable = false;
        }, close(a) {
          a.tty.eb.fsync(a.tty);
        }, fsync(a) {
          a.tty.eb.fsync(a.tty);
        }, read(a, b, c, d) {
          if (!a.tty || !a.tty.eb.Bb) throw new N(60);
          for (var e = 0, g = 0; g < d; g++) {
            try {
              var h = a.tty.eb.Bb(a.tty);
            } catch (q) {
              throw new N(29);
            }
            if (void 0 === h && 0 === e) throw new N(6);
            if (null === h || void 0 === h) break;
            e++;
            b[c + g] = h;
          }
          e && (a.node.atime = Date.now());
          return e;
        }, write(a, b, c, d) {
          if (!a.tty || !a.tty.eb.ub) throw new N(60);
          try {
            for (var e = 0; e < d; e++) a.tty.eb.ub(a.tty, b[c + e]);
          } catch (g) {
            throw new N(29);
          }
          d && (a.node.mtime = a.node.ctime = Date.now());
          return e;
        } }, wb = { Bb() {
          a: {
            if (!hb.length) {
              var a = null;
              if (ca) {
                var b = Buffer.alloc(256), c = 0, d = process.stdin.fd;
                try {
                  c = fs.readSync(d, b, 0, 256);
                } catch (e) {
                  if (e.toString().includes("EOF")) c = 0;
                  else throw e;
                }
                0 < c && (a = b.slice(0, c).toString("utf-8"));
              } else globalThis.window?.prompt && (a = window.prompt("Input: "), null !== a && (a += "\n"));
              if (!a) {
                a = null;
                break a;
              }
              b = Array(ib(a) + 1);
              a = M(a, b, 0, b.length);
              b.length = a;
              hb = b;
            }
            a = hb.shift();
          }
          return a;
        }, ub(a, b) {
          null === b || 10 === b ? (Ea(gb(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, fsync(a) {
          0 < a.output?.length && (Ea(gb(a.output)), a.output = []);
        }, hc() {
          return { bc: 25856, dc: 5, ac: 191, cc: 35387, $b: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ic() {
          return 0;
        }, jc() {
          return [24, 80];
        } }, xb = { ub(a, b) {
          null === b || 10 === b ? (B(gb(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, fsync(a) {
          0 < a.output?.length && (B(gb(a.output)), a.output = []);
        } }, O = { Wa: null, Xa() {
          return O.createNode(null, "/", 16895, 0);
        }, createNode(a, b, c, d) {
          if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new N(63);
          O.Wa || (O.Wa = { dir: { node: { Ta: O.La.Ta, Ua: O.La.Ua, lookup: O.La.lookup, ib: O.La.ib, rename: O.La.rename, unlink: O.La.unlink, rmdir: O.La.rmdir, readdir: O.La.readdir, symlink: O.La.symlink }, stream: { Va: O.Ma.Va } }, file: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: { Va: O.Ma.Va, read: O.Ma.read, write: O.Ma.write, jb: O.Ma.jb, kb: O.Ma.kb } }, link: { node: { Ta: O.La.Ta, Ua: O.La.Ua, readlink: O.La.readlink }, stream: {} }, yb: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: yb } });
          c = zb(a, b, c, d);
          P(c.mode) ? (c.La = O.Wa.dir.node, c.Ma = O.Wa.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = O.Wa.file.node, c.Ma = O.Wa.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = O.Wa.link.node, c.Ma = O.Wa.link.stream) : 8192 === (c.mode & 61440) && (c.La = O.Wa.yb.node, c.Ma = O.Wa.yb.stream);
          c.atime = c.mtime = c.ctime = Date.now();
          a && (a.Na[b] = c, a.atime = a.mtime = a.ctime = c.atime);
          return c;
        }, fc(a) {
          return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
        }, La: {
          Ta(a) {
            var b = {};
            b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
            b.ino = a.id;
            b.mode = a.mode;
            b.nlink = 1;
            b.uid = 0;
            b.gid = 0;
            b.rdev = a.rdev;
            P(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
            b.atime = new Date(a.atime);
            b.mtime = new Date(a.mtime);
            b.ctime = new Date(a.ctime);
            b.blksize = 4096;
            b.blocks = Math.ceil(b.size / b.blksize);
            return b;
          },
          Ua(a, b) {
            for (var c of ["mode", "atime", "mtime", "ctime"]) null != b[c] && (a[c] = b[c]);
            void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
          },
          lookup() {
            O.nb || (O.nb = new N(44), O.nb.stack = "<generic error, no stack>");
            throw O.nb;
          },
          ib(a, b, c, d) {
            return O.createNode(a, b, c, d);
          },
          rename(a, b, c) {
            try {
              var d = Q(b, c);
            } catch (g) {
            }
            if (d) {
              if (P(a.mode)) for (var e in d.Na) throw new N(55);
              Ab(d);
            }
            delete a.parent.Na[a.name];
            b.Na[c] = a;
            a.name = c;
            b.ctime = b.mtime = a.parent.ctime = a.parent.mtime = Date.now();
          },
          unlink(a, b) {
            delete a.Na[b];
            a.ctime = a.mtime = Date.now();
          },
          rmdir(a, b) {
            var c = Q(a, b), d;
            for (d in c.Na) throw new N(55);
            delete a.Na[b];
            a.ctime = a.mtime = Date.now();
          },
          readdir(a) {
            return [".", "..", ...Object.keys(a.Na)];
          },
          symlink(a, b, c) {
            a = O.createNode(a, b, 41471, 0);
            a.link = c;
            return a;
          },
          readlink(a) {
            if (40960 !== (a.mode & 61440)) throw new N(28);
            return a.link;
          }
        }, Ma: { read(a, b, c, d, e) {
          var g = a.node.Na;
          if (e >= a.node.Ra) return 0;
          a = Math.min(a.node.Ra - e, d);
          if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
          else for (d = 0; d < a; d++) b[c + d] = g[e + d];
          return a;
        }, write(a, b, c, d, e, g) {
          b.buffer === m.buffer && (g = false);
          if (!d) return 0;
          a = a.node;
          a.mtime = a.ctime = Date.now();
          if (b.subarray && (!a.Na || a.Na.subarray)) {
            if (g) return a.Na = b.subarray(c, c + d), a.Ra = d;
            if (0 === a.Ra && 0 === e) return a.Na = b.slice(c, c + d), a.Ra = d;
            if (e + d <= a.Ra) return a.Na.set(b.subarray(c, c + d), e), d;
          }
          g = e + d;
          var h = a.Na ? a.Na.length : 0;
          h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
          if (a.Na.subarray && b.subarray) a.Na.set(b.subarray(c, c + d), e);
          else for (g = 0; g < d; g++) a.Na[e + g] = b[c + g];
          a.Ra = Math.max(a.Ra, e + d);
          return d;
        }, Va(a, b, c) {
          1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
          if (0 > b) throw new N(28);
          return b;
        }, jb(a, b, c, d, e) {
          if (32768 !== (a.node.mode & 61440)) throw new N(43);
          a = a.node.Na;
          if (e & 2 || !a || a.buffer !== m.buffer) {
            e = true;
            d = 65536 * Math.ceil(b / 65536);
            var g = Bb(65536, d);
            g && C.fill(0, g, g + d);
            d = g;
            if (!d) throw new N(48);
            if (a) {
              if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
              m.set(a, d);
            }
          } else e = false, d = a.byteOffset;
          return { Xb: d, Eb: e };
        }, kb(a, b, c, d) {
          O.Ma.write(a, b, 0, d, c, false);
          return 0;
        } } }, ja = (a, b) => {
          var c = 0;
          a && (c |= 365);
          b && (c |= 146);
          return c;
        }, Cb = null, Db = {}, Eb = [], Fb = 1, R = null, Gb = false, Hb = true, Ib = {}, N = class {
          constructor(a) {
            __publicField(this, "name", "ErrnoError");
            this.Pa = a;
          }
        }, Jb = class {
          constructor() {
            __publicField(this, "hb", {});
            __publicField(this, "node", null);
          }
          get flags() {
            return this.hb.flags;
          }
          set flags(a) {
            this.hb.flags = a;
          }
          get position() {
            return this.hb.position;
          }
          set position(a) {
            this.hb.position = a;
          }
        }, Kb = class {
          constructor(a, b, c, d) {
            __publicField(this, "La", {});
            __publicField(this, "Ma", {});
            __publicField(this, "bb", null);
            a || (a = this);
            this.parent = a;
            this.Xa = a.Xa;
            this.id = Fb++;
            this.name = b;
            this.mode = c;
            this.rdev = d;
            this.atime = this.mtime = this.ctime = Date.now();
          }
          get read() {
            return 365 === (this.mode & 365);
          }
          set read(a) {
            a ? this.mode |= 365 : this.mode &= -366;
          }
          get write() {
            return 146 === (this.mode & 146);
          }
          set write(a) {
            a ? this.mode |= 146 : this.mode &= -147;
          }
        };
        function S(a, b = {}) {
          if (!a) throw new N(44);
          b.pb ?? (b.pb = true);
          "/" === a.charAt(0) || (a = "//" + a);
          var c = 0;
          a: for (; 40 > c; c++) {
            a = a.split("/").filter((q) => !!q);
            for (var d = Cb, e = "/", g = 0; g < a.length; g++) {
              var h = g === a.length - 1;
              if (h && b.parent) break;
              if ("." !== a[g]) if (".." === a[g]) if (e = bb(e), d === d.parent) {
                a = e + "/" + a.slice(g + 1).join("/");
                c--;
                continue a;
              } else d = d.parent;
              else {
                e = ia(e + "/" + a[g]);
                try {
                  d = Q(d, a[g]);
                } catch (q) {
                  if (44 === q?.Pa && h && b.Wb) return { path: e };
                  throw q;
                }
                !d.bb || h && !b.pb || (d = d.bb.root);
                if (40960 === (d.mode & 61440) && (!h || b.ab)) {
                  if (!d.La.readlink) throw new N(52);
                  d = d.La.readlink(d);
                  "/" === d.charAt(0) || (d = bb(e) + "/" + d);
                  a = d + "/" + a.slice(g + 1).join("/");
                  continue a;
                }
              }
            }
            return { path: e, node: d };
          }
          throw new N(32);
        }
        function ha(a) {
          for (var b; ; ) {
            if (a === a.parent) return a = a.Xa.Db, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
            b = b ? `${a.name}/${b}` : a.name;
            a = a.parent;
          }
        }
        function Lb(a, b) {
          for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
          return (a + c >>> 0) % R.length;
        }
        function Ab(a) {
          var b = Lb(a.parent.id, a.name);
          if (R[b] === a) R[b] = a.cb;
          else for (b = R[b]; b; ) {
            if (b.cb === a) {
              b.cb = a.cb;
              break;
            }
            b = b.cb;
          }
        }
        function Q(a, b) {
          var c = P(a.mode) ? (c = Mb(a, "x")) ? c : a.La.lookup ? 0 : 2 : 54;
          if (c) throw new N(c);
          for (c = R[Lb(a.id, b)]; c; c = c.cb) {
            var d = c.name;
            if (c.parent.id === a.id && d === b) return c;
          }
          return a.La.lookup(a, b);
        }
        function zb(a, b, c, d) {
          a = new Kb(a, b, c, d);
          b = Lb(a.parent.id, a.name);
          a.cb = R[b];
          return R[b] = a;
        }
        function P(a) {
          return 16384 === (a & 61440);
        }
        function Nb(a) {
          var b = ["r", "w", "rw"][a & 3];
          a & 512 && (b += "w");
          return b;
        }
        function Mb(a, b) {
          if (Hb) return 0;
          if (!b.includes("r") || a.mode & 292) {
            if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2;
          } else return 2;
          return 0;
        }
        function Ob(a, b) {
          if (!P(a.mode)) return 54;
          try {
            return Q(a, b), 20;
          } catch (c) {
          }
          return Mb(a, "wx");
        }
        function Pb(a, b, c) {
          try {
            var d = Q(a, b);
          } catch (e) {
            return e.Pa;
          }
          if (a = Mb(a, "wx")) return a;
          if (c) {
            if (!P(d.mode)) return 54;
            if (d === d.parent || "/" === ha(d)) return 10;
          } else if (P(d.mode)) return 31;
          return 0;
        }
        function Qb(a) {
          if (!a) throw new N(63);
          return a;
        }
        function T(a) {
          a = Eb[a];
          if (!a) throw new N(8);
          return a;
        }
        function Rb(a, b = -1) {
          a = Object.assign(new Jb(), a);
          if (-1 == b) a: {
            for (b = 0; 4096 >= b; b++) if (!Eb[b]) break a;
            throw new N(33);
          }
          a.fd = b;
          return Eb[b] = a;
        }
        function Sb(a, b = -1) {
          a = Rb(a, b);
          a.Ma?.ec?.(a);
          return a;
        }
        function Tb(a, b, c) {
          var d = a?.Ma.Ua;
          a = d ? a : b;
          d ?? (d = b.La.Ua);
          Qb(d);
          d(a, c);
        }
        var yb = { open(a) {
          a.Ma = Db[a.node.rdev].Ma;
          a.Ma.open?.(a);
        }, Va() {
          throw new N(70);
        } };
        function mb(a, b) {
          Db[a] = { Ma: b };
        }
        function Ub(a, b) {
          var c = "/" === b;
          if (c && Cb) throw new N(10);
          if (!c && b) {
            var d = S(b, { pb: false });
            b = d.path;
            d = d.node;
            if (d.bb) throw new N(10);
            if (!P(d.mode)) throw new N(54);
          }
          b = { type: a, kc: {}, Db: b, Vb: [] };
          a = a.Xa(b);
          a.Xa = b;
          b.root = a;
          c ? Cb = a : d && (d.bb = b, d.Xa && d.Xa.Vb.push(b));
        }
        function Vb(a, b, c) {
          var d = S(a, { parent: true }).node;
          a = cb(a);
          if (!a) throw new N(28);
          if ("." === a || ".." === a) throw new N(20);
          var e = Ob(d, a);
          if (e) throw new N(e);
          if (!d.La.ib) throw new N(63);
          return d.La.ib(d, a, b, c);
        }
        function ka(a, b = 438) {
          return Vb(a, b & 4095 | 32768, 0);
        }
        function U(a, b = 511) {
          return Vb(a, b & 1023 | 16384, 0);
        }
        function Wb(a, b, c) {
          "undefined" == typeof c && (c = b, b = 438);
          Vb(a, b | 8192, c);
        }
        function Xb(a, b) {
          if (!fb(a)) throw new N(44);
          var c = S(b, { parent: true }).node;
          if (!c) throw new N(44);
          b = cb(b);
          var d = Ob(c, b);
          if (d) throw new N(d);
          if (!c.La.symlink) throw new N(63);
          c.La.symlink(c, b, a);
        }
        function Yb(a) {
          var b = S(a, { parent: true }).node;
          a = cb(a);
          var c = Q(b, a), d = Pb(b, a, true);
          if (d) throw new N(d);
          if (!b.La.rmdir) throw new N(63);
          if (c.bb) throw new N(10);
          b.La.rmdir(b, a);
          Ab(c);
        }
        function ua(a) {
          var b = S(a, { parent: true }).node;
          if (!b) throw new N(44);
          a = cb(a);
          var c = Q(b, a), d = Pb(b, a, false);
          if (d) throw new N(d);
          if (!b.La.unlink) throw new N(63);
          if (c.bb) throw new N(10);
          b.La.unlink(b, a);
          Ab(c);
        }
        function Zb(a, b) {
          a = S(a, { ab: !b }).node;
          return Qb(a.La.Ta)(a);
        }
        function $b(a, b, c, d) {
          Tb(a, b, { mode: c & 4095 | b.mode & -4096, ctime: Date.now(), Lb: d });
        }
        function ma(a, b) {
          a = "string" == typeof a ? S(a, { ab: true }).node : a;
          $b(null, a, b);
        }
        function ac(a, b, c) {
          if (P(b.mode)) throw new N(31);
          if (32768 !== (b.mode & 61440)) throw new N(28);
          var d = Mb(b, "w");
          if (d) throw new N(d);
          Tb(a, b, { size: c, timestamp: Date.now() });
        }
        function na(a, b, c = 438) {
          if ("" === a) throw new N(44);
          if ("string" == typeof b) {
            var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
            if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
            b = d;
          }
          c = b & 64 ? c & 4095 | 32768 : 0;
          if ("object" == typeof a) d = a;
          else {
            var e = a.endsWith("/");
            a = S(a, { ab: !(b & 131072), Wb: true });
            d = a.node;
            a = a.path;
          }
          var g = false;
          if (b & 64) if (d) {
            if (b & 128) throw new N(20);
          } else {
            if (e) throw new N(31);
            d = Vb(a, c | 511, 0);
            g = true;
          }
          if (!d) throw new N(44);
          8192 === (d.mode & 61440) && (b &= -513);
          if (b & 65536 && !P(d.mode)) throw new N(54);
          if (!g && (e = d ? 40960 === (d.mode & 61440) ? 32 : P(d.mode) && ("r" !== Nb(b) || b & 576) ? 31 : Mb(d, Nb(b)) : 44)) throw new N(e);
          b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { ab: true }).node : e, ac(null, e, 0));
          b &= -131713;
          e = Rb({ node: d, path: ha(d), flags: b, seekable: true, position: 0, Ma: d.Ma, Yb: [], error: false });
          e.Ma.open && e.Ma.open(e);
          g && ma(d, c & 511);
          !k.logReadFiles || b & 1 || a in Ib || (Ib[a] = 1);
          return e;
        }
        function pa(a) {
          if (null === a.fd) throw new N(8);
          a.rb && (a.rb = null);
          try {
            a.Ma.close && a.Ma.close(a);
          } catch (b) {
            throw b;
          } finally {
            Eb[a.fd] = null;
          }
          a.fd = null;
        }
        function bc(a, b, c) {
          if (null === a.fd) throw new N(8);
          if (!a.seekable || !a.Ma.Va) throw new N(70);
          if (0 != c && 1 != c && 2 != c) throw new N(28);
          a.position = a.Ma.Va(a, b, c);
          a.Yb = [];
        }
        function cc(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new N(28);
          if (null === a.fd) throw new N(8);
          if (1 === (a.flags & 2097155)) throw new N(8);
          if (P(a.node.mode)) throw new N(31);
          if (!a.Ma.read) throw new N(28);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new N(70);
          b = a.Ma.read(a, b, c, d, e);
          g || (a.position += b);
          return b;
        }
        function oa(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new N(28);
          if (null === a.fd) throw new N(8);
          if (0 === (a.flags & 2097155)) throw new N(8);
          if (P(a.node.mode)) throw new N(31);
          if (!a.Ma.write) throw new N(28);
          a.seekable && a.flags & 1024 && bc(a, 0, 2);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new N(70);
          b = a.Ma.write(a, b, c, d, e, void 0);
          g || (a.position += b);
          return b;
        }
        function ta(a) {
          var b = b || 0;
          var c = "binary";
          "utf8" !== c && "binary" !== c && Na(`Invalid encoding type "${c}"`);
          b = na(a, b);
          a = Zb(a).size;
          var d = new Uint8Array(a);
          cc(b, d, 0, a, 0);
          "utf8" === c && (d = gb(d));
          pa(b);
          return d;
        }
        function W(a, b, c) {
          a = ia("/dev/" + a);
          var d = ja(!!b, !!c);
          W.Cb ?? (W.Cb = 64);
          var e = W.Cb++ << 8 | 0;
          mb(e, { open(g) {
            g.seekable = false;
          }, close() {
            c?.buffer?.length && c(10);
          }, read(g, h, q, v) {
            for (var u = 0, x = 0; x < v; x++) {
              try {
                var D = b();
              } catch (pb) {
                throw new N(29);
              }
              if (void 0 === D && 0 === u) throw new N(6);
              if (null === D || void 0 === D) break;
              u++;
              h[q + x] = D;
            }
            u && (g.node.atime = Date.now());
            return u;
          }, write(g, h, q, v) {
            for (var u = 0; u < v; u++) try {
              c(h[q + u]);
            } catch (x) {
              throw new N(29);
            }
            v && (g.node.mtime = g.node.ctime = Date.now());
            return u;
          } });
          Wb(a, d, e);
        }
        var X = {};
        function Y(a, b, c) {
          if ("/" === b.charAt(0)) return b;
          a = -100 === a ? "/" : T(a).path;
          if (0 == b.length) {
            if (!c) throw new N(44);
            return a;
          }
          return a + "/" + b;
        }
        function mc(a, b) {
          F[a >> 2] = b.dev;
          F[a + 4 >> 2] = b.mode;
          F[a + 8 >> 2] = b.nlink;
          F[a + 12 >> 2] = b.uid;
          F[a + 16 >> 2] = b.gid;
          F[a + 20 >> 2] = b.rdev;
          H[a + 24 >> 3] = BigInt(b.size);
          E[a + 32 >> 2] = 4096;
          E[a + 36 >> 2] = b.blocks;
          var c = b.atime.getTime(), d = b.mtime.getTime(), e = b.ctime.getTime();
          H[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
          F[a + 48 >> 2] = c % 1e3 * 1e6;
          H[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
          F[a + 64 >> 2] = d % 1e3 * 1e6;
          H[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
          F[a + 80 >> 2] = e % 1e3 * 1e6;
          H[a + 88 >> 3] = BigInt(b.ino);
          return 0;
        }
        var Ec = void 0, Gc = () => {
          var a = E[+Ec >> 2];
          Ec += 4;
          return a;
        }, Hc = 0, Ic = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Jc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Kc = {}, Lc = (a) => {
          Ha = a;
          Ya || 0 < Hc || (k.onExit?.(a), Ga = true);
          ya(a, new Sa(a));
        }, Mc = (a) => {
          if (!Ga) try {
            a();
          } catch (b) {
            b instanceof Sa || "unwind" == b || ya(1, b);
          } finally {
            if (!(Ya || 0 < Hc)) try {
              Ha = a = Ha, Lc(a);
            } catch (b) {
              b instanceof Sa || "unwind" == b || ya(1, b);
            }
          }
        }, Nc = {}, Pc = () => {
          if (!Oc) {
            var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: xa || "./this.program" }, b;
            for (b in Nc) void 0 === Nc[b] ? delete a[b] : a[b] = Nc[b];
            var c = [];
            for (b in a) c.push(`${b}=${a[b]}`);
            Oc = c;
          }
          return Oc;
        }, Oc, Qc = (a, b, c, d) => {
          var e = { string: (u) => {
            var x = 0;
            if (null !== u && void 0 !== u && 0 !== u) {
              x = ib(u) + 1;
              var D = y(x);
              M(u, C, D, x);
              x = D;
            }
            return x;
          }, array: (u) => {
            var x = y(u.length);
            m.set(u, x);
            return x;
          } };
          a = k["_" + a];
          var g = [], h = 0;
          if (d) for (var q = 0; q < d.length; q++) {
            var v = e[c[q]];
            v ? (0 === h && (h = qa()), g[q] = v(d[q])) : g[q] = d[q];
          }
          c = a(...g);
          return c = function(u) {
            0 !== h && sa(h);
            return "string" === b ? z(u) : "boolean" === b ? !!u : u;
          }(c);
        }, fa = (a) => {
          var b = ib(a) + 1, c = da(b);
          c && M(a, C, c, b);
          return c;
        }, Rc, Sc = [], A = (a) => {
          Rc.delete(Z.get(a));
          Z.set(a, null);
          Sc.push(a);
        }, Tc = (a) => {
          const b = a.length;
          return [b % 128 | 128, b >> 7, ...a];
        }, Uc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Vc = (a) => Tc(Array.from(a, (b) => Uc[b])), wa = (a, b) => {
          if (!Rc) {
            Rc = /* @__PURE__ */ new WeakMap();
            var c = Z.length;
            if (Rc) for (var d = 0; d < 0 + c; d++) {
              var e = Z.get(d);
              e && Rc.set(e, d);
            }
          }
          if (c = Rc.get(a) || 0) return c;
          c = Sc.length ? Sc.pop() : Z.grow(1);
          try {
            Z.set(c, a);
          } catch (g) {
            if (!(g instanceof TypeError)) throw g;
            b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Tc([1, 96, ...Vc(b.slice(1)), ...Vc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
            b = new WebAssembly.Module(b);
            b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
            Z.set(c, b);
          }
          Rc.set(a, c);
          return c;
        };
        R = Array(4096);
        Ub(O, "/");
        U("/tmp");
        U("/home");
        U("/home/web_user");
        (function() {
          U("/dev");
          mb(259, { read: () => 0, write: (d, e, g, h) => h, Va: () => 0 });
          Wb("/dev/null", 259);
          kb(1280, wb);
          kb(1536, xb);
          Wb("/dev/tty", 1280);
          Wb("/dev/tty1", 1536);
          var a = new Uint8Array(1024), b = 0, c = () => {
            0 === b && (eb(a), b = a.byteLength);
            return a[--b];
          };
          W("random", c);
          W("urandom", c);
          U("/dev/shm");
          U("/dev/shm/tmp");
        })();
        (function() {
          U("/proc");
          var a = U("/proc/self");
          U("/proc/self/fd");
          Ub({ Xa() {
            var b = zb(a, "fd", 16895, 73);
            b.Ma = { Va: O.Ma.Va };
            b.La = { lookup(c, d) {
              c = +d;
              var e = T(c);
              c = { parent: null, Xa: { Db: "fake" }, La: { readlink: () => e.path }, id: c + 1 };
              return c.parent = c;
            }, readdir() {
              return Array.from(Eb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
            } };
            return b;
          } }, "/proc/self/fd");
        })();
        k.noExitRuntime && (Ya = k.noExitRuntime);
        k.print && (Ea = k.print);
        k.printErr && (B = k.printErr);
        k.wasmBinary && (Fa = k.wasmBinary);
        k.thisProgram && (xa = k.thisProgram);
        if (k.preInit) for ("function" == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.shift()();
        k.stackSave = () => qa();
        k.stackRestore = (a) => sa(a);
        k.stackAlloc = (a) => y(a);
        k.cwrap = (a, b, c, d) => {
          var e = !c || c.every((g) => "number" === g || "boolean" === g);
          return "string" !== b && e && !d ? k["_" + a] : (...g) => Qc(a, b, c, g);
        };
        k.addFunction = wa;
        k.removeFunction = A;
        k.UTF8ToString = z;
        k.stringToNewUTF8 = fa;
        k.writeArrayToMemory = (a, b) => {
          m.set(a, b);
        };
        var da, ea, Bb, Wc, sa, y, qa, Ma, Z, Xc = {
          a: (a, b, c, d) => Na(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
          i: function(a, b) {
            try {
              return a = z(a), ma(a, b), 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          L: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c & -8) return -28;
              var d = S(b, { ab: true }).node;
              if (!d) return -44;
              a = "";
              c & 4 && (a += "r");
              c & 2 && (a += "w");
              c & 1 && (a += "x");
              return a && Mb(d, a) ? -2 : 0;
            } catch (e) {
              if ("undefined" == typeof X || "ErrnoError" !== e.name) throw e;
              return -e.Pa;
            }
          },
          j: function(a, b) {
            try {
              var c = T(a);
              $b(c, c.node, b, false);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          h: function(a) {
            try {
              var b = T(a);
              Tb(b, b.node, { timestamp: Date.now(), Lb: false });
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          b: function(a, b, c) {
            Ec = c;
            try {
              var d = T(a);
              switch (b) {
                case 0:
                  var e = Gc();
                  if (0 > e) break;
                  for (; Eb[e]; ) e++;
                  return Sb(d, e).fd;
                case 1:
                case 2:
                  return 0;
                case 3:
                  return d.flags;
                case 4:
                  return e = Gc(), d.flags |= e, 0;
                case 12:
                  return e = Gc(), Ia[e + 0 >> 1] = 2, 0;
                case 13:
                case 14:
                  return 0;
              }
              return -28;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          g: function(a, b) {
            try {
              var c = T(a), d = c.node, e = c.Ma.Ta;
              a = e ? c : d;
              e ?? (e = d.La.Ta);
              Qb(e);
              var g = e(a);
              return mc(b, g);
            } catch (h) {
              if ("undefined" == typeof X || "ErrnoError" !== h.name) throw h;
              return -h.Pa;
            }
          },
          H: function(a, b) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return -61;
              var c = T(a);
              if (0 > b || 0 === (c.flags & 2097155)) throw new N(28);
              ac(c, c.node, b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          G: function(a, b) {
            try {
              if (0 === b) return -28;
              var c = ib("/") + 1;
              if (b < c) return -68;
              M("/", C, a, b);
              return c;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          K: function(a, b) {
            try {
              return a = z(a), mc(b, Zb(a, true));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          C: function(a, b, c) {
            try {
              return b = z(b), b = Y(a, b), U(b, c), 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          J: function(a, b, c, d) {
            try {
              b = z(b);
              var e = d & 256;
              b = Y(a, b, d & 4096);
              return mc(c, e ? Zb(b, true) : Zb(b));
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          x: function(a, b, c, d) {
            Ec = d;
            try {
              b = z(b);
              b = Y(a, b);
              var e = d ? Gc() : 0;
              return na(b, c, e).fd;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          v: function(a, b, c, d) {
            try {
              b = z(b);
              b = Y(a, b);
              if (0 >= d) return -28;
              var e = S(b).node;
              if (!e) throw new N(44);
              if (!e.La.readlink) throw new N(28);
              var g = e.La.readlink(e);
              var h = Math.min(d, ib(g)), q = m[c + h];
              M(
                g,
                C,
                c,
                d + 1
              );
              m[c + h] = q;
              return h;
            } catch (v) {
              if ("undefined" == typeof X || "ErrnoError" !== v.name) throw v;
              return -v.Pa;
            }
          },
          u: function(a) {
            try {
              return a = z(a), Yb(a), 0;
            } catch (b) {
              if ("undefined" == typeof X || "ErrnoError" !== b.name) throw b;
              return -b.Pa;
            }
          },
          f: function(a, b) {
            try {
              return a = z(a), mc(b, Zb(a));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          r: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c) if (512 === c) Yb(b);
              else return -28;
              else ua(b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          q: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b, true);
              var d = Date.now(), e, g;
              if (c) {
                var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                c += 16;
                h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                q = E[c + 8 >> 2];
                1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
              } else g = e = d;
              if (null !== (g ?? e)) {
                a = e;
                var v = S(b, { ab: true }).node;
                Qb(v.La.Ua)(v, { atime: a, mtime: g });
              }
              return 0;
            } catch (u) {
              if ("undefined" == typeof X || "ErrnoError" !== u.name) throw u;
              return -u.Pa;
            }
          },
          m: () => Na(""),
          l: () => {
            Ya = false;
            Hc = 0;
          },
          A: function(a, b) {
            a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
            a = new Date(1e3 * a);
            E[b >> 2] = a.getSeconds();
            E[b + 4 >> 2] = a.getMinutes();
            E[b + 8 >> 2] = a.getHours();
            E[b + 12 >> 2] = a.getDate();
            E[b + 16 >> 2] = a.getMonth();
            E[b + 20 >> 2] = a.getFullYear() - 1900;
            E[b + 24 >> 2] = a.getDay();
            var c = a.getFullYear();
            E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Jc : Ic)[a.getMonth()] + a.getDate() - 1 | 0;
            E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
            c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
          },
          y: function(a, b, c, d, e, g, h) {
            e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
            try {
              var q = T(d);
              if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155)) throw new N(2);
              if (1 === (q.flags & 2097155)) throw new N(2);
              if (!q.Ma.jb) throw new N(43);
              if (!a) throw new N(28);
              var v = q.Ma.jb(q, a, e, b, c);
              var u = v.Xb;
              E[g >> 2] = v.Eb;
              F[h >> 2] = u;
              return 0;
            } catch (x) {
              if ("undefined" == typeof X || "ErrnoError" !== x.name) throw x;
              return -x.Pa;
            }
          },
          z: function(a, b, c, d, e, g) {
            g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
            try {
              var h = T(e);
              if (c & 2) {
                c = g;
                if (32768 !== (h.node.mode & 61440)) throw new N(43);
                if (!(d & 2)) {
                  var q = C.slice(a, a + b);
                  h.Ma.kb && h.Ma.kb(h, q, c, b, d);
                }
              }
            } catch (v) {
              if ("undefined" == typeof X || "ErrnoError" !== v.name) throw v;
              return -v.Pa;
            }
          },
          n: (a, b) => {
            Kc[a] && (clearTimeout(Kc[a].id), delete Kc[a]);
            if (!b) return 0;
            var c = setTimeout(() => {
              delete Kc[a];
              Mc(() => Wc(a, performance.now()));
            }, b);
            Kc[a] = { id: c, lc: b };
            return 0;
          },
          B: (a, b, c, d) => {
            var e = (/* @__PURE__ */ new Date()).getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
            e = new Date(e, 6, 1).getTimezoneOffset();
            F[a >> 2] = 60 * Math.max(g, e);
            E[b >> 2] = Number(g != e);
            b = (h) => {
              var q = Math.abs(h);
              return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
            };
            a = b(g);
            b = b(e);
            e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
          },
          d: () => Date.now(),
          s: () => 2147483648,
          c: () => performance.now(),
          o: (a) => {
            var b = C.length;
            a >>>= 0;
            if (2147483648 < a) return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, a + 100663296);
              a: {
                d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(
                  a,
                  d
                ) / 65536)) - Ma.buffer.byteLength + 65535) / 65536 | 0;
                try {
                  Ma.grow(d);
                  La();
                  var e = 1;
                  break a;
                } catch (g) {
                }
                e = void 0;
              }
              if (e) return true;
            }
            return false;
          },
          E: (a, b) => {
            var c = 0, d = 0, e;
            for (e of Pc()) {
              var g = b + c;
              F[a + d >> 2] = g;
              c += M(e, C, g, Infinity) + 1;
              d += 4;
            }
            return 0;
          },
          F: (a, b) => {
            var c = Pc();
            F[a >> 2] = c.length;
            a = 0;
            for (var d of c) a += ib(d) + 1;
            F[b >> 2] = a;
            return 0;
          },
          e: function(a) {
            try {
              var b = T(a);
              pa(b);
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          p: function(a, b) {
            try {
              var c = T(a);
              m[b] = c.tty ? 2 : P(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
              Ia[b + 2 >> 1] = 0;
              H[b + 8 >> 3] = BigInt(0);
              H[b + 16 >> 3] = BigInt(0);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return d.Pa;
            }
          },
          w: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], v = F[a + 4 >> 2];
                  a += 8;
                  var u = cc(e, m, q, v, g);
                  if (0 > u) {
                    var x = -1;
                    break a;
                  }
                  b += u;
                  if (u < v) break;
                  "undefined" != typeof g && (g += u);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          D: function(a, b, c, d) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return 61;
              var e = T(a);
              bc(e, b, c);
              H[d >> 3] = BigInt(e.position);
              e.rb && 0 === b && 0 === c && (e.rb = null);
              return 0;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return g.Pa;
            }
          },
          I: function(a) {
            try {
              var b = T(a);
              return b.Ma?.fsync?.(b);
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          t: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], v = F[a + 4 >> 2];
                  a += 8;
                  var u = oa(e, m, q, v, g);
                  if (0 > u) {
                    var x = -1;
                    break a;
                  }
                  b += u;
                  if (u < v) break;
                  "undefined" != typeof g && (g += u);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          k: Lc
        };
        function Yc() {
          function a() {
            k.calledRun = true;
            if (!Ga) {
              if (!k.noFSInit && !Gb) {
                var b, c;
                Gb = true;
                b ?? (b = k.stdin);
                c ?? (c = k.stdout);
                d ?? (d = k.stderr);
                b ? W("stdin", b) : Xb("/dev/tty", "/dev/stdin");
                c ? W("stdout", null, c) : Xb("/dev/tty", "/dev/stdout");
                d ? W("stderr", null, d) : Xb("/dev/tty1", "/dev/stderr");
                na("/dev/stdin", 0);
                na("/dev/stdout", 1);
                na("/dev/stderr", 1);
              }
              Zc.N();
              Hb = false;
              k.onRuntimeInitialized?.();
              if (k.postRun) for ("function" == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
                var d = k.postRun.shift();
                Ua.push(d);
              }
              Ta(Ua);
            }
          }
          if (0 < K) Xa = Yc;
          else {
            if (k.preRun) for ("function" == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) Wa();
            Ta(Va);
            0 < K ? Xa = Yc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
              setTimeout(() => k.setStatus(""), 1);
              a();
            }, 1)) : a();
          }
        }
        var Zc;
        (async function() {
          function a(c) {
            c = Zc = c.exports;
            k._sqlite3_free = c.P;
            k._sqlite3_value_text = c.Q;
            k._sqlite3_prepare_v2 = c.R;
            k._sqlite3_step = c.S;
            k._sqlite3_reset = c.T;
            k._sqlite3_exec = c.U;
            k._sqlite3_finalize = c.V;
            k._sqlite3_column_name = c.W;
            k._sqlite3_column_text = c.X;
            k._sqlite3_column_type = c.Y;
            k._sqlite3_errmsg = c.Z;
            k._sqlite3_clear_bindings = c._;
            k._sqlite3_value_blob = c.$;
            k._sqlite3_value_bytes = c.aa;
            k._sqlite3_value_double = c.ba;
            k._sqlite3_value_int = c.ca;
            k._sqlite3_value_type = c.da;
            k._sqlite3_result_blob = c.ea;
            k._sqlite3_result_double = c.fa;
            k._sqlite3_result_error = c.ga;
            k._sqlite3_result_int = c.ha;
            k._sqlite3_result_int64 = c.ia;
            k._sqlite3_result_null = c.ja;
            k._sqlite3_result_text = c.ka;
            k._sqlite3_aggregate_context = c.la;
            k._sqlite3_column_count = c.ma;
            k._sqlite3_data_count = c.na;
            k._sqlite3_column_blob = c.oa;
            k._sqlite3_column_bytes = c.pa;
            k._sqlite3_column_double = c.qa;
            k._sqlite3_bind_blob = c.ra;
            k._sqlite3_bind_double = c.sa;
            k._sqlite3_bind_int = c.ta;
            k._sqlite3_bind_text = c.ua;
            k._sqlite3_bind_parameter_index = c.va;
            k._sqlite3_sql = c.wa;
            k._sqlite3_normalized_sql = c.xa;
            k._sqlite3_changes = c.ya;
            k._sqlite3_close_v2 = c.za;
            k._sqlite3_create_function_v2 = c.Aa;
            k._sqlite3_update_hook = c.Ba;
            k._sqlite3_open = c.Ca;
            da = k._malloc = c.Da;
            ea = k._free = c.Ea;
            k._RegisterExtensionFunctions = c.Fa;
            Bb = c.Ga;
            Wc = c.Ha;
            sa = c.Ia;
            y = c.Ja;
            qa = c.Ka;
            Ma = c.M;
            Z = c.O;
            La();
            K--;
            k.monitorRunDependencies?.(K);
            0 == K && Xa && (c = Xa, Xa = null, c());
            return Zc;
          }
          K++;
          k.monitorRunDependencies?.(K);
          var b = { a: Xc };
          if (k.instantiateWasm) return new Promise((c) => {
            k.instantiateWasm(b, (d, e) => {
              c(a(d, e));
            });
          });
          Oa ?? (Oa = k.locateFile ? k.locateFile("sql-wasm.wasm", Aa) : Aa + "sql-wasm.wasm");
          return a((await Ra(b)).instance);
        })();
        Yc();
        return Module;
      });
      return initSqlJsPromise;
    };
    if (typeof exports2 === "object" && typeof module2 === "object") {
      module2.exports = initSqlJs;
      module2.exports.default = initSqlJs;
    } else if (typeof define === "function" && define["amd"]) {
      define([], function() {
        return initSqlJs;
      });
    } else if (typeof exports2 === "object") {
      exports2["Module"] = initSqlJs;
    }
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DailyIntakePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/sql-loader.ts
async function loadSqlJs() {
  return (await Promise.resolve().then(() => __toESM(require_sql_wasm()))).default;
}

// src/types.ts
var DEFAULT_SETTINGS = {
  enabled: false,
  token: "",
  offset: 0,
  ownerUserId: null,
  ownerChatId: null,
  pairArmed: false,
  journal: "Personal Daily",
  attachmentRoot: "Strata/Attachments/Continuum/Time/Daily",
  status: "Disabled on this device."
};

// src/local-state.ts
var LocalState = class _LocalState {
  constructor(app, node, directory, settingsPath, queuePath, legacySettingsPath, legacyQueuePath, wasmDirectory) {
    this.app = app;
    this.node = node;
    this.directory = directory;
    this.settingsPath = settingsPath;
    this.queuePath = queuePath;
    this.legacySettingsPath = legacySettingsPath;
    this.legacyQueuePath = legacyQueuePath;
    this.wasmDirectory = wasmDirectory;
    this.settingsChain = Promise.resolve();
    this.lastOffset = 0;
    this.previousDirectory = `${directory}.previous`;
    this.previousSettingsPath = `${this.previousDirectory}/settings.json`;
    this.previousQueuePath = `${this.previousDirectory}/queue.sqlite`;
    this.store = {
      exists: async (path) => this.exists(path),
      readBinary: async (path) => new Uint8Array(await this.node.fs.readFile(path)),
      writeBinary: async (path, bytes) => {
        await this.node.fs.mkdir(this.directory, { recursive: true });
        const temporary = `${path}.tmp`;
        await this.node.fs.writeFile(temporary, bytes);
        const verified = await this.node.fs.readFile(temporary);
        if (!sameBytes(bytes, verified)) throw new Error("Private state verification failed.");
        await this.node.fs.rename(temporary, path);
      }
    };
  }
  static async load(app, pluginDirectory, readLegacySettings) {
    const node = await loadNode();
    const vaultPath = String(app.vault.adapter.getBasePath?.() ?? app.vault.getName());
    const directory = node.path.join(node.os.homedir(), "Library", "Application Support", "Obsidian", "daily-intake", stableId(vaultPath));
    const state = new _LocalState(app, node, directory, node.path.join(directory, "settings.json"), node.path.join(directory, "queue.sqlite"), `${pluginDirectory}/data.json`, `${pluginDirectory}/queue.sqlite`, pluginDirectory);
    const [hasSettings, hasQueue] = await Promise.all([state.exists(state.settingsPath), state.exists(state.queuePath)]);
    if (hasSettings || hasQueue) {
      if (!hasSettings || !hasQueue) return blocked(await state.withRecovery(app, "Private state is incomplete; it was not changed."));
      const settings2 = await state.readSettings();
      const queue = await state.readQueue();
      if (!settings2 || !queue || !await state.queueMatches(app, queue, settings2.offset)) return blocked(await state.withRecovery(app, "Private state is unreadable or corrupt; it was not changed."));
      state.remember(settings2);
      return { state, settings: settings2 };
    }
    if (await state.directoryExists()) return blocked(await state.withRecovery(app, "Private state is incomplete; it was not changed."));
    const [legacySettings, legacyQueue] = await Promise.all([readLegacySettings().catch(() => null), state.readLegacyQueue(app)]);
    const settings = validSettings(legacySettings);
    if (!settings || !legacyQueue || !await state.queueMatches(app, legacyQueue, settings.offset)) return blocked("Private state is not configured. Use the settings pane to set it up on this Mac.");
    try {
      const verifiedSettings = await state.stageMigration(app, settings, legacyQueue);
      state.remember(verifiedSettings);
      return { state, settings: verifiedSettings };
    } catch {
      return blocked("Private state migration could not be verified; no legacy data was changed.");
    }
  }
  async writeSettings(settings, snapshot = true) {
    const requested = { ...settings };
    const write = async () => {
      const saved = { ...requested, offset: Math.max(requested.offset, this.lastOffset) };
      await this.requireSettingsWrite(saved, snapshot);
      const text = JSON.stringify(saved);
      await this.node.fs.mkdir(this.directory, { recursive: true });
      const temporary = `${this.settingsPath}.tmp`;
      await this.node.fs.writeFile(temporary, text, "utf8");
      if (await this.node.fs.readFile(temporary, "utf8") !== text) throw new Error("Private settings verification failed.");
      await this.node.fs.rename(temporary, this.settingsPath);
      this.lastOffset = saved.offset;
    };
    const result = this.settingsChain.then(write, write);
    this.settingsChain = result.then(() => void 0, () => void 0);
    return result;
  }
  async prepareEmpty(app) {
    const [hasSettings, hasQueue] = await Promise.all([this.exists(this.settingsPath), this.exists(this.queuePath)]);
    if (hasSettings || hasQueue) throw new Error("Private state changed while it was being initialized.");
    const adapter = app.vault.adapter;
    if (await adapter.exists(this.legacySettingsPath) || await adapter.exists(this.legacyQueuePath)) throw new Error("Legacy private state needs recovery before a new queue can be created.");
    await this.node.fs.mkdir(this.directory, { recursive: true });
  }
  /** Capture exactly one complete prior pair before a primary-state mutation. */
  async snapshotPrevious(app = this.app) {
    const settings = await this.readSettings();
    const queue = await this.readQueue();
    if (!settings || !queue || !await this.queueMatches(app, queue, settings.offset)) return false;
    const parent = this.node.path.dirname(this.previousDirectory);
    const name = this.node.path.basename(this.previousDirectory);
    await this.node.fs.mkdir(parent, { recursive: true });
    const staged = await this.node.fs.mkdtemp(this.node.path.join(parent, `.${name}.stage-`));
    try {
      const settingsPath = this.node.path.join(staged, "settings.json");
      const queuePath = this.node.path.join(staged, "queue.sqlite");
      const text = JSON.stringify(settings);
      await Promise.all([this.node.fs.writeFile(settingsPath, text, "utf8"), this.node.fs.writeFile(queuePath, queue)]);
      const [verifiedText, verifiedQueue] = await Promise.all([this.node.fs.readFile(settingsPath, "utf8"), this.node.fs.readFile(queuePath)]);
      const verifiedSettings = validSettings(JSON.parse(verifiedText));
      if (verifiedText !== text || !verifiedSettings || !sameBytes(queue, verifiedQueue) || !await this.queueMatches(app, new Uint8Array(verifiedQueue), verifiedSettings.offset)) return false;
      await this.publishPrevious(staged);
      return true;
    } finally {
      await this.node.fs.rm(staged, { recursive: true, force: true }).catch(() => void 0);
    }
  }
  async readSettings() {
    try {
      return validSettings(JSON.parse(await this.node.fs.readFile(this.settingsPath, "utf8")));
    } catch {
      return null;
    }
  }
  async readQueue() {
    try {
      return validQueue(new Uint8Array(await this.node.fs.readFile(this.queuePath)));
    } catch {
      return null;
    }
  }
  async readLegacyQueue(app) {
    try {
      const adapter = app.vault.adapter;
      if (!await adapter.exists(this.legacyQueuePath)) return null;
      return validQueue(toBytes(await adapter.readBinary(this.legacyQueuePath)));
    } catch {
      return null;
    }
  }
  async queueMatches(app, bytes, offset) {
    try {
      const adapter = app.vault.adapter;
      const wasm = adapter.getResourcePath(`${this.wasmDirectory}/sql-wasm.wasm`);
      const SQL = await (await loadSqlJs())({ locateFile: () => wasm });
      const database = new SQL.Database(bytes);
      const integrity = database.exec("PRAGMA integrity_check")[0]?.values[0]?.[0] === "ok";
      const table = database.exec("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'updates'")[0]?.values.length;
      const maximum = database.exec("SELECT MAX(update_id) AS offset FROM updates")[0]?.values[0]?.[0];
      database.close();
      return Boolean(integrity && table && (maximum === null ? offset === 0 : Number(maximum) === offset));
    } catch {
      return false;
    }
  }
  async exists(path) {
    try {
      await this.node.fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
  async directoryExists() {
    try {
      return (await this.node.fs.stat(this.directory)).isDirectory();
    } catch {
      return false;
    }
  }
  async withRecovery(app, message) {
    return await this.previousIsGood(app) ? `${message} A previous-good private-state backup is available at ${this.previousDirectory}; recovery is manual.` : message;
  }
  async previousIsGood(app) {
    try {
      const [settingsText, queue] = await Promise.all([this.node.fs.readFile(this.previousSettingsPath, "utf8"), this.node.fs.readFile(this.previousQueuePath)]);
      const settings = validSettings(JSON.parse(settingsText));
      return Boolean(settings && validQueue(new Uint8Array(queue)) && await this.queueMatches(app, new Uint8Array(queue), settings.offset));
    } catch {
      return false;
    }
  }
  async protectQueueMutation() {
    const [hasSettings, hasQueue] = await Promise.all([this.exists(this.settingsPath), this.exists(this.queuePath)]);
    if (!hasSettings && !hasQueue) return;
    if (!hasSettings || !hasQueue || !await this.snapshotPrevious()) throw new Error("Private state backup could not be verified; refusing to replace the queue.");
  }
  async requireSettingsWrite(next, snapshot) {
    const [settings, queue] = await Promise.all([this.readSettings(), this.readQueue()]);
    if (!settings && !queue) return;
    if (!settings && queue && !snapshot && await this.queueMatches(this.app, queue, next.offset)) return;
    if (!settings || !queue) throw new Error("Private state is not complete; refusing to replace settings.");
    if (await this.queueMatches(this.app, queue, settings.offset)) {
      if (snapshot && !await this.snapshotPrevious()) throw new Error("Private state backup could not be verified; refusing to replace settings.");
      return;
    }
    if (!snapshot && await this.queueMatches(this.app, queue, next.offset)) return;
    throw new Error("Private state is inconsistent; refusing to replace settings.");
  }
  remember(settings) {
    this.lastOffset = settings.offset;
  }
  async stageMigration(app, settings, queue) {
    const parent = this.node.path.dirname(this.directory);
    const name = this.node.path.basename(this.directory);
    await this.node.fs.mkdir(parent, { recursive: true });
    const staged = await this.node.fs.mkdtemp(this.node.path.join(parent, `.${name}.migration-`));
    const stagedSettings = this.node.path.join(staged, "settings.json");
    const stagedQueue = this.node.path.join(staged, "queue.sqlite");
    try {
      const text = JSON.stringify(settings);
      await Promise.all([this.node.fs.writeFile(stagedSettings, text, "utf8"), this.node.fs.writeFile(stagedQueue, queue)]);
      const [verifiedText, verifiedQueue] = await Promise.all([this.node.fs.readFile(stagedSettings, "utf8"), this.node.fs.readFile(stagedQueue)]);
      const verifiedSettings = validSettings(JSON.parse(verifiedText));
      if (verifiedText !== text || !verifiedSettings || !sameBytes(queue, verifiedQueue) || !await this.queueMatches(app, new Uint8Array(verifiedQueue), verifiedSettings.offset)) throw new Error("Private state verification failed.");
      await this.node.fs.rename(staged, this.directory);
      return verifiedSettings;
    } catch (error) {
      await this.node.fs.rm(staged, { recursive: true, force: true }).catch(() => void 0);
      throw error;
    }
  }
  async publishPrevious(staged) {
    const previousExists = await this.exists(this.previousDirectory);
    const old = `${this.previousDirectory}.old-${Date.now()}`;
    if (previousExists) await this.node.fs.rename(this.previousDirectory, old);
    try {
      await this.node.fs.rename(staged, this.previousDirectory);
    } catch (error) {
      if (previousExists) await this.node.fs.rename(old, this.previousDirectory).catch(() => void 0);
      throw error;
    }
    if (previousExists) await this.node.fs.rm(old, { recursive: true, force: true });
  }
};
async function newLocalState(app, pluginDirectory) {
  const node = await loadNode();
  const vaultPath = String(app.vault.adapter.getBasePath?.() ?? app.vault.getName());
  const directory = node.path.join(node.os.homedir(), "Library", "Application Support", "Obsidian", "daily-intake", stableId(vaultPath));
  return new LocalState(app, node, directory, node.path.join(directory, "settings.json"), node.path.join(directory, "queue.sqlite"), `${pluginDirectory}/data.json`, `${pluginDirectory}/queue.sqlite`, pluginDirectory);
}
function blocked(reason) {
  return { state: null, settings: { ...DEFAULT_SETTINGS, status: reason }, reason };
}
function validQueue(value) {
  return value.byteLength >= 16 && new TextDecoder().decode(value.slice(0, 16)) === "SQLite format 3\0" ? value : null;
}
function validSettings(value) {
  if (!value || typeof value !== "object") return null;
  const source = value;
  const numberOrNull = (key) => source[key] === null || typeof source[key] === "number" && Number.isSafeInteger(source[key]);
  if (typeof source.enabled !== "boolean" || typeof source.token !== "string" || typeof source.offset !== "number" || !Number.isSafeInteger(source.offset) || source.offset < 0 || !numberOrNull("ownerUserId") || !numberOrNull("ownerChatId") || typeof source.pairArmed !== "boolean" || typeof source.journal !== "string" || typeof source.attachmentRoot !== "string" || typeof source.status !== "string") return null;
  return { ...DEFAULT_SETTINGS, ...source };
}
function toBytes(value) {
  return value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value);
}
function sameBytes(first, second) {
  return first.byteLength === second.byteLength && first.every((byte, index) => byte === second[index]);
}
function stableId(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `vault-${(hash >>> 0).toString(16)}`;
}
async function loadNode() {
  return {
    fs: require("node:fs/promises"),
    os: require("node:os"),
    path: require("node:path")
  };
}

// src/helpers.ts
function telegramCommand(text) {
  return /^\/([a-z0-9_]+)(?:@[^\s]+)?(?:\s|$)/i.exec(text ?? "")?.[1].toLowerCase() ?? null;
}
function acceptsPrivateSender(message, senderId, userId, chatId, pairingArmed) {
  if (!message || senderId === void 0 || message.chat.type !== "private") return null;
  if (pairingArmed && userId === null) return "pair";
  return senderId === userId && message.chat.id === chatId ? "owner" : null;
}
function groupKey(id, mediaGroupId) {
  return mediaGroupId ?? String(id);
}
function intakeDate(milliseconds) {
  const date = new Date(milliseconds);
  if (date.getHours() < 4) date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function safeProse(text) {
  return text.replace(/^\s*#{1,6}\s/gm, (heading) => `\\${heading.trimStart()}`).replace(/^\s*>/gm, "\\>").replace(/^\s*- \[[ xX]\]/gm, (task) => `\\${task.trimStart()}`).replace(/^\s*!\[\[/gm, "\\![[");
}
function calloutLines(text) {
  return safeProse(text).split("\n").map((line) => `> ${line}`).join("\n");
}
function attachmentStem(value) {
  return `${value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "telegram-file"}-${stableSuffix(value)}`;
}
function attachmentPath(root, date, fileIdentity, extension2, isVoice = false) {
  const prefix = isVoice ? "telegram-voice-" : "";
  return `${root.replace(/^\/+|\/+$/g, "")}/${date}/${prefix}${attachmentStem(fileIdentity)}.${extension2.replace(/^\./, "")}`;
}
function stashPath(folder, milliseconds, index, extension2) {
  const date = new Date(milliseconds);
  const pad = (value) => String(value).padStart(2, "0");
  return `${folder}/${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}-${index}.${extension2.replace(/^\./, "")}`;
}
function isImage(message) {
  return Boolean(message.photo?.length || message.document?.mime_type?.startsWith("image/"));
}
function canClaimIds(ids) {
  return ids.length > 0;
}
function parseSelectionIds(text) {
  const value = text?.trim();
  if (!value || !/^\d+(?:[\s,]+\d+)*$/.test(value)) return null;
  const ids = value.split(/[\s,]+/).map(Number);
  if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) return null;
  return [...new Set(ids)];
}
function isSupportedContent(message) {
  return Boolean(message.text || message.caption || message.voice || message.audio || message.photo?.length || message.video || message.document || message.animation);
}
function stableSuffix(value) {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36);
}

// src/storage.ts
var SCHEMA = `
CREATE TABLE IF NOT EXISTS updates (
  update_id INTEGER PRIMARY KEY, raw TEXT NOT NULL, received_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT, update_id INTEGER NOT NULL UNIQUE,
  state TEXT NOT NULL, kind TEXT, designation TEXT NOT NULL DEFAULT 'daily', payload TEXT NOT NULL, media_group_id TEXT,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, error TEXT,
  prompt_chat_id INTEGER, prompt_message_id INTEGER, deferred_until INTEGER, claim_started_at INTEGER
);
CREATE INDEX IF NOT EXISTS queue_state_created ON queue(state, created_at);
CREATE INDEX IF NOT EXISTS queue_group ON queue(media_group_id, state);
CREATE TABLE IF NOT EXISTS attachment_paths (identity TEXT PRIMARY KEY, path TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS bot_session (
  id INTEGER PRIMARY KEY CHECK (id = 1), mode TEXT NOT NULL, leader_ids TEXT NOT NULL,
  ordinal_leader_ids TEXT NOT NULL DEFAULT '[]',
  menu_chat_id INTEGER NOT NULL, menu_message_id INTEGER NOT NULL, page INTEGER NOT NULL,
  after_id INTEGER NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
`;
var QueueStore = class {
  constructor(app, pathOrPluginDir, options) {
    this.app = app;
    this.chain = Promise.resolve();
    this.path = options ? pathOrPluginDir : `${pathOrPluginDir}/queue.sqlite`;
    this.files = options?.files ?? this.app.vault.adapter;
    this.wasmDirectory = options?.wasmDirectory ?? pathOrPluginDir;
    this.beforeFlush = options?.beforeFlush;
  }
  async open(expectedOffset = 0) {
    const adapter = this.app.vault.adapter;
    const wasm = adapter.getResourcePath(`${this.wasmDirectory}/sql-wasm.wasm`);
    const SQL = await (await loadSqlJs())({ locateFile: () => wasm });
    this.SQL = SQL;
    let changed = false;
    if (expectedOffset > 0) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          if (await this.files.exists(this.path)) {
            const candidate = new SQL.Database(toBytes2(await this.files.readBinary(this.path)));
            const result = candidate.exec("SELECT 1 FROM updates WHERE update_id = ?", [expectedOffset]);
            if (result[0]?.values.length) {
              this.db = candidate;
              break;
            }
            candidate.close();
          }
        } catch {
        }
        if (attempt < 2) await pause(50);
      }
      if (!this.db) throw new Error(`Queue database is missing persisted Telegram offset ${expectedOffset}; refusing to overwrite it.`);
    } else {
      if (await this.files.exists(this.path)) this.db = new SQL.Database(toBytes2(await this.files.readBinary(this.path)));
      else {
        this.db = new SQL.Database();
        changed = true;
      }
    }
    this.db.run(SCHEMA);
    changed = this.addColumn("deferred_until INTEGER") || changed;
    changed = this.addColumn("claim_started_at INTEGER") || changed;
    changed = this.addColumn("designation TEXT NOT NULL DEFAULT 'daily'") || changed;
    changed = this.addSessionColumn("ordinal_leader_ids TEXT NOT NULL DEFAULT '[]'") || changed;
    if (changed) await this.flush();
  }
  close() {
    return this.serial(async () => {
      this.db?.close();
    });
  }
  record(update, message, accepted, beforePersist) {
    return this.serial(async () => {
      const existing = this.one("SELECT 1 FROM updates WHERE update_id = ?", [update.update_id]);
      if (existing) return false;
      await beforePersist?.();
      const now = Date.now();
      this.db.run("INSERT INTO updates(update_id, raw, received_at) VALUES (?, ?, ?)", [update.update_id, JSON.stringify(update), now]);
      if (message && accepted) {
        const state = "pending";
        this.db.run(`INSERT INTO queue(update_id,state,payload,media_group_id,created_at,updated_at)
          VALUES (?, ?, ?, ?, ?, ?)`, [update.update_id, state, JSON.stringify(message), message.media_group_id ?? null, now, now]);
      }
      await this.flush();
      return true;
    });
  }
  settleGroups() {
    return this.serial(async () => void 0);
  }
  pending(limit = 8) {
    return this.serial(async () => {
      const now = Date.now();
      const rows = this.rows("SELECT q.* FROM queue q WHERE q.state = 'pending' AND (q.deferred_until IS NULL OR q.deferred_until <= ?) AND (q.claim_started_at IS NULL OR q.claim_started_at < ?) AND (q.media_group_id IS NULL OR NOT EXISTS (SELECT 1 FROM queue member WHERE member.media_group_id = q.media_group_id AND member.updated_at >= ?)) ORDER BY q.created_at LIMIT ?", [now, now - 3e5, now - 1800, limit]);
      return rows.map((row) => this.item(row));
    });
  }
  group(item) {
    return this.serial(async () => {
      if (!item.mediaGroupId) return [item];
      return this.rows("SELECT * FROM queue WHERE state IN ('pending','failed') AND media_group_id = ? AND (claim_started_at IS NULL OR claim_started_at < ?) ORDER BY id", [item.mediaGroupId, Date.now() - 3e5]).map((r) => this.item(r));
    });
  }
  byId(id) {
    return this.serial(async () => {
      const row = this.one("SELECT * FROM queue WHERE id = ? AND state IN ('pending','failed') AND (claim_started_at IS NULL OR claim_started_at < ?)", [id, Date.now() - 3e5]);
      return row ? this.item(row) : null;
    });
  }
  setPrompt(ids, chatId, messageId) {
    return this.serial(async () => {
      for (const id of ids) this.db.run("UPDATE queue SET prompt_chat_id=?, prompt_message_id=?, updated_at=? WHERE id=?", [chatId, messageId, Date.now(), id]);
      await this.flush();
    });
  }
  setDesignation(leaderId, designation) {
    return this.serial(async () => {
      const items = this.expandLeaders([leaderId]);
      if (!items) throw new Error("Queue item is no longer available.");
      const ids = items.map((item) => item.id);
      const marks = ids.map(() => "?").join(",");
      this.db.run(`UPDATE queue SET designation=?, updated_at=? WHERE id IN (${marks})`, [designation, Date.now(), ...ids]);
      await this.flush();
    });
  }
  claim(ids, kind) {
    if (!canClaimIds(ids)) return Promise.resolve(null);
    return this.serial(async () => {
      const marks = ids.map(() => "?").join(",");
      const rows = this.rows(`SELECT * FROM queue WHERE id IN (${marks}) AND state IN ('pending','failed') AND (claim_started_at IS NULL OR claim_started_at < ?)`, [...ids, Date.now() - 3e5]);
      if (rows.length !== ids.length) return null;
      this.db.run(`UPDATE queue SET kind=?, claim_started_at=?, updated_at=? WHERE id IN (${marks})`, [kind, Date.now(), Date.now(), ...ids]);
      await this.flush();
      return rows.map((row) => this.item(row));
    });
  }
  claimLeaders(leaderIds, kind) {
    if (!canClaimIds(leaderIds)) return Promise.resolve(null);
    return this.serial(async () => {
      const items = this.expandLeaders(leaderIds);
      if (!items) return null;
      const ids = items.map((item) => item.id);
      const marks = ids.map(() => "?").join(",");
      this.db.run(`UPDATE queue SET kind=?, claim_started_at=?, updated_at=? WHERE id IN (${marks})`, [kind, Date.now(), Date.now(), ...ids]);
      await this.flush();
      return items;
    });
  }
  logicalItems(leaderIds) {
    return this.serial(async () => this.expandLeaders(leaderIds));
  }
  selection(ids) {
    return this.serial(async () => {
      const leaderIds = [];
      for (const id of ids) {
        const row = this.one("SELECT * FROM queue WHERE id = ? AND state IN ('pending','failed') AND (claim_started_at IS NULL OR claim_started_at < ?)", [id, Date.now() - 3e5]);
        if (!row) return null;
        const leaderId = row.media_group_id ? Number(this.one("SELECT MIN(id) AS id FROM queue WHERE media_group_id = ? AND state IN ('pending','failed')", [row.media_group_id])?.id) : Number(row.id);
        if (!leaderIds.includes(leaderId)) leaderIds.push(leaderId);
      }
      const items = this.expandLeaders(leaderIds);
      return items ? { leaderIds, items } : null;
    });
  }
  finish(ids, error) {
    return this.serial(async () => {
      const marks = ids.map(() => "?").join(",");
      this.db.run(`UPDATE queue SET state=?, error=?, claim_started_at=NULL, updated_at=? WHERE id IN (${marks})`, [error ? "failed" : "resolved", error ?? null, Date.now(), ...ids]);
      await this.flush();
    });
  }
  release(ids, error) {
    return this.serial(async () => {
      for (const id of ids) this.db.run("UPDATE queue SET state='failed', error=?, claim_started_at=NULL, updated_at=? WHERE id=?", [error, Date.now(), id]);
      await this.flush();
    });
  }
  reserveAttachment(identity, initialPath) {
    return this.serial(async () => {
      const known = this.one("SELECT path FROM attachment_paths WHERE identity = ?", [identity]);
      if (known) return known.path;
      const extensionAt = initialPath.lastIndexOf(".");
      const base = extensionAt > initialPath.lastIndexOf("/") ? initialPath.slice(0, extensionAt) : initialPath;
      const extension2 = base === initialPath ? "" : initialPath.slice(extensionAt);
      let path = initialPath;
      let index = 2;
      while (await this.app.vault.adapter.exists(path)) path = `${base}-${index++}${extension2}`;
      this.db.run("INSERT INTO attachment_paths(identity, path) VALUES (?, ?)", [identity, path]);
      await this.flush();
      return path;
    });
  }
  defer(ids) {
    return this.serial(async () => {
      for (const id of ids) this.db.run("UPDATE queue SET state='pending', error=NULL, prompt_chat_id=NULL, prompt_message_id=NULL, deferred_until=?, claim_started_at=NULL, updated_at=? WHERE id=?", [Date.now() + 36e5, Date.now(), id]);
      await this.flush();
    });
  }
  discard(ids) {
    return this.serial(async () => {
      const marks = ids.map(() => "?").join(",");
      this.db.run(`UPDATE queue SET state='discarded', error=NULL, prompt_chat_id=NULL, prompt_message_id=NULL, deferred_until=NULL, claim_started_at=NULL, updated_at=? WHERE id IN (${marks})`, [Date.now(), ...ids]);
      await this.flush();
    });
  }
  page(page, size = 8) {
    return this.serial(async () => ({
      items: this.rows("SELECT * FROM queue WHERE state IN ('pending','failed') ORDER BY created_at LIMIT ? OFFSET ?", [size, page * size]).map((r) => this.item(r)),
      total: Number(this.one("SELECT COUNT(*) AS count FROM queue WHERE state IN ('pending','failed')")?.count ?? 0)
    }));
  }
  logicalPage(page, size = 8) {
    return this.serial(async () => {
      const rows = this.rows("SELECT * FROM queue WHERE state IN ('pending','failed') ORDER BY created_at, id");
      const leaders = [];
      const groups = /* @__PURE__ */ new Set();
      for (const row of rows) {
        if (row.media_group_id && groups.has(String(row.media_group_id))) continue;
        if (row.media_group_id) groups.add(String(row.media_group_id));
        leaders.push(row);
      }
      return { items: leaders.slice(page * size, (page + 1) * size).map((row) => this.item(row)), total: leaders.length };
    });
  }
  session() {
    return this.serial(async () => {
      const row = this.one("SELECT * FROM bot_session WHERE id = 1");
      return row ? this.botSession(row) : null;
    });
  }
  saveSession(value) {
    return this.serial(async () => {
      const now = Date.now();
      const existing = this.one("SELECT created_at FROM bot_session WHERE id = 1");
      this.db.run(`INSERT OR REPLACE INTO bot_session(id,mode,leader_ids,ordinal_leader_ids,menu_chat_id,menu_message_id,page,after_id,created_at,updated_at)
        VALUES (1,?,?,?,?,?,?,?,?,?)`, [value.mode, JSON.stringify(value.leaderIds), JSON.stringify(value.ordinalLeaderIds ?? []), value.menuChatId, value.menuMessageId, value.page, value.afterId ?? 0, existing?.created_at ?? now, now]);
      await this.flush();
      return this.sessionUnsafe();
    });
  }
  clearSession() {
    return this.serial(async () => {
      this.db.run("DELETE FROM bot_session WHERE id = 1");
      await this.flush();
    });
  }
  item(row) {
    return { id: Number(row.id), updateId: Number(row.update_id), state: row.state, kind: row.kind, designation: row.designation === "agent" ? "agent" : "daily", payload: JSON.parse(row.payload), mediaGroupId: row.media_group_id, createdAt: Number(row.created_at), error: row.error, promptChatId: row.prompt_chat_id, promptMessageId: row.prompt_message_id };
  }
  expandLeaders(leaderIds) {
    const result = [];
    const seen = /* @__PURE__ */ new Set();
    for (const leaderId of leaderIds) {
      const leader = this.one("SELECT * FROM queue WHERE id = ? AND state IN ('pending','failed') AND (claim_started_at IS NULL OR claim_started_at < ?)", [leaderId, Date.now() - 3e5]);
      if (!leader) return null;
      const rows = leader.media_group_id ? this.rows("SELECT * FROM queue WHERE media_group_id = ? AND state IN ('pending','failed') AND (claim_started_at IS NULL OR claim_started_at < ?) ORDER BY id", [leader.media_group_id, Date.now() - 3e5]) : [leader];
      for (const row of rows) {
        const item = this.item(row);
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item);
        }
      }
    }
    return result;
  }
  sessionUnsafe() {
    const row = this.one("SELECT * FROM bot_session WHERE id = 1");
    return row ? this.botSession(row) : null;
  }
  botSession(row) {
    const mode = row.mode === "awaiting_ids" ? "awaiting_ids" : row.mode === "standalone" ? "standalone" : "bundle";
    return { mode, leaderIds: JSON.parse(row.leader_ids), ordinalLeaderIds: JSON.parse(row.ordinal_leader_ids ?? "[]"), menuChatId: Number(row.menu_chat_id), menuMessageId: Number(row.menu_message_id), page: Number(row.page), afterId: Number(row.after_id), createdAt: Number(row.created_at), updatedAt: Number(row.updated_at) };
  }
  addColumn(column) {
    try {
      this.db.run(`ALTER TABLE queue ADD COLUMN ${column}`);
      return true;
    } catch {
      return false;
    }
  }
  addSessionColumn(column) {
    try {
      this.db.run(`ALTER TABLE bot_session ADD COLUMN ${column}`);
      return true;
    } catch {
      return false;
    }
  }
  one(sql, params = []) {
    return this.rows(sql, params)[0] ?? null;
  }
  rows(sql, params = []) {
    const result = this.db.exec(sql, params)[0];
    return result ? result.values.map((v) => Object.fromEntries(result.columns.map((c, i) => [c, v[i]]))) : [];
  }
  async flush() {
    try {
      await this.beforeFlush?.();
    } catch (error) {
      await this.restoreDiskState();
      throw error;
    }
    await this.files.writeBinary(this.path, this.db.export());
  }
  async restoreDiskState() {
    try {
      const restored = new this.SQL.Database(toBytes2(await this.files.readBinary(this.path)));
      this.db?.close();
      this.db = restored;
    } catch {
      this.db?.close();
      this.db = void 0;
    }
  }
  serial(work) {
    const result = this.chain.then(work, work);
    this.chain = result.then(() => void 0, () => void 0);
    return result;
  }
};
function toBytes2(value) {
  return value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value);
}
var pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// src/settings.ts
var import_obsidian = require("obsidian");
var DailyIntakeSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("daily-intake-settings");
    containerEl.createEl("h2", { text: "Daily Intake" });
    const status = containerEl.createDiv({ cls: "daily-intake-status" });
    const statusText = this.plugin.settings.status;
    status.dataset.state = /^(Stopped|Needs attention|Polling retry)|conflict|could not/i.test(statusText) ? "warning" : /^(Polling|Waiting|Paired)/.test(statusText) ? "active" : "idle";
    status.createSpan({ cls: "daily-intake-status-dot" });
    status.createSpan({ cls: "daily-intake-status-text", text: statusText });
    new import_obsidian.Setting(containerEl).setName("Enable on this Mac").setDesc("Polling is off by default and stays off until you opt in here.").addToggle((toggle) => toggle.setValue(this.plugin.settings.enabled).onChange(async (value) => {
      this.plugin.settings.enabled = value;
      await this.plugin.saveSettings();
      await this.plugin.restartPolling();
      this.display();
    }));
    new import_obsidian.Setting(containerEl).setName("Telegram bot token").setDesc("Stored only in this Mac\u2019s private Daily Intake state, outside the synced vault. A token is never placed in notes or the queue.").addText((text) => text.setPlaceholder("123456:ABC\u2026").setValue(this.plugin.settings.token).inputEl.type = "password").addButton((button2) => button2.setButtonText("Save").onClick(async () => {
      const input = containerEl.querySelector("input[type=password]");
      if (input) {
        this.plugin.settings.token = input.value.trim();
        await this.plugin.saveSettings();
        await this.plugin.restartPolling();
        this.display();
      }
    }));
    const pair = new import_obsidian.Setting(containerEl).setName("Pair a private Telegram chat").setDesc(this.plugin.settings.ownerUserId ? `Paired to user ${this.plugin.settings.ownerUserId}. Unpair before replacing this chat.` : "Arm this, then send the bot a private message.");
    if (!this.plugin.settings.ownerUserId) pair.addButton((button2) => button2.setButtonText("Pair next sender").onClick(async () => {
      this.plugin.settings.pairArmed = true;
      await this.plugin.saveSettings();
      await this.plugin.restartPolling();
      this.display();
    }));
    if (this.plugin.settings.ownerUserId) pair.addButton((button2) => button2.setButtonText("Unpair").setWarning().onClick(async () => {
      this.plugin.settings.ownerUserId = null;
      this.plugin.settings.ownerChatId = null;
      this.plugin.settings.pairArmed = false;
      await this.plugin.saveSettings();
      await this.plugin.restartPolling();
      this.display();
    }));
    new import_obsidian.Setting(containerEl).setName("Journal").setDesc("The daily Journal to append after you choose Daily content.").addText((text) => text.setValue(this.plugin.settings.journal).onChange(async (value) => {
      this.plugin.settings.journal = value.trim() || "Personal Daily";
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Attachment folder").setDesc("Vault-relative root; files go in a YYYY-MM-DD subfolder matching the daily note. Downloaded only when an item is resolved.").addText((text) => text.setValue(this.plugin.settings.attachmentRoot).onChange(async (value) => {
      this.plugin.settings.attachmentRoot = value.trim() || "Strata/Attachments/Continuum/Time/Daily";
      await this.plugin.saveSettings();
    }));
  }
};

// src/telegram.ts
var import_obsidian2 = require("obsidian");
var API = "https://api.telegram.org/bot";
var TelegramClient = class {
  constructor(token, requestBinary = import_obsidian2.requestUrl) {
    this.token = token;
    this.requestBinary = requestBinary;
  }
  async updates(offset, signal) {
    return this.call("getUpdates", { offset, timeout: 25, allowed_updates: ["message", "callback_query"] }, signal);
  }
  commands() {
    return this.call("setMyCommands", { commands: [{ command: "queue", description: "Show pending intake" }, { command: "cancel", description: "Cancel the active bundle session" }, { command: "status", description: "Show Daily Intake status" }] });
  }
  answerCallbackQuery(id, text) {
    return this.call("answerCallbackQuery", { callback_query_id: id, text, show_alert: false });
  }
  sendMessage(chatId, text, replyMarkup) {
    return this.call("sendMessage", { chat_id: chatId, text, reply_markup: replyMarkup });
  }
  editMessage(chatId, messageId, text, replyMarkup) {
    return this.call("editMessageText", { chat_id: chatId, message_id: messageId, text, reply_markup: replyMarkup });
  }
  async file(fileId) {
    return this.call("getFile", { file_id: fileId });
  }
  async download(filePath) {
    let response;
    try {
      response = await this.requestBinary({ url: `https://api.telegram.org/file/bot${this.token()}/${filePath}`, throw: false });
    } catch {
      throw new Error("Telegram file download failed.");
    }
    if (response.status < 200 || response.status >= 300) throw new Error(`Telegram file download failed (${response.status}).`);
    return response.arrayBuffer;
  }
  async call(method, body, signal) {
    const response = await fetch(`${API}${this.token()}/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal });
    const data = await response.json().catch(() => ({ ok: false, description: `HTTP ${response.status}` }));
    if (!response.ok || !data.ok) {
      const error = new Error(data.description ?? `Telegram ${method} failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return data.result;
  }
};

// src/main.ts
var SHUTDOWN_KEY = Symbol.for("daily-intake.shutdown");
var STASH_FOLDER = "Strata/Attachments/Intake";
var DailyIntakePlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.localState = null;
    this.telegram = new TelegramClient(() => this.settings.token);
    this.stopped = false;
    this.polling = null;
    this.pollingAbort = null;
    this.settling = null;
    this.settleAgain = false;
  }
  async onload() {
    await globalThis[SHUTDOWN_KEY]?.catch(() => void 0);
    const pluginDir = `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
    this.addSettingTab(new DailyIntakeSettingsTab(this.app, this));
    this.addCommand({ id: "show-status", name: "Show intake status", callback: () => new import_obsidian3.Notice(this.settings.status) });
    this.addCommand({ id: "show-queue", name: "Show pending intake", callback: () => void this.showQueue() });
    if (!import_obsidian3.Platform.isDesktopApp || !import_obsidian3.Platform.isMacOS) {
      this.settings = { ...DEFAULT_SETTINGS, status: "Daily Intake private state is available only on desktop macOS." };
      return;
    }
    const loaded = await this.loadPrivateState(pluginDir);
    this.settings = loaded.settings;
    this.localState = loaded.state;
    if (!this.localState) return;
    this.store = this.queueStore(this.localState);
    try {
      await this.store.open(this.settings.offset);
    } catch {
      this.localState = null;
      this.settings = { ...DEFAULT_SETTINGS, status: "Private state is unreadable or inconsistent; it was not changed." };
      return;
    }
    this.registerInterval(window.setInterval(() => void this.settleAndPrompt(), 2500));
    await this.restartPolling();
  }
  onunload() {
    this.stopped = true;
    this.pollingAbort?.abort();
    const polling = this.polling;
    const settling = this.settling;
    const store = this.store;
    const shutdown = (async () => {
      await polling?.catch(() => void 0);
      await settling?.catch(() => void 0);
      await store?.close();
    })().catch(() => void 0);
    globalThis[SHUTDOWN_KEY] = shutdown;
    void shutdown.then(() => {
      if (globalThis[SHUTDOWN_KEY] === shutdown) delete globalThis[SHUTDOWN_KEY];
    });
  }
  async saveSettings(snapshot = true) {
    if (!import_obsidian3.Platform.isDesktopApp || !import_obsidian3.Platform.isMacOS) return;
    if (!this.localState) {
      const pluginDir = `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
      const created = await newLocalState(this.app, pluginDir);
      await created.prepareEmpty(this.app);
      const store = this.queueStore(created, false);
      await store.open(0);
      await store.close();
      this.localState = created;
      await this.localState.writeSettings(this.settings, false);
      this.store = this.queueStore(created);
      await this.store.open(0);
      return;
    }
    await this.localState.writeSettings(this.settings, snapshot);
  }
  async restartPolling() {
    this.stopped = true;
    this.pollingAbort?.abort();
    await this.polling?.catch(() => void 0);
    this.polling = null;
    if (!this.settings.enabled) return this.setStatus("Disabled on this device.");
    if (!this.settings.token) return this.setStatus("Stopped: add a Telegram bot token.");
    if (!this.settings.ownerUserId && !this.settings.pairArmed) return this.setStatus("Stopped: pair a private Telegram chat first.");
    this.stopped = false;
    await this.setStatus(this.settings.ownerUserId ? "Polling your paired private chat." : "Waiting to pair the next private sender.");
    this.polling = this.poll();
    if (this.settings.ownerUserId) void this.telegram.commands().catch((error) => this.setStatus(`Polling, but could not set bot commands: ${error.message}`));
  }
  async poll() {
    while (!this.stopped) {
      try {
        this.pollingAbort = new AbortController();
        const updates = await this.telegram.updates(this.settings.offset + 1, this.pollingAbort.signal);
        this.pollingAbort = null;
        for (const update of updates) await this.handleUpdate(update);
      } catch (error) {
        if (this.stopped) return;
        const message = String(error?.message ?? error);
        if (error?.status === 409 || /webhook|conflict/i.test(message)) {
          await this.setStatus(`Stopped: Telegram polling conflict (${message}). Remove the webhook or other poller yourself; Daily Intake will not change it.`);
          this.stopped = true;
          return;
        }
        await this.setStatus(`Polling retry: ${message}`);
        await pause2(3e3);
      }
    }
  }
  async handleUpdate(update) {
    const message = update.message ?? update.callback_query?.message;
    const from = update.message?.from ?? update.callback_query?.from;
    const sender = acceptsPrivateSender(message, from?.id, this.settings.ownerUserId, this.settings.ownerChatId, this.settings.pairArmed);
    const pairing = sender === "pair";
    let allowed = sender === "owner";
    const command = telegramCommand(update.message?.text);
    const session = allowed ? await this.store.session() : null;
    const idReply = Boolean(update.message && !command && session?.mode === "awaiting_ids");
    const inserted = await this.store.record(update, update.message, (allowed || pairing) && !command && !idReply);
    this.settings.offset = Math.max(this.settings.offset, update.update_id);
    await this.saveSettings(false);
    if (!inserted) return;
    if (pairing) {
      this.settings.ownerUserId = from.id;
      this.settings.ownerChatId = message.chat.id;
      this.settings.pairArmed = false;
      await this.saveSettings();
      await this.setStatus("Paired. Polling your private Telegram chat.");
      void this.telegram.commands().catch(() => void 0);
      void this.telegram.sendMessage(message.chat.id, "Daily Intake paired. Send an item, then choose where it belongs.").catch(() => void 0);
      allowed = true;
    }
    if (!allowed) return;
    if (update.callback_query) {
      void this.telegram.answerCallbackQuery(update.callback_query.id, "Working on it\u2026").catch(() => void 0);
      await this.handleCallback(update.callback_query.data ?? "", message);
      return;
    }
    if (!update.message) return;
    if (command) {
      if (command === "cancel") await this.cancelSession();
      if (command === "queue") await this.sendQueue(update.message.chat.id, 0);
      if (command === "status") await this.telegram.sendMessage(update.message.chat.id, this.settings.status);
      return;
    }
    if (idReply) {
      await this.handleIdReply(update.message, session);
      return;
    }
    await this.settleAndPrompt();
  }
  async settleAndPrompt() {
    if (this.stopped || !this.store || !this.settings.ownerChatId) return;
    if (this.settling) {
      this.settleAgain = true;
      return this.settling;
    }
    this.settling = this.runSettlePasses();
    try {
      await this.settling;
    } finally {
      this.settling = null;
    }
  }
  async runSettlePasses() {
    do {
      this.settleAgain = false;
      await this.store.settleGroups();
      let session = await this.store.session();
      const held = new Set((session ? await this.store.logicalItems(session.leaderIds) ?? [] : []).map((item) => item.id));
      const items = await this.store.pending();
      const seen = /* @__PURE__ */ new Set();
      for (const item of items) {
        const key = groupKey(item.id, item.mediaGroupId ?? void 0);
        if (seen.has(key)) continue;
        seen.add(key);
        const group = await this.store.group(item);
        if (group.some((member) => held.has(member.id))) continue;
        if (group.some((member) => member.promptMessageId)) continue;
        const supported = group.every((member) => isSupportedContent(member.payload));
        if (!supported) {
          const prompt = await this.telegram.sendMessage(this.settings.ownerChatId, `${this.describe(group)}

Unsupported owner content cannot be appended automatically.`, { inline_keyboard: initialActionRows(item.id) });
          await this.store.setPrompt(group.map((member) => member.id), this.settings.ownerChatId, prompt.message_id);
          continue;
        }
        const selection = await this.store.selection([...session?.leaderIds ?? [], item.id]);
        if (!selection) continue;
        if (!session) {
          const prompt = await this.telegram.sendMessage(this.settings.ownerChatId, "Starting intake bundle\u2026");
          session = await this.store.saveSession({ mode: "bundle", leaderIds: selection.leaderIds, menuChatId: this.settings.ownerChatId, menuMessageId: prompt.message_id, page: 0, afterId: 0 });
        } else {
          session = await this.store.saveSession({ ...session, mode: "bundle", leaderIds: selection.leaderIds, ordinalLeaderIds: [] });
        }
        await this.store.setPrompt(group.map((member) => member.id), session.menuChatId, session.menuMessageId);
        group.forEach((member) => held.add(member.id));
        await this.showSession(session);
      }
    } while (this.settleAgain && !this.stopped);
  }
  async handleCallback(data, message) {
    const page = /^di:q:p:(\d+)$/.exec(data);
    if (page) {
      if (await this.store.session()) return void await this.staleControl(message);
      return void await this.editQueue(message.chat.id, message.message_id, Number(page[1]));
    }
    const detail = /^di:q:o:(\d+):(\d+)$/.exec(data);
    if (detail) {
      if (await this.store.session()) return void await this.staleControl(message);
      return void await this.openDetail(Number(detail[1]), message, Number(detail[2]));
    }
    const unsupportedAction = /^di:u:(\d+):(x|q)$/.exec(data);
    if (unsupportedAction) {
      if (unsupportedAction[2] === "q") return void await this.backFromUnsupported(message);
      return void await this.resolveStandalone("discard", message, Number(unsupportedAction[1]));
    }
    const action = /^di:b:(f|s|t|x|l|r|c|q|sc|sd|sa|si)$/.exec(data)?.[1];
    if (!action) return;
    const session = await this.store.session();
    if (!session) return void await this.editQueue(message.chat.id, message.message_id, 0);
    if (session.menuChatId !== message.chat.id || session.menuMessageId !== message.message_id) return void await this.staleControl(message);
    if (action === "r") return void await this.showSession(session);
    if (action === "c" || action === "q") return void await this.laterBundle(session, message);
    if (action === "sc") {
      const saved = await this.store.saveSession({ ...session, mode: "bundle" });
      return void await this.showSession(saved);
    }
    if (action === "f") return void await this.finishBundle(session, message);
    if (action === "s") {
      const saved = await this.store.saveSession({ ...session, mode: "standalone" });
      return void await this.showSession(saved);
    }
    if (action === "t") return void await this.toggleLatest(session);
    if (action === "x") return void await this.discardLatest(session, message);
    if (action === "l") return void await this.laterBundle(session, message);
    if (action === "si") return void await this.stashLatest(session, message);
    await this.saveLatest(action === "sa" ? "agent" : "daily", session, message);
  }
  async resolveStandalone(kind, message, leaderId) {
    const session = await this.store.session();
    const claimed = await this.store.claimLeaders([leaderId], kind);
    if (!claimed) return void await this.telegram.editMessage(message.chat.id, message.message_id, "That unsupported item was already resolved or is currently being handled. Use /queue to recover.", { inline_keyboard: [] });
    const ids = claimed.map((item) => item.id);
    try {
      await this.store.discard(ids);
      if (session) await this.telegram.editMessage(message.chat.id, message.message_id, "Unsupported item discarded.", { inline_keyboard: [] });
      else await this.editQueue(message.chat.id, message.message_id, 0);
    } catch (error) {
      const detail = String(error?.message ?? error);
      await this.store.release(ids, detail);
      await this.telegram.editMessage(message.chat.id, message.message_id, `Not discarded: ${detail}`, { inline_keyboard: initialActionRows(leaderId) });
      await this.setStatus(`Needs attention: ${detail}`);
    }
  }
  async backFromUnsupported(message) {
    if (await this.store.session()) {
      await this.telegram.editMessage(message.chat.id, message.message_id, "A bundle is already active. Use /queue to open its current controls.", { inline_keyboard: [] });
      return;
    }
    await this.editQueue(message.chat.id, message.message_id, 0);
  }
  async finishBundle(session, message) {
    const claimed = await this.store.claimLeaders(session.leaderIds, "daily");
    if (!claimed) return void await this.sessionError(session, message, "One or more bundle items are no longer available.");
    const ids = claimed.map((item) => item.id);
    try {
      await this.appendMixed(session.leaderIds, claimed);
      await this.store.finish(ids);
      await this.store.clearSession();
      await this.editQueue(message.chat.id, message.message_id, session.page);
    } catch (error) {
      const detail = String(error?.message ?? error);
      await this.store.release(ids, detail);
      await this.sessionError(session, message, `Bundle not saved: ${detail}`);
      await this.setStatus(`Needs attention: ${detail}`);
    }
  }
  async saveLatest(kind, session, message) {
    const leaderId = session.leaderIds.at(-1);
    const selection = await this.store.selection([leaderId]);
    if (!selection) return void await this.sessionError(session, message, "The latest item is no longer available.");
    if (!selection.items.every((item) => isSupportedContent(item.payload))) return void await this.sessionError(session, message, "This item cannot be saved automatically.");
    await this.store.setDesignation(leaderId, kind);
    const claimed = await this.store.claimLeaders([leaderId], kind);
    if (!claimed) return void await this.sessionError(session, message, "The latest item is no longer available.");
    const ids = claimed.map((item) => item.id);
    try {
      await this.append(kind, claimed);
      await this.store.finish(ids);
      await this.removeLatest(session, message);
    } catch (error) {
      const detail = String(error?.message ?? error);
      await this.store.release(ids, detail);
      await this.sessionError(session, message, `Latest item not saved: ${detail}`);
      await this.setStatus(`Needs attention: ${detail}`);
    }
  }
  /** Images go to a note-free Intake folder for a chat to sort; nothing is written to any note. */
  async stashLatest(session, message) {
    const leaderId = session.leaderIds.at(-1);
    const selection = await this.store.selection([leaderId]);
    if (!selection) return void await this.sessionError(session, message, "The latest item is no longer available.");
    if (!selection.items.every((item) => isImage(item.payload))) return void await this.sessionError(session, message, "Only images can be stashed in Intake.");
    const claimed = await this.store.claimLeaders([leaderId], "stash");
    if (!claimed) return void await this.sessionError(session, message, "The latest item is no longer available.");
    const ids = claimed.map((item) => item.id);
    try {
      await this.downloadMedia(claimed, true);
      await this.store.finish(ids);
      const caption = claimed.some((item) => item.payload.caption) ? " The caption was not kept." : "";
      await this.removeLatest(session, message, `Stashed ${ids.length} image${ids.length === 1 ? "" : "s"} in ${STASH_FOLDER}.${caption}`);
    } catch (error) {
      const detail = String(error?.message ?? error);
      await this.store.release(ids, detail);
      await this.sessionError(session, message, `Latest item not stashed: ${detail}`);
      await this.setStatus(`Needs attention: ${detail}`);
    }
  }
  async discardLatest(session, message) {
    const claimed = await this.store.claimLeaders([session.leaderIds.at(-1)], "discard");
    if (!claimed) return void await this.sessionError(session, message, "The latest item is no longer available.");
    const ids = claimed.map((item) => item.id);
    try {
      await this.store.discard(ids);
      await this.removeLatest(session, message);
    } catch (error) {
      const detail = String(error?.message ?? error);
      await this.store.release(ids, detail);
      await this.sessionError(session, message, `Latest item not discarded: ${detail}`);
    }
  }
  async removeLatest(session, message, notice) {
    const leaderIds = session.leaderIds.slice(0, -1);
    if (!leaderIds.length) {
      await this.store.clearSession();
      await this.editQueue(message.chat.id, message.message_id, session.page, notice);
      return;
    }
    const saved = await this.store.saveSession({ ...session, mode: "bundle", leaderIds, ordinalLeaderIds: [] });
    await this.showSession(saved, notice);
  }
  async toggleLatest(session) {
    const leaderId = session.leaderIds.at(-1);
    const selection = await this.store.selection([leaderId]);
    if (!selection) return void await this.showSession(session, "The latest item is no longer available.");
    await this.store.setDesignation(leaderId, selection.items[0].designation === "agent" ? "daily" : "agent");
    await this.showSession(await this.store.session() ?? session);
  }
  async laterBundle(session, message) {
    await this.store.clearSession();
    await this.editQueue(message.chat.id, message.message_id, session.page);
  }
  async staleControl(message) {
    await this.telegram.editMessage(message.chat.id, message.message_id, "This bundle control is no longer current. Use /queue to resume the latest bundle.", { inline_keyboard: [] });
  }
  async append(kind, items) {
    const api = this.app.plugins?.getPlugin("journals")?.api;
    if (!api || api.apiVersion !== 1 || typeof api.ensureNote !== "function") throw new Error("Journals public API v1 is unavailable.");
    const date = intakeDate(Math.min(...items.map((item) => item.payload.date)) * 1e3);
    const note = await api.ensureNote(this.settings.journal, date, { skipConfirmation: true, unattended: true });
    const file = this.app.vault.getAbstractFileByPath(note?.note?.path);
    if (!file || !("path" in file)) throw new Error("Journals did not return a writable daily note.");
    const media = await this.downloadMedia(items);
    const marker = `<!-- daily-intake:${items.map((item) => item.id).join(",")} -->`;
    const body = this.render(kind, items, media);
    await this.app.vault.process(file, (source) => source.includes(marker) ? source : insertIntakeBlock(source, marker, body));
  }
  async appendMixed(leaderIds, items) {
    const api = this.app.plugins?.getPlugin("journals")?.api;
    if (!api || api.apiVersion !== 1 || typeof api.ensureNote !== "function") throw new Error("Journals public API v1 is unavailable.");
    const date = intakeDate(Math.min(...items.map((item) => item.payload.date)) * 1e3);
    const note = await api.ensureNote(this.settings.journal, date, { skipConfirmation: true, unattended: true });
    const file = this.app.vault.getAbstractFileByPath(note?.note?.path);
    if (!file || !("path" in file)) throw new Error("Journals did not return a writable daily note.");
    const media = await this.downloadMedia(items);
    const marker = `<!-- daily-intake:${items.map((item) => item.id).join(",")} -->`;
    const body = this.renderMixed(leaderIds, items, media);
    await this.app.vault.process(file, (source) => source.includes(marker) ? source : insertIntakeBlock(source, marker, body));
  }
  async downloadMedia(items, stash = false) {
    const embeds = [];
    for (const item of items) {
      const media = selectableMedia(item.payload);
      if (!media) continue;
      const remote = await this.telegram.file(media.file_id);
      const ext = extension(media, remote.file_path);
      const date = intakeDate(item.payload.date * 1e3);
      const root = this.settings.attachmentRoot.replace(/^\/+|\/+$/g, "");
      await ensureFolder(this.app.vault.adapter, stash ? STASH_FOLDER : `${root}/${date}`);
      const identity = media.file_unique_id || media.file_id;
      const path = stash ? await this.store.reserveAttachment(`stash:${identity}`, stashPath(STASH_FOLDER, item.payload.date * 1e3, embeds.length + 1, ext)) : await this.store.reserveAttachment(identity, attachmentPath(root, date, identity, ext, isDirectVoiceMessage(item.payload)));
      if (!await this.app.vault.adapter.exists(path)) {
        const bytes = new Uint8Array(await this.telegram.download(remote.file_path));
        await this.app.vault.adapter.writeBinary(path, bytes);
      }
      embeds.push(embed(path, item.payload));
    }
    return embeds;
  }
  render(kind, items, embeds) {
    const messages = items.map((item) => item.payload);
    const time = localTime(Math.min(...messages.map((message) => message.date)) * 1e3);
    const lines = [kind === "agent" ? `> [!agent-inbox] Agent inbox \xB7 ${time} #user/inbox` : `> [!daily-intake] Intake \xB7 ${time}`];
    let mediaIndex = 0;
    for (const message of messages) {
      const prose = message.text ?? message.caption;
      if (prose) lines.push(calloutLines(prose));
      if (selectableMedia(message)) lines.push(`> ${embeds[mediaIndex++]}`);
    }
    return lines.join("\n");
  }
  renderMixed(leaderIds, items, embeds) {
    const media = /* @__PURE__ */ new Map();
    let mediaIndex = 0;
    for (const item of items) if (selectableMedia(item.payload)) media.set(item.id, embeds[mediaIndex++]);
    const lines = ["> [!daily-intake] Intake bundle"];
    for (const leaderId of leaderIds) {
      const leader = items.find((item) => item.id === leaderId);
      const group = leader.mediaGroupId ? items.filter((item) => item.mediaGroupId === leader.mediaGroupId) : [leader];
      lines.push(">");
      if (leader.designation === "agent") {
        lines.push("> > [!agent-inbox] Agent inbox #user/inbox");
        for (const item of group) {
          const prose = item.payload.text ?? item.payload.caption;
          if (prose) lines.push(...nestedCalloutLines(prose));
          if (media.has(item.id)) lines.push(`> > ${media.get(item.id)}`);
        }
      } else {
        for (const item of group) {
          const prose = item.payload.text ?? item.payload.caption;
          if (prose) lines.push(calloutLines(prose));
          if (media.has(item.id)) lines.push(`> ${media.get(item.id)}`);
        }
      }
    }
    return lines.join("\n");
  }
  describe(items) {
    const text = items.map((item) => item.payload.text ?? item.payload.caption ?? mediaLabel(item.payload) ?? "Unsupported content").join("\n");
    return `Daily Intake (${items.length} item${items.length === 1 ? "" : "s"})
${text.slice(0, 250)}`;
  }
  async sendQueue(chatId, page) {
    const session = await this.store.session();
    const view = await this.queueView(page, session);
    const sent = await this.telegram.sendMessage(chatId, view.text, { inline_keyboard: view.rows });
    if (session) await this.store.saveSession({ ...session, menuChatId: chatId, menuMessageId: sent.message_id, page: view.page });
  }
  async editQueue(chatId, messageId, page, warning) {
    const session = await this.store.session();
    const view = await this.queueView(page, session, warning);
    await this.telegram.editMessage(chatId, messageId, view.text, { inline_keyboard: view.rows });
    if (session) await this.store.saveSession({ ...session, menuChatId: chatId, menuMessageId: messageId, page: view.page });
  }
  async queueView(page, session, warning) {
    const size = 6;
    const first = await this.store.logicalPage(Math.max(0, page), size);
    const pages = Math.max(1, Math.ceil(first.total / size));
    const current = Math.min(Math.max(0, page), pages - 1);
    const queue = current === page ? first : await this.store.logicalPage(current, size);
    const entries = await Promise.all(queue.items.map(async (leader) => ({ leader, group: await this.store.group(leader) })));
    const descriptions = entries.map(({ group }, index) => `\u2022 ${current * size + index + 1}. ${logicalLabel(group)} \xB7 ${localTime(Math.min(...group.map((item) => item.payload.date)) * 1e3)}
  ${logicalSummary(group)}`);
    const indicator = session ? `Bundle session active: ${session.leaderIds.length} selected (${sessionModeLabel(session.mode)}).

` : "";
    if (!session && queue.total === 0) return { text: `${warning ? `${warning}

` : ""}All caught up \u2014 the intake queue is empty.`, rows: [], page: 0 };
    const text = `${warning ? `${warning}

` : ""}${indicator}${descriptions.join("\n") || "The intake queue is empty."}

Page ${current + 1}/${pages}`;
    const rows = session ? [[button("Resume bundle", "di:b:r"), button("Exit bundle", "di:b:c")]] : entries.map(({ leader, group }, index) => [button(selectionButton(current * size + index + 1, group), `di:q:o:${leader.id}:${current}`)]);
    if (!session && pages > 1) rows.push([button("Previous", `di:q:p:${Math.max(0, current - 1)}`), button("Next", `di:q:p:${Math.min(pages - 1, current + 1)}`)]);
    return { text, rows, page: current };
  }
  async openDetail(id, message, page) {
    const selection = await this.store.selection([id]);
    if (!selection) return void await this.editQueue(message.chat.id, message.message_id, page);
    const session = await this.store.saveSession({ mode: "awaiting_ids", leaderIds: selection.leaderIds, ordinalLeaderIds: await this.ordinalSnapshot(selection.leaderIds), menuChatId: message.chat.id, menuMessageId: message.message_id, page, afterId: 0 });
    await this.store.setPrompt(selection.items.map((item) => item.id), message.chat.id, message.message_id);
    await this.showSession(session);
  }
  async showSession(session, warning) {
    const selection = await this.store.selection(session.leaderIds);
    const prefix = warning ? `${warning}

` : "";
    if (!selection) {
      await this.telegram.editMessage(session.menuChatId, session.menuMessageId, `${prefix}One or more selected items are no longer available.`, { inline_keyboard: [[button("Exit bundle", "di:b:c")]] });
      return;
    }
    if (!selection.items.every((item) => isSupportedContent(item.payload))) {
      await this.telegram.editMessage(session.menuChatId, session.menuMessageId, `${prefix}Selected item

${logicalDescription(selection.items, selection.items[0].designation)}

This item cannot be saved automatically.`, { inline_keyboard: selectedUnsupportedRows() });
      return;
    }
    if (session.mode === "awaiting_ids") {
      await this.showOrdinalSelection(session, prefix);
      return;
    }
    if (session.mode === "standalone") {
      const latest2 = latestGroup(selection.leaderIds, selection.items);
      await this.telegram.editMessage(session.menuChatId, session.menuMessageId, `${prefix}Save latest standalone

${logicalDescription(latest2, latest2[0].designation)}`, { inline_keyboard: standaloneRows(latest2.every((item) => isImage(item.payload))) });
      return;
    }
    const latest = latestGroup(selection.leaderIds, selection.items);
    await this.telegram.editMessage(session.menuChatId, session.menuMessageId, `${prefix}${bundleDescription(selection.leaderIds, selection.items)}`, { inline_keyboard: bundleRows(latest[0].designation, latest.every((item) => isImage(item.payload))) });
  }
  async ordinalSnapshot(selected) {
    const page = await this.store.logicalPage(0, 32);
    const snapshot = [...selected];
    for (const leader of page.items) {
      if (snapshot.includes(leader.id)) continue;
      const group = await this.store.group(leader);
      if (group.every((item) => isSupportedContent(item.payload))) snapshot.push(leader.id);
      if (snapshot.length >= 24) break;
    }
    return snapshot;
  }
  async showOrdinalSelection(session, prefix = "") {
    let current = session;
    if (!current.ordinalLeaderIds?.length) current = await this.store.saveSession({ ...current, ordinalLeaderIds: await this.ordinalSnapshot(current.leaderIds) });
    const entries = [];
    const availableLeaderIds = /* @__PURE__ */ new Set();
    for (const [index, leaderId] of (current.ordinalLeaderIds ?? []).entries()) {
      const selection = await this.store.selection([leaderId]);
      if (!selection) continue;
      if (!selection.items.every((item) => isSupportedContent(item.payload))) continue;
      availableLeaderIds.add(leaderId);
      const selected2 = current.leaderIds.includes(leaderId) ? " \u2713 selected" : "";
      const label = selectionButton(index + 1, selection.items).replace(/^\d+\s/, "");
      entries.push(`${index + 1}. ${label}${selected2}
   ${logicalSummary(selection.items).slice(0, 60)}`);
    }
    const canCombine = [...availableLeaderIds].some((leaderId) => !current.leaderIds.includes(leaderId));
    const selected = await this.store.selection(current.leaderIds);
    if (!selected) return void await this.showSession(current, "The selected item is no longer available.");
    const cap = (current.ordinalLeaderIds?.length ?? 0) >= 24 ? "\n\nShowing the first 24 selectable entries; return to /queue to start from another item." : "";
    const combine = canCombine ? `

Combine with another queue item
Reply with entry numbers separated by spaces or commas. The current item is already selected.

${entries.join("\n")}${cap}` : "";
    const text = `${prefix}Selected item

${logicalDescription(selected.items, selected.items[0].designation)}${combine}`;
    await this.telegram.editMessage(current.menuChatId, current.menuMessageId, text, { inline_keyboard: selectedSupportedRows() });
  }
  async handleIdReply(message, session) {
    const parsed = parseSelectionIds(message.text);
    if (!parsed) return void await this.showSession(session, "Use only positive entry numbers separated by spaces or commas.");
    const mapped = parsed.map((ordinal) => (session.ordinalLeaderIds ?? [])[ordinal - 1]);
    if (mapped.some((id) => id === void 0)) return void await this.showSession(session, "One or more entry numbers are outside the displayed list.");
    const selection = await this.store.selection([...session.leaderIds, ...mapped]);
    if (!selection) return void await this.showSession(session, "One or more selected entries are resolved or currently being handled.");
    if (!selection.items.every((item) => isSupportedContent(item.payload))) return void await this.showSession(session, "Unsupported items cannot be combined automatically.");
    if (selection.leaderIds.length < 2) return void await this.showSession(session, "Choose at least one different logical queue item.");
    await this.store.setPrompt(selection.items.map((item) => item.id), session.menuChatId, session.menuMessageId);
    const saved = await this.store.saveSession({ ...session, mode: "bundle", leaderIds: selection.leaderIds });
    await this.showSession(saved);
  }
  async resumeSession(message) {
    const session = await this.store.session();
    if (!session) return void await this.editQueue(message.chat.id, message.message_id, 0);
    const saved = await this.store.saveSession({ ...session, menuChatId: message.chat.id, menuMessageId: message.message_id });
    await this.showSession(saved);
  }
  async cancelSession(message) {
    const session = await this.store.session();
    if (!session) return;
    await this.store.clearSession();
    await this.editQueue(message?.chat.id ?? session.menuChatId, message?.message_id ?? session.menuMessageId, session.page);
  }
  async sessionError(session, message, detail) {
    if (session) await this.showSession(session, detail);
    else await this.editQueue(message.chat.id, message.message_id, 0, detail);
  }
  async showQueue() {
    if (!this.store) return void new import_obsidian3.Notice(this.settings.status);
    const queue = await this.store.logicalPage(0);
    new import_obsidian3.Notice(queue.items.length ? `${queue.total} intake item(s) waiting.` : "Daily Intake queue is empty.");
  }
  async setStatus(status) {
    this.settings.status = status;
  }
  loadPrivateState(pluginDir) {
    return LocalState.load(this.app, pluginDir, () => this.loadData());
  }
  queueStore(state, protect = true) {
    return new QueueStore(this.app, state.queuePath, { files: state.store, wasmDirectory: state.wasmDirectory, beforeFlush: protect ? () => state.protectQueueMutation() : void 0 });
  }
};
function selectableMedia(message) {
  return message.voice ?? message.audio ?? (message.photo ? message.photo.reduce((a, b) => (a.file_size ?? 0) >= (b.file_size ?? 0) ? a : b) : null) ?? message.video ?? message.document ?? message.animation ?? null;
}
function isDirectVoiceMessage(message) {
  return Boolean(message.voice && !message.forward_origin && !message.forward_date);
}
function button(text, callback_data) {
  return { text, callback_data };
}
function initialActionRows(id) {
  return [[button("Discard", `di:u:${id}:x`), button("Back to queue", `di:u:${id}:q`)]];
}
function selectedSupportedRows() {
  return [[button("Save selected", "di:b:s")], [button("Discard selected", "di:b:x"), button("Back to queue", "di:b:q")]];
}
function selectedUnsupportedRows() {
  return [[button("Discard selected", "di:b:x"), button("Back to queue", "di:b:q")]];
}
function bundleRows(designation, stashable = false) {
  return [
    [button("Finish bundle", "di:b:f"), button("Save latest", "di:b:s")],
    ...stashable ? [[button("Stash latest in Intake", "di:b:si")]] : [],
    [button(designation === "agent" ? "Mark latest as intake" : "Mark latest as agent", "di:b:t")],
    [button("Discard latest", "di:b:x"), button("Later", "di:b:l")]
  ];
}
function insertIntakeBlock(source, marker, body) {
  const block = `${marker}
${body}`;
  const section = finalSectionStart(source, "Agent Review") ?? finalSectionStart(source, "Processed Agent Instructions");
  if (section === null) return `${source.replace(/\s*$/, "")}

${block}
`;
  const before = source.slice(0, section).replace(/\s*$/, "");
  const after = source.slice(section).replace(/^\s*/, "");
  return `${before}

${block}

${after}`;
}
function finalSectionStart(source, heading) {
  const sections = [...source.matchAll(new RegExp(`^## ${heading}\\s*$`, "gim"))];
  return sections.at(-1)?.index ?? null;
}
function standaloneRows(stashable = false) {
  return [
    [button("Save as intake", "di:b:sd"), button("Save as agent instruction", "di:b:sa")],
    ...stashable ? [[button("Stash in Intake", "di:b:si")]] : [],
    [button("Cancel", "di:b:sc")],
    [button("Discard latest", "di:b:x"), button("Later", "di:b:l")]
  ];
}
function mediaLabel(message) {
  const file = selectableMedia(message);
  const details = file ? [formatDuration(file.duration), formatSize(file.file_size)].filter(Boolean).join(", ") : "";
  const kind = message.voice ? "Voice" : message.audio ? "Audio" : message.photo ? "Photo" : message.video ? "Video" : message.animation ? "Animation" : message.document ? `Document${message.document.file_name ? ` \xB7 ${message.document.file_name}` : ""}` : null;
  return kind ? `${kind}${details ? ` (${details})` : ""}` : null;
}
function logicalLabel(items) {
  if (items.length > 1) return `Album (${items.length} items: ${items.map((item) => mediaLabel(item.payload) ?? "Text").join(", ")})`;
  return mediaLabel(items[0].payload) ?? "Text";
}
function selectionButton(displayNumber, items) {
  const message = items[0].payload;
  const icon = items.length > 1 ? "\u{1F5C2}" : message.voice ? "\u{1F399}" : message.audio ? "\u{1F3B5}" : message.photo ? "\u{1F5BC}" : message.video ? "\u{1F3AC}" : message.animation ? "\u2728" : message.document ? "\u{1F4C4}" : "\u{1F4DD}";
  const preview = (message.text ?? message.caption)?.replace(/\s+/g, " ").trim().slice(0, 20);
  const label = items.length > 1 ? `Album \xB7 ${items.length}` : mediaLabel(message) ?? `Text${preview ? ` \xB7 ${preview}` : ""}`;
  const time = localTime(Math.min(...items.map((item) => item.payload.date)) * 1e3);
  return `${displayNumber} ${icon} ${label} \xB7 ${time}`.slice(0, 60);
}
function logicalSummary(items) {
  const text = items.map((item) => item.payload.text ?? item.payload.caption).filter(Boolean).join(" / ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 120) : logicalLabel(items);
}
function latestGroup(leaderIds, items) {
  const leader = items.find((item) => item.id === leaderIds.at(-1)) ?? items.at(-1);
  return leader.mediaGroupId ? items.filter((item) => item.mediaGroupId === leader.mediaGroupId) : [leader];
}
function logicalDescription(items, designation) {
  const time = localTime(Math.min(...items.map((item) => item.payload.date)) * 1e3);
  return `${logicalLabel(items)} \xB7 ${time}${designation === "agent" ? " \xB7 Agent instruction" : " \xB7 Intake"}
${logicalSummary(items)}`;
}
function bundleDescription(leaderIds, items) {
  const entries = leaderIds.map((id, index) => {
    const leader = items.find((item) => item.id === id) ?? items[0];
    const group = leader.mediaGroupId ? items.filter((item) => item.mediaGroupId === leader.mediaGroupId) : [leader];
    return `\u2022 ${index + 1}. ${logicalDescription(group, leader.designation)}${index === leaderIds.length - 1 ? " \xB7 latest" : ""}`;
  });
  return `Intake bundle (${leaderIds.length} logical item${leaderIds.length === 1 ? "" : "s"})
${entries.join("\n")}`;
}
function sessionModeLabel(mode) {
  return mode === "awaiting_ids" ? "choosing items" : mode === "standalone" ? "standalone choice" : "active";
}
function nestedCalloutLines(text) {
  return calloutLines(text).split("\n").map((line) => `> ${line}`);
}
function formatDuration(seconds) {
  if (!seconds) return "";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
function formatSize(bytes) {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function localTime(milliseconds) {
  const date = new Date(milliseconds);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
function extension(file, remotePath) {
  const named = (file.file_name ?? remotePath).match(/\.([a-zA-Z0-9]{1,10})$/)?.[1];
  if (named) return named.toLowerCase();
  return file.mime_type?.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
}
async function ensureFolder(adapter, folder) {
  let current = "";
  for (const part of folder.split("/").filter(Boolean)) {
    current = current ? `${current}/${part}` : part;
    if (!await adapter.exists(current)) await adapter.mkdir(current);
  }
}
function embed(path, message) {
  const file = selectableMedia(message);
  const label = message.voice ? "Telegram voice message" : message.audio ? "Telegram audio" : mediaLabelFromMime(file?.mime_type) ?? "Telegram attachment";
  return `![[${path}|${label}]]`;
}
function mediaLabelFromMime(mime) {
  return mime?.startsWith("image/") ? "Telegram image" : mime?.startsWith("audio/") ? "Telegram audio" : mime?.startsWith("video/") ? "Telegram video" : mime ? "Telegram attachment" : null;
}
var pause2 = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL3NxbC5qcy9kaXN0L3NxbC13YXNtLmpzIiwgInNyYy9tYWluLnRzIiwgInNyYy9zcWwtbG9hZGVyLnRzIiwgInNyYy90eXBlcy50cyIsICJzcmMvbG9jYWwtc3RhdGUudHMiLCAic3JjL2hlbHBlcnMudHMiLCAic3JjL3N0b3JhZ2UudHMiLCAic3JjL3NldHRpbmdzLnRzIiwgInNyYy90ZWxlZ3JhbS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXG4vLyBXZSBhcmUgbW9kdWxhcml6aW5nIHRoaXMgbWFudWFsbHkgYmVjYXVzZSB0aGUgY3VycmVudCBtb2R1bGFyaXplIHNldHRpbmcgaW4gRW1zY3JpcHRlbiBoYXMgc29tZSBpc3N1ZXM6XG4vLyBodHRwczovL2dpdGh1Yi5jb20va3JpcGtlbi9lbXNjcmlwdGVuL2lzc3Vlcy81ODIwXG4vLyBJbiBhZGRpdGlvbiwgV2hlbiB5b3UgdXNlIGVtY2MncyBtb2R1bGFyaXphdGlvbiwgaXQgc3RpbGwgZXhwZWN0cyB0byBleHBvcnQgYSBnbG9iYWwgb2JqZWN0IGNhbGxlZCBgTW9kdWxlYCxcbi8vIHdoaWNoIGlzIGFibGUgdG8gYmUgdXNlZC9jYWxsZWQgYmVmb3JlIHRoZSBXQVNNIGlzIGxvYWRlZC5cbi8vIFRoZSBtb2R1bGFyaXphdGlvbiBiZWxvdyBleHBvcnRzIGEgcHJvbWlzZSB0aGF0IGxvYWRzIGFuZCByZXNvbHZlcyB0byB0aGUgYWN0dWFsIHNxbC5qcyBtb2R1bGUuXG4vLyBUaGF0IHdheSwgdGhpcyBtb2R1bGUgY2FuJ3QgYmUgdXNlZCBiZWZvcmUgdGhlIFdBU00gaXMgZmluaXNoZWQgbG9hZGluZy5cblxuLy8gV2UgYXJlIGdvaW5nIHRvIGRlZmluZSBhIGZ1bmN0aW9uIHRoYXQgYSB1c2VyIHdpbGwgY2FsbCB0byBzdGFydCBsb2FkaW5nIGluaXRpYWxpemluZyBvdXIgU3FsLmpzIGxpYnJhcnlcbi8vIEhvd2V2ZXIsIHRoYXQgZnVuY3Rpb24gbWlnaHQgYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLCBhbmQgb24gc3Vic2VxdWVudCBjYWxscywgd2UgZG9uJ3QgYWN0dWFsbHkgd2FudCBpdCB0byBpbnN0YW50aWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgTW9kdWxlXG4vLyBJbnN0ZWFkLCB3ZSB3YW50IHRvIHJldHVybiB0aGUgcHJldmlvdXNseSBsb2FkZWQgbW9kdWxlXG5cbi8vIFRPRE86IE1ha2UgdGhpcyBub3QgZGVjbGFyZSBhIGdsb2JhbCBpZiB1c2VkIGluIHRoZSBicm93c2VyXG52YXIgaW5pdFNxbEpzUHJvbWlzZSA9IHVuZGVmaW5lZDtcblxudmFyIGluaXRTcWxKcyA9IGZ1bmN0aW9uIChtb2R1bGVDb25maWcpIHtcblxuICAgIGlmIChpbml0U3FsSnNQcm9taXNlKXtcbiAgICAgIHJldHVybiBpbml0U3FsSnNQcm9taXNlO1xuICAgIH1cbiAgICAvLyBJZiB3ZSdyZSBoZXJlLCB3ZSd2ZSBuZXZlciBjYWxsZWQgdGhpcyBmdW5jdGlvbiBiZWZvcmVcbiAgICBpbml0U3FsSnNQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmVNb2R1bGUsIHJlamVjdCkge1xuXG4gICAgICAgIC8vIFdlIGFyZSBtb2R1bGFyaXppbmcgdGhpcyBtYW51YWxseSBiZWNhdXNlIHRoZSBjdXJyZW50IG1vZHVsYXJpemUgc2V0dGluZyBpbiBFbXNjcmlwdGVuIGhhcyBzb21lIGlzc3VlczpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXBrZW4vZW1zY3JpcHRlbi9pc3N1ZXMvNTgyMFxuXG4gICAgICAgIC8vIFRoZSB3YXkgdG8gYWZmZWN0IHRoZSBsb2FkaW5nIG9mIGVtY2MgY29tcGlsZWQgbW9kdWxlcyBpcyB0byBjcmVhdGUgYSB2YXJpYWJsZSBjYWxsZWQgYE1vZHVsZWAgYW5kIGFkZFxuICAgICAgICAvLyBwcm9wZXJ0aWVzIHRvIGl0LCBsaWtlIGBwcmVSdW5gLCBgcG9zdFJ1bmAsIGV0Y1xuICAgICAgICAvLyBXZSBhcmUgdXNpbmcgdGhhdCB0byBnZXQgbm90aWZpZWQgd2hlbiB0aGUgV0FTTSBoYXMgZmluaXNoZWQgbG9hZGluZy5cbiAgICAgICAgLy8gT25seSB0aGVuIHdpbGwgd2UgcmV0dXJuIG91ciBwcm9taXNlXG5cbiAgICAgICAgLy8gSWYgdGhleSBwYXNzZWQgaW4gYSBtb2R1bGVDb25maWcgb2JqZWN0LCB1c2UgdGhhdFxuICAgICAgICAvLyBPdGhlcndpc2UsIGluaXRpYWxpemUgTW9kdWxlIHRvIHRoZSBlbXB0eSBvYmplY3RcbiAgICAgICAgdmFyIE1vZHVsZSA9IHR5cGVvZiBtb2R1bGVDb25maWcgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlQ29uZmlnIDoge307XG5cbiAgICAgICAgLy8gRU1DQyBvbmx5IGFsbG93cyBmb3IgYSBzaW5nbGUgb25BYm9ydCBmdW5jdGlvbiAobm90IGFuIGFycmF5IG9mIGZ1bmN0aW9ucylcbiAgICAgICAgLy8gU28gaWYgdGhlIHVzZXIgZGVmaW5lZCB0aGVpciBvd24gb25BYm9ydCBmdW5jdGlvbiwgd2UgcmVtZW1iZXIgaXQgYW5kIGNhbGwgaXRcbiAgICAgICAgdmFyIG9yaWdpbmFsT25BYm9ydEZ1bmN0aW9uID0gTW9kdWxlWydvbkFib3J0J107XG4gICAgICAgIE1vZHVsZVsnb25BYm9ydCddID0gZnVuY3Rpb24gKGVycm9yVGhhdENhdXNlZEFib3J0KSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGVycm9yVGhhdENhdXNlZEFib3J0KSk7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxPbkFib3J0RnVuY3Rpb24pe1xuICAgICAgICAgICAgICBvcmlnaW5hbE9uQWJvcnRGdW5jdGlvbihlcnJvclRoYXRDYXVzZWRBYm9ydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kdWxlWydwb3N0UnVuJ10gPSBNb2R1bGVbJ3Bvc3RSdW4nXSB8fCBbXTtcbiAgICAgICAgTW9kdWxlWydwb3N0UnVuJ10ucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBXaGVuIEVtc2NyaXB0ZWQgY2FsbHMgcG9zdFJ1biwgdGhpcyBwcm9taXNlIHJlc29sdmVzIHdpdGggdGhlIGJ1aWx0IE1vZHVsZVxuICAgICAgICAgICAgcmVzb2x2ZU1vZHVsZShNb2R1bGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUaGVyZSBpcyBhIHNlY3Rpb24gb2YgY29kZSBpbiB0aGUgZW1jYy1nZW5lcmF0ZWQgY29kZSBiZWxvdyB0aGF0IGxvb2tzIGxpa2UgdGhpczpcbiAgICAgICAgLy8gKE5vdGUgdGhhdCB0aGlzIGlzIGxvd2VyY2FzZSBgbW9kdWxlYClcbiAgICAgICAgLy8gaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IE1vZHVsZTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBXaGVuIHRoYXQgcnVucywgaXQncyBnb2luZyB0byBvdmVyd3JpdGUgb3VyIG93biBtb2R1bGFyaXphdGlvbiBleHBvcnQgZWZmb3J0cyBpbiBzaGVsbC1wb3N0LmpzIVxuICAgICAgICAvLyBUaGUgb25seSB3YXkgdG8gdGVsbCBlbWNjIG5vdCB0byBlbWl0IGl0IGlzIHRvIHBhc3MgdGhlIE1PRFVMQVJJWkU9MSBvciBNT0RVTEFSSVpFX0lOU1RBTkNFPTEgZmxhZ3MsXG4gICAgICAgIC8vIGJ1dCB0aGF0IGNhcnJpZXMgd2l0aCBpdCBhZGRpdGlvbmFsIHVubmVjZXNzYXJ5IGJhZ2dhZ2UvYnVncyB3ZSBkb24ndCB3YW50IGVpdGhlci5cbiAgICAgICAgLy8gU28sIHdlIGhhdmUgdGhyZWUgb3B0aW9uczpcbiAgICAgICAgLy8gMSkgV2UgdW5kZWZpbmUgYG1vZHVsZWBcbiAgICAgICAgLy8gMikgV2UgcmVtZW1iZXIgd2hhdCBgbW9kdWxlWydleHBvcnRzJ11gIHdhcyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgZnVuY3Rpb24gYW5kIHdlIHJlc3RvcmUgaXQgbGF0ZXJcbiAgICAgICAgLy8gMykgV2Ugd3JpdGUgYSBzY3JpcHQgdG8gcmVtb3ZlIHRob3NlIGxpbmVzIG9mIGNvZGUgYXMgcGFydCBvZiB0aGUgTWFrZSBwcm9jZXNzLlxuICAgICAgICAvL1xuICAgICAgICAvLyBTaW5jZSB0aG9zZSBhcmUgdGhlIG9ubHkgbGluZXMgb2YgY29kZSB0aGF0IGNhcmUgYWJvdXQgbW9kdWxlLCB3ZSB3aWxsIHVuZGVmaW5lIGl0LiBJdCdzIHRoZSBtb3N0IHN0cmFpZ2h0Zm9yd2FyZFxuICAgICAgICAvLyBvZiB0aGUgb3B0aW9ucywgYW5kIGhhcyB0aGUgc2lkZSBlZmZlY3Qgb2YgcmVkdWNpbmcgZW1jYydzIGVmZm9ydHMgdG8gbW9kaWZ5IHRoZSBtb2R1bGUgaWYgaXRzIG91dHB1dCB3ZXJlIHRvIGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAvLyBUaGF0J3MgYSBuaWNlIHNpZGUgZWZmZWN0IHNpbmNlIHdlJ3JlIGhhbmRsaW5nIHRoZSBtb2R1bGFyaXphdGlvbiBlZmZvcnRzIG91cnNlbHZlc1xuICAgICAgICBtb2R1bGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gVGhlIGVtY2MtZ2VuZXJhdGVkIGNvZGUgYW5kIHNoZWxsLXBvc3QuanMgY29kZSBnb2VzIGJlbG93LFxuICAgICAgICAvLyBtZWFuaW5nIHRoYXQgYWxsIG9mIGl0IHJ1bnMgaW5zaWRlIG9mIHRoaXMgcHJvbWlzZS4gSWYgYW55dGhpbmcgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgb3VyIHByb21pc2Ugd2lsbCBhYm9ydFxudmFyIGs7a3x8PXR5cGVvZiBNb2R1bGUgIT0gJ3VuZGVmaW5lZCcgPyBNb2R1bGUgOiB7fTt2YXIgYWE9ISFnbG9iYWxUaGlzLndpbmRvdyxiYT0hIWdsb2JhbFRoaXMuV29ya2VyR2xvYmFsU2NvcGUsY2E9Z2xvYmFsVGhpcy5wcm9jZXNzPy52ZXJzaW9ucz8ubm9kZSYmXCJyZW5kZXJlclwiIT1nbG9iYWxUaGlzLnByb2Nlc3M/LnR5cGU7XG5rLm9uUnVudGltZUluaXRpYWxpemVkPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShmLGwpe3N3aXRjaCh0eXBlb2YgbCl7Y2FzZSBcImJvb2xlYW5cIjpkYyhmLGw/MTowKTticmVhaztjYXNlIFwibnVtYmVyXCI6ZWMoZixsKTticmVhaztjYXNlIFwic3RyaW5nXCI6ZmMoZixsLC0xLC0xKTticmVhaztjYXNlIFwib2JqZWN0XCI6aWYobnVsbD09PWwpbGIoZik7ZWxzZSBpZihudWxsIT1sLmxlbmd0aCl7dmFyIG49ZGEobC5sZW5ndGgpO20uc2V0KGwsbik7Z2MoZixuLGwubGVuZ3RoLC0xKTtlYShuKX1lbHNlIHZhKGYsXCJXcm9uZyBBUEkgdXNlIDogdHJpZWQgdG8gcmV0dXJuIGEgdmFsdWUgb2YgYW4gdW5rbm93biB0eXBlIChcIitsK1wiKS5cIiwtMSk7YnJlYWs7ZGVmYXVsdDpsYihmKX19ZnVuY3Rpb24gYihmLGwpe2Zvcih2YXIgbj1bXSxwPTA7cDxmO3ArPTEpe3ZhciByPXQobCs0KnAsXCJpMzJcIiksdz1oYyhyKTtpZigxPT09d3x8Mj09PXcpcj1pYyhyKTtlbHNlIGlmKDM9PT13KXI9amMocik7ZWxzZSBpZig0PT09XG53KXt3PXI7cj1rYyh3KTt3PWxjKHcpO2Zvcih2YXIgSj1uZXcgVWludDhBcnJheShyKSxJPTA7STxyO0krPTEpSltJXT1tW3crSV07cj1KfWVsc2Ugcj1udWxsO24ucHVzaChyKX1yZXR1cm4gbn1mdW5jdGlvbiBjKGYsbCl7dGhpcy5RYT1mO3RoaXMuZGI9bDt0aGlzLk9hPTE7dGhpcy5tYj1bXX1mdW5jdGlvbiBkKGYsbCl7dGhpcy5kYj1sO3RoaXMuZmI9ZmEoZik7aWYobnVsbD09PXRoaXMuZmIpdGhyb3cgRXJyb3IoXCJVbmFibGUgdG8gYWxsb2NhdGUgbWVtb3J5IGZvciB0aGUgU1FMIHN0cmluZ1wiKTt0aGlzLmxiPXRoaXMuZmI7dGhpcy4kYT10aGlzLnNiPW51bGx9ZnVuY3Rpb24gZShmKXt0aGlzLmZpbGVuYW1lPVwiZGJmaWxlX1wiKyg0Mjk0OTY3Mjk1Kk1hdGgucmFuZG9tKCk+Pj4wKTtpZihudWxsIT1mKXt2YXIgbD10aGlzLmZpbGVuYW1lLG49XCIvXCIscD1sO24mJihuPVwic3RyaW5nXCI9PXR5cGVvZiBuP246aGEobikscD1sP2lhKG4rXCIvXCIrbCk6bik7bD1qYSghMCwhMCk7cD1rYShwLFxubCk7aWYoZil7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGYpe249QXJyYXkoZi5sZW5ndGgpO2Zvcih2YXIgcj0wLHc9Zi5sZW5ndGg7cjx3OysrciluW3JdPWYuY2hhckNvZGVBdChyKTtmPW59bWEocCxsfDE0Nik7bj1uYShwLDU3Nyk7b2EobixmLDAsZi5sZW5ndGgsMCk7cGEobik7bWEocCxsKX19dGhpcy5oYW5kbGVFcnJvcihxKHRoaXMuZmlsZW5hbWUsZykpO3RoaXMuZGI9dChnLFwiaTMyXCIpO29iKHRoaXMuZGIpO3RoaXMuZ2I9e307dGhpcy5TYT17fX12YXIgZz15KDQpLGg9ay5jd3JhcCxxPWgoXCJzcWxpdGUzX29wZW5cIixcIm51bWJlclwiLFtcInN0cmluZ1wiLFwibnVtYmVyXCJdKSx2PWgoXCJzcWxpdGUzX2Nsb3NlX3YyXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLHU9aChcInNxbGl0ZTNfZXhlY1wiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJzdHJpbmdcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIl0pLHg9aChcInNxbGl0ZTNfY2hhbmdlc1wiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSxEPWgoXCJzcWxpdGUzX3ByZXBhcmVfdjJcIixcblwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJzdHJpbmdcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIl0pLHBiPWgoXCJzcWxpdGUzX3NxbFwiLFwic3RyaW5nXCIsW1wibnVtYmVyXCJdKSxuYz1oKFwic3FsaXRlM19ub3JtYWxpemVkX3NxbFwiLFwic3RyaW5nXCIsW1wibnVtYmVyXCJdKSxxYj1oKFwic3FsaXRlM19wcmVwYXJlX3YyXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiXSksb2M9aChcInNxbGl0ZTNfYmluZF90ZXh0XCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiXSkscmI9aChcInNxbGl0ZTNfYmluZF9ibG9iXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiXSkscGM9aChcInNxbGl0ZTNfYmluZF9kb3VibGVcIixcIm51bWJlclwiLFtcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIl0pLHFjPWgoXCJzcWxpdGUzX2JpbmRfaW50XCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcblwibnVtYmVyXCIsXCJudW1iZXJcIl0pLHJjPWgoXCJzcWxpdGUzX2JpbmRfcGFyYW1ldGVyX2luZGV4XCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcInN0cmluZ1wiXSksc2M9aChcInNxbGl0ZTNfc3RlcFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSx0Yz1oKFwic3FsaXRlM19lcnJtc2dcIixcInN0cmluZ1wiLFtcIm51bWJlclwiXSksdWM9aChcInNxbGl0ZTNfY29sdW1uX2NvdW50XCIsXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLHZjPWgoXCJzcWxpdGUzX2RhdGFfY291bnRcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSksd2M9aChcInNxbGl0ZTNfY29sdW1uX2RvdWJsZVwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIl0pLHNiPWgoXCJzcWxpdGUzX2NvbHVtbl90ZXh0XCIsXCJzdHJpbmdcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSkseGM9aChcInNxbGl0ZTNfY29sdW1uX2Jsb2JcIixcIm51bWJlclwiLFtcIm51bWJlclwiLFwibnVtYmVyXCJdKSx5Yz1oKFwic3FsaXRlM19jb2x1bW5fYnl0ZXNcIixcIm51bWJlclwiLFtcIm51bWJlclwiLFwibnVtYmVyXCJdKSx6Yz1oKFwic3FsaXRlM19jb2x1bW5fdHlwZVwiLFxuXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSksQWM9aChcInNxbGl0ZTNfY29sdW1uX25hbWVcIixcInN0cmluZ1wiLFtcIm51bWJlclwiLFwibnVtYmVyXCJdKSxCYz1oKFwic3FsaXRlM19yZXNldFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSxDYz1oKFwic3FsaXRlM19jbGVhcl9iaW5kaW5nc1wiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSxEYz1oKFwic3FsaXRlM19maW5hbGl6ZVwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSx0Yj1oKFwic3FsaXRlM19jcmVhdGVfZnVuY3Rpb25fdjJcIixcIm51bWJlclwiLFwibnVtYmVyIHN0cmluZyBudW1iZXIgbnVtYmVyIG51bWJlciBudW1iZXIgbnVtYmVyIG51bWJlciBudW1iZXJcIi5zcGxpdChcIiBcIikpLGhjPWgoXCJzcWxpdGUzX3ZhbHVlX3R5cGVcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSksa2M9aChcInNxbGl0ZTNfdmFsdWVfYnl0ZXNcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSksamM9aChcInNxbGl0ZTNfdmFsdWVfdGV4dFwiLFwic3RyaW5nXCIsW1wibnVtYmVyXCJdKSxsYz1oKFwic3FsaXRlM192YWx1ZV9ibG9iXCIsXG5cIm51bWJlclwiLFtcIm51bWJlclwiXSksaWM9aChcInNxbGl0ZTNfdmFsdWVfZG91YmxlXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLGVjPWgoXCJzcWxpdGUzX3Jlc3VsdF9kb3VibGVcIixcIlwiLFtcIm51bWJlclwiLFwibnVtYmVyXCJdKSxsYj1oKFwic3FsaXRlM19yZXN1bHRfbnVsbFwiLFwiXCIsW1wibnVtYmVyXCJdKSxmYz1oKFwic3FsaXRlM19yZXN1bHRfdGV4dFwiLFwiXCIsW1wibnVtYmVyXCIsXCJzdHJpbmdcIixcIm51bWJlclwiLFwibnVtYmVyXCJdKSxnYz1oKFwic3FsaXRlM19yZXN1bHRfYmxvYlwiLFwiXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCJdKSxkYz1oKFwic3FsaXRlM19yZXN1bHRfaW50XCIsXCJcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSksdmE9aChcInNxbGl0ZTNfcmVzdWx0X2Vycm9yXCIsXCJcIixbXCJudW1iZXJcIixcInN0cmluZ1wiLFwibnVtYmVyXCJdKSx1Yj1oKFwic3FsaXRlM19hZ2dyZWdhdGVfY29udGV4dFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIl0pLG9iPWgoXCJSZWdpc3RlckV4dGVuc2lvbkZ1bmN0aW9uc1wiLFxuXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLHZiPWgoXCJzcWxpdGUzX3VwZGF0ZV9ob29rXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCJdKTtjLnByb3RvdHlwZS5iaW5kPWZ1bmN0aW9uKGYpe2lmKCF0aGlzLlFhKXRocm93XCJTdGF0ZW1lbnQgY2xvc2VkXCI7dGhpcy5yZXNldCgpO3JldHVybiBBcnJheS5pc0FycmF5KGYpP3RoaXMuR2IoZik6bnVsbCE9ZiYmXCJvYmplY3RcIj09PXR5cGVvZiBmP3RoaXMuSGIoZik6ITB9O2MucHJvdG90eXBlLnN0ZXA9ZnVuY3Rpb24oKXtpZighdGhpcy5RYSl0aHJvd1wiU3RhdGVtZW50IGNsb3NlZFwiO3RoaXMuT2E9MTt2YXIgZj1zYyh0aGlzLlFhKTtzd2l0Y2goZil7Y2FzZSAxMDA6cmV0dXJuITA7Y2FzZSAxMDE6cmV0dXJuITE7ZGVmYXVsdDp0aHJvdyB0aGlzLmRiLmhhbmRsZUVycm9yKGYpO319O2MucHJvdG90eXBlLkFiPWZ1bmN0aW9uKGYpe251bGw9PWYmJihmPXRoaXMuT2EsdGhpcy5PYSs9MSk7cmV0dXJuIHdjKHRoaXMuUWEsZil9O1xuYy5wcm90b3R5cGUuT2I9ZnVuY3Rpb24oZil7bnVsbD09ZiYmKGY9dGhpcy5PYSx0aGlzLk9hKz0xKTtmPXNiKHRoaXMuUWEsZik7aWYoXCJmdW5jdGlvblwiIT09dHlwZW9mIEJpZ0ludCl0aHJvdyBFcnJvcihcIkJpZ0ludCBpcyBub3Qgc3VwcG9ydGVkXCIpO3JldHVybiBCaWdJbnQoZil9O2MucHJvdG90eXBlLlRiPWZ1bmN0aW9uKGYpe251bGw9PWYmJihmPXRoaXMuT2EsdGhpcy5PYSs9MSk7cmV0dXJuIHNiKHRoaXMuUWEsZil9O2MucHJvdG90eXBlLmdldEJsb2I9ZnVuY3Rpb24oZil7bnVsbD09ZiYmKGY9dGhpcy5PYSx0aGlzLk9hKz0xKTt2YXIgbD15Yyh0aGlzLlFhLGYpO2Y9eGModGhpcy5RYSxmKTtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkobCkscD0wO3A8bDtwKz0xKW5bcF09bVtmK3BdO3JldHVybiBufTtjLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oZixsKXtsPWx8fHt9O251bGwhPWYmJnRoaXMuYmluZChmKSYmdGhpcy5zdGVwKCk7Zj1bXTtmb3IodmFyIG49dmModGhpcy5RYSksXG5wPTA7cDxuO3ArPTEpc3dpdGNoKHpjKHRoaXMuUWEscCkpe2Nhc2UgMTp2YXIgcj1sLnVzZUJpZ0ludD90aGlzLk9iKHApOnRoaXMuQWIocCk7Zi5wdXNoKHIpO2JyZWFrO2Nhc2UgMjpmLnB1c2godGhpcy5BYihwKSk7YnJlYWs7Y2FzZSAzOmYucHVzaCh0aGlzLlRiKHApKTticmVhaztjYXNlIDQ6Zi5wdXNoKHRoaXMuZ2V0QmxvYihwKSk7YnJlYWs7ZGVmYXVsdDpmLnB1c2gobnVsbCl9cmV0dXJuIGZ9O2MucHJvdG90eXBlLnFiPWZ1bmN0aW9uKCl7Zm9yKHZhciBmPVtdLGw9dWModGhpcy5RYSksbj0wO248bDtuKz0xKWYucHVzaChBYyh0aGlzLlFhLG4pKTtyZXR1cm4gZn07Yy5wcm90b3R5cGUuemI9ZnVuY3Rpb24oZixsKXtmPXRoaXMuZ2V0KGYsbCk7bD10aGlzLnFiKCk7Zm9yKHZhciBuPXt9LHA9MDtwPGwubGVuZ3RoO3ArPTEpbltsW3BdXT1mW3BdO3JldHVybiBufTtjLnByb3RvdHlwZS5TYj1mdW5jdGlvbigpe3JldHVybiBwYih0aGlzLlFhKX07Yy5wcm90b3R5cGUuUGI9XG5mdW5jdGlvbigpe3JldHVybiBuYyh0aGlzLlFhKX07Yy5wcm90b3R5cGUucnVuPWZ1bmN0aW9uKGYpe251bGwhPWYmJnRoaXMuYmluZChmKTt0aGlzLnN0ZXAoKTtyZXR1cm4gdGhpcy5yZXNldCgpfTtjLnByb3RvdHlwZS53Yj1mdW5jdGlvbihmLGwpe251bGw9PWwmJihsPXRoaXMuT2EsdGhpcy5PYSs9MSk7Zj1mYShmKTt0aGlzLm1iLnB1c2goZik7dGhpcy5kYi5oYW5kbGVFcnJvcihvYyh0aGlzLlFhLGwsZiwtMSwwKSl9O2MucHJvdG90eXBlLkZiPWZ1bmN0aW9uKGYsbCl7bnVsbD09bCYmKGw9dGhpcy5PYSx0aGlzLk9hKz0xKTt2YXIgbj1kYShmLmxlbmd0aCk7bS5zZXQoZixuKTt0aGlzLm1iLnB1c2gobik7dGhpcy5kYi5oYW5kbGVFcnJvcihyYih0aGlzLlFhLGwsbixmLmxlbmd0aCwwKSl9O2MucHJvdG90eXBlLnZiPWZ1bmN0aW9uKGYsbCl7bnVsbD09bCYmKGw9dGhpcy5PYSx0aGlzLk9hKz0xKTt0aGlzLmRiLmhhbmRsZUVycm9yKChmPT09KGZ8MCk/cWM6cGMpKHRoaXMuUWEsXG5sLGYpKX07Yy5wcm90b3R5cGUuSWI9ZnVuY3Rpb24oZil7bnVsbD09ZiYmKGY9dGhpcy5PYSx0aGlzLk9hKz0xKTtyYih0aGlzLlFhLGYsMCwwLDApfTtjLnByb3RvdHlwZS54Yj1mdW5jdGlvbihmLGwpe251bGw9PWwmJihsPXRoaXMuT2EsdGhpcy5PYSs9MSk7c3dpdGNoKHR5cGVvZiBmKXtjYXNlIFwic3RyaW5nXCI6dGhpcy53YihmLGwpO3JldHVybjtjYXNlIFwibnVtYmVyXCI6dGhpcy52YihmLGwpO3JldHVybjtjYXNlIFwiYmlnaW50XCI6dGhpcy53YihmLnRvU3RyaW5nKCksbCk7cmV0dXJuO2Nhc2UgXCJib29sZWFuXCI6dGhpcy52YihmKzAsbCk7cmV0dXJuO2Nhc2UgXCJvYmplY3RcIjppZihudWxsPT09Zil7dGhpcy5JYihsKTtyZXR1cm59aWYobnVsbCE9Zi5sZW5ndGgpe3RoaXMuRmIoZixsKTtyZXR1cm59fXRocm93XCJXcm9uZyBBUEkgdXNlIDogdHJpZWQgdG8gYmluZCBhIHZhbHVlIG9mIGFuIHVua25vd24gdHlwZSAoXCIrZitcIikuXCI7fTtjLnByb3RvdHlwZS5IYj1mdW5jdGlvbihmKXt2YXIgbD1cbnRoaXM7T2JqZWN0LmtleXMoZikuZm9yRWFjaChmdW5jdGlvbihuKXt2YXIgcD1yYyhsLlFhLG4pOzAhPT1wJiZsLnhiKGZbbl0scCl9KTtyZXR1cm4hMH07Yy5wcm90b3R5cGUuR2I9ZnVuY3Rpb24oZil7Zm9yKHZhciBsPTA7bDxmLmxlbmd0aDtsKz0xKXRoaXMueGIoZltsXSxsKzEpO3JldHVybiEwfTtjLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuZnJlZW1lbSgpO3JldHVybiAwPT09Q2ModGhpcy5RYSkmJjA9PT1CYyh0aGlzLlFhKX07Yy5wcm90b3R5cGUuZnJlZW1lbT1mdW5jdGlvbigpe2Zvcih2YXIgZjt2b2lkIDAhPT0oZj10aGlzLm1iLnBvcCgpKTspZWEoZil9O2MucHJvdG90eXBlLllhPWZ1bmN0aW9uKCl7dGhpcy5mcmVlbWVtKCk7dmFyIGY9MD09PURjKHRoaXMuUWEpO2RlbGV0ZSB0aGlzLmRiLmdiW3RoaXMuUWFdO3RoaXMuUWE9MDtyZXR1cm4gZn07ZC5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe2lmKG51bGw9PT10aGlzLmZiKXJldHVybntkb25lOiEwfTtcbm51bGwhPT10aGlzLiRhJiYodGhpcy4kYS5ZYSgpLHRoaXMuJGE9bnVsbCk7aWYoIXRoaXMuZGIuZGIpdGhyb3cgdGhpcy5vYigpLEVycm9yKFwiRGF0YWJhc2UgY2xvc2VkXCIpO3ZhciBmPXFhKCksbD15KDQpO3JhKGcpO3JhKGwpO3RyeXt0aGlzLmRiLmhhbmRsZUVycm9yKHFiKHRoaXMuZGIuZGIsdGhpcy5sYiwtMSxnLGwpKTt0aGlzLmxiPXQobCxcImkzMlwiKTt2YXIgbj10KGcsXCJpMzJcIik7aWYoMD09PW4pcmV0dXJuIHRoaXMub2IoKSx7ZG9uZTohMH07dGhpcy4kYT1uZXcgYyhuLHRoaXMuZGIpO3RoaXMuZGIuZ2Jbbl09dGhpcy4kYTtyZXR1cm57dmFsdWU6dGhpcy4kYSxkb25lOiExfX1jYXRjaChwKXt0aHJvdyB0aGlzLnNiPXoodGhpcy5sYiksdGhpcy5vYigpLHA7fWZpbmFsbHl7c2EoZil9fTtkLnByb3RvdHlwZS5vYj1mdW5jdGlvbigpe2VhKHRoaXMuZmIpO3RoaXMuZmI9bnVsbH07ZC5wcm90b3R5cGUuUWI9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXRoaXMuc2I/dGhpcy5zYjpcbnoodGhpcy5sYil9O1wiZnVuY3Rpb25cIj09PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yJiYoZC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXT1mdW5jdGlvbigpe3JldHVybiB0aGlzfSk7ZS5wcm90b3R5cGUucnVuPWZ1bmN0aW9uKGYsbCl7aWYoIXRoaXMuZGIpdGhyb3dcIkRhdGFiYXNlIGNsb3NlZFwiO2lmKGwpe2Y9dGhpcy50YihmLGwpO3RyeXtmLnN0ZXAoKX1maW5hbGx5e2YuWWEoKX19ZWxzZSB0aGlzLmhhbmRsZUVycm9yKHUodGhpcy5kYixmLDAsMCxnKSk7cmV0dXJuIHRoaXN9O2UucHJvdG90eXBlLmV4ZWM9ZnVuY3Rpb24oZixsLG4pe2lmKCF0aGlzLmRiKXRocm93XCJEYXRhYmFzZSBjbG9zZWRcIjt2YXIgcD1xYSgpLHI9bnVsbCx3PW51bGwsSj1udWxsO3RyeXtKPXc9ZmEoZik7dmFyIEk9eSg0KTtmb3IoZj1bXTswIT09dChKLFwiaThcIik7KXtyYShnKTtyYShJKTt0aGlzLmhhbmRsZUVycm9yKHFiKHRoaXMuZGIsSiwtMSxnLEkpKTtcbnZhciBMPXQoZyxcImkzMlwiKTtKPXQoSSxcImkzMlwiKTtpZigwIT09TCl7dmFyIEc9bnVsbDtyPW5ldyBjKEwsdGhpcyk7Zm9yKG51bGwhPWwmJnIuYmluZChsKTtyLnN0ZXAoKTspbnVsbD09PUcmJihHPXtjb2x1bW5zOnIucWIoKSx2YWx1ZXM6W119LGYucHVzaChHKSksRy52YWx1ZXMucHVzaChyLmdldChudWxsLG4pKTtyLllhKCl9fXJldHVybiBmfWNhdGNoKGxhKXt0aHJvdyByJiZyLllhKCksbGE7fWZpbmFsbHl7dyYmZWEodyksc2EocCl9fTtlLnByb3RvdHlwZS5NYj1mdW5jdGlvbihmLGwsbixwLHIpe1wiZnVuY3Rpb25cIj09PXR5cGVvZiBsJiYocD1uLG49bCxsPXZvaWQgMCk7Zj10aGlzLnRiKGYsbCk7dHJ5e2Zvcig7Zi5zdGVwKCk7KW4oZi56YihudWxsLHIpKX1maW5hbGx5e2YuWWEoKX1pZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgcClyZXR1cm4gcCgpfTtlLnByb3RvdHlwZS50Yj1mdW5jdGlvbihmLGwpe3JhKGcpO3RoaXMuaGFuZGxlRXJyb3IoRCh0aGlzLmRiLGYsLTEsZywwKSk7XG5mPXQoZyxcImkzMlwiKTtpZigwPT09Zil0aHJvd1wiTm90aGluZyB0byBwcmVwYXJlXCI7dmFyIG49bmV3IGMoZix0aGlzKTtudWxsIT1sJiZuLmJpbmQobCk7cmV0dXJuIHRoaXMuZ2JbZl09bn07ZS5wcm90b3R5cGUuVWI9ZnVuY3Rpb24oZil7cmV0dXJuIG5ldyBkKGYsdGhpcyl9O2UucHJvdG90eXBlLk5iPWZ1bmN0aW9uKCl7T2JqZWN0LnZhbHVlcyh0aGlzLmdiKS5mb3JFYWNoKGZ1bmN0aW9uKGwpe2wuWWEoKX0pO09iamVjdC52YWx1ZXModGhpcy5TYSkuZm9yRWFjaChBKTt0aGlzLlNhPXt9O3RoaXMuaGFuZGxlRXJyb3Iodih0aGlzLmRiKSk7dmFyIGY9dGEodGhpcy5maWxlbmFtZSk7dGhpcy5oYW5kbGVFcnJvcihxKHRoaXMuZmlsZW5hbWUsZykpO3RoaXMuZGI9dChnLFwiaTMyXCIpO29iKHRoaXMuZGIpO3JldHVybiBmfTtlLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe251bGwhPT10aGlzLmRiJiYoT2JqZWN0LnZhbHVlcyh0aGlzLmdiKS5mb3JFYWNoKGZ1bmN0aW9uKGYpe2YuWWEoKX0pLFxuT2JqZWN0LnZhbHVlcyh0aGlzLlNhKS5mb3JFYWNoKEEpLHRoaXMuU2E9e30sdGhpcy5aYSYmKEEodGhpcy5aYSksdGhpcy5aYT12b2lkIDApLHRoaXMuaGFuZGxlRXJyb3Iodih0aGlzLmRiKSksdWEoXCIvXCIrdGhpcy5maWxlbmFtZSksdGhpcy5kYj1udWxsKX07ZS5wcm90b3R5cGUuaGFuZGxlRXJyb3I9ZnVuY3Rpb24oZil7aWYoMD09PWYpcmV0dXJuIG51bGw7Zj10Yyh0aGlzLmRiKTt0aHJvdyBFcnJvcihmKTt9O2UucHJvdG90eXBlLlJiPWZ1bmN0aW9uKCl7cmV0dXJuIHgodGhpcy5kYil9O2UucHJvdG90eXBlLktiPWZ1bmN0aW9uKGYsbCl7T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuU2EsZikmJihBKHRoaXMuU2FbZl0pLGRlbGV0ZSB0aGlzLlNhW2ZdKTt2YXIgbj13YShmdW5jdGlvbihwLHIsdyl7cj1iKHIsdyk7dHJ5e3ZhciBKPWwuYXBwbHkobnVsbCxyKX1jYXRjaChJKXt2YShwLEksLTEpO3JldHVybn1hKHAsSil9LFwidmlpaVwiKTt0aGlzLlNhW2ZdPVxubjt0aGlzLmhhbmRsZUVycm9yKHRiKHRoaXMuZGIsZixsLmxlbmd0aCwxLDAsbiwwLDAsMCkpO3JldHVybiB0aGlzfTtlLnByb3RvdHlwZS5KYj1mdW5jdGlvbihmLGwpe3ZhciBuPWwuaW5pdHx8ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0scD1sLmZpbmFsaXplfHxmdW5jdGlvbihMKXtyZXR1cm4gTH0scj1sLnN0ZXA7aWYoIXIpdGhyb3dcIkFuIGFnZ3JlZ2F0ZSBmdW5jdGlvbiBtdXN0IGhhdmUgYSBzdGVwIGZ1bmN0aW9uIGluIFwiK2Y7dmFyIHc9e307T2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGhpcy5TYSxmKSYmKEEodGhpcy5TYVtmXSksZGVsZXRlIHRoaXMuU2FbZl0pO2w9ZitcIl9fZmluYWxpemVcIjtPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLlNhLGwpJiYoQSh0aGlzLlNhW2xdKSxkZWxldGUgdGhpcy5TYVtsXSk7dmFyIEo9d2EoZnVuY3Rpb24oTCxHLGxhKXt2YXIgVj11YihMLDEpO09iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHcsVil8fCh3W1ZdPW4oKSk7XG5HPWIoRyxsYSk7Rz1bd1tWXV0uY29uY2F0KEcpO3RyeXt3W1ZdPXIuYXBwbHkobnVsbCxHKX1jYXRjaChGYyl7ZGVsZXRlIHdbVl0sdmEoTCxGYywtMSl9fSxcInZpaWlcIiksST13YShmdW5jdGlvbihMKXt2YXIgRz11YihMLDEpO3RyeXt2YXIgbGE9cCh3W0ddKX1jYXRjaChWKXtkZWxldGUgd1tHXTt2YShMLFYsLTEpO3JldHVybn1hKEwsbGEpO2RlbGV0ZSB3W0ddfSxcInZpXCIpO3RoaXMuU2FbZl09Sjt0aGlzLlNhW2xdPUk7dGhpcy5oYW5kbGVFcnJvcih0Yih0aGlzLmRiLGYsci5sZW5ndGgtMSwxLDAsMCxKLEksMCkpO3JldHVybiB0aGlzfTtlLnByb3RvdHlwZS5aYj1mdW5jdGlvbihmKXt0aGlzLlphJiYodmIodGhpcy5kYiwwLDApLEEodGhpcy5aYSksdGhpcy5aYT12b2lkIDApO2lmKCFmKXJldHVybiB0aGlzO3RoaXMuWmE9d2EoZnVuY3Rpb24obCxuLHAscix3KXtzd2l0Y2gobil7Y2FzZSAxODpsPVwiaW5zZXJ0XCI7YnJlYWs7Y2FzZSAyMzpsPVwidXBkYXRlXCI7YnJlYWs7Y2FzZSA5Omw9XG5cImRlbGV0ZVwiO2JyZWFrO2RlZmF1bHQ6dGhyb3dcInVua25vd24gb3BlcmF0aW9uQ29kZSBpbiB1cGRhdGVIb29rIGNhbGxiYWNrOiBcIituO31wPXoocCk7cj16KHIpO2lmKHc+TnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpdGhyb3dcInJvd0lkIHRvbyBiaWcgdG8gZml0IGluc2lkZSBhIE51bWJlclwiO2YobCxwLHIsTnVtYmVyKHcpKX0sXCJ2aWlpaWpcIik7dmIodGhpcy5kYix0aGlzLlphLDApO3JldHVybiB0aGlzfTtjLnByb3RvdHlwZS5iaW5kPWMucHJvdG90eXBlLmJpbmQ7Yy5wcm90b3R5cGUuc3RlcD1jLnByb3RvdHlwZS5zdGVwO2MucHJvdG90eXBlLmdldD1jLnByb3RvdHlwZS5nZXQ7Yy5wcm90b3R5cGUuZ2V0Q29sdW1uTmFtZXM9Yy5wcm90b3R5cGUucWI7Yy5wcm90b3R5cGUuZ2V0QXNPYmplY3Q9Yy5wcm90b3R5cGUuemI7Yy5wcm90b3R5cGUuZ2V0U1FMPWMucHJvdG90eXBlLlNiO2MucHJvdG90eXBlLmdldE5vcm1hbGl6ZWRTUUw9Yy5wcm90b3R5cGUuUGI7Yy5wcm90b3R5cGUucnVuPVxuYy5wcm90b3R5cGUucnVuO2MucHJvdG90eXBlLnJlc2V0PWMucHJvdG90eXBlLnJlc2V0O2MucHJvdG90eXBlLmZyZWVtZW09Yy5wcm90b3R5cGUuZnJlZW1lbTtjLnByb3RvdHlwZS5mcmVlPWMucHJvdG90eXBlLllhO2QucHJvdG90eXBlLm5leHQ9ZC5wcm90b3R5cGUubmV4dDtkLnByb3RvdHlwZS5nZXRSZW1haW5pbmdTUUw9ZC5wcm90b3R5cGUuUWI7ZS5wcm90b3R5cGUucnVuPWUucHJvdG90eXBlLnJ1bjtlLnByb3RvdHlwZS5leGVjPWUucHJvdG90eXBlLmV4ZWM7ZS5wcm90b3R5cGUuZWFjaD1lLnByb3RvdHlwZS5NYjtlLnByb3RvdHlwZS5wcmVwYXJlPWUucHJvdG90eXBlLnRiO2UucHJvdG90eXBlLml0ZXJhdGVTdGF0ZW1lbnRzPWUucHJvdG90eXBlLlViO2UucHJvdG90eXBlW1wiZXhwb3J0XCJdPWUucHJvdG90eXBlLk5iO2UucHJvdG90eXBlLmNsb3NlPWUucHJvdG90eXBlLmNsb3NlO2UucHJvdG90eXBlLmhhbmRsZUVycm9yPWUucHJvdG90eXBlLmhhbmRsZUVycm9yO2UucHJvdG90eXBlLmdldFJvd3NNb2RpZmllZD1cbmUucHJvdG90eXBlLlJiO2UucHJvdG90eXBlLmNyZWF0ZV9mdW5jdGlvbj1lLnByb3RvdHlwZS5LYjtlLnByb3RvdHlwZS5jcmVhdGVfYWdncmVnYXRlPWUucHJvdG90eXBlLkpiO2UucHJvdG90eXBlLnVwZGF0ZUhvb2s9ZS5wcm90b3R5cGUuWmI7ay5EYXRhYmFzZT1lfTt2YXIgeGE9XCIuL3RoaXMucHJvZ3JhbVwiLHlhPShhLGIpPT57dGhyb3cgYjt9LHphPWdsb2JhbFRoaXMuZG9jdW1lbnQ/LmN1cnJlbnRTY3JpcHQ/LnNyYztcInVuZGVmaW5lZFwiIT10eXBlb2YgX19maWxlbmFtZT96YT1fX2ZpbGVuYW1lOmJhJiYoemE9c2VsZi5sb2NhdGlvbi5ocmVmKTt2YXIgQWE9XCJcIixCYSxDYTtcbmlmKGNhKXt2YXIgZnM9cmVxdWlyZShcIm5vZGU6ZnNcIik7QWE9X19kaXJuYW1lK1wiL1wiO0NhPWE9PnthPURhKGEpP25ldyBVUkwoYSk6YTtyZXR1cm4gZnMucmVhZEZpbGVTeW5jKGEpfTtCYT1hc3luYyBhPT57YT1EYShhKT9uZXcgVVJMKGEpOmE7cmV0dXJuIGZzLnJlYWRGaWxlU3luYyhhLHZvaWQgMCl9OzE8cHJvY2Vzcy5hcmd2Lmxlbmd0aCYmKHhhPXByb2Nlc3MuYXJndlsxXS5yZXBsYWNlKC9cXFxcL2csXCIvXCIpKTtwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmKG1vZHVsZS5leHBvcnRzPWspO3lhPShhLGIpPT57cHJvY2Vzcy5leGl0Q29kZT1hO3Rocm93IGI7fX1lbHNlIGlmKGFhfHxiYSl7dHJ5e0FhPShuZXcgVVJMKFwiLlwiLHphKSkuaHJlZn1jYXRjaHt9YmEmJihDYT1hPT57dmFyIGI9bmV3IFhNTEh0dHBSZXF1ZXN0O2Iub3BlbihcIkdFVFwiLGEsITEpO2IucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIjtiLnNlbmQobnVsbCk7cmV0dXJuIG5ldyBVaW50OEFycmF5KGIucmVzcG9uc2UpfSk7XG5CYT1hc3luYyBhPT57aWYoRGEoYSkpcmV0dXJuIG5ldyBQcm9taXNlKChjLGQpPT57dmFyIGU9bmV3IFhNTEh0dHBSZXF1ZXN0O2Uub3BlbihcIkdFVFwiLGEsITApO2UucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIjtlLm9ubG9hZD0oKT0+ezIwMD09ZS5zdGF0dXN8fDA9PWUuc3RhdHVzJiZlLnJlc3BvbnNlP2MoZS5yZXNwb25zZSk6ZChlLnN0YXR1cyl9O2Uub25lcnJvcj1kO2Uuc2VuZChudWxsKX0pO3ZhciBiPWF3YWl0IGZldGNoKGEse2NyZWRlbnRpYWxzOlwic2FtZS1vcmlnaW5cIn0pO2lmKGIub2spcmV0dXJuIGIuYXJyYXlCdWZmZXIoKTt0aHJvdyBFcnJvcihiLnN0YXR1cytcIiA6IFwiK2IudXJsKTt9fXZhciBFYT1jb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpLEI9Y29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUpLEZhLEdhPSExLEhhLERhPWE9PmEuc3RhcnRzV2l0aChcImZpbGU6Ly9cIiksbSxDLElhLEUsRixKYSxLYSxIO1xuZnVuY3Rpb24gTGEoKXt2YXIgYT1NYS5idWZmZXI7bT1uZXcgSW50OEFycmF5KGEpO0lhPW5ldyBJbnQxNkFycmF5KGEpO0M9bmV3IFVpbnQ4QXJyYXkoYSk7bmV3IFVpbnQxNkFycmF5KGEpO0U9bmV3IEludDMyQXJyYXkoYSk7Rj1uZXcgVWludDMyQXJyYXkoYSk7SmE9bmV3IEZsb2F0MzJBcnJheShhKTtLYT1uZXcgRmxvYXQ2NEFycmF5KGEpO0g9bmV3IEJpZ0ludDY0QXJyYXkoYSk7bmV3IEJpZ1VpbnQ2NEFycmF5KGEpfWZ1bmN0aW9uIE5hKGEpe2sub25BYm9ydD8uKGEpO2E9XCJBYm9ydGVkKFwiK2ErXCIpXCI7QihhKTtHYT0hMDt0aHJvdyBuZXcgV2ViQXNzZW1ibHkuUnVudGltZUVycm9yKGErXCIuIEJ1aWxkIHdpdGggLXNBU1NFUlRJT05TIGZvciBtb3JlIGluZm8uXCIpO312YXIgT2E7XG5hc3luYyBmdW5jdGlvbiBQYShhKXtpZighRmEpdHJ5e3ZhciBiPWF3YWl0IEJhKGEpO3JldHVybiBuZXcgVWludDhBcnJheShiKX1jYXRjaHt9aWYoYT09T2EmJkZhKWE9bmV3IFVpbnQ4QXJyYXkoRmEpO2Vsc2UgaWYoQ2EpYT1DYShhKTtlbHNlIHRocm93XCJib3RoIGFzeW5jIGFuZCBzeW5jIGZldGNoaW5nIG9mIHRoZSB3YXNtIGZhaWxlZFwiO3JldHVybiBhfWFzeW5jIGZ1bmN0aW9uIFFhKGEsYil7dHJ5e3ZhciBjPWF3YWl0IFBhKGEpO3JldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShjLGIpfWNhdGNoKGQpe0IoYGZhaWxlZCB0byBhc3luY2hyb25vdXNseSBwcmVwYXJlIHdhc206ICR7ZH1gKSxOYShkKX19XG5hc3luYyBmdW5jdGlvbiBSYShhKXt2YXIgYj1PYTtpZighRmEmJiFEYShiKSYmIWNhKXRyeXt2YXIgYz1mZXRjaChiLHtjcmVkZW50aWFsczpcInNhbWUtb3JpZ2luXCJ9KTtyZXR1cm4gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcoYyxhKX1jYXRjaChkKXtCKGB3YXNtIHN0cmVhbWluZyBjb21waWxlIGZhaWxlZDogJHtkfWApLEIoXCJmYWxsaW5nIGJhY2sgdG8gQXJyYXlCdWZmZXIgaW5zdGFudGlhdGlvblwiKX1yZXR1cm4gUWEoYixhKX1jbGFzcyBTYXtuYW1lPVwiRXhpdFN0YXR1c1wiO2NvbnN0cnVjdG9yKGEpe3RoaXMubWVzc2FnZT1gUHJvZ3JhbSB0ZXJtaW5hdGVkIHdpdGggZXhpdCgke2F9KWA7dGhpcy5zdGF0dXM9YX19dmFyIFRhPWE9Pntmb3IoOzA8YS5sZW5ndGg7KWEuc2hpZnQoKShrKX0sVWE9W10sVmE9W10sV2E9KCk9Pnt2YXIgYT1rLnByZVJ1bi5zaGlmdCgpO1ZhLnB1c2goYSl9LEs9MCxYYT1udWxsO1xuZnVuY3Rpb24gdChhLGI9XCJpOFwiKXtiLmVuZHNXaXRoKFwiKlwiKSYmKGI9XCIqXCIpO3N3aXRjaChiKXtjYXNlIFwiaTFcIjpyZXR1cm4gbVthXTtjYXNlIFwiaThcIjpyZXR1cm4gbVthXTtjYXNlIFwiaTE2XCI6cmV0dXJuIElhW2E+PjFdO2Nhc2UgXCJpMzJcIjpyZXR1cm4gRVthPj4yXTtjYXNlIFwiaTY0XCI6cmV0dXJuIEhbYT4+M107Y2FzZSBcImZsb2F0XCI6cmV0dXJuIEphW2E+PjJdO2Nhc2UgXCJkb3VibGVcIjpyZXR1cm4gS2FbYT4+M107Y2FzZSBcIipcIjpyZXR1cm4gRlthPj4yXTtkZWZhdWx0Ok5hKGBpbnZhbGlkIHR5cGUgZm9yIGdldFZhbHVlOiAke2J9YCl9fXZhciBZYT0hMDtcbmZ1bmN0aW9uIHJhKGEpe3ZhciBiPVwiaTMyXCI7Yi5lbmRzV2l0aChcIipcIikmJihiPVwiKlwiKTtzd2l0Y2goYil7Y2FzZSBcImkxXCI6bVthXT0wO2JyZWFrO2Nhc2UgXCJpOFwiOm1bYV09MDticmVhaztjYXNlIFwiaTE2XCI6SWFbYT4+MV09MDticmVhaztjYXNlIFwiaTMyXCI6RVthPj4yXT0wO2JyZWFrO2Nhc2UgXCJpNjRcIjpIW2E+PjNdPUJpZ0ludCgwKTticmVhaztjYXNlIFwiZmxvYXRcIjpKYVthPj4yXT0wO2JyZWFrO2Nhc2UgXCJkb3VibGVcIjpLYVthPj4zXT0wO2JyZWFrO2Nhc2UgXCIqXCI6RlthPj4yXT0wO2JyZWFrO2RlZmF1bHQ6TmEoYGludmFsaWQgdHlwZSBmb3Igc2V0VmFsdWU6ICR7Yn1gKX19XG52YXIgWmE9bmV3IFRleHREZWNvZGVyLCRhPShhLGIsYyxkKT0+e2M9YitjO2lmKGQpcmV0dXJuIGM7Zm9yKDthW2JdJiYhKGI+PWMpOykrK2I7cmV0dXJuIGJ9LHo9KGEsYixjKT0+YT9aYS5kZWNvZGUoQy5zdWJhcnJheShhLCRhKEMsYSxiLGMpKSk6XCJcIixhYj0oYSxiKT0+e2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGgtMTswPD1kO2QtLSl7dmFyIGU9YVtkXTtcIi5cIj09PWU/YS5zcGxpY2UoZCwxKTpcIi4uXCI9PT1lPyhhLnNwbGljZShkLDEpLGMrKyk6YyYmKGEuc3BsaWNlKGQsMSksYy0tKX1pZihiKWZvcig7YztjLS0pYS51bnNoaWZ0KFwiLi5cIik7cmV0dXJuIGF9LGlhPWE9Pnt2YXIgYj1cIi9cIj09PWEuY2hhckF0KDApLGM9XCIvXCI9PT1hLnNsaWNlKC0xKTsoYT1hYihhLnNwbGl0KFwiL1wiKS5maWx0ZXIoZD0+ISFkKSwhYikuam9pbihcIi9cIikpfHxifHwoYT1cIi5cIik7YSYmYyYmKGErPVwiL1wiKTtyZXR1cm4oYj9cIi9cIjpcIlwiKSthfSxiYj1hPT57dmFyIGI9L14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC8uZXhlYyhhKS5zbGljZSgxKTtcbmE9YlswXTtiPWJbMV07aWYoIWEmJiFiKXJldHVyblwiLlwiO2ImJj1iLnNsaWNlKDAsLTEpO3JldHVybiBhK2J9LGNiPWE9PmEmJmEubWF0Y2goLyhbXlxcL10rfFxcLylcXC8qJC8pWzFdLGRiPSgpPT57aWYoY2Epe3ZhciBhPXJlcXVpcmUoXCJub2RlOmNyeXB0b1wiKTtyZXR1cm4gYj0+YS5yYW5kb21GaWxsU3luYyhiKX1yZXR1cm4gYj0+Y3J5cHRvLmdldFJhbmRvbVZhbHVlcyhiKX0sZWI9YT0+eyhlYj1kYigpKShhKX0sZmI9KC4uLmEpPT57Zm9yKHZhciBiPVwiXCIsYz0hMSxkPWEubGVuZ3RoLTE7LTE8PWQmJiFjO2QtLSl7Yz0wPD1kP2FbZF06XCIvXCI7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGMpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzXCIpO2lmKCFjKXJldHVyblwiXCI7Yj1jK1wiL1wiK2I7Yz1cIi9cIj09PWMuY2hhckF0KDApfWI9YWIoYi5zcGxpdChcIi9cIikuZmlsdGVyKGU9PiEhZSksIWMpLmpvaW4oXCIvXCIpO3JldHVybihjP1wiL1wiOlxuXCJcIikrYnx8XCIuXCJ9LGdiPWE9Pnt2YXIgYj0kYShhLDApO3JldHVybiBaYS5kZWNvZGUoYS5idWZmZXI/YS5zdWJhcnJheSgwLGIpOm5ldyBVaW50OEFycmF5KGEuc2xpY2UoMCxiKSkpfSxoYj1bXSxpYj1hPT57Zm9yKHZhciBiPTAsYz0wO2M8YS5sZW5ndGg7KytjKXt2YXIgZD1hLmNoYXJDb2RlQXQoYyk7MTI3Pj1kP2IrKzoyMDQ3Pj1kP2IrPTI6NTUyOTY8PWQmJjU3MzQzPj1kPyhiKz00LCsrYyk6Yis9M31yZXR1cm4gYn0sTT0oYSxiLGMsZCk9PntpZighKDA8ZCkpcmV0dXJuIDA7dmFyIGU9YztkPWMrZC0xO2Zvcih2YXIgZz0wO2c8YS5sZW5ndGg7KytnKXt2YXIgaD1hLmNvZGVQb2ludEF0KGcpO2lmKDEyNz49aCl7aWYoYz49ZClicmVhaztiW2MrK109aH1lbHNlIGlmKDIwNDc+PWgpe2lmKGMrMT49ZClicmVhaztiW2MrK109MTkyfGg+PjY7YltjKytdPTEyOHxoJjYzfWVsc2UgaWYoNjU1MzU+PWgpe2lmKGMrMj49ZClicmVhaztiW2MrK109MjI0fGg+PjEyO2JbYysrXT0xMjh8XG5oPj42JjYzO2JbYysrXT0xMjh8aCY2M31lbHNle2lmKGMrMz49ZClicmVhaztiW2MrK109MjQwfGg+PjE4O2JbYysrXT0xMjh8aD4+MTImNjM7YltjKytdPTEyOHxoPj42JjYzO2JbYysrXT0xMjh8aCY2MztnKyt9fWJbY109MDtyZXR1cm4gYy1lfSxqYj1bXTtmdW5jdGlvbiBrYihhLGIpe2piW2FdPXtpbnB1dDpbXSxvdXRwdXQ6W10sZWI6Yn07bWIoYSxuYil9XG52YXIgbmI9e29wZW4oYSl7dmFyIGI9amJbYS5ub2RlLnJkZXZdO2lmKCFiKXRocm93IG5ldyBOKDQzKTthLnR0eT1iO2Euc2Vla2FibGU9ITF9LGNsb3NlKGEpe2EudHR5LmViLmZzeW5jKGEudHR5KX0sZnN5bmMoYSl7YS50dHkuZWIuZnN5bmMoYS50dHkpfSxyZWFkKGEsYixjLGQpe2lmKCFhLnR0eXx8IWEudHR5LmViLkJiKXRocm93IG5ldyBOKDYwKTtmb3IodmFyIGU9MCxnPTA7ZzxkO2crKyl7dHJ5e3ZhciBoPWEudHR5LmViLkJiKGEudHR5KX1jYXRjaChxKXt0aHJvdyBuZXcgTigyOSk7fWlmKHZvaWQgMD09PWgmJjA9PT1lKXRocm93IG5ldyBOKDYpO2lmKG51bGw9PT1ofHx2b2lkIDA9PT1oKWJyZWFrO2UrKztiW2MrZ109aH1lJiYoYS5ub2RlLmF0aW1lPURhdGUubm93KCkpO3JldHVybiBlfSx3cml0ZShhLGIsYyxkKXtpZighYS50dHl8fCFhLnR0eS5lYi51Yil0aHJvdyBuZXcgTig2MCk7dHJ5e2Zvcih2YXIgZT0wO2U8ZDtlKyspYS50dHkuZWIudWIoYS50dHksYltjK2VdKX1jYXRjaChnKXt0aHJvdyBuZXcgTigyOSk7XG59ZCYmKGEubm9kZS5tdGltZT1hLm5vZGUuY3RpbWU9RGF0ZS5ub3coKSk7cmV0dXJuIGV9fSx3Yj17QmIoKXthOntpZighaGIubGVuZ3RoKXt2YXIgYT1udWxsO2lmKGNhKXt2YXIgYj1CdWZmZXIuYWxsb2MoMjU2KSxjPTAsZD1wcm9jZXNzLnN0ZGluLmZkO3RyeXtjPWZzLnJlYWRTeW5jKGQsYiwwLDI1Nil9Y2F0Y2goZSl7aWYoZS50b1N0cmluZygpLmluY2x1ZGVzKFwiRU9GXCIpKWM9MDtlbHNlIHRocm93IGU7fTA8YyYmKGE9Yi5zbGljZSgwLGMpLnRvU3RyaW5nKFwidXRmLThcIikpfWVsc2UgZ2xvYmFsVGhpcy53aW5kb3c/LnByb21wdCYmKGE9d2luZG93LnByb21wdChcIklucHV0OiBcIiksbnVsbCE9PWEmJihhKz1cIlxcblwiKSk7aWYoIWEpe2E9bnVsbDticmVhayBhfWI9QXJyYXkoaWIoYSkrMSk7YT1NKGEsYiwwLGIubGVuZ3RoKTtiLmxlbmd0aD1hO2hiPWJ9YT1oYi5zaGlmdCgpfXJldHVybiBhfSx1YihhLGIpe251bGw9PT1ifHwxMD09PWI/KEVhKGdiKGEub3V0cHV0KSksYS5vdXRwdXQ9XG5bXSk6MCE9YiYmYS5vdXRwdXQucHVzaChiKX0sZnN5bmMoYSl7MDxhLm91dHB1dD8ubGVuZ3RoJiYoRWEoZ2IoYS5vdXRwdXQpKSxhLm91dHB1dD1bXSl9LGhjKCl7cmV0dXJue2JjOjI1ODU2LGRjOjUsYWM6MTkxLGNjOjM1Mzg3LCRiOlszLDI4LDEyNywyMSw0LDAsMSwwLDE3LDE5LDI2LDAsMTgsMTUsMjMsMjIsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF19fSxpYygpe3JldHVybiAwfSxqYygpe3JldHVyblsyNCw4MF19fSx4Yj17dWIoYSxiKXtudWxsPT09Ynx8MTA9PT1iPyhCKGdiKGEub3V0cHV0KSksYS5vdXRwdXQ9W10pOjAhPWImJmEub3V0cHV0LnB1c2goYil9LGZzeW5jKGEpezA8YS5vdXRwdXQ/Lmxlbmd0aCYmKEIoZ2IoYS5vdXRwdXQpKSxhLm91dHB1dD1bXSl9fSxPPXtXYTpudWxsLFhhKCl7cmV0dXJuIE8uY3JlYXRlTm9kZShudWxsLFwiL1wiLDE2ODk1LDApfSxjcmVhdGVOb2RlKGEsYixjLGQpe2lmKDI0NTc2PT09KGMmNjE0NDApfHw0MDk2PT09KGMmNjE0NDApKXRocm93IG5ldyBOKDYzKTtcbk8uV2F8fChPLldhPXtkaXI6e25vZGU6e1RhOk8uTGEuVGEsVWE6Ty5MYS5VYSxsb29rdXA6Ty5MYS5sb29rdXAsaWI6Ty5MYS5pYixyZW5hbWU6Ty5MYS5yZW5hbWUsdW5saW5rOk8uTGEudW5saW5rLHJtZGlyOk8uTGEucm1kaXIscmVhZGRpcjpPLkxhLnJlYWRkaXIsc3ltbGluazpPLkxhLnN5bWxpbmt9LHN0cmVhbTp7VmE6Ty5NYS5WYX19LGZpbGU6e25vZGU6e1RhOk8uTGEuVGEsVWE6Ty5MYS5VYX0sc3RyZWFtOntWYTpPLk1hLlZhLHJlYWQ6Ty5NYS5yZWFkLHdyaXRlOk8uTWEud3JpdGUsamI6Ty5NYS5qYixrYjpPLk1hLmtifX0sbGluazp7bm9kZTp7VGE6Ty5MYS5UYSxVYTpPLkxhLlVhLHJlYWRsaW5rOk8uTGEucmVhZGxpbmt9LHN0cmVhbTp7fX0seWI6e25vZGU6e1RhOk8uTGEuVGEsVWE6Ty5MYS5VYX0sc3RyZWFtOnlifX0pO2M9emIoYSxiLGMsZCk7UChjLm1vZGUpPyhjLkxhPU8uV2EuZGlyLm5vZGUsYy5NYT1PLldhLmRpci5zdHJlYW0sYy5OYT17fSk6MzI3Njg9PT1cbihjLm1vZGUmNjE0NDApPyhjLkxhPU8uV2EuZmlsZS5ub2RlLGMuTWE9Ty5XYS5maWxlLnN0cmVhbSxjLlJhPTAsYy5OYT1udWxsKTo0MDk2MD09PShjLm1vZGUmNjE0NDApPyhjLkxhPU8uV2EubGluay5ub2RlLGMuTWE9Ty5XYS5saW5rLnN0cmVhbSk6ODE5Mj09PShjLm1vZGUmNjE0NDApJiYoYy5MYT1PLldhLnliLm5vZGUsYy5NYT1PLldhLnliLnN0cmVhbSk7Yy5hdGltZT1jLm10aW1lPWMuY3RpbWU9RGF0ZS5ub3coKTthJiYoYS5OYVtiXT1jLGEuYXRpbWU9YS5tdGltZT1hLmN0aW1lPWMuYXRpbWUpO3JldHVybiBjfSxmYyhhKXtyZXR1cm4gYS5OYT9hLk5hLnN1YmFycmF5P2EuTmEuc3ViYXJyYXkoMCxhLlJhKTpuZXcgVWludDhBcnJheShhLk5hKTpuZXcgVWludDhBcnJheSgwKX0sTGE6e1RhKGEpe3ZhciBiPXt9O2IuZGV2PTgxOTI9PT0oYS5tb2RlJjYxNDQwKT9hLmlkOjE7Yi5pbm89YS5pZDtiLm1vZGU9YS5tb2RlO2Iubmxpbms9MTtiLnVpZD0wO2IuZ2lkPTA7Yi5yZGV2PVxuYS5yZGV2O1AoYS5tb2RlKT9iLnNpemU9NDA5NjozMjc2OD09PShhLm1vZGUmNjE0NDApP2Iuc2l6ZT1hLlJhOjQwOTYwPT09KGEubW9kZSY2MTQ0MCk/Yi5zaXplPWEubGluay5sZW5ndGg6Yi5zaXplPTA7Yi5hdGltZT1uZXcgRGF0ZShhLmF0aW1lKTtiLm10aW1lPW5ldyBEYXRlKGEubXRpbWUpO2IuY3RpbWU9bmV3IERhdGUoYS5jdGltZSk7Yi5ibGtzaXplPTQwOTY7Yi5ibG9ja3M9TWF0aC5jZWlsKGIuc2l6ZS9iLmJsa3NpemUpO3JldHVybiBifSxVYShhLGIpe2Zvcih2YXIgYyBvZltcIm1vZGVcIixcImF0aW1lXCIsXCJtdGltZVwiLFwiY3RpbWVcIl0pbnVsbCE9YltjXSYmKGFbY109YltjXSk7dm9pZCAwIT09Yi5zaXplJiYoYj1iLnNpemUsYS5SYSE9YiYmKDA9PWI/KGEuTmE9bnVsbCxhLlJhPTApOihjPWEuTmEsYS5OYT1uZXcgVWludDhBcnJheShiKSxjJiZhLk5hLnNldChjLnN1YmFycmF5KDAsTWF0aC5taW4oYixhLlJhKSkpLGEuUmE9YikpKX0sbG9va3VwKCl7Ty5uYnx8KE8ubmI9XG5uZXcgTig0NCksTy5uYi5zdGFjaz1cIjxnZW5lcmljIGVycm9yLCBubyBzdGFjaz5cIik7dGhyb3cgTy5uYjt9LGliKGEsYixjLGQpe3JldHVybiBPLmNyZWF0ZU5vZGUoYSxiLGMsZCl9LHJlbmFtZShhLGIsYyl7dHJ5e3ZhciBkPVEoYixjKX1jYXRjaChnKXt9aWYoZCl7aWYoUChhLm1vZGUpKWZvcih2YXIgZSBpbiBkLk5hKXRocm93IG5ldyBOKDU1KTtBYihkKX1kZWxldGUgYS5wYXJlbnQuTmFbYS5uYW1lXTtiLk5hW2NdPWE7YS5uYW1lPWM7Yi5jdGltZT1iLm10aW1lPWEucGFyZW50LmN0aW1lPWEucGFyZW50Lm10aW1lPURhdGUubm93KCl9LHVubGluayhhLGIpe2RlbGV0ZSBhLk5hW2JdO2EuY3RpbWU9YS5tdGltZT1EYXRlLm5vdygpfSxybWRpcihhLGIpe3ZhciBjPVEoYSxiKSxkO2ZvcihkIGluIGMuTmEpdGhyb3cgbmV3IE4oNTUpO2RlbGV0ZSBhLk5hW2JdO2EuY3RpbWU9YS5tdGltZT1EYXRlLm5vdygpfSxyZWFkZGlyKGEpe3JldHVybltcIi5cIixcIi4uXCIsLi4uT2JqZWN0LmtleXMoYS5OYSldfSxcbnN5bWxpbmsoYSxiLGMpe2E9Ty5jcmVhdGVOb2RlKGEsYiw0MTQ3MSwwKTthLmxpbms9YztyZXR1cm4gYX0scmVhZGxpbmsoYSl7aWYoNDA5NjAhPT0oYS5tb2RlJjYxNDQwKSl0aHJvdyBuZXcgTigyOCk7cmV0dXJuIGEubGlua319LE1hOntyZWFkKGEsYixjLGQsZSl7dmFyIGc9YS5ub2RlLk5hO2lmKGU+PWEubm9kZS5SYSlyZXR1cm4gMDthPU1hdGgubWluKGEubm9kZS5SYS1lLGQpO2lmKDg8YSYmZy5zdWJhcnJheSliLnNldChnLnN1YmFycmF5KGUsZSthKSxjKTtlbHNlIGZvcihkPTA7ZDxhO2QrKyliW2MrZF09Z1tlK2RdO3JldHVybiBhfSx3cml0ZShhLGIsYyxkLGUsZyl7Yi5idWZmZXI9PT1tLmJ1ZmZlciYmKGc9ITEpO2lmKCFkKXJldHVybiAwO2E9YS5ub2RlO2EubXRpbWU9YS5jdGltZT1EYXRlLm5vdygpO2lmKGIuc3ViYXJyYXkmJighYS5OYXx8YS5OYS5zdWJhcnJheSkpe2lmKGcpcmV0dXJuIGEuTmE9Yi5zdWJhcnJheShjLGMrZCksYS5SYT1kO2lmKDA9PT1hLlJhJiZcbjA9PT1lKXJldHVybiBhLk5hPWIuc2xpY2UoYyxjK2QpLGEuUmE9ZDtpZihlK2Q8PWEuUmEpcmV0dXJuIGEuTmEuc2V0KGIuc3ViYXJyYXkoYyxjK2QpLGUpLGR9Zz1lK2Q7dmFyIGg9YS5OYT9hLk5hLmxlbmd0aDowO2g+PWd8fChnPU1hdGgubWF4KGcsaCooMTA0ODU3Nj5oPzI6MS4xMjUpPj4+MCksMCE9aCYmKGc9TWF0aC5tYXgoZywyNTYpKSxoPWEuTmEsYS5OYT1uZXcgVWludDhBcnJheShnKSwwPGEuUmEmJmEuTmEuc2V0KGguc3ViYXJyYXkoMCxhLlJhKSwwKSk7aWYoYS5OYS5zdWJhcnJheSYmYi5zdWJhcnJheSlhLk5hLnNldChiLnN1YmFycmF5KGMsYytkKSxlKTtlbHNlIGZvcihnPTA7ZzxkO2crKylhLk5hW2UrZ109YltjK2ddO2EuUmE9TWF0aC5tYXgoYS5SYSxlK2QpO3JldHVybiBkfSxWYShhLGIsYyl7MT09PWM/Yis9YS5wb3NpdGlvbjoyPT09YyYmMzI3Njg9PT0oYS5ub2RlLm1vZGUmNjE0NDApJiYoYis9YS5ub2RlLlJhKTtpZigwPmIpdGhyb3cgbmV3IE4oMjgpO1xucmV0dXJuIGJ9LGpiKGEsYixjLGQsZSl7aWYoMzI3NjghPT0oYS5ub2RlLm1vZGUmNjE0NDApKXRocm93IG5ldyBOKDQzKTthPWEubm9kZS5OYTtpZihlJjJ8fCFhfHxhLmJ1ZmZlciE9PW0uYnVmZmVyKXtlPSEwO2Q9NjU1MzYqTWF0aC5jZWlsKGIvNjU1MzYpO3ZhciBnPUJiKDY1NTM2LGQpO2cmJkMuZmlsbCgwLGcsZytkKTtkPWc7aWYoIWQpdGhyb3cgbmV3IE4oNDgpO2lmKGEpe2lmKDA8Y3x8YytiPGEubGVuZ3RoKWEuc3ViYXJyYXk/YT1hLnN1YmFycmF5KGMsYytiKTphPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsYyxjK2IpO20uc2V0KGEsZCl9fWVsc2UgZT0hMSxkPWEuYnl0ZU9mZnNldDtyZXR1cm57WGI6ZCxFYjplfX0sa2IoYSxiLGMsZCl7Ty5NYS53cml0ZShhLGIsMCxkLGMsITEpO3JldHVybiAwfX19LGphPShhLGIpPT57dmFyIGM9MDthJiYoY3w9MzY1KTtiJiYoY3w9MTQ2KTtyZXR1cm4gY30sQ2I9bnVsbCxEYj17fSxFYj1bXSxGYj0xLFI9bnVsbCxHYj0hMSxcbkhiPSEwLEliPXt9LE49Y2xhc3N7bmFtZT1cIkVycm5vRXJyb3JcIjtjb25zdHJ1Y3RvcihhKXt0aGlzLlBhPWF9fSxKYj1jbGFzc3toYj17fTtub2RlPW51bGw7Z2V0IGZsYWdzKCl7cmV0dXJuIHRoaXMuaGIuZmxhZ3N9c2V0IGZsYWdzKGEpe3RoaXMuaGIuZmxhZ3M9YX1nZXQgcG9zaXRpb24oKXtyZXR1cm4gdGhpcy5oYi5wb3NpdGlvbn1zZXQgcG9zaXRpb24oYSl7dGhpcy5oYi5wb3NpdGlvbj1hfX0sS2I9Y2xhc3N7TGE9e307TWE9e307YmI9bnVsbDtjb25zdHJ1Y3RvcihhLGIsYyxkKXthfHw9dGhpczt0aGlzLnBhcmVudD1hO3RoaXMuWGE9YS5YYTt0aGlzLmlkPUZiKys7dGhpcy5uYW1lPWI7dGhpcy5tb2RlPWM7dGhpcy5yZGV2PWQ7dGhpcy5hdGltZT10aGlzLm10aW1lPXRoaXMuY3RpbWU9RGF0ZS5ub3coKX1nZXQgcmVhZCgpe3JldHVybiAzNjU9PT0odGhpcy5tb2RlJjM2NSl9c2V0IHJlYWQoYSl7YT90aGlzLm1vZGV8PTM2NTp0aGlzLm1vZGUmPS0zNjZ9Z2V0IHdyaXRlKCl7cmV0dXJuIDE0Nj09PVxuKHRoaXMubW9kZSYxNDYpfXNldCB3cml0ZShhKXthP3RoaXMubW9kZXw9MTQ2OnRoaXMubW9kZSY9LTE0N319O1xuZnVuY3Rpb24gUyhhLGI9e30pe2lmKCFhKXRocm93IG5ldyBOKDQ0KTtiLnBiPz8oYi5wYj0hMCk7XCIvXCI9PT1hLmNoYXJBdCgwKXx8KGE9XCIvL1wiK2EpO3ZhciBjPTA7YTpmb3IoOzQwPmM7YysrKXthPWEuc3BsaXQoXCIvXCIpLmZpbHRlcihxPT4hIXEpO2Zvcih2YXIgZD1DYixlPVwiL1wiLGc9MDtnPGEubGVuZ3RoO2crKyl7dmFyIGg9Zz09PWEubGVuZ3RoLTE7aWYoaCYmYi5wYXJlbnQpYnJlYWs7aWYoXCIuXCIhPT1hW2ddKWlmKFwiLi5cIj09PWFbZ10paWYoZT1iYihlKSxkPT09ZC5wYXJlbnQpe2E9ZStcIi9cIithLnNsaWNlKGcrMSkuam9pbihcIi9cIik7Yy0tO2NvbnRpbnVlIGF9ZWxzZSBkPWQucGFyZW50O2Vsc2V7ZT1pYShlK1wiL1wiK2FbZ10pO3RyeXtkPVEoZCxhW2ddKX1jYXRjaChxKXtpZig0ND09PXE/LlBhJiZoJiZiLldiKXJldHVybntwYXRoOmV9O3Rocm93IHE7fSFkLmJifHxoJiYhYi5wYnx8KGQ9ZC5iYi5yb290KTtpZig0MDk2MD09PShkLm1vZGUmNjE0NDApJiYoIWh8fGIuYWIpKXtpZighZC5MYS5yZWFkbGluayl0aHJvdyBuZXcgTig1Mik7XG5kPWQuTGEucmVhZGxpbmsoZCk7XCIvXCI9PT1kLmNoYXJBdCgwKXx8KGQ9YmIoZSkrXCIvXCIrZCk7YT1kK1wiL1wiK2Euc2xpY2UoZysxKS5qb2luKFwiL1wiKTtjb250aW51ZSBhfX19cmV0dXJue3BhdGg6ZSxub2RlOmR9fXRocm93IG5ldyBOKDMyKTt9ZnVuY3Rpb24gaGEoYSl7Zm9yKHZhciBiOzspe2lmKGE9PT1hLnBhcmVudClyZXR1cm4gYT1hLlhhLkRiLGI/XCIvXCIhPT1hW2EubGVuZ3RoLTFdP2Ake2F9LyR7Yn1gOmErYjphO2I9Yj9gJHthLm5hbWV9LyR7Yn1gOmEubmFtZTthPWEucGFyZW50fX1mdW5jdGlvbiBMYihhLGIpe2Zvcih2YXIgYz0wLGQ9MDtkPGIubGVuZ3RoO2QrKyljPShjPDw1KS1jK2IuY2hhckNvZGVBdChkKXwwO3JldHVybihhK2M+Pj4wKSVSLmxlbmd0aH1cbmZ1bmN0aW9uIEFiKGEpe3ZhciBiPUxiKGEucGFyZW50LmlkLGEubmFtZSk7aWYoUltiXT09PWEpUltiXT1hLmNiO2Vsc2UgZm9yKGI9UltiXTtiOyl7aWYoYi5jYj09PWEpe2IuY2I9YS5jYjticmVha31iPWIuY2J9fWZ1bmN0aW9uIFEoYSxiKXt2YXIgYz1QKGEubW9kZSk/KGM9TWIoYSxcInhcIikpP2M6YS5MYS5sb29rdXA/MDoyOjU0O2lmKGMpdGhyb3cgbmV3IE4oYyk7Zm9yKGM9UltMYihhLmlkLGIpXTtjO2M9Yy5jYil7dmFyIGQ9Yy5uYW1lO2lmKGMucGFyZW50LmlkPT09YS5pZCYmZD09PWIpcmV0dXJuIGN9cmV0dXJuIGEuTGEubG9va3VwKGEsYil9ZnVuY3Rpb24gemIoYSxiLGMsZCl7YT1uZXcgS2IoYSxiLGMsZCk7Yj1MYihhLnBhcmVudC5pZCxhLm5hbWUpO2EuY2I9UltiXTtyZXR1cm4gUltiXT1hfWZ1bmN0aW9uIFAoYSl7cmV0dXJuIDE2Mzg0PT09KGEmNjE0NDApfVxuZnVuY3Rpb24gTmIoYSl7dmFyIGI9W1wiclwiLFwid1wiLFwicndcIl1bYSYzXTthJjUxMiYmKGIrPVwid1wiKTtyZXR1cm4gYn1mdW5jdGlvbiBNYihhLGIpe2lmKEhiKXJldHVybiAwO2lmKCFiLmluY2x1ZGVzKFwiclwiKXx8YS5tb2RlJjI5Mil7aWYoYi5pbmNsdWRlcyhcIndcIikmJiEoYS5tb2RlJjE0Nil8fGIuaW5jbHVkZXMoXCJ4XCIpJiYhKGEubW9kZSY3MykpcmV0dXJuIDJ9ZWxzZSByZXR1cm4gMjtyZXR1cm4gMH1mdW5jdGlvbiBPYihhLGIpe2lmKCFQKGEubW9kZSkpcmV0dXJuIDU0O3RyeXtyZXR1cm4gUShhLGIpLDIwfWNhdGNoKGMpe31yZXR1cm4gTWIoYSxcInd4XCIpfVxuZnVuY3Rpb24gUGIoYSxiLGMpe3RyeXt2YXIgZD1RKGEsYil9Y2F0Y2goZSl7cmV0dXJuIGUuUGF9aWYoYT1NYihhLFwid3hcIikpcmV0dXJuIGE7aWYoYyl7aWYoIVAoZC5tb2RlKSlyZXR1cm4gNTQ7aWYoZD09PWQucGFyZW50fHxcIi9cIj09PWhhKGQpKXJldHVybiAxMH1lbHNlIGlmKFAoZC5tb2RlKSlyZXR1cm4gMzE7cmV0dXJuIDB9ZnVuY3Rpb24gUWIoYSl7aWYoIWEpdGhyb3cgbmV3IE4oNjMpO3JldHVybiBhfWZ1bmN0aW9uIFQoYSl7YT1FYlthXTtpZighYSl0aHJvdyBuZXcgTig4KTtyZXR1cm4gYX1mdW5jdGlvbiBSYihhLGI9LTEpe2E9T2JqZWN0LmFzc2lnbihuZXcgSmIsYSk7aWYoLTE9PWIpYTp7Zm9yKGI9MDs0MDk2Pj1iO2IrKylpZighRWJbYl0pYnJlYWsgYTt0aHJvdyBuZXcgTigzMyk7fWEuZmQ9YjtyZXR1cm4gRWJbYl09YX1mdW5jdGlvbiBTYihhLGI9LTEpe2E9UmIoYSxiKTthLk1hPy5lYz8uKGEpO3JldHVybiBhfVxuZnVuY3Rpb24gVGIoYSxiLGMpe3ZhciBkPWE/Lk1hLlVhO2E9ZD9hOmI7ZD8/PWIuTGEuVWE7UWIoZCk7ZChhLGMpfXZhciB5Yj17b3BlbihhKXthLk1hPURiW2Eubm9kZS5yZGV2XS5NYTthLk1hLm9wZW4/LihhKX0sVmEoKXt0aHJvdyBuZXcgTig3MCk7fX07ZnVuY3Rpb24gbWIoYSxiKXtEYlthXT17TWE6Yn19ZnVuY3Rpb24gVWIoYSxiKXt2YXIgYz1cIi9cIj09PWI7aWYoYyYmQ2IpdGhyb3cgbmV3IE4oMTApO2lmKCFjJiZiKXt2YXIgZD1TKGIse3BiOiExfSk7Yj1kLnBhdGg7ZD1kLm5vZGU7aWYoZC5iYil0aHJvdyBuZXcgTigxMCk7aWYoIVAoZC5tb2RlKSl0aHJvdyBuZXcgTig1NCk7fWI9e3R5cGU6YSxrYzp7fSxEYjpiLFZiOltdfTthPWEuWGEoYik7YS5YYT1iO2Iucm9vdD1hO2M/Q2I9YTpkJiYoZC5iYj1iLGQuWGEmJmQuWGEuVmIucHVzaChiKSl9XG5mdW5jdGlvbiBWYihhLGIsYyl7dmFyIGQ9UyhhLHtwYXJlbnQ6ITB9KS5ub2RlO2E9Y2IoYSk7aWYoIWEpdGhyb3cgbmV3IE4oMjgpO2lmKFwiLlwiPT09YXx8XCIuLlwiPT09YSl0aHJvdyBuZXcgTigyMCk7dmFyIGU9T2IoZCxhKTtpZihlKXRocm93IG5ldyBOKGUpO2lmKCFkLkxhLmliKXRocm93IG5ldyBOKDYzKTtyZXR1cm4gZC5MYS5pYihkLGEsYixjKX1mdW5jdGlvbiBrYShhLGI9NDM4KXtyZXR1cm4gVmIoYSxiJjQwOTV8MzI3NjgsMCl9ZnVuY3Rpb24gVShhLGI9NTExKXtyZXR1cm4gVmIoYSxiJjEwMjN8MTYzODQsMCl9ZnVuY3Rpb24gV2IoYSxiLGMpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBjJiYoYz1iLGI9NDM4KTtWYihhLGJ8ODE5MixjKX1cbmZ1bmN0aW9uIFhiKGEsYil7aWYoIWZiKGEpKXRocm93IG5ldyBOKDQ0KTt2YXIgYz1TKGIse3BhcmVudDohMH0pLm5vZGU7aWYoIWMpdGhyb3cgbmV3IE4oNDQpO2I9Y2IoYik7dmFyIGQ9T2IoYyxiKTtpZihkKXRocm93IG5ldyBOKGQpO2lmKCFjLkxhLnN5bWxpbmspdGhyb3cgbmV3IE4oNjMpO2MuTGEuc3ltbGluayhjLGIsYSl9ZnVuY3Rpb24gWWIoYSl7dmFyIGI9UyhhLHtwYXJlbnQ6ITB9KS5ub2RlO2E9Y2IoYSk7dmFyIGM9UShiLGEpLGQ9UGIoYixhLCEwKTtpZihkKXRocm93IG5ldyBOKGQpO2lmKCFiLkxhLnJtZGlyKXRocm93IG5ldyBOKDYzKTtpZihjLmJiKXRocm93IG5ldyBOKDEwKTtiLkxhLnJtZGlyKGIsYSk7QWIoYyl9XG5mdW5jdGlvbiB1YShhKXt2YXIgYj1TKGEse3BhcmVudDohMH0pLm5vZGU7aWYoIWIpdGhyb3cgbmV3IE4oNDQpO2E9Y2IoYSk7dmFyIGM9UShiLGEpLGQ9UGIoYixhLCExKTtpZihkKXRocm93IG5ldyBOKGQpO2lmKCFiLkxhLnVubGluayl0aHJvdyBuZXcgTig2Myk7aWYoYy5iYil0aHJvdyBuZXcgTigxMCk7Yi5MYS51bmxpbmsoYixhKTtBYihjKX1mdW5jdGlvbiBaYihhLGIpe2E9UyhhLHthYjohYn0pLm5vZGU7cmV0dXJuIFFiKGEuTGEuVGEpKGEpfWZ1bmN0aW9uICRiKGEsYixjLGQpe1RiKGEsYix7bW9kZTpjJjQwOTV8Yi5tb2RlJi00MDk2LGN0aW1lOkRhdGUubm93KCksTGI6ZH0pfWZ1bmN0aW9uIG1hKGEsYil7YT1cInN0cmluZ1wiPT10eXBlb2YgYT9TKGEse2FiOiEwfSkubm9kZTphOyRiKG51bGwsYSxiKX1cbmZ1bmN0aW9uIGFjKGEsYixjKXtpZihQKGIubW9kZSkpdGhyb3cgbmV3IE4oMzEpO2lmKDMyNzY4IT09KGIubW9kZSY2MTQ0MCkpdGhyb3cgbmV3IE4oMjgpO3ZhciBkPU1iKGIsXCJ3XCIpO2lmKGQpdGhyb3cgbmV3IE4oZCk7VGIoYSxiLHtzaXplOmMsdGltZXN0YW1wOkRhdGUubm93KCl9KX1cbmZ1bmN0aW9uIG5hKGEsYixjPTQzOCl7aWYoXCJcIj09PWEpdGhyb3cgbmV3IE4oNDQpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBiKXt2YXIgZD17cjowLFwicitcIjoyLHc6NTc3LFwidytcIjo1NzgsYToxMDg5LFwiYStcIjoxMDkwfVtiXTtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgZCl0aHJvdyBFcnJvcihgVW5rbm93biBmaWxlIG9wZW4gbW9kZTogJHtifWApO2I9ZH1jPWImNjQ/YyY0MDk1fDMyNzY4OjA7aWYoXCJvYmplY3RcIj09dHlwZW9mIGEpZD1hO2Vsc2V7dmFyIGU9YS5lbmRzV2l0aChcIi9cIik7YT1TKGEse2FiOiEoYiYxMzEwNzIpLFdiOiEwfSk7ZD1hLm5vZGU7YT1hLnBhdGh9dmFyIGc9ITE7aWYoYiY2NClpZihkKXtpZihiJjEyOCl0aHJvdyBuZXcgTigyMCk7fWVsc2V7aWYoZSl0aHJvdyBuZXcgTigzMSk7ZD1WYihhLGN8NTExLDApO2c9ITB9aWYoIWQpdGhyb3cgbmV3IE4oNDQpOzgxOTI9PT0oZC5tb2RlJjYxNDQwKSYmKGImPS01MTMpO2lmKGImNjU1MzYmJiFQKGQubW9kZSkpdGhyb3cgbmV3IE4oNTQpO1xuaWYoIWcmJihlPWQ/NDA5NjA9PT0oZC5tb2RlJjYxNDQwKT8zMjpQKGQubW9kZSkmJihcInJcIiE9PU5iKGIpfHxiJjU3Nik/MzE6TWIoZCxOYihiKSk6NDQpKXRocm93IG5ldyBOKGUpO2ImNTEyJiYhZyYmKGU9ZCxlPVwic3RyaW5nXCI9PXR5cGVvZiBlP1MoZSx7YWI6ITB9KS5ub2RlOmUsYWMobnVsbCxlLDApKTtiJj0tMTMxNzEzO2U9UmIoe25vZGU6ZCxwYXRoOmhhKGQpLGZsYWdzOmIsc2Vla2FibGU6ITAscG9zaXRpb246MCxNYTpkLk1hLFliOltdLGVycm9yOiExfSk7ZS5NYS5vcGVuJiZlLk1hLm9wZW4oZSk7ZyYmbWEoZCxjJjUxMSk7IWsubG9nUmVhZEZpbGVzfHxiJjF8fGEgaW4gSWJ8fChJYlthXT0xKTtyZXR1cm4gZX1mdW5jdGlvbiBwYShhKXtpZihudWxsPT09YS5mZCl0aHJvdyBuZXcgTig4KTthLnJiJiYoYS5yYj1udWxsKTt0cnl7YS5NYS5jbG9zZSYmYS5NYS5jbG9zZShhKX1jYXRjaChiKXt0aHJvdyBiO31maW5hbGx5e0ViW2EuZmRdPW51bGx9YS5mZD1udWxsfVxuZnVuY3Rpb24gYmMoYSxiLGMpe2lmKG51bGw9PT1hLmZkKXRocm93IG5ldyBOKDgpO2lmKCFhLnNlZWthYmxlfHwhYS5NYS5WYSl0aHJvdyBuZXcgTig3MCk7aWYoMCE9YyYmMSE9YyYmMiE9Yyl0aHJvdyBuZXcgTigyOCk7YS5wb3NpdGlvbj1hLk1hLlZhKGEsYixjKTthLlliPVtdfWZ1bmN0aW9uIGNjKGEsYixjLGQsZSl7aWYoMD5kfHwwPmUpdGhyb3cgbmV3IE4oMjgpO2lmKG51bGw9PT1hLmZkKXRocm93IG5ldyBOKDgpO2lmKDE9PT0oYS5mbGFncyYyMDk3MTU1KSl0aHJvdyBuZXcgTig4KTtpZihQKGEubm9kZS5tb2RlKSl0aHJvdyBuZXcgTigzMSk7aWYoIWEuTWEucmVhZCl0aHJvdyBuZXcgTigyOCk7dmFyIGc9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGU7aWYoIWcpZT1hLnBvc2l0aW9uO2Vsc2UgaWYoIWEuc2Vla2FibGUpdGhyb3cgbmV3IE4oNzApO2I9YS5NYS5yZWFkKGEsYixjLGQsZSk7Z3x8KGEucG9zaXRpb24rPWIpO3JldHVybiBifVxuZnVuY3Rpb24gb2EoYSxiLGMsZCxlKXtpZigwPmR8fDA+ZSl0aHJvdyBuZXcgTigyOCk7aWYobnVsbD09PWEuZmQpdGhyb3cgbmV3IE4oOCk7aWYoMD09PShhLmZsYWdzJjIwOTcxNTUpKXRocm93IG5ldyBOKDgpO2lmKFAoYS5ub2RlLm1vZGUpKXRocm93IG5ldyBOKDMxKTtpZighYS5NYS53cml0ZSl0aHJvdyBuZXcgTigyOCk7YS5zZWVrYWJsZSYmYS5mbGFncyYxMDI0JiZiYyhhLDAsMik7dmFyIGc9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGU7aWYoIWcpZT1hLnBvc2l0aW9uO2Vsc2UgaWYoIWEuc2Vla2FibGUpdGhyb3cgbmV3IE4oNzApO2I9YS5NYS53cml0ZShhLGIsYyxkLGUsdm9pZCAwKTtnfHwoYS5wb3NpdGlvbis9Yik7cmV0dXJuIGJ9XG5mdW5jdGlvbiB0YShhKXt2YXIgYj1ifHwwO3ZhciBjPVwiYmluYXJ5XCI7XCJ1dGY4XCIhPT1jJiZcImJpbmFyeVwiIT09YyYmTmEoYEludmFsaWQgZW5jb2RpbmcgdHlwZSBcIiR7Y31cImApO2I9bmEoYSxiKTthPVpiKGEpLnNpemU7dmFyIGQ9bmV3IFVpbnQ4QXJyYXkoYSk7Y2MoYixkLDAsYSwwKTtcInV0ZjhcIj09PWMmJihkPWdiKGQpKTtwYShiKTtyZXR1cm4gZH1cbmZ1bmN0aW9uIFcoYSxiLGMpe2E9aWEoXCIvZGV2L1wiK2EpO3ZhciBkPWphKCEhYiwhIWMpO1cuQ2I/PyhXLkNiPTY0KTt2YXIgZT1XLkNiKys8PDh8MDttYihlLHtvcGVuKGcpe2cuc2Vla2FibGU9ITF9LGNsb3NlKCl7Yz8uYnVmZmVyPy5sZW5ndGgmJmMoMTApfSxyZWFkKGcsaCxxLHYpe2Zvcih2YXIgdT0wLHg9MDt4PHY7eCsrKXt0cnl7dmFyIEQ9YigpfWNhdGNoKHBiKXt0aHJvdyBuZXcgTigyOSk7fWlmKHZvaWQgMD09PUQmJjA9PT11KXRocm93IG5ldyBOKDYpO2lmKG51bGw9PT1EfHx2b2lkIDA9PT1EKWJyZWFrO3UrKztoW3EreF09RH11JiYoZy5ub2RlLmF0aW1lPURhdGUubm93KCkpO3JldHVybiB1fSx3cml0ZShnLGgscSx2KXtmb3IodmFyIHU9MDt1PHY7dSsrKXRyeXtjKGhbcSt1XSl9Y2F0Y2goeCl7dGhyb3cgbmV3IE4oMjkpO312JiYoZy5ub2RlLm10aW1lPWcubm9kZS5jdGltZT1EYXRlLm5vdygpKTtyZXR1cm4gdX19KTtXYihhLGQsZSl9dmFyIFg9e307XG5mdW5jdGlvbiBZKGEsYixjKXtpZihcIi9cIj09PWIuY2hhckF0KDApKXJldHVybiBiO2E9LTEwMD09PWE/XCIvXCI6VChhKS5wYXRoO2lmKDA9PWIubGVuZ3RoKXtpZighYyl0aHJvdyBuZXcgTig0NCk7cmV0dXJuIGF9cmV0dXJuIGErXCIvXCIrYn1cbmZ1bmN0aW9uIG1jKGEsYil7RlthPj4yXT1iLmRldjtGW2ErND4+Ml09Yi5tb2RlO0ZbYSs4Pj4yXT1iLm5saW5rO0ZbYSsxMj4+Ml09Yi51aWQ7RlthKzE2Pj4yXT1iLmdpZDtGW2ErMjA+PjJdPWIucmRldjtIW2ErMjQ+PjNdPUJpZ0ludChiLnNpemUpO0VbYSszMj4+Ml09NDA5NjtFW2ErMzY+PjJdPWIuYmxvY2tzO3ZhciBjPWIuYXRpbWUuZ2V0VGltZSgpLGQ9Yi5tdGltZS5nZXRUaW1lKCksZT1iLmN0aW1lLmdldFRpbWUoKTtIW2ErNDA+PjNdPUJpZ0ludChNYXRoLmZsb29yKGMvMUUzKSk7RlthKzQ4Pj4yXT1jJTFFMyoxRTY7SFthKzU2Pj4zXT1CaWdJbnQoTWF0aC5mbG9vcihkLzFFMykpO0ZbYSs2ND4+Ml09ZCUxRTMqMUU2O0hbYSs3Mj4+M109QmlnSW50KE1hdGguZmxvb3IoZS8xRTMpKTtGW2ErODA+PjJdPWUlMUUzKjFFNjtIW2ErODg+PjNdPUJpZ0ludChiLmlubyk7cmV0dXJuIDB9XG52YXIgRWM9dm9pZCAwLEdjPSgpPT57dmFyIGE9RVsrRWM+PjJdO0VjKz00O3JldHVybiBhfSxIYz0wLEljPVswLDMxLDYwLDkxLDEyMSwxNTIsMTgyLDIxMywyNDQsMjc0LDMwNSwzMzVdLEpjPVswLDMxLDU5LDkwLDEyMCwxNTEsMTgxLDIxMiwyNDMsMjczLDMwNCwzMzRdLEtjPXt9LExjPWE9PntIYT1hO1lhfHwwPEhjfHwoay5vbkV4aXQ/LihhKSxHYT0hMCk7eWEoYSxuZXcgU2EoYSkpfSxNYz1hPT57aWYoIUdhKXRyeXthKCl9Y2F0Y2goYil7YiBpbnN0YW5jZW9mIFNhfHxcInVud2luZFwiPT1ifHx5YSgxLGIpfWZpbmFsbHl7aWYoIShZYXx8MDxIYykpdHJ5e0hhPWE9SGEsTGMoYSl9Y2F0Y2goYil7YiBpbnN0YW5jZW9mIFNhfHxcInVud2luZFwiPT1ifHx5YSgxLGIpfX19LE5jPXt9LFBjPSgpPT57aWYoIU9jKXt2YXIgYT17VVNFUjpcIndlYl91c2VyXCIsTE9HTkFNRTpcIndlYl91c2VyXCIsUEFUSDpcIi9cIixQV0Q6XCIvXCIsSE9NRTpcIi9ob21lL3dlYl91c2VyXCIsTEFORzooZ2xvYmFsVGhpcy5uYXZpZ2F0b3I/Lmxhbmd1YWdlPz9cblwiQ1wiKS5yZXBsYWNlKFwiLVwiLFwiX1wiKStcIi5VVEYtOFwiLF86eGF8fFwiLi90aGlzLnByb2dyYW1cIn0sYjtmb3IoYiBpbiBOYyl2b2lkIDA9PT1OY1tiXT9kZWxldGUgYVtiXTphW2JdPU5jW2JdO3ZhciBjPVtdO2ZvcihiIGluIGEpYy5wdXNoKGAke2J9PSR7YVtiXX1gKTtPYz1jfXJldHVybiBPY30sT2MsUWM9KGEsYixjLGQpPT57dmFyIGU9e3N0cmluZzp1PT57dmFyIHg9MDtpZihudWxsIT09dSYmdm9pZCAwIT09dSYmMCE9PXUpe3g9aWIodSkrMTt2YXIgRD15KHgpO00odSxDLEQseCk7eD1EfXJldHVybiB4fSxhcnJheTp1PT57dmFyIHg9eSh1Lmxlbmd0aCk7bS5zZXQodSx4KTtyZXR1cm4geH19O2E9a1tcIl9cIithXTt2YXIgZz1bXSxoPTA7aWYoZClmb3IodmFyIHE9MDtxPGQubGVuZ3RoO3ErKyl7dmFyIHY9ZVtjW3FdXTt2PygwPT09aCYmKGg9cWEoKSksZ1txXT12KGRbcV0pKTpnW3FdPWRbcV19Yz1hKC4uLmcpO3JldHVybiBjPWZ1bmN0aW9uKHUpezAhPT1oJiZzYShoKTtyZXR1cm5cInN0cmluZ1wiPT09XG5iP3oodSk6XCJib29sZWFuXCI9PT1iPyEhdTp1fShjKX0sZmE9YT0+e3ZhciBiPWliKGEpKzEsYz1kYShiKTtjJiZNKGEsQyxjLGIpO3JldHVybiBjfSxSYyxTYz1bXSxBPWE9PntSYy5kZWxldGUoWi5nZXQoYSkpO1ouc2V0KGEsbnVsbCk7U2MucHVzaChhKX0sVGM9YT0+e2NvbnN0IGI9YS5sZW5ndGg7cmV0dXJuW2IlMTI4fDEyOCxiPj43LC4uLmFdfSxVYz17aToxMjcscDoxMjcsajoxMjYsZjoxMjUsZDoxMjQsZToxMTF9LFZjPWE9PlRjKEFycmF5LmZyb20oYSxiPT5VY1tiXSkpLHdhPShhLGIpPT57aWYoIVJjKXtSYz1uZXcgV2Vha01hcDt2YXIgYz1aLmxlbmd0aDtpZihSYylmb3IodmFyIGQ9MDtkPDArYztkKyspe3ZhciBlPVouZ2V0KGQpO2UmJlJjLnNldChlLGQpfX1pZihjPVJjLmdldChhKXx8MClyZXR1cm4gYztjPVNjLmxlbmd0aD9TYy5wb3AoKTpaLmdyb3coMSk7dHJ5e1ouc2V0KGMsYSl9Y2F0Y2goZyl7aWYoIShnIGluc3RhbmNlb2YgVHlwZUVycm9yKSl0aHJvdyBnO1xuYj1VaW50OEFycmF5Lm9mKDAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsLi4uVGMoWzEsOTYsLi4uVmMoYi5zbGljZSgxKSksLi4uVmMoXCJ2XCI9PT1iWzBdP1wiXCI6YlswXSldKSwyLDcsMSwxLDEwMSwxLDEwMiwwLDAsNyw1LDEsMSwxMDIsMCwwKTtiPW5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYik7Yj0obmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKGIse2U6e2Y6YX19KSkuZXhwb3J0cy5mO1ouc2V0KGMsYil9UmMuc2V0KGEsYyk7cmV0dXJuIGN9O1I9QXJyYXkoNDA5Nik7VWIoTyxcIi9cIik7VShcIi90bXBcIik7VShcIi9ob21lXCIpO1UoXCIvaG9tZS93ZWJfdXNlclwiKTtcbihmdW5jdGlvbigpe1UoXCIvZGV2XCIpO21iKDI1OSx7cmVhZDooKT0+MCx3cml0ZTooZCxlLGcsaCk9PmgsVmE6KCk9PjB9KTtXYihcIi9kZXYvbnVsbFwiLDI1OSk7a2IoMTI4MCx3Yik7a2IoMTUzNix4Yik7V2IoXCIvZGV2L3R0eVwiLDEyODApO1diKFwiL2Rldi90dHkxXCIsMTUzNik7dmFyIGE9bmV3IFVpbnQ4QXJyYXkoMTAyNCksYj0wLGM9KCk9PnswPT09YiYmKGViKGEpLGI9YS5ieXRlTGVuZ3RoKTtyZXR1cm4gYVstLWJdfTtXKFwicmFuZG9tXCIsYyk7VyhcInVyYW5kb21cIixjKTtVKFwiL2Rldi9zaG1cIik7VShcIi9kZXYvc2htL3RtcFwiKX0pKCk7XG4oZnVuY3Rpb24oKXtVKFwiL3Byb2NcIik7dmFyIGE9VShcIi9wcm9jL3NlbGZcIik7VShcIi9wcm9jL3NlbGYvZmRcIik7VWIoe1hhKCl7dmFyIGI9emIoYSxcImZkXCIsMTY4OTUsNzMpO2IuTWE9e1ZhOk8uTWEuVmF9O2IuTGE9e2xvb2t1cChjLGQpe2M9K2Q7dmFyIGU9VChjKTtjPXtwYXJlbnQ6bnVsbCxYYTp7RGI6XCJmYWtlXCJ9LExhOntyZWFkbGluazooKT0+ZS5wYXRofSxpZDpjKzF9O3JldHVybiBjLnBhcmVudD1jfSxyZWFkZGlyKCl7cmV0dXJuIEFycmF5LmZyb20oRWIuZW50cmllcygpKS5maWx0ZXIoKFssY10pPT5jKS5tYXAoKFtjXSk9PmMudG9TdHJpbmcoKSl9fTtyZXR1cm4gYn19LFwiL3Byb2Mvc2VsZi9mZFwiKX0pKCk7ay5ub0V4aXRSdW50aW1lJiYoWWE9ay5ub0V4aXRSdW50aW1lKTtrLnByaW50JiYoRWE9ay5wcmludCk7ay5wcmludEVyciYmKEI9ay5wcmludEVycik7ay53YXNtQmluYXJ5JiYoRmE9ay53YXNtQmluYXJ5KTtrLnRoaXNQcm9ncmFtJiYoeGE9ay50aGlzUHJvZ3JhbSk7XG5pZihrLnByZUluaXQpZm9yKFwiZnVuY3Rpb25cIj09dHlwZW9mIGsucHJlSW5pdCYmKGsucHJlSW5pdD1bay5wcmVJbml0XSk7MDxrLnByZUluaXQubGVuZ3RoOylrLnByZUluaXQuc2hpZnQoKSgpO2suc3RhY2tTYXZlPSgpPT5xYSgpO2suc3RhY2tSZXN0b3JlPWE9PnNhKGEpO2suc3RhY2tBbGxvYz1hPT55KGEpO2suY3dyYXA9KGEsYixjLGQpPT57dmFyIGU9IWN8fGMuZXZlcnkoZz0+XCJudW1iZXJcIj09PWd8fFwiYm9vbGVhblwiPT09Zyk7cmV0dXJuXCJzdHJpbmdcIiE9PWImJmUmJiFkP2tbXCJfXCIrYV06KC4uLmcpPT5RYyhhLGIsYyxnKX07ay5hZGRGdW5jdGlvbj13YTtrLnJlbW92ZUZ1bmN0aW9uPUE7ay5VVEY4VG9TdHJpbmc9ejtrLnN0cmluZ1RvTmV3VVRGOD1mYTtrLndyaXRlQXJyYXlUb01lbW9yeT0oYSxiKT0+e20uc2V0KGEsYil9O1xudmFyIGRhLGVhLEJiLFdjLHNhLHkscWEsTWEsWixYYz17YTooYSxiLGMsZCk9Pk5hKGBBc3NlcnRpb24gZmFpbGVkOiAke3ooYSl9LCBhdDogYCtbYj96KGIpOlwidW5rbm93biBmaWxlbmFtZVwiLGMsZD96KGQpOlwidW5rbm93biBmdW5jdGlvblwiXSksaTpmdW5jdGlvbihhLGIpe3RyeXtyZXR1cm4gYT16KGEpLG1hKGEsYiksMH1jYXRjaChjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1jLm5hbWUpdGhyb3cgYztyZXR1cm4tYy5QYX19LEw6ZnVuY3Rpb24oYSxiLGMpe3RyeXtiPXooYik7Yj1ZKGEsYik7aWYoYyYtOClyZXR1cm4tMjg7dmFyIGQ9UyhiLHthYjohMH0pLm5vZGU7aWYoIWQpcmV0dXJuLTQ0O2E9XCJcIjtjJjQmJihhKz1cInJcIik7YyYyJiYoYSs9XCJ3XCIpO2MmMSYmKGErPVwieFwiKTtyZXR1cm4gYSYmTWIoZCxhKT8tMjowfWNhdGNoKGUpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWUubmFtZSl0aHJvdyBlO3JldHVybi1lLlBhfX0sXG5qOmZ1bmN0aW9uKGEsYil7dHJ5e3ZhciBjPVQoYSk7JGIoYyxjLm5vZGUsYiwhMSk7cmV0dXJuIDB9Y2F0Y2goZCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09ZC5uYW1lKXRocm93IGQ7cmV0dXJuLWQuUGF9fSxoOmZ1bmN0aW9uKGEpe3RyeXt2YXIgYj1UKGEpO1RiKGIsYi5ub2RlLHt0aW1lc3RhbXA6RGF0ZS5ub3coKSxMYjohMX0pO3JldHVybiAwfWNhdGNoKGMpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWMubmFtZSl0aHJvdyBjO3JldHVybi1jLlBhfX0sYjpmdW5jdGlvbihhLGIsYyl7RWM9Yzt0cnl7dmFyIGQ9VChhKTtzd2l0Y2goYil7Y2FzZSAwOnZhciBlPUdjKCk7aWYoMD5lKWJyZWFrO2Zvcig7RWJbZV07KWUrKztyZXR1cm4gU2IoZCxlKS5mZDtjYXNlIDE6Y2FzZSAyOnJldHVybiAwO2Nhc2UgMzpyZXR1cm4gZC5mbGFncztjYXNlIDQ6cmV0dXJuIGU9R2MoKSxkLmZsYWdzfD1lLDA7Y2FzZSAxMjpyZXR1cm4gZT1cbkdjKCksSWFbZSswPj4xXT0yLDA7Y2FzZSAxMzpjYXNlIDE0OnJldHVybiAwfXJldHVybi0yOH1jYXRjaChnKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1nLm5hbWUpdGhyb3cgZztyZXR1cm4tZy5QYX19LGc6ZnVuY3Rpb24oYSxiKXt0cnl7dmFyIGM9VChhKSxkPWMubm9kZSxlPWMuTWEuVGE7YT1lP2M6ZDtlPz89ZC5MYS5UYTtRYihlKTt2YXIgZz1lKGEpO3JldHVybiBtYyhiLGcpfWNhdGNoKGgpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWgubmFtZSl0aHJvdyBoO3JldHVybi1oLlBhfX0sSDpmdW5jdGlvbihhLGIpe2I9LTkwMDcxOTkyNTQ3NDA5OTI+Ynx8OTAwNzE5OTI1NDc0MDk5MjxiP05hTjpOdW1iZXIoYik7dHJ5e2lmKGlzTmFOKGIpKXJldHVybi02MTt2YXIgYz1UKGEpO2lmKDA+Ynx8MD09PShjLmZsYWdzJjIwOTcxNTUpKXRocm93IG5ldyBOKDI4KTthYyhjLGMubm9kZSxiKTtyZXR1cm4gMH1jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT1cbnR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWQubmFtZSl0aHJvdyBkO3JldHVybi1kLlBhfX0sRzpmdW5jdGlvbihhLGIpe3RyeXtpZigwPT09YilyZXR1cm4tMjg7dmFyIGM9aWIoXCIvXCIpKzE7aWYoYjxjKXJldHVybi02ODtNKFwiL1wiLEMsYSxiKTtyZXR1cm4gY31jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1kLm5hbWUpdGhyb3cgZDtyZXR1cm4tZC5QYX19LEs6ZnVuY3Rpb24oYSxiKXt0cnl7cmV0dXJuIGE9eihhKSxtYyhiLFpiKGEsITApKX1jYXRjaChjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1jLm5hbWUpdGhyb3cgYztyZXR1cm4tYy5QYX19LEM6ZnVuY3Rpb24oYSxiLGMpe3RyeXtyZXR1cm4gYj16KGIpLGI9WShhLGIpLFUoYixjKSwwfWNhdGNoKGQpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWQubmFtZSl0aHJvdyBkO3JldHVybi1kLlBhfX0sSjpmdW5jdGlvbihhLFxuYixjLGQpe3RyeXtiPXooYik7dmFyIGU9ZCYyNTY7Yj1ZKGEsYixkJjQwOTYpO3JldHVybiBtYyhjLGU/WmIoYiwhMCk6WmIoYikpfWNhdGNoKGcpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWcubmFtZSl0aHJvdyBnO3JldHVybi1nLlBhfX0seDpmdW5jdGlvbihhLGIsYyxkKXtFYz1kO3RyeXtiPXooYik7Yj1ZKGEsYik7dmFyIGU9ZD9HYygpOjA7cmV0dXJuIG5hKGIsYyxlKS5mZH1jYXRjaChnKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1nLm5hbWUpdGhyb3cgZztyZXR1cm4tZy5QYX19LHY6ZnVuY3Rpb24oYSxiLGMsZCl7dHJ5e2I9eihiKTtiPVkoYSxiKTtpZigwPj1kKXJldHVybi0yODt2YXIgZT1TKGIpLm5vZGU7aWYoIWUpdGhyb3cgbmV3IE4oNDQpO2lmKCFlLkxhLnJlYWRsaW5rKXRocm93IG5ldyBOKDI4KTt2YXIgZz1lLkxhLnJlYWRsaW5rKGUpO3ZhciBoPU1hdGgubWluKGQsaWIoZykpLHE9bVtjK2hdO00oZyxcbkMsYyxkKzEpO21bYytoXT1xO3JldHVybiBofWNhdGNoKHYpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PXYubmFtZSl0aHJvdyB2O3JldHVybi12LlBhfX0sdTpmdW5jdGlvbihhKXt0cnl7cmV0dXJuIGE9eihhKSxZYihhKSwwfWNhdGNoKGIpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWIubmFtZSl0aHJvdyBiO3JldHVybi1iLlBhfX0sZjpmdW5jdGlvbihhLGIpe3RyeXtyZXR1cm4gYT16KGEpLG1jKGIsWmIoYSkpfWNhdGNoKGMpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWMubmFtZSl0aHJvdyBjO3JldHVybi1jLlBhfX0scjpmdW5jdGlvbihhLGIsYyl7dHJ5e2I9eihiKTtiPVkoYSxiKTtpZihjKWlmKDUxMj09PWMpWWIoYik7ZWxzZSByZXR1cm4tMjg7ZWxzZSB1YShiKTtyZXR1cm4gMH1jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1kLm5hbWUpdGhyb3cgZDtcbnJldHVybi1kLlBhfX0scTpmdW5jdGlvbihhLGIsYyl7dHJ5e2I9eihiKTtiPVkoYSxiLCEwKTt2YXIgZD1EYXRlLm5vdygpLGUsZztpZihjKXt2YXIgaD1GW2M+PjJdKzQyOTQ5NjcyOTYqRVtjKzQ+PjJdLHE9RVtjKzg+PjJdOzEwNzM3NDE4MjM9PXE/ZT1kOjEwNzM3NDE4MjI9PXE/ZT1udWxsOmU9MUUzKmgrcS8xRTY7Yys9MTY7aD1GW2M+PjJdKzQyOTQ5NjcyOTYqRVtjKzQ+PjJdO3E9RVtjKzg+PjJdOzEwNzM3NDE4MjM9PXE/Zz1kOjEwNzM3NDE4MjI9PXE/Zz1udWxsOmc9MUUzKmgrcS8xRTZ9ZWxzZSBnPWU9ZDtpZihudWxsIT09KGc/P2UpKXthPWU7dmFyIHY9UyhiLHthYjohMH0pLm5vZGU7UWIodi5MYS5VYSkodix7YXRpbWU6YSxtdGltZTpnfSl9cmV0dXJuIDB9Y2F0Y2godSl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09dS5uYW1lKXRocm93IHU7cmV0dXJuLXUuUGF9fSxtOigpPT5OYShcIlwiKSxsOigpPT57WWE9ITE7SGM9MH0sQTpmdW5jdGlvbihhLFxuYil7YT0tOTAwNzE5OTI1NDc0MDk5Mj5hfHw5MDA3MTk5MjU0NzQwOTkyPGE/TmFOOk51bWJlcihhKTthPW5ldyBEYXRlKDFFMyphKTtFW2I+PjJdPWEuZ2V0U2Vjb25kcygpO0VbYis0Pj4yXT1hLmdldE1pbnV0ZXMoKTtFW2IrOD4+Ml09YS5nZXRIb3VycygpO0VbYisxMj4+Ml09YS5nZXREYXRlKCk7RVtiKzE2Pj4yXT1hLmdldE1vbnRoKCk7RVtiKzIwPj4yXT1hLmdldEZ1bGxZZWFyKCktMTkwMDtFW2IrMjQ+PjJdPWEuZ2V0RGF5KCk7dmFyIGM9YS5nZXRGdWxsWWVhcigpO0VbYisyOD4+Ml09KDAhPT1jJTR8fDA9PT1jJTEwMCYmMCE9PWMlNDAwP0pjOkljKVthLmdldE1vbnRoKCldK2EuZ2V0RGF0ZSgpLTF8MDtFW2IrMzY+PjJdPS0oNjAqYS5nZXRUaW1lem9uZU9mZnNldCgpKTtjPShuZXcgRGF0ZShhLmdldEZ1bGxZZWFyKCksNiwxKSkuZ2V0VGltZXpvbmVPZmZzZXQoKTt2YXIgZD0obmV3IERhdGUoYS5nZXRGdWxsWWVhcigpLDAsMSkpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5FW2IrMzI+PjJdPShjIT1kJiZhLmdldFRpbWV6b25lT2Zmc2V0KCk9PU1hdGgubWluKGQsYykpfDB9LHk6ZnVuY3Rpb24oYSxiLGMsZCxlLGcsaCl7ZT0tOTAwNzE5OTI1NDc0MDk5Mj5lfHw5MDA3MTk5MjU0NzQwOTkyPGU/TmFOOk51bWJlcihlKTt0cnl7dmFyIHE9VChkKTtpZigwIT09KGImMikmJjA9PT0oYyYyKSYmMiE9PShxLmZsYWdzJjIwOTcxNTUpKXRocm93IG5ldyBOKDIpO2lmKDE9PT0ocS5mbGFncyYyMDk3MTU1KSl0aHJvdyBuZXcgTigyKTtpZighcS5NYS5qYil0aHJvdyBuZXcgTig0Myk7aWYoIWEpdGhyb3cgbmV3IE4oMjgpO3ZhciB2PXEuTWEuamIocSxhLGUsYixjKTt2YXIgdT12LlhiO0VbZz4+Ml09di5FYjtGW2g+PjJdPXU7cmV0dXJuIDB9Y2F0Y2goeCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09eC5uYW1lKXRocm93IHg7cmV0dXJuLXguUGF9fSx6OmZ1bmN0aW9uKGEsYixjLGQsZSxnKXtnPS05MDA3MTk5MjU0NzQwOTkyPmd8fFxuOTAwNzE5OTI1NDc0MDk5MjxnP05hTjpOdW1iZXIoZyk7dHJ5e3ZhciBoPVQoZSk7aWYoYyYyKXtjPWc7aWYoMzI3NjghPT0oaC5ub2RlLm1vZGUmNjE0NDApKXRocm93IG5ldyBOKDQzKTtpZighKGQmMikpe3ZhciBxPUMuc2xpY2UoYSxhK2IpO2guTWEua2ImJmguTWEua2IoaCxxLGMsYixkKX19fWNhdGNoKHYpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PXYubmFtZSl0aHJvdyB2O3JldHVybi12LlBhfX0sbjooYSxiKT0+e0tjW2FdJiYoY2xlYXJUaW1lb3V0KEtjW2FdLmlkKSxkZWxldGUgS2NbYV0pO2lmKCFiKXJldHVybiAwO3ZhciBjPXNldFRpbWVvdXQoKCk9PntkZWxldGUgS2NbYV07TWMoKCk9PldjKGEscGVyZm9ybWFuY2Uubm93KCkpKX0sYik7S2NbYV09e2lkOmMsbGM6Yn07cmV0dXJuIDB9LEI6KGEsYixjLGQpPT57dmFyIGU9KG5ldyBEYXRlKS5nZXRGdWxsWWVhcigpLGc9KG5ldyBEYXRlKGUsMCwxKSkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbmU9KG5ldyBEYXRlKGUsNiwxKSkuZ2V0VGltZXpvbmVPZmZzZXQoKTtGW2E+PjJdPTYwKk1hdGgubWF4KGcsZSk7RVtiPj4yXT1OdW1iZXIoZyE9ZSk7Yj1oPT57dmFyIHE9TWF0aC5hYnMoaCk7cmV0dXJuYFVUQyR7MDw9aD9cIi1cIjpcIitcIn0ke1N0cmluZyhNYXRoLmZsb29yKHEvNjApKS5wYWRTdGFydCgyLFwiMFwiKX0ke1N0cmluZyhxJTYwKS5wYWRTdGFydCgyLFwiMFwiKX1gfTthPWIoZyk7Yj1iKGUpO2U8Zz8oTShhLEMsYywxNyksTShiLEMsZCwxNykpOihNKGEsQyxkLDE3KSxNKGIsQyxjLDE3KSl9LGQ6KCk9PkRhdGUubm93KCksczooKT0+MjE0NzQ4MzY0OCxjOigpPT5wZXJmb3JtYW5jZS5ub3coKSxvOmE9Pnt2YXIgYj1DLmxlbmd0aDthPj4+PTA7aWYoMjE0NzQ4MzY0ODxhKXJldHVybiExO2Zvcih2YXIgYz0xOzQ+PWM7Yyo9Mil7dmFyIGQ9YiooMSsuMi9jKTtkPU1hdGgubWluKGQsYSsxMDA2NjMyOTYpO2E6e2Q9KE1hdGgubWluKDIxNDc0ODM2NDgsNjU1MzYqTWF0aC5jZWlsKE1hdGgubWF4KGEsXG5kKS82NTUzNikpLU1hLmJ1ZmZlci5ieXRlTGVuZ3RoKzY1NTM1KS82NTUzNnwwO3RyeXtNYS5ncm93KGQpO0xhKCk7dmFyIGU9MTticmVhayBhfWNhdGNoKGcpe31lPXZvaWQgMH1pZihlKXJldHVybiEwfXJldHVybiExfSxFOihhLGIpPT57dmFyIGM9MCxkPTAsZTtmb3IoZSBvZiBQYygpKXt2YXIgZz1iK2M7RlthK2Q+PjJdPWc7Yys9TShlLEMsZyxJbmZpbml0eSkrMTtkKz00fXJldHVybiAwfSxGOihhLGIpPT57dmFyIGM9UGMoKTtGW2E+PjJdPWMubGVuZ3RoO2E9MDtmb3IodmFyIGQgb2YgYylhKz1pYihkKSsxO0ZbYj4+Ml09YTtyZXR1cm4gMH0sZTpmdW5jdGlvbihhKXt0cnl7dmFyIGI9VChhKTtwYShiKTtyZXR1cm4gMH1jYXRjaChjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1jLm5hbWUpdGhyb3cgYztyZXR1cm4gYy5QYX19LHA6ZnVuY3Rpb24oYSxiKXt0cnl7dmFyIGM9VChhKTttW2JdPWMudHR5PzI6UChjLm1vZGUpPzM6NDA5NjA9PT0oYy5tb2RlJlxuNjE0NDApPzc6NDtJYVtiKzI+PjFdPTA7SFtiKzg+PjNdPUJpZ0ludCgwKTtIW2IrMTY+PjNdPUJpZ0ludCgwKTtyZXR1cm4gMH1jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1kLm5hbWUpdGhyb3cgZDtyZXR1cm4gZC5QYX19LHc6ZnVuY3Rpb24oYSxiLGMsZCl7dHJ5e2E6e3ZhciBlPVQoYSk7YT1iO2Zvcih2YXIgZyxoPWI9MDtoPGM7aCsrKXt2YXIgcT1GW2E+PjJdLHY9RlthKzQ+PjJdO2ErPTg7dmFyIHU9Y2MoZSxtLHEsdixnKTtpZigwPnUpe3ZhciB4PS0xO2JyZWFrIGF9Yis9dTtpZih1PHYpYnJlYWs7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGcmJihnKz11KX14PWJ9RltkPj4yXT14O3JldHVybiAwfWNhdGNoKEQpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PUQubmFtZSl0aHJvdyBEO3JldHVybiBELlBhfX0sRDpmdW5jdGlvbihhLGIsYyxkKXtiPS05MDA3MTk5MjU0NzQwOTkyPmJ8fDkwMDcxOTkyNTQ3NDA5OTI8XG5iP05hTjpOdW1iZXIoYik7dHJ5e2lmKGlzTmFOKGIpKXJldHVybiA2MTt2YXIgZT1UKGEpO2JjKGUsYixjKTtIW2Q+PjNdPUJpZ0ludChlLnBvc2l0aW9uKTtlLnJiJiYwPT09YiYmMD09PWMmJihlLnJiPW51bGwpO3JldHVybiAwfWNhdGNoKGcpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWcubmFtZSl0aHJvdyBnO3JldHVybiBnLlBhfX0sSTpmdW5jdGlvbihhKXt0cnl7dmFyIGI9VChhKTtyZXR1cm4gYi5NYT8uZnN5bmM/LihiKX1jYXRjaChjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1jLm5hbWUpdGhyb3cgYztyZXR1cm4gYy5QYX19LHQ6ZnVuY3Rpb24oYSxiLGMsZCl7dHJ5e2E6e3ZhciBlPVQoYSk7YT1iO2Zvcih2YXIgZyxoPWI9MDtoPGM7aCsrKXt2YXIgcT1GW2E+PjJdLHY9RlthKzQ+PjJdO2ErPTg7dmFyIHU9b2EoZSxtLHEsdixnKTtpZigwPnUpe3ZhciB4PS0xO2JyZWFrIGF9Yis9dTtpZih1PHYpYnJlYWs7XG5cInVuZGVmaW5lZFwiIT10eXBlb2YgZyYmKGcrPXUpfXg9Yn1GW2Q+PjJdPXg7cmV0dXJuIDB9Y2F0Y2goRCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09RC5uYW1lKXRocm93IEQ7cmV0dXJuIEQuUGF9fSxrOkxjfTtcbmZ1bmN0aW9uIFljKCl7ZnVuY3Rpb24gYSgpe2suY2FsbGVkUnVuPSEwO2lmKCFHYSl7aWYoIWsubm9GU0luaXQmJiFHYil7dmFyIGIsYztHYj0hMDtiPz89ay5zdGRpbjtjPz89ay5zdGRvdXQ7ZD8/PWsuc3RkZXJyO2I/VyhcInN0ZGluXCIsYik6WGIoXCIvZGV2L3R0eVwiLFwiL2Rldi9zdGRpblwiKTtjP1coXCJzdGRvdXRcIixudWxsLGMpOlhiKFwiL2Rldi90dHlcIixcIi9kZXYvc3Rkb3V0XCIpO2Q/VyhcInN0ZGVyclwiLG51bGwsZCk6WGIoXCIvZGV2L3R0eTFcIixcIi9kZXYvc3RkZXJyXCIpO25hKFwiL2Rldi9zdGRpblwiLDApO25hKFwiL2Rldi9zdGRvdXRcIiwxKTtuYShcIi9kZXYvc3RkZXJyXCIsMSl9WmMuTigpO0hiPSExO2sub25SdW50aW1lSW5pdGlhbGl6ZWQ/LigpO2lmKGsucG9zdFJ1bilmb3IoXCJmdW5jdGlvblwiPT10eXBlb2Ygay5wb3N0UnVuJiYoay5wb3N0UnVuPVtrLnBvc3RSdW5dKTtrLnBvc3RSdW4ubGVuZ3RoOyl7dmFyIGQ9ay5wb3N0UnVuLnNoaWZ0KCk7VWEucHVzaChkKX1UYShVYSl9fWlmKDA8XG5LKVhhPVljO2Vsc2V7aWYoay5wcmVSdW4pZm9yKFwiZnVuY3Rpb25cIj09dHlwZW9mIGsucHJlUnVuJiYoay5wcmVSdW49W2sucHJlUnVuXSk7ay5wcmVSdW4ubGVuZ3RoOylXYSgpO1RhKFZhKTswPEs/WGE9WWM6ay5zZXRTdGF0dXM/KGsuc2V0U3RhdHVzKFwiUnVubmluZy4uLlwiKSxzZXRUaW1lb3V0KCgpPT57c2V0VGltZW91dCgoKT0+ay5zZXRTdGF0dXMoXCJcIiksMSk7YSgpfSwxKSk6YSgpfX12YXIgWmM7XG4oYXN5bmMgZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGMpe2M9WmM9Yy5leHBvcnRzO2suX3NxbGl0ZTNfZnJlZT1jLlA7ay5fc3FsaXRlM192YWx1ZV90ZXh0PWMuUTtrLl9zcWxpdGUzX3ByZXBhcmVfdjI9Yy5SO2suX3NxbGl0ZTNfc3RlcD1jLlM7ay5fc3FsaXRlM19yZXNldD1jLlQ7ay5fc3FsaXRlM19leGVjPWMuVTtrLl9zcWxpdGUzX2ZpbmFsaXplPWMuVjtrLl9zcWxpdGUzX2NvbHVtbl9uYW1lPWMuVztrLl9zcWxpdGUzX2NvbHVtbl90ZXh0PWMuWDtrLl9zcWxpdGUzX2NvbHVtbl90eXBlPWMuWTtrLl9zcWxpdGUzX2Vycm1zZz1jLlo7ay5fc3FsaXRlM19jbGVhcl9iaW5kaW5ncz1jLl87ay5fc3FsaXRlM192YWx1ZV9ibG9iPWMuJDtrLl9zcWxpdGUzX3ZhbHVlX2J5dGVzPWMuYWE7ay5fc3FsaXRlM192YWx1ZV9kb3VibGU9Yy5iYTtrLl9zcWxpdGUzX3ZhbHVlX2ludD1jLmNhO2suX3NxbGl0ZTNfdmFsdWVfdHlwZT1jLmRhO2suX3NxbGl0ZTNfcmVzdWx0X2Jsb2I9Yy5lYTtcbmsuX3NxbGl0ZTNfcmVzdWx0X2RvdWJsZT1jLmZhO2suX3NxbGl0ZTNfcmVzdWx0X2Vycm9yPWMuZ2E7ay5fc3FsaXRlM19yZXN1bHRfaW50PWMuaGE7ay5fc3FsaXRlM19yZXN1bHRfaW50NjQ9Yy5pYTtrLl9zcWxpdGUzX3Jlc3VsdF9udWxsPWMuamE7ay5fc3FsaXRlM19yZXN1bHRfdGV4dD1jLmthO2suX3NxbGl0ZTNfYWdncmVnYXRlX2NvbnRleHQ9Yy5sYTtrLl9zcWxpdGUzX2NvbHVtbl9jb3VudD1jLm1hO2suX3NxbGl0ZTNfZGF0YV9jb3VudD1jLm5hO2suX3NxbGl0ZTNfY29sdW1uX2Jsb2I9Yy5vYTtrLl9zcWxpdGUzX2NvbHVtbl9ieXRlcz1jLnBhO2suX3NxbGl0ZTNfY29sdW1uX2RvdWJsZT1jLnFhO2suX3NxbGl0ZTNfYmluZF9ibG9iPWMucmE7ay5fc3FsaXRlM19iaW5kX2RvdWJsZT1jLnNhO2suX3NxbGl0ZTNfYmluZF9pbnQ9Yy50YTtrLl9zcWxpdGUzX2JpbmRfdGV4dD1jLnVhO2suX3NxbGl0ZTNfYmluZF9wYXJhbWV0ZXJfaW5kZXg9Yy52YTtrLl9zcWxpdGUzX3NxbD1cbmMud2E7ay5fc3FsaXRlM19ub3JtYWxpemVkX3NxbD1jLnhhO2suX3NxbGl0ZTNfY2hhbmdlcz1jLnlhO2suX3NxbGl0ZTNfY2xvc2VfdjI9Yy56YTtrLl9zcWxpdGUzX2NyZWF0ZV9mdW5jdGlvbl92Mj1jLkFhO2suX3NxbGl0ZTNfdXBkYXRlX2hvb2s9Yy5CYTtrLl9zcWxpdGUzX29wZW49Yy5DYTtkYT1rLl9tYWxsb2M9Yy5EYTtlYT1rLl9mcmVlPWMuRWE7ay5fUmVnaXN0ZXJFeHRlbnNpb25GdW5jdGlvbnM9Yy5GYTtCYj1jLkdhO1djPWMuSGE7c2E9Yy5JYTt5PWMuSmE7cWE9Yy5LYTtNYT1jLk07Wj1jLk87TGEoKTtLLS07ay5tb25pdG9yUnVuRGVwZW5kZW5jaWVzPy4oSyk7MD09SyYmWGEmJihjPVhhLFhhPW51bGwsYygpKTtyZXR1cm4gWmN9SysrO2subW9uaXRvclJ1bkRlcGVuZGVuY2llcz8uKEspO3ZhciBiPXthOlhjfTtpZihrLmluc3RhbnRpYXRlV2FzbSlyZXR1cm4gbmV3IFByb21pc2UoYz0+e2suaW5zdGFudGlhdGVXYXNtKGIsKGQsZSk9PntjKGEoZCxlKSl9KX0pO1xuT2E/Pz1rLmxvY2F0ZUZpbGU/ay5sb2NhdGVGaWxlKFwic3FsLXdhc20ud2FzbVwiLEFhKTpBYStcInNxbC13YXNtLndhc21cIjtyZXR1cm4gYSgoYXdhaXQgUmEoYikpLmluc3RhbmNlKX0pKCk7WWMoKTtcblxuXG4gICAgICAgIC8vIFRoZSBzaGVsbC1wcmUuanMgYW5kIGVtY2MtZ2VuZXJhdGVkIGNvZGUgZ29lcyBhYm92ZVxuICAgICAgICByZXR1cm4gTW9kdWxlO1xuICAgIH0pOyAvLyBUaGUgZW5kIG9mIHRoZSBwcm9taXNlIGJlaW5nIHJldHVybmVkXG5cbiAgcmV0dXJuIGluaXRTcWxKc1Byb21pc2U7XG59IC8vIFRoZSBlbmQgb2Ygb3VyIGluaXRTcWxKcyBmdW5jdGlvblxuXG4vLyBUaGlzIGJpdCBiZWxvdyBpcyBjb3BpZWQgYWxtb3N0IGV4YWN0bHkgZnJvbSB3aGF0IHlvdSBnZXQgd2hlbiB5b3UgdXNlIHRoZSBNT0RVTEFSSVpFPTEgZmxhZyB3aXRoIGVtY2Ncbi8vIEhvd2V2ZXIsIHdlIGRvbid0IHdhbnQgdG8gdXNlIHRoZSBlbWNjIG1vZHVsYXJpemF0aW9uLiBTZWUgc2hlbGwtcHJlLmpzXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGluaXRTcWxKcztcbiAgICAvLyBUaGlzIHdpbGwgYWxsb3cgdGhlIG1vZHVsZSB0byBiZSB1c2VkIGluIEVTNiBvciBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBpbml0U3FsSnM7XG59XG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkgeyByZXR1cm4gaW5pdFNxbEpzOyB9KTtcbn1cbmVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jyl7XG4gICAgZXhwb3J0c1tcIk1vZHVsZVwiXSA9IGluaXRTcWxKcztcbn1cbiIsICJpbXBvcnQgeyBOb3RpY2UsIFBsYXRmb3JtLCBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExvY2FsU3RhdGUsIG5ld0xvY2FsU3RhdGUgfSBmcm9tIFwiLi9sb2NhbC1zdGF0ZVwiO1xuaW1wb3J0IHsgUXVldWVTdG9yZSB9IGZyb20gXCIuL3N0b3JhZ2VcIjtcbmltcG9ydCB7IERhaWx5SW50YWtlU2V0dGluZ3NUYWIgfSBmcm9tIFwiLi9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVGVsZWdyYW1DbGllbnQgfSBmcm9tIFwiLi90ZWxlZ3JhbVwiO1xuaW1wb3J0IHsgREVGQVVMVF9TRVRUSU5HUywgdHlwZSBCb3RTZXNzaW9uLCB0eXBlIEludGFrZUtpbmQsIHR5cGUgUXVldWVJdGVtLCB0eXBlIFNldHRpbmdzLCB0eXBlIFRlbGVncmFtRmlsZSwgdHlwZSBUZWxlZ3JhbU1lc3NhZ2UsIHR5cGUgVGVsZWdyYW1VcGRhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgYWNjZXB0c1ByaXZhdGVTZW5kZXIsIGF0dGFjaG1lbnRQYXRoLCBjYWxsb3V0TGluZXMsIGdyb3VwS2V5LCBpbnRha2VEYXRlLCBpc0ltYWdlLCBpc1N1cHBvcnRlZENvbnRlbnQsIHBhcnNlU2VsZWN0aW9uSWRzLCBzdGFzaFBhdGgsIHRlbGVncmFtQ29tbWFuZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgU0hVVERPV05fS0VZID0gU3ltYm9sLmZvcihcImRhaWx5LWludGFrZS5zaHV0ZG93blwiKTtcbmNvbnN0IFNUQVNIX0ZPTERFUiA9IFwiU3RyYXRhL0F0dGFjaG1lbnRzL0ludGFrZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYWlseUludGFrZVBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuICBwcml2YXRlIHN0b3JlITogUXVldWVTdG9yZTtcbiAgcHJpdmF0ZSBsb2NhbFN0YXRlOiBMb2NhbFN0YXRlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGVsZWdyYW0gPSBuZXcgVGVsZWdyYW1DbGllbnQoKCkgPT4gdGhpcy5zZXR0aW5ncy50b2tlbik7XG4gIHByaXZhdGUgc3RvcHBlZCA9IGZhbHNlO1xuICBwcml2YXRlIHBvbGxpbmc6IFByb21pc2U8dm9pZD4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBwb2xsaW5nQWJvcnQ6IEFib3J0Q29udHJvbGxlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNldHRsaW5nOiBQcm9taXNlPHZvaWQ+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2V0dGxlQWdhaW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgKChnbG9iYWxUaGlzIGFzIGFueSlbU0hVVERPV05fS0VZXSBhcyBQcm9taXNlPHZvaWQ+IHwgdW5kZWZpbmVkKT8uY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICBjb25zdCBwbHVnaW5EaXIgPSBgJHt0aGlzLmFwcC52YXVsdC5jb25maWdEaXJ9L3BsdWdpbnMvJHt0aGlzLm1hbmlmZXN0LmlkfWA7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBEYWlseUludGFrZVNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwic2hvdy1zdGF0dXNcIiwgbmFtZTogXCJTaG93IGludGFrZSBzdGF0dXNcIiwgY2FsbGJhY2s6ICgpID0+IG5ldyBOb3RpY2UodGhpcy5zZXR0aW5ncy5zdGF0dXMpIH0pO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcInNob3ctcXVldWVcIiwgbmFtZTogXCJTaG93IHBlbmRpbmcgaW50YWtlXCIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkIHRoaXMuc2hvd1F1ZXVlKCkgfSk7XG5cbiAgICBpZiAoIVBsYXRmb3JtLmlzRGVza3RvcEFwcCB8fCAhUGxhdGZvcm0uaXNNYWNPUykge1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUywgc3RhdHVzOiBcIkRhaWx5IEludGFrZSBwcml2YXRlIHN0YXRlIGlzIGF2YWlsYWJsZSBvbmx5IG9uIGRlc2t0b3AgbWFjT1MuXCIgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsb2FkZWQgPSBhd2FpdCB0aGlzLmxvYWRQcml2YXRlU3RhdGUocGx1Z2luRGlyKTtcbiAgICB0aGlzLnNldHRpbmdzID0gbG9hZGVkLnNldHRpbmdzO1xuICAgIHRoaXMubG9jYWxTdGF0ZSA9IGxvYWRlZC5zdGF0ZTtcbiAgICBpZiAoIXRoaXMubG9jYWxTdGF0ZSkgcmV0dXJuO1xuICAgIHRoaXMuc3RvcmUgPSB0aGlzLnF1ZXVlU3RvcmUodGhpcy5sb2NhbFN0YXRlKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5vcGVuKHRoaXMuc2V0dGluZ3Mub2Zmc2V0KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHRoaXMubG9jYWxTdGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnNldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTLCBzdGF0dXM6IFwiUHJpdmF0ZSBzdGF0ZSBpcyB1bnJlYWRhYmxlIG9yIGluY29uc2lzdGVudDsgaXQgd2FzIG5vdCBjaGFuZ2VkLlwiIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbCh3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4gdm9pZCB0aGlzLnNldHRsZUFuZFByb21wdCgpLCAyNTAwKSk7XG4gICAgYXdhaXQgdGhpcy5yZXN0YXJ0UG9sbGluZygpO1xuICB9XG5cbiAgb251bmxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICB0aGlzLnBvbGxpbmdBYm9ydD8uYWJvcnQoKTtcbiAgICBjb25zdCBwb2xsaW5nID0gdGhpcy5wb2xsaW5nO1xuICAgIGNvbnN0IHNldHRsaW5nID0gdGhpcy5zZXR0bGluZztcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuc3RvcmU7XG4gICAgY29uc3Qgc2h1dGRvd24gPSAoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgcG9sbGluZz8uY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgIGF3YWl0IHNldHRsaW5nPy5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgICAgYXdhaXQgc3RvcmU/LmNsb3NlKCk7XG4gICAgfSkoKS5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgIChnbG9iYWxUaGlzIGFzIGFueSlbU0hVVERPV05fS0VZXSA9IHNodXRkb3duO1xuICAgIHZvaWQgc2h1dGRvd24udGhlbigoKSA9PiB7XG4gICAgICBpZiAoKGdsb2JhbFRoaXMgYXMgYW55KVtTSFVURE9XTl9LRVldID09PSBzaHV0ZG93bikgZGVsZXRlIChnbG9iYWxUaGlzIGFzIGFueSlbU0hVVERPV05fS0VZXTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncyhzbmFwc2hvdCA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIVBsYXRmb3JtLmlzRGVza3RvcEFwcCB8fCAhUGxhdGZvcm0uaXNNYWNPUykgcmV0dXJuO1xuICAgIGlmICghdGhpcy5sb2NhbFN0YXRlKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBgJHt0aGlzLmFwcC52YXVsdC5jb25maWdEaXJ9L3BsdWdpbnMvJHt0aGlzLm1hbmlmZXN0LmlkfWA7XG4gICAgICBjb25zdCBjcmVhdGVkID0gYXdhaXQgbmV3TG9jYWxTdGF0ZSh0aGlzLmFwcCwgcGx1Z2luRGlyKTtcbiAgICAgIGF3YWl0IGNyZWF0ZWQucHJlcGFyZUVtcHR5KHRoaXMuYXBwKTtcbiAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5xdWV1ZVN0b3JlKGNyZWF0ZWQsIGZhbHNlKTtcbiAgICAgIGF3YWl0IHN0b3JlLm9wZW4oMCk7XG4gICAgICBhd2FpdCBzdG9yZS5jbG9zZSgpO1xuICAgICAgdGhpcy5sb2NhbFN0YXRlID0gY3JlYXRlZDtcbiAgICAgIGF3YWl0IHRoaXMubG9jYWxTdGF0ZS53cml0ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MsIGZhbHNlKTtcbiAgICAgIHRoaXMuc3RvcmUgPSB0aGlzLnF1ZXVlU3RvcmUoY3JlYXRlZCk7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLm9wZW4oMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMubG9jYWxTdGF0ZS53cml0ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MsIHNuYXBzaG90KTtcbiAgfVxuXG4gIGFzeW5jIHJlc3RhcnRQb2xsaW5nKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgdGhpcy5wb2xsaW5nQWJvcnQ/LmFib3J0KCk7XG4gICAgYXdhaXQgdGhpcy5wb2xsaW5nPy5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgIHRoaXMucG9sbGluZyA9IG51bGw7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZWQpIHJldHVybiB0aGlzLnNldFN0YXR1cyhcIkRpc2FibGVkIG9uIHRoaXMgZGV2aWNlLlwiKTtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MudG9rZW4pIHJldHVybiB0aGlzLnNldFN0YXR1cyhcIlN0b3BwZWQ6IGFkZCBhIFRlbGVncmFtIGJvdCB0b2tlbi5cIik7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLm93bmVyVXNlcklkICYmICF0aGlzLnNldHRpbmdzLnBhaXJBcm1lZCkgcmV0dXJuIHRoaXMuc2V0U3RhdHVzKFwiU3RvcHBlZDogcGFpciBhIHByaXZhdGUgVGVsZWdyYW0gY2hhdCBmaXJzdC5cIik7XG4gICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgYXdhaXQgdGhpcy5zZXRTdGF0dXModGhpcy5zZXR0aW5ncy5vd25lclVzZXJJZCA/IFwiUG9sbGluZyB5b3VyIHBhaXJlZCBwcml2YXRlIGNoYXQuXCIgOiBcIldhaXRpbmcgdG8gcGFpciB0aGUgbmV4dCBwcml2YXRlIHNlbmRlci5cIik7XG4gICAgdGhpcy5wb2xsaW5nID0gdGhpcy5wb2xsKCk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Mub3duZXJVc2VySWQpIHZvaWQgdGhpcy50ZWxlZ3JhbS5jb21tYW5kcygpLmNhdGNoKChlcnJvcikgPT4gdGhpcy5zZXRTdGF0dXMoYFBvbGxpbmcsIGJ1dCBjb3VsZCBub3Qgc2V0IGJvdCBjb21tYW5kczogJHtlcnJvci5tZXNzYWdlfWApKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcG9sbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB3aGlsZSAoIXRoaXMuc3RvcHBlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5wb2xsaW5nQWJvcnQgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZXMgPSBhd2FpdCB0aGlzLnRlbGVncmFtLnVwZGF0ZXModGhpcy5zZXR0aW5ncy5vZmZzZXQgKyAxLCB0aGlzLnBvbGxpbmdBYm9ydC5zaWduYWwpO1xuICAgICAgICB0aGlzLnBvbGxpbmdBYm9ydCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgdXBkYXRlIG9mIHVwZGF0ZXMpIGF3YWl0IHRoaXMuaGFuZGxlVXBkYXRlKHVwZGF0ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnN0b3BwZWQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IFN0cmluZyhlcnJvcj8ubWVzc2FnZSA/PyBlcnJvcik7XG4gICAgICAgIGlmIChlcnJvcj8uc3RhdHVzID09PSA0MDkgfHwgL3dlYmhvb2t8Y29uZmxpY3QvaS50ZXN0KG1lc3NhZ2UpKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXRTdGF0dXMoYFN0b3BwZWQ6IFRlbGVncmFtIHBvbGxpbmcgY29uZmxpY3QgKCR7bWVzc2FnZX0pLiBSZW1vdmUgdGhlIHdlYmhvb2sgb3Igb3RoZXIgcG9sbGVyIHlvdXJzZWxmOyBEYWlseSBJbnRha2Ugd2lsbCBub3QgY2hhbmdlIGl0LmApO1xuICAgICAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0U3RhdHVzKGBQb2xsaW5nIHJldHJ5OiAke21lc3NhZ2V9YCk7XG4gICAgICAgIGF3YWl0IHBhdXNlKDMwMDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlVXBkYXRlKHVwZGF0ZTogVGVsZWdyYW1VcGRhdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gdXBkYXRlLm1lc3NhZ2UgPz8gdXBkYXRlLmNhbGxiYWNrX3F1ZXJ5Py5tZXNzYWdlO1xuICAgIGNvbnN0IGZyb20gPSB1cGRhdGUubWVzc2FnZT8uZnJvbSA/PyB1cGRhdGUuY2FsbGJhY2tfcXVlcnk/LmZyb207XG4gICAgY29uc3Qgc2VuZGVyID0gYWNjZXB0c1ByaXZhdGVTZW5kZXIobWVzc2FnZSwgZnJvbT8uaWQsIHRoaXMuc2V0dGluZ3Mub3duZXJVc2VySWQsIHRoaXMuc2V0dGluZ3Mub3duZXJDaGF0SWQsIHRoaXMuc2V0dGluZ3MucGFpckFybWVkKTtcbiAgICBjb25zdCBwYWlyaW5nID0gc2VuZGVyID09PSBcInBhaXJcIjtcbiAgICBsZXQgYWxsb3dlZCA9IHNlbmRlciA9PT0gXCJvd25lclwiO1xuICAgIGNvbnN0IGNvbW1hbmQgPSB0ZWxlZ3JhbUNvbW1hbmQodXBkYXRlLm1lc3NhZ2U/LnRleHQpO1xuICAgIGNvbnN0IHNlc3Npb24gPSBhbGxvd2VkID8gYXdhaXQgdGhpcy5zdG9yZS5zZXNzaW9uKCkgOiBudWxsO1xuICAgIGNvbnN0IGlkUmVwbHkgPSBCb29sZWFuKHVwZGF0ZS5tZXNzYWdlICYmICFjb21tYW5kICYmIHNlc3Npb24/Lm1vZGUgPT09IFwiYXdhaXRpbmdfaWRzXCIpO1xuICAgIGNvbnN0IGluc2VydGVkID0gYXdhaXQgdGhpcy5zdG9yZS5yZWNvcmQodXBkYXRlLCB1cGRhdGUubWVzc2FnZSwgKGFsbG93ZWQgfHwgcGFpcmluZykgJiYgIWNvbW1hbmQgJiYgIWlkUmVwbHkpO1xuICAgIC8vIFRoZSByYXcgZHVyYWJsZSByZWNvcmQgaXMgaW50ZW50aW9uYWxseSBmbHVzaGVkIGJlZm9yZSB0aGlzIHBlcnNpc3RlZCBvZmZzZXQgbW92ZXMuXG4gICAgdGhpcy5zZXR0aW5ncy5vZmZzZXQgPSBNYXRoLm1heCh0aGlzLnNldHRpbmdzLm9mZnNldCwgdXBkYXRlLnVwZGF0ZV9pZCk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoZmFsc2UpO1xuICAgIGlmICghaW5zZXJ0ZWQpIHJldHVybjtcbiAgICBpZiAocGFpcmluZykge1xuICAgICAgdGhpcy5zZXR0aW5ncy5vd25lclVzZXJJZCA9IGZyb20hLmlkO1xuICAgICAgdGhpcy5zZXR0aW5ncy5vd25lckNoYXRJZCA9IG1lc3NhZ2UhLmNoYXQuaWQ7XG4gICAgICB0aGlzLnNldHRpbmdzLnBhaXJBcm1lZCA9IGZhbHNlO1xuICAgICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICAgIGF3YWl0IHRoaXMuc2V0U3RhdHVzKFwiUGFpcmVkLiBQb2xsaW5nIHlvdXIgcHJpdmF0ZSBUZWxlZ3JhbSBjaGF0LlwiKTtcbiAgICAgIHZvaWQgdGhpcy50ZWxlZ3JhbS5jb21tYW5kcygpLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgICB2b2lkIHRoaXMudGVsZWdyYW0uc2VuZE1lc3NhZ2UobWVzc2FnZSEuY2hhdC5pZCwgXCJEYWlseSBJbnRha2UgcGFpcmVkLiBTZW5kIGFuIGl0ZW0sIHRoZW4gY2hvb3NlIHdoZXJlIGl0IGJlbG9uZ3MuXCIpLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgICBhbGxvd2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFhbGxvd2VkKSByZXR1cm47XG4gICAgaWYgKHVwZGF0ZS5jYWxsYmFja19xdWVyeSkge1xuICAgICAgdm9pZCB0aGlzLnRlbGVncmFtLmFuc3dlckNhbGxiYWNrUXVlcnkodXBkYXRlLmNhbGxiYWNrX3F1ZXJ5LmlkLCBcIldvcmtpbmcgb24gaXRcdTIwMjZcIikuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlQ2FsbGJhY2sodXBkYXRlLmNhbGxiYWNrX3F1ZXJ5LmRhdGEgPz8gXCJcIiwgbWVzc2FnZSEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXVwZGF0ZS5tZXNzYWdlKSByZXR1cm47XG4gICAgaWYgKGNvbW1hbmQpIHtcbiAgICAgIGlmIChjb21tYW5kID09PSBcImNhbmNlbFwiKSBhd2FpdCB0aGlzLmNhbmNlbFNlc3Npb24oKTtcbiAgICAgIGlmIChjb21tYW5kID09PSBcInF1ZXVlXCIpIGF3YWl0IHRoaXMuc2VuZFF1ZXVlKHVwZGF0ZS5tZXNzYWdlLmNoYXQuaWQsIDApO1xuICAgICAgaWYgKGNvbW1hbmQgPT09IFwic3RhdHVzXCIpIGF3YWl0IHRoaXMudGVsZWdyYW0uc2VuZE1lc3NhZ2UodXBkYXRlLm1lc3NhZ2UuY2hhdC5pZCwgdGhpcy5zZXR0aW5ncy5zdGF0dXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaWRSZXBseSkge1xuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVJZFJlcGx5KHVwZGF0ZS5tZXNzYWdlLCBzZXNzaW9uISk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuc2V0dGxlQW5kUHJvbXB0KCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNldHRsZUFuZFByb21wdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5zdG9wcGVkIHx8ICF0aGlzLnN0b3JlIHx8ICF0aGlzLnNldHRpbmdzLm93bmVyQ2hhdElkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuc2V0dGxpbmcpIHtcbiAgICAgIHRoaXMuc2V0dGxlQWdhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGxpbmc7XG4gICAgfVxuICAgIHRoaXMuc2V0dGxpbmcgPSB0aGlzLnJ1blNldHRsZVBhc3NlcygpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnNldHRsaW5nO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnNldHRsaW5nID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1blNldHRsZVBhc3NlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBkbyB7XG4gICAgICB0aGlzLnNldHRsZUFnYWluID0gZmFsc2U7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLnNldHRsZUdyb3VwcygpO1xuICAgICAgbGV0IHNlc3Npb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNlc3Npb24oKTtcbiAgICAgIGNvbnN0IGhlbGQgPSBuZXcgU2V0KChzZXNzaW9uID8gKGF3YWl0IHRoaXMuc3RvcmUubG9naWNhbEl0ZW1zKHNlc3Npb24ubGVhZGVySWRzKSkgPz8gW10gOiBbXSkubWFwKChpdGVtKSA9PiBpdGVtLmlkKSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuc3RvcmUucGVuZGluZygpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdyb3VwS2V5KGl0ZW0uaWQsIGl0ZW0ubWVkaWFHcm91cElkID8/IHVuZGVmaW5lZCk7XG4gICAgICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBhd2FpdCB0aGlzLnN0b3JlLmdyb3VwKGl0ZW0pO1xuICAgICAgICBpZiAoZ3JvdXAuc29tZSgobWVtYmVyKSA9PiBoZWxkLmhhcyhtZW1iZXIuaWQpKSkgY29udGludWU7XG4gICAgICAgIGlmIChncm91cC5zb21lKChtZW1iZXIpID0+IG1lbWJlci5wcm9tcHRNZXNzYWdlSWQpKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qgc3VwcG9ydGVkID0gZ3JvdXAuZXZlcnkoKG1lbWJlcikgPT4gaXNTdXBwb3J0ZWRDb250ZW50KG1lbWJlci5wYXlsb2FkKSk7XG4gICAgICAgIGlmICghc3VwcG9ydGVkKSB7XG4gICAgICAgICAgY29uc3QgcHJvbXB0ID0gYXdhaXQgdGhpcy50ZWxlZ3JhbS5zZW5kTWVzc2FnZSh0aGlzLnNldHRpbmdzLm93bmVyQ2hhdElkISwgYCR7dGhpcy5kZXNjcmliZShncm91cCl9XFxuXFxuVW5zdXBwb3J0ZWQgb3duZXIgY29udGVudCBjYW5ub3QgYmUgYXBwZW5kZWQgYXV0b21hdGljYWxseS5gLCB7IGlubGluZV9rZXlib2FyZDogaW5pdGlhbEFjdGlvblJvd3MoaXRlbS5pZCkgfSk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zdG9yZS5zZXRQcm9tcHQoZ3JvdXAubWFwKChtZW1iZXIpID0+IG1lbWJlci5pZCksIHRoaXMuc2V0dGluZ3Mub3duZXJDaGF0SWQhLCBwcm9tcHQubWVzc2FnZV9pZCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gYXdhaXQgdGhpcy5zdG9yZS5zZWxlY3Rpb24oWy4uLihzZXNzaW9uPy5sZWFkZXJJZHMgPz8gW10pLCBpdGVtLmlkXSk7XG4gICAgICAgIGlmICghc2VsZWN0aW9uKSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgcHJvbXB0ID0gYXdhaXQgdGhpcy50ZWxlZ3JhbS5zZW5kTWVzc2FnZSh0aGlzLnNldHRpbmdzLm93bmVyQ2hhdElkISwgXCJTdGFydGluZyBpbnRha2UgYnVuZGxlXHUyMDI2XCIpO1xuICAgICAgICAgIHNlc3Npb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNhdmVTZXNzaW9uKHsgbW9kZTogXCJidW5kbGVcIiwgbGVhZGVySWRzOiBzZWxlY3Rpb24ubGVhZGVySWRzLCBtZW51Q2hhdElkOiB0aGlzLnNldHRpbmdzLm93bmVyQ2hhdElkISwgbWVudU1lc3NhZ2VJZDogcHJvbXB0Lm1lc3NhZ2VfaWQsIHBhZ2U6IDAsIGFmdGVySWQ6IDAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2Vzc2lvbiA9IGF3YWl0IHRoaXMuc3RvcmUuc2F2ZVNlc3Npb24oeyAuLi5zZXNzaW9uLCBtb2RlOiBcImJ1bmRsZVwiLCBsZWFkZXJJZHM6IHNlbGVjdGlvbi5sZWFkZXJJZHMsIG9yZGluYWxMZWFkZXJJZHM6IFtdIH0pO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuc3RvcmUuc2V0UHJvbXB0KGdyb3VwLm1hcCgobWVtYmVyKSA9PiBtZW1iZXIuaWQpLCBzZXNzaW9uLm1lbnVDaGF0SWQsIHNlc3Npb24ubWVudU1lc3NhZ2VJZCk7XG4gICAgICAgIGdyb3VwLmZvckVhY2goKG1lbWJlcikgPT4gaGVsZC5hZGQobWVtYmVyLmlkKSk7XG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2Vzc2lvbik7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5zZXR0bGVBZ2FpbiAmJiAhdGhpcy5zdG9wcGVkKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogc3RyaW5nLCBtZXNzYWdlOiBUZWxlZ3JhbU1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYWdlID0gL15kaTpxOnA6KFxcZCspJC8uZXhlYyhkYXRhKTtcbiAgICBpZiAocGFnZSkge1xuICAgICAgaWYgKGF3YWl0IHRoaXMuc3RvcmUuc2Vzc2lvbigpKSByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnN0YWxlQ29udHJvbChtZXNzYWdlKTtcbiAgICAgIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuZWRpdFF1ZXVlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCBOdW1iZXIocGFnZVsxXSkpO1xuICAgIH1cbiAgICBjb25zdCBkZXRhaWwgPSAvXmRpOnE6bzooXFxkKyk6KFxcZCspJC8uZXhlYyhkYXRhKTtcbiAgICBpZiAoZGV0YWlsKSB7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5zdG9yZS5zZXNzaW9uKCkpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc3RhbGVDb250cm9sKG1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5vcGVuRGV0YWlsKE51bWJlcihkZXRhaWxbMV0pLCBtZXNzYWdlLCBOdW1iZXIoZGV0YWlsWzJdKSk7XG4gICAgfVxuICAgIGNvbnN0IHVuc3VwcG9ydGVkQWN0aW9uID0gL15kaTp1OihcXGQrKTooeHxxKSQvLmV4ZWMoZGF0YSk7XG4gICAgaWYgKHVuc3VwcG9ydGVkQWN0aW9uKSB7XG4gICAgICBpZiAodW5zdXBwb3J0ZWRBY3Rpb25bMl0gPT09IFwicVwiKSByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLmJhY2tGcm9tVW5zdXBwb3J0ZWQobWVzc2FnZSk7XG4gICAgICByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnJlc29sdmVTdGFuZGFsb25lKFwiZGlzY2FyZFwiLCBtZXNzYWdlLCBOdW1iZXIodW5zdXBwb3J0ZWRBY3Rpb25bMV0pKTtcbiAgICB9XG4gICAgY29uc3QgYWN0aW9uID0gL15kaTpiOihmfHN8dHx4fGx8cnxjfHF8c2N8c2R8c2F8c2kpJC8uZXhlYyhkYXRhKT8uWzFdO1xuICAgIGlmICghYWN0aW9uKSByZXR1cm47XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHRoaXMuc3RvcmUuc2Vzc2lvbigpO1xuICAgIGlmICghc2Vzc2lvbikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5lZGl0UXVldWUobWVzc2FnZS5jaGF0LmlkLCBtZXNzYWdlLm1lc3NhZ2VfaWQsIDApO1xuICAgIGlmIChzZXNzaW9uLm1lbnVDaGF0SWQgIT09IG1lc3NhZ2UuY2hhdC5pZCB8fCBzZXNzaW9uLm1lbnVNZXNzYWdlSWQgIT09IG1lc3NhZ2UubWVzc2FnZV9pZCkgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zdGFsZUNvbnRyb2wobWVzc2FnZSk7XG4gICAgaWYgKGFjdGlvbiA9PT0gXCJyXCIpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2Vzc2lvbik7XG4gICAgaWYgKGFjdGlvbiA9PT0gXCJjXCIgfHwgYWN0aW9uID09PSBcInFcIikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5sYXRlckJ1bmRsZShzZXNzaW9uLCBtZXNzYWdlKTtcbiAgICBpZiAoYWN0aW9uID09PSBcInNjXCIpIHtcbiAgICAgIGNvbnN0IHNhdmVkID0gYXdhaXQgdGhpcy5zdG9yZS5zYXZlU2Vzc2lvbih7IC4uLnNlc3Npb24sIG1vZGU6IFwiYnVuZGxlXCIgfSk7XG4gICAgICByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnNob3dTZXNzaW9uKHNhdmVkKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbiA9PT0gXCJmXCIpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuZmluaXNoQnVuZGxlKHNlc3Npb24sIG1lc3NhZ2UpO1xuICAgIGlmIChhY3Rpb24gPT09IFwic1wiKSB7XG4gICAgICBjb25zdCBzYXZlZCA9IGF3YWl0IHRoaXMuc3RvcmUuc2F2ZVNlc3Npb24oeyAuLi5zZXNzaW9uLCBtb2RlOiBcInN0YW5kYWxvbmVcIiB9KTtcbiAgICAgIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2F2ZWQpO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uID09PSBcInRcIikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy50b2dnbGVMYXRlc3Qoc2Vzc2lvbik7XG4gICAgaWYgKGFjdGlvbiA9PT0gXCJ4XCIpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuZGlzY2FyZExhdGVzdChzZXNzaW9uLCBtZXNzYWdlKTtcbiAgICBpZiAoYWN0aW9uID09PSBcImxcIikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5sYXRlckJ1bmRsZShzZXNzaW9uLCBtZXNzYWdlKTtcbiAgICBpZiAoYWN0aW9uID09PSBcInNpXCIpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc3Rhc2hMYXRlc3Qoc2Vzc2lvbiwgbWVzc2FnZSk7XG4gICAgYXdhaXQgdGhpcy5zYXZlTGF0ZXN0KGFjdGlvbiA9PT0gXCJzYVwiID8gXCJhZ2VudFwiIDogXCJkYWlseVwiLCBzZXNzaW9uLCBtZXNzYWdlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVzb2x2ZVN0YW5kYWxvbmUoa2luZDogXCJkaXNjYXJkXCIsIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSwgbGVhZGVySWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNlc3Npb24oKTtcbiAgICBjb25zdCBjbGFpbWVkID0gYXdhaXQgdGhpcy5zdG9yZS5jbGFpbUxlYWRlcnMoW2xlYWRlcklkXSwga2luZCk7XG4gICAgaWYgKCFjbGFpbWVkKSByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnRlbGVncmFtLmVkaXRNZXNzYWdlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCBcIlRoYXQgdW5zdXBwb3J0ZWQgaXRlbSB3YXMgYWxyZWFkeSByZXNvbHZlZCBvciBpcyBjdXJyZW50bHkgYmVpbmcgaGFuZGxlZC4gVXNlIC9xdWV1ZSB0byByZWNvdmVyLlwiLCB7IGlubGluZV9rZXlib2FyZDogW10gfSk7XG4gICAgY29uc3QgaWRzID0gY2xhaW1lZC5tYXAoKGl0ZW0pID0+IGl0ZW0uaWQpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLmRpc2NhcmQoaWRzKTtcbiAgICAgIGlmIChzZXNzaW9uKSBhd2FpdCB0aGlzLnRlbGVncmFtLmVkaXRNZXNzYWdlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCBcIlVuc3VwcG9ydGVkIGl0ZW0gZGlzY2FyZGVkLlwiLCB7IGlubGluZV9rZXlib2FyZDogW10gfSk7XG4gICAgICBlbHNlIGF3YWl0IHRoaXMuZWRpdFF1ZXVlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCAwKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBTdHJpbmcoZXJyb3I/Lm1lc3NhZ2UgPz8gZXJyb3IpO1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5yZWxlYXNlKGlkcywgZGV0YWlsKTtcbiAgICAgIGF3YWl0IHRoaXMudGVsZWdyYW0uZWRpdE1lc3NhZ2UobWVzc2FnZS5jaGF0LmlkLCBtZXNzYWdlLm1lc3NhZ2VfaWQsIGBOb3QgZGlzY2FyZGVkOiAke2RldGFpbH1gLCB7IGlubGluZV9rZXlib2FyZDogaW5pdGlhbEFjdGlvblJvd3MobGVhZGVySWQpIH0pO1xuICAgICAgYXdhaXQgdGhpcy5zZXRTdGF0dXMoYE5lZWRzIGF0dGVudGlvbjogJHtkZXRhaWx9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBiYWNrRnJvbVVuc3VwcG9ydGVkKG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLnN0b3JlLnNlc3Npb24oKSkge1xuICAgICAgYXdhaXQgdGhpcy50ZWxlZ3JhbS5lZGl0TWVzc2FnZShtZXNzYWdlLmNoYXQuaWQsIG1lc3NhZ2UubWVzc2FnZV9pZCwgXCJBIGJ1bmRsZSBpcyBhbHJlYWR5IGFjdGl2ZS4gVXNlIC9xdWV1ZSB0byBvcGVuIGl0cyBjdXJyZW50IGNvbnRyb2xzLlwiLCB7IGlubGluZV9rZXlib2FyZDogW10gfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuZWRpdFF1ZXVlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZmluaXNoQnVuZGxlKHNlc3Npb246IEJvdFNlc3Npb24sIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNsYWltZWQgPSBhd2FpdCB0aGlzLnN0b3JlLmNsYWltTGVhZGVycyhzZXNzaW9uLmxlYWRlcklkcywgXCJkYWlseVwiKTtcbiAgICBpZiAoIWNsYWltZWQpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2Vzc2lvbkVycm9yKHNlc3Npb24sIG1lc3NhZ2UsIFwiT25lIG9yIG1vcmUgYnVuZGxlIGl0ZW1zIGFyZSBubyBsb25nZXIgYXZhaWxhYmxlLlwiKTtcbiAgICBjb25zdCBpZHMgPSBjbGFpbWVkLm1hcCgoaXRlbSkgPT4gaXRlbS5pZCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwZW5kTWl4ZWQoc2Vzc2lvbi5sZWFkZXJJZHMsIGNsYWltZWQpO1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5maW5pc2goaWRzKTtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcmUuY2xlYXJTZXNzaW9uKCk7XG4gICAgICBhd2FpdCB0aGlzLmVkaXRRdWV1ZShtZXNzYWdlLmNoYXQuaWQsIG1lc3NhZ2UubWVzc2FnZV9pZCwgc2Vzc2lvbi5wYWdlKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBTdHJpbmcoZXJyb3I/Lm1lc3NhZ2UgPz8gZXJyb3IpO1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5yZWxlYXNlKGlkcywgZGV0YWlsKTtcbiAgICAgIGF3YWl0IHRoaXMuc2Vzc2lvbkVycm9yKHNlc3Npb24sIG1lc3NhZ2UsIGBCdW5kbGUgbm90IHNhdmVkOiAke2RldGFpbH1gKTtcbiAgICAgIGF3YWl0IHRoaXMuc2V0U3RhdHVzKGBOZWVkcyBhdHRlbnRpb246ICR7ZGV0YWlsfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUxhdGVzdChraW5kOiBcImRhaWx5XCIgfCBcImFnZW50XCIsIHNlc3Npb246IEJvdFNlc3Npb24sIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxlYWRlcklkID0gc2Vzc2lvbi5sZWFkZXJJZHMuYXQoLTEpITtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNlbGVjdGlvbihbbGVhZGVySWRdKTtcbiAgICBpZiAoIXNlbGVjdGlvbikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zZXNzaW9uRXJyb3Ioc2Vzc2lvbiwgbWVzc2FnZSwgXCJUaGUgbGF0ZXN0IGl0ZW0gaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZS5cIik7XG4gICAgaWYgKCFzZWxlY3Rpb24uaXRlbXMuZXZlcnkoKGl0ZW0pID0+IGlzU3VwcG9ydGVkQ29udGVudChpdGVtLnBheWxvYWQpKSkgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zZXNzaW9uRXJyb3Ioc2Vzc2lvbiwgbWVzc2FnZSwgXCJUaGlzIGl0ZW0gY2Fubm90IGJlIHNhdmVkIGF1dG9tYXRpY2FsbHkuXCIpO1xuICAgIGF3YWl0IHRoaXMuc3RvcmUuc2V0RGVzaWduYXRpb24obGVhZGVySWQsIGtpbmQpO1xuICAgIGNvbnN0IGNsYWltZWQgPSBhd2FpdCB0aGlzLnN0b3JlLmNsYWltTGVhZGVycyhbbGVhZGVySWRdLCBraW5kKTtcbiAgICBpZiAoIWNsYWltZWQpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2Vzc2lvbkVycm9yKHNlc3Npb24sIG1lc3NhZ2UsIFwiVGhlIGxhdGVzdCBpdGVtIGlzIG5vIGxvbmdlciBhdmFpbGFibGUuXCIpO1xuICAgIGNvbnN0IGlkcyA9IGNsYWltZWQubWFwKChpdGVtKSA9PiBpdGVtLmlkKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5hcHBlbmQoa2luZCwgY2xhaW1lZCk7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLmZpbmlzaChpZHMpO1xuICAgICAgYXdhaXQgdGhpcy5yZW1vdmVMYXRlc3Qoc2Vzc2lvbiwgbWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgY29uc3QgZGV0YWlsID0gU3RyaW5nKGVycm9yPy5tZXNzYWdlID8/IGVycm9yKTtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcmUucmVsZWFzZShpZHMsIGRldGFpbCk7XG4gICAgICBhd2FpdCB0aGlzLnNlc3Npb25FcnJvcihzZXNzaW9uLCBtZXNzYWdlLCBgTGF0ZXN0IGl0ZW0gbm90IHNhdmVkOiAke2RldGFpbH1gKTtcbiAgICAgIGF3YWl0IHRoaXMuc2V0U3RhdHVzKGBOZWVkcyBhdHRlbnRpb246ICR7ZGV0YWlsfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbWFnZXMgZ28gdG8gYSBub3RlLWZyZWUgSW50YWtlIGZvbGRlciBmb3IgYSBjaGF0IHRvIHNvcnQ7IG5vdGhpbmcgaXMgd3JpdHRlbiB0byBhbnkgbm90ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBzdGFzaExhdGVzdChzZXNzaW9uOiBCb3RTZXNzaW9uLCBtZXNzYWdlOiBUZWxlZ3JhbU1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsZWFkZXJJZCA9IHNlc3Npb24ubGVhZGVySWRzLmF0KC0xKSE7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gYXdhaXQgdGhpcy5zdG9yZS5zZWxlY3Rpb24oW2xlYWRlcklkXSk7XG4gICAgaWYgKCFzZWxlY3Rpb24pIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2Vzc2lvbkVycm9yKHNlc3Npb24sIG1lc3NhZ2UsIFwiVGhlIGxhdGVzdCBpdGVtIGlzIG5vIGxvbmdlciBhdmFpbGFibGUuXCIpO1xuICAgIGlmICghc2VsZWN0aW9uLml0ZW1zLmV2ZXJ5KChpdGVtKSA9PiBpc0ltYWdlKGl0ZW0ucGF5bG9hZCkpKSByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnNlc3Npb25FcnJvcihzZXNzaW9uLCBtZXNzYWdlLCBcIk9ubHkgaW1hZ2VzIGNhbiBiZSBzdGFzaGVkIGluIEludGFrZS5cIik7XG4gICAgY29uc3QgY2xhaW1lZCA9IGF3YWl0IHRoaXMuc3RvcmUuY2xhaW1MZWFkZXJzKFtsZWFkZXJJZF0sIFwic3Rhc2hcIik7XG4gICAgaWYgKCFjbGFpbWVkKSByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnNlc3Npb25FcnJvcihzZXNzaW9uLCBtZXNzYWdlLCBcIlRoZSBsYXRlc3QgaXRlbSBpcyBubyBsb25nZXIgYXZhaWxhYmxlLlwiKTtcbiAgICBjb25zdCBpZHMgPSBjbGFpbWVkLm1hcCgoaXRlbSkgPT4gaXRlbS5pZCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZG93bmxvYWRNZWRpYShjbGFpbWVkLCB0cnVlKTtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcmUuZmluaXNoKGlkcyk7XG4gICAgICBjb25zdCBjYXB0aW9uID0gY2xhaW1lZC5zb21lKChpdGVtKSA9PiBpdGVtLnBheWxvYWQuY2FwdGlvbikgPyBcIiBUaGUgY2FwdGlvbiB3YXMgbm90IGtlcHQuXCIgOiBcIlwiO1xuICAgICAgYXdhaXQgdGhpcy5yZW1vdmVMYXRlc3Qoc2Vzc2lvbiwgbWVzc2FnZSwgYFN0YXNoZWQgJHtpZHMubGVuZ3RofSBpbWFnZSR7aWRzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn0gaW4gJHtTVEFTSF9GT0xERVJ9LiR7Y2FwdGlvbn1gKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBTdHJpbmcoZXJyb3I/Lm1lc3NhZ2UgPz8gZXJyb3IpO1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5yZWxlYXNlKGlkcywgZGV0YWlsKTtcbiAgICAgIGF3YWl0IHRoaXMuc2Vzc2lvbkVycm9yKHNlc3Npb24sIG1lc3NhZ2UsIGBMYXRlc3QgaXRlbSBub3Qgc3Rhc2hlZDogJHtkZXRhaWx9YCk7XG4gICAgICBhd2FpdCB0aGlzLnNldFN0YXR1cyhgTmVlZHMgYXR0ZW50aW9uOiAke2RldGFpbH1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRpc2NhcmRMYXRlc3Qoc2Vzc2lvbjogQm90U2Vzc2lvbiwgbWVzc2FnZTogVGVsZWdyYW1NZXNzYWdlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2xhaW1lZCA9IGF3YWl0IHRoaXMuc3RvcmUuY2xhaW1MZWFkZXJzKFtzZXNzaW9uLmxlYWRlcklkcy5hdCgtMSkhXSwgXCJkaXNjYXJkXCIpO1xuICAgIGlmICghY2xhaW1lZCkgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zZXNzaW9uRXJyb3Ioc2Vzc2lvbiwgbWVzc2FnZSwgXCJUaGUgbGF0ZXN0IGl0ZW0gaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZS5cIik7XG4gICAgY29uc3QgaWRzID0gY2xhaW1lZC5tYXAoKGl0ZW0pID0+IGl0ZW0uaWQpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLmRpc2NhcmQoaWRzKTtcbiAgICAgIGF3YWl0IHRoaXMucmVtb3ZlTGF0ZXN0KHNlc3Npb24sIG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IFN0cmluZyhlcnJvcj8ubWVzc2FnZSA/PyBlcnJvcik7XG4gICAgICBhd2FpdCB0aGlzLnN0b3JlLnJlbGVhc2UoaWRzLCBkZXRhaWwpO1xuICAgICAgYXdhaXQgdGhpcy5zZXNzaW9uRXJyb3Ioc2Vzc2lvbiwgbWVzc2FnZSwgYExhdGVzdCBpdGVtIG5vdCBkaXNjYXJkZWQ6ICR7ZGV0YWlsfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVtb3ZlTGF0ZXN0KHNlc3Npb246IEJvdFNlc3Npb24sIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSwgbm90aWNlPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbGVhZGVySWRzID0gc2Vzc2lvbi5sZWFkZXJJZHMuc2xpY2UoMCwgLTEpO1xuICAgIGlmICghbGVhZGVySWRzLmxlbmd0aCkge1xuICAgICAgYXdhaXQgdGhpcy5zdG9yZS5jbGVhclNlc3Npb24oKTtcbiAgICAgIGF3YWl0IHRoaXMuZWRpdFF1ZXVlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCBzZXNzaW9uLnBhZ2UsIG5vdGljZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNhdmVkID0gYXdhaXQgdGhpcy5zdG9yZS5zYXZlU2Vzc2lvbih7IC4uLnNlc3Npb24sIG1vZGU6IFwiYnVuZGxlXCIsIGxlYWRlcklkcywgb3JkaW5hbExlYWRlcklkczogW10gfSk7XG4gICAgYXdhaXQgdGhpcy5zaG93U2Vzc2lvbihzYXZlZCwgbm90aWNlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdG9nZ2xlTGF0ZXN0KHNlc3Npb246IEJvdFNlc3Npb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsZWFkZXJJZCA9IHNlc3Npb24ubGVhZGVySWRzLmF0KC0xKSE7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gYXdhaXQgdGhpcy5zdG9yZS5zZWxlY3Rpb24oW2xlYWRlcklkXSk7XG4gICAgaWYgKCFzZWxlY3Rpb24pIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2Vzc2lvbiwgXCJUaGUgbGF0ZXN0IGl0ZW0gaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZS5cIik7XG4gICAgYXdhaXQgdGhpcy5zdG9yZS5zZXREZXNpZ25hdGlvbihsZWFkZXJJZCwgc2VsZWN0aW9uLml0ZW1zWzBdLmRlc2lnbmF0aW9uID09PSBcImFnZW50XCIgPyBcImRhaWx5XCIgOiBcImFnZW50XCIpO1xuICAgIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oYXdhaXQgdGhpcy5zdG9yZS5zZXNzaW9uKCkgPz8gc2Vzc2lvbik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxhdGVyQnVuZGxlKHNlc3Npb246IEJvdFNlc3Npb24sIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc3RvcmUuY2xlYXJTZXNzaW9uKCk7XG4gICAgYXdhaXQgdGhpcy5lZGl0UXVldWUobWVzc2FnZS5jaGF0LmlkLCBtZXNzYWdlLm1lc3NhZ2VfaWQsIHNlc3Npb24ucGFnZSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHN0YWxlQ29udHJvbChtZXNzYWdlOiBUZWxlZ3JhbU1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnRlbGVncmFtLmVkaXRNZXNzYWdlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCBcIlRoaXMgYnVuZGxlIGNvbnRyb2wgaXMgbm8gbG9uZ2VyIGN1cnJlbnQuIFVzZSAvcXVldWUgdG8gcmVzdW1lIHRoZSBsYXRlc3QgYnVuZGxlLlwiLCB7IGlubGluZV9rZXlib2FyZDogW10gfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFwcGVuZChraW5kOiBFeGNsdWRlPEludGFrZUtpbmQsIFwibGF0ZXJcIiB8IFwiZGlzY2FyZFwiPiwgaXRlbXM6IFF1ZXVlSXRlbVtdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYXBpOiBhbnkgPSAodGhpcy5hcHAgYXMgYW55KS5wbHVnaW5zPy5nZXRQbHVnaW4oXCJqb3VybmFsc1wiKT8uYXBpO1xuICAgIGlmICghYXBpIHx8IGFwaS5hcGlWZXJzaW9uICE9PSAxIHx8IHR5cGVvZiBhcGkuZW5zdXJlTm90ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJKb3VybmFscyBwdWJsaWMgQVBJIHYxIGlzIHVuYXZhaWxhYmxlLlwiKTtcbiAgICBjb25zdCBkYXRlID0gaW50YWtlRGF0ZShNYXRoLm1pbiguLi5pdGVtcy5tYXAoKGl0ZW0pID0+IGl0ZW0ucGF5bG9hZC5kYXRlKSkgKiAxMDAwKTtcbiAgICBjb25zdCBub3RlID0gYXdhaXQgYXBpLmVuc3VyZU5vdGUodGhpcy5zZXR0aW5ncy5qb3VybmFsLCBkYXRlLCB7IHNraXBDb25maXJtYXRpb246IHRydWUsIHVuYXR0ZW5kZWQ6IHRydWUgfSk7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChub3RlPy5ub3RlPy5wYXRoKTtcbiAgICBpZiAoIWZpbGUgfHwgIShcInBhdGhcIiBpbiBmaWxlKSkgdGhyb3cgbmV3IEVycm9yKFwiSm91cm5hbHMgZGlkIG5vdCByZXR1cm4gYSB3cml0YWJsZSBkYWlseSBub3RlLlwiKTtcbiAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHRoaXMuZG93bmxvYWRNZWRpYShpdGVtcyk7XG4gICAgY29uc3QgbWFya2VyID0gYDwhLS0gZGFpbHktaW50YWtlOiR7aXRlbXMubWFwKChpdGVtKSA9PiBpdGVtLmlkKS5qb2luKFwiLFwiKX0gLS0+YDtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5yZW5kZXIoa2luZCwgaXRlbXMsIG1lZGlhKTtcbiAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5wcm9jZXNzKGZpbGUgYXMgYW55LCAoc291cmNlKSA9PiBzb3VyY2UuaW5jbHVkZXMobWFya2VyKSA/IHNvdXJjZSA6IGluc2VydEludGFrZUJsb2NrKHNvdXJjZSwgbWFya2VyLCBib2R5KSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFwcGVuZE1peGVkKGxlYWRlcklkczogbnVtYmVyW10sIGl0ZW1zOiBRdWV1ZUl0ZW1bXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFwaTogYW55ID0gKHRoaXMuYXBwIGFzIGFueSkucGx1Z2lucz8uZ2V0UGx1Z2luKFwiam91cm5hbHNcIik/LmFwaTtcbiAgICBpZiAoIWFwaSB8fCBhcGkuYXBpVmVyc2lvbiAhPT0gMSB8fCB0eXBlb2YgYXBpLmVuc3VyZU5vdGUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiSm91cm5hbHMgcHVibGljIEFQSSB2MSBpcyB1bmF2YWlsYWJsZS5cIik7XG4gICAgY29uc3QgZGF0ZSA9IGludGFrZURhdGUoTWF0aC5taW4oLi4uaXRlbXMubWFwKChpdGVtKSA9PiBpdGVtLnBheWxvYWQuZGF0ZSkpICogMTAwMCk7XG4gICAgY29uc3Qgbm90ZSA9IGF3YWl0IGFwaS5lbnN1cmVOb3RlKHRoaXMuc2V0dGluZ3Muam91cm5hbCwgZGF0ZSwgeyBza2lwQ29uZmlybWF0aW9uOiB0cnVlLCB1bmF0dGVuZGVkOiB0cnVlIH0pO1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgobm90ZT8ubm90ZT8ucGF0aCk7XG4gICAgaWYgKCFmaWxlIHx8ICEoXCJwYXRoXCIgaW4gZmlsZSkpIHRocm93IG5ldyBFcnJvcihcIkpvdXJuYWxzIGRpZCBub3QgcmV0dXJuIGEgd3JpdGFibGUgZGFpbHkgbm90ZS5cIik7XG4gICAgY29uc3QgbWVkaWEgPSBhd2FpdCB0aGlzLmRvd25sb2FkTWVkaWEoaXRlbXMpO1xuICAgIGNvbnN0IG1hcmtlciA9IGA8IS0tIGRhaWx5LWludGFrZToke2l0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5pZCkuam9pbihcIixcIil9IC0tPmA7XG4gICAgY29uc3QgYm9keSA9IHRoaXMucmVuZGVyTWl4ZWQobGVhZGVySWRzLCBpdGVtcywgbWVkaWEpO1xuICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LnByb2Nlc3MoZmlsZSBhcyBhbnksIChzb3VyY2UpID0+IHNvdXJjZS5pbmNsdWRlcyhtYXJrZXIpID8gc291cmNlIDogaW5zZXJ0SW50YWtlQmxvY2soc291cmNlLCBtYXJrZXIsIGJvZHkpKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZG93bmxvYWRNZWRpYShpdGVtczogUXVldWVJdGVtW10sIHN0YXNoID0gZmFsc2UpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgZW1iZWRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgY29uc3QgbWVkaWEgPSBzZWxlY3RhYmxlTWVkaWEoaXRlbS5wYXlsb2FkKTtcbiAgICAgIGlmICghbWVkaWEpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcmVtb3RlID0gYXdhaXQgdGhpcy50ZWxlZ3JhbS5maWxlKG1lZGlhLmZpbGVfaWQpO1xuICAgICAgY29uc3QgZXh0ID0gZXh0ZW5zaW9uKG1lZGlhLCByZW1vdGUuZmlsZV9wYXRoKTtcbiAgICAgIGNvbnN0IGRhdGUgPSBpbnRha2VEYXRlKGl0ZW0ucGF5bG9hZC5kYXRlICogMTAwMCk7XG4gICAgICBjb25zdCByb290ID0gdGhpcy5zZXR0aW5ncy5hdHRhY2htZW50Um9vdC5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCBcIlwiKTtcbiAgICAgIGF3YWl0IGVuc3VyZUZvbGRlcih0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGFzIGFueSwgc3Rhc2ggPyBTVEFTSF9GT0xERVIgOiBgJHtyb290fS8ke2RhdGV9YCk7XG4gICAgICBjb25zdCBpZGVudGl0eSA9IG1lZGlhLmZpbGVfdW5pcXVlX2lkIHx8IG1lZGlhLmZpbGVfaWQ7XG4gICAgICBjb25zdCBwYXRoID0gc3Rhc2hcbiAgICAgICAgPyBhd2FpdCB0aGlzLnN0b3JlLnJlc2VydmVBdHRhY2htZW50KGBzdGFzaDoke2lkZW50aXR5fWAsIHN0YXNoUGF0aChTVEFTSF9GT0xERVIsIGl0ZW0ucGF5bG9hZC5kYXRlICogMTAwMCwgZW1iZWRzLmxlbmd0aCArIDEsIGV4dCkpXG4gICAgICAgIDogYXdhaXQgdGhpcy5zdG9yZS5yZXNlcnZlQXR0YWNobWVudChpZGVudGl0eSwgYXR0YWNobWVudFBhdGgocm9vdCwgZGF0ZSwgaWRlbnRpdHksIGV4dCwgaXNEaXJlY3RWb2ljZU1lc3NhZ2UoaXRlbS5wYXlsb2FkKSkpO1xuICAgICAgaWYgKCEoYXdhaXQgKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgYXMgYW55KS5leGlzdHMocGF0aCkpKSB7XG4gICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgdGhpcy50ZWxlZ3JhbS5kb3dubG9hZChyZW1vdGUuZmlsZV9wYXRoKSk7XG4gICAgICAgIGF3YWl0ICh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGFzIGFueSkud3JpdGVCaW5hcnkocGF0aCwgYnl0ZXMpO1xuICAgICAgfVxuICAgICAgZW1iZWRzLnB1c2goZW1iZWQocGF0aCwgaXRlbS5wYXlsb2FkKSk7XG4gICAgfVxuICAgIHJldHVybiBlbWJlZHM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlcihraW5kOiBFeGNsdWRlPEludGFrZUtpbmQsIFwibGF0ZXJcIiB8IFwiZGlzY2FyZFwiPiwgaXRlbXM6IFF1ZXVlSXRlbVtdLCBlbWJlZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBjb25zdCBtZXNzYWdlcyA9IGl0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5wYXlsb2FkKTtcbiAgICBjb25zdCB0aW1lID0gbG9jYWxUaW1lKE1hdGgubWluKC4uLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSkgPT4gbWVzc2FnZS5kYXRlKSkgKiAxMDAwKTtcbiAgICBjb25zdCBsaW5lcyA9IFtraW5kID09PSBcImFnZW50XCIgPyBgPiBbIWFnZW50LWluYm94XSBBZ2VudCBpbmJveCBcdTAwQjcgJHt0aW1lfSAjdXNlci9pbmJveGAgOiBgPiBbIWRhaWx5LWludGFrZV0gSW50YWtlIFx1MDBCNyAke3RpbWV9YF07XG4gICAgbGV0IG1lZGlhSW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgcHJvc2UgPSBtZXNzYWdlLnRleHQgPz8gbWVzc2FnZS5jYXB0aW9uO1xuICAgICAgaWYgKHByb3NlKSBsaW5lcy5wdXNoKGNhbGxvdXRMaW5lcyhwcm9zZSkpO1xuICAgICAgaWYgKHNlbGVjdGFibGVNZWRpYShtZXNzYWdlKSkgbGluZXMucHVzaChgPiAke2VtYmVkc1ttZWRpYUluZGV4KytdfWApO1xuICAgIH1cbiAgICByZXR1cm4gbGluZXMuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyTWl4ZWQobGVhZGVySWRzOiBudW1iZXJbXSwgaXRlbXM6IFF1ZXVlSXRlbVtdLCBlbWJlZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBjb25zdCBtZWRpYSA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KCk7XG4gICAgbGV0IG1lZGlhSW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykgaWYgKHNlbGVjdGFibGVNZWRpYShpdGVtLnBheWxvYWQpKSBtZWRpYS5zZXQoaXRlbS5pZCwgZW1iZWRzW21lZGlhSW5kZXgrK10pO1xuICAgIGNvbnN0IGxpbmVzID0gW1wiPiBbIWRhaWx5LWludGFrZV0gSW50YWtlIGJ1bmRsZVwiXTtcbiAgICBmb3IgKGNvbnN0IGxlYWRlcklkIG9mIGxlYWRlcklkcykge1xuICAgICAgY29uc3QgbGVhZGVyID0gaXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gbGVhZGVySWQpITtcbiAgICAgIGNvbnN0IGdyb3VwID0gbGVhZGVyLm1lZGlhR3JvdXBJZCA/IGl0ZW1zLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5tZWRpYUdyb3VwSWQgPT09IGxlYWRlci5tZWRpYUdyb3VwSWQpIDogW2xlYWRlcl07XG4gICAgICBsaW5lcy5wdXNoKFwiPlwiKTtcbiAgICAgIGlmIChsZWFkZXIuZGVzaWduYXRpb24gPT09IFwiYWdlbnRcIikge1xuICAgICAgICBsaW5lcy5wdXNoKFwiPiA+IFshYWdlbnQtaW5ib3hdIEFnZW50IGluYm94ICN1c2VyL2luYm94XCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZ3JvdXApIHtcbiAgICAgICAgICBjb25zdCBwcm9zZSA9IGl0ZW0ucGF5bG9hZC50ZXh0ID8/IGl0ZW0ucGF5bG9hZC5jYXB0aW9uO1xuICAgICAgICAgIGlmIChwcm9zZSkgbGluZXMucHVzaCguLi5uZXN0ZWRDYWxsb3V0TGluZXMocHJvc2UpKTtcbiAgICAgICAgICBpZiAobWVkaWEuaGFzKGl0ZW0uaWQpKSBsaW5lcy5wdXNoKGA+ID4gJHttZWRpYS5nZXQoaXRlbS5pZCl9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBncm91cCkge1xuICAgICAgICAgIGNvbnN0IHByb3NlID0gaXRlbS5wYXlsb2FkLnRleHQgPz8gaXRlbS5wYXlsb2FkLmNhcHRpb247XG4gICAgICAgICAgaWYgKHByb3NlKSBsaW5lcy5wdXNoKGNhbGxvdXRMaW5lcyhwcm9zZSkpO1xuICAgICAgICAgIGlmIChtZWRpYS5oYXMoaXRlbS5pZCkpIGxpbmVzLnB1c2goYD4gJHttZWRpYS5nZXQoaXRlbS5pZCl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBwcml2YXRlIGRlc2NyaWJlKGl0ZW1zOiBRdWV1ZUl0ZW1bXSk6IHN0cmluZyB7XG4gICAgY29uc3QgdGV4dCA9IGl0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5wYXlsb2FkLnRleHQgPz8gaXRlbS5wYXlsb2FkLmNhcHRpb24gPz8gbWVkaWFMYWJlbChpdGVtLnBheWxvYWQpID8/IFwiVW5zdXBwb3J0ZWQgY29udGVudFwiKS5qb2luKFwiXFxuXCIpO1xuICAgIHJldHVybiBgRGFpbHkgSW50YWtlICgke2l0ZW1zLmxlbmd0aH0gaXRlbSR7aXRlbXMubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wifSlcXG4ke3RleHQuc2xpY2UoMCwgMjUwKX1gO1xuICB9XG4gIHByaXZhdGUgYXN5bmMgc2VuZFF1ZXVlKGNoYXRJZDogbnVtYmVyLCBwYWdlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgdGhpcy5zdG9yZS5zZXNzaW9uKCk7XG4gICAgY29uc3QgdmlldyA9IGF3YWl0IHRoaXMucXVldWVWaWV3KHBhZ2UsIHNlc3Npb24pO1xuICAgIGNvbnN0IHNlbnQgPSBhd2FpdCB0aGlzLnRlbGVncmFtLnNlbmRNZXNzYWdlKGNoYXRJZCwgdmlldy50ZXh0LCB7IGlubGluZV9rZXlib2FyZDogdmlldy5yb3dzIH0pO1xuICAgIGlmIChzZXNzaW9uKSBhd2FpdCB0aGlzLnN0b3JlLnNhdmVTZXNzaW9uKHsgLi4uc2Vzc2lvbiwgbWVudUNoYXRJZDogY2hhdElkLCBtZW51TWVzc2FnZUlkOiBzZW50Lm1lc3NhZ2VfaWQsIHBhZ2U6IHZpZXcucGFnZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZWRpdFF1ZXVlKGNoYXRJZDogbnVtYmVyLCBtZXNzYWdlSWQ6IG51bWJlciwgcGFnZTogbnVtYmVyLCB3YXJuaW5nPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHRoaXMuc3RvcmUuc2Vzc2lvbigpO1xuICAgIGNvbnN0IHZpZXcgPSBhd2FpdCB0aGlzLnF1ZXVlVmlldyhwYWdlLCBzZXNzaW9uLCB3YXJuaW5nKTtcbiAgICBhd2FpdCB0aGlzLnRlbGVncmFtLmVkaXRNZXNzYWdlKGNoYXRJZCwgbWVzc2FnZUlkLCB2aWV3LnRleHQsIHsgaW5saW5lX2tleWJvYXJkOiB2aWV3LnJvd3MgfSk7XG4gICAgaWYgKHNlc3Npb24pIGF3YWl0IHRoaXMuc3RvcmUuc2F2ZVNlc3Npb24oeyAuLi5zZXNzaW9uLCBtZW51Q2hhdElkOiBjaGF0SWQsIG1lbnVNZXNzYWdlSWQ6IG1lc3NhZ2VJZCwgcGFnZTogdmlldy5wYWdlIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBxdWV1ZVZpZXcocGFnZTogbnVtYmVyLCBzZXNzaW9uOiBCb3RTZXNzaW9uIHwgbnVsbCwgd2FybmluZz86IHN0cmluZyk6IFByb21pc2U8eyB0ZXh0OiBzdHJpbmc7IHJvd3M6IEJ1dHRvbltdW107IHBhZ2U6IG51bWJlciB9PiB7XG4gICAgY29uc3Qgc2l6ZSA9IDY7XG4gICAgY29uc3QgZmlyc3QgPSBhd2FpdCB0aGlzLnN0b3JlLmxvZ2ljYWxQYWdlKE1hdGgubWF4KDAsIHBhZ2UpLCBzaXplKTtcbiAgICBjb25zdCBwYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChmaXJzdC50b3RhbCAvIHNpemUpKTtcbiAgICBjb25zdCBjdXJyZW50ID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgcGFnZSksIHBhZ2VzIC0gMSk7XG4gICAgY29uc3QgcXVldWUgPSBjdXJyZW50ID09PSBwYWdlID8gZmlyc3QgOiBhd2FpdCB0aGlzLnN0b3JlLmxvZ2ljYWxQYWdlKGN1cnJlbnQsIHNpemUpO1xuICAgIGNvbnN0IGVudHJpZXMgPSBhd2FpdCBQcm9taXNlLmFsbChxdWV1ZS5pdGVtcy5tYXAoYXN5bmMgKGxlYWRlcikgPT4gKHsgbGVhZGVyLCBncm91cDogYXdhaXQgdGhpcy5zdG9yZS5ncm91cChsZWFkZXIpIH0pKSk7XG4gICAgY29uc3QgZGVzY3JpcHRpb25zID0gZW50cmllcy5tYXAoKHsgZ3JvdXAgfSwgaW5kZXgpID0+IGBcdTIwMjIgJHtjdXJyZW50ICogc2l6ZSArIGluZGV4ICsgMX0uICR7bG9naWNhbExhYmVsKGdyb3VwKX0gXHUwMEI3ICR7bG9jYWxUaW1lKE1hdGgubWluKC4uLmdyb3VwLm1hcCgoaXRlbSkgPT4gaXRlbS5wYXlsb2FkLmRhdGUpKSAqIDEwMDApfVxcbiAgJHtsb2dpY2FsU3VtbWFyeShncm91cCl9YCk7XG4gICAgY29uc3QgaW5kaWNhdG9yID0gc2Vzc2lvbiA/IGBCdW5kbGUgc2Vzc2lvbiBhY3RpdmU6ICR7c2Vzc2lvbi5sZWFkZXJJZHMubGVuZ3RofSBzZWxlY3RlZCAoJHtzZXNzaW9uTW9kZUxhYmVsKHNlc3Npb24ubW9kZSl9KS5cXG5cXG5gIDogXCJcIjtcbiAgICBpZiAoIXNlc3Npb24gJiYgcXVldWUudG90YWwgPT09IDApIHJldHVybiB7IHRleHQ6IGAke3dhcm5pbmcgPyBgJHt3YXJuaW5nfVxcblxcbmAgOiBcIlwifUFsbCBjYXVnaHQgdXAgXHUyMDE0IHRoZSBpbnRha2UgcXVldWUgaXMgZW1wdHkuYCwgcm93czogW10sIHBhZ2U6IDAgfTtcbiAgICBjb25zdCB0ZXh0ID0gYCR7d2FybmluZyA/IGAke3dhcm5pbmd9XFxuXFxuYCA6IFwiXCJ9JHtpbmRpY2F0b3J9JHtkZXNjcmlwdGlvbnMuam9pbihcIlxcblwiKSB8fCBcIlRoZSBpbnRha2UgcXVldWUgaXMgZW1wdHkuXCJ9XFxuXFxuUGFnZSAke2N1cnJlbnQgKyAxfS8ke3BhZ2VzfWA7XG4gICAgY29uc3Qgcm93czogQnV0dG9uW11bXSA9IHNlc3Npb25cbiAgICAgID8gW1tidXR0b24oXCJSZXN1bWUgYnVuZGxlXCIsIFwiZGk6YjpyXCIpLCBidXR0b24oXCJFeGl0IGJ1bmRsZVwiLCBcImRpOmI6Y1wiKV1dXG4gICAgICA6IGVudHJpZXMubWFwKCh7IGxlYWRlciwgZ3JvdXAgfSwgaW5kZXgpID0+IFtidXR0b24oc2VsZWN0aW9uQnV0dG9uKGN1cnJlbnQgKiBzaXplICsgaW5kZXggKyAxLCBncm91cCksIGBkaTpxOm86JHtsZWFkZXIuaWR9OiR7Y3VycmVudH1gKV0pO1xuICAgIGlmICghc2Vzc2lvbiAmJiBwYWdlcyA+IDEpIHJvd3MucHVzaChbYnV0dG9uKFwiUHJldmlvdXNcIiwgYGRpOnE6cDoke01hdGgubWF4KDAsIGN1cnJlbnQgLSAxKX1gKSwgYnV0dG9uKFwiTmV4dFwiLCBgZGk6cTpwOiR7TWF0aC5taW4ocGFnZXMgLSAxLCBjdXJyZW50ICsgMSl9YCldKTtcbiAgICByZXR1cm4geyB0ZXh0LCByb3dzLCBwYWdlOiBjdXJyZW50IH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG9wZW5EZXRhaWwoaWQ6IG51bWJlciwgbWVzc2FnZTogVGVsZWdyYW1NZXNzYWdlLCBwYWdlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNlbGVjdGlvbihbaWRdKTtcbiAgICBpZiAoIXNlbGVjdGlvbikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5lZGl0UXVldWUobWVzc2FnZS5jaGF0LmlkLCBtZXNzYWdlLm1lc3NhZ2VfaWQsIHBhZ2UpO1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNhdmVTZXNzaW9uKHsgbW9kZTogXCJhd2FpdGluZ19pZHNcIiwgbGVhZGVySWRzOiBzZWxlY3Rpb24ubGVhZGVySWRzLCBvcmRpbmFsTGVhZGVySWRzOiBhd2FpdCB0aGlzLm9yZGluYWxTbmFwc2hvdChzZWxlY3Rpb24ubGVhZGVySWRzKSwgbWVudUNoYXRJZDogbWVzc2FnZS5jaGF0LmlkLCBtZW51TWVzc2FnZUlkOiBtZXNzYWdlLm1lc3NhZ2VfaWQsIHBhZ2UsIGFmdGVySWQ6IDAgfSk7XG4gICAgYXdhaXQgdGhpcy5zdG9yZS5zZXRQcm9tcHQoc2VsZWN0aW9uLml0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5pZCksIG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkKTtcbiAgICBhd2FpdCB0aGlzLnNob3dTZXNzaW9uKHNlc3Npb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzaG93U2Vzc2lvbihzZXNzaW9uOiBCb3RTZXNzaW9uLCB3YXJuaW5nPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gYXdhaXQgdGhpcy5zdG9yZS5zZWxlY3Rpb24oc2Vzc2lvbi5sZWFkZXJJZHMpO1xuICAgIGNvbnN0IHByZWZpeCA9IHdhcm5pbmcgPyBgJHt3YXJuaW5nfVxcblxcbmAgOiBcIlwiO1xuICAgIGlmICghc2VsZWN0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLnRlbGVncmFtLmVkaXRNZXNzYWdlKHNlc3Npb24ubWVudUNoYXRJZCwgc2Vzc2lvbi5tZW51TWVzc2FnZUlkLCBgJHtwcmVmaXh9T25lIG9yIG1vcmUgc2VsZWN0ZWQgaXRlbXMgYXJlIG5vIGxvbmdlciBhdmFpbGFibGUuYCwgeyBpbmxpbmVfa2V5Ym9hcmQ6IFtbYnV0dG9uKFwiRXhpdCBidW5kbGVcIiwgXCJkaTpiOmNcIildXSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rpb24uaXRlbXMuZXZlcnkoKGl0ZW0pID0+IGlzU3VwcG9ydGVkQ29udGVudChpdGVtLnBheWxvYWQpKSkge1xuICAgICAgYXdhaXQgdGhpcy50ZWxlZ3JhbS5lZGl0TWVzc2FnZShzZXNzaW9uLm1lbnVDaGF0SWQsIHNlc3Npb24ubWVudU1lc3NhZ2VJZCwgYCR7cHJlZml4fVNlbGVjdGVkIGl0ZW1cXG5cXG4ke2xvZ2ljYWxEZXNjcmlwdGlvbihzZWxlY3Rpb24uaXRlbXMsIHNlbGVjdGlvbi5pdGVtc1swXS5kZXNpZ25hdGlvbil9XFxuXFxuVGhpcyBpdGVtIGNhbm5vdCBiZSBzYXZlZCBhdXRvbWF0aWNhbGx5LmAsIHsgaW5saW5lX2tleWJvYXJkOiBzZWxlY3RlZFVuc3VwcG9ydGVkUm93cygpIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2Vzc2lvbi5tb2RlID09PSBcImF3YWl0aW5nX2lkc1wiKSB7XG4gICAgICBhd2FpdCB0aGlzLnNob3dPcmRpbmFsU2VsZWN0aW9uKHNlc3Npb24sIHByZWZpeCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzZXNzaW9uLm1vZGUgPT09IFwic3RhbmRhbG9uZVwiKSB7XG4gICAgICBjb25zdCBsYXRlc3QgPSBsYXRlc3RHcm91cChzZWxlY3Rpb24ubGVhZGVySWRzLCBzZWxlY3Rpb24uaXRlbXMpO1xuICAgICAgYXdhaXQgdGhpcy50ZWxlZ3JhbS5lZGl0TWVzc2FnZShzZXNzaW9uLm1lbnVDaGF0SWQsIHNlc3Npb24ubWVudU1lc3NhZ2VJZCwgYCR7cHJlZml4fVNhdmUgbGF0ZXN0IHN0YW5kYWxvbmVcXG5cXG4ke2xvZ2ljYWxEZXNjcmlwdGlvbihsYXRlc3QsIGxhdGVzdFswXS5kZXNpZ25hdGlvbil9YCwgeyBpbmxpbmVfa2V5Ym9hcmQ6IHN0YW5kYWxvbmVSb3dzKGxhdGVzdC5ldmVyeSgoaXRlbSkgPT4gaXNJbWFnZShpdGVtLnBheWxvYWQpKSkgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGxhdGVzdCA9IGxhdGVzdEdyb3VwKHNlbGVjdGlvbi5sZWFkZXJJZHMsIHNlbGVjdGlvbi5pdGVtcyk7XG4gICAgYXdhaXQgdGhpcy50ZWxlZ3JhbS5lZGl0TWVzc2FnZShzZXNzaW9uLm1lbnVDaGF0SWQsIHNlc3Npb24ubWVudU1lc3NhZ2VJZCwgYCR7cHJlZml4fSR7YnVuZGxlRGVzY3JpcHRpb24oc2VsZWN0aW9uLmxlYWRlcklkcywgc2VsZWN0aW9uLml0ZW1zKX1gLCB7IGlubGluZV9rZXlib2FyZDogYnVuZGxlUm93cyhsYXRlc3RbMF0uZGVzaWduYXRpb24sIGxhdGVzdC5ldmVyeSgoaXRlbSkgPT4gaXNJbWFnZShpdGVtLnBheWxvYWQpKSkgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG9yZGluYWxTbmFwc2hvdChzZWxlY3RlZDogbnVtYmVyW10pOiBQcm9taXNlPG51bWJlcltdPiB7XG4gICAgY29uc3QgcGFnZSA9IGF3YWl0IHRoaXMuc3RvcmUubG9naWNhbFBhZ2UoMCwgMzIpO1xuICAgIGNvbnN0IHNuYXBzaG90ID0gWy4uLnNlbGVjdGVkXTtcbiAgICBmb3IgKGNvbnN0IGxlYWRlciBvZiBwYWdlLml0ZW1zKSB7XG4gICAgICBpZiAoc25hcHNob3QuaW5jbHVkZXMobGVhZGVyLmlkKSkgY29udGludWU7XG4gICAgICBjb25zdCBncm91cCA9IGF3YWl0IHRoaXMuc3RvcmUuZ3JvdXAobGVhZGVyKTtcbiAgICAgIGlmIChncm91cC5ldmVyeSgoaXRlbSkgPT4gaXNTdXBwb3J0ZWRDb250ZW50KGl0ZW0ucGF5bG9hZCkpKSBzbmFwc2hvdC5wdXNoKGxlYWRlci5pZCk7XG4gICAgICBpZiAoc25hcHNob3QubGVuZ3RoID49IDI0KSBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHNuYXBzaG90O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzaG93T3JkaW5hbFNlbGVjdGlvbihzZXNzaW9uOiBCb3RTZXNzaW9uLCBwcmVmaXggPSBcIlwiKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGN1cnJlbnQgPSBzZXNzaW9uO1xuICAgIGlmICghY3VycmVudC5vcmRpbmFsTGVhZGVySWRzPy5sZW5ndGgpIGN1cnJlbnQgPSBhd2FpdCB0aGlzLnN0b3JlLnNhdmVTZXNzaW9uKHsgLi4uY3VycmVudCwgb3JkaW5hbExlYWRlcklkczogYXdhaXQgdGhpcy5vcmRpbmFsU25hcHNob3QoY3VycmVudC5sZWFkZXJJZHMpIH0pO1xuICAgIGNvbnN0IGVudHJpZXM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgYXZhaWxhYmxlTGVhZGVySWRzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgZm9yIChjb25zdCBbaW5kZXgsIGxlYWRlcklkXSBvZiAoY3VycmVudC5vcmRpbmFsTGVhZGVySWRzID8/IFtdKS5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGF3YWl0IHRoaXMuc3RvcmUuc2VsZWN0aW9uKFtsZWFkZXJJZF0pO1xuICAgICAgaWYgKCFzZWxlY3Rpb24pIGNvbnRpbnVlO1xuICAgICAgaWYgKCFzZWxlY3Rpb24uaXRlbXMuZXZlcnkoKGl0ZW0pID0+IGlzU3VwcG9ydGVkQ29udGVudChpdGVtLnBheWxvYWQpKSkgY29udGludWU7XG4gICAgICBhdmFpbGFibGVMZWFkZXJJZHMuYWRkKGxlYWRlcklkKTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gY3VycmVudC5sZWFkZXJJZHMuaW5jbHVkZXMobGVhZGVySWQpID8gXCIgXHUyNzEzIHNlbGVjdGVkXCIgOiBcIlwiO1xuICAgICAgY29uc3QgbGFiZWwgPSBzZWxlY3Rpb25CdXR0b24oaW5kZXggKyAxLCBzZWxlY3Rpb24uaXRlbXMpLnJlcGxhY2UoL15cXGQrXFxzLywgXCJcIik7XG4gICAgICBlbnRyaWVzLnB1c2goYCR7aW5kZXggKyAxfS4gJHtsYWJlbH0ke3NlbGVjdGVkfVxcbiAgICR7bG9naWNhbFN1bW1hcnkoc2VsZWN0aW9uLml0ZW1zKS5zbGljZSgwLCA2MCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IGNhbkNvbWJpbmUgPSBbLi4uYXZhaWxhYmxlTGVhZGVySWRzXS5zb21lKChsZWFkZXJJZCkgPT4gIWN1cnJlbnQubGVhZGVySWRzLmluY2x1ZGVzKGxlYWRlcklkKSk7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBhd2FpdCB0aGlzLnN0b3JlLnNlbGVjdGlvbihjdXJyZW50LmxlYWRlcklkcyk7XG4gICAgaWYgKCFzZWxlY3RlZCkgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zaG93U2Vzc2lvbihjdXJyZW50LCBcIlRoZSBzZWxlY3RlZCBpdGVtIGlzIG5vIGxvbmdlciBhdmFpbGFibGUuXCIpO1xuICAgIGNvbnN0IGNhcCA9IChjdXJyZW50Lm9yZGluYWxMZWFkZXJJZHM/Lmxlbmd0aCA/PyAwKSA+PSAyNCA/IFwiXFxuXFxuU2hvd2luZyB0aGUgZmlyc3QgMjQgc2VsZWN0YWJsZSBlbnRyaWVzOyByZXR1cm4gdG8gL3F1ZXVlIHRvIHN0YXJ0IGZyb20gYW5vdGhlciBpdGVtLlwiIDogXCJcIjtcbiAgICBjb25zdCBjb21iaW5lID0gY2FuQ29tYmluZSA/IGBcXG5cXG5Db21iaW5lIHdpdGggYW5vdGhlciBxdWV1ZSBpdGVtXFxuUmVwbHkgd2l0aCBlbnRyeSBudW1iZXJzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgY29tbWFzLiBUaGUgY3VycmVudCBpdGVtIGlzIGFscmVhZHkgc2VsZWN0ZWQuXFxuXFxuJHtlbnRyaWVzLmpvaW4oXCJcXG5cIil9JHtjYXB9YCA6IFwiXCI7XG4gICAgY29uc3QgdGV4dCA9IGAke3ByZWZpeH1TZWxlY3RlZCBpdGVtXFxuXFxuJHtsb2dpY2FsRGVzY3JpcHRpb24oc2VsZWN0ZWQuaXRlbXMsIHNlbGVjdGVkLml0ZW1zWzBdLmRlc2lnbmF0aW9uKX0ke2NvbWJpbmV9YDtcbiAgICBhd2FpdCB0aGlzLnRlbGVncmFtLmVkaXRNZXNzYWdlKGN1cnJlbnQubWVudUNoYXRJZCwgY3VycmVudC5tZW51TWVzc2FnZUlkLCB0ZXh0LCB7IGlubGluZV9rZXlib2FyZDogc2VsZWN0ZWRTdXBwb3J0ZWRSb3dzKCkgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUlkUmVwbHkobWVzc2FnZTogVGVsZWdyYW1NZXNzYWdlLCBzZXNzaW9uOiBCb3RTZXNzaW9uKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGFyc2VkID0gcGFyc2VTZWxlY3Rpb25JZHMobWVzc2FnZS50ZXh0KTtcbiAgICBpZiAoIXBhcnNlZCkgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zaG93U2Vzc2lvbihzZXNzaW9uLCBcIlVzZSBvbmx5IHBvc2l0aXZlIGVudHJ5IG51bWJlcnMgc2VwYXJhdGVkIGJ5IHNwYWNlcyBvciBjb21tYXMuXCIpO1xuICAgIGNvbnN0IG1hcHBlZCA9IHBhcnNlZC5tYXAoKG9yZGluYWwpID0+IChzZXNzaW9uLm9yZGluYWxMZWFkZXJJZHMgPz8gW10pW29yZGluYWwgLSAxXSk7XG4gICAgaWYgKG1hcHBlZC5zb21lKChpZCkgPT4gaWQgPT09IHVuZGVmaW5lZCkpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2Vzc2lvbiwgXCJPbmUgb3IgbW9yZSBlbnRyeSBudW1iZXJzIGFyZSBvdXRzaWRlIHRoZSBkaXNwbGF5ZWQgbGlzdC5cIik7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gYXdhaXQgdGhpcy5zdG9yZS5zZWxlY3Rpb24oWy4uLnNlc3Npb24ubGVhZGVySWRzLCAuLi5tYXBwZWRdKTtcbiAgICBpZiAoIXNlbGVjdGlvbikgcmV0dXJuIHZvaWQgYXdhaXQgdGhpcy5zaG93U2Vzc2lvbihzZXNzaW9uLCBcIk9uZSBvciBtb3JlIHNlbGVjdGVkIGVudHJpZXMgYXJlIHJlc29sdmVkIG9yIGN1cnJlbnRseSBiZWluZyBoYW5kbGVkLlwiKTtcbiAgICBpZiAoIXNlbGVjdGlvbi5pdGVtcy5ldmVyeSgoaXRlbSkgPT4gaXNTdXBwb3J0ZWRDb250ZW50KGl0ZW0ucGF5bG9hZCkpKSByZXR1cm4gdm9pZCBhd2FpdCB0aGlzLnNob3dTZXNzaW9uKHNlc3Npb24sIFwiVW5zdXBwb3J0ZWQgaXRlbXMgY2Fubm90IGJlIGNvbWJpbmVkIGF1dG9tYXRpY2FsbHkuXCIpO1xuICAgIGlmIChzZWxlY3Rpb24ubGVhZGVySWRzLmxlbmd0aCA8IDIpIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2Vzc2lvbiwgXCJDaG9vc2UgYXQgbGVhc3Qgb25lIGRpZmZlcmVudCBsb2dpY2FsIHF1ZXVlIGl0ZW0uXCIpO1xuICAgIGF3YWl0IHRoaXMuc3RvcmUuc2V0UHJvbXB0KHNlbGVjdGlvbi5pdGVtcy5tYXAoKGl0ZW0pID0+IGl0ZW0uaWQpLCBzZXNzaW9uLm1lbnVDaGF0SWQsIHNlc3Npb24ubWVudU1lc3NhZ2VJZCk7XG4gICAgY29uc3Qgc2F2ZWQgPSBhd2FpdCB0aGlzLnN0b3JlLnNhdmVTZXNzaW9uKHsgLi4uc2Vzc2lvbiwgbW9kZTogXCJidW5kbGVcIiwgbGVhZGVySWRzOiBzZWxlY3Rpb24ubGVhZGVySWRzIH0pO1xuICAgIGF3YWl0IHRoaXMuc2hvd1Nlc3Npb24oc2F2ZWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZXN1bWVTZXNzaW9uKG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCB0aGlzLnN0b3JlLnNlc3Npb24oKTtcbiAgICBpZiAoIXNlc3Npb24pIHJldHVybiB2b2lkIGF3YWl0IHRoaXMuZWRpdFF1ZXVlKG1lc3NhZ2UuY2hhdC5pZCwgbWVzc2FnZS5tZXNzYWdlX2lkLCAwKTtcbiAgICBjb25zdCBzYXZlZCA9IGF3YWl0IHRoaXMuc3RvcmUuc2F2ZVNlc3Npb24oeyAuLi5zZXNzaW9uLCBtZW51Q2hhdElkOiBtZXNzYWdlLmNoYXQuaWQsIG1lbnVNZXNzYWdlSWQ6IG1lc3NhZ2UubWVzc2FnZV9pZCB9KTtcbiAgICBhd2FpdCB0aGlzLnNob3dTZXNzaW9uKHNhdmVkKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FuY2VsU2Vzc2lvbihtZXNzYWdlPzogVGVsZWdyYW1NZXNzYWdlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHRoaXMuc3RvcmUuc2Vzc2lvbigpO1xuICAgIGlmICghc2Vzc2lvbikgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuc3RvcmUuY2xlYXJTZXNzaW9uKCk7XG4gICAgYXdhaXQgdGhpcy5lZGl0UXVldWUobWVzc2FnZT8uY2hhdC5pZCA/PyBzZXNzaW9uLm1lbnVDaGF0SWQsIG1lc3NhZ2U/Lm1lc3NhZ2VfaWQgPz8gc2Vzc2lvbi5tZW51TWVzc2FnZUlkLCBzZXNzaW9uLnBhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXNzaW9uRXJyb3Ioc2Vzc2lvbjogQm90U2Vzc2lvbiB8IG51bGwsIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSwgZGV0YWlsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoc2Vzc2lvbikgYXdhaXQgdGhpcy5zaG93U2Vzc2lvbihzZXNzaW9uLCBkZXRhaWwpO1xuICAgIGVsc2UgYXdhaXQgdGhpcy5lZGl0UXVldWUobWVzc2FnZS5jaGF0LmlkLCBtZXNzYWdlLm1lc3NhZ2VfaWQsIDAsIGRldGFpbCk7XG4gIH1cbiAgcHJpdmF0ZSBhc3luYyBzaG93UXVldWUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN0b3JlKSByZXR1cm4gdm9pZCBuZXcgTm90aWNlKHRoaXMuc2V0dGluZ3Muc3RhdHVzKTtcbiAgICBjb25zdCBxdWV1ZSA9IGF3YWl0IHRoaXMuc3RvcmUubG9naWNhbFBhZ2UoMCk7XG4gICAgbmV3IE5vdGljZShxdWV1ZS5pdGVtcy5sZW5ndGggPyBgJHtxdWV1ZS50b3RhbH0gaW50YWtlIGl0ZW0ocykgd2FpdGluZy5gIDogXCJEYWlseSBJbnRha2UgcXVldWUgaXMgZW1wdHkuXCIpO1xuICB9XG4gIHByaXZhdGUgYXN5bmMgc2V0U3RhdHVzKHN0YXR1czogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7IHRoaXMuc2V0dGluZ3Muc3RhdHVzID0gc3RhdHVzOyB9XG4gIHByaXZhdGUgbG9hZFByaXZhdGVTdGF0ZShwbHVnaW5EaXI6IHN0cmluZykgeyByZXR1cm4gTG9jYWxTdGF0ZS5sb2FkKHRoaXMuYXBwLCBwbHVnaW5EaXIsICgpID0+IHRoaXMubG9hZERhdGEoKSk7IH1cbiAgcHJpdmF0ZSBxdWV1ZVN0b3JlKHN0YXRlOiBMb2NhbFN0YXRlLCBwcm90ZWN0ID0gdHJ1ZSk6IFF1ZXVlU3RvcmUge1xuICAgIHJldHVybiBuZXcgUXVldWVTdG9yZSh0aGlzLmFwcCwgc3RhdGUucXVldWVQYXRoLCB7IGZpbGVzOiBzdGF0ZS5zdG9yZSwgd2FzbURpcmVjdG9yeTogc3RhdGUud2FzbURpcmVjdG9yeSwgYmVmb3JlRmx1c2g6IHByb3RlY3QgPyAoKSA9PiBzdGF0ZS5wcm90ZWN0UXVldWVNdXRhdGlvbigpIDogdW5kZWZpbmVkIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGFibGVNZWRpYShtZXNzYWdlOiBUZWxlZ3JhbU1lc3NhZ2UpOiBUZWxlZ3JhbUZpbGUgfCBudWxsIHsgcmV0dXJuIG1lc3NhZ2Uudm9pY2UgPz8gbWVzc2FnZS5hdWRpbyA/PyAobWVzc2FnZS5waG90byA/IG1lc3NhZ2UucGhvdG8ucmVkdWNlKChhLCBiKSA9PiAoYS5maWxlX3NpemUgPz8gMCkgPj0gKGIuZmlsZV9zaXplID8/IDApID8gYSA6IGIpIDogbnVsbCkgPz8gbWVzc2FnZS52aWRlbyA/PyBtZXNzYWdlLmRvY3VtZW50ID8/IG1lc3NhZ2UuYW5pbWF0aW9uID8/IG51bGw7IH1cbmZ1bmN0aW9uIGlzRGlyZWN0Vm9pY2VNZXNzYWdlKG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IGJvb2xlYW4geyByZXR1cm4gQm9vbGVhbihtZXNzYWdlLnZvaWNlICYmICFtZXNzYWdlLmZvcndhcmRfb3JpZ2luICYmICFtZXNzYWdlLmZvcndhcmRfZGF0ZSk7IH1cbnR5cGUgQnV0dG9uID0geyB0ZXh0OiBzdHJpbmc7IGNhbGxiYWNrX2RhdGE6IHN0cmluZyB9O1xuZnVuY3Rpb24gYnV0dG9uKHRleHQ6IHN0cmluZywgY2FsbGJhY2tfZGF0YTogc3RyaW5nKTogQnV0dG9uIHsgcmV0dXJuIHsgdGV4dCwgY2FsbGJhY2tfZGF0YSB9OyB9XG5mdW5jdGlvbiBpbml0aWFsQWN0aW9uUm93cyhpZDogbnVtYmVyKTogQnV0dG9uW11bXSB7XG4gIHJldHVybiBbW2J1dHRvbihcIkRpc2NhcmRcIiwgYGRpOnU6JHtpZH06eGApLCBidXR0b24oXCJCYWNrIHRvIHF1ZXVlXCIsIGBkaTp1OiR7aWR9OnFgKV1dO1xufVxuZnVuY3Rpb24gc2VsZWN0ZWRTdXBwb3J0ZWRSb3dzKCk6IEJ1dHRvbltdW10ge1xuICByZXR1cm4gW1tidXR0b24oXCJTYXZlIHNlbGVjdGVkXCIsIFwiZGk6YjpzXCIpXSwgW2J1dHRvbihcIkRpc2NhcmQgc2VsZWN0ZWRcIiwgXCJkaTpiOnhcIiksIGJ1dHRvbihcIkJhY2sgdG8gcXVldWVcIiwgXCJkaTpiOnFcIildXTtcbn1cbmZ1bmN0aW9uIHNlbGVjdGVkVW5zdXBwb3J0ZWRSb3dzKCk6IEJ1dHRvbltdW10ge1xuICByZXR1cm4gW1tidXR0b24oXCJEaXNjYXJkIHNlbGVjdGVkXCIsIFwiZGk6Yjp4XCIpLCBidXR0b24oXCJCYWNrIHRvIHF1ZXVlXCIsIFwiZGk6YjpxXCIpXV07XG59XG5mdW5jdGlvbiBidW5kbGVSb3dzKGRlc2lnbmF0aW9uOiBRdWV1ZUl0ZW1bXCJkZXNpZ25hdGlvblwiXSwgc3Rhc2hhYmxlID0gZmFsc2UpOiBCdXR0b25bXVtdIHtcbiAgcmV0dXJuIFtcbiAgICBbYnV0dG9uKFwiRmluaXNoIGJ1bmRsZVwiLCBcImRpOmI6ZlwiKSwgYnV0dG9uKFwiU2F2ZSBsYXRlc3RcIiwgXCJkaTpiOnNcIildLFxuICAgIC4uLihzdGFzaGFibGUgPyBbW2J1dHRvbihcIlN0YXNoIGxhdGVzdCBpbiBJbnRha2VcIiwgXCJkaTpiOnNpXCIpXV0gOiBbXSksXG4gICAgW2J1dHRvbihkZXNpZ25hdGlvbiA9PT0gXCJhZ2VudFwiID8gXCJNYXJrIGxhdGVzdCBhcyBpbnRha2VcIiA6IFwiTWFyayBsYXRlc3QgYXMgYWdlbnRcIiwgXCJkaTpiOnRcIildLFxuICAgIFtidXR0b24oXCJEaXNjYXJkIGxhdGVzdFwiLCBcImRpOmI6eFwiKSwgYnV0dG9uKFwiTGF0ZXJcIiwgXCJkaTpiOmxcIildLFxuICBdO1xufVxuZnVuY3Rpb24gaW5zZXJ0SW50YWtlQmxvY2soc291cmNlOiBzdHJpbmcsIG1hcmtlcjogc3RyaW5nLCBib2R5OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBibG9jayA9IGAke21hcmtlcn1cXG4ke2JvZHl9YDtcbiAgY29uc3Qgc2VjdGlvbiA9IGZpbmFsU2VjdGlvblN0YXJ0KHNvdXJjZSwgXCJBZ2VudCBSZXZpZXdcIikgPz8gZmluYWxTZWN0aW9uU3RhcnQoc291cmNlLCBcIlByb2Nlc3NlZCBBZ2VudCBJbnN0cnVjdGlvbnNcIik7XG4gIGlmIChzZWN0aW9uID09PSBudWxsKSByZXR1cm4gYCR7c291cmNlLnJlcGxhY2UoL1xccyokLywgXCJcIil9XFxuXFxuJHtibG9ja31cXG5gO1xuICBjb25zdCBiZWZvcmUgPSBzb3VyY2Uuc2xpY2UoMCwgc2VjdGlvbikucmVwbGFjZSgvXFxzKiQvLCBcIlwiKTtcbiAgY29uc3QgYWZ0ZXIgPSBzb3VyY2Uuc2xpY2Uoc2VjdGlvbikucmVwbGFjZSgvXlxccyovLCBcIlwiKTtcbiAgcmV0dXJuIGAke2JlZm9yZX1cXG5cXG4ke2Jsb2NrfVxcblxcbiR7YWZ0ZXJ9YDtcbn1cbmZ1bmN0aW9uIGZpbmFsU2VjdGlvblN0YXJ0KHNvdXJjZTogc3RyaW5nLCBoZWFkaW5nOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3Qgc2VjdGlvbnMgPSBbLi4uc291cmNlLm1hdGNoQWxsKG5ldyBSZWdFeHAoYF4jIyAke2hlYWRpbmd9XFxcXHMqJGAsIFwiZ2ltXCIpKV07XG4gIHJldHVybiBzZWN0aW9ucy5hdCgtMSk/LmluZGV4ID8/IG51bGw7XG59XG5mdW5jdGlvbiBzdGFuZGFsb25lUm93cyhzdGFzaGFibGUgPSBmYWxzZSk6IEJ1dHRvbltdW10ge1xuICByZXR1cm4gW1xuICAgIFtidXR0b24oXCJTYXZlIGFzIGludGFrZVwiLCBcImRpOmI6c2RcIiksIGJ1dHRvbihcIlNhdmUgYXMgYWdlbnQgaW5zdHJ1Y3Rpb25cIiwgXCJkaTpiOnNhXCIpXSxcbiAgICAuLi4oc3Rhc2hhYmxlID8gW1tidXR0b24oXCJTdGFzaCBpbiBJbnRha2VcIiwgXCJkaTpiOnNpXCIpXV0gOiBbXSksXG4gICAgW2J1dHRvbihcIkNhbmNlbFwiLCBcImRpOmI6c2NcIildLFxuICAgIFtidXR0b24oXCJEaXNjYXJkIGxhdGVzdFwiLCBcImRpOmI6eFwiKSwgYnV0dG9uKFwiTGF0ZXJcIiwgXCJkaTpiOmxcIildLFxuICBdO1xufVxuZnVuY3Rpb24gbWVkaWFMYWJlbChtZXNzYWdlOiBUZWxlZ3JhbU1lc3NhZ2UpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IHNlbGVjdGFibGVNZWRpYShtZXNzYWdlKTtcbiAgY29uc3QgZGV0YWlscyA9IGZpbGUgPyBbZm9ybWF0RHVyYXRpb24oZmlsZS5kdXJhdGlvbiksIGZvcm1hdFNpemUoZmlsZS5maWxlX3NpemUpXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiwgXCIpIDogXCJcIjtcbiAgY29uc3Qga2luZCA9IG1lc3NhZ2Uudm9pY2UgPyBcIlZvaWNlXCIgOiBtZXNzYWdlLmF1ZGlvID8gXCJBdWRpb1wiIDogbWVzc2FnZS5waG90byA/IFwiUGhvdG9cIiA6IG1lc3NhZ2UudmlkZW8gPyBcIlZpZGVvXCIgOiBtZXNzYWdlLmFuaW1hdGlvbiA/IFwiQW5pbWF0aW9uXCIgOiBtZXNzYWdlLmRvY3VtZW50ID8gYERvY3VtZW50JHttZXNzYWdlLmRvY3VtZW50LmZpbGVfbmFtZSA/IGAgXHUwMEI3ICR7bWVzc2FnZS5kb2N1bWVudC5maWxlX25hbWV9YCA6IFwiXCJ9YCA6IG51bGw7XG4gIHJldHVybiBraW5kID8gYCR7a2luZH0ke2RldGFpbHMgPyBgICgke2RldGFpbHN9KWAgOiBcIlwifWAgOiBudWxsO1xufVxuZnVuY3Rpb24gbG9naWNhbExhYmVsKGl0ZW1zOiBRdWV1ZUl0ZW1bXSk6IHN0cmluZyB7XG4gIGlmIChpdGVtcy5sZW5ndGggPiAxKSByZXR1cm4gYEFsYnVtICgke2l0ZW1zLmxlbmd0aH0gaXRlbXM6ICR7aXRlbXMubWFwKChpdGVtKSA9PiBtZWRpYUxhYmVsKGl0ZW0ucGF5bG9hZCkgPz8gXCJUZXh0XCIpLmpvaW4oXCIsIFwiKX0pYDtcbiAgcmV0dXJuIG1lZGlhTGFiZWwoaXRlbXNbMF0ucGF5bG9hZCkgPz8gXCJUZXh0XCI7XG59XG5mdW5jdGlvbiBzZWxlY3Rpb25CdXR0b24oZGlzcGxheU51bWJlcjogbnVtYmVyLCBpdGVtczogUXVldWVJdGVtW10pOiBzdHJpbmcge1xuICBjb25zdCBtZXNzYWdlID0gaXRlbXNbMF0ucGF5bG9hZDtcbiAgY29uc3QgaWNvbiA9IGl0ZW1zLmxlbmd0aCA+IDEgPyBcIlx1RDgzRFx1RERDMlwiIDogbWVzc2FnZS52b2ljZSA/IFwiXHVEODNDXHVERjk5XCIgOiBtZXNzYWdlLmF1ZGlvID8gXCJcdUQ4M0NcdURGQjVcIiA6IG1lc3NhZ2UucGhvdG8gPyBcIlx1RDgzRFx1RERCQ1wiIDogbWVzc2FnZS52aWRlbyA/IFwiXHVEODNDXHVERkFDXCIgOiBtZXNzYWdlLmFuaW1hdGlvbiA/IFwiXHUyNzI4XCIgOiBtZXNzYWdlLmRvY3VtZW50ID8gXCJcdUQ4M0RcdURDQzRcIiA6IFwiXHVEODNEXHVEQ0REXCI7XG4gIGNvbnN0IHByZXZpZXcgPSAobWVzc2FnZS50ZXh0ID8/IG1lc3NhZ2UuY2FwdGlvbik/LnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKS5zbGljZSgwLCAyMCk7XG4gIGNvbnN0IGxhYmVsID0gaXRlbXMubGVuZ3RoID4gMSA/IGBBbGJ1bSBcdTAwQjcgJHtpdGVtcy5sZW5ndGh9YCA6IChtZWRpYUxhYmVsKG1lc3NhZ2UpID8/IGBUZXh0JHtwcmV2aWV3ID8gYCBcdTAwQjcgJHtwcmV2aWV3fWAgOiBcIlwifWApO1xuICBjb25zdCB0aW1lID0gbG9jYWxUaW1lKE1hdGgubWluKC4uLml0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5wYXlsb2FkLmRhdGUpKSAqIDEwMDApO1xuICByZXR1cm4gYCR7ZGlzcGxheU51bWJlcn0gJHtpY29ufSAke2xhYmVsfSBcdTAwQjcgJHt0aW1lfWAuc2xpY2UoMCwgNjApO1xufVxuZnVuY3Rpb24gbG9naWNhbFN1bW1hcnkoaXRlbXM6IFF1ZXVlSXRlbVtdKTogc3RyaW5nIHtcbiAgY29uc3QgdGV4dCA9IGl0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5wYXlsb2FkLnRleHQgPz8gaXRlbS5wYXlsb2FkLmNhcHRpb24pLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIC8gXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbiAgcmV0dXJuIHRleHQgPyB0ZXh0LnNsaWNlKDAsIDEyMCkgOiBsb2dpY2FsTGFiZWwoaXRlbXMpO1xufVxuZnVuY3Rpb24gbGF0ZXN0R3JvdXAobGVhZGVySWRzOiBudW1iZXJbXSwgaXRlbXM6IFF1ZXVlSXRlbVtdKTogUXVldWVJdGVtW10ge1xuICBjb25zdCBsZWFkZXIgPSBpdGVtcy5maW5kKChpdGVtKSA9PiBpdGVtLmlkID09PSBsZWFkZXJJZHMuYXQoLTEpKSA/PyBpdGVtcy5hdCgtMSkhO1xuICByZXR1cm4gbGVhZGVyLm1lZGlhR3JvdXBJZCA/IGl0ZW1zLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5tZWRpYUdyb3VwSWQgPT09IGxlYWRlci5tZWRpYUdyb3VwSWQpIDogW2xlYWRlcl07XG59XG5mdW5jdGlvbiBsb2dpY2FsRGVzY3JpcHRpb24oaXRlbXM6IFF1ZXVlSXRlbVtdLCBkZXNpZ25hdGlvbjogUXVldWVJdGVtW1wiZGVzaWduYXRpb25cIl0pOiBzdHJpbmcge1xuICBjb25zdCB0aW1lID0gbG9jYWxUaW1lKE1hdGgubWluKC4uLml0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5wYXlsb2FkLmRhdGUpKSAqIDEwMDApO1xuICByZXR1cm4gYCR7bG9naWNhbExhYmVsKGl0ZW1zKX0gXHUwMEI3ICR7dGltZX0ke2Rlc2lnbmF0aW9uID09PSBcImFnZW50XCIgPyBcIiBcdTAwQjcgQWdlbnQgaW5zdHJ1Y3Rpb25cIiA6IFwiIFx1MDBCNyBJbnRha2VcIn1cXG4ke2xvZ2ljYWxTdW1tYXJ5KGl0ZW1zKX1gO1xufVxuZnVuY3Rpb24gYnVuZGxlRGVzY3JpcHRpb24obGVhZGVySWRzOiBudW1iZXJbXSwgaXRlbXM6IFF1ZXVlSXRlbVtdKTogc3RyaW5nIHtcbiAgY29uc3QgZW50cmllcyA9IGxlYWRlcklkcy5tYXAoKGlkLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGxlYWRlciA9IGl0ZW1zLmZpbmQoKGl0ZW0pID0+IGl0ZW0uaWQgPT09IGlkKSA/PyBpdGVtc1swXTtcbiAgICBjb25zdCBncm91cCA9IGxlYWRlci5tZWRpYUdyb3VwSWQgPyBpdGVtcy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubWVkaWFHcm91cElkID09PSBsZWFkZXIubWVkaWFHcm91cElkKSA6IFtsZWFkZXJdO1xuICAgIHJldHVybiBgXHUyMDIyICR7aW5kZXggKyAxfS4gJHtsb2dpY2FsRGVzY3JpcHRpb24oZ3JvdXAsIGxlYWRlci5kZXNpZ25hdGlvbil9JHtpbmRleCA9PT0gbGVhZGVySWRzLmxlbmd0aCAtIDEgPyBcIiBcdTAwQjcgbGF0ZXN0XCIgOiBcIlwifWA7XG4gIH0pO1xuICByZXR1cm4gYEludGFrZSBidW5kbGUgKCR7bGVhZGVySWRzLmxlbmd0aH0gbG9naWNhbCBpdGVtJHtsZWFkZXJJZHMubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wifSlcXG4ke2VudHJpZXMuam9pbihcIlxcblwiKX1gO1xufVxuZnVuY3Rpb24gc2Vzc2lvbk1vZGVMYWJlbChtb2RlOiBCb3RTZXNzaW9uW1wibW9kZVwiXSk6IHN0cmluZyB7IHJldHVybiBtb2RlID09PSBcImF3YWl0aW5nX2lkc1wiID8gXCJjaG9vc2luZyBpdGVtc1wiIDogbW9kZSA9PT0gXCJzdGFuZGFsb25lXCIgPyBcInN0YW5kYWxvbmUgY2hvaWNlXCIgOiBcImFjdGl2ZVwiOyB9XG5mdW5jdGlvbiBuZXN0ZWRDYWxsb3V0TGluZXModGV4dDogc3RyaW5nKTogc3RyaW5nW10geyByZXR1cm4gY2FsbG91dExpbmVzKHRleHQpLnNwbGl0KFwiXFxuXCIpLm1hcCgobGluZSkgPT4gYD4gJHtsaW5lfWApOyB9XG5mdW5jdGlvbiBmb3JtYXREdXJhdGlvbihzZWNvbmRzPzogbnVtYmVyKTogc3RyaW5nIHsgaWYgKCFzZWNvbmRzKSByZXR1cm4gXCJcIjsgcmV0dXJuIGAke01hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKX06JHtTdHJpbmcoc2Vjb25kcyAlIDYwKS5wYWRTdGFydCgyLCBcIjBcIil9YDsgfVxuZnVuY3Rpb24gZm9ybWF0U2l6ZShieXRlcz86IG51bWJlcik6IHN0cmluZyB7IGlmICghYnl0ZXMpIHJldHVybiBcIlwiOyByZXR1cm4gYnl0ZXMgPCAxMDI0ICogMTAyNCA/IGAke01hdGgubWF4KDEsIE1hdGgucm91bmQoYnl0ZXMgLyAxMDI0KSl9IEtCYCA6IGAkeyhieXRlcyAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMSl9IE1CYDsgfVxuZnVuY3Rpb24gbG9jYWxUaW1lKG1pbGxpc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHsgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKG1pbGxpc2Vjb25kcyk7IHJldHVybiBgJHtTdHJpbmcoZGF0ZS5nZXRIb3VycygpKS5wYWRTdGFydCgyLCBcIjBcIil9OiR7U3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCBcIjBcIil9YDsgfVxuZnVuY3Rpb24gZXh0ZW5zaW9uKGZpbGU6IFRlbGVncmFtRmlsZSwgcmVtb3RlUGF0aDogc3RyaW5nKTogc3RyaW5nIHsgY29uc3QgbmFtZWQgPSAoZmlsZS5maWxlX25hbWUgPz8gcmVtb3RlUGF0aCkubWF0Y2goL1xcLihbYS16QS1aMC05XXsxLDEwfSkkLyk/LlsxXTsgaWYgKG5hbWVkKSByZXR1cm4gbmFtZWQudG9Mb3dlckNhc2UoKTsgcmV0dXJuIGZpbGUubWltZV90eXBlPy5zcGxpdChcIi9cIilbMV0/LnJlcGxhY2UoXCJqcGVnXCIsIFwianBnXCIpID8/IFwiYmluXCI7IH1cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUZvbGRlcihhZGFwdGVyOiBhbnksIGZvbGRlcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGxldCBjdXJyZW50ID0gXCJcIjtcbiAgZm9yIChjb25zdCBwYXJ0IG9mIGZvbGRlci5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pKSB7XG4gICAgY3VycmVudCA9IGN1cnJlbnQgPyBgJHtjdXJyZW50fS8ke3BhcnR9YCA6IHBhcnQ7XG4gICAgaWYgKCEoYXdhaXQgYWRhcHRlci5leGlzdHMoY3VycmVudCkpKSBhd2FpdCBhZGFwdGVyLm1rZGlyKGN1cnJlbnQpO1xuICB9XG59XG5mdW5jdGlvbiBlbWJlZChwYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IFRlbGVncmFtTWVzc2FnZSk6IHN0cmluZyB7XG4gIGNvbnN0IGZpbGUgPSBzZWxlY3RhYmxlTWVkaWEobWVzc2FnZSk7XG4gIGNvbnN0IGxhYmVsID0gbWVzc2FnZS52b2ljZSA/IFwiVGVsZWdyYW0gdm9pY2UgbWVzc2FnZVwiIDogbWVzc2FnZS5hdWRpbyA/IFwiVGVsZWdyYW0gYXVkaW9cIiA6IG1lZGlhTGFiZWxGcm9tTWltZShmaWxlPy5taW1lX3R5cGUpID8/IFwiVGVsZWdyYW0gYXR0YWNobWVudFwiO1xuICByZXR1cm4gYCFbWyR7cGF0aH18JHtsYWJlbH1dXWA7XG59XG5mdW5jdGlvbiBtZWRpYUxhYmVsRnJvbU1pbWUobWltZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwgeyByZXR1cm4gbWltZT8uc3RhcnRzV2l0aChcImltYWdlL1wiKSA/IFwiVGVsZWdyYW0gaW1hZ2VcIiA6IG1pbWU/LnN0YXJ0c1dpdGgoXCJhdWRpby9cIikgPyBcIlRlbGVncmFtIGF1ZGlvXCIgOiBtaW1lPy5zdGFydHNXaXRoKFwidmlkZW8vXCIpID8gXCJUZWxlZ3JhbSB2aWRlb1wiIDogbWltZSA/IFwiVGVsZWdyYW0gYXR0YWNobWVudFwiIDogbnVsbDsgfVxuY29uc3QgcGF1c2UgPSAobWlsbGlzZWNvbmRzOiBudW1iZXIpID0+IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB3aW5kb3cuc2V0VGltZW91dChyZXNvbHZlLCBtaWxsaXNlY29uZHMpKTtcbiIsICIvKiogc3FsLmpzIGxvYWRzIE5vZGUgaGVscGVycyB3aGVuIGluaXRpYWxpemVkLCBzbyBuZXZlciBpbXBvcnQgaXQgZHVyaW5nIG1vYmlsZSBidW5kbGUgc3RhcnR1cC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkU3FsSnMoKTogUHJvbWlzZTx0eXBlb2YgaW1wb3J0KFwic3FsLmpzXCIpLmRlZmF1bHQ+IHtcbiAgcmV0dXJuIChhd2FpdCBpbXBvcnQoXCJzcWwuanNcIikpLmRlZmF1bHQ7XG59XG4iLCAiZXhwb3J0IHR5cGUgSW50YWtlS2luZCA9IFwiZGFpbHlcIiB8IFwiYWdlbnRcIiB8IFwibGF0ZXJcIiB8IFwiZGlzY2FyZFwiIHwgXCJzdGFzaFwiO1xuZXhwb3J0IHR5cGUgQ2FwdHVyZURlc2lnbmF0aW9uID0gXCJkYWlseVwiIHwgXCJhZ2VudFwiO1xuZXhwb3J0IHR5cGUgUXVldWVTdGF0ZSA9IFwicGVuZGluZ1wiIHwgXCJyZXNvbHZlZFwiIHwgXCJkaXNjYXJkZWRcIiB8IFwiZmFpbGVkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0dGluZ3Mge1xuICBlbmFibGVkOiBib29sZWFuO1xuICB0b2tlbjogc3RyaW5nO1xuICBvZmZzZXQ6IG51bWJlcjtcbiAgb3duZXJVc2VySWQ6IG51bWJlciB8IG51bGw7XG4gIG93bmVyQ2hhdElkOiBudW1iZXIgfCBudWxsO1xuICBwYWlyQXJtZWQ6IGJvb2xlYW47XG4gIGpvdXJuYWw6IHN0cmluZztcbiAgYXR0YWNobWVudFJvb3Q6IHN0cmluZztcbiAgc3RhdHVzOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTZXR0aW5ncyA9IHtcbiAgZW5hYmxlZDogZmFsc2UsXG4gIHRva2VuOiBcIlwiLFxuICBvZmZzZXQ6IDAsXG4gIG93bmVyVXNlcklkOiBudWxsLFxuICBvd25lckNoYXRJZDogbnVsbCxcbiAgcGFpckFybWVkOiBmYWxzZSxcbiAgam91cm5hbDogXCJQZXJzb25hbCBEYWlseVwiLFxuICBhdHRhY2htZW50Um9vdDogXCJTdHJhdGEvQXR0YWNobWVudHMvQ29udGludXVtL1RpbWUvRGFpbHlcIixcbiAgc3RhdHVzOiBcIkRpc2FibGVkIG9uIHRoaXMgZGV2aWNlLlwiLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBUZWxlZ3JhbUZpbGUge1xuICBmaWxlX2lkOiBzdHJpbmc7XG4gIGZpbGVfdW5pcXVlX2lkPzogc3RyaW5nO1xuICBmaWxlX25hbWU/OiBzdHJpbmc7XG4gIG1pbWVfdHlwZT86IHN0cmluZztcbiAgZmlsZV9zaXplPzogbnVtYmVyO1xuICBkdXJhdGlvbj86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZWxlZ3JhbU1lc3NhZ2Uge1xuICBtZXNzYWdlX2lkOiBudW1iZXI7XG4gIGRhdGU6IG51bWJlcjtcbiAgY2hhdDogeyBpZDogbnVtYmVyOyB0eXBlOiBzdHJpbmcgfTtcbiAgZnJvbT86IHsgaWQ6IG51bWJlcjsgZmlyc3RfbmFtZT86IHN0cmluZyB9O1xuICB0ZXh0Pzogc3RyaW5nO1xuICBjYXB0aW9uPzogc3RyaW5nO1xuICB2b2ljZT86IFRlbGVncmFtRmlsZTtcbiAgYXVkaW8/OiBUZWxlZ3JhbUZpbGU7XG4gIHBob3RvPzogQXJyYXk8VGVsZWdyYW1GaWxlICYgeyBmaWxlX3NpemU/OiBudW1iZXIgfT47XG4gIHZpZGVvPzogVGVsZWdyYW1GaWxlO1xuICBkb2N1bWVudD86IFRlbGVncmFtRmlsZTtcbiAgYW5pbWF0aW9uPzogVGVsZWdyYW1GaWxlO1xuICBtZWRpYV9ncm91cF9pZD86IHN0cmluZztcbiAgZm9yd2FyZF9vcmlnaW4/OiB1bmtub3duO1xuICBmb3J3YXJkX2RhdGU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVsZWdyYW1VcGRhdGUge1xuICB1cGRhdGVfaWQ6IG51bWJlcjtcbiAgbWVzc2FnZT86IFRlbGVncmFtTWVzc2FnZTtcbiAgY2FsbGJhY2tfcXVlcnk/OiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBkYXRhPzogc3RyaW5nO1xuICAgIGZyb206IHsgaWQ6IG51bWJlciB9O1xuICAgIG1lc3NhZ2U/OiBUZWxlZ3JhbU1lc3NhZ2U7XG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJdGVtIHtcbiAgaWQ6IG51bWJlcjtcbiAgdXBkYXRlSWQ6IG51bWJlcjtcbiAgc3RhdGU6IFF1ZXVlU3RhdGU7XG4gIGtpbmQ6IEludGFrZUtpbmQgfCBudWxsO1xuICBkZXNpZ25hdGlvbjogQ2FwdHVyZURlc2lnbmF0aW9uO1xuICBwYXlsb2FkOiBUZWxlZ3JhbU1lc3NhZ2U7XG4gIG1lZGlhR3JvdXBJZDogc3RyaW5nIHwgbnVsbDtcbiAgY3JlYXRlZEF0OiBudW1iZXI7XG4gIGVycm9yOiBzdHJpbmcgfCBudWxsO1xuICBwcm9tcHRDaGF0SWQ6IG51bWJlciB8IG51bGw7XG4gIHByb21wdE1lc3NhZ2VJZDogbnVtYmVyIHwgbnVsbDtcbn1cblxuZXhwb3J0IHR5cGUgU2Vzc2lvbk1vZGUgPSBcImJ1bmRsZVwiIHwgXCJhd2FpdGluZ19pZHNcIiB8IFwic3RhbmRhbG9uZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvdFNlc3Npb24ge1xuICBtb2RlOiBTZXNzaW9uTW9kZTtcbiAgbGVhZGVySWRzOiBudW1iZXJbXTtcbiAgb3JkaW5hbExlYWRlcklkcz86IG51bWJlcltdO1xuICBtZW51Q2hhdElkOiBudW1iZXI7XG4gIG1lbnVNZXNzYWdlSWQ6IG51bWJlcjtcbiAgcGFnZTogbnVtYmVyO1xuICBhZnRlcklkOiBudW1iZXI7XG4gIGNyZWF0ZWRBdDogbnVtYmVyO1xuICB1cGRhdGVkQXQ6IG51bWJlcjtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgbG9hZFNxbEpzIH0gZnJvbSBcIi4vc3FsLWxvYWRlclwiO1xuaW1wb3J0IHsgREVGQVVMVF9TRVRUSU5HUywgdHlwZSBTZXR0aW5ncyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmluYXJ5U3RvcmUge1xuICBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPjtcbiAgcmVhZEJpbmFyeShwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFVpbnQ4QXJyYXkgfCBBcnJheUJ1ZmZlcj47XG4gIHdyaXRlQmluYXJ5KHBhdGg6IHN0cmluZywgYnl0ZXM6IFVpbnQ4QXJyYXkpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG50eXBlIE5vZGVNb2R1bGVzID0ge1xuICBmczogdHlwZW9mIGltcG9ydChcIm5vZGU6ZnMvcHJvbWlzZXNcIik7XG4gIG9zOiB0eXBlb2YgaW1wb3J0KFwibm9kZTpvc1wiKTtcbiAgcGF0aDogdHlwZW9mIGltcG9ydChcIm5vZGU6cGF0aFwiKTtcbn07XG5cbmV4cG9ydCB0eXBlIExvY2FsU3RhdGVMb2FkID1cbiAgfCB7IHN0YXRlOiBMb2NhbFN0YXRlOyBzZXR0aW5nczogU2V0dGluZ3MgfVxuICB8IHsgc3RhdGU6IG51bGw7IHNldHRpbmdzOiBTZXR0aW5nczsgcmVhc29uOiBzdHJpbmcgfTtcblxuLyoqIERlc2t0b3Atb25seSBwcml2YXRlIHN0YXRlLiBOb2RlIG1vZHVsZXMgYXJlIGRlbGliZXJhdGVseSBsb2FkZWQgb25seSBhZnRlciB0aGUgZGVza3RvcCBndWFyZC4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0YXRlIHtcbiAgcmVhZG9ubHkgc3RvcmU6IEJpbmFyeVN0b3JlO1xuICByZWFkb25seSBwcmV2aW91c0RpcmVjdG9yeTogc3RyaW5nO1xuICByZWFkb25seSBwcmV2aW91c1NldHRpbmdzUGF0aDogc3RyaW5nO1xuICByZWFkb25seSBwcmV2aW91c1F1ZXVlUGF0aDogc3RyaW5nO1xuICBwcml2YXRlIHNldHRpbmdzQ2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgcHJpdmF0ZSBsYXN0T2Zmc2V0ID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFwcDogQXBwLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbm9kZTogTm9kZU1vZHVsZXMsXG4gICAgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgc2V0dGluZ3NQYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgcXVldWVQYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgbGVnYWN5U2V0dGluZ3NQYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgbGVnYWN5UXVldWVQYXRoOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgd2FzbURpcmVjdG9yeTogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLnByZXZpb3VzRGlyZWN0b3J5ID0gYCR7ZGlyZWN0b3J5fS5wcmV2aW91c2A7XG4gICAgdGhpcy5wcmV2aW91c1NldHRpbmdzUGF0aCA9IGAke3RoaXMucHJldmlvdXNEaXJlY3Rvcnl9L3NldHRpbmdzLmpzb25gO1xuICAgIHRoaXMucHJldmlvdXNRdWV1ZVBhdGggPSBgJHt0aGlzLnByZXZpb3VzRGlyZWN0b3J5fS9xdWV1ZS5zcWxpdGVgO1xuICAgIHRoaXMuc3RvcmUgPSB7XG4gICAgICBleGlzdHM6IGFzeW5jIChwYXRoKSA9PiB0aGlzLmV4aXN0cyhwYXRoKSxcbiAgICAgIHJlYWRCaW5hcnk6IGFzeW5jIChwYXRoKSA9PiBuZXcgVWludDhBcnJheShhd2FpdCB0aGlzLm5vZGUuZnMucmVhZEZpbGUocGF0aCkpLFxuICAgICAgd3JpdGVCaW5hcnk6IGFzeW5jIChwYXRoLCBieXRlcykgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLm5vZGUuZnMubWtkaXIodGhpcy5kaXJlY3RvcnksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICBjb25zdCB0ZW1wb3JhcnkgPSBgJHtwYXRofS50bXBgO1xuICAgICAgICBhd2FpdCB0aGlzLm5vZGUuZnMud3JpdGVGaWxlKHRlbXBvcmFyeSwgYnl0ZXMpO1xuICAgICAgICBjb25zdCB2ZXJpZmllZCA9IGF3YWl0IHRoaXMubm9kZS5mcy5yZWFkRmlsZSh0ZW1wb3JhcnkpO1xuICAgICAgICBpZiAoIXNhbWVCeXRlcyhieXRlcywgdmVyaWZpZWQpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcml2YXRlIHN0YXRlIHZlcmlmaWNhdGlvbiBmYWlsZWQuXCIpO1xuICAgICAgICBhd2FpdCB0aGlzLm5vZGUuZnMucmVuYW1lKHRlbXBvcmFyeSwgcGF0aCk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgbG9hZChhcHA6IEFwcCwgcGx1Z2luRGlyZWN0b3J5OiBzdHJpbmcsIHJlYWRMZWdhY3lTZXR0aW5nczogKCkgPT4gUHJvbWlzZTx1bmtub3duPik6IFByb21pc2U8TG9jYWxTdGF0ZUxvYWQ+IHtcbiAgICBjb25zdCBub2RlID0gYXdhaXQgbG9hZE5vZGUoKTtcbiAgICBjb25zdCB2YXVsdFBhdGggPSBTdHJpbmcoKGFwcC52YXVsdC5hZGFwdGVyIGFzIGFueSkuZ2V0QmFzZVBhdGg/LigpID8/IGFwcC52YXVsdC5nZXROYW1lKCkpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IG5vZGUucGF0aC5qb2luKG5vZGUub3MuaG9tZWRpcigpLCBcIkxpYnJhcnlcIiwgXCJBcHBsaWNhdGlvbiBTdXBwb3J0XCIsIFwiT2JzaWRpYW5cIiwgXCJkYWlseS1pbnRha2VcIiwgc3RhYmxlSWQodmF1bHRQYXRoKSk7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgTG9jYWxTdGF0ZShhcHAsIG5vZGUsIGRpcmVjdG9yeSwgbm9kZS5wYXRoLmpvaW4oZGlyZWN0b3J5LCBcInNldHRpbmdzLmpzb25cIiksIG5vZGUucGF0aC5qb2luKGRpcmVjdG9yeSwgXCJxdWV1ZS5zcWxpdGVcIiksIGAke3BsdWdpbkRpcmVjdG9yeX0vZGF0YS5qc29uYCwgYCR7cGx1Z2luRGlyZWN0b3J5fS9xdWV1ZS5zcWxpdGVgLCBwbHVnaW5EaXJlY3RvcnkpO1xuICAgIGNvbnN0IFtoYXNTZXR0aW5ncywgaGFzUXVldWVdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3N0YXRlLmV4aXN0cyhzdGF0ZS5zZXR0aW5nc1BhdGgpLCBzdGF0ZS5leGlzdHMoc3RhdGUucXVldWVQYXRoKV0pO1xuXG4gICAgaWYgKGhhc1NldHRpbmdzIHx8IGhhc1F1ZXVlKSB7XG4gICAgICBpZiAoIWhhc1NldHRpbmdzIHx8ICFoYXNRdWV1ZSkgcmV0dXJuIGJsb2NrZWQoYXdhaXQgc3RhdGUud2l0aFJlY292ZXJ5KGFwcCwgXCJQcml2YXRlIHN0YXRlIGlzIGluY29tcGxldGU7IGl0IHdhcyBub3QgY2hhbmdlZC5cIikpO1xuICAgICAgY29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBzdGF0ZS5yZWFkU2V0dGluZ3MoKTtcbiAgICAgIGNvbnN0IHF1ZXVlID0gYXdhaXQgc3RhdGUucmVhZFF1ZXVlKCk7XG4gICAgICBpZiAoIXNldHRpbmdzIHx8ICFxdWV1ZSB8fCAhKGF3YWl0IHN0YXRlLnF1ZXVlTWF0Y2hlcyhhcHAsIHF1ZXVlLCBzZXR0aW5ncy5vZmZzZXQpKSkgcmV0dXJuIGJsb2NrZWQoYXdhaXQgc3RhdGUud2l0aFJlY292ZXJ5KGFwcCwgXCJQcml2YXRlIHN0YXRlIGlzIHVucmVhZGFibGUgb3IgY29ycnVwdDsgaXQgd2FzIG5vdCBjaGFuZ2VkLlwiKSk7XG4gICAgICBzdGF0ZS5yZW1lbWJlcihzZXR0aW5ncyk7XG4gICAgICByZXR1cm4geyBzdGF0ZSwgc2V0dGluZ3MgfTtcbiAgICB9XG5cbiAgICBpZiAoYXdhaXQgc3RhdGUuZGlyZWN0b3J5RXhpc3RzKCkpIHJldHVybiBibG9ja2VkKGF3YWl0IHN0YXRlLndpdGhSZWNvdmVyeShhcHAsIFwiUHJpdmF0ZSBzdGF0ZSBpcyBpbmNvbXBsZXRlOyBpdCB3YXMgbm90IGNoYW5nZWQuXCIpKTtcblxuICAgIGNvbnN0IFtsZWdhY3lTZXR0aW5ncywgbGVnYWN5UXVldWVdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3JlYWRMZWdhY3lTZXR0aW5ncygpLmNhdGNoKCgpID0+IG51bGwpLCBzdGF0ZS5yZWFkTGVnYWN5UXVldWUoYXBwKV0pO1xuICAgIGNvbnN0IHNldHRpbmdzID0gdmFsaWRTZXR0aW5ncyhsZWdhY3lTZXR0aW5ncyk7XG4gICAgaWYgKCFzZXR0aW5ncyB8fCAhbGVnYWN5UXVldWUgfHwgIShhd2FpdCBzdGF0ZS5xdWV1ZU1hdGNoZXMoYXBwLCBsZWdhY3lRdWV1ZSwgc2V0dGluZ3Mub2Zmc2V0KSkpIHJldHVybiBibG9ja2VkKFwiUHJpdmF0ZSBzdGF0ZSBpcyBub3QgY29uZmlndXJlZC4gVXNlIHRoZSBzZXR0aW5ncyBwYW5lIHRvIHNldCBpdCB1cCBvbiB0aGlzIE1hYy5cIik7XG5cbiAgICAvLyBBIGxlZ2FjeSBwYWlyIGlzIGNvcGllZCBhcyBvbmUgY29uc2VydmF0aXZlLCB2ZXJpZmlhYmxlIG1pZ3JhdGlvbi4gTGVnYWN5IGZpbGVzIHJlbWFpbiB1bnRvdWNoZWQuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZlcmlmaWVkU2V0dGluZ3MgPSBhd2FpdCBzdGF0ZS5zdGFnZU1pZ3JhdGlvbihhcHAsIHNldHRpbmdzLCBsZWdhY3lRdWV1ZSk7XG4gICAgICBzdGF0ZS5yZW1lbWJlcih2ZXJpZmllZFNldHRpbmdzKTtcbiAgICAgIHJldHVybiB7IHN0YXRlLCBzZXR0aW5nczogdmVyaWZpZWRTZXR0aW5ncyB9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGJsb2NrZWQoXCJQcml2YXRlIHN0YXRlIG1pZ3JhdGlvbiBjb3VsZCBub3QgYmUgdmVyaWZpZWQ7IG5vIGxlZ2FjeSBkYXRhIHdhcyBjaGFuZ2VkLlwiKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB3cml0ZVNldHRpbmdzKHNldHRpbmdzOiBTZXR0aW5ncywgc25hcHNob3QgPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmVxdWVzdGVkID0geyAuLi5zZXR0aW5ncyB9O1xuICAgIGNvbnN0IHdyaXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc2F2ZWQgPSB7IC4uLnJlcXVlc3RlZCwgb2Zmc2V0OiBNYXRoLm1heChyZXF1ZXN0ZWQub2Zmc2V0LCB0aGlzLmxhc3RPZmZzZXQpIH07XG4gICAgICBhd2FpdCB0aGlzLnJlcXVpcmVTZXR0aW5nc1dyaXRlKHNhdmVkLCBzbmFwc2hvdCk7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoc2F2ZWQpO1xuICAgICAgYXdhaXQgdGhpcy5ub2RlLmZzLm1rZGlyKHRoaXMuZGlyZWN0b3J5LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IHRlbXBvcmFyeSA9IGAke3RoaXMuc2V0dGluZ3NQYXRofS50bXBgO1xuICAgICAgYXdhaXQgdGhpcy5ub2RlLmZzLndyaXRlRmlsZSh0ZW1wb3JhcnksIHRleHQsIFwidXRmOFwiKTtcbiAgICAgIGlmICgoYXdhaXQgdGhpcy5ub2RlLmZzLnJlYWRGaWxlKHRlbXBvcmFyeSwgXCJ1dGY4XCIpKSAhPT0gdGV4dCkgdGhyb3cgbmV3IEVycm9yKFwiUHJpdmF0ZSBzZXR0aW5ncyB2ZXJpZmljYXRpb24gZmFpbGVkLlwiKTtcbiAgICAgIGF3YWl0IHRoaXMubm9kZS5mcy5yZW5hbWUodGVtcG9yYXJ5LCB0aGlzLnNldHRpbmdzUGF0aCk7XG4gICAgICB0aGlzLmxhc3RPZmZzZXQgPSBzYXZlZC5vZmZzZXQ7XG4gICAgfTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnNldHRpbmdzQ2hhaW4udGhlbih3cml0ZSwgd3JpdGUpO1xuICAgIHRoaXMuc2V0dGluZ3NDaGFpbiA9IHJlc3VsdC50aGVuKCgpID0+IHVuZGVmaW5lZCwgKCkgPT4gdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgYXN5bmMgcHJlcGFyZUVtcHR5KGFwcDogQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgW2hhc1NldHRpbmdzLCBoYXNRdWV1ZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5leGlzdHModGhpcy5zZXR0aW5nc1BhdGgpLCB0aGlzLmV4aXN0cyh0aGlzLnF1ZXVlUGF0aCldKTtcbiAgICBpZiAoaGFzU2V0dGluZ3MgfHwgaGFzUXVldWUpIHRocm93IG5ldyBFcnJvcihcIlByaXZhdGUgc3RhdGUgY2hhbmdlZCB3aGlsZSBpdCB3YXMgYmVpbmcgaW5pdGlhbGl6ZWQuXCIpO1xuICAgIGNvbnN0IGFkYXB0ZXI6IGFueSA9IGFwcC52YXVsdC5hZGFwdGVyO1xuICAgIGlmIChhd2FpdCBhZGFwdGVyLmV4aXN0cyh0aGlzLmxlZ2FjeVNldHRpbmdzUGF0aCkgfHwgYXdhaXQgYWRhcHRlci5leGlzdHModGhpcy5sZWdhY3lRdWV1ZVBhdGgpKSB0aHJvdyBuZXcgRXJyb3IoXCJMZWdhY3kgcHJpdmF0ZSBzdGF0ZSBuZWVkcyByZWNvdmVyeSBiZWZvcmUgYSBuZXcgcXVldWUgY2FuIGJlIGNyZWF0ZWQuXCIpO1xuICAgIGF3YWl0IHRoaXMubm9kZS5mcy5ta2Rpcih0aGlzLmRpcmVjdG9yeSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIH1cblxuICAvKiogQ2FwdHVyZSBleGFjdGx5IG9uZSBjb21wbGV0ZSBwcmlvciBwYWlyIGJlZm9yZSBhIHByaW1hcnktc3RhdGUgbXV0YXRpb24uICovXG4gIGFzeW5jIHNuYXBzaG90UHJldmlvdXMoYXBwID0gdGhpcy5hcHApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMucmVhZFNldHRpbmdzKCk7XG4gICAgY29uc3QgcXVldWUgPSBhd2FpdCB0aGlzLnJlYWRRdWV1ZSgpO1xuICAgIGlmICghc2V0dGluZ3MgfHwgIXF1ZXVlIHx8ICEoYXdhaXQgdGhpcy5xdWV1ZU1hdGNoZXMoYXBwLCBxdWV1ZSwgc2V0dGluZ3Mub2Zmc2V0KSkpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLm5vZGUucGF0aC5kaXJuYW1lKHRoaXMucHJldmlvdXNEaXJlY3RvcnkpO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLm5vZGUucGF0aC5iYXNlbmFtZSh0aGlzLnByZXZpb3VzRGlyZWN0b3J5KTtcbiAgICBhd2FpdCB0aGlzLm5vZGUuZnMubWtkaXIocGFyZW50LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICBjb25zdCBzdGFnZWQgPSBhd2FpdCB0aGlzLm5vZGUuZnMubWtkdGVtcCh0aGlzLm5vZGUucGF0aC5qb2luKHBhcmVudCwgYC4ke25hbWV9LnN0YWdlLWApKTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2V0dGluZ3NQYXRoID0gdGhpcy5ub2RlLnBhdGguam9pbihzdGFnZWQsIFwic2V0dGluZ3MuanNvblwiKTtcbiAgICAgIGNvbnN0IHF1ZXVlUGF0aCA9IHRoaXMubm9kZS5wYXRoLmpvaW4oc3RhZ2VkLCBcInF1ZXVlLnNxbGl0ZVwiKTtcbiAgICAgIGNvbnN0IHRleHQgPSBKU09OLnN0cmluZ2lmeShzZXR0aW5ncyk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5ub2RlLmZzLndyaXRlRmlsZShzZXR0aW5nc1BhdGgsIHRleHQsIFwidXRmOFwiKSwgdGhpcy5ub2RlLmZzLndyaXRlRmlsZShxdWV1ZVBhdGgsIHF1ZXVlKV0pO1xuICAgICAgY29uc3QgW3ZlcmlmaWVkVGV4dCwgdmVyaWZpZWRRdWV1ZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5ub2RlLmZzLnJlYWRGaWxlKHNldHRpbmdzUGF0aCwgXCJ1dGY4XCIpLCB0aGlzLm5vZGUuZnMucmVhZEZpbGUocXVldWVQYXRoKV0pO1xuICAgICAgY29uc3QgdmVyaWZpZWRTZXR0aW5ncyA9IHZhbGlkU2V0dGluZ3MoSlNPTi5wYXJzZSh2ZXJpZmllZFRleHQpKTtcbiAgICAgIGlmICh2ZXJpZmllZFRleHQgIT09IHRleHQgfHwgIXZlcmlmaWVkU2V0dGluZ3MgfHwgIXNhbWVCeXRlcyhxdWV1ZSwgdmVyaWZpZWRRdWV1ZSkgfHwgIShhd2FpdCB0aGlzLnF1ZXVlTWF0Y2hlcyhhcHAsIG5ldyBVaW50OEFycmF5KHZlcmlmaWVkUXVldWUpLCB2ZXJpZmllZFNldHRpbmdzLm9mZnNldCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICBhd2FpdCB0aGlzLnB1Ymxpc2hQcmV2aW91cyhzdGFnZWQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IHRoaXMubm9kZS5mcy5ybShzdGFnZWQsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVhZFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3MgfCBudWxsPiB7XG4gICAgdHJ5IHsgcmV0dXJuIHZhbGlkU2V0dGluZ3MoSlNPTi5wYXJzZShhd2FpdCB0aGlzLm5vZGUuZnMucmVhZEZpbGUodGhpcy5zZXR0aW5nc1BhdGgsIFwidXRmOFwiKSkpOyB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfVxuICBwcml2YXRlIGFzeW5jIHJlYWRRdWV1ZSgpOiBQcm9taXNlPFVpbnQ4QXJyYXkgfCBudWxsPiB7XG4gICAgdHJ5IHsgcmV0dXJuIHZhbGlkUXVldWUobmV3IFVpbnQ4QXJyYXkoYXdhaXQgdGhpcy5ub2RlLmZzLnJlYWRGaWxlKHRoaXMucXVldWVQYXRoKSkpOyB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfVxuICBwcml2YXRlIGFzeW5jIHJlYWRMZWdhY3lRdWV1ZShhcHA6IEFwcCk6IFByb21pc2U8VWludDhBcnJheSB8IG51bGw+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYWRhcHRlcjogYW55ID0gYXBwLnZhdWx0LmFkYXB0ZXI7XG4gICAgICBpZiAoIShhd2FpdCBhZGFwdGVyLmV4aXN0cyh0aGlzLmxlZ2FjeVF1ZXVlUGF0aCkpKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB2YWxpZFF1ZXVlKHRvQnl0ZXMoYXdhaXQgYWRhcHRlci5yZWFkQmluYXJ5KHRoaXMubGVnYWN5UXVldWVQYXRoKSkpO1xuICAgIH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9XG4gIHByaXZhdGUgYXN5bmMgcXVldWVNYXRjaGVzKGFwcDogQXBwLCBieXRlczogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYWRhcHRlcjogYW55ID0gYXBwLnZhdWx0LmFkYXB0ZXI7XG4gICAgICBjb25zdCB3YXNtID0gYWRhcHRlci5nZXRSZXNvdXJjZVBhdGgoYCR7dGhpcy53YXNtRGlyZWN0b3J5fS9zcWwtd2FzbS53YXNtYCk7XG4gICAgICBjb25zdCBTUUwgPSBhd2FpdCAoYXdhaXQgbG9hZFNxbEpzKCkpKHsgbG9jYXRlRmlsZTogKCkgPT4gd2FzbSB9KTtcbiAgICAgIGNvbnN0IGRhdGFiYXNlID0gbmV3IFNRTC5EYXRhYmFzZShieXRlcyk7XG4gICAgICBjb25zdCBpbnRlZ3JpdHkgPSBkYXRhYmFzZS5leGVjKFwiUFJBR01BIGludGVncml0eV9jaGVja1wiKVswXT8udmFsdWVzWzBdPy5bMF0gPT09IFwib2tcIjtcbiAgICAgIGNvbnN0IHRhYmxlID0gZGF0YWJhc2UuZXhlYyhcIlNFTEVDVCAxIEZST00gc3FsaXRlX21hc3RlciBXSEVSRSB0eXBlID0gJ3RhYmxlJyBBTkQgbmFtZSA9ICd1cGRhdGVzJ1wiKVswXT8udmFsdWVzLmxlbmd0aDtcbiAgICAgIGNvbnN0IG1heGltdW0gPSBkYXRhYmFzZS5leGVjKFwiU0VMRUNUIE1BWCh1cGRhdGVfaWQpIEFTIG9mZnNldCBGUk9NIHVwZGF0ZXNcIilbMF0/LnZhbHVlc1swXT8uWzBdO1xuICAgICAgZGF0YWJhc2UuY2xvc2UoKTtcbiAgICAgIHJldHVybiBCb29sZWFuKGludGVncml0eSAmJiB0YWJsZSAmJiAobWF4aW11bSA9PT0gbnVsbCA/IG9mZnNldCA9PT0gMCA6IE51bWJlcihtYXhpbXVtKSA9PT0gb2Zmc2V0KSk7XG4gICAgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9XG4gIHByaXZhdGUgYXN5bmMgZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRyeSB7IGF3YWl0IHRoaXMubm9kZS5mcy5hY2Nlc3MocGF0aCk7IHJldHVybiB0cnVlOyB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cbiAgcHJpdmF0ZSBhc3luYyBkaXJlY3RvcnlFeGlzdHMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCB0aGlzLm5vZGUuZnMuc3RhdCh0aGlzLmRpcmVjdG9yeSkpLmlzRGlyZWN0b3J5KCk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuICBwcml2YXRlIGFzeW5jIHdpdGhSZWNvdmVyeShhcHA6IEFwcCwgbWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5wcmV2aW91c0lzR29vZChhcHApXG4gICAgICA/IGAke21lc3NhZ2V9IEEgcHJldmlvdXMtZ29vZCBwcml2YXRlLXN0YXRlIGJhY2t1cCBpcyBhdmFpbGFibGUgYXQgJHt0aGlzLnByZXZpb3VzRGlyZWN0b3J5fTsgcmVjb3ZlcnkgaXMgbWFudWFsLmBcbiAgICAgIDogbWVzc2FnZTtcbiAgfVxuICBwcml2YXRlIGFzeW5jIHByZXZpb3VzSXNHb29kKGFwcDogQXBwKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFtzZXR0aW5nc1RleHQsIHF1ZXVlXSA9IGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLm5vZGUuZnMucmVhZEZpbGUodGhpcy5wcmV2aW91c1NldHRpbmdzUGF0aCwgXCJ1dGY4XCIpLCB0aGlzLm5vZGUuZnMucmVhZEZpbGUodGhpcy5wcmV2aW91c1F1ZXVlUGF0aCldKTtcbiAgICAgIGNvbnN0IHNldHRpbmdzID0gdmFsaWRTZXR0aW5ncyhKU09OLnBhcnNlKHNldHRpbmdzVGV4dCkpO1xuICAgICAgcmV0dXJuIEJvb2xlYW4oc2V0dGluZ3MgJiYgdmFsaWRRdWV1ZShuZXcgVWludDhBcnJheShxdWV1ZSkpICYmIGF3YWl0IHRoaXMucXVldWVNYXRjaGVzKGFwcCwgbmV3IFVpbnQ4QXJyYXkocXVldWUpLCBzZXR0aW5ncy5vZmZzZXQpKTtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cbiAgYXN5bmMgcHJvdGVjdFF1ZXVlTXV0YXRpb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgW2hhc1NldHRpbmdzLCBoYXNRdWV1ZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5leGlzdHModGhpcy5zZXR0aW5nc1BhdGgpLCB0aGlzLmV4aXN0cyh0aGlzLnF1ZXVlUGF0aCldKTtcbiAgICBpZiAoIWhhc1NldHRpbmdzICYmICFoYXNRdWV1ZSkgcmV0dXJuOyAvLyBFeHBsaWNpdCBmcmVzaCBpbml0aWFsaXphdGlvbiBpcyB0aGUgb25seSBuby1wcmlvci1wYWlyIGNhc2UuXG4gICAgaWYgKCFoYXNTZXR0aW5ncyB8fCAhaGFzUXVldWUgfHwgIShhd2FpdCB0aGlzLnNuYXBzaG90UHJldmlvdXMoKSkpIHRocm93IG5ldyBFcnJvcihcIlByaXZhdGUgc3RhdGUgYmFja3VwIGNvdWxkIG5vdCBiZSB2ZXJpZmllZDsgcmVmdXNpbmcgdG8gcmVwbGFjZSB0aGUgcXVldWUuXCIpO1xuICB9XG4gIHByaXZhdGUgYXN5bmMgcmVxdWlyZVNldHRpbmdzV3JpdGUobmV4dDogU2V0dGluZ3MsIHNuYXBzaG90OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgW3NldHRpbmdzLCBxdWV1ZV0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5yZWFkU2V0dGluZ3MoKSwgdGhpcy5yZWFkUXVldWUoKV0pO1xuICAgIGlmICghc2V0dGluZ3MgJiYgIXF1ZXVlKSByZXR1cm47IC8vIEV4cGxpY2l0IGZyZXNoIGluaXRpYWxpemF0aW9uLlxuICAgIGlmICghc2V0dGluZ3MgJiYgcXVldWUgJiYgIXNuYXBzaG90ICYmIGF3YWl0IHRoaXMucXVldWVNYXRjaGVzKHRoaXMuYXBwLCBxdWV1ZSwgbmV4dC5vZmZzZXQpKSByZXR1cm47IC8vIEZpbmlzaCBleHBsaWNpdCBmcmVzaCBxdWV1ZS1maXJzdCBpbml0aWFsaXphdGlvbi5cbiAgICBpZiAoIXNldHRpbmdzIHx8ICFxdWV1ZSkgdGhyb3cgbmV3IEVycm9yKFwiUHJpdmF0ZSBzdGF0ZSBpcyBub3QgY29tcGxldGU7IHJlZnVzaW5nIHRvIHJlcGxhY2Ugc2V0dGluZ3MuXCIpO1xuICAgIGlmIChhd2FpdCB0aGlzLnF1ZXVlTWF0Y2hlcyh0aGlzLmFwcCwgcXVldWUsIHNldHRpbmdzLm9mZnNldCkpIHtcbiAgICAgIGlmIChzbmFwc2hvdCAmJiAhKGF3YWl0IHRoaXMuc25hcHNob3RQcmV2aW91cygpKSkgdGhyb3cgbmV3IEVycm9yKFwiUHJpdmF0ZSBzdGF0ZSBiYWNrdXAgY291bGQgbm90IGJlIHZlcmlmaWVkOyByZWZ1c2luZyB0byByZXBsYWNlIHNldHRpbmdzLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQSBxdWV1ZS1maXJzdCB1cGRhdGUgbWF5IG9ubHkgYmUgY29tcGxldGVkIGJ5IHdyaXRpbmcgdGhlIGV4YWN0IGR1cmFibGUgcXVldWUgb2Zmc2V0LlxuICAgIGlmICghc25hcHNob3QgJiYgYXdhaXQgdGhpcy5xdWV1ZU1hdGNoZXModGhpcy5hcHAsIHF1ZXVlLCBuZXh0Lm9mZnNldCkpIHJldHVybjtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQcml2YXRlIHN0YXRlIGlzIGluY29uc2lzdGVudDsgcmVmdXNpbmcgdG8gcmVwbGFjZSBzZXR0aW5ncy5cIik7XG4gIH1cbiAgcHJpdmF0ZSByZW1lbWJlcihzZXR0aW5nczogU2V0dGluZ3MpOiB2b2lkIHsgdGhpcy5sYXN0T2Zmc2V0ID0gc2V0dGluZ3Mub2Zmc2V0OyB9XG4gIHByaXZhdGUgYXN5bmMgc3RhZ2VNaWdyYXRpb24oYXBwOiBBcHAsIHNldHRpbmdzOiBTZXR0aW5ncywgcXVldWU6IFVpbnQ4QXJyYXkpOiBQcm9taXNlPFNldHRpbmdzPiB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5ub2RlLnBhdGguZGlybmFtZSh0aGlzLmRpcmVjdG9yeSk7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMubm9kZS5wYXRoLmJhc2VuYW1lKHRoaXMuZGlyZWN0b3J5KTtcbiAgICBhd2FpdCB0aGlzLm5vZGUuZnMubWtkaXIocGFyZW50LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICBjb25zdCBzdGFnZWQgPSBhd2FpdCB0aGlzLm5vZGUuZnMubWtkdGVtcCh0aGlzLm5vZGUucGF0aC5qb2luKHBhcmVudCwgYC4ke25hbWV9Lm1pZ3JhdGlvbi1gKSk7XG4gICAgY29uc3Qgc3RhZ2VkU2V0dGluZ3MgPSB0aGlzLm5vZGUucGF0aC5qb2luKHN0YWdlZCwgXCJzZXR0aW5ncy5qc29uXCIpO1xuICAgIGNvbnN0IHN0YWdlZFF1ZXVlID0gdGhpcy5ub2RlLnBhdGguam9pbihzdGFnZWQsIFwicXVldWUuc3FsaXRlXCIpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMubm9kZS5mcy53cml0ZUZpbGUoc3RhZ2VkU2V0dGluZ3MsIHRleHQsIFwidXRmOFwiKSwgdGhpcy5ub2RlLmZzLndyaXRlRmlsZShzdGFnZWRRdWV1ZSwgcXVldWUpXSk7XG4gICAgICBjb25zdCBbdmVyaWZpZWRUZXh0LCB2ZXJpZmllZFF1ZXVlXSA9IGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLm5vZGUuZnMucmVhZEZpbGUoc3RhZ2VkU2V0dGluZ3MsIFwidXRmOFwiKSwgdGhpcy5ub2RlLmZzLnJlYWRGaWxlKHN0YWdlZFF1ZXVlKV0pO1xuICAgICAgY29uc3QgdmVyaWZpZWRTZXR0aW5ncyA9IHZhbGlkU2V0dGluZ3MoSlNPTi5wYXJzZSh2ZXJpZmllZFRleHQpKTtcbiAgICAgIGlmICh2ZXJpZmllZFRleHQgIT09IHRleHQgfHwgIXZlcmlmaWVkU2V0dGluZ3MgfHwgIXNhbWVCeXRlcyhxdWV1ZSwgdmVyaWZpZWRRdWV1ZSkgfHwgIShhd2FpdCB0aGlzLnF1ZXVlTWF0Y2hlcyhhcHAsIG5ldyBVaW50OEFycmF5KHZlcmlmaWVkUXVldWUpLCB2ZXJpZmllZFNldHRpbmdzLm9mZnNldCkpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcml2YXRlIHN0YXRlIHZlcmlmaWNhdGlvbiBmYWlsZWQuXCIpO1xuICAgICAgYXdhaXQgdGhpcy5ub2RlLmZzLnJlbmFtZShzdGFnZWQsIHRoaXMuZGlyZWN0b3J5KTtcbiAgICAgIHJldHVybiB2ZXJpZmllZFNldHRpbmdzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhd2FpdCB0aGlzLm5vZGUuZnMucm0oc3RhZ2VkLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIGFzeW5jIHB1Ymxpc2hQcmV2aW91cyhzdGFnZWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHByZXZpb3VzRXhpc3RzID0gYXdhaXQgdGhpcy5leGlzdHModGhpcy5wcmV2aW91c0RpcmVjdG9yeSk7XG4gICAgY29uc3Qgb2xkID0gYCR7dGhpcy5wcmV2aW91c0RpcmVjdG9yeX0ub2xkLSR7RGF0ZS5ub3coKX1gO1xuICAgIGlmIChwcmV2aW91c0V4aXN0cykgYXdhaXQgdGhpcy5ub2RlLmZzLnJlbmFtZSh0aGlzLnByZXZpb3VzRGlyZWN0b3J5LCBvbGQpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLm5vZGUuZnMucmVuYW1lKHN0YWdlZCwgdGhpcy5wcmV2aW91c0RpcmVjdG9yeSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChwcmV2aW91c0V4aXN0cykgYXdhaXQgdGhpcy5ub2RlLmZzLnJlbmFtZShvbGQsIHRoaXMucHJldmlvdXNEaXJlY3RvcnkpLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgaWYgKHByZXZpb3VzRXhpc3RzKSBhd2FpdCB0aGlzLm5vZGUuZnMucm0ob2xkLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5ld0xvY2FsU3RhdGUoYXBwOiBBcHAsIHBsdWdpbkRpcmVjdG9yeTogc3RyaW5nKTogUHJvbWlzZTxMb2NhbFN0YXRlPiB7XG4gIGNvbnN0IG5vZGUgPSBhd2FpdCBsb2FkTm9kZSgpO1xuICBjb25zdCB2YXVsdFBhdGggPSBTdHJpbmcoKGFwcC52YXVsdC5hZGFwdGVyIGFzIGFueSkuZ2V0QmFzZVBhdGg/LigpID8/IGFwcC52YXVsdC5nZXROYW1lKCkpO1xuICBjb25zdCBkaXJlY3RvcnkgPSBub2RlLnBhdGguam9pbihub2RlLm9zLmhvbWVkaXIoKSwgXCJMaWJyYXJ5XCIsIFwiQXBwbGljYXRpb24gU3VwcG9ydFwiLCBcIk9ic2lkaWFuXCIsIFwiZGFpbHktaW50YWtlXCIsIHN0YWJsZUlkKHZhdWx0UGF0aCkpO1xuICByZXR1cm4gbmV3IExvY2FsU3RhdGUoYXBwLCBub2RlLCBkaXJlY3RvcnksIG5vZGUucGF0aC5qb2luKGRpcmVjdG9yeSwgXCJzZXR0aW5ncy5qc29uXCIpLCBub2RlLnBhdGguam9pbihkaXJlY3RvcnksIFwicXVldWUuc3FsaXRlXCIpLCBgJHtwbHVnaW5EaXJlY3Rvcnl9L2RhdGEuanNvbmAsIGAke3BsdWdpbkRpcmVjdG9yeX0vcXVldWUuc3FsaXRlYCwgcGx1Z2luRGlyZWN0b3J5KTtcbn1cblxuZnVuY3Rpb24gYmxvY2tlZChyZWFzb246IHN0cmluZyk6IExvY2FsU3RhdGVMb2FkIHsgcmV0dXJuIHsgc3RhdGU6IG51bGwsIHNldHRpbmdzOiB7IC4uLkRFRkFVTFRfU0VUVElOR1MsIHN0YXR1czogcmVhc29uIH0sIHJlYXNvbiB9OyB9XG5mdW5jdGlvbiB2YWxpZFF1ZXVlKHZhbHVlOiBVaW50OEFycmF5KTogVWludDhBcnJheSB8IG51bGwge1xuICByZXR1cm4gdmFsdWUuYnl0ZUxlbmd0aCA+PSAxNiAmJiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUodmFsdWUuc2xpY2UoMCwgMTYpKSA9PT0gXCJTUUxpdGUgZm9ybWF0IDNcXHUwMDAwXCIgPyB2YWx1ZSA6IG51bGw7XG59XG5mdW5jdGlvbiB2YWxpZFNldHRpbmdzKHZhbHVlOiB1bmtub3duKTogU2V0dGluZ3MgfCBudWxsIHtcbiAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzb3VyY2UgPSB2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgY29uc3QgbnVtYmVyT3JOdWxsID0gKGtleToga2V5b2YgU2V0dGluZ3MpID0+IHNvdXJjZVtrZXldID09PSBudWxsIHx8ICh0eXBlb2Ygc291cmNlW2tleV0gPT09IFwibnVtYmVyXCIgJiYgTnVtYmVyLmlzU2FmZUludGVnZXIoc291cmNlW2tleV0pKTtcbiAgaWYgKHR5cGVvZiBzb3VyY2UuZW5hYmxlZCAhPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIHNvdXJjZS50b2tlbiAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Ygc291cmNlLm9mZnNldCAhPT0gXCJudW1iZXJcIiB8fCAhTnVtYmVyLmlzU2FmZUludGVnZXIoc291cmNlLm9mZnNldCkgfHwgc291cmNlLm9mZnNldCA8IDAgfHwgIW51bWJlck9yTnVsbChcIm93bmVyVXNlcklkXCIpIHx8ICFudW1iZXJPck51bGwoXCJvd25lckNoYXRJZFwiKSB8fCB0eXBlb2Ygc291cmNlLnBhaXJBcm1lZCAhPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIHNvdXJjZS5qb3VybmFsICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBzb3VyY2UuYXR0YWNobWVudFJvb3QgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHNvdXJjZS5zdGF0dXMgIT09IFwic3RyaW5nXCIpIHJldHVybiBudWxsO1xuICByZXR1cm4geyAuLi5ERUZBVUxUX1NFVFRJTkdTLCAuLi5zb3VyY2UgfSBhcyBTZXR0aW5ncztcbn1cbmZ1bmN0aW9uIHRvQnl0ZXModmFsdWU6IFVpbnQ4QXJyYXkgfCBBcnJheUJ1ZmZlcik6IFVpbnQ4QXJyYXkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5ID8gbmV3IFVpbnQ4QXJyYXkodmFsdWUpIDogbmV3IFVpbnQ4QXJyYXkodmFsdWUpOyB9XG5mdW5jdGlvbiBzYW1lQnl0ZXMoZmlyc3Q6IFVpbnQ4QXJyYXksIHNlY29uZDogVWludDhBcnJheSk6IGJvb2xlYW4geyByZXR1cm4gZmlyc3QuYnl0ZUxlbmd0aCA9PT0gc2Vjb25kLmJ5dGVMZW5ndGggJiYgZmlyc3QuZXZlcnkoKGJ5dGUsIGluZGV4KSA9PiBieXRlID09PSBzZWNvbmRbaW5kZXhdKTsgfVxuZnVuY3Rpb24gc3RhYmxlSWQodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBoYXNoID0gMjE2NjEzNjI2MTtcbiAgZm9yIChjb25zdCBjaGFyIG9mIHZhbHVlKSB7IGhhc2ggXj0gY2hhci5jaGFyQ29kZUF0KDApOyBoYXNoID0gTWF0aC5pbXVsKGhhc2gsIDE2Nzc3NjE5KTsgfVxuICByZXR1cm4gYHZhdWx0LSR7KGhhc2ggPj4+IDApLnRvU3RyaW5nKDE2KX1gO1xufVxuYXN5bmMgZnVuY3Rpb24gbG9hZE5vZGUoKTogUHJvbWlzZTxOb2RlTW9kdWxlcz4ge1xuICAvLyBFbGVjdHJvbidzIHJlbmRlcmVyIHJlc29sdmVzIG5hdGl2ZSBkeW5hbWljIGltcG9ydHMgYXMgYnJvd3NlciBtb2R1bGVzOyByZXF1aXJlIHN0YXlzIGxhenkgaGVyZS5cbiAgcmV0dXJuIHtcbiAgICBmczogcmVxdWlyZShcIm5vZGU6ZnMvcHJvbWlzZXNcIikgYXMgdHlwZW9mIGltcG9ydChcIm5vZGU6ZnMvcHJvbWlzZXNcIiksXG4gICAgb3M6IHJlcXVpcmUoXCJub2RlOm9zXCIpIGFzIHR5cGVvZiBpbXBvcnQoXCJub2RlOm9zXCIpLFxuICAgIHBhdGg6IHJlcXVpcmUoXCJub2RlOnBhdGhcIikgYXMgdHlwZW9mIGltcG9ydChcIm5vZGU6cGF0aFwiKSxcbiAgfTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFRlbGVncmFtTWVzc2FnZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBUZWxlZ3JhbSBjb21tYW5kcyBhcmUgbmV2ZXIgY2FwdHVyZXMsIGluY2x1ZGluZyBAYm90LWFkZHJlc3NlZCB2YXJpYW50cy4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZWxlZ3JhbUNvbW1hbmQodGV4dDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIHJldHVybiAvXlxcLyhbYS16MC05X10rKSg/OkBbXlxcc10rKT8oPzpcXHN8JCkvaS5leGVjKHRleHQgPz8gXCJcIik/LlsxXS50b0xvd2VyQ2FzZSgpID8/IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY2NlcHRzUHJpdmF0ZVNlbmRlcihtZXNzYWdlOiBUZWxlZ3JhbU1lc3NhZ2UgfCB1bmRlZmluZWQsIHNlbmRlcklkOiBudW1iZXIgfCB1bmRlZmluZWQsIHVzZXJJZDogbnVtYmVyIHwgbnVsbCwgY2hhdElkOiBudW1iZXIgfCBudWxsLCBwYWlyaW5nQXJtZWQ6IGJvb2xlYW4pOiBcInBhaXJcIiB8IFwib3duZXJcIiB8IG51bGwge1xuICBpZiAoIW1lc3NhZ2UgfHwgc2VuZGVySWQgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlLmNoYXQudHlwZSAhPT0gXCJwcml2YXRlXCIpIHJldHVybiBudWxsO1xuICBpZiAocGFpcmluZ0FybWVkICYmIHVzZXJJZCA9PT0gbnVsbCkgcmV0dXJuIFwicGFpclwiO1xuICByZXR1cm4gc2VuZGVySWQgPT09IHVzZXJJZCAmJiBtZXNzYWdlLmNoYXQuaWQgPT09IGNoYXRJZCA/IFwib3duZXJcIiA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncm91cEtleShpZDogbnVtYmVyLCBtZWRpYUdyb3VwSWQ/OiBzdHJpbmcpOiBzdHJpbmcgeyByZXR1cm4gbWVkaWFHcm91cElkID8/IFN0cmluZyhpZCk7IH1cblxuLyoqIEEgam91cm5hbCBkYXkgZW5kcyBhdCAwNDowMCBpbiB0aGUgZGV2aWNlJ3MgbG9jYWwgdGltZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRha2VEYXRlKG1pbGxpc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKG1pbGxpc2Vjb25kcyk7XG4gIGlmIChkYXRlLmdldEhvdXJzKCkgPCA0KSBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAxKTtcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHtTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfS0ke1N0cmluZyhkYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8qKiBQcmVzZXJ2ZSBwcm9zZSB3aGlsZSBwcmV2ZW50aW5nIGEgVGVsZWdyYW0gbGluZSBmcm9tIGJlY29taW5nIGFuIEgxIG9yIGNhbGxvdXQgYm91bmRhcnkuICovXG5leHBvcnQgZnVuY3Rpb24gc2FmZVByb3NlKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB0ZXh0XG4gICAgLnJlcGxhY2UoL15cXHMqI3sxLDZ9XFxzL2dtLCAoaGVhZGluZykgPT4gYFxcXFwke2hlYWRpbmcudHJpbVN0YXJ0KCl9YClcbiAgICAucmVwbGFjZSgvXlxccyo+L2dtLCBcIlxcXFw+XCIpXG4gICAgLnJlcGxhY2UoL15cXHMqLSBcXFtbIHhYXVxcXS9nbSwgKHRhc2spID0+IGBcXFxcJHt0YXNrLnRyaW1TdGFydCgpfWApXG4gICAgLnJlcGxhY2UoL15cXHMqIVxcW1xcWy9nbSwgXCJcXFxcIVtbXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbG91dExpbmVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBzYWZlUHJvc2UodGV4dCkuc3BsaXQoXCJcXG5cIikubWFwKChsaW5lKSA9PiBgPiAke2xpbmV9YCkuam9pbihcIlxcblwiKTsgfVxuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNobWVudFN0ZW0odmFsdWU6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBgJHt2YWx1ZS5yZXBsYWNlKC9bXmEtekEtWjAtOS5fLV0rL2csIFwiLVwiKS5yZXBsYWNlKC9eLSt8LSskL2csIFwiXCIpLnNsaWNlKDAsIDcyKSB8fCBcInRlbGVncmFtLWZpbGVcIn0tJHtzdGFibGVTdWZmaXgodmFsdWUpfWA7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaG1lbnRQYXRoKHJvb3Q6IHN0cmluZywgZGF0ZTogc3RyaW5nLCBmaWxlSWRlbnRpdHk6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcsIGlzVm9pY2UgPSBmYWxzZSk6IHN0cmluZyB7XG4gIGNvbnN0IHByZWZpeCA9IGlzVm9pY2UgPyBcInRlbGVncmFtLXZvaWNlLVwiIDogXCJcIjtcbiAgcmV0dXJuIGAke3Jvb3QucmVwbGFjZSgvXlxcLyt8XFwvKyQvZywgXCJcIil9LyR7ZGF0ZX0vJHtwcmVmaXh9JHthdHRhY2htZW50U3RlbShmaWxlSWRlbnRpdHkpfS4ke2V4dGVuc2lvbi5yZXBsYWNlKC9eXFwuLywgXCJcIil9YDtcbn1cblxuLyoqIFN0YXNoZWQgaW1hZ2VzIGFyZSBuYW1lZCBieSBsb2NhbCBjYXB0dXJlIHRpbWUgc28gYSBjaGF0IGNhbiBmaW5kIFwidGhlIHBhZ2VzIEkganVzdCBzZW50XCIgaW4gb3JkZXIuICovXG5leHBvcnQgZnVuY3Rpb24gc3Rhc2hQYXRoKGZvbGRlcjogc3RyaW5nLCBtaWxsaXNlY29uZHM6IG51bWJlciwgaW5kZXg6IG51bWJlciwgZXh0ZW5zaW9uOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUobWlsbGlzZWNvbmRzKTtcbiAgY29uc3QgcGFkID0gKHZhbHVlOiBudW1iZXIpID0+IFN0cmluZyh2YWx1ZSkucGFkU3RhcnQoMiwgXCIwXCIpO1xuICByZXR1cm4gYCR7Zm9sZGVyfS8ke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHtwYWQoZGF0ZS5nZXRNb250aCgpICsgMSl9LSR7cGFkKGRhdGUuZ2V0RGF0ZSgpKX0tJHtwYWQoZGF0ZS5nZXRIb3VycygpKX0ke3BhZChkYXRlLmdldE1pbnV0ZXMoKSl9JHtwYWQoZGF0ZS5nZXRTZWNvbmRzKCkpfS0ke2luZGV4fS4ke2V4dGVuc2lvbi5yZXBsYWNlKC9eXFwuLywgXCJcIil9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW1hZ2UobWVzc2FnZTogVGVsZWdyYW1NZXNzYWdlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKG1lc3NhZ2UucGhvdG8/Lmxlbmd0aCB8fCBtZXNzYWdlLmRvY3VtZW50Py5taW1lX3R5cGU/LnN0YXJ0c1dpdGgoXCJpbWFnZS9cIikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x1dGlvblN0YXRlKGF2YWlsYWJsZTogYm9vbGVhbik6IFwiY2xhaW1cIiB8IFwiYWxyZWFkeS1yZXNvbHZlZFwiIHsgcmV0dXJuIGF2YWlsYWJsZSA/IFwiY2xhaW1cIiA6IFwiYWxyZWFkeS1yZXNvbHZlZFwiOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5DbGFpbUlkcyhpZHM6IG51bWJlcltdKTogYm9vbGVhbiB7IHJldHVybiBpZHMubGVuZ3RoID4gMDsgfVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTZWxlY3Rpb25JZHModGV4dDogc3RyaW5nIHwgdW5kZWZpbmVkKTogbnVtYmVyW10gfCBudWxsIHtcbiAgY29uc3QgdmFsdWUgPSB0ZXh0Py50cmltKCk7XG4gIGlmICghdmFsdWUgfHwgIS9eXFxkKyg/OltcXHMsXStcXGQrKSokLy50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGlkcyA9IHZhbHVlLnNwbGl0KC9bXFxzLF0rLykubWFwKE51bWJlcik7XG4gIGlmIChpZHMuc29tZSgoaWQpID0+ICFOdW1iZXIuaXNTYWZlSW50ZWdlcihpZCkgfHwgaWQgPD0gMCkpIHJldHVybiBudWxsO1xuICByZXR1cm4gWy4uLm5ldyBTZXQoaWRzKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N1cHBvcnRlZENvbnRlbnQobWVzc2FnZTogVGVsZWdyYW1NZXNzYWdlKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKG1lc3NhZ2UudGV4dCB8fCBtZXNzYWdlLmNhcHRpb24gfHwgbWVzc2FnZS52b2ljZSB8fCBtZXNzYWdlLmF1ZGlvIHx8IG1lc3NhZ2UucGhvdG8/Lmxlbmd0aCB8fCBtZXNzYWdlLnZpZGVvIHx8IG1lc3NhZ2UuZG9jdW1lbnQgfHwgbWVzc2FnZS5hbmltYXRpb24pO1xufVxuXG5mdW5jdGlvbiBzdGFibGVTdWZmaXgodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7IGxldCBoYXNoID0gMjE2NjEzNjI2MTsgZm9yIChjb25zdCBjaGFyYWN0ZXIgb2YgdmFsdWUpIGhhc2ggPSBNYXRoLmltdWwoaGFzaCBeIGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApLCAxNjc3NzYxOSk7IHJldHVybiAoaGFzaCA+Pj4gMCkudG9TdHJpbmcoMzYpOyB9XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIHsgQmluYXJ5U3RvcmUgfSBmcm9tIFwiLi9sb2NhbC1zdGF0ZVwiO1xuaW1wb3J0IHsgbG9hZFNxbEpzIH0gZnJvbSBcIi4vc3FsLWxvYWRlclwiO1xuaW1wb3J0IHR5cGUgeyBCb3RTZXNzaW9uLCBDYXB0dXJlRGVzaWduYXRpb24sIEludGFrZUtpbmQsIFF1ZXVlSXRlbSwgUXVldWVTdGF0ZSwgU2Vzc2lvbk1vZGUsIFRlbGVncmFtTWVzc2FnZSwgVGVsZWdyYW1VcGRhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgY2FuQ2xhaW1JZHMgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IFNDSEVNQSA9IGBcbkNSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHVwZGF0ZXMgKFxuICB1cGRhdGVfaWQgSU5URUdFUiBQUklNQVJZIEtFWSwgcmF3IFRFWFQgTk9UIE5VTEwsIHJlY2VpdmVkX2F0IElOVEVHRVIgTk9UIE5VTExcbik7XG5DUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBxdWV1ZSAoXG4gIGlkIElOVEVHRVIgUFJJTUFSWSBLRVkgQVVUT0lOQ1JFTUVOVCwgdXBkYXRlX2lkIElOVEVHRVIgTk9UIE5VTEwgVU5JUVVFLFxuICBzdGF0ZSBURVhUIE5PVCBOVUxMLCBraW5kIFRFWFQsIGRlc2lnbmF0aW9uIFRFWFQgTk9UIE5VTEwgREVGQVVMVCAnZGFpbHknLCBwYXlsb2FkIFRFWFQgTk9UIE5VTEwsIG1lZGlhX2dyb3VwX2lkIFRFWFQsXG4gIGNyZWF0ZWRfYXQgSU5URUdFUiBOT1QgTlVMTCwgdXBkYXRlZF9hdCBJTlRFR0VSIE5PVCBOVUxMLCBlcnJvciBURVhULFxuICBwcm9tcHRfY2hhdF9pZCBJTlRFR0VSLCBwcm9tcHRfbWVzc2FnZV9pZCBJTlRFR0VSLCBkZWZlcnJlZF91bnRpbCBJTlRFR0VSLCBjbGFpbV9zdGFydGVkX2F0IElOVEVHRVJcbik7XG5DUkVBVEUgSU5ERVggSUYgTk9UIEVYSVNUUyBxdWV1ZV9zdGF0ZV9jcmVhdGVkIE9OIHF1ZXVlKHN0YXRlLCBjcmVhdGVkX2F0KTtcbkNSRUFURSBJTkRFWCBJRiBOT1QgRVhJU1RTIHF1ZXVlX2dyb3VwIE9OIHF1ZXVlKG1lZGlhX2dyb3VwX2lkLCBzdGF0ZSk7XG5DUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBhdHRhY2htZW50X3BhdGhzIChpZGVudGl0eSBURVhUIFBSSU1BUlkgS0VZLCBwYXRoIFRFWFQgTk9UIE5VTEwpO1xuQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYm90X3Nlc3Npb24gKFxuICBpZCBJTlRFR0VSIFBSSU1BUlkgS0VZIENIRUNLIChpZCA9IDEpLCBtb2RlIFRFWFQgTk9UIE5VTEwsIGxlYWRlcl9pZHMgVEVYVCBOT1QgTlVMTCxcbiAgb3JkaW5hbF9sZWFkZXJfaWRzIFRFWFQgTk9UIE5VTEwgREVGQVVMVCAnW10nLFxuICBtZW51X2NoYXRfaWQgSU5URUdFUiBOT1QgTlVMTCwgbWVudV9tZXNzYWdlX2lkIElOVEVHRVIgTk9UIE5VTEwsIHBhZ2UgSU5URUdFUiBOT1QgTlVMTCxcbiAgYWZ0ZXJfaWQgSU5URUdFUiBOT1QgTlVMTCwgY3JlYXRlZF9hdCBJTlRFR0VSIE5PVCBOVUxMLCB1cGRhdGVkX2F0IElOVEVHRVIgTk9UIE5VTExcbik7XG5gO1xuXG4vKiogQSB0aW55IHNlcmlhbGl6ZWQgc3FsLmpzIHBlcnNpc3RlbmNlIGxheWVyLiBFdmVyeSBzdGF0ZSBjaGFuZ2UgaXMgZXhwb3J0ZWQgYmVmb3JlIGl0IHJlc29sdmVzLiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXVlU3RvcmUge1xuICBwcml2YXRlIGRiOiBhbnk7XG4gIHByaXZhdGUgU1FMOiBhbnk7XG4gIHByaXZhdGUgY2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgcHJpdmF0ZSByZWFkb25seSBwYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgZmlsZXM6IEJpbmFyeVN0b3JlO1xuICBwcml2YXRlIHJlYWRvbmx5IHdhc21EaXJlY3Rvcnk6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBiZWZvcmVGbHVzaD86ICgpID0+IFByb21pc2U8dm9pZD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcHA6IEFwcCwgcGF0aE9yUGx1Z2luRGlyOiBzdHJpbmcsIG9wdGlvbnM/OiB7IGZpbGVzOiBCaW5hcnlTdG9yZTsgd2FzbURpcmVjdG9yeTogc3RyaW5nOyBiZWZvcmVGbHVzaD86ICgpID0+IFByb21pc2U8dm9pZD4gfSkge1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMgPyBwYXRoT3JQbHVnaW5EaXIgOiBgJHtwYXRoT3JQbHVnaW5EaXJ9L3F1ZXVlLnNxbGl0ZWA7XG4gICAgdGhpcy5maWxlcyA9IG9wdGlvbnM/LmZpbGVzID8/ICh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGFzIGFueSk7XG4gICAgdGhpcy53YXNtRGlyZWN0b3J5ID0gb3B0aW9ucz8ud2FzbURpcmVjdG9yeSA/PyBwYXRoT3JQbHVnaW5EaXI7XG4gICAgdGhpcy5iZWZvcmVGbHVzaCA9IG9wdGlvbnM/LmJlZm9yZUZsdXNoO1xuICB9XG5cbiAgYXN5bmMgb3BlbihleHBlY3RlZE9mZnNldCA9IDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhZGFwdGVyOiBhbnkgPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyO1xuICAgIGNvbnN0IHdhc20gPSBhZGFwdGVyLmdldFJlc291cmNlUGF0aChgJHt0aGlzLndhc21EaXJlY3Rvcnl9L3NxbC13YXNtLndhc21gKTtcbiAgICBjb25zdCBTUUwgPSBhd2FpdCAoYXdhaXQgbG9hZFNxbEpzKCkpKHsgbG9jYXRlRmlsZTogKCkgPT4gd2FzbSB9KTtcbiAgICB0aGlzLlNRTCA9IFNRTDtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgIGlmIChleHBlY3RlZE9mZnNldCA+IDApIHtcbiAgICAgIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgMzsgYXR0ZW1wdCArPSAxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGF3YWl0IHRoaXMuZmlsZXMuZXhpc3RzKHRoaXMucGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IG5ldyBTUUwuRGF0YWJhc2UodG9CeXRlcyhhd2FpdCB0aGlzLmZpbGVzLnJlYWRCaW5hcnkodGhpcy5wYXRoKSkpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2FuZGlkYXRlLmV4ZWMoXCJTRUxFQ1QgMSBGUk9NIHVwZGF0ZXMgV0hFUkUgdXBkYXRlX2lkID0gP1wiLCBbZXhwZWN0ZWRPZmZzZXRdKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHRbMF0/LnZhbHVlcy5sZW5ndGgpIHsgdGhpcy5kYiA9IGNhbmRpZGF0ZTsgYnJlYWs7IH1cbiAgICAgICAgICAgIGNhbmRpZGF0ZS5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7IC8qIFJldHJ5IHRyYW5zaWVudCBGaWxlUHJvdmlkZXIgcmVhZHMgd2l0aG91dCB3cml0aW5nLiAqLyB9XG4gICAgICAgIGlmIChhdHRlbXB0IDwgMikgYXdhaXQgcGF1c2UoNTApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmRiKSB0aHJvdyBuZXcgRXJyb3IoYFF1ZXVlIGRhdGFiYXNlIGlzIG1pc3NpbmcgcGVyc2lzdGVkIFRlbGVncmFtIG9mZnNldCAke2V4cGVjdGVkT2Zmc2V0fTsgcmVmdXNpbmcgdG8gb3ZlcndyaXRlIGl0LmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5maWxlcy5leGlzdHModGhpcy5wYXRoKSkgdGhpcy5kYiA9IG5ldyBTUUwuRGF0YWJhc2UodG9CeXRlcyhhd2FpdCB0aGlzLmZpbGVzLnJlYWRCaW5hcnkodGhpcy5wYXRoKSkpO1xuICAgICAgZWxzZSB7IHRoaXMuZGIgPSBuZXcgU1FMLkRhdGFiYXNlKCk7IGNoYW5nZWQgPSB0cnVlOyB9XG4gICAgfVxuICAgIHRoaXMuZGIucnVuKFNDSEVNQSk7XG4gICAgY2hhbmdlZCA9IHRoaXMuYWRkQ29sdW1uKFwiZGVmZXJyZWRfdW50aWwgSU5URUdFUlwiKSB8fCBjaGFuZ2VkO1xuICAgIGNoYW5nZWQgPSB0aGlzLmFkZENvbHVtbihcImNsYWltX3N0YXJ0ZWRfYXQgSU5URUdFUlwiKSB8fCBjaGFuZ2VkO1xuICAgIGNoYW5nZWQgPSB0aGlzLmFkZENvbHVtbihcImRlc2lnbmF0aW9uIFRFWFQgTk9UIE5VTEwgREVGQVVMVCAnZGFpbHknXCIpIHx8IGNoYW5nZWQ7XG4gICAgY2hhbmdlZCA9IHRoaXMuYWRkU2Vzc2lvbkNvbHVtbihcIm9yZGluYWxfbGVhZGVyX2lkcyBURVhUIE5PVCBOVUxMIERFRkFVTFQgJ1tdJ1wiKSB8fCBjaGFuZ2VkO1xuICAgIGlmIChjaGFuZ2VkKSBhd2FpdCB0aGlzLmZsdXNoKCk7XG4gIH1cblxuICBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHsgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHsgdGhpcy5kYj8uY2xvc2UoKTsgfSk7IH1cblxuICByZWNvcmQodXBkYXRlOiBUZWxlZ3JhbVVwZGF0ZSwgbWVzc2FnZTogVGVsZWdyYW1NZXNzYWdlIHwgdW5kZWZpbmVkLCBhY2NlcHRlZDogYm9vbGVhbiwgYmVmb3JlUGVyc2lzdD86ICgpID0+IFByb21pc2U8dm9pZD4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLm9uZShcIlNFTEVDVCAxIEZST00gdXBkYXRlcyBXSEVSRSB1cGRhdGVfaWQgPSA/XCIsIFt1cGRhdGUudXBkYXRlX2lkXSk7XG4gICAgICBpZiAoZXhpc3RpbmcpIHJldHVybiBmYWxzZTtcbiAgICAgIGF3YWl0IGJlZm9yZVBlcnNpc3Q/LigpO1xuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuZGIucnVuKFwiSU5TRVJUIElOVE8gdXBkYXRlcyh1cGRhdGVfaWQsIHJhdywgcmVjZWl2ZWRfYXQpIFZBTFVFUyAoPywgPywgPylcIiwgW3VwZGF0ZS51cGRhdGVfaWQsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZSksIG5vd10pO1xuICAgICAgaWYgKG1lc3NhZ2UgJiYgYWNjZXB0ZWQpIHtcbiAgICAgICAgY29uc3Qgc3RhdGU6IFF1ZXVlU3RhdGUgPSBcInBlbmRpbmdcIjtcbiAgICAgICAgdGhpcy5kYi5ydW4oYElOU0VSVCBJTlRPIHF1ZXVlKHVwZGF0ZV9pZCxzdGF0ZSxwYXlsb2FkLG1lZGlhX2dyb3VwX2lkLGNyZWF0ZWRfYXQsdXBkYXRlZF9hdClcbiAgICAgICAgICBWQUxVRVMgKD8sID8sID8sID8sID8sID8pYCwgW3VwZGF0ZS51cGRhdGVfaWQsIHN0YXRlLCBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSwgbWVzc2FnZS5tZWRpYV9ncm91cF9pZCA/PyBudWxsLCBub3csIG5vd10pO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5mbHVzaCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBzZXR0bGVHcm91cHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICBwZW5kaW5nKGxpbWl0ID0gOCk6IFByb21pc2U8UXVldWVJdGVtW10+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLnJvd3MoXCJTRUxFQ1QgcS4qIEZST00gcXVldWUgcSBXSEVSRSBxLnN0YXRlID0gJ3BlbmRpbmcnIEFORCAocS5kZWZlcnJlZF91bnRpbCBJUyBOVUxMIE9SIHEuZGVmZXJyZWRfdW50aWwgPD0gPykgQU5EIChxLmNsYWltX3N0YXJ0ZWRfYXQgSVMgTlVMTCBPUiBxLmNsYWltX3N0YXJ0ZWRfYXQgPCA/KSBBTkQgKHEubWVkaWFfZ3JvdXBfaWQgSVMgTlVMTCBPUiBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHF1ZXVlIG1lbWJlciBXSEVSRSBtZW1iZXIubWVkaWFfZ3JvdXBfaWQgPSBxLm1lZGlhX2dyb3VwX2lkIEFORCBtZW1iZXIudXBkYXRlZF9hdCA+PSA/KSkgT1JERVIgQlkgcS5jcmVhdGVkX2F0IExJTUlUID9cIiwgW25vdywgbm93IC0gMzAwMDAwLCBub3cgLSAxODAwLCBsaW1pdF0pO1xuICAgICAgcmV0dXJuIHJvd3MubWFwKChyb3cpID0+IHRoaXMuaXRlbShyb3cpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdyb3VwKGl0ZW06IFF1ZXVlSXRlbSk6IFByb21pc2U8UXVldWVJdGVtW10+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFpdGVtLm1lZGlhR3JvdXBJZCkgcmV0dXJuIFtpdGVtXTtcbiAgICAgIHJldHVybiB0aGlzLnJvd3MoXCJTRUxFQ1QgKiBGUk9NIHF1ZXVlIFdIRVJFIHN0YXRlIElOICgncGVuZGluZycsJ2ZhaWxlZCcpIEFORCBtZWRpYV9ncm91cF9pZCA9ID8gQU5EIChjbGFpbV9zdGFydGVkX2F0IElTIE5VTEwgT1IgY2xhaW1fc3RhcnRlZF9hdCA8ID8pIE9SREVSIEJZIGlkXCIsIFtpdGVtLm1lZGlhR3JvdXBJZCwgRGF0ZS5ub3coKSAtIDMwMDAwMF0pLm1hcCgocikgPT4gdGhpcy5pdGVtKHIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGJ5SWQoaWQ6IG51bWJlcik6IFByb21pc2U8UXVldWVJdGVtIHwgbnVsbD4ge1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByb3cgPSB0aGlzLm9uZShcIlNFTEVDVCAqIEZST00gcXVldWUgV0hFUkUgaWQgPSA/IEFORCBzdGF0ZSBJTiAoJ3BlbmRpbmcnLCdmYWlsZWQnKSBBTkQgKGNsYWltX3N0YXJ0ZWRfYXQgSVMgTlVMTCBPUiBjbGFpbV9zdGFydGVkX2F0IDwgPylcIiwgW2lkLCBEYXRlLm5vdygpIC0gMzAwMDAwXSk7XG4gICAgICByZXR1cm4gcm93ID8gdGhpcy5pdGVtKHJvdykgOiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0UHJvbXB0KGlkczogbnVtYmVyW10sIGNoYXRJZDogbnVtYmVyLCBtZXNzYWdlSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7IGZvciAoY29uc3QgaWQgb2YgaWRzKSB0aGlzLmRiLnJ1bihcIlVQREFURSBxdWV1ZSBTRVQgcHJvbXB0X2NoYXRfaWQ9PywgcHJvbXB0X21lc3NhZ2VfaWQ9PywgdXBkYXRlZF9hdD0/IFdIRVJFIGlkPT9cIiwgW2NoYXRJZCwgbWVzc2FnZUlkLCBEYXRlLm5vdygpLCBpZF0pOyBhd2FpdCB0aGlzLmZsdXNoKCk7IH0pO1xuICB9XG5cbiAgc2V0RGVzaWduYXRpb24obGVhZGVySWQ6IG51bWJlciwgZGVzaWduYXRpb246IENhcHR1cmVEZXNpZ25hdGlvbik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpdGVtcyA9IHRoaXMuZXhwYW5kTGVhZGVycyhbbGVhZGVySWRdKTtcbiAgICAgIGlmICghaXRlbXMpIHRocm93IG5ldyBFcnJvcihcIlF1ZXVlIGl0ZW0gaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZS5cIik7XG4gICAgICBjb25zdCBpZHMgPSBpdGVtcy5tYXAoKGl0ZW0pID0+IGl0ZW0uaWQpO1xuICAgICAgY29uc3QgbWFya3MgPSBpZHMubWFwKCgpID0+IFwiP1wiKS5qb2luKFwiLFwiKTtcbiAgICAgIHRoaXMuZGIucnVuKGBVUERBVEUgcXVldWUgU0VUIGRlc2lnbmF0aW9uPT8sIHVwZGF0ZWRfYXQ9PyBXSEVSRSBpZCBJTiAoJHttYXJrc30pYCwgW2Rlc2lnbmF0aW9uLCBEYXRlLm5vdygpLCAuLi5pZHNdKTtcbiAgICAgIGF3YWl0IHRoaXMuZmx1c2goKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsYWltKGlkczogbnVtYmVyW10sIGtpbmQ6IEludGFrZUtpbmQpOiBQcm9taXNlPFF1ZXVlSXRlbVtdIHwgbnVsbD4ge1xuICAgIGlmICghY2FuQ2xhaW1JZHMoaWRzKSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWFya3MgPSBpZHMubWFwKCgpID0+IFwiP1wiKS5qb2luKFwiLFwiKTtcbiAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLnJvd3MoYFNFTEVDVCAqIEZST00gcXVldWUgV0hFUkUgaWQgSU4gKCR7bWFya3N9KSBBTkQgc3RhdGUgSU4gKCdwZW5kaW5nJywnZmFpbGVkJykgQU5EIChjbGFpbV9zdGFydGVkX2F0IElTIE5VTEwgT1IgY2xhaW1fc3RhcnRlZF9hdCA8ID8pYCwgWy4uLmlkcywgRGF0ZS5ub3coKSAtIDMwMDAwMF0pO1xuICAgICAgaWYgKHJvd3MubGVuZ3RoICE9PSBpZHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICAgIHRoaXMuZGIucnVuKGBVUERBVEUgcXVldWUgU0VUIGtpbmQ9PywgY2xhaW1fc3RhcnRlZF9hdD0/LCB1cGRhdGVkX2F0PT8gV0hFUkUgaWQgSU4gKCR7bWFya3N9KWAsIFtraW5kLCBEYXRlLm5vdygpLCBEYXRlLm5vdygpLCAuLi5pZHNdKTtcbiAgICAgIGF3YWl0IHRoaXMuZmx1c2goKTtcbiAgICAgIHJldHVybiByb3dzLm1hcCgocm93KSA9PiB0aGlzLml0ZW0ocm93KSk7XG4gICAgfSk7XG4gIH1cblxuICBjbGFpbUxlYWRlcnMobGVhZGVySWRzOiBudW1iZXJbXSwga2luZDogSW50YWtlS2luZCk6IFByb21pc2U8UXVldWVJdGVtW10gfCBudWxsPiB7XG4gICAgaWYgKCFjYW5DbGFpbUlkcyhsZWFkZXJJZHMpKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpdGVtcyA9IHRoaXMuZXhwYW5kTGVhZGVycyhsZWFkZXJJZHMpO1xuICAgICAgaWYgKCFpdGVtcykgcmV0dXJuIG51bGw7XG4gICAgICBjb25zdCBpZHMgPSBpdGVtcy5tYXAoKGl0ZW0pID0+IGl0ZW0uaWQpO1xuICAgICAgY29uc3QgbWFya3MgPSBpZHMubWFwKCgpID0+IFwiP1wiKS5qb2luKFwiLFwiKTtcbiAgICAgIHRoaXMuZGIucnVuKGBVUERBVEUgcXVldWUgU0VUIGtpbmQ9PywgY2xhaW1fc3RhcnRlZF9hdD0/LCB1cGRhdGVkX2F0PT8gV0hFUkUgaWQgSU4gKCR7bWFya3N9KWAsIFtraW5kLCBEYXRlLm5vdygpLCBEYXRlLm5vdygpLCAuLi5pZHNdKTtcbiAgICAgIGF3YWl0IHRoaXMuZmx1c2goKTtcbiAgICAgIHJldHVybiBpdGVtcztcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ2ljYWxJdGVtcyhsZWFkZXJJZHM6IG51bWJlcltdKTogUHJvbWlzZTxRdWV1ZUl0ZW1bXSB8IG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4gdGhpcy5leHBhbmRMZWFkZXJzKGxlYWRlcklkcykpO1xuICB9XG5cbiAgc2VsZWN0aW9uKGlkczogbnVtYmVyW10pOiBQcm9taXNlPHsgbGVhZGVySWRzOiBudW1iZXJbXTsgaXRlbXM6IFF1ZXVlSXRlbVtdIH0gfCBudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGxlYWRlcklkczogbnVtYmVyW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMub25lKFwiU0VMRUNUICogRlJPTSBxdWV1ZSBXSEVSRSBpZCA9ID8gQU5EIHN0YXRlIElOICgncGVuZGluZycsJ2ZhaWxlZCcpIEFORCAoY2xhaW1fc3RhcnRlZF9hdCBJUyBOVUxMIE9SIGNsYWltX3N0YXJ0ZWRfYXQgPCA/KVwiLCBbaWQsIERhdGUubm93KCkgLSAzMDAwMDBdKTtcbiAgICAgICAgaWYgKCFyb3cpIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBsZWFkZXJJZCA9IHJvdy5tZWRpYV9ncm91cF9pZFxuICAgICAgICAgID8gTnVtYmVyKHRoaXMub25lKFwiU0VMRUNUIE1JTihpZCkgQVMgaWQgRlJPTSBxdWV1ZSBXSEVSRSBtZWRpYV9ncm91cF9pZCA9ID8gQU5EIHN0YXRlIElOICgncGVuZGluZycsJ2ZhaWxlZCcpXCIsIFtyb3cubWVkaWFfZ3JvdXBfaWRdKT8uaWQpXG4gICAgICAgICAgOiBOdW1iZXIocm93LmlkKTtcbiAgICAgICAgaWYgKCFsZWFkZXJJZHMuaW5jbHVkZXMobGVhZGVySWQpKSBsZWFkZXJJZHMucHVzaChsZWFkZXJJZCk7XG4gICAgICB9XG4gICAgICBjb25zdCBpdGVtcyA9IHRoaXMuZXhwYW5kTGVhZGVycyhsZWFkZXJJZHMpO1xuICAgICAgcmV0dXJuIGl0ZW1zID8geyBsZWFkZXJJZHMsIGl0ZW1zIH0gOiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgZmluaXNoKGlkczogbnVtYmVyW10sIGVycm9yPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1hcmtzID0gaWRzLm1hcCgoKSA9PiBcIj9cIikuam9pbihcIixcIik7XG4gICAgICB0aGlzLmRiLnJ1bihgVVBEQVRFIHF1ZXVlIFNFVCBzdGF0ZT0/LCBlcnJvcj0/LCBjbGFpbV9zdGFydGVkX2F0PU5VTEwsIHVwZGF0ZWRfYXQ9PyBXSEVSRSBpZCBJTiAoJHttYXJrc30pYCwgW2Vycm9yID8gXCJmYWlsZWRcIiA6IFwicmVzb2x2ZWRcIiwgZXJyb3IgPz8gbnVsbCwgRGF0ZS5ub3coKSwgLi4uaWRzXSk7XG4gICAgICBhd2FpdCB0aGlzLmZsdXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICByZWxlYXNlKGlkczogbnVtYmVyW10sIGVycm9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4geyBmb3IgKGNvbnN0IGlkIG9mIGlkcykgdGhpcy5kYi5ydW4oXCJVUERBVEUgcXVldWUgU0VUIHN0YXRlPSdmYWlsZWQnLCBlcnJvcj0/LCBjbGFpbV9zdGFydGVkX2F0PU5VTEwsIHVwZGF0ZWRfYXQ9PyBXSEVSRSBpZD0/XCIsIFtlcnJvciwgRGF0ZS5ub3coKSwgaWRdKTsgYXdhaXQgdGhpcy5mbHVzaCgpOyB9KTtcbiAgfVxuXG4gIHJlc2VydmVBdHRhY2htZW50KGlkZW50aXR5OiBzdHJpbmcsIGluaXRpYWxQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBrbm93biA9IHRoaXMub25lKFwiU0VMRUNUIHBhdGggRlJPTSBhdHRhY2htZW50X3BhdGhzIFdIRVJFIGlkZW50aXR5ID0gP1wiLCBbaWRlbnRpdHldKTtcbiAgICAgIGlmIChrbm93bikgcmV0dXJuIGtub3duLnBhdGg7XG4gICAgICBjb25zdCBleHRlbnNpb25BdCA9IGluaXRpYWxQYXRoLmxhc3RJbmRleE9mKFwiLlwiKTtcbiAgICAgIGNvbnN0IGJhc2UgPSBleHRlbnNpb25BdCA+IGluaXRpYWxQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA/IGluaXRpYWxQYXRoLnNsaWNlKDAsIGV4dGVuc2lvbkF0KSA6IGluaXRpYWxQYXRoO1xuICAgICAgY29uc3QgZXh0ZW5zaW9uID0gYmFzZSA9PT0gaW5pdGlhbFBhdGggPyBcIlwiIDogaW5pdGlhbFBhdGguc2xpY2UoZXh0ZW5zaW9uQXQpO1xuICAgICAgbGV0IHBhdGggPSBpbml0aWFsUGF0aDtcbiAgICAgIGxldCBpbmRleCA9IDI7XG4gICAgICB3aGlsZSAoYXdhaXQgKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgYXMgYW55KS5leGlzdHMocGF0aCkpIHBhdGggPSBgJHtiYXNlfS0ke2luZGV4Kyt9JHtleHRlbnNpb259YDtcbiAgICAgIHRoaXMuZGIucnVuKFwiSU5TRVJUIElOVE8gYXR0YWNobWVudF9wYXRocyhpZGVudGl0eSwgcGF0aCkgVkFMVUVTICg/LCA/KVwiLCBbaWRlbnRpdHksIHBhdGhdKTtcbiAgICAgIGF3YWl0IHRoaXMuZmx1c2goKTtcbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH0pO1xuICB9XG5cbiAgZGVmZXIoaWRzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7IGZvciAoY29uc3QgaWQgb2YgaWRzKSB0aGlzLmRiLnJ1bihcIlVQREFURSBxdWV1ZSBTRVQgc3RhdGU9J3BlbmRpbmcnLCBlcnJvcj1OVUxMLCBwcm9tcHRfY2hhdF9pZD1OVUxMLCBwcm9tcHRfbWVzc2FnZV9pZD1OVUxMLCBkZWZlcnJlZF91bnRpbD0/LCBjbGFpbV9zdGFydGVkX2F0PU5VTEwsIHVwZGF0ZWRfYXQ9PyBXSEVSRSBpZD0/XCIsIFtEYXRlLm5vdygpICsgMzYwMDAwMCwgRGF0ZS5ub3coKSwgaWRdKTsgYXdhaXQgdGhpcy5mbHVzaCgpOyB9KTtcbiAgfVxuXG4gIGRpc2NhcmQoaWRzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnNlcmlhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtYXJrcyA9IGlkcy5tYXAoKCkgPT4gXCI/XCIpLmpvaW4oXCIsXCIpO1xuICAgICAgdGhpcy5kYi5ydW4oYFVQREFURSBxdWV1ZSBTRVQgc3RhdGU9J2Rpc2NhcmRlZCcsIGVycm9yPU5VTEwsIHByb21wdF9jaGF0X2lkPU5VTEwsIHByb21wdF9tZXNzYWdlX2lkPU5VTEwsIGRlZmVycmVkX3VudGlsPU5VTEwsIGNsYWltX3N0YXJ0ZWRfYXQ9TlVMTCwgdXBkYXRlZF9hdD0/IFdIRVJFIGlkIElOICgke21hcmtzfSlgLCBbRGF0ZS5ub3coKSwgLi4uaWRzXSk7XG4gICAgICBhd2FpdCB0aGlzLmZsdXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICBwYWdlKHBhZ2U6IG51bWJlciwgc2l6ZSA9IDgpOiBQcm9taXNlPHsgaXRlbXM6IFF1ZXVlSXRlbVtdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4gKHtcbiAgICAgIGl0ZW1zOiB0aGlzLnJvd3MoXCJTRUxFQ1QgKiBGUk9NIHF1ZXVlIFdIRVJFIHN0YXRlIElOICgncGVuZGluZycsJ2ZhaWxlZCcpIE9SREVSIEJZIGNyZWF0ZWRfYXQgTElNSVQgPyBPRkZTRVQgP1wiLCBbc2l6ZSwgcGFnZSAqIHNpemVdKS5tYXAoKHIpID0+IHRoaXMuaXRlbShyKSksXG4gICAgICB0b3RhbDogTnVtYmVyKHRoaXMub25lKFwiU0VMRUNUIENPVU5UKCopIEFTIGNvdW50IEZST00gcXVldWUgV0hFUkUgc3RhdGUgSU4gKCdwZW5kaW5nJywnZmFpbGVkJylcIik/LmNvdW50ID8/IDApLFxuICAgIH0pKTtcbiAgfVxuXG4gIGxvZ2ljYWxQYWdlKHBhZ2U6IG51bWJlciwgc2l6ZSA9IDgpOiBQcm9taXNlPHsgaXRlbXM6IFF1ZXVlSXRlbVtdOyB0b3RhbDogbnVtYmVyIH0+IHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWwoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgcm93cyA9IHRoaXMucm93cyhcIlNFTEVDVCAqIEZST00gcXVldWUgV0hFUkUgc3RhdGUgSU4gKCdwZW5kaW5nJywnZmFpbGVkJykgT1JERVIgQlkgY3JlYXRlZF9hdCwgaWRcIik7XG4gICAgICBjb25zdCBsZWFkZXJzOiBhbnlbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXBzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgIGlmIChyb3cubWVkaWFfZ3JvdXBfaWQgJiYgZ3JvdXBzLmhhcyhTdHJpbmcocm93Lm1lZGlhX2dyb3VwX2lkKSkpIGNvbnRpbnVlO1xuICAgICAgICBpZiAocm93Lm1lZGlhX2dyb3VwX2lkKSBncm91cHMuYWRkKFN0cmluZyhyb3cubWVkaWFfZ3JvdXBfaWQpKTtcbiAgICAgICAgbGVhZGVycy5wdXNoKHJvdyk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBpdGVtczogbGVhZGVycy5zbGljZShwYWdlICogc2l6ZSwgKHBhZ2UgKyAxKSAqIHNpemUpLm1hcCgocm93KSA9PiB0aGlzLml0ZW0ocm93KSksIHRvdGFsOiBsZWFkZXJzLmxlbmd0aCB9O1xuICAgIH0pO1xuICB9XG5cbiAgc2Vzc2lvbigpOiBQcm9taXNlPEJvdFNlc3Npb24gfCBudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMub25lKFwiU0VMRUNUICogRlJPTSBib3Rfc2Vzc2lvbiBXSEVSRSBpZCA9IDFcIik7XG4gICAgICByZXR1cm4gcm93ID8gdGhpcy5ib3RTZXNzaW9uKHJvdykgOiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgc2F2ZVNlc3Npb24odmFsdWU6IHsgbW9kZTogU2Vzc2lvbk1vZGU7IGxlYWRlcklkczogbnVtYmVyW107IG9yZGluYWxMZWFkZXJJZHM/OiBudW1iZXJbXTsgbWVudUNoYXRJZDogbnVtYmVyOyBtZW51TWVzc2FnZUlkOiBudW1iZXI7IHBhZ2U6IG51bWJlcjsgYWZ0ZXJJZD86IG51bWJlciB9KTogUHJvbWlzZTxCb3RTZXNzaW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHRoaXMub25lKFwiU0VMRUNUIGNyZWF0ZWRfYXQgRlJPTSBib3Rfc2Vzc2lvbiBXSEVSRSBpZCA9IDFcIik7XG4gICAgICB0aGlzLmRiLnJ1bihgSU5TRVJUIE9SIFJFUExBQ0UgSU5UTyBib3Rfc2Vzc2lvbihpZCxtb2RlLGxlYWRlcl9pZHMsb3JkaW5hbF9sZWFkZXJfaWRzLG1lbnVfY2hhdF9pZCxtZW51X21lc3NhZ2VfaWQscGFnZSxhZnRlcl9pZCxjcmVhdGVkX2F0LHVwZGF0ZWRfYXQpXG4gICAgICAgIFZBTFVFUyAoMSw/LD8sPyw/LD8sPyw/LD8sPylgLCBbdmFsdWUubW9kZSwgSlNPTi5zdHJpbmdpZnkodmFsdWUubGVhZGVySWRzKSwgSlNPTi5zdHJpbmdpZnkodmFsdWUub3JkaW5hbExlYWRlcklkcyA/PyBbXSksIHZhbHVlLm1lbnVDaGF0SWQsIHZhbHVlLm1lbnVNZXNzYWdlSWQsIHZhbHVlLnBhZ2UsIHZhbHVlLmFmdGVySWQgPz8gMCwgZXhpc3Rpbmc/LmNyZWF0ZWRfYXQgPz8gbm93LCBub3ddKTtcbiAgICAgIGF3YWl0IHRoaXMuZmx1c2goKTtcbiAgICAgIHJldHVybiB0aGlzLnNlc3Npb25VbnNhZmUoKSE7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhclNlc3Npb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VyaWFsKGFzeW5jICgpID0+IHsgdGhpcy5kYi5ydW4oXCJERUxFVEUgRlJPTSBib3Rfc2Vzc2lvbiBXSEVSRSBpZCA9IDFcIik7IGF3YWl0IHRoaXMuZmx1c2goKTsgfSk7XG4gIH1cblxuICBwcml2YXRlIGl0ZW0ocm93OiBhbnkpOiBRdWV1ZUl0ZW0ge1xuICAgIHJldHVybiB7IGlkOiBOdW1iZXIocm93LmlkKSwgdXBkYXRlSWQ6IE51bWJlcihyb3cudXBkYXRlX2lkKSwgc3RhdGU6IHJvdy5zdGF0ZSwga2luZDogcm93LmtpbmQsIGRlc2lnbmF0aW9uOiByb3cuZGVzaWduYXRpb24gPT09IFwiYWdlbnRcIiA/IFwiYWdlbnRcIiA6IFwiZGFpbHlcIiwgcGF5bG9hZDogSlNPTi5wYXJzZShyb3cucGF5bG9hZCksIG1lZGlhR3JvdXBJZDogcm93Lm1lZGlhX2dyb3VwX2lkLCBjcmVhdGVkQXQ6IE51bWJlcihyb3cuY3JlYXRlZF9hdCksIGVycm9yOiByb3cuZXJyb3IsIHByb21wdENoYXRJZDogcm93LnByb21wdF9jaGF0X2lkLCBwcm9tcHRNZXNzYWdlSWQ6IHJvdy5wcm9tcHRfbWVzc2FnZV9pZCB9O1xuICB9XG4gIHByaXZhdGUgZXhwYW5kTGVhZGVycyhsZWFkZXJJZHM6IG51bWJlcltdKTogUXVldWVJdGVtW10gfCBudWxsIHtcbiAgICBjb25zdCByZXN1bHQ6IFF1ZXVlSXRlbVtdID0gW107XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgIGZvciAoY29uc3QgbGVhZGVySWQgb2YgbGVhZGVySWRzKSB7XG4gICAgICBjb25zdCBsZWFkZXIgPSB0aGlzLm9uZShcIlNFTEVDVCAqIEZST00gcXVldWUgV0hFUkUgaWQgPSA/IEFORCBzdGF0ZSBJTiAoJ3BlbmRpbmcnLCdmYWlsZWQnKSBBTkQgKGNsYWltX3N0YXJ0ZWRfYXQgSVMgTlVMTCBPUiBjbGFpbV9zdGFydGVkX2F0IDwgPylcIiwgW2xlYWRlcklkLCBEYXRlLm5vdygpIC0gMzAwMDAwXSk7XG4gICAgICBpZiAoIWxlYWRlcikgcmV0dXJuIG51bGw7XG4gICAgICBjb25zdCByb3dzID0gbGVhZGVyLm1lZGlhX2dyb3VwX2lkXG4gICAgICAgID8gdGhpcy5yb3dzKFwiU0VMRUNUICogRlJPTSBxdWV1ZSBXSEVSRSBtZWRpYV9ncm91cF9pZCA9ID8gQU5EIHN0YXRlIElOICgncGVuZGluZycsJ2ZhaWxlZCcpIEFORCAoY2xhaW1fc3RhcnRlZF9hdCBJUyBOVUxMIE9SIGNsYWltX3N0YXJ0ZWRfYXQgPCA/KSBPUkRFUiBCWSBpZFwiLCBbbGVhZGVyLm1lZGlhX2dyb3VwX2lkLCBEYXRlLm5vdygpIC0gMzAwMDAwXSlcbiAgICAgICAgOiBbbGVhZGVyXTtcbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbShyb3cpO1xuICAgICAgICBpZiAoIXNlZW4uaGFzKGl0ZW0uaWQpKSB7IHNlZW4uYWRkKGl0ZW0uaWQpOyByZXN1bHQucHVzaChpdGVtKTsgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHByaXZhdGUgc2Vzc2lvblVuc2FmZSgpOiBCb3RTZXNzaW9uIHwgbnVsbCB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5vbmUoXCJTRUxFQ1QgKiBGUk9NIGJvdF9zZXNzaW9uIFdIRVJFIGlkID0gMVwiKTtcbiAgICByZXR1cm4gcm93ID8gdGhpcy5ib3RTZXNzaW9uKHJvdykgOiBudWxsO1xuICB9XG4gIHByaXZhdGUgYm90U2Vzc2lvbihyb3c6IGFueSk6IEJvdFNlc3Npb24ge1xuICAgIGNvbnN0IG1vZGU6IFNlc3Npb25Nb2RlID0gcm93Lm1vZGUgPT09IFwiYXdhaXRpbmdfaWRzXCIgPyBcImF3YWl0aW5nX2lkc1wiIDogcm93Lm1vZGUgPT09IFwic3RhbmRhbG9uZVwiID8gXCJzdGFuZGFsb25lXCIgOiBcImJ1bmRsZVwiO1xuICAgIHJldHVybiB7IG1vZGUsIGxlYWRlcklkczogSlNPTi5wYXJzZShyb3cubGVhZGVyX2lkcyksIG9yZGluYWxMZWFkZXJJZHM6IEpTT04ucGFyc2Uocm93Lm9yZGluYWxfbGVhZGVyX2lkcyA/PyBcIltdXCIpLCBtZW51Q2hhdElkOiBOdW1iZXIocm93Lm1lbnVfY2hhdF9pZCksIG1lbnVNZXNzYWdlSWQ6IE51bWJlcihyb3cubWVudV9tZXNzYWdlX2lkKSwgcGFnZTogTnVtYmVyKHJvdy5wYWdlKSwgYWZ0ZXJJZDogTnVtYmVyKHJvdy5hZnRlcl9pZCksIGNyZWF0ZWRBdDogTnVtYmVyKHJvdy5jcmVhdGVkX2F0KSwgdXBkYXRlZEF0OiBOdW1iZXIocm93LnVwZGF0ZWRfYXQpIH07XG4gIH1cbiAgcHJpdmF0ZSBhZGRDb2x1bW4oY29sdW1uOiBzdHJpbmcpOiBib29sZWFuIHsgdHJ5IHsgdGhpcy5kYi5ydW4oYEFMVEVSIFRBQkxFIHF1ZXVlIEFERCBDT0xVTU4gJHtjb2x1bW59YCk7IHJldHVybiB0cnVlOyB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9IH1cbiAgcHJpdmF0ZSBhZGRTZXNzaW9uQ29sdW1uKGNvbHVtbjogc3RyaW5nKTogYm9vbGVhbiB7IHRyeSB7IHRoaXMuZGIucnVuKGBBTFRFUiBUQUJMRSBib3Rfc2Vzc2lvbiBBREQgQ09MVU1OICR7Y29sdW1ufWApOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfSB9XG4gIHByaXZhdGUgb25lKHNxbDogc3RyaW5nLCBwYXJhbXM6IHVua25vd25bXSA9IFtdKTogYW55IHwgbnVsbCB7IHJldHVybiB0aGlzLnJvd3Moc3FsLCBwYXJhbXMpWzBdID8/IG51bGw7IH1cbiAgcHJpdmF0ZSByb3dzKHNxbDogc3RyaW5nLCBwYXJhbXM6IHVua25vd25bXSA9IFtdKTogYW55W10geyBjb25zdCByZXN1bHQgPSB0aGlzLmRiLmV4ZWMoc3FsLCBwYXJhbXMpWzBdOyByZXR1cm4gcmVzdWx0ID8gcmVzdWx0LnZhbHVlcy5tYXAoKHY6IHVua25vd25bXSkgPT4gT2JqZWN0LmZyb21FbnRyaWVzKHJlc3VsdC5jb2x1bW5zLm1hcCgoYzogc3RyaW5nLCBpOiBudW1iZXIpID0+IFtjLCB2W2ldXSkpKSA6IFtdOyB9XG4gIHByaXZhdGUgYXN5bmMgZmx1c2goKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuYmVmb3JlRmx1c2g/LigpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhd2FpdCB0aGlzLnJlc3RvcmVEaXNrU3RhdGUoKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLmZpbGVzLndyaXRlQmluYXJ5KHRoaXMucGF0aCwgdGhpcy5kYi5leHBvcnQoKSk7XG4gIH1cbiAgcHJpdmF0ZSBhc3luYyByZXN0b3JlRGlza1N0YXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN0b3JlZCA9IG5ldyB0aGlzLlNRTC5EYXRhYmFzZSh0b0J5dGVzKGF3YWl0IHRoaXMuZmlsZXMucmVhZEJpbmFyeSh0aGlzLnBhdGgpKSk7XG4gICAgICB0aGlzLmRiPy5jbG9zZSgpO1xuICAgICAgdGhpcy5kYiA9IHJlc3RvcmVkO1xuICAgIH0gY2F0Y2gge1xuICAgICAgdGhpcy5kYj8uY2xvc2UoKTtcbiAgICAgIHRoaXMuZGIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgc2VyaWFsPFQ+KHdvcms6ICgpID0+IFByb21pc2U8VD4pOiBQcm9taXNlPFQ+IHsgY29uc3QgcmVzdWx0ID0gdGhpcy5jaGFpbi50aGVuKHdvcmssIHdvcmspOyB0aGlzLmNoYWluID0gcmVzdWx0LnRoZW4oKCkgPT4gdW5kZWZpbmVkLCAoKSA9PiB1bmRlZmluZWQpOyByZXR1cm4gcmVzdWx0OyB9XG59XG5cbmZ1bmN0aW9uIHRvQnl0ZXModmFsdWU6IFVpbnQ4QXJyYXkgfCBBcnJheUJ1ZmZlcik6IFVpbnQ4QXJyYXkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5ID8gbmV3IFVpbnQ4QXJyYXkodmFsdWUpIDogbmV3IFVpbnQ4QXJyYXkodmFsdWUpOyB9XG5cbmNvbnN0IHBhdXNlID0gKG1pbGxpc2Vjb25kczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtaWxsaXNlY29uZHMpKTtcbiIsICJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIERhaWx5SW50YWtlUGx1Z2luIGZyb20gXCIuL21haW5cIjtcblxuZXhwb3J0IGNsYXNzIERhaWx5SW50YWtlU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcmVhZG9ubHkgcGx1Z2luOiBEYWlseUludGFrZVBsdWdpbikgeyBzdXBlcihhcHAsIHBsdWdpbik7IH1cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29udGFpbmVyRWwuYWRkQ2xhc3MoXCJkYWlseS1pbnRha2Utc2V0dGluZ3NcIik7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiRGFpbHkgSW50YWtlXCIgfSk7XG4gICAgY29uc3Qgc3RhdHVzID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcImRhaWx5LWludGFrZS1zdGF0dXNcIiB9KTtcbiAgICBjb25zdCBzdGF0dXNUZXh0ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhdHVzO1xuICAgIHN0YXR1cy5kYXRhc2V0LnN0YXRlID0gL14oU3RvcHBlZHxOZWVkcyBhdHRlbnRpb258UG9sbGluZyByZXRyeSl8Y29uZmxpY3R8Y291bGQgbm90L2kudGVzdChzdGF0dXNUZXh0KSA/IFwid2FybmluZ1wiIDogL14oUG9sbGluZ3xXYWl0aW5nfFBhaXJlZCkvLnRlc3Qoc3RhdHVzVGV4dCkgPyBcImFjdGl2ZVwiIDogXCJpZGxlXCI7XG4gICAgc3RhdHVzLmNyZWF0ZVNwYW4oeyBjbHM6IFwiZGFpbHktaW50YWtlLXN0YXR1cy1kb3RcIiB9KTtcbiAgICBzdGF0dXMuY3JlYXRlU3Bhbih7IGNsczogXCJkYWlseS1pbnRha2Utc3RhdHVzLXRleHRcIiwgdGV4dDogc3RhdHVzVGV4dCB9KTtcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0TmFtZShcIkVuYWJsZSBvbiB0aGlzIE1hY1wiKS5zZXREZXNjKFwiUG9sbGluZyBpcyBvZmYgYnkgZGVmYXVsdCBhbmQgc3RheXMgb2ZmIHVudGlsIHlvdSBvcHQgaW4gaGVyZS5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4gdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWQpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4geyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkID0gdmFsdWU7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyBhd2FpdCB0aGlzLnBsdWdpbi5yZXN0YXJ0UG9sbGluZygpOyB0aGlzLmRpc3BsYXkoKTsgfSkpO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiVGVsZWdyYW0gYm90IHRva2VuXCIpLnNldERlc2MoXCJTdG9yZWQgb25seSBpbiB0aGlzIE1hY1x1MjAxOXMgcHJpdmF0ZSBEYWlseSBJbnRha2Ugc3RhdGUsIG91dHNpZGUgdGhlIHN5bmNlZCB2YXVsdC4gQSB0b2tlbiBpcyBuZXZlciBwbGFjZWQgaW4gbm90ZXMgb3IgdGhlIHF1ZXVlLlwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHRleHQuc2V0UGxhY2Vob2xkZXIoXCIxMjM0NTY6QUJDXHUyMDI2XCIpLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRva2VuKS5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCIpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiU2F2ZVwiKS5vbkNsaWNrKGFzeW5jICgpID0+IHsgY29uc3QgaW5wdXQgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiaW5wdXRbdHlwZT1wYXNzd29yZF1cIik7IGlmIChpbnB1dCkgeyB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2tlbiA9IGlucHV0LnZhbHVlLnRyaW0oKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IGF3YWl0IHRoaXMucGx1Z2luLnJlc3RhcnRQb2xsaW5nKCk7IHRoaXMuZGlzcGxheSgpOyB9IH0pKTtcbiAgICBjb25zdCBwYWlyID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJQYWlyIGEgcHJpdmF0ZSBUZWxlZ3JhbSBjaGF0XCIpLnNldERlc2ModGhpcy5wbHVnaW4uc2V0dGluZ3Mub3duZXJVc2VySWQgPyBgUGFpcmVkIHRvIHVzZXIgJHt0aGlzLnBsdWdpbi5zZXR0aW5ncy5vd25lclVzZXJJZH0uIFVucGFpciBiZWZvcmUgcmVwbGFjaW5nIHRoaXMgY2hhdC5gIDogXCJBcm0gdGhpcywgdGhlbiBzZW5kIHRoZSBib3QgYSBwcml2YXRlIG1lc3NhZ2UuXCIpO1xuICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3duZXJVc2VySWQpIHBhaXIuYWRkQnV0dG9uKChidXR0b24pID0+IGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiUGFpciBuZXh0IHNlbmRlclwiKS5vbkNsaWNrKGFzeW5jICgpID0+IHsgdGhpcy5wbHVnaW4uc2V0dGluZ3MucGFpckFybWVkID0gdHJ1ZTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IGF3YWl0IHRoaXMucGx1Z2luLnJlc3RhcnRQb2xsaW5nKCk7IHRoaXMuZGlzcGxheSgpOyB9KSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLm93bmVyVXNlcklkKSBwYWlyLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiBidXR0b24uc2V0QnV0dG9uVGV4dChcIlVucGFpclwiKS5zZXRXYXJuaW5nKCkub25DbGljayhhc3luYyAoKSA9PiB7IHRoaXMucGx1Z2luLnNldHRpbmdzLm93bmVyVXNlcklkID0gbnVsbDsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3duZXJDaGF0SWQgPSBudWxsOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWlyQXJtZWQgPSBmYWxzZTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IGF3YWl0IHRoaXMucGx1Z2luLnJlc3RhcnRQb2xsaW5nKCk7IHRoaXMuZGlzcGxheSgpOyB9KSk7XG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJKb3VybmFsXCIpLnNldERlc2MoXCJUaGUgZGFpbHkgSm91cm5hbCB0byBhcHBlbmQgYWZ0ZXIgeW91IGNob29zZSBEYWlseSBjb250ZW50LlwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHRleHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muam91cm5hbCkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7IHRoaXMucGx1Z2luLnNldHRpbmdzLmpvdXJuYWwgPSB2YWx1ZS50cmltKCkgfHwgXCJQZXJzb25hbCBEYWlseVwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfSkpO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiQXR0YWNobWVudCBmb2xkZXJcIikuc2V0RGVzYyhcIlZhdWx0LXJlbGF0aXZlIHJvb3Q7IGZpbGVzIGdvIGluIGEgWVlZWS1NTS1ERCBzdWJmb2xkZXIgbWF0Y2hpbmcgdGhlIGRhaWx5IG5vdGUuIERvd25sb2FkZWQgb25seSB3aGVuIGFuIGl0ZW0gaXMgcmVzb2x2ZWQuXCIpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4gdGV4dC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdHRhY2htZW50Um9vdCkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7IHRoaXMucGx1Z2luLnNldHRpbmdzLmF0dGFjaG1lbnRSb290ID0gdmFsdWUudHJpbSgpIHx8IFwiU3RyYXRhL0F0dGFjaG1lbnRzL0NvbnRpbnV1bS9UaW1lL0RhaWx5XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyByZXF1ZXN0VXJsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSB7IFRlbGVncmFtVXBkYXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuY29uc3QgQVBJID0gXCJodHRwczovL2FwaS50ZWxlZ3JhbS5vcmcvYm90XCI7XG50eXBlIEJpbmFyeVJlcXVlc3QgPSAocmVxdWVzdDogeyB1cmw6IHN0cmluZzsgdGhyb3c6IGJvb2xlYW4gfSkgPT4gUHJvbWlzZTx7IHN0YXR1czogbnVtYmVyOyBhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIgfT47XG5cbmV4cG9ydCBjbGFzcyBUZWxlZ3JhbUNsaWVudCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdG9rZW46ICgpID0+IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSByZXF1ZXN0QmluYXJ5OiBCaW5hcnlSZXF1ZXN0ID0gcmVxdWVzdFVybCkge31cblxuICBhc3luYyB1cGRhdGVzKG9mZnNldDogbnVtYmVyLCBzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8VGVsZWdyYW1VcGRhdGVbXT4ge1xuICAgIHJldHVybiB0aGlzLmNhbGwoXCJnZXRVcGRhdGVzXCIsIHsgb2Zmc2V0LCB0aW1lb3V0OiAyNSwgYWxsb3dlZF91cGRhdGVzOiBbXCJtZXNzYWdlXCIsIFwiY2FsbGJhY2tfcXVlcnlcIl0gfSwgc2lnbmFsKTtcbiAgfVxuICBjb21tYW5kcygpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICByZXR1cm4gdGhpcy5jYWxsKFwic2V0TXlDb21tYW5kc1wiLCB7IGNvbW1hbmRzOiBbeyBjb21tYW5kOiBcInF1ZXVlXCIsIGRlc2NyaXB0aW9uOiBcIlNob3cgcGVuZGluZyBpbnRha2VcIiB9LCB7IGNvbW1hbmQ6IFwiY2FuY2VsXCIsIGRlc2NyaXB0aW9uOiBcIkNhbmNlbCB0aGUgYWN0aXZlIGJ1bmRsZSBzZXNzaW9uXCIgfSwgeyBjb21tYW5kOiBcInN0YXR1c1wiLCBkZXNjcmlwdGlvbjogXCJTaG93IERhaWx5IEludGFrZSBzdGF0dXNcIiB9XSB9KTtcbiAgfVxuICBhbnN3ZXJDYWxsYmFja1F1ZXJ5KGlkOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHsgcmV0dXJuIHRoaXMuY2FsbChcImFuc3dlckNhbGxiYWNrUXVlcnlcIiwgeyBjYWxsYmFja19xdWVyeV9pZDogaWQsIHRleHQsIHNob3dfYWxlcnQ6IGZhbHNlIH0pOyB9XG4gIHNlbmRNZXNzYWdlKGNoYXRJZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHJlcGx5TWFya3VwPzogdW5rbm93bik6IFByb21pc2U8eyBtZXNzYWdlX2lkOiBudW1iZXIgfT4geyByZXR1cm4gdGhpcy5jYWxsKFwic2VuZE1lc3NhZ2VcIiwgeyBjaGF0X2lkOiBjaGF0SWQsIHRleHQsIHJlcGx5X21hcmt1cDogcmVwbHlNYXJrdXAgfSk7IH1cbiAgZWRpdE1lc3NhZ2UoY2hhdElkOiBudW1iZXIsIG1lc3NhZ2VJZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHJlcGx5TWFya3VwPzogdW5rbm93bik6IFByb21pc2U8dW5rbm93bj4geyByZXR1cm4gdGhpcy5jYWxsKFwiZWRpdE1lc3NhZ2VUZXh0XCIsIHsgY2hhdF9pZDogY2hhdElkLCBtZXNzYWdlX2lkOiBtZXNzYWdlSWQsIHRleHQsIHJlcGx5X21hcmt1cDogcmVwbHlNYXJrdXAgfSk7IH1cbiAgYXN5bmMgZmlsZShmaWxlSWQ6IHN0cmluZyk6IFByb21pc2U8eyBmaWxlX3BhdGg6IHN0cmluZyB9PiB7IHJldHVybiB0aGlzLmNhbGwoXCJnZXRGaWxlXCIsIHsgZmlsZV9pZDogZmlsZUlkIH0pOyB9XG4gIGFzeW5jIGRvd25sb2FkKGZpbGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPEFycmF5QnVmZmVyPiB7XG4gICAgbGV0IHJlc3BvbnNlOiB7IHN0YXR1czogbnVtYmVyOyBhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIgfTtcbiAgICB0cnkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnJlcXVlc3RCaW5hcnkoeyB1cmw6IGBodHRwczovL2FwaS50ZWxlZ3JhbS5vcmcvZmlsZS9ib3Qke3RoaXMudG9rZW4oKX0vJHtmaWxlUGF0aH1gLCB0aHJvdzogZmFsc2UgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUZWxlZ3JhbSBmaWxlIGRvd25sb2FkIGZhaWxlZC5cIik7XG4gICAgfVxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPCAyMDAgfHwgcmVzcG9uc2Uuc3RhdHVzID49IDMwMCkgdGhyb3cgbmV3IEVycm9yKGBUZWxlZ3JhbSBmaWxlIGRvd25sb2FkIGZhaWxlZCAoJHtyZXNwb25zZS5zdGF0dXN9KS5gKTtcbiAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXI7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNhbGw8VD4obWV0aG9kOiBzdHJpbmcsIGJvZHk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7QVBJfSR7dGhpcy50b2tlbigpfS8ke21ldGhvZH1gLCB7IG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnM6IHsgXCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSwgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksIHNpZ25hbCB9KTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7IG9rOiBmYWxzZSwgZGVzY3JpcHRpb246IGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfWAgfSkpO1xuICAgIGlmICghcmVzcG9uc2Uub2sgfHwgIWRhdGEub2spIHtcbiAgICAgIGNvbnN0IGVycm9yOiBhbnkgPSBuZXcgRXJyb3IoZGF0YS5kZXNjcmlwdGlvbiA/PyBgVGVsZWdyYW0gJHttZXRob2R9IGZhaWxlZCAoJHtyZXNwb25zZS5zdGF0dXN9KS5gKTtcbiAgICAgIGVycm9yLnN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YS5yZXN1bHQgYXMgVDtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBLHlDQUFBQSxVQUFBQyxTQUFBO0FBYUEsUUFBSSxtQkFBbUI7QUFFdkIsUUFBSSxZQUFZLFNBQVUsY0FBYztBQUVwQyxVQUFJLGtCQUFpQjtBQUNuQixlQUFPO0FBQUEsTUFDVDtBQUVBLHlCQUFtQixJQUFJLFFBQVEsU0FBVSxlQUFlLFFBQVE7QUFZNUQsWUFBSSxTQUFTLE9BQU8saUJBQWlCLGNBQWMsZUFBZSxDQUFDO0FBSW5FLFlBQUksMEJBQTBCLE9BQU8sU0FBUztBQUM5QyxlQUFPLFNBQVMsSUFBSSxTQUFVLHNCQUFzQjtBQUNoRCxpQkFBTyxJQUFJLE1BQU0sb0JBQW9CLENBQUM7QUFDdEMs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TSxDQUFDO0FBQUEsUUFBQyxHQUFFLFdBQVcsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUFDLGNBQUcsV0FBUyxJQUFFLFVBQVEsVUFBUSxJQUFFLE9BQU8sT0FBTSxJQUFJLEVBQUUsRUFBRTtBQUN6Z0IsWUFBRSxPQUFLLEVBQUUsS0FBRyxFQUFDLEtBQUksRUFBQyxNQUFLLEVBQUMsSUFBRyxFQUFFLEdBQUcsSUFBRyxJQUFHLEVBQUUsR0FBRyxJQUFHLFFBQU8sRUFBRSxHQUFHLFFBQU8sSUFBRyxFQUFFLEdBQUcsSUFBRyxRQUFPLEVBQUUsR0FBRyxRQUFPLFFBQU8sRUFBRSxHQUFHLFFBQU8sT0FBTSxFQUFFLEdBQUcsT0FBTSxTQUFRLEVBQUUsR0FBRyxTQUFRLFNBQVEsRUFBRSxHQUFHLFFBQU8sR0FBRSxRQUFPLEVBQUMsSUFBRyxFQUFFLEdBQUcsR0FBRSxFQUFDLEdBQUUsTUFBSyxFQUFDLE1BQUssRUFBQyxJQUFHLEVBQUUsR0FBRyxJQUFHLElBQUcsRUFBRSxHQUFHLEdBQUUsR0FBRSxRQUFPLEVBQUMsSUFBRyxFQUFFLEdBQUcsSUFBRyxNQUFLLEVBQUUsR0FBRyxNQUFLLE9BQU0sRUFBRSxHQUFHLE9BQU0sSUFBRyxFQUFFLEdBQUcsSUFBRyxJQUFHLEVBQUUsR0FBRyxHQUFFLEVBQUMsR0FBRSxNQUFLLEVBQUMsTUFBSyxFQUFDLElBQUcsRUFBRSxHQUFHLElBQUcsSUFBRyxFQUFFLEdBQUcsSUFBRyxVQUFTLEVBQUUsR0FBRyxTQUFRLEdBQUUsUUFBTyxDQUFDLEVBQUMsR0FBRSxJQUFHLEVBQUMsTUFBSyxFQUFDLElBQUcsRUFBRSxHQUFHLElBQUcsSUFBRyxFQUFFLEdBQUcsR0FBRSxHQUFFLFFBQU8sR0FBRSxFQUFDO0FBQUcsY0FBRSxHQUFHLEdBQUUsR0FBRSxHQUFFLENBQUM7QUFBRSxZQUFFLEVBQUUsSUFBSSxLQUFHLEVBQUUsS0FBRyxFQUFFLEdBQUcsSUFBSSxNQUFLLEVBQUUsS0FBRyxFQUFFLEdBQUcsSUFBSSxRQUFPLEVBQUUsS0FBRyxDQUFDLEtBQUcsV0FDN2Us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QUcsRUFBRSxTQUFTLEdBQUUsSUFBSSxFQUFFLFNBQVMsR0FBRSxJQUFFLENBQUMsR0FBRSxDQUFDO0FBQUEsY0FBTyxNQUFJLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBSSxHQUFFLElBQUUsQ0FBQyxJQUFFLEVBQUUsSUFBRSxDQUFDO0FBQUUsaUJBQU87QUFBQSxRQUFDLEdBQUUsTUFBTSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUFDLFlBQUUsV0FBUyxFQUFFLFdBQVMsSUFBRTtBQUFJLGNBQUcsQ0FBQyxFQUFFLFFBQU87QUFBRSxjQUFFLEVBQUU7QUFBSyxZQUFFLFFBQU0sRUFBRSxRQUFNLEtBQUssSUFBSTtBQUFFLGNBQUcsRUFBRSxhQUFXLENBQUMsRUFBRSxNQUFJLEVBQUUsR0FBRyxXQUFVO0FBQUMsZ0JBQUcsRUFBRSxRQUFPLEVBQUUsS0FBRyxFQUFFLFNBQVMsR0FBRSxJQUFFLENBQUMsR0FBRSxFQUFFLEtBQUc7QUFBRSxnQkFBRyxNQUFJLEVBQUUsTUFDbGYsTUFBSSxFQUFFLFFBQU8sRUFBRSxLQUFHLEVBQUUsTUFBTSxHQUFFLElBQUUsQ0FBQyxHQUFFLEVBQUUsS0FBRztBQUFFLGdCQUFHLElBQUUsS0FBRyxFQUFFLEdBQUcsUUFBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLFNBQVMsR0FBRSxJQUFFLENBQUMsR0FBRSxDQUFDLEdBQUU7QUFBQSxVQUFDO0FBQUMsY0FBRSxJQUFFO0FBQUUsY0FBSSxJQUFFLEVBQUUsS0FBRyxFQUFFLEdBQUcsU0FBTztBQUFFLGVBQUcsTUFBSSxJQUFFLEtBQUssSUFBSSxHQUFFLEtBQUcsVUFBUSxJQUFFLElBQUUsV0FBUyxDQUFDLEdBQUUsS0FBRyxNQUFJLElBQUUsS0FBSyxJQUFJLEdBQUUsR0FBRyxJQUFHLElBQUUsRUFBRSxJQUFHLEVBQUUsS0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFFLElBQUUsRUFBRSxNQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsU0FBUyxHQUFFLEVBQUUsRUFBRSxHQUFFLENBQUM7QUFBRyxjQUFHLEVBQUUsR0FBRyxZQUFVLEVBQUUsU0FBUyxHQUFFLEdBQUcsSUFBSSxFQUFFLFNBQVMsR0FBRSxJQUFFLENBQUMsR0FBRSxDQUFDO0FBQUEsY0FBTyxNQUFJLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBSSxHQUFFLEdBQUcsSUFBRSxDQUFDLElBQUUsRUFBRSxJQUFFLENBQUM7QUFBRSxZQUFFLEtBQUcsS0FBSyxJQUFJLEVBQUUsSUFBRyxJQUFFLENBQUM7QUFBRSxpQkFBTztBQUFBLFFBQUMsR0FBRSxHQUFHLEdBQUUsR0FBRSxHQUFFO0FBQUMsZ0JBQUksSUFBRSxLQUFHLEVBQUUsV0FBUyxNQUFJLEtBQUcsV0FBUyxFQUFFLEtBQUssT0FBSyxXQUFTLEtBQUcsRUFBRSxLQUFLO0FBQUksY0FBRyxJQUFFLEVBQUUsT0FBTSxJQUFJLEVBQUUsRUFBRTtBQUNuZixpQkFBTztBQUFBLFFBQUMsR0FBRSxHQUFHLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUFDLGNBQUcsV0FBUyxFQUFFLEtBQUssT0FBSyxPQUFPLE9BQU0sSUFBSSxFQUFFLEVBQUU7QUFBRSxjQUFFLEVBQUUsS0FBSztBQUFHLGNBQUcsSUFBRSxLQUFHLENBQUMsS0FBRyxFQUFFLFdBQVMsRUFBRSxRQUFPO0FBQUMsZ0JBQUU7QUFBRyxnQkFBRSxRQUFNLEtBQUssS0FBSyxJQUFFLEtBQUs7QUFBRSxnQkFBSSxJQUFFLEdBQUcsT0FBTSxDQUFDO0FBQUUsaUJBQUcsRUFBRSxLQUFLLEdBQUUsR0FBRSxJQUFFLENBQUM7QUFBRSxnQkFBRTtBQUFFLGdCQUFHLENBQUMsRUFBRSxPQUFNLElBQUksRUFBRSxFQUFFO0FBQUUsZ0JBQUcsR0FBRTtBQUFDLGtCQUFHLElBQUUsS0FBRyxJQUFFLElBQUUsRUFBRSxPQUFPLEdBQUUsV0FBUyxJQUFFLEVBQUUsU0FBUyxHQUFFLElBQUUsQ0FBQyxJQUFFLElBQUUsTUFBTSxVQUFVLE1BQU0sS0FBSyxHQUFFLEdBQUUsSUFBRSxDQUFDO0FBQUUsZ0JBQUUsSUFBSSxHQUFFLENBQUM7QUFBQSxZQUFDO0FBQUEsVUFBQyxNQUFNLEtBQUUsT0FBRyxJQUFFLEVBQUU7QUFBVyxpQkFBTSxFQUFDLElBQUcsR0FBRSxJQUFHLEVBQUM7QUFBQSxRQUFDLEdBQUUsR0FBRyxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQUMsWUFBRSxHQUFHLE1BQU0sR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEtBQUU7QUFBRSxpQkFBTztBQUFBLFFBQUMsRUFBQyxFQUFDLEdBQUUsS0FBRyxDQUFDLEdBQUUsTUFBSTtBQUFDLGNBQUksSUFBRTtBQUFFLGdCQUFJLEtBQUc7QUFBSyxnQkFBSSxLQUFHO0FBQUssaUJBQU87QUFBQSxRQUFDLEdBQUUsS0FBRyxNQUFLLEtBQUcsQ0FBQyxHQUFFLEtBQUcsQ0FBQyxHQUFFLEtBQUcsR0FBRSxJQUFFLE1BQUssS0FBRyxPQUNwZixLQUFHLE1BQUcsS0FBRyxDQUFDLEdBQUUsSUFBRSxNQUFLO0FBQUEsVUFBbUIsWUFBWSxHQUFFO0FBQWhDLHdDQUFLO0FBQTRCLGlCQUFLLEtBQUc7QUFBQSxVQUFDO0FBQUEsUUFBQyxHQUFFLEtBQUcsTUFBSztBQUFBLFVBQUw7QUFBTSxzQ0FBRyxDQUFDO0FBQUUsd0NBQUs7QUFBQTtBQUFBLFVBQUssSUFBSSxRQUFPO0FBQUMsbUJBQU8sS0FBSyxHQUFHO0FBQUEsVUFBSztBQUFBLFVBQUMsSUFBSSxNQUFNLEdBQUU7QUFBQyxpQkFBSyxHQUFHLFFBQU07QUFBQSxVQUFDO0FBQUEsVUFBQyxJQUFJLFdBQVU7QUFBQyxtQkFBTyxLQUFLLEdBQUc7QUFBQSxVQUFRO0FBQUEsVUFBQyxJQUFJLFNBQVMsR0FBRTtBQUFDLGlCQUFLLEdBQUcsV0FBUztBQUFBLFVBQUM7QUFBQSxRQUFDLEdBQUUsS0FBRyxNQUFLO0FBQUEsVUFBcUIsWUFBWSxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQXhDLHNDQUFHLENBQUM7QUFBRSxzQ0FBRyxDQUFDO0FBQUUsc0NBQUc7QUFBMEIsc0JBQUk7QUFBSyxpQkFBSyxTQUFPO0FBQUUsaUJBQUssS0FBRyxFQUFFO0FBQUcsaUJBQUssS0FBRztBQUFLLGlCQUFLLE9BQUs7QUFBRSxpQkFBSyxPQUFLO0FBQUUsaUJBQUssT0FBSztBQUFFLGlCQUFLLFFBQU0sS0FBSyxRQUFNLEtBQUssUUFBTSxLQUFLLElBQUk7QUFBQSxVQUFDO0FBQUEsVUFBQyxJQUFJLE9BQU07QUFBQyxtQkFBTyxTQUFPLEtBQUssT0FBSztBQUFBLFVBQUk7QUFBQSxVQUFDLElBQUksS0FBSyxHQUFFO0FBQUMsZ0JBQUUsS0FBSyxRQUFNLE1BQUksS0FBSyxRQUFNO0FBQUEsVUFBSTtBQUFBLFVBQUMsSUFBSSxRQUFPO0FBQUMsbUJBQU8sU0FDOWYsS0FBSyxPQUFLO0FBQUEsVUFBSTtBQUFBLFVBQUMsSUFBSSxNQUFNLEdBQUU7QUFBQyxnQkFBRSxLQUFLLFFBQU0sTUFBSSxLQUFLLFFBQU07QUFBQSxVQUFJO0FBQUEsUUFBQztBQUM5RCxpQkFBUyxFQUFFLEdBQUUsSUFBRSxDQUFDLEdBQUU7QUFBQyxjQUFHLENBQUMsRUFBRSxPQUFNLElBQUksRUFBRSxFQUFFO0FBQUUsWUFBRSxPQUFLLEVBQUUsS0FBRztBQUFJLGtCQUFNLEVBQUUsT0FBTyxDQUFDLE1BQUksSUFBRSxPQUFLO0FBQUcsY0FBSSxJQUFFO0FBQUUsWUFBRSxRQUFLLEtBQUcsR0FBRSxLQUFJO0FBQUMsZ0JBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxPQUFPLE9BQUcsQ0FBQyxDQUFDLENBQUM7QUFBRSxxQkFBUSxJQUFFLElBQUcsSUFBRSxLQUFJLElBQUUsR0FBRSxJQUFFLEVBQUUsUUFBTyxLQUFJO0FBQUMsa0JBQUksSUFBRSxNQUFJLEVBQUUsU0FBTztBQUFFLGtCQUFHLEtBQUcsRUFBRSxPQUFPO0FBQU0sa0JBQUcsUUFBTSxFQUFFLENBQUMsRUFBRSxLQUFHLFNBQU8sRUFBRSxDQUFDLEVBQUUsS0FBRyxJQUFFLEdBQUcsQ0FBQyxHQUFFLE1BQUksRUFBRSxRQUFPO0FBQUMsb0JBQUUsSUFBRSxNQUFJLEVBQUUsTUFBTSxJQUFFLENBQUMsRUFBRSxLQUFLLEdBQUc7QUFBRTtBQUFJLHlCQUFTO0FBQUEsY0FBQyxNQUFNLEtBQUUsRUFBRTtBQUFBLG1CQUFXO0FBQUMsb0JBQUUsR0FBRyxJQUFFLE1BQUksRUFBRSxDQUFDLENBQUM7QUFBRSxvQkFBRztBQUFDLHNCQUFFLEVBQUUsR0FBRSxFQUFFLENBQUMsQ0FBQztBQUFBLGdCQUFDLFNBQU8sR0FBRTtBQUFDLHNCQUFHLE9BQUssR0FBRyxNQUFJLEtBQUcsRUFBRSxHQUFHLFFBQU0sRUFBQyxNQUFLLEVBQUM7QUFBRSx3QkFBTTtBQUFBLGdCQUFFO0FBQUMsaUJBQUMsRUFBRSxNQUFJLEtBQUcsQ0FBQyxFQUFFLE9BQUssSUFBRSxFQUFFLEdBQUc7QUFBTSxvQkFBRyxXQUFTLEVBQUUsT0FBSyxXQUFTLENBQUMsS0FBRyxFQUFFLEtBQUk7QUFBQyxzQkFBRyxDQUFDLEVBQUUsR0FBRyxTQUFTLE9BQU0sSUFBSSxFQUFFLEVBQUU7QUFDdmhCLHNCQUFFLEVBQUUsR0FBRyxTQUFTLENBQUM7QUFBRSwwQkFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFJLElBQUUsR0FBRyxDQUFDLElBQUUsTUFBSTtBQUFHLHNCQUFFLElBQUUsTUFBSSxFQUFFLE1BQU0sSUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUUsMkJBQVM7QUFBQSxnQkFBQztBQUFBLGNBQUM7QUFBQSxZQUFDO0FBQUMsbUJBQU0sRUFBQyxNQUFLLEdBQUUsTUFBSyxFQUFDO0FBQUEsVUFBQztBQUFDLGdCQUFNLElBQUksRUFBRSxFQUFFO0FBQUEsUUFBRTtBQUFDLGlCQUFTLEdBQUcsR0FBRTtBQUFDLG1CQUFRLE9BQUk7QUFBQyxnQkFBRyxNQUFJLEVBQUUsT0FBTyxRQUFPLElBQUUsRUFBRSxHQUFHLElBQUcsSUFBRSxRQUFNLEVBQUUsRUFBRSxTQUFPLENBQUMsSUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUcsSUFBRSxJQUFFO0FBQUUsZ0JBQUUsSUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBRyxFQUFFO0FBQUssZ0JBQUUsRUFBRTtBQUFBLFVBQU07QUFBQSxRQUFDO0FBQUMsaUJBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxtQkFBUSxJQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPLElBQUksTUFBRyxLQUFHLEtBQUcsSUFBRSxFQUFFLFdBQVcsQ0FBQyxJQUFFO0FBQUUsa0JBQU8sSUFBRSxNQUFJLEtBQUcsRUFBRTtBQUFBLFFBQU07QUFDM1gsaUJBQVMsR0FBRyxHQUFFO0FBQUMsY0FBSSxJQUFFLEdBQUcsRUFBRSxPQUFPLElBQUcsRUFBRSxJQUFJO0FBQUUsY0FBRyxFQUFFLENBQUMsTUFBSSxFQUFFLEdBQUUsQ0FBQyxJQUFFLEVBQUU7QUFBQSxjQUFRLE1BQUksSUFBRSxFQUFFLENBQUMsR0FBRSxLQUFHO0FBQUMsZ0JBQUcsRUFBRSxPQUFLLEdBQUU7QUFBQyxnQkFBRSxLQUFHLEVBQUU7QUFBRztBQUFBLFlBQUs7QUFBQyxnQkFBRSxFQUFFO0FBQUEsVUFBRTtBQUFBLFFBQUM7QUFBQyxpQkFBUyxFQUFFLEdBQUUsR0FBRTtBQUFDLGNBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFHLElBQUUsR0FBRyxHQUFFLEdBQUcsS0FBRyxJQUFFLEVBQUUsR0FBRyxTQUFPLElBQUUsSUFBRTtBQUFHLGNBQUcsRUFBRSxPQUFNLElBQUksRUFBRSxDQUFDO0FBQUUsZUFBSSxJQUFFLEVBQUUsR0FBRyxFQUFFLElBQUcsQ0FBQyxDQUFDLEdBQUUsR0FBRSxJQUFFLEVBQUUsSUFBRztBQUFDLGdCQUFJLElBQUUsRUFBRTtBQUFLLGdCQUFHLEVBQUUsT0FBTyxPQUFLLEVBQUUsTUFBSSxNQUFJLEVBQUUsUUFBTztBQUFBLFVBQUM7QUFBQyxpQkFBTyxFQUFFLEdBQUcsT0FBTyxHQUFFLENBQUM7QUFBQSxRQUFDO0FBQUMsaUJBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQUMsY0FBRSxJQUFJLEdBQUcsR0FBRSxHQUFFLEdBQUUsQ0FBQztBQUFFLGNBQUUsR0FBRyxFQUFFLE9BQU8sSUFBRyxFQUFFLElBQUk7QUFBRSxZQUFFLEtBQUcsRUFBRSxDQUFDO0FBQUUsaUJBQU8sRUFBRSxDQUFDLElBQUU7QUFBQSxRQUFDO0FBQUMsaUJBQVMsRUFBRSxHQUFFO0FBQUMsaUJBQU8sV0FBUyxJQUFFO0FBQUEsUUFBTTtBQUN6YixpQkFBUyxHQUFHLEdBQUU7QUFBQyxjQUFJLElBQUUsQ0FBQyxLQUFJLEtBQUksSUFBSSxFQUFFLElBQUUsQ0FBQztBQUFFLGNBQUUsUUFBTSxLQUFHO0FBQUssaUJBQU87QUFBQSxRQUFDO0FBQUMsaUJBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxjQUFHLEdBQUcsUUFBTztBQUFFLGNBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxLQUFHLEVBQUUsT0FBSyxLQUFJO0FBQUMsZ0JBQUcsRUFBRSxTQUFTLEdBQUcsS0FBRyxFQUFFLEVBQUUsT0FBSyxRQUFNLEVBQUUsU0FBUyxHQUFHLEtBQUcsRUFBRSxFQUFFLE9BQUssSUFBSSxRQUFPO0FBQUEsVUFBQyxNQUFNLFFBQU87QUFBRSxpQkFBTztBQUFBLFFBQUM7QUFBQyxpQkFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLGNBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQU87QUFBRyxjQUFHO0FBQUMsbUJBQU8sRUFBRSxHQUFFLENBQUMsR0FBRTtBQUFBLFVBQUUsU0FBTyxHQUFFO0FBQUEsVUFBQztBQUFDLGlCQUFPLEdBQUcsR0FBRSxJQUFJO0FBQUEsUUFBQztBQUM3VCxpQkFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFO0FBQUMsY0FBRztBQUFDLGdCQUFJLElBQUUsRUFBRSxHQUFFLENBQUM7QUFBQSxVQUFDLFNBQU8sR0FBRTtBQUFDLG1CQUFPLEVBQUU7QUFBQSxVQUFFO0FBQUMsY0FBRyxJQUFFLEdBQUcsR0FBRSxJQUFJLEVBQUUsUUFBTztBQUFFLGNBQUcsR0FBRTtBQUFDLGdCQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFPO0FBQUcsZ0JBQUcsTUFBSSxFQUFFLFVBQVEsUUFBTSxHQUFHLENBQUMsRUFBRSxRQUFPO0FBQUEsVUFBRSxXQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBTztBQUFHLGlCQUFPO0FBQUEsUUFBQztBQUFDLGlCQUFTLEdBQUcsR0FBRTtBQUFDLGNBQUcsQ0FBQyxFQUFFLE9BQU0sSUFBSSxFQUFFLEVBQUU7QUFBRSxpQkFBTztBQUFBLFFBQUM7QUFBQyxpQkFBUyxFQUFFLEdBQUU7QUFBQyxjQUFFLEdBQUcsQ0FBQztBQUFFLGNBQUcsQ0FBQyxFQUFFLE9BQU0sSUFBSSxFQUFFLENBQUM7QUFBRSxpQkFBTztBQUFBLFFBQUM7QUFBQyxpQkFBUyxHQUFHLEdBQUUsSUFBRSxJQUFHO0FBQUMsY0FBRSxPQUFPLE9BQU8sSUFBSSxNQUFHLENBQUM7QUFBRSxjQUFHLE1BQUksRUFBRSxJQUFFO0FBQUMsaUJBQUksSUFBRSxHQUFFLFFBQU0sR0FBRSxJQUFJLEtBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFNO0FBQUUsa0JBQU0sSUFBSSxFQUFFLEVBQUU7QUFBQSxVQUFFO0FBQUMsWUFBRSxLQUFHO0FBQUUsaUJBQU8sR0FBRyxDQUFDLElBQUU7QUFBQSxRQUFDO0FBQUMsaUJBQVMsR0FBRyxHQUFFLElBQUUsSUFBRztBQUFDLGNBQUUsR0FBRyxHQUFFLENBQUM7QUFBRSxZQUFFLElBQUksS0FBSyxDQUFDO0FBQUUsaUJBQU87QUFBQSxRQUFDO0FBQ3pkLGlCQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUU7QUFBQyxjQUFJLElBQUUsR0FBRyxHQUFHO0FBQUcsY0FBRSxJQUFFLElBQUU7QUFBRSxvQkFBSSxFQUFFLEdBQUc7QUFBRyxhQUFHLENBQUM7QUFBRSxZQUFFLEdBQUUsQ0FBQztBQUFBLFFBQUM7QUFBQyxZQUFJLEtBQUcsRUFBQyxLQUFLLEdBQUU7QUFBQyxZQUFFLEtBQUcsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFO0FBQUcsWUFBRSxHQUFHLE9BQU8sQ0FBQztBQUFBLFFBQUMsR0FBRSxLQUFJO0FBQUMsZ0JBQU0sSUFBSSxFQUFFLEVBQUU7QUFBQSxRQUFFLEVBQUM7QUFBRSxpQkFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLGFBQUcsQ0FBQyxJQUFFLEVBQUMsSUFBRyxFQUFDO0FBQUEsUUFBQztBQUFDLGlCQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsY0FBSSxJQUFFLFFBQU07QUFBRSxjQUFHLEtBQUcsR0FBRyxPQUFNLElBQUksRUFBRSxFQUFFO0FBQUUsY0FBRyxDQUFDLEtBQUcsR0FBRTtBQUFDLGdCQUFJLElBQUUsRUFBRSxHQUFFLEVBQUMsSUFBRyxNQUFFLENBQUM7QUFBRSxnQkFBRSxFQUFFO0FBQUssZ0JBQUUsRUFBRTtBQUFLLGdCQUFHLEVBQUUsR0FBRyxPQUFNLElBQUksRUFBRSxFQUFFO0FBQUUsZ0JBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU0sSUFBSSxFQUFFLEVBQUU7QUFBQSxVQUFFO0FBQUMsY0FBRSxFQUFDLE1BQUssR0FBRSxJQUFHLENBQUMsR0FBRSxJQUFHLEdBQUUsSUFBRyxDQUFDLEVBQUM7QUFBRSxjQUFFLEVBQUUsR0FBRyxDQUFDO0FBQUUsWUFBRSxLQUFHO0FBQUUsWUFBRSxPQUFLO0FBQUUsY0FBRSxLQUFHLElBQUUsTUFBSSxFQUFFLEtBQUcsR0FBRSxFQUFFLE1BQUksRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQUEsUUFBRTtBQUM3YSxpQkFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFO0FBQUMsY0FBSSxJQUFFLEVBQUUsR0FBRSxFQUFDLFFBQU8sS0FBRSxDQUFDLEVBQUU7QUFBSyxjQUFFLEdBQUcsQ0FBQztBQUFFLGNBQUcsQ0FBQyxFQUFFLE9BQU0sSUFBSSxFQUFFLEVBQUU7QUFBRSxjQUFHLFFBQU0sS0FBRyxTQUFPLEVBQUUsT0FBTSxJQUFJLEVBQUUsRUFBRTtBQUFFLGNBQUksSUFBRSxHQUFHLEdBQUUsQ0FBQztBQUFFLGNBQUcsRUFBRSxPQUFNLElBQUksRUFBRSxDQUFDO0FBQUUsY0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU0sSUFBSSxFQUFFLEVBQUU7QUFBRSxpQkFBTyxFQUFFLEdBQUcsR0FBRyxHQUFFLEdBQUUsR0FBRSxDQUFDO0FBQUEsUUFBQztBQUFDLGlCQUFTLEdBQUcsR0FBRSxJQUFFLEtBQUk7QUFBQyxpQkFBTyxHQUFHLEdBQUUsSUFBRSxPQUFLLE9BQU0sQ0FBQztBQUFBLFFBQUM7QUFBQyxpQkFBUyxFQUFFLEdBQUUsSUFBRSxLQUFJO0FBQUMsaUJBQU8sR0FBRyxHQUFFLElBQUUsT0FBSyxPQUFNLENBQUM7QUFBQSxRQUFDO0FBQUMsaUJBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRTtBQUFDLHlCQUFhLE9BQU8sTUFBSSxJQUFFLEdBQUUsSUFBRTtBQUFLLGFBQUcsR0FBRSxJQUFFLE1BQUssQ0FBQztBQUFBLFFBQUM7QUFDN1csaUJBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxjQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTSxJQUFJLEVBQUUsRUFBRTtBQUFFLGNBQUksSUFBRSxFQUFFLEdBQUUsRUFBQyxRQUFPLEtBQUUsQ0FBQyxFQUFFO0FBQUssY0FBRyxDQUFDLEVBQUUsT0FBTSxJQUFJLEVBQUUsRUFBRTtBQUFFLGNBQUUsR0FBRyxDQUFDO0FBQUUsY0FBSSxJQUFFLEdBQUcsR0FBRSxDQUFDO0FBQUUsY0FBRyxFQUFFLE9BQU0sSUFBSSxFQUFFLENBQUM7QUFBRSxjQUFHLENBQUMsRUFBRSxHQUFHLFFBQVEsT0FBTSxJQUFJLEVBQUUsRUFBRTtBQUFFLFlBQUUsR0FBRyxRQUFRLEdBQUUsR0FBRSxDQUFDO0FBQUEsUUFBQztBQUFDLGlCQUFTLEdBQUcsR0FBRTtBQUFDLGNBQUksSUFBRSxFQUFFLEdBQUUsRUFBQyxRQUFPLEtBQUUsQ0FBQyxFQUFFO0FBQUssY0FBRSxHQUFHLENBQUM7QUFBRSxjQUFJLElBQUUsRUFBRSxHQUFFLENBQUMsR0FBRSxJQUFFLEdBQUcsR0FBRSxHQUFFLElBQUU7QUFBRSxjQUFHLEVBQUUsT0FBTSxJQUFJLEVBQUUsQ0FBQztBQUFFLGNBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxPQUFNLElBQUksRUFBRSxFQUFFO0FBQUUsY0FBRyxFQUFFLEdBQUcsT0FBTSxJQUFJLEVBQUUsRUFB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O0FBQUMsaUJBQU8sSUFBRSxNQUFJO0FBQUEsUUFBQztBQUN0SSxpQkFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFlBQUUsS0FBRyxDQUFDLElBQUUsRUFBRTtBQUFJLFlBQUUsSUFBRSxLQUFHLENBQUMsSUFBRSxFQUFFO0FBQUssWUFBRSxJQUFFLEtBQUcsQ0FBQyxJQUFFLEVBQUU7QUFBTSxZQUFFLElBQUUsTUFBSSxDQUFDLElBQUUsRUFBRTtBQUFJLFlBQUUsSUFBRSxNQUFJLENBQUMsSUFBRSxFQUFFO0FBQUksWUFBRSxJQUFFLE1BQUksQ0FBQyxJQUFFLEVBQUU7QUFBSyxZQUFFLElBQUUsTUFBSSxDQUFDLElBQUUsT0FBTyxFQUFFLElBQUk7QUFBRSxZQUFFLElBQUUsTUFBSSxDQUFDLElBQUU7QUFBSyxZQUFFLElBQUUsTUFBSSxDQUFDLElBQUUsRUFBRTtBQUFPLGNBQUksSUFBRSxFQUFFLE1BQU0sUUFBUSxHQUFFLElBQUUsRUFBRSxNQUFNLFFBQVEsR0FBRSxJQUFFLEVBQUUsTUFBTSxRQUFRO0FBQUUsWUFBRSxJQUFFLE1BQUksQ0FBQyxJQUFFLE9BQU8sS0FBSyxNQUFNLElBQUUsR0FBRyxDQUFDO0FBQUUsWUFBRSxJQUFFLE1BQUksQ0FBQyxJQUFFLElBQUUsTUFBSTtBQUFJLFlBQUUsSUFBRSxNQUFJLENBQUMsSUFBRSxPQUFPLEtBQUssTUFBTSxJQUFFLEdBQUcsQ0FBQztBQUFFLFlBQUUsSUFBRSxNQUFJLENBQUMsSUFBRSxJQUFFLE1BQUk7QUFBSSxZQUFFLElBQUUsTUFBSSxDQUFDLElBQUUsT0FBTyxLQUFLLE1BQU0sSUFBRSxHQUFHLENBQUM7QUFBRSxZQUFFLElBQUUsTUFBSSxDQUFDLElBQUUsSUFBRSxNQUFJO0FBQUksWUFBRSxJQUFFLE1BQUksQ0FBQyxJQUFFLE9BQU8sRUFBRSxHQUFHO0FBQUUsaUJBQU87QUFBQSxRQUFDO0FBQ25jLFlBQUksS0FBRyxRQUFPLEtBQUcsTUFBSTtBQUFDLGNBQUksSUFBRSxFQUFFLENBQUMsTUFBSSxDQUFDO0FBQUUsZ0JBQUk7QUFB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
