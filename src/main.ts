import "./style.scss";

import $ from "jquery";

$(() => {
    function capitalize(word:string):string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    $('[data-tooltip-content]')
        .each((index:number, element:HTMLElement) => {
            const $body:JQuery = $('body');
            const $target:JQuery = $(element);
            const id:string = 'tooltip-' + index;
            let position:string;
            let content:string = $target.attr('data-tooltip-content');
            let $contentWrap:JQuery = $('<div class="tooltipContentWrap"></div>');
            let $contentBg:JQuery = $('<div class="tooltipContentBg"></div>');
            let $content:JQuery;

            function inView(offsetTop:number, offsetLeft:number, width:number, height:number):boolean {
                let inView:boolean = false;

                const $window:JQuery = $(window as any);
                const scrollTop:number = $window.scrollTop();
                const scrollBottom:number = scrollTop + $window.height()
                const scrollLeft:number = $window.scrollLeft();
                const scrollRight:number = scrollLeft + $window.width();

                if (scrollBottom > offsetTop + height && scrollTop < offsetTop) {
                    if (scrollRight > offsetLeft + width && scrollLeft < offsetLeft) {
                        inView = true;
                    }
                }

                return inView;
            }

            function show(e:Event):void {
                $target.attr('aria-describedby', id);

                $contentWrap.appendTo($body);

                const width:number = $content.outerWidth() + 1;
                const height:number = $content.outerHeight() + 1;

                const posTop:{ [s:string]:number } = {
                    top: $target.offset().top + $target.outerHeight() - (height + $target.outerHeight() + 10),
                    left: $target.offset().left + ($target.outerWidth() / 2) - (width / 2),
                    width: width,
                    height: height + $target.outerHeight() + 10
                };

                const posBottom:{ [s:string]:number } = {
                    top: $target.offset().top,
                    left: posTop.left,
                    width: posTop.width,
                    height: posTop.height
                };

                const posLeft:{ [s:string]:number } = {
                    top: $target.offset().top + ($target.outerHeight() / 2) - (height / 2),
                    left: $target.offset().left - (width + 10),
                    width: width + $target.outerWidth() + 10,
                    height: height
                };

                const posRight:{ [s:string]:number } = {
                    top: posLeft.top,
                    left: $target.offset().left,
                    width: posLeft.width,
                    height: height
                };

                if (inView(posTop.top, posTop.left, posTop.width, posTop.height)) {
                    position = 'top';
                } else if (inView(posBottom.top, posBottom.left, posBottom.width, posBottom.height)) {
                    position = 'bottom';
                } else if (inView(posLeft.top, posLeft.left, posLeft.width, posLeft.height)) {
                    position = 'left';
                } else if (inView(posRight.top, posRight.left, posRight.width, posRight.height)) {
                    position = 'right';
                } else {
                    position = 'top';
                }

                $content.addClass('tooltipContent--' + position);

                if (position === 'top') {
                    $contentBg.css({
                        width: posTop.width,
                        height: posTop.height
                    });

                    $contentWrap
                        .css({
                            top: posTop.top,
                            left: posTop.left,
                            width: posTop.width,
                            height: posTop.height
                        });
                } else if (position === 'bottom') {
                    $contentBg
                        .css({
                            width: posBottom.width,
                            height: posBottom.height
                        });

                    $contentWrap
                        .css({
                            top: posBottom.top,
                            left: posBottom.left,
                            width: posBottom.width,
                            height: posBottom.height
                        });
                } else if (position === 'left') {
                    $contentBg
                        .css({
                            width: posLeft.width,
                            height: posLeft.height
                        });

                    $contentWrap
                        .css({
                            top: posLeft.top,
                            left: posLeft.left,
                            width: posLeft.width,
                            height: posLeft.height
                        });
                } else {
                    $contentBg
                        .css({
                            width: posRight.width,
                            height: posRight.height
                        });

                    $contentWrap
                        .css({
                            top: posRight.top,
                            left: posRight.left,
                            width: posRight.width,
                            height: posRight.height
                        });
                }

                $contentWrap
                    .on('animationend.tooltip', () => {
                        $contentWrap
                            .removeClass('tooltipShowAnim' + capitalize(position))
                            .off('animationend.tooltip');
                    })
                    .attr('id', id)
                    .addClass('tooltipShowAnim' + capitalize(position));

                $body.on('mousemove.tooltip-' + index, (e:Event) => {
                    let $eventTarget:JQuery = $(e.target as HTMLElement);

                    if ($eventTarget.attr('data-tooltip-content') === content) {
                        return;
                    }

                    let $contentWrap:JQuery;

                    if ($eventTarget.hasClass('tooltipContentWrap')) {
                        $contentWrap = $eventTarget;
                    } else {
                        $contentWrap = $eventTarget.parents('.tooltipContentWrap');
                    }

                    if ($contentWrap.attr('id') === 'tooltip-' + index) {
                        return;
                    }

                    $body.off('mousemove.tooltip-' + index);
                    hide();
                });
            }

            function hide():void {
                $target.removeAttr('aria-describedby');
                $contentWrap
                    .on('animationend.tooltip', () => {
                        $content.removeClass('tooltipContent--' + position);
                        $contentWrap
                            .attr('id', null)
                            .removeClass('tooltipHideAnim' + capitalize(position))
                            .removeClass('isShow')
                            .off('animationend.tooltip')
                            .remove();
                    })
                    .addClass('tooltipHideAnim' + capitalize(position));
            }

            if (content.substr(0, 1) === '#') {
                $content = $(content).clone();
            } else {
                $content = $('<div class="tooltipContent">' + content + '</div>');
                $content.appendTo($body);
            }

            $content.addClass('isReady');
            $contentWrap.append($contentBg, $content);
            $target.on('mouseenter.tooltip', show);
        });
});