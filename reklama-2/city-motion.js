(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const image = new Image();
  image.src = 'assets/city-gray-bg.png?v=transparent-1';
  image.onload = () => {
    try {
      const w = image.naturalWidth, h = image.naturalHeight;
      const make = (width, height) => Object.assign(document.createElement('canvas'), {width, height});
      const base = make(w,h), ctx = base.getContext('2d');
      ctx.drawImage(image,0,0);
      const pixels = ctx.getImageData(0,0,w,h), data = pixels.data;
      const labels = new Int32Array(w*h), queue = new Int32Array(w*h);
      const parts = [];
      // Separate the opaque contours, ignoring faint compression bridges.
      for (let p=0;p<w*h;p++) {
        if (labels[p] || data[p*4+3]<=120) continue;
        let head=0, tail=1, x0=w,y0=h,x1=0,y1=0;
        queue[0]=p; labels[p]=-1;
        while(head<tail) {
          const q=queue[head++], x=q%w, y=(q/w)|0;
          x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
          const visit = n => {if (!labels[n] && data[n*4+3]>120) {labels[n]=-1;queue[tail++]=n;}};
          if(x)visit(q-1);if(x<w-1)visit(q+1);if(y)visit(q-w);if(y<h-1)visit(q+w);
        }
        if(tail<40 || x1-x0<12 || x1-x0>180 || y1-y0<4 || y1-y0>65) continue;
        parts.push({x:Math.max(0,x0-2),y:Math.max(0,y0-2),w:Math.min(w-1,x1+2)-Math.max(0,x0-2)+1,h:Math.min(h-1,y1+2)-Math.max(0,y0-2)+1});
        for(let i=0;i<tail;i++) labels[queue[i]]=parts.length;
      }
      // Include antialiased contour edges in each moving piece.
      const owners = labels.slice();
      for(let p=0;p<w*h;p++) {
        if(labels[p]<=0)continue;
        const x=p%w,y=(p/w)|0;
        for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++) {
          const xx=x+dx,yy=y+dy,n=yy*w+xx;
          if(xx>=0&&xx<w&&yy>=0&&yy<h&&labels[n]===0)owners[n]=labels[p];
        }
      }
      const sprites = parts.map(part => {
        const canvas=make(part.w,part.h), c=canvas.getContext('2d');
        return {...part,canvas,c,pixels:c.createImageData(part.w,part.h)};
      });
      for(let p=0;p<w*h;p++) {
        const id=owners[p];if(id<=0)continue;
        const s=sprites[id-1],x=p%w-s.x,y=((p/w)|0)-s.y;
        if(x<0||y<0||x>=s.w||y>=s.h)continue;
        const dest=(y*s.w+x)*4;
        s.pixels.data.set(data.subarray(p*4,p*4+4),dest);
        data[p*4+3]=0;
      }
      ctx.putImageData(pixels,0,0);
      sprites.forEach(s=>s.c.putImageData(s.pixels,0,0));
      if(!sprites.length)return;
      const canvas=make(w,h), output=canvas.getContext('2d');
      canvas.className='home-city-canvas';canvas.setAttribute('aria-hidden','true');
      document.body.prepend(canvas);
      document.body.classList.add('has-city-motion');
      let frame=0, last=0, elapsed=0;
      function draw(now) {
        if(document.hidden || reduced.matches) {frame=0;last=0;return;}
        frame=requestAnimationFrame(draw);
        if(last && now-last<32)return;
        if(last)elapsed+=Math.min(now-last,80);
        last=now;
        output.clearRect(0,0,w,h);output.drawImage(base,0,0);
        const entrance=Math.min(elapsed/3000,1);
        const blend=entrance*entrance*(3-2*entrance);
        sprites.forEach((s,i)=>{
          const phase=i*2.39996, time=elapsed/1000;
          const dx=Math.sin(time*(2*Math.PI/(18+i%13))+phase)*2.8*blend;
          const dy=Math.sin(time*(2*Math.PI/(22+i%17))+phase*.73)*3.8*blend;
          output.drawImage(s.canvas,s.x+dx,s.y+dy);
        });
      }
      function resume() {
        document.body.classList.toggle('has-city-motion',!reduced.matches);
        canvas.hidden=reduced.matches;
        if(!frame&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(draw);
      }
      document.addEventListener('visibilitychange',resume);
      reduced.addEventListener('change',resume);
      frame=requestAnimationFrame(draw);
    } catch (_) { /* Keep the original static city if canvas is unavailable. */ }
  };
})();
