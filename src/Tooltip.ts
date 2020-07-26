import $ from 'jquery';
import {Rect} from './Rect';

export class Tooltip {
    static readonly DEBUG_MODE = false;
    static readonly MARGIN = 10;
    static readonly PADDING = 3;

    private readonly suffixNum:number;
    private readonly id:string;
    private readonly target:HTMLElement;
    private readonly content:string;
    private readonly $body:JQuery;
    private readonly $target:JQuery;
    private readonly $content:JQuery;

    private targetRect:Rect;
    private contentRect:Rect;
    private contentPosition:string;

    private $c:JQuery;
    private $t:JQuery;

    constructor(suffixNum:number, targetElement:HTMLElement) {
        if (Tooltip.DEBUG_MODE) {
            this.$c = $('<div></div>');
            this.$t = $('<div></div>');
        }

        this.suffixNum = suffixNum;
        this.id = 'tooltip-' + this.suffixNum;
        this.target = targetElement;
        this.$body = $('body');
        this.$target = $(targetElement);

        this.content = this.$target.attr('data-tooltip-content');

        if (this.content.substr(0, 1) === '#') {
            this.$content = $(this.content).clone();
        } else {
            this.$content = $('<div class="tooltipContent">' + this.content + '</div>');
        }

        this.$content.addClass('isReady');
        this.$target.on('mouseenter.tooltip', () => {
            this.show();
        });
    }

    get element():HTMLElement {
        return this.target;
    }

    static capitalize(word:string):string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    private setPositions():void {
        const contentWidth:number = this.$content.outerWidth();
        const contentHeight:number = this.$content.outerHeight();
        const targetWidth:number = this.$target.outerWidth();
        const targetHeight:number = this.$target.outerHeight();
        const targetOffsetTop:number = this.$target.offset().top;
        const targetOffsetLeft:number = this.$target.offset().left;

        const contentRectTop = new Rect(
            targetOffsetTop - contentHeight - Tooltip.MARGIN,
            contentWidth > targetWidth ? targetOffsetLeft + (targetWidth / 2) - (contentWidth / 2) : targetOffsetLeft,
            Math.max(contentWidth, targetWidth),
            contentHeight + Tooltip.MARGIN
        );

        const contentRectBottom = new Rect(
            targetOffsetTop + targetHeight,
            contentRectTop.left,
            contentRectTop.width,
            contentRectTop.height
        );

        const contentRectLeft = new Rect(
            contentHeight > targetHeight ? targetOffsetTop + (targetHeight / 2) - (contentHeight / 2) : targetOffsetTop,
            targetOffsetLeft - contentWidth - Tooltip.MARGIN,
            contentRectTop.width + Tooltip.MARGIN,
            Math.max(contentHeight, targetHeight)
        );

        const contentRectRight = new Rect(
            contentRectLeft.top,
            targetOffsetLeft + targetWidth,
            contentRectLeft.width,
            contentRectLeft.height
        );

        if (contentRectTop.inView()) {
            this.contentPosition = 'top';
            this.contentRect = contentRectTop;
        } else if (contentRectBottom.inView()) {
            this.contentPosition = 'bottom';
            this.contentRect = contentRectBottom;
        } else if (contentRectRight.inView()) {
            this.contentPosition = 'right';
            this.contentRect = contentRectRight;
        } else if (contentRectLeft.inView()) {
            this.contentPosition = 'left';
            this.contentRect = contentRectLeft;
        } else {
            this.contentPosition = 'top';
            this.contentRect = contentRectTop;
        }

        this.targetRect = new Rect(targetOffsetTop - Tooltip.PADDING, targetOffsetLeft - Tooltip.PADDING, targetWidth + Tooltip.PADDING * 2, targetHeight + Tooltip.PADDING * 2);

        this.$content
            .css({
                top: this.contentPosition === 'bottom' ? this.contentRect.top + Tooltip.MARGIN : this.contentRect.top,
                left: this.contentPosition === 'right' ? this.contentRect.left + Tooltip.MARGIN : this.contentRect.left
            })
            .addClass('tooltipContent--' + this.contentPosition);

        if (Tooltip.DEBUG_MODE) {
            this.$t
                .css({
                    position: 'absolute',
                    top: this.targetRect.top,
                    left: this.targetRect.left,
                    width: this.targetRect.width,
                    height: this.targetRect.height,
                    background: 'rgba(0,0,0,.4)',
                    pointerEvents: 'none'
                })
                .appendTo(this.$body);

            this.$c
                .css({
                    position: 'absolute',
                    top: this.contentRect.top,
                    left: this.contentRect.left,
                    width: this.contentRect.width,
                    height: this.contentRect.height,
                    background: 'rgba(0,0,0,.4)',
                    pointerEvents: 'none'
                })
                .appendTo(this.$body);
        }
    }

    private show():void {
        this.$content.appendTo(this.$body);
        this.$target
            .attr('aria-describedby', this.id)
            .off('mouseenter.tooltip');

        this.setPositions();

        this.$content
            .on('animationend.tooltip', () => {
                this.$content
                    .removeClass('tooltipShowAnim' + Tooltip.capitalize(this.contentPosition))
                    .off('animationend.tooltip');
            })
            .attr('id', this.id)
            .addClass('tooltipShowAnim' + Tooltip.capitalize(this.contentPosition));

        this.$body.on('mousemove.' + this.id, (e:JQuery.Event) => {
            if (this.contentRect.intersect(e.pageY, e.pageX)) {
                return;
            }
            if (this.targetRect.intersect(e.pageY, e.pageX)) {
                return;
            }

            this.$body.off('mousemove.' + this.id);
            this.hide();
        });

    }

    private hide():void {
        this.$target.removeAttr('aria-describedby');
        this.$content
            .on('animationend.tooltip', () => {
                this.$content
                    .removeClass('tooltipContent--' + this.contentPosition)
                    .removeClass('tooltipHideAnim' + Tooltip.capitalize(this.contentPosition))
                    .removeClass('isShow')
                    .attr('id', null)
                    .off('animationend.tooltip')
                    .remove();
            })
            .addClass('tooltipHideAnim' + Tooltip.capitalize(this.contentPosition));

        this.$target.on('mouseenter.tooltip', (e:JQuery.Event) => {
            this.show();
        });

        if (Tooltip.DEBUG_MODE) {
            this.$t.remove();
            this.$c.remove();
        }
    }
}