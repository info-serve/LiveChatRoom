const page = (function () {
    const addList = $(".add-list");
    function intoChatRoom() {
        $('.login').hide(200);
        $(".main").show(200);
    }
    function addLog(log) {
        $("<li>").addClass("log").html(log).appendTo($(".add-list"))
    }
    /**
     * 添加用户
     * @param {*} userName 
     */
    function addUser(userName) {
        if (!userName) {
            return false
        }
        $("<li>").addClass('items').text(userName).attr("user", userName).appendTo($(".user-list .users"))
        let num = +$(".user-list .title span").text() + 1
        $(".user-list .title span").text(num)
        addLog(`<span class="user">${userName}</span> 进入聊天室`);
        //  chatList.scrollTop(chatList.prop("scrollHeight"),0);
    }
    /**
     * 用户名移除
     * @param {*} userName 
     */
    function userNameRemove(userName) {
        if (!userName) {
            return false
        }
        const li = $(".user-list .users").find(`li[user="${userName}"]`);
        if (!li.length) {
            return
        }
        li.remove();
        let num = +$(".user-list .title span").text() - 1
        $(".user-list .title span").text(num)
        addLog(`<span class="user">${userName}</span> 离开聊天室`);
    }

    /**
     * 清空input
     */
    function clearInput() {
        $(".sendMsg #cpnt").val("")
    }

    /**
     * 添加信息
     * @param {*} from  信息来自谁的
     * @param {*} msg 信息内容
     * @param {*} to 给谁发
     */
    function addMsg(from, msg, to) {
        const li = $("<li>")
            .html(`
               <span class="user">${from}</span>
               <span class="gray">对</span>
               <span class="user">${to ? to : "所有人"}</span>
               <span class="gray">说<b>&nbsp;:</b></span>
               `)
        const msgSpan = $("<span>").text(msg)
        li.append(msgSpan).appendTo($(".chars-list"))
        // addList.scrollTop(caddList.prop("scrollHeight"), 0)
    }

    function addStyle(domlist, styleList, targetDom) {
        for (let i = 0; i < domlist.length; i++) {
            domlist[i].classList.remove(styleList)
        }
        targetDom.classList.add(styleList)

    }
    /**
     * 获取目标用户
     */
    function getTargetUser() {
        const user = $(".sendMsg .user").text();
        return user === "所有人" ? null : user;
    }

    $(".user-list .users").click(e => {
        if (e.target.tagName === "LI") {
            addStyle($(".users .items"),'active',e.target)
            $(".sendMsg .user").text(e.target.innerText)
        }
    });

    function initChatRoom() {
        $(".users").html(` <li class="items all active">所有人</li>`)
        addList.html("")
        $(".user-list .title span").text(0)
    }

    return {
        my: null,
        pwd: null,
        intoChatRoom,
        initChatRoom,
        addUser,
        addLog,
        userNameRemove,
        clearInput,
        addMsg,
        getTargetUser,
        onLogins: null,
        onSendMsg: null
    }


})();


(function () {
    $(".login .form .item .cc").click((e) => {
        let userN = $(".item .userN").val();
        const userP = $(".item .userP").val();
        page.my = userN
        page.pwd = userP
        page.onLogins && page.onLogins(page.my, page.pwd)
    });
    $(".sendMsg #btnd").click((e) => {
        e.stopPropagation();
        let contentMsg = $(".sendMsg #cpnt").val();
        const to = $(".sendMsg .user").text();//to
        to === "所有人" ? null : to;
        page.onSendMsg && page.onSendMsg(page.my, contentMsg, to)
    })


})()