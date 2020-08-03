'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import CommentDisplay from '../js/react_components/CommentDisplay.js';
import CommentBlock from '../js/react_components/CommentBlock.js';
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
    
        it('displays an h4 author, paragraph body and single reply button by default', () => {
            let props = {
                id: '0',
                className: 'irrelevant now',
                style: {gridRow: 0, gridColumn: 0},
                comment: {Author:'cat', body:'sample comment text'}
            };

            act(() => {
                render(e(CommentDisplay, props), container);
            });

            let elements = Array.from(container.querySelector('div').children);
            expect(elements.map(e => e.tagName.toLowerCase())).toEqual(['h4', 'p', 'button']);
        });
        
        it('displays an h4 @ property if supplied', () => {
            let props = {
                id: '0',
                className: 'irrelevant now',
                style: {gridRow: 0, gridColumn: 0},
                comment: {at: 'Some Commenter', Author:'cat', body:'sample comment text'}
            };

            act(() => {
                render(e(CommentDisplay, props), container);
            });

            let elements = Array.from(container.querySelector('div').children);
            expect(elements.map(e => e.tagName.toLowerCase())).toEqual(['h4', 'h4', 'p', 'button']);
        });

        it('displays a reply CommentBlock if "reply" button is clicked', async () => {
            let props = {
                id: '0',
                className: 'irrelevant now',
                style: {gridRow: 0, gridColumn: 0},
                comment: {Author:'cat', body:'sample comment text'}
            };

            act(() => {
                render(e(CommentDisplay, props), container);
            });

            let button = container.querySelector('div').querySelector('button');
            act(() => {
                button.dispatchEvent( new MouseEvent('click', {bubbles: true}) );
            })

            //the second div holds the CommentBlock output
            expect(container.getElementsByTagName('div').length).toBe(2);
        });
    
    });
}

export default runCommentDisplaySpecs;
