function loadThis(){
	//api:  http://www.ist.rit.edu/api/
	$(document).ready(function(){
		//ajax call
		$.ajax({
			type:'get',
			url:'proxy.php',
			data:{path:"/about/"},
            // GET proxy.php?path=/about/
            // POST proxy.php - path=/about/
			dataType:'json'
		}).done(function(json){
			//display data for the about section
            $('#about-title').append(json.title);
            $('#about-summary').append(json.description);
            //().append(json.quote);
		});//end of done
    });
}
