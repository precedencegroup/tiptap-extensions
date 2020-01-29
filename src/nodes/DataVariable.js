import { Node } from 'tiptap'
import { Mention } from 'tiptap-extensions'
import { replaceText } from 'tiptap-commands'
import SuggestionsPlugin from '../plugins/Suggestions'
import DataVariable from ''

export default class CustomMention extends Node {

    get name() {
        return 'mention'
    }

    get defaultOptions() {
        return {
            matcher: {
                char: '{{',
                allowSpaces: false,
                startOfLine: false,
            },
            mentionClass: 'mention',
            suggestionClass: 'mention-suggestion',
        }
    }

    get schema() {
        return {
            attrs: {
                code: {},
            },
            // I think this prevents multiple datavariables from being generated on the same line (<p>)
            // content: 'text*',
            group: 'inline',
            inline: true,
            selectable: false,
            atom: true,
            // toDOM: node => [
            //     'DataVariable',
            //     {
            //         // 'data-mention-id': node.attrs.id,
            //         // class: this.options.mentionClass,
            //         // code: node.attrs.code,
            //     },
            //     `${node.attrs.code}`,
            // ],
            toDOM: node => ['DataVariable', node.attrs, 0, ],
            parseDOM: [{
                tag: 'DataVariable',
                getAttrs: dom => {
                    var attrs = {};

                    var code = dom.innerText;
                    if (code) attrs.code = code;

                    return attrs;
                },
            }, ],
        }
    }

    commands({ schema }) {
        return attrs => replaceText(null, schema.nodes[this.name], attrs)
    }

    get plugins() {
        return [
            SuggestionsPlugin({
                command: ({ range, attrs, schema }) => replaceText(range, schema.nodes[this.name], attrs),
                appendText: ' ',
                matcher: this.options.matcher,
                items: this.options.items,
                onEnter: this.options.onEnter,
                onChange: this.options.onChange,
                onExit: this.options.onExit,
                onKeyDown: this.options.onKeyDown,
                onFilter: this.options.onFilter,
                suggestionClass: this.options.suggestionClass,
            }),
        ]
    }

    get view() {
        return DataVariable;
    }

}
