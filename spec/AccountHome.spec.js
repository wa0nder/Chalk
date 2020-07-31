'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import { AccountHome, NewThreadButton, RecentThreads, CommentThreadPreview, SW_Utils } from '../js/react_components/AccountHome.js';
import { unmountComponentAtNode, render } from "react-dom";

let container = null;
let e = React.createElement;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('flashMessage', () =>{

  it("attaches label to given element and vanishes after", async () => {

    let timeout = 50;

    act(() => {
      SW_Utils.flashMessage(container, 'green', 'gone in a few', timeout);
    });

    let label = container.querySelector('label');
    
    expect(label.innerText).toBe('gone in a few');

    expect(label.parentElement).toBe(container);

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            expect(label.parentElement).toBe(null);
            expect(container.firstElementChild).toBe(null);
            resolve();
        }, timeout+2500);
    });

  });
});

describe('scrollCalc x/y/height/width calculations', () => {

    let sc = SW_Utils.scrollCalc;

    it('scrollBarWidth/Height returns 0 when parameter is null', () => {

        expect(sc.calcScrollBarWidth(null)).toBe(0);
        expect(sc.calcScrollBarHeight(null)).toBe(0);
    });

    let elem = {
        clientWidth: 50,
        scrollWidth: 50,
        clientHeight: 40,
        scrollHeight: 40
    }
    it('returns clientWidth/Height when no scrollbar', () => {

        expect(sc.calcScrollBarWidth(elem)).toBe(elem.clientWidth);
        expect(sc.calcScrollBarHeight(elem)).toBe(elem.clientHeight);
    });

    it('scrollBarX/Y returns 0 when parameter is null', () =>{

        expect(sc.calcScrollBarX(null)).toBe(0);
        expect(sc.calcScrollBarY(null)).toBe(0);
    });

});

describe('NewThreadButton', () => {

    it('', () => {

        act(() => {

            render(e(NewThreadButton), container);
        });

        
    });

});
