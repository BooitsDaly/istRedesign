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

//parallax function
$(document).ready(function(){
      $('.parallax').parallax();
    });

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
                x += '<h4 class="black=text center-align"> aka: ' + item.degreeName + '</h4>';
            x += '</div>';
            x += '<div class="back">';
                x += '<p class="white=text center-align"> Description: ' + item.description + '</p>';
                x += '<p class="white=text center-align"> Concentrations: ' + item.concentrations + '</p>';
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
                    x += '<h4 class="black=text center-align"> aka: ' + item.degreeName + '</h4>';
                x += '</div>';
                x += '<div class="back">';
                    x += '<p class="white=text center-align"> Description: ' + item.description + '</p>';
                    x += '<p class="white=text center-align"> Concentrations: ' + item.concentrations + '</p>';
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

//get minors
myXHR('get', {'path':'/minors/'}).done(function(json){
    var x='';
    var col=0;
    //var y ='<div class="row minors-row"></div>';
    //$('#minors').html(y);   

    //for each loop
    $.each(json.UgMinors,function(i,item){
       
            x+='<div class="col s10">';
                x+='<div class="card blue-grey">';
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
        col++;
        if(col==4){
            x+='</div>';
            col=0;
        }
    });

$('#minors').append(x);
});

//get employment introduction, table and stats
myXHR('get', {'path':'/employment/'}).done(function(json){
    var x=''; //Employment Intro
    var y=''; //Coop Table
    var z=''; //Degree Stats

    //get employment intro - intro typeit
    x+='<h1 class="typeIntro"></h1>';
    x+='<div id="empIntroContent">';
    $.each(json.introduction.content,function(i,item){
        x+='<h3>'+item.title+'</h3>';
        x+='<p>'+item.description+'</p>';
    });
    x+='</div>';
    x+='</div>';

    x+='<div id="empIntroBoxes">';
    //for each employers
    x+='<div class="empIntroBoxes left">';
    x+='<h2>'+json.employers.title+'</h2>';
    x+='<ul>';
    $.each(json.employers.employerNames,function(i,item){
        x+='<li>'+item+'</li>';
    });
    x+='</ul>';
    x+='</div>';

    //careers
    x+='<div class="empIntroBoxes right">';
    x+='<h2>'+json.careers.title+'</h2>';
    x+='<ul>';
    $.each(json.careers.careerNames,function(i,item){
        x+='<li>'+item+'</li>';
    });
    x+='</ul>';
    x+='</div>';
    x+='<div class="clearfix"></div>';
    x+='</div>';

    //coop table
    y+='<h2>'+json.coopTable.title+'</h2>';
    y+='<table id="coopTable" class="tables"><thead>';
    y+='<tr><th>Employer</th>';
    y+='<th>Degree</th>';
    y+='<th>Location</th>';
    y+='<th>Term</th></tr>';
    y+='</thead><tbody>';
    $.each(json.coopTable.coopInformation,function(i,item){
        y+='<tr><td>'+item.employer+'</td>';
        y+='<td>'+item.degree+'</td>';
        y+='<td>'+item.city+'</td>';
        y+='<td>'+item.term+'</td></tr>';
    });
    y+='</tbody></table>';

    var col=0;
    //for each degreeStatistics
    z+='<div id="statBoxes">';
    $.each(json.degreeStatistics.statistics,function(i,item){
        if(col==0){
            z+='<div id="statBoxRow">';
            z+='<div class="degreeStat hover statLeft">';
        }
        if(col==1){
            z+='<div class="degreeStat hover statRight">';
        }
        z+='<h3>'+item.value+'</h3>';
        z+='<p>'+item.description+'</p></div>';
        col++;
        if(col==2){
            z+='<div class="clearfix"></div>';
            z+='</div>';
            col=0;
        }
    });
    z+='<div class="clearfix"></div>';
    z+='</div>';

    $('#employment-into').html(x);
    $('#employment-table').html(y);
    $('#employment-stats').html(z);

    //create the typing effect for the title
    $('#typeIntro').typeIt({
         strings: ["Great Academics", "set students up for great careers", json.introduction.title],
         speed: 10,
         breakLines: false,
         autoStart: false
    });
});

//get employment table
//myXHR('get', {'path':'/employment/'}).done(function(json){
//    var y='';
//
//    //employment table
//    y+='<h2>'+json.employmentTable.title+'</h2>';
//    y+='<table id="employmentTable" class="tables"><thead>';
//    y+='<tr><th>Employer</th>';
//    y+='<th>Degree</th>';
//    y+='<th>Location</th>';
//    y+='<th>Job Title</th>';
//    y+='<th>Start Date</th></tr>';
//    y+='</thead><tbody>';
//    $.each(json.employmentTable.professionalEmploymentInformation,function(i,item){
//        y+='<tr><td>'+item.employer+'</td>';
//        y+='<td>'+item.degree+'</td>';
//        y+='<td>'+item.city+'</td>';
//        y+='<td>'+item.title+'</td>';
//        y+='<td>'+item.startDate+'</td></tr>';
//    });
//    y+='</tbody></table>';
//
//    $('#employmentTableDiv').html(y);
//    employmentTable();
//});

//get faculty and staff place in model
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
         x += '<a class="waves-effect waves-light btn modal-trigger" href="#modal'+ cnt +'">Modal'+ cnt +'</a>';
        //make modals
        x += '<div id="modal' + cnt +'" class="modal modal-fixed-footer">';
            x += '<div class="modal-content">';
                x+='<div><h3>'+item.name+'</h3>';
                //x+='<img src="'+item.imagePath+'">';
                x+='<p>'+item.title+'</p>';
                x+='<p>'+item.tagline+'</p>';
                x+='<p>'+item.interestArea+'</p>';
                x+='<p>'+item.office+'</p>';
                x+='<p>'+item.website+'</p>';
                x+='<p>'+item.phone+'</p>';
                x+='<p>'+item.email+'</p></div>';
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
        y += '<a class="waves-effect waves-light btn modal-trigger" href="#modal'+ cnt +'">Modal'+ cnt +'</a>';
        y += '<div id="modal' + cnt +'" class="modal modal-fixed-footer">';
            y += '<div class="modal-content">';
                y +='<div><h3>'+item.name+'</h3>';
                //y +='<img src="'+item.imagePath+'">';
                y +='<p>'+item.title+'</p>';
                y +='<p>'+item.tagline+'</p>';
                y +='<p>'+item.interestArea+'</p>';
                y +='<p>'+item.office+'</p>';
                y +='<p>'+item.website+'</p>';
                y +='<p>'+item.phone+'</p>';
                y +='<p>'+item.email+'</p></div>';
            y+='</div>';
        y+='</div>';
        $('#staff').append(y);
        y='';
        cnt++;
    });
    
    
});

//get research
//myXHR('get', {'path':'/research/'}).done(function(json){
//		var x='';
//		
//		//for each loop
//		x+='<h1>Research Areas</h1>';
//		x+='<div id="accordion">';
//		$.each(json.byInterestArea,function(i,item){
//			x+='<h3>'+item.areaName+'</h3>';
//			x+='<div><ul>';
//			//for each loop
//			$.each(item.citations,function(j,item2){
//				x+='<li>'+item2+'</li>';
//			});
//			x+='</ul></div>';
//		});
//		x+='</div>';
//		
//		$('#research').html(x);
//		$('#accordion').accordion();
//	});

//get resources
//myXHR('get', {'path':'/resources/'}).done(function(json){
//    var a=''; //study abroad
//    var b=''; //advising
//    var c=''; //tutors/lab
//    var d=''; //ambassadors
//    var e=''; //forms
//    var f=''; //coops
//    var g=''; //news		
//
//    var x=''; //titles
//
//    //resources
//    x+='<h1>'+json.title+'</h1>';
//    x+='<h2>'+json.subTitle+'</h2>';
//
//    //study abroad
//    var ct = 0;
//    a+='<h2>'+json.studyAbroad.title+'</h2>';
//    a+='<p>'+json.studyAbroad.description+'</p>';
//    $.each(json.studyAbroad.places,function(i,item){
//        if(ct == 0){
//            a+='<div class="left studyAbroad">';
//        }
//        if(ct == 1){
//            a+='<div class="right studyAbroad">';
//        }
//        a+='<h3>'+item.nameOfPlace+'</h3>';
//        a+='<p>'+item.description+'</p>';
//        a+='</div>';
//        ct++;
//    });
//
//
//    var b1='';
//    //advising
//    b+='<h1>'+json.studentServices.title+'</h1>';
//    b+='<div id="advisingTop"></div>';
//    $.each(json.studentServices,function(i,item){
//        // academic advisors
//        if(item.title=="Academic Advisors"){
//            b1+='<div class="left advising">';
//            b1+='<h2>'+item.title+'</h2>';
//            b1+='<p>'+item.description+'</p>';
//            b1+='</div>';
//        }
//        //professional advisors
//        if(item.title=="Professonal Advisors"){
//            b+='<h2>'+item.title+'</h2>';
//            $.each(item.advisorInformation,function(i,item2){
//                b+='<h3>'+item2.name+'</h3>';
//                b+='<h4>'+item2.department+'</h4>';
//                b+='<h4>'+item2.email+'</h4><hr/>';
//            });
//        }
//        //faculty advisors
//        if(item.title=="Faculty Advisors"){
//            b1+='<div class="right advising">';
//            b1+='<h2>'+item.title+'</h2>';
//            b1+='<p>'+item.description+'</p>';
//            b1+='</div>';
//            b1+='<div class="clearfix"></div>';
//        }
//        //minor advising
//        if(item.title=="IST Minor Advising"){
//            b+='<h2>'+item.title+'</h2>';
//            $.each(item.minorAdvisorInformation,function(i,item2){
//                b+='<h3>'+item2.title+'</h3>';
//                b+='<h4>'+item2.advisor+'</h4>';
//                b+='<h4>'+item2.email+'</h4><hr/>';
//            });
//        }
//    });
//
//    //tutoring and lab info
//    c+='<h2>'+json.tutorsAndLabInformation.title+'</h2>';
//    c+='<p>'+json.tutorsAndLabInformation.description+'</p>';
//    c+='<a href="'+json.tutorsAndLabInformation.tutoringLabHoursLink+'">Tutoring and Lab Hours</a>';
//
//    //student ambassadors
//    d+='<h2>'+json.studentAmbassadors.title+'</h2>';
//    d+='<img src="'+json.studentAmbassadors.ambassadorsImageSource+'"/>';
//    $.each(json.studentAmbassadors.subSectionContent,function(i,item){
//        d+='<h3>'+item.title+'</h3>';
//        d+='<h4>'+item.description+'</h4>';
//    });
//    d+='<a href="'+json.studentAmbassadors.applicationFormLink+'">Student Ambassador Application Form</a>';
//    d+='<p>'+json.studentAmbassadors.note+'</p>';
//
//    //grad form
//    e+='<div id="gradForm" class="resource left forms">';
//    e+='<h2>Graduate Forms</h2>';
//    $.each(json.forms.graduateForms,function(i,item){
//        e+='<h4><a href="'+item.href+'">'+item.formName+'</a></h4>';
//    });
//    e+='</div>';
//
//    //ug form
//    e+='<div id="ugForm" class="resource right forms">';
//    e+='<h2>Undergraduate Forms</h2>';
//    $.each(json.forms.undergraduateForms,function(i,item){
//        e+='<h4><a href="'+item.href+'">'+item.formName+'</a></h4>';
//    });
//    e+='</div>';
//
//    //coop enrollment
//    f+='<h2>'+json.coopEnrollment.title+'</h2>';
//    $.each(json.coopEnrollment.enrollmentInformationContent,function(i,item){
//        f+='<h3>'+item.title+'</h3>';
//        f+='<h4>'+item.description+'</h4>';
//    });
//    f+='<a href="'+json.coopEnrollment.RITJobZoneGuideLink+'">RIT Job Zone Guide</a>';
//
//    $('#resourceHead').html(x);
//    $('#studyabroad').html(a);
//    $('#advising').html(b);
//    $('#tutors').html(c);
//    $('#ambassadors').html(d);
//    $('#forms').html(e);
//    $('#coop').html(f);
//    $('#advisingTop').html(b1);
//
//    resourceTabs();
//});

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