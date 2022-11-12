export default function standarizeColor(str: string){
  const ctx = document.createElement('canvas').getContext('2d');
  if (ctx) {
    ctx.fillStyle = str;
    return ctx.fillStyle;
  }
}