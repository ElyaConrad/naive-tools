export const checkScrollSpeed = ((delay = 50) => {

  let lastPos: number | null, newPos: number, timer: ReturnType<typeof setTimeout>, delta: number;

  function clear() {
    lastPos = null;
    delta = 0;
  }

  clear();
  
  return function(resolveScrollPos: () => number){
    newPos = resolveScrollPos();
    if ( lastPos != null ){ // && newPos < maxScroll 
      delta = newPos -  lastPos;
    }
    lastPos = newPos;
    clearTimeout(timer);
    timer = setTimeout(clear, delay);
    return delta;
  };
})();