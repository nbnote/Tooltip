import $ from "jquery";

export class Rect {
    public top:number;
    public bottom:number;
    public left:number;
    public right:number;
    public width:number;
    public height:number;

    constructor(top:number, left:number, width:number, height:number) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.bottom = this.top + this.height;
        this.right = this.left + this.width;
    }

    public inView():boolean {
        const $window:JQuery = $(window as any);
        const scrollTop:number = $window.scrollTop();
        const scrollBottom:number = scrollTop + $window.height()
        const scrollLeft:number = $window.scrollLeft();
        const scrollRight:number = scrollLeft + $window.width();

        if (scrollBottom > this.top + this.height && scrollTop < this.top) {
            if (scrollRight > this.left + this.width && scrollLeft < this.left) {
                return true;
            }
        }

        return false;
    }

    public intersect(top:number, left:number):boolean {
        return top >= this.top && top <= this.top + this.height && left >= this.left && left <= this.left + this.width;
    }
}