var React = require('react');

var MdReact = function(md, options) {
    md.renderTokens = function(src, env) {
        env = env || {};

        return this.renderer.renderTokens(this.parse(src, env), this.options, env);
    };
    md.renderer.renderTokens = function(tokens, options, env) {
        var type,
            result = '',
            rules = this.rules;

        return tokens.reduce(function(collector, token, i) {
            //console.log('type: ', token.type, token);
            var result;
            if (typeof rules[token.type] !== 'undefined')
                result = rules[token.type](tokens, i, options, env, this);
            else {
                if(token.type === 'inline')
                    result = this.renderInline(token.children, options, env);
                else
                    result = this.renderToken(tokens, i, options);
            }
            //console.log('result: ', result);

            function getCollector(collector, tokens, i) {
                tokens.forEach(function(result) {
                    //if it's not astring, then it's a react element.
                    //In this case, we split the paragraphs for the React element.
                    //If we don't split, then p tags surround the react element,
                    //and we can't render the p tags at the same time as the react element
                    if(typeof result != 'string') {
                        if(collector[collector.length - 1].length && collector[collector.length - 1][0] == '<p>')
                            collector[collector.length - 1].push('</p>\n');

                        collector.push(result);
                        collector.push(['<p>']); //add a new p tag for the one we left dangling.
                        return;
                    }

                    //console.log('result isnt a string: ', result, collector.length);
                    if(!collector.length || !collector[collector.length - 1].length)
                        collector.push([]);

                    collector[collector.length - 1].push(result);
                });
                return collector;
            }

            if(token.type === 'inline')
                return getCollector(collector, result, i);
            else
                return getCollector(collector, [result], i);
        }.bind(this), []).map(function(item, index) {
            //console.log('last step item: ', item);
            if(item.length) {
                var html = item.join('');
                //console.log('html: ', html);
                return <p key={index} dangerouslySetInnerHTML={{__html: html}} />
            }
            else
                return item;
        });
    };

    md.renderer.renderInline = function (tokens, options, env) {
        var type,
            rules = this.rules;

        return tokens.map(function(token, i) {
            type = token.type;

            if (typeof rules[type] !== 'undefined')
                return rules[type](tokens, i, options, env, this);

            return this.renderToken(tokens, i, options);
        }, this);
    };

    md.renderer.render = function (tokens, options, env) {
        return this.renderTokens(tokens, options, env).reduce(function(collector, token) {
            return collector + token;
        }, '');
    };
};

module.exports = MdReact;
