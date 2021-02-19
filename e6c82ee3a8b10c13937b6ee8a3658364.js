ace.define("ace/mode/xml_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],(function(e,t,n){"use strict";var r=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,a=function e(t){var n="[_:a-zA-Z\xc0-\uffff][-_:.a-zA-Z0-9\xc0-\uffff]*";this.$rules={start:[{token:"string.cdata.xml",regex:"<\\!\\[CDATA\\[",next:"cdata"},{token:["punctuation.instruction.xml","keyword.instruction.xml"],regex:"(<\\?)("+n+")",next:"processing_instruction"},{token:"comment.start.xml",regex:"<\\!--",next:"comment"},{token:["xml-pe.doctype.xml","xml-pe.doctype.xml"],regex:"(<\\!)(DOCTYPE)(?=[\\s])",next:"doctype",caseInsensitive:!0},{include:"tag"},{token:"text.end-tag-open.xml",regex:"</"},{token:"text.tag-open.xml",regex:"<"},{include:"reference"},{defaultToken:"text.xml"}],processing_instruction:[{token:"entity.other.attribute-name.decl-attribute-name.xml",regex:n},{token:"keyword.operator.decl-attribute-equals.xml",regex:"="},{include:"whitespace"},{include:"string"},{token:"punctuation.xml-decl.xml",regex:"\\?>",next:"start"}],doctype:[{include:"whitespace"},{include:"string"},{token:"xml-pe.doctype.xml",regex:">",next:"start"},{token:"xml-pe.xml",regex:"[-_a-zA-Z0-9:]+"},{token:"punctuation.int-subset",regex:"\\[",push:"int_subset"}],int_subset:[{token:"text.xml",regex:"\\s+"},{token:"punctuation.int-subset.xml",regex:"]",next:"pop"},{token:["punctuation.markup-decl.xml","keyword.markup-decl.xml"],regex:"(<\\!)("+n+")",push:[{token:"text",regex:"\\s+"},{token:"punctuation.markup-decl.xml",regex:">",next:"pop"},{include:"string"}]}],cdata:[{token:"string.cdata.xml",regex:"\\]\\]>",next:"start"},{token:"text.xml",regex:"\\s+"},{token:"text.xml",regex:"(?:[^\\]]|\\](?!\\]>))+"}],comment:[{token:"comment.end.xml",regex:"--\x3e",next:"start"},{defaultToken:"comment.xml"}],reference:[{token:"constant.language.escape.reference.xml",regex:"(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"}],attr_reference:[{token:"constant.language.escape.reference.attribute-value.xml",regex:"(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"}],tag:[{token:["meta.tag.punctuation.tag-open.xml","meta.tag.punctuation.end-tag-open.xml","meta.tag.tag-name.xml"],regex:"(?:(<)|(</))((?:"+n+":)?"+n+")",next:[{include:"attributes"},{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",next:"start"}]}],tag_whitespace:[{token:"text.tag-whitespace.xml",regex:"\\s+"}],whitespace:[{token:"text.whitespace.xml",regex:"\\s+"}],string:[{token:"string.xml",regex:"'",push:[{token:"string.xml",regex:"'",next:"pop"},{defaultToken:"string.xml"}]},{token:"string.xml",regex:'"',push:[{token:"string.xml",regex:'"',next:"pop"},{defaultToken:"string.xml"}]}],attributes:[{token:"entity.other.attribute-name.xml",regex:n},{token:"keyword.operator.attribute-equals.xml",regex:"="},{include:"tag_whitespace"},{include:"attribute_value"}],attribute_value:[{token:"string.attribute-value.xml",regex:"'",push:[{token:"string.attribute-value.xml",regex:"'",next:"pop"},{include:"attr_reference"},{defaultToken:"string.attribute-value.xml"}]},{token:"string.attribute-value.xml",regex:'"',push:[{token:"string.attribute-value.xml",regex:'"',next:"pop"},{include:"attr_reference"},{defaultToken:"string.attribute-value.xml"}]}]},this.constructor===e&&this.normalizeRules()};(function(){this.embedTagRules=function(e,t,n){this.$rules.tag.unshift({token:["meta.tag.punctuation.tag-open.xml","meta.tag."+n+".tag-name.xml"],regex:"(<)("+n+"(?=\\s|>|$))",next:[{include:"attributes"},{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",next:t+"start"}]}),this.$rules[n+"-end"]=[{include:"attributes"},{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",next:"start",onMatch:function(e,t,n){return n.splice(0),this.token}}],this.embedRules(e,t,[{token:["meta.tag.punctuation.end-tag-open.xml","meta.tag."+n+".tag-name.xml"],regex:"(</)("+n+"(?=\\s|>|$))",next:n+"-end"},{token:"string.cdata.xml",regex:"<\\!\\[CDATA\\["},{token:"string.cdata.xml",regex:"\\]\\]>"}])}}).call(o.prototype),r.inherits(a,o),t.XmlHighlightRules=a})),ace.define("ace/mode/behaviour/xml",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],(function(e,t,n){"use strict";var r=e("../../lib/oop"),o=e("../behaviour").Behaviour,a=e("../../token_iterator").TokenIterator;e("../../lib/lang");function i(e,t){return e&&e.type.lastIndexOf(t+".xml")>-1}var l=function(){this.add("string_dquotes","insertion",(function(e,t,n,r,o){if('"'==o||"'"==o){var l=o,u=r.doc.getTextRange(n.getSelectionRange());if(""!==u&&"'"!==u&&'"'!=u&&n.getWrapBehavioursEnabled())return{text:l+u+l,selection:!1};var s=n.getCursorPosition(),g=r.doc.getLine(s.row).substring(s.column,s.column+1),c=new a(r,s.row,s.column),m=c.getCurrentToken();if(g==l&&(i(m,"attribute-value")||i(m,"string")))return{text:"",selection:[1,1]};if(m||(m=c.stepBackward()),!m)return;for(;i(m,"tag-whitespace")||i(m,"whitespace");)m=c.stepBackward();var d=!g||g.match(/\s/);if(i(m,"attribute-equals")&&(d||">"==g)||i(m,"decl-attribute-equals")&&(d||"?"==g))return{text:l+l,selection:[1,1]}}})),this.add("string_dquotes","deletion",(function(e,t,n,r,o){var a=r.doc.getTextRange(o);if(!o.isMultiLine()&&('"'==a||"'"==a)&&r.doc.getLine(o.start.row).substring(o.start.column+1,o.start.column+2)==a)return o.end.column++,o})),this.add("autoclosing","insertion",(function(e,t,n,r,o){if(">"==o){var l=n.getSelectionRange().start,u=new a(r,l.row,l.column),s=u.getCurrentToken()||u.stepBackward();if(!s||!(i(s,"tag-name")||i(s,"tag-whitespace")||i(s,"attribute-name")||i(s,"attribute-equals")||i(s,"attribute-value")))return;if(i(s,"reference.attribute-value"))return;if(i(s,"attribute-value")){var g=u.getCurrentTokenColumn()+s.value.length;if(l.column<g)return;if(l.column==g){var c=u.stepForward();if(c&&i(c,"attribute-value"))return;u.stepBackward()}}if(/^\s*>/.test(r.getLine(l.row).slice(l.column)))return;for(;!i(s,"tag-name");)if("<"==(s=u.stepBackward()).value){s=u.stepForward();break}var m=u.getCurrentTokenRow(),d=u.getCurrentTokenColumn();if(i(u.stepBackward(),"end-tag-open"))return;var x=s.value;if(m==l.row&&(x=x.substring(0,l.column-d)),this.voidElements.hasOwnProperty(x.toLowerCase()))return;return{text:"></"+x+">",selection:[1,1]}}})),this.add("autoindent","insertion",(function(e,t,n,r,o){if("\n"==o){var i=n.getCursorPosition(),l=r.getLine(i.row),u=new a(r,i.row,i.column),s=u.getCurrentToken();if(s&&-1!==s.type.indexOf("tag-close")){if("/>"==s.value)return;for(;s&&-1===s.type.indexOf("tag-name");)s=u.stepBackward();if(!s)return;var g=s.value,c=u.getCurrentTokenRow();if(!(s=u.stepBackward())||-1!==s.type.indexOf("end-tag"))return;if(this.voidElements&&!this.voidElements[g]){var m=r.getTokenAt(i.row,i.column+1),d=(l=r.getLine(c),this.$getIndent(l)),x=d+r.getTabString();return m&&"</"===m.value?{text:"\n"+x+"\n"+d,selection:[1,x.length,1,x.length]}:{text:"\n"+x}}}}}))};r.inherits(l,o),t.XmlBehaviour=l})),ace.define("ace/mode/folding/xml",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/range","ace/mode/folding/fold_mode","ace/token_iterator"],(function(e,t,n){"use strict";var r=e("../../lib/oop"),o=(e("../../lib/lang"),e("../../range").Range),a=e("./fold_mode").FoldMode,i=e("../../token_iterator").TokenIterator,l=t.FoldMode=function(e,t){a.call(this),this.voidElements=e||{},this.optionalEndTags=r.mixin({},this.voidElements),t&&r.mixin(this.optionalEndTags,t)};r.inherits(l,a);var u=function(){this.tagName="",this.closing=!1,this.selfClosing=!1,this.start={row:0,column:0},this.end={row:0,column:0}};function s(e,t){return e.type.lastIndexOf(t+".xml")>-1}(function(){this.getFoldWidget=function(e,t,n){var r=this._getFirstTagInLine(e,n);return r?r.closing||!r.tagName&&r.selfClosing?"markbeginend"==t?"end":"":!r.tagName||r.selfClosing||this.voidElements.hasOwnProperty(r.tagName.toLowerCase())||this._findEndTagInLine(e,n,r.tagName,r.end.column)?"":"start":this.getCommentFoldWidget(e,n)},this.getCommentFoldWidget=function(e,t){return/comment/.test(e.getState(t))&&/<!-/.test(e.getLine(t))?"start":""},this._getFirstTagInLine=function(e,t){for(var n=e.getTokens(t),r=new u,o=0;o<n.length;o++){var a=n[o];if(s(a,"tag-open")){if(r.end.column=r.start.column+a.value.length,r.closing=s(a,"end-tag-open"),!(a=n[++o]))return null;for(r.tagName=a.value,r.end.column+=a.value.length,o++;o<n.length;o++)if(a=n[o],r.end.column+=a.value.length,s(a,"tag-close")){r.selfClosing="/>"==a.value;break}return r}if(s(a,"tag-close"))return r.selfClosing="/>"==a.value,r;r.start.column+=a.value.length}return null},this._findEndTagInLine=function(e,t,n,r){for(var o=e.getTokens(t),a=0,i=0;i<o.length;i++){var l=o[i];if(!((a+=l.value.length)<r)&&s(l,"end-tag-open")&&(l=o[i+1])&&l.value==n)return!0}return!1},this._readTagForward=function(e){var t=e.getCurrentToken();if(!t)return null;var n=new u;do{if(s(t,"tag-open"))n.closing=s(t,"end-tag-open"),n.start.row=e.getCurrentTokenRow(),n.start.column=e.getCurrentTokenColumn();else if(s(t,"tag-name"))n.tagName=t.value;else if(s(t,"tag-close"))return n.selfClosing="/>"==t.value,n.end.row=e.getCurrentTokenRow(),n.end.column=e.getCurrentTokenColumn()+t.value.length,e.stepForward(),n}while(t=e.stepForward());return null},this._readTagBackward=function(e){var t=e.getCurrentToken();if(!t)return null;var n=new u;do{if(s(t,"tag-open"))return n.closing=s(t,"end-tag-open"),n.start.row=e.getCurrentTokenRow(),n.start.column=e.getCurrentTokenColumn(),e.stepBackward(),n;s(t,"tag-name")?n.tagName=t.value:s(t,"tag-close")&&(n.selfClosing="/>"==t.value,n.end.row=e.getCurrentTokenRow(),n.end.column=e.getCurrentTokenColumn()+t.value.length)}while(t=e.stepBackward());return null},this._pop=function(e,t){for(;e.length;){var n=e[e.length-1];if(t&&n.tagName!=t.tagName){if(this.optionalEndTags.hasOwnProperty(n.tagName)){e.pop();continue}return null}return e.pop()}},this.getFoldWidgetRange=function(e,t,n){var r=this._getFirstTagInLine(e,n);if(!r)return this.getCommentFoldWidget(e,n)&&e.getCommentFoldRange(n,e.getLine(n).length);var a,l=[];if(r.closing||r.selfClosing){s=new i(e,n,r.end.column);for(var u={row:n,column:r.start.column};a=this._readTagBackward(s);){if(a.selfClosing){if(l.length)continue;return a.start.column+=a.tagName.length+2,a.end.column-=2,o.fromPoints(a.start,a.end)}if(a.closing)l.push(a);else if(this._pop(l,a),0==l.length)return a.start.column+=a.tagName.length+2,a.start.row==a.end.row&&a.start.column<a.end.column&&(a.start.column=a.end.column),o.fromPoints(a.start,u)}}else{var s=new i(e,n,r.start.column),g={row:n,column:r.start.column+r.tagName.length+2};for(r.start.row==r.end.row&&(g.column=r.end.column);a=this._readTagForward(s);){if(a.selfClosing){if(l.length)continue;return a.start.column+=a.tagName.length+2,a.end.column-=2,o.fromPoints(a.start,a.end)}if(a.closing){if(this._pop(l,a),0==l.length)return o.fromPoints(g,a.start)}else l.push(a)}}}}).call(l.prototype)})),ace.define("ace/mode/xml",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text","ace/mode/xml_highlight_rules","ace/mode/behaviour/xml","ace/mode/folding/xml","ace/worker/worker_client"],(function(e,t,n){"use strict";var r=e("../lib/oop"),o=e("../lib/lang"),a=e("./text").Mode,i=e("./xml_highlight_rules").XmlHighlightRules,l=e("./behaviour/xml").XmlBehaviour,u=e("./folding/xml").FoldMode,s=e("../worker/worker_client").WorkerClient,g=function(){this.HighlightRules=i,this.$behaviour=new l,this.foldingRules=new u};r.inherits(g,a),function(){this.voidElements=o.arrayToMap([]),this.blockComment={start:"\x3c!--",end:"--\x3e"},this.createWorker=function(e){var t=new s(["ace"],"ace/mode/xml_worker","Worker");return t.attachToDocument(e.getDocument()),t.on("error",(function(t){e.setAnnotations(t.data)})),t.on("terminate",(function(){e.clearAnnotations()})),t},this.$id="ace/mode/xml"}.call(g.prototype),t.Mode=g})),ace.require(["ace/mode/xml"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));