"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[893],{"./src/diagram/constants.ts":(t,e,n)=>{n.d(e,{M:()=>i,R:()=>o,_:()=>s,ee:()=>r,o:()=>a});var i=.1406,o=.02625,r=.98,a=.212,s=.14},"./src/mathaven.ts":(t,e,n)=>{var i=n("./src/diagram/constants.ts"),o=n("./src/model/physics/mathaven.ts");function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e,n){return(a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var i=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=s(t)););return t}(t,e);if(i){var o=Object.getOwnPropertyDescriptor(i,e);return o.get?o.get.call(n||t):o.value}})(t,e,n||t)}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function l(t,e){return(l=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(c=function(){return!!t})()}var u=function(t){var e;function n(){var t,e,i,o;return!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,n),e=n,i=arguments,e=s(e),r(t=(o=c()?Reflect.construct(e,i||[],s(this).constructor):e.apply(this,i))&&("object"==(o&&"undefined"!=typeof Symbol&&o.constructor===Symbol?"symbol":typeof o)||"function"==typeof o)?o:function(t){if(void 0===t)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(this),"h",[]),r(t,"extractValues",function(e){return t.h.map(e).map(function(t){return null!=t?t:0})}),t}return!function(t,e){if("function"!=typeof e&&null!==e)throw TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&l(t,e)}(n,t),e=[{key:"updateSingleStep",value:function(t){a(s(n.prototype),"updateSingleStep",this).call(this,t),this.h.push(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){r(t,e,n[e])})}return t}({},this))}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(n.prototype,e),n}(o.z),h={responsive:!0,showLink:!0,plotlyServerURL:"https://chart-studio.plotly.com"},v={legend:{font:{color:"#4D5663"},bgcolor:"#e5e6F9"},title:{text:"",font:{size:11}},xaxis:{title:"impulse",tickfont:{color:"#4D5663"},gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},yaxis:{title:"value",tickfont:{color:"#4D5663"},zeroline:!1,gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},plot_bgcolor:"#F5F6F9",paper_bgcolor:"#F2F6F9"};function f(t){return"hsl(".concat(137.5*t%360,", ").concat(70,"%, ").concat(50,"%)")}function p(t,e,n,i){return{x:t,y:e,name:n,line:{color:i,width:1.3},mode:"lines",type:"scatter"}}var d=function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"plot",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Math.PI/4,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2*t/i.R,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1.5*t/i.R,r=new u(i.M,i.R,i.ee,i.o,i._);try{r.solvePaper(t,e,n,o)}catch(t){console.error(t)}var a=r.extractValues,s=a(function(t){return t.P});v.title.text="<b>Figure.12</b> Slip–impulse curves \nfor V0 = 2 m/s, α = 45◦,ωS0 = 2V0/R, and ωT0 = 1.5V0/R \n<br>(s and φ are for the slip at the cushion, \nand sʹ and φʹ are for the slip at the table)",window.Plotly.newPlot("mathaven-impulse",[p(s,a(function(t){return t.s}),"s",f(0)),p(s,a(function(t){return t.φ}),"φ",f(1)),p(s,a(function(t){return t.sʹ}),"s'",f(2)),p(s,a(function(t){return t.φʹ}),"φʹ",f(3)),p(s,a(function(t){return t.WzI}),"WzI",f(4)),p(s,a(function(t){return t.P}),"P",f(5))],v,h)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),y=function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"getFinalState",value:function(t,e,n,r){try{var a=new o.z(i.M,i.R,i.ee,i.o,i._);a.solvePaper(t,e,n,r);var s=a.vy,l=a.vx;return{beta:180/Math.PI*Math.atan2(-s,l),speed:Math.sqrt(l*l+s*s)}}catch(t){return console.error(t),{beta:NaN,speed:NaN}}}},{key:"plot",value:function(t,e,n){for(var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(t){return 0},r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(t){return t/i.R},a=[],s=[],l=[],c=-1;c<=2;c++){var u=[],d=[];l=[];for(var y=1;y<90;y+=9){l.push(y);var g=this.getFinalState(1,Math.PI/180*y,o(c),r(c));u.push(g.speed),d.push(g.beta)}a.push(u),s.push(d)}var b=l;v.title.text=n,window.Plotly.newPlot(t,[p(b,a[0],"k=-1",f(0)),p(b,a[1],"k=0",f(1)),p(b,a[2],"k=1",f(2)),p(b,a[3],"k=2",f(3))],v,h),window.Plotly.newPlot(e,[p(b,s[0],"k=-1",f(0)),p(b,s[1],"k=0",f(1)),p(b,s[2],"k=1",f(2)),p(b,s[3],"k=2",f(3))],v,h)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),g=n("./node_modules/three/build/three.core.js"),b=n("./src/model/ball.ts"),w=n("./src/utils/utils.ts"),m=n("./src/model/physics/constants.ts");function M(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var P=function(){var t;function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e),M(this,"log",void 0),this.log=t}return t=[{key:"dynamicFriction",value:function(t){return e.a+e.b*Math.exp(-e.c*t)}},{key:"relativeVelocity",value:function(t,n,i,o){return Math.sqrt(Math.pow(t*Math.sin(o)-i*e.R,2)+Math.pow(Math.cos(o)*n*e.R,2))}},{key:"throwAngle",value:function(t,n,i,o){var r=this.relativeVelocity(t,n,i,o),a=this.dynamicFriction(r),s=Math.min(a*t*Math.cos(o)/r,1/7)*(t*Math.sin(o)-e.R*i),l=t*Math.cos(o);return this.log("inputs:v=".concat(t,", ωx=").concat(n,", ωz=").concat(i,", ϕ=").concat(o)),this.log("   v * Math.sin(ϕ) =".concat(t*Math.sin(o))),this.log("   CollisionThrow.R * ωz =".concat(e.R*i)),this.log("   Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) =".concat(Math.min(a*t*Math.cos(o)/r,1/7))),this.log("   (v * Math.sin(ϕ) - CollisionThrow.R * ωz) =".concat(t*Math.sin(o)-e.R*i)),this.log(""),this.log("vRel = ",r),this.log("μ = ",a),this.log("numerator = ",s),this.log("denominator = ",l),this.log("throw = ",Math.atan2(s,l)),Math.atan2(s,l)}},{key:"plot",value:function(t,n,i,o){var r=new b.c(w.v_);r.vel.copy(new g.Pq0(0,t,0)),r.rvel.copy(new g.Pq0(n,0,i));var a=new g.Pq0(0,2*e.R).applyAxisAngle(w.up,o),s=new b.c(a);return this.log("---original---"),this.throwAngle(t,n,i,o),this.log(""),this.log("---new code"),this.updateVelocities(r,s)}},{key:"updateVelocities",value:function(t,e){var n=e.pos.clone().sub(t.pos).normalize(),i=new g.Pq0(-n.y,n.x,0),o=t.vel.clone().sub(e.vel).add(n.clone().multiplyScalar(-.029).cross(t.rvel).sub(n.clone().multiplyScalar(.029).cross(e.rvel))),r=n.dot(o),a=o.addScaledVector(n,-r),s=a.length(),l=i.dot(a),c=this.dynamicFriction(s),u=r,h=-(Math.min(c*r/s,1/7)*l),v=Math.atan2(h,u);this.log("vRelMag =",s),this.log("μ =",c),this.log("tangentialImpulse (numerator)=",h),this.log("normalImpulse (denominator)=",u),this.log("throwAngle =",v),this.log(""),this.log("Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) = ".concat(Math.min(c*r/s,1/7))),this.log("(-vRelMag * Math.sign(vRelTangential)) = ".concat(-s*Math.sign(l))),this.log("vRelNormalMag =",r),this.log("vRelTangential =",l),h=-(Math.min(c*Math.abs(u=-1.98*r/(2/m.m))/s,1/7)*l);var f=n.clone().multiplyScalar(u),p=i.clone().multiplyScalar(h);t.vel.addScaledVector(f,1/m.m).addScaledVector(p,1/m.m),e.vel.addScaledVector(f,-1/m.m).addScaledVector(p,-1/m.m);var d=n.clone().multiplyScalar(-.029).cross(p),y=n.clone().multiplyScalar(.029).cross(p);return t.rvel.addScaledVector(d,1/m.I),e.rvel.addScaledVector(y,1/m.I),v}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();function R(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){var i;i=n[e],e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i})}return t}M(P,"R",.029),M(P,"a",.01),M(P,"b",.108),M(P,"c",1.088);var k=function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"degToRad",value:function(t){return Math.PI/180*t}},{key:"radToDeg",value:function(t){return 180/Math.PI*t}},{key:"plotCutAngle",value:function(){var t=P.R;this.plot("collision-throw-roll",[.447,1.341,3.129],function(e){return e/t}),this.plot("collision-throw-stun",[.447,1.341,3.129],function(t){return 0}),this.plotRolls("collision-throw-varying-roll",[0,.25,.5,1],function(e){return e/t},function(t){return 0},function(t){return t}),this.plotRolls("collision-throw-varying-side",[0,.25,.5,1],function(e){return e/t},function(e){return 1/t*(e-45)/45},function(t){return 0}),new P(console.log).plot(.5,-15,-10,Math.PI/8)}},{key:"plot",value:function(t,e,n){var i=this,o=[],r=[];e.forEach(function(t){var e=[];r=[];for(var a=1;a<90;a+=1){r.push(a);var s=new P().plot(t,n(t),0,i.degToRad(a));e.push(i.radToDeg(s))}o.push(e)});var a=R({},v);a.title.text="Throw effect (WIP)\n    <br>throw vs. cut angle for various-speed ".concat(t," shots\n    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf"),window.Plotly.newPlot(t,[p(r,o[0],"slow",f(4)),p(r,o[1],"medium",f(5)),p(r,o[2],"fast",f(6))],a,h)}},{key:"plotRolls",value:function(t,e,n,i,o){var r=this,a=[],s=[];e.forEach(function(t){var e=[];s=[];for(var l=1;l<90;l+=1){s.push(l);var c=new P().plot(1,n(t),i(l),r.degToRad(o(l)));e.push(r.radToDeg(c))}a.push(e)});var l=R({},v);l.title.text="Throw effect (WIP)\n    <br>throw vs. cut angle for various-speed ".concat(t," shots\n    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf"),window.Plotly.newPlot(t,[p(s,a[0],"0",f(4)),p(s,a[1],"0.25",f(5)),p(s,a[2],"0.5",f(6)),p(s,a[3],"1.0",f(7))],l,h)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();new d().plot(),new y().plot("mathaven-figure9-speed","mathaven-figure9-angle","<b>Figure.9</b> Rebound speed and rebound angle versus incident angle <br>\n    for different topspins of the ball, ωT0 = kV0/R and V0 = 1 m/s with no sidespin"),new y().plot("mathaven-figure10-speed","mathaven-figure10-angle","<b>Figure.10</b> Rebound speed and rebound angle versus incident angle <br>\nfor different sidespins of the ball,ωS0 = kV0/R and V0 = 1 m/s with the ball rolling (ωT0 = V0/R)",function(t){return t/i.R},function(t){return 1/i.R}),new k().plotCutAngle()},"./src/model/ball.ts":(t,e,n)=>{n.d(e,{c:()=>p,U:()=>f});var i=n("./src/utils/utils.ts"),o=n("./src/model/physics/physics.ts"),r=n("./node_modules/three/build/three.core.js"),a=n("./src/model/physics/constants.ts");function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var l=function(){var t;function e(t,n){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e),s(this,"line",void 0),s(this,"geometry",void 0),s(this,"positions",void 0),s(this,"lastPos",new r.Pq0),s(this,"lastVel",new r.Pq0),this.geometry=new r.LoY,this.positions=new Float32Array(3*t),this.geometry.setAttribute("position",new r.THS(this.positions,3)),this.reset();var i=new r.mrM({color:n,opacity:.25,linewidth:3,transparent:!0});this.line=new r.N1A(this.geometry,i),this.line.visible=!1}return t=[{key:"reset",value:function(){this.geometry.setDrawRange(0,0),this.lastVel.setZ(1)}},{key:"forceTrace",value:function(t){this.lastVel.z=1,this.addTraceGiven(t,this.lastVel,1,.1,1)}},{key:"addTrace",value:function(t,e){if(0!==e.length()){var n=this.lastVel.angleTo(e),i=n>Math.PI/32?.01*a.R:a.R,o=this.lastPos.distanceTo(t);this.addTraceGiven(t,e,o,i,n)}}},{key:"addTraceGiven",value:function(t,e,n,i,o){var r=this.geometry.drawRange.count;0!==r&&n<i||(r>1&&o<1e-4&&r--,this.lastPos.copy(t),this.lastVel.copy(e),this.addPoint(t,r))}},{key:"addPoint",value:function(t,e){var n=3*e;n>this.positions.length||(this.positions[n++]=t.x,this.positions[n++]=t.y,this.positions[n]=t.z,this.geometry.setDrawRange(0,e+1),this.line.geometry.attributes.position.needsUpdate=!0)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var u=function(){var t;function e(t){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e),c(this,"mesh",void 0),c(this,"shadow",void 0),c(this,"spinAxisArrow",void 0),c(this,"trace",void 0),c(this,"color",void 0),c(this,"m",new r.kn4),this.color=new r.Q1f(t),this.initialiseMesh(t)}return t=[{key:"updateAll",value:function(t,e){this.updatePosition(t.pos),this.updateArrows(t.pos,t.rvel,t.state),0!==t.rvel.lengthSq()&&(this.updateRotation(t.rvel,e),this.trace.addTrace(t.pos,t.vel))}},{key:"updatePosition",value:function(t){this.mesh.position.copy(t),this.shadow.position.copy(t)}},{key:"updateRotation",value:function(t,e){var n=t.length()*e;this.mesh.rotateOnWorldAxis((0,i.xb)(t),n)}},{key:"updateArrows",value:function(t,e,n){this.spinAxisArrow.setLength(a.R+a.R*e.length()/2,a.R,a.R),this.spinAxisArrow.position.copy(t),this.spinAxisArrow.setDirection((0,i.xb)(e)),n==f.Rolling?this.spinAxisArrow.setColor(0xcc0000):this.spinAxisArrow.setColor(52224)}},{key:"initialiseMesh",value:function(t){var e=new r.WBB(a.R,1),n=new r.tXL({emissive:0,flatShading:!0,vertexColors:!0,forceSinglePass:!0,shininess:25,specular:5592371});this.addDots(e,t),this.mesh=new r.eaF(e,n),this.mesh.name="ball",this.updateRotation(new r.Pq0().random(),100);var o=new r.tcD(.9*a.R,9);o.applyMatrix4(new r.kn4().identity().makeTranslation(0,0,-(.99*a.R)));var s=new r.V9B({color:1118498});this.shadow=new r.eaF(o,s),this.spinAxisArrow=new r.E0M(i.up,i.v_,2,0,.01,.01),this.spinAxisArrow.visible=!1,this.trace=new l(500,t)}},{key:"addDots",value:function(t,e){var n=this,i=t.attributes.position.count,o=new r.Q1f(e),a=new r.Q1f(0xaa2222);t.setAttribute("color",new r.THS(new Float32Array(3*i),3));for(var s=t.attributes.color,l=0;l<i/3;l++)this.colorVerticesForFace(l,s,this.scaleNoise(o.r),this.scaleNoise(o.g),this.scaleNoise(o.b));[0,96,111,156,186,195].forEach(function(t){n.colorVerticesForFace(t/3,s,a.r,a.g,a.b)})}},{key:"addToScene",value:function(t){t.add(this.mesh),t.add(this.shadow),t.add(this.spinAxisArrow),t.add(this.trace.line)}},{key:"colorVerticesForFace",value:function(t,e,n,i,o){e.setXYZ(3*t+0,n,i,o),e.setXYZ(3*t+1,n,i,o),e.setXYZ(3*t+2,n,i,o)}},{key:"scaleNoise",value:function(t){return(1-.25*Math.random())*t}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function v(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var f=function(t){return t.Stationary="Stationary",t.Rolling="Rolling",t.Sliding="Sliding",t.Falling="Falling",t.InPocket="InPocket",t}({}),p=function(){var t,e;function n(t,e){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,n),v(this,"pos",void 0),v(this,"vel",i.v_.clone()),v(this,"rvel",i.v_.clone()),v(this,"futurePos",i.v_.clone()),v(this,"ballmesh",void 0),v(this,"state","Stationary"),v(this,"pocket",void 0),v(this,"id",n.id++),this.pos=t.clone(),this.ballmesh=new u(e||0xeeeeee*Math.random())}return t=[{key:"update",value:function(t){this.updatePosition(t),"Falling"==this.state?this.pocket.updateFall(this,t):this.updateVelocity(t)}},{key:"updateMesh",value:function(t){this.ballmesh.updateAll(this,t)}},{key:"updatePosition",value:function(t){this.pos.addScaledVector(this.vel,t)}},{key:"updateVelocity",value:function(t){this.inMotion()&&(this.isRolling()?(this.state="Rolling",(0,o.lx)(this.vel,this.rvel),this.addDelta(t,(0,o.JD)(this.rvel))):(this.state="Sliding",this.addDelta(t,(0,o.p2)(this.vel,this.rvel))))}},{key:"addDelta",value:function(t,e){e.v.multiplyScalar(t),e.w.multiplyScalar(t),this.passesZero(e)||(this.vel.add(e.v),this.rvel.add(e.w))}},{key:"passesZero",value:function(t){var e=(0,i.rq)(this.vel,t.v),n=(0,i.rq)(this.rvel,t.w);return!!(("Rolling"===this.state?e||n:e&&n)&&.01>Math.abs(this.rvel.z))&&(this.setStationary(),!0)}},{key:"setStationary",value:function(){this.vel.copy(i.v_),this.rvel.copy(i.v_),this.state="Stationary"}},{key:"isRolling",value:function(){return 0!==this.vel.lengthSq()&&0!==this.rvel.lengthSq()&&(0,o.Mq)(this.vel,this.rvel).length()<n.transition}},{key:"onTable",value:function(){return"Falling"!==this.state&&"InPocket"!==this.state}},{key:"inMotion",value:function(){return"Rolling"===this.state||"Sliding"===this.state||this.isFalling()}},{key:"isFalling",value:function(){return"Falling"===this.state}},{key:"futurePosition",value:function(t){return this.futurePos.copy(this.pos).addScaledVector(this.vel,t),this.futurePos}},{key:"serialise",value:function(){return{pos:this.pos.clone(),id:this.id}}}],e=[{key:"fromSerialised",value:function(t){return n.updateFromSerialised(new n((0,i.t6)(t.pos)),t)}},{key:"updateFromSerialised",value:function(t,e){var n,o;return t.pos.copy(e.pos),t.vel.copy(null!==(n=null==e?void 0:e.vel)&&void 0!==n?n:i.v_),t.rvel.copy(null!==(o=null==e?void 0:e.rvel)&&void 0!==o?o:i.v_),t.state="Stationary",t}}],t&&h(n.prototype,t),e&&h(n,e),n}();v(p,"id",0),v(p,"transition",.05)},"./src/model/physics/constants.ts":(t,e,n)=>{n.d(e,{I:()=>h,Mz:()=>c,R:()=>s,e:()=>l,g:()=>i,gT:()=>r,gf:()=>o,m:()=>a,x3:()=>u});var i=9.8,o=.16,r=.8,a=.23,s=.03275,l=.86,c=.022201900000000004*2/3*.034,u=7/(5*Math.sqrt(2))*7271122250000001e-19,h=9867575000000003e-20},"./src/model/physics/mathaven.ts":(t,e,n)=>{function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,{z:()=>r});var o=Math.sqrt(21)/5,r=function(){var t;function e(t,n,o,r,a){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e),i(this,"P",0),i(this,"WzI",0),i(this,"vx",void 0),i(this,"vy",void 0),i(this,"ωx",void 0),i(this,"ωy",void 0),i(this,"ωz",void 0),i(this,"φ",void 0),i(this,"φʹ",void 0),i(this,"i",0),i(this,"N",100),i(this,"M",void 0),i(this,"R",void 0),i(this,"μs",void 0),i(this,"μw",void 0),i(this,"ee",void 0),this.M=t,this.R=n,this.ee=o,this.μs=r,this.μw=a}return t=[{key:"solve",value:function(t,e,n,i,o){this.vx=t,this.vy=e,this.ωx=n,this.ωy=i,this.ωz=o,this.WzI=0,this.P=0,this.i=0,this.compressionPhase();var r=this.ee*this.ee*this.WzI;this.restitutionPhase(r)}},{key:"updateSlipSpeedsAndAngles",value:function(){var t=this.R,e=this.vx+this.ωy*t*.4-this.ωz*t*o,n=-(.4*this.vy)+this.ωx*t,i=this.vx-this.ωy*t,r=this.vy+this.ωx*t;this.φ=Math.atan2(n,e),this.φ<0&&(this.φ+=2*Math.PI),this.φʹ=Math.atan2(r,i),this.φʹ<0&&(this.φʹ+=2*Math.PI)}},{key:"compressionPhase",value:function(){for(var t=Math.max(this.M*this.vy/this.N,.001);this.vy>0;)this.updateSingleStep(t)}},{key:"restitutionPhase",value:function(t){var e=Math.max(t/this.N,.001);for(this.WzI=0;this.WzI<t;)this.updateSingleStep(e)}},{key:"updateSingleStep",value:function(t){if(this.updateSlipSpeedsAndAngles(),this.updateVelocity(t),this.updateAngularVelocity(t),this.updateWorkDone(t),this.i++>10*this.N)throw"Solution not found"}},{key:"updateVelocity",value:function(t){var e=this.μs,n=this.μw,i=this.M;this.vx-=1/i*(n*Math.cos(this.φ)+e*Math.cos(this.φʹ)*(.4+n*Math.sin(this.φ)*o))*t,this.vy-=1/i*(o-.4*n*Math.sin(this.φ)+e*Math.sin(this.φʹ)*(.4+n*Math.sin(this.φ)*o))*t}},{key:"updateAngularVelocity",value:function(t){var e=this.μs,n=this.μw,i=this.M,r=this.R;this.ωx+=-(5/(2*i*r))*(n*Math.sin(this.φ)+e*Math.sin(this.φʹ)*(.4+n*Math.sin(this.φ)*o))*t,this.ωy+=-(5/(2*i*r))*(n*Math.cos(this.φ)*.4-e*Math.cos(this.φʹ)*(.4+n*Math.sin(this.φ)*o))*t,this.ωz+=5/(2*i*r)*(n*Math.cos(this.φ)*o)*t}},{key:"updateWorkDone",value:function(t){var e=t*Math.abs(this.vy);this.WzI+=e,this.P+=t}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}()},"./src/model/physics/physics.ts":(t,e,n)=>{n.d(e,{$8:()=>A,Gp:()=>M,JD:()=>v,Mq:()=>c,QK:()=>p,QV:()=>S,Qy:()=>T,Un:()=>m,c0:()=>w,lx:()=>f,p2:()=>h,s0:()=>b,t6:()=>V,yO:()=>P});var i=n("./node_modules/three/build/three.core.js"),o=n("./src/utils/utils.ts"),r=n("./src/model/physics/constants.ts"),a=n("./src/model/physics/mathaven.ts"),s=n("./src/diagram/constants.ts"),l=new i.Pq0;function c(t,e){return l.copy(t).addScaledVector((0,o.KM)(e),r.R)}var u={v:new i.Pq0,w:new i.Pq0};function h(t,e){var n=c(t,e).setZ(0);return u.v.copy((0,o.xb)(n).multiplyScalar(-r.gf*r.g)),u.w.copy((0,o.xb)((0,o.KM)(n)).multiplyScalar(2.5*r.gf*r.g/r.R)),u.w.setZ(-2.5*(r.Mz/(r.m*r.R*r.R))*Math.sign(e.z)),u}function v(t){var e=new i.Pq0(t.x,t.y,0).length(),n=5/7*r.x3/(r.m*r.R)/e,o=5/7*r.x3/(r.m*r.R*r.R)/e;return u.v.set(-n*t.y,n*t.x,0),u.w.set(-o*t.x,-o*t.y,-2.5*(r.Mz/(r.m*r.R*r.R))*Math.sign(t.z)),u}function f(t,e){var n=e.z;e.copy((0,o.KM)(t).multiplyScalar(1/r.R)),e.setZ(n)}function p(t,e,n,i){var r=i(e.clone().applyAxisAngle(o.up,t),n.clone().applyAxisAngle(o.up,t));return r.v.applyAxisAngle(o.up,-t),r.w.applyAxisAngle(o.up,-t),r}Object.freeze(u);var d=Math.asin(.1*r.R/r.R),y=Math.sin(d),g=Math.cos(d);function b(t,e){return new i.Pq0(t.x*y-t.z*g+r.R*e.y,-t.y-r.R*e.z*g+r.R*e.x*y)}function w(t){return t.x*g}function m(t){var e=3.5/r.m;return t.length()/e}function M(t){var e,n=1/r.m,o=.39+.257*(e=new i.Pq0(t/g,0,0)).x-.044*e.x*e.x;return r.gT*((1+o)*t)/n}function P(t,e){var n=M(w(t));return m(b(t,e))<=n}function R(t,e){return{c:w(t),s:b(t,e),A:3.5/r.m,B:1/r.m}}function k(t,e){var n=R(t,e),i=n.c,o=n.s,a=n.A,s=n.B,l=(1+r.e)*(i/s);return O(-o.x/a*y-l*g,o.y/a,o.x/a*g-l*y)}function x(t,e){var n=R(t,e),i=n.c,o=n.B,a=(1+r.e)*(i/o),s=.471-.241*Math.atan2(Math.abs(t.y),t.x),l=Math.atan2(t.y,t.x),c=Math.cos(l);return O(-s*a*c*g-a*g,s*a*Math.sin(l),s*a*c*g-a*y)}function S(t,e){return P(t,e)?k(t,e):x(t,e)}function A(t,e){var n=k(t,e),i=x(t,e),o=Math.sign(t.y)===Math.sign(e.z)?Math.cos(Math.atan2(t.y,t.x)):1;return{v:i.v.lerp(n.v,o),w:i.w.lerp(n.w,o)}}function O(t,e,n){return{v:new i.Pq0(t/r.m,e/r.m),w:new i.Pq0(-r.R/r.I*e*y,r.R/r.I*(t*y-n*g),r.R/r.I*e*g)}}function z(t,e){var n=new a.z(r.m,r.R,s.ee,s.o,s._+.1);n.solve(t.x,t.y,e.x,e.y,e.z);var o=new i.Pq0(n.vx,n.vy,0),l=new i.Pq0(n.ωx,n.ωy,n.ωz);return{v:o.sub(t),w:l.sub(e)}}function T(t,e){return p(Math.PI/2,t,e,z)}function V(t,e){var n=Math.atan2(-t.x,t.y),i=2.5*e.length()*(t.length()*r.R)/(r.R*r.R),a=e.clone().normalize();return(0,o.KM)(a).applyAxisAngle(a,n).multiplyScalar(i)}},"./src/utils/utils.ts":(t,e,n)=>{n.d(e,{Dz:()=>f,KM:()=>l,ld:()=>d,rq:()=>v,t6:()=>a,up:()=>r,v_:()=>o,xb:()=>u});var i=n("./node_modules/three/build/three.core.js"),o=new i.Pq0(0,0,0),r=new i.Pq0(0,0,1);function a(t){return new i.Pq0(t.x,t.y,t.z)}var s=new i.Pq0;function l(t){return s.copy(r).cross(t)}var c=new i.Pq0;function u(t){return c.copy(t).normalize()}var h=new i.Pq0;function v(t,e){return 0>=h.copy(t).add(e).dot(t)}function f(t){return new i.Pq0(1,0,0).applyAxisAngle(r,t)}function p(t){return Math.sign(t)*Math.floor((Math.abs(t)+Number.EPSILON)*1e4)/1e4}function d(t){return t.x=p(t.x),t.y=p(t.y),t.z=p(t.z),t}}},t=>{t(t.s="./src/mathaven.ts")}]);