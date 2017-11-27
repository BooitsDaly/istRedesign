function myXHR(t,d) {
	var lo = 0;
	return $.ajax({
		type:t,  
		cache:false,
		async:true,
		dataType:'json', 
		url:'proxy.php',
		data:d,
		beforeSend:function(){
			// happens before sending info -- loading screen
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
		//failures
		console.log('Failure with '+d.path);
	});
} //end myXHR


$(document).ready(function(){

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
             speed: 150,
             breakLines: false,
             autoStart: false,
             startDelay: 1000
        });
    });
    //get all the undergrad degrees
    myXHR('get', {'path':'/degrees/undergraduate'}).done(function(json){
        var x = '';
        var y = '<h3 class="center-align"> Undergraduate Degrees </h3>';
        $('#undergraduate').html(y);

        x += '<div class="row">';
        $.each(json.undergraduate, function(i, item){	    
             x += '<div class="col s4 flip">';
                x += '<div class="front">';
                    x += '<h5 class="black-text center-align">' + item.title + '</h5>';
                    x += '<p class="black=text center-align"> aka: ' + item.degreeName + '</p>';
                x += '</div>';
                x += '<div class="back">';
                    x += '<p class="white=text center-align"> Description: ' + item.description + '</p>';
                    x += '<p class="white=text center-align"> Concentrations: ' + item.concentrations + '</p>';
                x += '</div>';
              x +='<br></div>';

        });
        x += '</div>';
        $('#undergraduate').append(x); 
        $('#undergraduate').append('<div class="divider"></div>');

        //function to give the hover value a trigger option
        $(function(){
                $(".flip").flip({
                    trigger: 'hover'
                });
            });
    });

    //get all the grad degrees
    myXHR('get', {'path':'/degrees/graduate'}).done(function(json){
        var x = '';
        var y = '<h3 class="center-align"> Graduate Degrees </h3>';
        $('#graduate').html(y);


        x += '<div class="row">';
        $.each(json.graduate, function(i, item){
            if(! (item.degreeName == 'graduate advanced certificates') ){
                 x += '<div class="col s4 flip">';
                    x += '<div class="front">';
                        x += '<h5 class="black-text center-align">' + item.title + '</h5>';
                        x += '<p class="black=text center-align"> aka: ' + item.degreeName + '</p>';
                    x += '</div>';
                    x += '<div class="back">';
                        x += '<p class="white=text center-align"> Description: ' + item.description + '</p>';
                        x += '<p class="white=text center-align"> Concentrations: ' + item.concentrations + '</p>';
                    x += '</div>';
                  x +='<br></div>';
             }

        });
        x += '</div>';
        $('#graduate').append(x); 
        $('#graduate').append('<div class="divider"></div>');

        //function to give the hover value a trigger option
        $(function(){
            $(".flip").flip({
                trigger: 'hover'
            });
        });
    });

    //get minors
    myXHR('get', {'path':'/minors/'}).done(function(json){
        var x='';
        var y ='<h1>Minors</h1>';
        $('#minors').html(y);   

        //for each loop
        x += '<div class="row">';
        $.each(json.UgMinors,function(i,item){

                x+='<div class="col s6">';
                    x+='<div class="card">';
                        x+='<div class="card-content white-text">';
                        x+='<span class="card-title">'+item.title+'</span>';
                        x+='<p>'+item.name+'</p>';
                        x+='<p>'+item.description+'</p>';
                        x+='<h4>Concentrations</h4>';
                        x+='<ul>';
                        //for each loop
                        $.each(item.courses,function(j,item2){
                            x+='<li>'+item2+'</li>';
                        });
                    x+='</ul></div>';
            x += '</div></div>'
        });
        x += '</div>';

    $('#minors').append(x);
    });

    //get employment introduction, table and stats
    myXHR('get', {'path':'/employment/'}).done(function(json){
        var x=''; 
        var y=''; 
        var z=''; 

        //get employment intro - intro typeit
        x+='<h1 class="typeIntro"></h1>';
        x+='<div id="empIntroContent">';
        $.each(json.introduction.content,function(i,item){
            x+='<h3>'+item.title+'</h3>';
            x+='<p>'+item.description+'</p>';
        });
        x+='</div>';
        x+='</div>';

        x+='<div id="empIntroBoxes row">';
        //for each employers
        x+='<div class="empIntroBoxes left col s6">';
        x+='<h2>'+json.employers.title+'</h2>';
        x+='<ul>';
        $.each(json.employers.employerNames,function(i,item){
            x+='<li>'+item+'</li>';
        });
        x+='</ul>';
        x+='</div>';

        //careers
        x+='<div class="empIntroBoxes right col s6">';
        x+='<h2>'+json.careers.title+'</h2>';
        x+='<ul>';
        $.each(json.careers.careerNames,function(i,item){
            x+='<li>'+item+'</li>';
        });
        x+='</ul>';
        x+='</div>';
        x+='<div></div>';
        x+='</div>';

        //coop table
        y+='<h2 id="tableHeader">'+json.coopTable.title+'</h2>';
        y+='<table id="empTable" class="tables"><thead>';
        y+='<tr><th>Employer</th>';
        y+='<th>Degree</th>';
        y+='<th>Location</th>';
        y+='<th>Term</th></tr>';
        y+='</thead><tbody>';

        var cnt = 0;
        $.each(json.coopTable.coopInformation,function(i,item){
            y+='<tr><td>'+item.employer+'</td>';
            y+='<td>'+item.degree+'</td>';
            y+='<td>'+item.city+'</td>';
            y+='<td>'+item.term+'</td></tr>';
            cnt++;
        });
        y+='</tbody></table>';

        var col=0;
        //for each degreeStatistics
        z+='<div id="empIntroContent">';
        $.each(json.degreeStatistics.statistics,function(i,item){
            z += '<div id="'+ col +'this"class=boxes>';
                z+='<h3>'+item.value+'</h3>';
                z+='<p>'+item.description+'</p></div>';
            col++;
        });
        z+='</div>';

        $('#employment-into').html(x);
        $('#employment-table').prepend(y);
        $('#employment-stats').html(z);

        //create the typing effect for the title
        $('#typeIntro').typeIt({
             strings: ["Great Academics", "set students up for great careers", json.introduction.title],
             speed: 200,
             breakLines: false,
             autoStart: false,
             startDelay: 5000
        });
        //pagintation for materialize
          $('#empTable').pageMe({
            pagerSelector:'#myPager',
            prevText:'',
            nextText:'',
            showPrevNext:true,
            hidePageNumbers:true,
            perPage:5
          });
        $("#total").html(cnt+" Total Entries");

    });

    //get employment table
    myXHR('get', {'path':'/employment/'}).done(function(json){
        var x='';
        var cnt = 0;

        //employment table
        x+='<h2>'+json.employmentTable.title+'</h2>';
        x+='<table id="coopTable" class="tables"><thead>';
        x+='<tr><th>Employer</th>';
        x+='<th>Degree</th>';
        x+='<th>Location</th>';
        x+='<th>Job Title</th>';
        x+='<th>Start Date</th></tr>';
        x+='</thead><tbody>';
        $.each(json.employmentTable.professionalEmploymentInformation,function(i,item){
            x+='<tr><td>'+item.employer+'</td>';
            x+='<td>'+item.degree+'</td>';
            x+='<td>'+item.city+'</td>';
            x+='<td>'+item.title+'</td>';
            x+='<td>'+item.startDate+'</td></tr>';
            cnt++;
        });
        x+='</tbody></table>';

        $('#employment-coop').prepend(x);
        //pagintation for materialize
          $('#coopTable').pageMe({
            pagerSelector:'#myPager2',
            prevText:'',
            nextText:'',
            showPrevNext:true,
            hidePageNumbers:true,
            perPage:5
          });
        $("#total2").html(cnt+" Total Entries");

    });

    //get people -- get faculty and staff place in model
    myXHR('get', {'path':'/people/'}).done(function(json){
        //set all the variables
        var x='';
        var y='';
        var cnt= 0;

        //for faculty
        x += '<h1>Our Faculty</h1>';
        $('#faculty').html(x);
        x = '';

        //loop through each faculty place into modal and then reset
        $.each(json.faculty,function(i,item){
            //create trigger for modals
             x += '<a class="waves-effect waves-light btn modal-trigger" href="#modal'+ cnt +'">'+ item.name +'</a>';
            //make modals
            x += '<div id="modal' + cnt +'" class="modal modal-fixed-footer">';
                x += '<div class="modal-content center-align">';
                    x+='<div><h3>'+item.name+'</h3>';
                    x+='<img src="'+item.imagePath+'">';
                    x+='<p>Title: '+item.title+'</p>';
                    x+='<quoteblock>Quote: '+item.tagline+'</quoteblock>';
                    x+='<p>Interst Area: '+item.interestArea+'</p>';
                    x+='<p>Office: '+item.office+'</p>';
                    x+='<p>Website: '+item.website+'</p>';
                    x+='<p>Phone: '+item.phone+'</p>';
                    x+='<p>Email: '+item.email+'</p></div>';
                x+='</div>';
            x+='</div>';
            $('#faculty').append(x);
            x='';
            cnt++
        });



        //for faculty
        y += '<h1>Our Staff</h1>';
        $('#staff').html(y);
        y = '';

        //loop through each faculty place into modal and then reset
        $.each(json.staff,function(i,item){
            y += '<a class="waves-effect waves-light btn modal-trigger" href="#modal'+ cnt +'">'+ item.name +'</a>';
            y += '<div id="modal' + cnt +'" class="modal modal-fixed-footer">';
                y += '<div class="modal-content center-align">';
                    y +='<div><h3>'+item.name+'</h3>';
                    y +='<img src="'+item.imagePath+'">';
                    y +='<p>Title: '+item.title+'</p>';
                    y +='<quoteblock> Quote:'+item.tagline+'</quoteblock>';
                    y +='<p>Interest Area: '+item.interestArea+'</p>';
                    y +='<p>Office: '+item.office+'</p>';
                    y +='<p>Website: '+item.website+'</p>';
                    y +='<p>Phone: '+item.phone+'</p>';
                    y +='<p>Email: '+item.email+'</p></div>';
                y+='</div>';
            y+='</div>';
            $('#staff').append(y);
            y='';
            cnt++;
        });
        $(document).ready(function(){
            $('.modal-trigger').leanModal();

      });

    });

    //get research
    myXHR('get', {'path':'/research/'}).done(function(json){
            var x='';
            var y = '';

            x+='<h1>Research Areas</h1>';
            $('#research').html(x);
            // setup accorian
            y += '<ul class="collapsible2 popout" data-collapsible="accordion">';  
                $.each(json.byInterestArea,function(i,item){
                    y += '<li>';
                    y+='<div class = "collapsible-header">'+item.areaName+'</div>';
                    y+='<div class="collapsible-body">';
                    $.each(item.citations,function(j,item2){
                        y+='<p>'+item2+'</p>';
                    });
                    y+='</div>';
                    y += '</li>';
                });

        y += '</ul>';
        $('#research').append(y);
        $(document).ready(function(){
            $('.collapsible2').collapsible({
                accordion: true
            });
        });
    });

    //get resources
    myXHR('get', {'path':'/resources/'}).done(function(json){
        var x=''; 
        var y ='';

        //resources
        x+='<h2>'+json.title+'</h2>';
        x+='<blockquote>'+json.subTitle+'</bloackquote>';
        $('#resources').html(x);
        // setup accorian
        y += '<ul class="collapsible popout" data-collapsible="accordion">';

            //study abroad
            y += '<li>';
                y+='<div class = "collapsible-header">'+json.studyAbroad.title+'</div>';
                    y+='<div class="collapsible-body">';
                        $.each(json.studyAbroad.places,function(i,item){       
                            y += '<p>' + item.nameOfPlace+'</p>';
                            y += '<p>' + item.description+'</p>'; 
                        });
                y+='</div>';
            y += '</li>';

            //student services
            y += '<li>';
                y+='<div class = "collapsible-header">'+json.studentServices.title+'</div>';
                    y+='<div class="collapsible-body">';
                        $.each(json.studentServices,function(i,item){       
                            // academic 
                            if(item.title=="Academic Advisors"){
                                y+='<p>'+item.title+'</p>';
                                y+='<p>'+item.description+'</p><hr/>';

                            }
                            //professional 
                            if(item.title=="Professonal Advisors"){
                                y+='<p>'+item.title+'</p>';
                                $.each(item.advisorInformation,function(i,item2){
                                    y+='<p>'+item2.name+'</p>';
                                    y+='<p>'+item2.department+'</p>';
                                    y+='<p>'+item2.email+'</p><hr/>';
                                });
                            }
                            //faculty 
                            if(item.title=="Faculty Advisors"){
                                y+='<p>'+item.title+'</p>';
                                y+='<p>'+item.description+'</p><hr/>';
                            }
                            //minor 
                            if(item.title=="IST Minor Advising"){
                                y+='<p>'+item.title+'</p>';
                                $.each(item.minorAdvisorInformation,function(i,item2){
                                    y+='<p>'+item2.title+'</p>';
                                    y+='<p>'+item2.advisor+'</p>';
                                    y+='<p>'+item2.email+'</p><hr/>';
                                });
                            } 
                        });
                y+='</div>';
            y += '</li>';

            //tutoring and lab information
            y += '<li>';
                y+='<div class = "collapsible-header">'+json.tutorsAndLabInformation.title+'</div>';
                    y+='<div class="collapsible-body">';    
                        y += '<p>' + json.tutorsAndLabInformation.description+'</p>';
                        y += '<a class="center-align" href="'+json.tutorsAndLabInformation.tutoringLabHoursLink+'">Tutoring and Lab Hours</a>'; 
                y+='</div>';
            y += '</li>';

            //forms
            y += '<li>';
                y+='<div class = "collapsible-header">Forms</div>';
                    y+='<div class="collapsible-body">';    
                       //grad
                        y += '<h3> Graduate Forms</h3>';
                       $.each(json.forms.graduateForms,function(i,item){
                          y+='<p><a href="'+item.href+'">'+item.formName+'</a></p>';
                       });
                        y += '<hr/>';
                       //undergrad
                        y += '<h3> Undergraduate Forms</h3>';
                       $.each(json.forms.undergraduateForms,function(i,item){
                           y+='<p><a href="'+item.href+'">'+item.formName+'</a></p>';
                       });
                y+='</div>';
            y += '</li>';

            //student ambass 
            y += '<li>';
                y+='<div class = "collapsible-header">'+json.studentAmbassadors.title+'</div>';
                    y+='<div class="collapsible-body">';    
                        $.each(json.studentAmbassadors.subSectionContent,function(i,item){
                            y+='<p>'+item.title+'</p>';
                            y+='<p>'+item.description+'</p>';
                        });
                        y+='<img class="center-align" src="'+json.studentAmbassadors.ambassadorsImageSource+'"/>';
                y+='</div>';
            y += '</li>';

            //coop enroll
            y += '<li>';
                y+='<div class = "collapsible-header">'+json.coopEnrollment.title+'</div>';
                    y+='<div class="collapsible-body">';    
                        $.each(json.coopEnrollment.enrollmentInformationContent,function(i,item){
                            y+='<p>'+item.title+'</p>';
                            y+='<p>'+item.description+'</p>';
                        });
                        y+='<a class="center-align" href="'+json.coopEnrollment.RITJobZoneGuideLink+'">RIT Job Zone Guide</a>';
                y+='</div>';
            y += '</li>';    

        y += '</ul>';
        $('#resources').append(y);
        $(document).ready(function(){
            $('.collapsible').collapsible({
                accordion: true
            });
      });

    });

    //get news
    myXHR('get', {'path':'/news/'}).done(function(json){
            var x='';
            var y = '';

            x+='<h1>News</h1>';
            $('#newsHeader').html(x);
            // setup accorian
            y += '<ul class="collapsible3 popout" data-collapsible="accordion">'; 
                    $.each(json.year,function(i,item){
                        y += '<li>';
                            y+='<div class = "collapsible-header">'+item.title+'</div>';
                                y+='<div class="collapsible-body">';
                                    y+='<p>'+item.date+'</p>';
                                    y+='<p>'+item.description+'</p></tr>';
                                 y+='</div>';
                        y += '</li>';
                    }); 
                    $.each(json.older,function(i,item){
                        y += '<li>';
                            y+='<div class = "collapsible-header">'+item.title+'</div>';
                                y+='<div class="collapsible-body">';
                                    y+='<p>'+item.date+'</p>';
                                    y+='<p>'+item.description+'</td></p>';
                                 y+='</div>';
                        y += '</li>';
                    });    
        y += '</ul>';
        $('#news').append(y);
        $(document).ready(function(){
            $('.collapsible3').collapsible({
                accordion: true
            });
        });
    });

    //get footer
    myXHR('get', {'path':'/footer/'}).done(function(json){
        //bottom of the page footer
        var x='<div class="container">';
            x+= '<div class="row">';
            x+='<div class="col s6">';
              x+='<h4>'+json.social.title+'</h4>';
              x+='<p>'+json.social.by+'</p>';
              x+='<p>'+json.social.tweet+'</p>';
            x += '</div>';
            x+='<div class="col offset-6 s6">';
                x+='<ul>';
                    x+='<li><a href="'+json.social.twitter+'">Twitter</a></li>';
                    x+='<li><a href="'+json.social.facebook+'">Facebook</a></li>';
                    $.each(json.quickLinks, function(i,item){
                        x+='<li><a href="'+item.href+'">'+item.title+'</a></li>';
                    });
        x+='</ul></div></div>';
        x+='<div class="footer-copyright">';
            x+='<div class="container">';
                x+='<p>'+json.copyright.html+'</p>';
                x+= '<a class=" grey-text text-lighten-4 right">' + json.copyright.title + '</a>';
            x+='</div>';
        x+='</div>';


        $('.page-footer').html(x);
        });

});

