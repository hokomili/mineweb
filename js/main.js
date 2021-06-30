const severURL = "https://script.google.com/macros/s/AKfycbzbJEtJUE2WLE-ZT35Cl_5xHYn3wcFLHiijlCAvwHgDpuUe5ngE0ZleUx2IC5e2nNScGQ/exec"
let event_ary = ['input[type=text]','textarea']
let map
let start=false
document.getElementById("gear").onclick=()=>{
    $('#savegame').modal('show')
}
$(document).ready(function () {
    $('#startup').modal('show')
    initBtnFunc();
});
function initBtnFunc() {
    $('.backtomain').click(function (e) {
        $('tbody').html("");
        $('#showworld').modal('hide')
        $('#register').modal('hide')
        $('#login').modal('hide')
        $('#startup').modal('show')
    });
    $('.allworld').click(function (e) { 
        $('#startup').modal('hide')
        $('#showworld').modal('show')
    });
    $('.requestworld').click(function (e) { 
        checkField(0);
    });
    $('.register').click(function (e) { 
        checkField(1);
    });
    $('.login').click(function (e) { 
        checkField(2);
    });
    $('.savegame').click(async function (e) { 
        console.log(await asyncsave());
    });
    $('.allworld').click(function (e) { 
        checkField(3);
    });
}

for (let i = 0; i < event_ary.length; i++) {
    $(event_ary[i]).focus(function (e) { 
        if($(this).val() == ''){
            setTip($(this));
        }
    });
    
    $(event_ary[i]).keyup(function (e) { 
        if($(this).val() != ''){
            removeTip($(this));
        }
    });
}
$('input[name=password]').focus(function (e) {
    if($(this).val() == ''){
        setTip($(this));
    }
});
$('input[name=password]').keyup(function (e) {
    if($(this).val() != ''){
        removeTip($(this));
    }
});
$('input[name=regpassword]').focus(function (e) {
    if($(this).val() == ''){
        setTip($(this));
    }
});
$('input[name=regpassword]').keyup(function (e) {
    if($(this).val() != ''){
        removeTip($(this));
    }
});
$('select').change(function (e) {
    removeTip($(this));
});
async function checkField(modalNum){
    switch (modalNum) {
        case 0:
            if($('input[name=worldName]').val() == ''){
                setTip($('input[name=worldName]'));
                return false;
            }
            if($('input[name=userName]').val() == ''){
                setTip($('input[name=userName]'));
                return false;
            }
            spin($('input[name=userName]'))
            var worldexist= await requestWorldName()
            removeTip($('input[name=userName]'));
            if(worldexist){
                $('#startup').modal('hide')
                $('#login').modal('show')
            }else{
                $('#startup').modal('hide')
                $('#register').modal('show')
            };
            break;
        case 1:
            if($('select').val() == null){
                setTip($('select'));
                return false
            }
            if($('input[name=regpassword]').val() == ''){
                setTip($('input[name=regpassword]'));
                return false;
            }
            spin($('input[name=regpassword]'))
            var worldcreate = await buildworld()
            var worldread = await readworld()
            removeTip($('input[name=regpassword]'));
            if(worldread){
                $('#register').modal('hide')
                startgame();
            };
            break;
        case 2:
            if($('input[name=password]').val() == ''){
                setTip($('input[name=password]'));
                return false;
            }
            spin($('input[name=password]'))
            var password = await checkpass()
            if(password){
                console.log("access granted")
                var worldread = await readworld()
                if(worldread){
                    $('#login').modal('hide')
                    startgame();
                }
            }
            else{
                alert("wrong password!")
            }
            removeTip($('input[name=password]'));
            break;
        case 3:
            spin($('tbody'))
            await readallworld()
            removeTip($('tbody'));
            break;
    }
}
function setTip(dom) {
    let node = $('#tipTemplate01').html();
    if(dom.closest('.modalInput').find('.tip').length==0){
        dom.closest('.modalInput').append(node);
        dom.closest('.modalInput').addClass('bdr');
    }
}
function spin(dom){
    let node = $('#spinner').html();
    if(dom.closest('.modalInput').find('.tip').length==0){
        dom.closest('.modalInput').append(node);
        dom.closest('.modalInput').addClass('bdr');
    }
}
function removeTip(dom) {
    dom.closest('.modalInput').find('.tip').remove();
    dom.closest('.modalInput').removeClass('bdr');
}

async function requestWorldName(){
    let parameter = {};
    parameter.worldName = $('input[name=worldName]').val();
    parameter.method = 'requestname';
    return await $.post(severURL, parameter,function (data) {
        return data
    }).fail(function (data) {
        alert(data);
    })
}
async function checkpass(){
    let parameter = {};
    parameter.worldName = $('input[name=worldName]').val();
    parameter.password = $('input[name=password]').val();
    parameter.method = 'checkpass';
    return await $.post(severURL, parameter,function (data) {
        return data
    }).fail(function (data) {
        alert(data);
    })
}
async function buildworld(){
    let parameter = {};
    parameter.userName = $('input[name=userName]').val();
    parameter.worldName = $('input[name=worldName]').val();
    parameter.worldType = $('select').val();
    parameter.password = $('input[name=regpassword]').val();
    parameter.method = 'buildworld';
    return await $.post(severURL, parameter,function (data) {
        return data
    }).fail(function (data) {
        alert(data);
    })
}
async function readworld(worldname) {
    let parameter = {};
    parameter.method = 'readworld';
    parameter.worldName = worldname||$('input[name=worldName]').val();
    return await $.post(severURL, parameter,function (data) {
        map=data;
        return data
    }).fail(function (data) {
        alert(data);
    })
}
async function readallworld() {
    let parameter = {};
    parameter.method = 'readall';
    await $.post(severURL, parameter,function (data) {
        setTable(data);
    }).fail(function (data) {
        alert('error');
    })

}
function setTable(sData) {
    let node = $('#tr01').html();
    for (let i = 0; i < sData.length; i++) {
        let content = node.replace('LIST_HERE',i);
        content = content.replace('WNAME_HERE', sData[i][0]);
        content = content.replace('UNAME_HERE', sData[i][1]);
        content = content.replace('MTIME_HERE', sData[i][2]);
        content = content.replace('LINK_HERE', "匿名登入");
        content = content.replace('ID_HERE', 't'+i);
        $('tbody').append(content);
        $('#t'+i).click(async function(e){
            spin($('tbody'))
                var worldread = await readworld(sData[i][0])
                if(worldread){
                    $('#showworld').modal('hide')
                    startgame()
                }
            removeTip($('tbody'));
        });
    }
}
var autosavedata
function saveworld(){
    let parameter = {};
    parameter.method = 'saveworld';
    parameter.worldName = $('input[name=worldName]').val();
    parameter.userName = $('input[name=userName]').val();
    parameter.mapData = JSON.stringify(map);
    $.post(severURL, parameter,function (data) {
        autosavedata=data
        console.log(autosavedata)
    }).fail(function (data) {
        alert(data.data);
    })
}
async function asyncsave(){
    spin($('#save-spin'))
    let parameter = {};
    parameter.method = 'saveworld';
    parameter.worldName = $('input[name=worldName]').val();
    parameter.userName = $('input[name=userName]').val();
    parameter.mapData = JSON.stringify(map);
    return await $.post(severURL, parameter,function (data) {
        removeTip($('#save-spin'))
        return data
    }).fail(function (data) {
        alert(data);
    })
}
var offsetx = window.innerWidth / 2-(64*12);
var offsetcx = window.innerWidth / 2-24;
var offsety = window.innerHeight / 2-(64*8);
var offsetcy = window.innerHeight / 2-48;
var autosave
var chosenblock=0
var choice=[0,1,2,3,4]
async function startgame(){
    for(let i=0;i<map.length;i++){
        var newdiv=document.createElement("div");
        newdiv.id="Y"+i
        newdiv.style.height="64px"
        newdiv.style.width=64*24+"px"
        document.getElementById("game").insertBefore(newdiv,null)
        for(let j=0;j<map[i].length;j++){
            var newchild=document.createElement("div");
            newchild.id=i+"-"+j
            newchild.style.width="64px"
            newchild.style.height="64px"
            document.getElementById("Y"+i).insertBefore(newchild,null)
            $("#"+i+"-"+j).addClass("d-inline-block")
            $("#"+i+"-"+j).addClass("c-"+map[i][j])
            $("#"+i+"-"+j).mouseenter(function () { 
                onblockhover(i,j)
            });
        }
    }
    document.getElementById("inventory1").onclick=(e)=>{
        chosenblock=0
        document.getElementById("choser").style.marginLeft="0rem"
        document.getElementById("choser").style.marginRight="25rem"
    }
    document.getElementById("inventory2").onclick=(e)=>{
        chosenblock=1
        document.getElementById("choser").style.marginLeft="5rem"
        document.getElementById("choser").style.marginRight="20rem"
    }
    document.getElementById("inventory3").onclick=(e)=>{
        chosenblock=2
        document.getElementById("choser").style.marginLeft="10rem"
        document.getElementById("choser").style.marginRight="15rem"
    }
    document.getElementById("inventory4").onclick=(e)=>{
        chosenblock=3
        document.getElementById("choser").style.marginLeft="15rem"
        document.getElementById("choser").style.marginRight="10rem"
    }
    document.getElementById("inventory5").onclick=(e)=>{
        chosenblock=4
        document.getElementById("choser").style.marginLeft="20rem"
        document.getElementById("choser").style.marginRight="5rem"
    }
    document.getElementById("inventory6").onclick=(e)=>{
        document.getElementById("inv").innerHTML=""
        $('#inven').modal('show')
        for(let i=1;i<12;i++){
            var newdiv=document.createElement("div");
            newdiv.id="inv"+i
            newdiv.classList.add("c-"+i)
            newdiv.classList.add("inventory")
            document.getElementById("inv").insertBefore(newdiv,null)
            $("#inv"+i).click(function (e) {
                document.getElementById("inventory5").classList.remove(document.getElementById("inventory5").classList.item(2))
                document.getElementById("inventory5").classList.add(document.getElementById("inventory4").classList.item(2))
                document.getElementById("inventory4").classList.remove(document.getElementById("inventory4").classList.item(2))
                document.getElementById("inventory4").classList.add(document.getElementById("inventory3").classList.item(2))
                document.getElementById("inventory3").classList.remove(document.getElementById("inventory3").classList.item(2))
                document.getElementById("inventory3").classList.add(document.getElementById("inventory2").classList.item(2))
                document.getElementById("inventory2").classList.remove(document.getElementById("inventory2").classList.item(2))
                document.getElementById("inventory2").classList.add("c-"+i)
                choice[4]=choice[3]
                choice[3]=choice[2]
                choice[2]=choice[1]
                choice[1]=i
            });
        }
    }
    $("#target").mousedown(function () {
        if(chosenblock==0){
            onblockbreak()
        }else{
            onblockbuild()
        }
    });
    document.getElementById("game").style.transform = "translate("+offsetx+"px,"+offsety+"px)";
    document.getElementById("character").style.transform = "translate("+offsetcx+"px,"+offsetcy+"px)";
    autosave=setInterval((()=>{
        saveworld();
        console.log("autosaved")
    }),300000)
    game()
}
function leavegame(){
    clearInterval(autosave)
    clearInterval(gravity)
}
var gravity
var air=0
var cposX=0;
var cposY=0;
function game(){
    start=true;
    document.getElementById("character").style.opacity=1;
    gravity=setInterval((()=>{
        var fallspeed=0
        var drop=false;
        if(air>=40){
            air=0
        }
        else if(air<30){
            air++
        }
        if(cposX<-64*12+16){
            cposX=-64*12+16
        }
        else if(cposX>64*12-16){
            cposX=64*12-16
        }
        if(cposY>64*8-48){
            cposY=64*8-48
        }else if(cposY<-64*7+48){
            cposY=-64*7+48
        }
        if(!(standable(map[Math.floor((64*8-cposY+48)/64)][Math.floor((64*12-cposX+16)/64)])||standable(map[Math.floor((64*8-cposY+48)/64)][Math.floor((64*12-cposX-16)/64)]))){
            if(!drop){
                fallspeed=0
                drop=true;
            }
            fallspeed+=9.8;
            cposY-=fallspeed;
        }
        else{
            drop=false;
        }
        document.getElementById("game").style.transform = "translate("+(offsetx+cposX)+"px,"+(offsety+cposY)+"px)";
    }),10)
    document.getElementById("userName").innerText=$('input[name=userName]').val()
    console.log($('input[name=userName]').val())
}
function standable(block){
    switch(block){
        case 0:
            return false;
        case 3:
            return false;
        case 4:
            return false;
        case 7:
            return false;
        case 8:
            return false;
        case 9:
            return false;
        default:
            return true;
    }
}
var shooting={"KeyW":false,"KeyA":false,"KeyD":false};
var eventkey={"KeyW":null,"KeyA":null,"KeyD":null};
document.onkeydown=(e) => {
    if(!start)return
    var code=e.code;
    if(shooting[code])return;
    shooting[code]=true;
    console.log(shooting[code])
    eventkey[code]=window.setInterval(( () => {
        switch(code){
            case"KeyW":
            if(air>=30&&air<40){
                air++;
                cposY+=40;
            }
            break;
            case"KeyA":
            document.getElementById("face").style.transform="scaleX(100%)"
            cposX+=10
            break;
            case"KeyD":
            document.getElementById("face").style.transform="scaleX(-100%)"
            cposX-=10
            break;
        }
    })
        , 10);
};
document.onkeyup=(e)=>{
    clearInterval(eventkey[e.code]);
    shooting[e.code]=false;
};
var selectedx;
var selectedy;
function onblockhover(i,j){
    selectedx=j
    selectedy=i
    document.getElementById("target").style.transform="translate("+(cposX+j*64+offsetx)+"px,"+(cposY+i*64+offsety)+"px)"
    document.getElementById("target").style.opacity=1;
}
function onblockbreak(){
    if(map[selectedy][selectedx]!=0){
        $("#"+selectedy+"-"+selectedx).removeClass("c-"+map[selectedy][selectedx])
        map[selectedy][selectedx]=0
        $("#"+selectedy+"-"+selectedx).addClass("c-"+0)
        console.log("broke")
    }
}
function onblockbuild(){
    if(map[selectedy][selectedx]==0){
        $("#"+selectedy+"-"+selectedx).removeClass("c-"+map[selectedy][selectedx])
        map[selectedy][selectedx]=choice[chosenblock]
        $("#"+selectedy+"-"+selectedx).addClass("c-"+map[selectedy][selectedx])
        console.log("built",choice[chosenblock])
    }
}