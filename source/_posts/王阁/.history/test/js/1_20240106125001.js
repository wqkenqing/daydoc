"use strict";
(self.webpackChunkmain = self.webpackChunkmain || []).push([[44], {
    41044: (E,c,s)=>{
        s.r(c),
        s.d(c, {
            frontierInit: ()=>b
        });
        var p = s(60193), I = s(78032), l;
        (function(n) {
            n[n.Room = 1] = "Room",
            n[n.RestBuy = 2] = "RestBuy",
            n[n.IdentifyVerification = 3] = "IdentifyVerification"
        }
        )(l || (l = {}));
        var u;
        (function(n) {
            n[n.Pull = 1] = "Pull",
            n[n.Push = 2] = "Push"
        }
        )(u || (u = {}));
        var f;
        (function(n) {
            n[n.NoOrderLimit = 0] = "NoOrderLimit",
            n[n.Limiting = 1] = "Limiting"
        }
        )(f || (f = {}));
        var a;
        (function(n) {
            n[n.RoomStartFinish = 1] = "RoomStartFinish",
            n[n.Violation = 2] = "Violation",
            n[n.LimitOrder = 3] = "LimitOrder",
            n[n.DownGradeAll = 255] = "DownGradeAll"
        }
        )(a || (a = {}));
        var o = s(92523)
          , _ = s(76095)
          , G = s.n(_);
        const O = ["passport_auth_status_ss", "passport_auth_status", "uid_tt", "udi_tt_ss", "sid_tt", "sessionid", "sessionid_ss", "sid_ucp_v1", "ssid_ucp_v1", "sid_guard", "msToken", "ucas_c0_ss_buyin", "ucas_c0_buyin", "buyin_shop_type", "buyin_app_id", "SASID"]
          , y = {
            type: I.Rj.Poll,
            persist_types: [],
            tt_wid: "",
            access_key: ""
        };
        function b(n) {
            const {connection_config: r=y} = n
              , {tt_wid: v, access_key: w, persist_types: d} = r;
            if (d && d.length > 0 && d.indexOf(a.DownGradeAll) === -1 && v && w) {
                const m = {};
                O.forEach(t=>{
                    const i = G().get(t);
                    i && (m[t] = i)
                }
                );
                const e = new p.FWS({
                    fpID: o.BEe,
                    aID: o.P9l,
                    accessKey: w || "",
                    deviceID: v,
                    maxRetries: 10,
                    service: o.SAy,
                    customParams: m,
                    automaticOpen: !0,
                    enableAutoAck: !0,
                    url: o.jU9
                });
                e.addEventListener("error", t=>{
                    var i;
                    (i = window.SlardarWeb) == null || i.call(window, "sendEvent", {
                        name: "websocketError",
                        categories: {
                            userInfo: n,
                            event: t
                        }
                    })
                }
                ),
                e.addEventListener("close", t=>{
                    var i, h;
                    (i = window.Garfish.channel) == null || i.emit("wsClose"),
                    (h = window.SlardarWeb) == null || h.call(window, "sendEvent", {
                        name: "websocketClose",
                        categories: {
                            userInfo: n,
                            event: t
                        }
                    })
                }
                ),
                e.addEventListener("open", ()=>{
                    var t;
                    (t = window.Garfish.channel) == null || t.emit("wsOpen")
                }
                );
                const A = r.persist_types.indexOf(1) !== -1
                  , C = r.persist_types.indexOf(2) !== -1;
                window.Garfish.setGlobalValue("frontierInstance", e),
                window.Garfish.setGlobalValue("persistType1", A),
                window.Garfish.setGlobalValue("persistType2", C)
            }
        }
    }
}]);

//# sourceMappingURL=44_50959984.js.map
