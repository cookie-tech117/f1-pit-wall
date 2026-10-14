export const ROUTES={home:'6:7',brief1:'6:69',choice1:'6:101',result1a:'6:121',result1b:'6:150',brief2:'6:187',choice2:'6:219',result2a:'6:239',result2b:'6:268',brief3:'6:305',choice3:'6:337',result3a:'6:357',result3b:'6:386',summary:'6:32',share:'8:79'};
export const LABELS=[{A:'\u62a2\u5148\u6362\u80ce',B:'\u5ef6\u540e\u8fdb\u7ad9'},{A:'\u65b0\u80ce\u53cd\u51fb',B:'\u7559\u573a\u5b88\u4f4d'},{A:'\u4e24\u505c\u8ffd\u51fb',B:'\u7ef4\u6301\u7b56\u7565'}];
export const ACTIONS={
 '6:27':{to:'brief1',restart:true},'6:98':{to:'choice1'},
 '6:112':{to:'result1a',question:0,choice:'A'},'6:118':{to:'result1b',question:0,choice:'B'},
 '6:145':{to:'result1b'},'6:147':{to:'brief2'},'6:174':{to:'result1a'},'6:176':{to:'brief2'},
 '6:216':{to:'choice2'},'6:230':{to:'result2a',question:1,choice:'A'},'6:236':{to:'result2b',question:1,choice:'B'},
 '6:263':{to:'result2b'},'6:265':{to:'brief3'},'6:292':{to:'result2a'},'6:294':{to:'brief3'},
 '6:334':{to:'choice3'},'6:348':{to:'result3a',question:2,choice:'A'},'6:354':{to:'result3b',question:2,choice:'B'},
 '6:381':{to:'result3b'},'6:383':{to:'summary'},'6:410':{to:'result3a'},'6:412':{to:'summary'},
 '6:50':{to:'share'},'6:52':{to:'home',restart:true},'8:85':{to:'summary'}
};
export function normalizeChoices(value){return Array.from({length:3},(_,i)=>Array.isArray(value)&&['A','B'].includes(value[i])?value[i]:null);}
export function applyAction(choices,id){const action=ACTIONS[id];if(!action)return null;const next=action.restart?[null,null,null]:normalizeChoices(choices);if(action.choice)next[action.question]=action.choice;return {choices:next,route:action.to};}
export function safeRoute(route,choices){if(!Object.hasOwn(ROUTES,route))return 'home';if(['summary','share'].includes(route)){const first=normalizeChoices(choices).indexOf(null);if(first>=0)return 'brief'+(first+1);}return route;}
export function choiceLabels(choices){return normalizeChoices(choices).map((x,i)=>x?LABELS[i][x]:'\u5c1a\u672a\u9009\u62e9');}
