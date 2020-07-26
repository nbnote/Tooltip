import "./style.scss";

import $ from "jquery";
import {Tooltip} from './Tooltip';

let tooltipList:Tooltip[] = [];

function add(element:HTMLElement) {
    tooltipList.push(new Tooltip(tooltipList.length, element));
}

function update() {
    $('[data-tooltip-content]')
        .each((index:number, element:HTMLElement) => {
            let contain:boolean = false;
            let i:number = tooltipList.length;
            for (; i--;) {
                contain = tooltipList[i].element === element
            }

            if (!contain) {
                add(element);
            }
        });
}

$(() => {
    $('[data-tooltip-content]')
        .each((index:number, element:HTMLElement) => {
            add(element);
        });
});