# mdreact
A Markdown-It plugin made in jsx for jsx and React Components. Works well with markdown-it-regexp.

Install through NPM: npm install --save mdreact

How to use:

include the plugin like any other Markdown-It plugin:

    var MarkdownIt = require('markdown-it');
    var MdReact = require('mdreact');

    var md = new MarkdownIt();
    md.use(MdReact);

    //imagine @my_react_component renders to a react component. =P
    return md.renderTokens('**WOW** *much stuff* @my_react_component');

So with this, you can have your rule return a react component and it'll be rendered as one of the tokens.

General gist of how this works: everything before a react component is rendered into a p tag and everything after it is as well.

Known issues: errors at the beginning of use, but it seems to fix itself after a while. This isn't perfect, but it got the job for me =P
