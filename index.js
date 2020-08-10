const app = require('express')();
const path = require("path");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let userLists = []
io.on('connection', socket => {
    let curUserName = "";//当前用户名
    socket.on("login", data => {
        if (data.pwd !== "123456" || data.userName == "所有人" || userLists.filter(u => u.userName === data.userName).length > 0) {
            socket.emit("login", false)
        } else {
            userLists.push({
                userName: data.userName,
                pwd: data.pwd,
                socket
            })
            curUserName = data.userName
            socket.emit("login", true)
            //新用户进入 broadcast广播
            socket.broadcast.emit("userin", data.userName)
        }
    });
    socket.on("users", () => {
        const arr = userLists.map(u => u.userName);
        socket.emit("users", arr)
    })

    socket.on("msg", datas => {
        // console.log(datas)
        if (datas.to !== "所有人") {
            //指定的人
            const us = userLists.filter(t => t.userName === datas.to)
            if (us.length > 0) {
                us[0].socket.emit("new msg", {
                    from: curUserName,
                    content: datas.content,
                    to: datas.to
                })
            }

        } else {
            socket.broadcast.emit("new msg", {
                from: curUserName,
                content: datas.content,
                to: datas.to
            });
        }
    })


    //服务断开 通知其他客户端
    socket.on("disconnect", () => {
        socket.broadcast.emit("userout", curUserName);
        // 从数组里面删除
        user = userLists.filter(u => u.userName !== curUserName)
    })
});



server.listen(5008, () => {
    console.log("服务启动")
})