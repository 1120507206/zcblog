(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{466:function(t,s,n){"use strict";n.r(s);var a=n(1),e=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("nodejs 和 浏览器的 eventLoop 还是有很大差别的，值得单独拿出来说一说。")]),t._v(" "),s("p",[t._v("不知你是否看过关于 nodejs 中 eventLoop 的一些文章, 是否被这些流程图搞得眼花缭乱、一头雾水:")]),t._v(" "),s("p",[s("img",{attrs:{src:t.$withBase("/week07/10.jpg"),alt:"project"}})]),t._v(" "),s("p",[t._v("看到这你不用紧张，这里会抛开这些晦涩的流程图，以最清晰浅显的方式来一步步拆解 nodejs 的事件循环机制。")]),t._v(" "),s("h2",{attrs:{id:"_1-三大关键阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-三大关键阶段"}},[t._v("#")]),t._v(" 1. 三大关键阶段")]),t._v(" "),s("p",[t._v("首先，梳理一下 nodejs 三个非常重要的执行阶段:")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("执行 "),s("code",[t._v("定时器回调")]),t._v(" 的阶段。检查定时器，如果到了时间，就执行回调。这些定时器就是setTimeout、setInterval。这个阶段暂且叫它"),s("code",[t._v("timer")]),t._v("。")])]),t._v(" "),s("li",[s("p",[t._v("轮询(英文叫"),s("code",[t._v("poll")]),t._v(")阶段。因为在node代码中难免会有异步操作，比如文件I/O，网络I/O等等，那么当这些异步操作做完了，就会来通知JS主线程，怎么通知呢？就是通过'data'、\n'connect'等事件使得事件循环到达 "),s("code",[t._v("poll")]),t._v(" 阶段。到达了这个阶段后:")])])]),t._v(" "),s("p",[t._v("如果当前已经存在定时器，而且有定时器到时间了，拿出来执行，eventLoop 将回到timer阶段。")]),t._v(" "),s("p",[t._v("如果没有定时器, 会去看回调函数队列。")]),t._v(" "),s("ul",[s("li",[t._v("如果队列"),s("code",[t._v("不为空")]),t._v("，拿出队列中的方法依次执行")]),t._v(" "),s("li",[t._v("如果队列"),s("code",[t._v("为空")]),t._v("，检查是否有 "),s("code",[t._v("setImmdiate")]),t._v(" 的回调\n"),s("ul",[s("li",[t._v("有则前往"),s("code",[t._v("check阶段")]),t._v("(下面会说)")]),t._v(" "),s("li",[s("code",[t._v("没有则继续等待")]),t._v("，相当于阻塞了一段时间(阻塞时间是有上限的), 等待 callback 函数加入队列，加入后会立刻执行。一段时间后"),s("code",[t._v("自动进入 check 阶段")]),t._v("。")])])])]),t._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[t._v("check 阶段。这是一个比较简单的阶段，直接"),s("code",[t._v("执行 setImmdiate")]),t._v(" 的回调。")])]),t._v(" "),s("p",[t._v("这三个阶段为一个循环过程。不过现在的eventLoop并不完整，我们现在就来一一地完善。")]),t._v(" "),s("h2",{attrs:{id:"_2-完善"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-完善"}},[t._v("#")]),t._v(" 2. 完善")]),t._v(" "),s("p",[t._v("首先，当第 1 阶段结束后，可能并不会立即等待到异步事件的响应，这时候 nodejs 会进入到 "),s("code",[t._v("I/O异常的回调阶段")]),t._v("。比如说 TCP 连接遇到ECONNREFUSED，就会在这个时候执行回调。")]),t._v(" "),s("p",[t._v("并且在 check 阶段结束后还会进入到 "),s("code",[t._v("关闭事件的回调阶段")]),t._v("。如果一个 socket 或句柄（handle）被突然关闭，例如 socket.destroy()，\n'close' 事件的回调就会在这个阶段执行。")]),t._v(" "),s("p",[t._v("梳理一下，nodejs 的 eventLoop 分为下面的几个阶段:")]),t._v(" "),s("ol",[s("li",[t._v("timer 阶段")]),t._v(" "),s("li",[t._v("I/O 异常回调阶段")]),t._v(" "),s("li",[t._v("空闲、预备状态(第2阶段结束，poll 未触发之前)")]),t._v(" "),s("li",[t._v("poll 阶段")]),t._v(" "),s("li",[t._v("check 阶段")]),t._v(" "),s("li",[t._v("关闭事件的回调阶段")])]),t._v(" "),s("p",[t._v("是不是清晰了许多？")]),t._v(" "),s("h2",{attrs:{id:"_3-实例演示"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-实例演示"}},[t._v("#")]),t._v(" 3. 实例演示")]),t._v(" "),s("p",[t._v("好，我们以上次的练习题来实践一把:")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setTimeout")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'timer1'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    Promise"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'promise1'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setTimeout")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'timer2'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    Promise"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'promise2'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br")])]),s("p",[t._v("这里我要说，node版本 >= 11和在 11 以下的会有不同的表现。")]),t._v(" "),s("p",[t._v("首先说 node 版本 >= 11的，它会和浏览器表现一致，一个定时器运行完立即运行相应的微任务。")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("timer1\npromise1\ntime2\npromise2\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br")])]),s("p",[t._v("而 node 版本小于 11 的情况下，对于定时器的处理是:")]),t._v(" "),s("blockquote",[s("p",[t._v("若第一个定时器任务出队并执行完，发现队首的任务仍然是一个定时器，那么就将微任务暂时保存，"),s("code",[t._v("直接去执行")]),t._v("新的定时器任务，当新的定时器任务执行完后，"),s("code",[t._v("再一一执行")]),t._v("中途产生的微任务。")])]),t._v(" "),s("p",[t._v("因此会打印出这样的结果:")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("timer1\ntimer2\npromise1\npromise2\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br")])]),s("h2",{attrs:{id:"_4-nodejs-和-浏览器关于eventloop的主要区别"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-nodejs-和-浏览器关于eventloop的主要区别"}},[t._v("#")]),t._v(" 4.nodejs 和 浏览器关于eventLoop的主要区别")]),t._v(" "),s("p",[t._v("两者最主要的区别在于浏览器中的微任务是在"),s("code",[t._v("每个相应的宏任务")]),t._v("中执行的，而nodejs中的微任务是在"),s("code",[t._v("不同阶段之间")]),t._v("执行的。")]),t._v(" "),s("h2",{attrs:{id:"_5-关于process-nexttick的一点说明"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5-关于process-nexttick的一点说明"}},[t._v("#")]),t._v(" 5.关于process.nextTick的一点说明")]),t._v(" "),s("p",[t._v("process.nextTick 是一个独立于 eventLoop 的任务队列。")]),t._v(" "),s("p",[t._v("在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务"),s("code",[t._v("优先于微任务")]),t._v("执行。")])])}),[],!1,null,null,null);s.default=e.exports}}]);