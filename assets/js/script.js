function myXHR(t,d) {
	var lo = 0;
	return $.ajax({
		type:t,  //get or post
		cache:false,  //if info changes, dont cache
		async:true,
		dataType:'json', //needs capital T
		url:'proxy.php',
		data:d,
		beforeSend:function(){
			// happens before sending info
			
			// creates a loading screen until data finishes loading
			var x='';
			x+='<div id="spinner" style="width:100%;position:absolute;top:0;padding:40em 40em;text-align:center;background:#C7C3BD;">' ;
			x+='<img src="assets/images/gears.gif" style="position:relative;margin:10em auto;z-index:200000;" alt="spinner">';
			x+='</div>';
			
			//adds loading screen
			$(document.body).attr("style", 'overflow-x: hidden;');
			$(x).appendTo("body");
			$(document).scrollTop(0);
		}
	}).always(function(){
		//happens at end, no matter what
		//removes loading screen, brings user to top
		$('#spinner').remove();
		$(document).scrollTop(0);
	}).fail(function(){
		//handles failures
		console.log('Failure with '+d.path);
	});
} //end myXHR

//get the about section
myXHR('get', {'path':'/about/'}).done(function(json){
	    
    var x = '<div class= "section">';
    x +='<h3 id="typeTitle"></h3>';
    x+='<p>'+json.description+'</p>';
    x += '</div> <div class="divider"></div> <div class="section">';
    x+='<blockquote>"'+json.quote+'"</blockquote>';
    x+='<p>-'+json.quoteAuthor+'</p>';
    x +='</div> <div class="divider">';
    x += '</div>';
    $('#about').html(x);

    //create the typing effect for the title
    $('#typeTitle').typeIt({
         strings: ["RIT ISTE Department", json.title],
         speed: 50,
         breakLines: false,
         autoStart: false
    });
});

//get all the undergrad degrees
myXHR('get', {'path':'/degrees/undergraduate'}).done(function(json){
    var y = '<h3 class="center-align"> Undergraduate Degrees </h3>';
    $('#undergraduate').html(y);
    $.each(json.undergraduate, function(i, item){	    
         var x = '<div class="flip">';
            x += '<div class="front">';
                x += '<h4 class="black-text center-align">' + item.title + '</h4>';
                x += '<h4 class="black=text center-align"> AKA:' + item.degreeName + '</h4>';
            x += '</div>';
            x += '<div class="back">';
                x += '<p class="white=text center-align"> Description:' + item.description + '</p>';
                x += '<p class="white=text center-align"> Concentrations:' + item.concentrations + '</p>';
            x += '</div>';
		$('#undergraduate').append(x);
        //function to give the hover value a trigger option
        $(function(){
            $(".flip").flip({
                trigger: 'hover'
            });
        });
    });
    $('#undergraduate').append('<br></div> <div class="divider">');
});

//get all the grad degrees
myXHR('get', {'path':'/degrees/graduate'}).done(function(json){
    var y = '<h3 class="center-align"> Graduate Degrees </h3>';
    $('#graduate').html(y);
    $.each(json.graduate, function(i, item){	    
        if(!(item.degreeName == 'graduate advanced certificates')){
            var x = '<div class="flip">';
                x += '<div class="front">';
                    x += '<h4 class="black-text center-align">' + item.title + '</h4>';
                    x += '<h4 class="black=text center-align"> AKA:' + item.degreeName + '</h4>';
                x += '</div>';
                x += '<div class="back">';
                    x += '<p class="white=text center-align"> Description:' + item.description + '</p>';
                    x += '<p class="white=text center-align"> Concentrations:' + item.concentrations + '</p>';
                x += '</div>';
            
            $('#graduate').append(x);
            
            //function to give the hover value a trigger option
            $(function(){
                $(".flip").flip({
                    trigger: 'hover'
                });
            });
        }
    });
    $('#graduate').append('<br></div> <div class="divider">');
});

    