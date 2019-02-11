var baseURL = "http://dynamic.xkcd.com/api-0/jsonp/comic/",
    hinum, script, details = {},
    head = document.getElementsByTagName('head')[0];

function dataloaded(obj){details = obj; fill_page(); }

function ById(id) { return document.getElementById(id); }

//Return an error message if n is not a valid comic number.
function valid_num(n)
{
    var msg = '';

    switch(true)
    {
        //The empty string is valid - it's the current comic.
        case (n == ''):
            break;
        case (parseInt(n, 10) != n || n < 1):
            msg = "'" + n + "' is not a positive integer";
            break;
        case (n > hinum):
            msg = n + " is too high.\nThe current comic is " + hinum;
            break;
        case (n == 404):
            msg = "Comic " + n + " doesn't exist";
            break;
    }

    return msg;
}

function build_script(n)
{
    var msg = valid_num(n);
    
    if (msg)
    {
        alert(msg);
        return;
    }

    if (script != undefined)
        head.removeChild(script);
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = baseURL + n + "?callback=dataloaded";
    head.appendChild(script);
}

function fill_page()
{
    var t, num = details.num, url = "http://xkcd.com/" + num;

    ById("title").innerHTML = details.title;
    ById("num").innerHTML = 'xkcd # ' + num;
    ById("date").innerHTML = details.day + "/" + details.month + "/" + details.year;

    t = ById("image");
    t.src = details.img;
    t.alt = details.title;
    t.title = details.alt;

    ById("mouseover").innerHTML = details.alt;
    ById("transcript").innerHTML = format_transcript(details.transcript);

    t = ById("original")
    t.href = url;
    t.innerHTML = url;

    if (hinum == undefined)
        hinum = num;

    t = ById("inum");
    if (t.value == '' || hinum == num)
        t.value = num;

    window.scroll(0, 0);
}

function format_transcript(s)
{
    //Fix < and >
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')

    //Fix newlines
    s = s.replace(/\n/g, '<br>\n');

    //Add extra breaks before bracketed sections
    s = s.replace(/[[]{2}/g, '<br>\n[[');

    //Remove alt text from transcript
    s = s.replace(/{.*}/g, '');

    return s;
}

function setnum(delta)
{
    var num = ById("inum");

    if (num.value)
        num.value = num.value - 0 + delta;
    build_script(num.value);
}

function random()
{
    var n, num = ById("inum");

    do n = Math.floor(1 + Math.random() * hinum);
    while (valid_num(n) != '');
    num.value = n;
    build_script(num.value);
}
