const socket = io("http://127.0.0.1:5008");//连接服务器
//客户端给服务器发送消息

page.onLogins = function (userName, pwd) {
    //前面那个是与服务器约定的名称
    socket.emit("login", {
        userName,
        pwd
    })
}

page.onSendMsg = function (my, msg, to) {
    socket.emit("msg", {
        to: to,
        content: msg
    });
    page.addMsg(my, msg, to)
}


//客户端监听服务端的消息 登录
socket.on("login", res => {
    // console.log(res)
    if (res) {
        page.intoChatRoom();
        socket.emit("users", "")
    } else {
        alert("昵称已被占用，请更换昵称 \n 或者密码错误")
        $(".item .inp").val("")
    }
});

socket.on("users", (rep) => {
    //进入聊天室之前，先初始化默认状态
    page.initChatRoom()
    for (let u of rep) {
        page.addUser(u)
    }
});
// 新用户进去监听事件
socket.on("userin", userName => {
    page.addUser(userName)
})
//用户退出监听事件
socket.on("userout", reps => {
    page.userNameRemove(reps)
})
//接收新消息
socket.on("new msg", red => {
        page.addMsg(red.from, red.content, red.to)
        page.clearInput()
})