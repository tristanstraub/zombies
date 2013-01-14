    // boxContainsLine: function(x, y, w, h, lx0, ly0, lx1, ly1)  {
    //   // 1) poly on one side, or 2) one of two points inside poly 3) other of two points inside poly
    
    //   var sgn = function(x) { return x < 0 ? -1 : 1 };

    //   var x0=x, x1=x+w, x2=x+w, x3=x;
    //   var y0=y, y1=y,   y2=y+h, y2=y+h;

    //   // 2) lx0, ly0
    //   var s = sgn(wedge([lx1-lx0,ly1-lx0],[x-lx0, y-ly0]))
    //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, h+y-ly0]))
    //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, y-ly0]))
    //     +sgn(wedge([lx1-lx0,ly1-lx0],[x-lx0, h+y-ly0]));
    //   if (Math.abs(s) == 4)
    //     return true;

    //   // 3) lx1, ly1
    //   var s = sgn(wedge([x1-x0,y1-y0],[x-lx0, y-ly0]))
    //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, h+y-ly0]))
    //     +sgn(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, y-ly0]))
    //     +sgn(wedge([lx1-lx0,ly1-lx0],[x-lx0, h+y-ly0]));
    //   if (Math.abs(s) == 4)
    //     return true;

    //   // 1)
    //   var s = (wedge([lx1-lx0,ly1-lx0],[x-lx0, y-ly0]) < 0 ? -1 : 1)
    //     +(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, h+y-ly0]) < 0 ? -1 : 1)
    //     +(wedge([lx1-lx0,ly1-lx0],[w+x-lx0, y-ly0]) < 0 ? -1 : 1)
    //     +(wedge([lx1-lx0,ly1-lx0],[x-lx0, h+y-ly0]) < 0 ? -1 : 1);
    //   return (Math.abs(s) !== 4);
    // },

