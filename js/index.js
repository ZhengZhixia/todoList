$(function(){
    var todos=[];
    if(localStorage.todo_data){
        todos=JSON.parse(localStorage.todo_data);
        render();
    }else{
        localStorage.todo_data=JSON.stringify(todos);
        render();
    }
    $('.add').on('click',function(){

        todos.push({title:' ',state:0,isDel:0});
        localStorage.todo_data=JSON.stringify(todos);
        $('.content-right').addClass('play');
        render();

    })

    function render(){
        $('.lists').empty();
        $.each(todos,function(i,v){
            $('<div class="list"><div class="list-left iconfont icon-jindu"></div><div class="list-li">'+v.title+'</div><div class="list-right"><input type="checkbox"></div></div>').appendTo($('.lists'));
            $('.list-li').eq(i).addClass(function(){
                if(v.state){
                    return 'done';
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
                $('.list-left').eq(i).removeClass('icon-jindu').addClass('icon-wancheng');
            }
            if (todos[i].state==0){
                $('.list-left').eq(i).removeClass('icon-wancheng').addClass('icon-jindu');
            }
        })
        $(this).css('transform','translate3d(0,0,0)')
    })
    $('.delete').on('touchstart',function () {
        $('input:checked ').each(function(i){
            var index=$(this).parents('.list').index();
            $(this).parents('.list').remove();
            todos.splice(index,1);
        });
        localStorage.todo_data=JSON.stringify(todos);
    })
    $('.lists').on('click','.list-li',function(){
        $('.reset').removeClass('reset');
        $(this).addClass('reset');
        $('.content-right').addClass('play');
        var text=$(this).text();
        $('.content-right input').attr('value',text);
    })
    $('.yes').on('touchend',function(){
        var text=$('.content-right input').val();
        if($('.reset').length==0){
            var n=$('.list-li').length-1;
            $('.list-li').eq(n).addClass('reset')
        }
        var index= $('.list-li').index($('.reset'));
        $('.reset').get(0).innerHTML=text;
        $('.reset').removeClass('reset');
        $('.content-right').removeClass('play');
        $('.content-right input').attr('value','');
        todos[index].title=text;
        localStorage.todo_data=JSON.stringify(todos);
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
    })
})