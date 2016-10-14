$(function(){
    var todos=[];
    var indexs;
    if(localStorage.todo_data){
        todos=JSON.parse(localStorage.todo_data);
        indexs=todos.length!=0?todos[todos.length-1].indexs:-1;
        render();
    }else{
        localStorage.todo_data=JSON.stringify(todos);
        indexs=-1;
        render();
    }

    $('.add').on('click',function(){
        indexs++;
        todos.push({title:' ',state:0,isDel:0,indexs:indexs});
        localStorage.todo_data=JSON.stringify(todos);
        $('.content-right').addClass('play');
        render();

    })

    function render(){
        $('.lists').empty();
        $.each(todos,function(i,v){
            $('<div class="list " indexs="'+v.indexs+'"><div class="list-left iconfont1 "></div><div class="list-li">'+v.title+'</div><div class="list-right"><input type="checkbox"></div></div>').appendTo($('.lists'));
            $('.lists .list-li').eq(i).addClass(function(){
                if(v.state){
                    return 'done';
                }
            })
            $('.lists .list-left').eq(i).addClass(function(){
                if(v.state){
                    return "icon-wancheng";
                }else{
                    return 'icon-weiwancheng-copy';
                }
            })
        })
    }
    var left=null;
    $('.lists').on("touchstart",'.list',function (e) {
        left=e.originalEvent.changedTouches[0].pageX;
    })
    $('.lists').on('touchmove','.list',function(e){
        var n=e.originalEvent.changedTouches[0].pageX;
        var x=n-left;
        $(this).css('transition','transform .8s ease');
        $(this).css('transform','translate3d('+x+'px,0,0)')
    })
    var m=null;
    $('.lists').on("touchend",'.list',function (e) {
        m=e.originalEvent.changedTouches[0].pageX;
        if (m-left>40){
            $(this).find('.list-li').addClass('done');
            todos[$(this).index()].state=1;
            localStorage.todo_data=JSON.stringify(todos);
        }
        if (m-left<-40){
            $(this).find('.list-li').removeClass('done');
            todos[$(this).index()].state=0;
            localStorage.todo_data=JSON.stringify(todos);
        }
        $.each(todos,function(i,v){
            if (todos[i].state==1){
                $('.list-left').eq(i).removeClass('icon-weiwancheng-copy').addClass('icon-wancheng');
            }
            if (todos[i].state==0){
                $('.list-left').eq(i).removeClass('icon-wancheng').addClass('icon-weiwancheng-copy');
            }
        })
        $(this).css('transform','translate3d(0,0,0)')
    })
    $('.delete').on('touchstart',function () {
        $('input:checked ').each(function(i){
            var index=$(this).parents('.list').attr('indexs');
            $(this).parents('.list').remove();
            $.each(todos,function(i,v){
                if(v.indexs==index){
                    index=i;
                }
            })
            todos.splice(index,1);
        });
        localStorage.todo_data=JSON.stringify(todos);
        render();
    })
    $('.lists').on('click','.list-li',function(){
        $('.reset').removeClass('reset');
        $(this).addClass('reset');
        $('.content-right').addClass('play');
        var text=$(this).text();
        $('.content-right input').attr('value',text);
    })
    $('.content-right .yes').on('touchend',function(){
        var text=$('.content-right input').val();
        if($('.reset').length==0){
            var n=$('.lists .list-li').length-1;
            $('.lists .list-li').eq(n).addClass('reset')
        }
        var index= $('.lists .list-li').index($('.reset'));
        $('.reset').get(0).innerHTML=text;
        $('.reset').removeClass('reset');
        $('.content-right').removeClass('play');
        $('.content-right input').attr('value','');
        todos[index].title=text;
        localStorage.todo_data=JSON.stringify(todos);
        $('.header .bottom .no').triggerHandler('touchstart');
    })
    $('.return').on('touchend',function(){
        $('.content-right').removeClass('play');
        if($('.reset').length==0){
            var n=$('.list-li').length-1;

            $('.list-li').eq(n).parents('.list').remove();
            todos.splice(n,1);
            localStorage.todo_data=JSON.stringify(todos);
        }
    })
    $('.more').on('touchend',function(){
        $('.done').each(function(i,v){
            $(this).parents('.list').remove();
            var index=$('.done').index($(this));
            todos.splice(index,1);
            localStorage.todo_data=JSON.stringify(todos);
        })
        $('.header .bottom .yes').triggerHandler('touchstart');
    })

    $('.header .bottom >div').each(function(i,v){
       $(this).on("touchstart",function(){
           $('.plays').removeClass('plays')
           $(this).addClass('plays');
       })
    })

    $('.header .bottom .all').on('touchstart',function () {
        $('.isshow').removeClass('show');
        $('.lists').addClass('show');
        render();
    });

    $('.header .bottom .no').on("touchstart",function(){
        $('.nos-lists').empty();
        $('.isshow').removeClass('show');
        $('.nos-lists').addClass('show');
        nos=[];
        $.each(todos,function (i,v) {
            if(v.state==0){
                nos.push(v);
            }
        });
        localStorage.nos_data=JSON.stringify(todos);
        $.each(nos,function(i,v){
            $('<div class="list" indexs="'+v.indexs+'"><div class="list-left iconfont1 icon-weiwancheng-copy"></div><div class="list-li">'+v.title+'</div><div class="list-right"><input type="checkbox"></div></div>').appendTo($('.nos-lists'));
        })
    });

    $('.header .bottom .yes').on("touchstart",function(){
        $('.yes-lists').empty();
        $('.isshow').removeClass('show');
        $('.yes-lists').addClass('show');
        yes=[];
        $.each(todos,function (i,v) {
            if(v.state==1){
                yes.push(v);
            }
        });
        localStorage.yes_data=JSON.stringify(todos);
        $.each(yes,function(i,v){
            $('<div class="list" indexs="'+v.indexs+'"><div class="list-left iconfont1 icon-wancheng"></div><div class="list-li">'+v.title+'</div><div class="list-right"><input type="checkbox"></div></div>').appendTo($('.yes-lists'));
        })
    })
})