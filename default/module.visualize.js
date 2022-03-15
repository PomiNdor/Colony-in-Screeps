/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.visualize');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    table: function(gameRoom, text, pos, styleRect = {}, styleText = {}, padding = {x: 0.75, y: 0.5}, gap = 0.3) {
        if (!styleText.font) styleText.font = 0.7;
        let isArray = Array.isArray(text);
        let width, height = 1;
        if (isArray) {
            height = text.length * styleText.font + (text.length-1) * gap;
            width = text[0].length;
            for (let i in text)
                if (width < text[i].length)
                width = text[i].length
        } else width = text.length;

        
        if (typeof styleText.font === "string" || styleText.font instanceof String) {
            width *= +styleText.font.match(/[+-]?([0-9]*[.])?[0-9]+/)[0] / 2;
        } else
            width *= styleText.font / 2;

        // height -= 0.5
        gameRoom.visual.rect(pos.x - 0.5, pos.y - 0.5, width + padding.x * 2, height+ padding.y * 2, styleRect);


        pos.x += padding.x - 0.5; // 0.5 - встроенный отступ
        pos.y += padding.y;

        if (isArray)
            for (let i in text) {
                gameRoom.visual.text(text[i], pos.x, pos.y, styleText);
                pos.y += styleText.font + gap;
            }
                
        else gameRoom.visual.text(text, pos.x, pos.y++, styleText);
    },
    table2: function(gameRoom, text, pos, backgroundColor = '#212121', styleText = {}) {
        let isArray = Array.isArray(text);
        let width;
        if (isArray) {
            width = text[0].length;
            for (let i in text)
                if (width < text[i].length)
                width = text[i].length
        } else width = text.length;

        let str = ' '.repeat(width * 2);
        styleText.backgroundColor= "#212121";
        if (isArray) {
            for (let i in text){
                gameRoom.visual.text(str, pos.x, pos.y, styleText);
                gameRoom.visual.text(text[i], pos.x, pos.y++, styleText);
            }   
        } 
        else {
            gameRoom.visual.text(text, pos.x, pos.y++, styleText);
        }
    },
    showGrid: function(gameRoom, lineStyle = {width: 0.005, color: '#fff', opacity: 0.4}) {
        for (let i = 1; i < 50; i++) {
            gameRoom.visual.line(i - 0.5, -0.5, i - 0.5, 49.5, lineStyle);
            gameRoom.visual.line(-0.5, i - 0.5, 49.5, i - 0.5, lineStyle);
        }
    }
};