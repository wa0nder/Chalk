'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import CommentDisplay from '../js/react_components/CommentDisplay.js';
import { unmountComponentAtNode, render } from "react-dom";

function runCommentDisplaySpecs(){
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
    
    describe('CommentDisplay component', () => {
    
        it('displays a header, body, and actions bar', () => {
            let props = {
                id: 'c_0',
                className: 'commentBox',
                style: {gridRow: 0, gridColumn: 0},
                comment: {Author:'cat', body:'sample comment text'}
            };

            act(() => {
                render(e(CommentDisplay, props), container);
            });

            let elements = Array.from(container.querySelector('.commentBox').children);
            expect(elements.map(e => e.tagName.toLowerCase())).toEqual(['div', 'p', 'div']);
        });
        
        it('displays an @ property if supplied', () => {
            let props = {
                id: 'c_0',
                className: 'irrelevant now',
                style: {gridRow: 0, gridColumn: 0},
                comment: {at: 'Some Commenter', Author:'cat', body:'sample comment text'}
            };

            act(() => {
                render(e(CommentDisplay, props), container);
            });

            let elements = Array.from(container.querySelector('.commentBox__header__info').children);
            expect(elements.map(e => e.tagName.toLowerCase())).toEqual(['p', 'p', 'p']);
        });

        it('displays a reply CommentBlock if "reply" button is clicked', () => {
            let props = {
                id: 'c_0',
                className: 'irrelevant now',
                style: {gridRow: 0, gridColumn: 0},
                comment: {Author:'cat', body:'sample comment text'}
            };

            act(() => {
                render(e(CommentDisplay, props), container);
            });

            let button = container.querySelector('.commentBox__actions').getElementsByTagName('button')[1];
            act(() => {
                button.dispatchEvent( new MouseEvent('click', {bubbles: true}) );
            });

            expect(container.querySelector('.commentBlock.commentBlock--invertColors')).not.toBe(null);
        });
    
    });
}

export default runCommentDisplaySpecs;
