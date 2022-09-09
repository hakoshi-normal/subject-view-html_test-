// 現在時刻の情報を表示
generate_url_now();

// カレンダー，時計初期化
var now = new Date();
var ymd = String(now.getFullYear()).padStart(4,'0')+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
document.getElementById("select_date").value = ymd;
var hm = String(now.getHours()+1).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
document.getElementById("select_time").value = hm;

// カレンダー，時計有効化切替
var elements = document.getElementsByClassName("select");
function radio_now(){
    for (var i in elements){
        elements[i].disabled = true;
    }
    generate_url_now();
}
function radio_select(){
    for (var i in elements){
        elements[i].disabled = false;
    }
}

// json処理，HTML反映
function json_func(jsonObj, d){
    document.getElementById("subjects_table").innerHTML = "";
    var msg;
    if (jsonObj.event=="school day"){ // 平日
        if (jsonObj.break_time==true){ // 休み時間
            msg = `${jsonObj.hour}限目前の休み時間`;
        }else{
            msg = `${jsonObj.hour}限目が開講中`;
        }
        console.log(jsonObj.result);
        var new_row = "<tr><th>講義名</th><th>対象学年</th><th>担当教員</th><th>教室</th><th>学部</th><th>単位数</th><th>必修</th></tr>";
        if (jsonObj.result.length==0){
            new_row += "<tr>該当講義なし</tr>";
        }else{
            for (var i in jsonObj.result){
                var name = jsonObj.result[i]["name"];
                var grade = jsonObj.result[i]["grade"];
                var teacher = jsonObj.result[i]["teacher"];
                var room = jsonObj.result[i]["room"];
                var faculty = jsonObj.result[i]["faculty"];
                var credit = jsonObj.result[i]["credit"];
                if (jsonObj.result[i]["required"]){ var required="○" }else{ var required="×"}
                new_row += `<tr><th>${name}</th><th>${grade}</th><th>${teacher}</th><th>${room}</th><th>${faculty}</th><th>${credit}</th><th>${required}</th></tr>`
            }
        }
        document.getElementById("subjects_table").innerHTML = new_row;
    } else {
        msg = jsonObj.event;
    }
    var msg1 = `${d[0]}/${d[1]}/${d[2]}(${jsonObj.dow}) ${d[3]}:${d[4]}`;
    var msg2 = `現在は${msg}です`;
    document.getElementById("msg1").textContent = msg1;
    document.getElementById("msg2").textContent = msg2;
}

function get_json(url){
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(jsonObj => {
            var date_tmp = url.split('/')[url.split('/').length-1].split('&');
            var date_info = [];
            for (var i in date_tmp){
                date_info.push(date_tmp[i].split('=')[1])
            }
            json_func(jsonObj, date_info);
        });
}

function generate_url_now(){
    var now = new Date();
    let url = `https://fukuchiyama-subjects-api.deno.dev/?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${now.getDate()}&hour=${now.getHours()}&min=${now.getMinutes()}`;
    get_json(url);
}

function generate_url_select(){
    var date = document.getElementById("select_date").value.split('-');
    var time = document.getElementById("select_time").value.split(':');
    let url = `https://fukuchiyama-subjects-api.deno.dev/?year=${date[0]}&month=${date[1]}&day=${date[2]}&hour=${time[0]}&min=${time[1]}`;
    get_json(url);
}