import "./style.scss";

import $ from "jquery";

$(() => {
    $('[data-tooltip-content]')
        .each((index:number, element:HTMLElement) => {
            const $body:JQuery = $('body');
            const $target:JQuery = $(element);
            const id:string = 'tooltip-' + index;
            let content:string = $target.attr('data-tooltip-content');
            let $contentWrap:JQuery = $('<div class="tooltipContentWrap"></div>');
            let $contentBg:JQuery = $('<div class="tooltipContentBg"></div>');
            let $content:JQuery;

            function show(e:Event):void {
                $target.attr('aria-describedby', id);

                $contentWrap.appendTo($body);

                $contentBg
                    .css({
                        width: $content.outerWidth(),
                        height: $content.outerHeight() + $target.outerHeight() + 10
                    });

                $contentWrap
                    .css({
                        top: $target.offset().top + $target.outerHeight() - $contentBg.height(),
                        left: $target.offset().left + ($target.outerWidth() / 2) - ($contentBg.outerWidth() / 2)
                    })
                    .on('animationend.tooltip', () => {
                        $contentWrap
                            .removeClass('tooltipShowAnim')
                            .off('animationend.tooltip');
                    })
                    .attr('id', id)
                    .addClass('tooltipShowAnim');

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
                        $contentWrap
                            .attr('id', null)
                            .removeClass('tooltipHideAnim')
                            .removeClass('isShow')
                            .off('animationend.tooltip')
                            .remove();
                    })
                    .addClass('tooltipHideAnim');
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