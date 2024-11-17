"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[893],{"./src/mathaven.ts":(t,i,e)=>{var s=e("./src/model/physics/claude/constants.ts");function o(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var n=new/*#__PURE__*/(function(){var t;function i(t,e,s,n){!function(t,i){if(!(t instanceof i))throw TypeError("Cannot call a class as a function")}(this,i),o(this,"P",0),o(this,"WzI",0),o(this,"vx",void 0),o(this,"vy",void 0),o(this,"ωx",void 0),o(this,"ωy",void 0),o(this,"ωz",void 0),o(this,"s",void 0),o(this,"φ",void 0),o(this,"sʹ",void 0),o(this,"φʹ",void 0),o(this,"i",0),o(this,"history",[]),this.vx=t*Math.cos(e),this.vy=t*Math.sin(e),this.ωx=-n*Math.sin(e),this.ωy=n*Math.cos(e),this.ωz=s,this.updateSlipSpeedsAndAngles()}return t=[{key:"updateSlipSpeedsAndAngles",value:function(){this.s=Math.sqrt(Math.pow(this.vx+this.ωy*s.R*s.Z3-this.ωz*s.R*s.o5,2)+Math.pow(-this.vy*s.Z3+this.ωx*s.R,2)),this.φ=Math.atan2(-this.vy*s.Z3-this.ωx*s.R,this.vx+this.ωy*s.R*s.Z3-this.ωz*s.R*s.o5),this.sʹ=Math.sqrt(Math.pow(this.vx-this.ωy*s.R,2)+Math.pow(this.vy+this.ωx*s.R,2)),this.φʹ=Math.atan2(this.vy+this.ωx*s.R,this.vx-this.ωy*s.R)}},{key:"compressionPhase",value:function(){for(var t=(1+s.ee)*s.M*this.vy/s.N;this.vy>0;)this.updateSingleStep(t)}},{key:"restitutionPhase",value:function(t){var i=(1+s.ee)*s.M*this.WzI/s.N;for(this.WzI=0;this.WzI<t;)this.updateSingleStep(i)}},{key:"updateSingleStep",value:function(t){if(this.updateVelocity(t),this.updateAngularVelocity(t),this.updateSlipSpeedsAndAngles(),this.updateWorkDone(t),this.history.push(function(t){for(var i=1;i<arguments.length;i++){var e=null!=arguments[i]?arguments[i]:{},s=Object.keys(e);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.forEach(function(i){o(t,i,e[i])})}return t}({},this)),this.i++>10*s.N)throw"Solution not found"}},{key:"updateVelocity",value:function(t){this.vx-=1/s.M*(s._m*Math.cos(this.φ)+s.oV*Math.cos(this.φʹ)*(s.Z3+s._m*Math.sin(this.φ)*s.o5))*t,this.vy-=1/s.M*(s.o5-s._m*s.Z3*Math.sin(this.φ)+s.oV*Math.sin(this.φʹ)*(s.Z3+s._m*Math.sin(this.φ)*s.o5))*t}},{key:"updateAngularVelocity",value:function(t){this.ωx+=-(5/(2*s.M*s.R))*(s._m*Math.sin(this.φ)+s.oV*Math.sin(this.φʹ)*(s.Z3+s._m*Math.sin(this.φ)*s.o5))*t,this.ωy+=-(5/(2*s.M*s.R))*(s._m*Math.cos(this.φ)*s.Z3-s.oV*Math.cos(this.φʹ)*(s.Z3+s._m*Math.sin(this.φ)*s.o5))*t,this.ωz+=5/(2*s.M*s.R)*(s._m*Math.cos(this.φ)*s.o5)*t}},{key:"updateWorkDone",value:function(t){var i=t*Math.abs(this.vy);this.WzI+=i,this.P+=t}},{key:"solve",value:function(){this.compressionPhase();var t=this.WzI-(1-s.ee*s.ee)*this.WzI;this.restitutionPhase(t)}}],function(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}(i.prototype,t),i}())(2,Math.PI/4,3/s.R,4/s.R);try{n.solve()}catch(t){console.error(t)}var h={responsive:!0,showLink:!0,plotlyServerURL:"https://chart-studio.plotly.com"},r={legend:{font:{color:"#4D5663"},bgcolor:"#e5e6F9"},xaxis:{title:"impulse",tickfont:{color:"#4D5663"},gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},yaxis:{title:"value",tickfont:{color:"#4D5663"},zeroline:!1,gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},plot_bgcolor:"#F5F6F9",paper_bgcolor:"#F2F6F9"};function a(t){return"hsl(".concat(137.5*t%360,", ").concat(70,"%, ").concat(50,"%)")}function c(t,i,e,s){return{x:t,y:i,name:e,line:{color:s,width:1.3},mode:"lines",type:"scatter"}}var l=function(t){return n.history.map(t)},u=l(function(t){return t.P});window.Plotly.newPlot("mathaven-impulse",[c(u,l(function(t){return t.s}),"s",a(0)),c(u,l(function(t){return t.φ}),"φ",a(1)),c(u,l(function(t){return t.sʹ}),"s'",a(2)),c(u,l(function(t){return t.φʹ}),"φʹ",a(3)),c(u,l(function(t){return t.WzI}),"WzI",a(4)),c(u,l(function(t){return t.P}),"P",a(5))],r,h);var v=l(function(t){return t.i});window.Plotly.newPlot("mathaven-vel",[c(v,l(function(t){return t.vx}),"vx",a(5)),c(v,l(function(t){return t.vy}),"vy",a(6))],r,h)},"./src/model/physics/claude/constants.ts":(t,i,e)=>{e.d(i,{Hm:()=>a,M:()=>s,N:()=>v,R:()=>o,Z3:()=>c,_m:()=>r,ee:()=>n,o5:()=>u,oV:()=>h,ye:()=>l});var s=.1406,o=.02625,n=.98,h=.212,r=.14,a=.4,c=.4,l=Math.sqrt(21)/5,u=l,v=1e3}},t=>{t(t.s="./src/mathaven.ts")}]);