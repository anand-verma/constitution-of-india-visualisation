var hindu = {};
hindu.Constitution = function (option) {
	var that = this
		,	is_heatmap = false;
	this.execute = function () {
		$.getJSON("data/amendments.json",function (data) {
			$.getJSON("data/data.json",function (data1) {
				that.render(data,data1);
			})
		})
	}
	var getParameterByName = function (name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		    results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	var fetchUrl = function () {
		if(getParameterByName('year').length !== 0) {
			var years = getParameterByName('year').split('-');
			var id = "#year_" + parseInt(years[0].substr(2,2)) + "_" + parseInt(years[1].substr(2,2))
			$(id).trigger('click');
		} else if(getParameterByName('article').length !== 0) {
			var article = getParameterByName('article');
			var id = "#article_" + article.toLowerCase();
			$(id).trigger('click');
		} else if(getParameterByName('schedule').length !== 0) {
			var schedule = getParameterByName('schedule').split('-');
			var id = "#sched_" + schedule;
			$(id).trigger('click');
		} else if(getParameterByName('amendment').length !== 0) {
			var amendment = getParameterByName('amendment');
			var id = ".list_class#" + (parseInt(amendment)-1) + " .amendments";
			$(id).trigger('click');
		}
	}
	this.render = function (data, full_data) {
		var html = ""
		, data_length = data.length;

		// Function to get the Maximam value in Array
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		// Function to get the Minimam value in Array
		Array.min = function( array ){
			return Math.min.apply( Math, array );
		};

		for(var i = 0; i < data_length; i++) {
			html += '<li class="list-group-item list_class col-sm-12 col-without-padding" id="' + i + '"><div class="amendments col-sm-11 col-without-padding" id="'+i+'"><span id="tour_'+i+1+'">Amendment '+(i+1)+'</span></div><div class="badge col-sm-1 col-without-padding" id="' + i + '">+</div><br><span class="summary close" id="summary-' + i + '">' + data[i].summary + '<div class="pull-right"><a href="' + data[i].url + '" target="_blank">Read More</a></div></span></li>'
		}
		$('.list_group_class').html(html);

		// heatmap
		var remove_heatmap = function () {
		    $(".box").removeClass("remove_party_wise_color").removeClass("add_heatmap_color").css("opacity","1");
		};
		var layout_heatmap = function () {
		    if (!is_heatmap) {
						is_heatmap = true;
		        var arr_articles=[]
		        ,   uniq_articles=[]
		        ,   arr_sched=[]
		        ,   uniq_sched=[]
		        ,   count_with_articles=[]
		        ,   counts_of_articles_only=[]
		        ,   count_with_sched=[]
		        ,   counts_of_sched_only=[];

		        for (var i=0,len=full_data.length; i<len ; i++) {
		            if (full_data[i].type == "A") {
		            	(full_data[i].article == "")
		                arr_articles.push(full_data[i].article);
		            }
		            else {
		                arr_sched.push(full_data[i].article);
		            }
		        }
		        uniq_articles = jQuery.unique(arr_articles);
		        uniq_sched = jQuery.unique(arr_sched);

		        for (var j=0,l=uniq_articles.length ; j<l ; j++) {
		            var count = 0;
		            for (var i=0,len=full_data.length ; i<len ; i++) {
		                if (full_data[i].article == uniq_articles[j]) {
		                    count += 1;
		                }
		            }
		            count_with_articles.push({
		                article: uniq_articles[j],
		                count: count
		            });
		            counts_of_articles_only.push(count);
		        }
		        for (var j=0,l=uniq_sched.length ; j<l ; j++) {
		            var count = 0;
		            for (var i=0,len=full_data.length ; i<len ; i++) {
		                if (full_data[i].article == uniq_sched[j]) {
		                    count += 1;
		                }
		            }
		            count_with_sched.push({
		                schedule: parseInt(uniq_sched[j]),
		                count: count
		            });
		            counts_of_sched_only.push(count);
		        }

		        var max_article_count = Array.max(counts_of_articles_only)
		        ,   max_sched_count = Array.max(counts_of_sched_only)
		        ,   saturation_value = 0;

		        $('#parts_div .box, #schedules .box').addClass("remove_party_wise_color");
						var colorbrewer = function (domain) {
							if (domain <= 0.1) {
								return "#B8A1CF";
							} else if (domain <= 0.4) {
								return "#7743AB";
							} else {
								return "#3A1063";
							}
						}
		        for (var i=0,len=count_with_articles.length ; i<len ; i++) {
		            saturation_value = (count_with_articles[i].count / max_article_count);
		            saturation_value = saturation_value;
		            var select = (count_with_articles[i].article.length != 0 ? "#article_"+(count_with_articles[i].article.toLowerCase()) : "");
		            $(select).removeClass("remove_party_wise_color").removeClass("remove_heatmap_opacity").addClass("add_heatmap_color").addClass("add_heatmap_color").css("background-color", colorbrewer(saturation_value)).data("prev-fill",colorbrewer(saturation_value));
		        }
		        for (var i=0,len=count_with_sched.length ; i<len ; i++) {
		        	if (count_with_sched[i].schedule != null) {
		        		saturation_value = (count_with_sched[i].count / max_sched_count);
						saturation_value = saturation_value;
			            var select = (count_with_sched[i].schedule.length != 0 ? "#sched_"+parseInt(count_with_sched[i].schedule) : "");
			            $(select).removeClass("remove_party_wise_color").removeClass("remove_heatmap_opacity").addClass("add_heatmap_color").css("background-color", colorbrewer(saturation_value)).data("prev-fill",colorbrewer(saturation_value));
		        	}
		        }
		    }
		};
		layout_heatmap();

		$('.badge').on('click',function (event) {
			$('#reset').addClass('show_element');
			$('.article_coloring_legends').addClass('show_element');
			if (is_heatmap) {
				remove_heatmap();
				$(".articles_container .box").css("background-color", "");
				is_heatmap = false;
			}
			var id = this.id,yrid,year;
			$('.box').removeClass('select_effect');
			$('#parts_div .box, #schedules .box').removeClass('select_yellow_effect');
			$('#parts_div .box, #schedules .box').removeClass('select_green_effect');
			$('#parts_div .box, #schedules .box').removeClass('select_red_effect');
			$('.list_class').removeClass('list-select');
			if($('#summary-' + id).hasClass('close')) {
				$('.years_box').removeClass('select_effect');
				$('.summary').css('display','none');
				$('.summary').removeClass('open');
				$('.summary').addClass('close');
				$('.badge').html('+');
				var custom_data = _.where(full_data,{"amendment" : (parseInt(this.id) + 1)});
				for(var i=0; i<custom_data.length;i++) {
					if (custom_data[i].type == "A") {
						if(custom_data[i].status == "modified") {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_yellow_effect');
						} else if(custom_data[i].status === "inserted") {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_green_effect');
						} else {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_red_effect');
						}
						if (is_heatmap) {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_effect');
						}
					} else if (custom_data[i].type == "S") {
						if(custom_data[i].status == "modified") {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_yellow_effect');
						} else if(custom_data[i].status === "inserted") {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_green_effect');
						} else {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_red_effect');
						}
						if (is_heatmap) {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_effect');
						}
					}

					var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
					if(month<4) {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						yrid = "#year_" + (year-1) + "_" + year;
					} else {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						yrid = "#year_" + year + "_" + (year + 1);
					}
					$(yrid).addClass('hover_effect');
				}
				$($(this).parent()).addClass('list-select');
				$('#summary-' + id).addClass('open');
				$('#summary-' + id).removeClass('close');
				$('#summary-' + id).slideDown();
				$(this).html('-');
				var url = window.location.href;
				if(getParameterByName('amendment').length === 0 && url.indexOf('?') < 0) {
					replace_value = "?amendment="+(parseInt(id)+1);
	                history.pushState(null, null, url+replace_value);
				} else if(getParameterByName('amendment').length === 0 && url.indexOf('?') > 0) {
					url = url.substr(0,url.indexOf('?'));
					replace_value = "?amendment="+(parseInt(id)+1);
					history.pushState(null, null, url+replace_value);
				} else {
					replace_value = "?amendment="+getParameterByName("amendment");
	                param_value = "?amendment="+(parseInt(id)+1);
	                search_page_url = window.location.href.replace(replace_value,param_value);
	                history.replaceState(null, null, search_page_url);
				}
			} else {
				// $('.list_class').unbind('click');
				$('#summary-' + id).removeClass('open');
				$('#summary-' + id).addClass('close');
				$('#summary-' + id).css('display','none');
				$('#summary-' + id).slideUp();
				$('.years_box').removeClass('hover_effect');
				$(this).html('+');
				replace_value = "?amendment="+getParameterByName("amendment");
                param_value = "";
                search_page_url = window.location.href.replace(replace_value,param_value);
                history.replaceState(null, null, search_page_url);
			}
		});
		$('.amendments').on('click',function() {
			$('#reset').addClass('show_element');
			$('#detail').removeClass('show_element');
			$('.article_coloring_legends').addClass('show_element');
			if (is_heatmap) {
				remove_heatmap();
				//$(".articles_container .box").css("background-color", "");
				is_heatmap = false;
			}
			$(".box").css({"background-color":"","color":""}).data("prev-fill","");
			if($("#main_title").hasClass("col-sm-3")) {
				$("#main_title").removeClass("col-sm-3");
				$("#main_title").addClass("col-sm-4");
			}
			$("#amendments_heading").html("");
			$("#article_hint").html("");
			$("#amendments_hint").html("");
			$("#tenure_hint").html("");
			$("#article_heading").html("");
			$("#tenure_heading").html("Amendment "+(+this.id+1)+" made the following changes");

			var id = this.id,yrid,year;
			if($('#summary-' + id).hasClass('close')) {
				$('.years_box').removeClass('select_effect');
				$('.box').removeClass('select_effect');
				$('#parts_div .box, #schedules .box').removeClass('select_yellow_effect');
				$('#parts_div .box, #schedules .box').removeClass('select_green_effect');
				$('#parts_div .box, #schedules .box').removeClass('select_red_effect');
				$('.summary').removeClass('open');
				$('.summary').addClass('close');
				$('.summary').css('display','none');
				$('.badge').html('+')
				$('.list_class').removeClass('list-select');

				var custom_data = _.where(full_data,{"amendment" : (parseInt(this.id) + 1)});
				for(var i=0; i<custom_data.length;i++) {
					if (custom_data[i].type == "A") {
						if(custom_data[i].status == "modified") {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_yellow_effect').data("prev-fill","#DFCD2F");

						} else if(custom_data[i].status === "inserted") {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_green_effect').data("prev-fill","#3FD0AF");
						} else {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_red_effect').data("prev-fill","#F95353");
						}
						if (is_heatmap) {
							$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_effect').data("prev-fill","#F95353");
						}
					} else if (custom_data[i].type == "S") {
						if(custom_data[i].status == "modified") {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_yellow_effect').data("prev-fill","#DFCD2F");;
						} else if(custom_data[i].status === "inserted") {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_green_effect').data("prev-fill","#3FD0AF");
						} else {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_red_effect');
						}
						if (is_heatmap) {
							$('#sched_' + parseInt(custom_data[i].article)).addClass('select_effect');
						}
					}

					var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
					if(month<4) {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						yrid = "#year_" + (year-1) + "_" + year;
					} else {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						yrid = "#year_" + year + "_" + (year + 1);
					}
					console.log(yrid);
					$(yrid).addClass('select_effect');
				}
				$($(this).parent()).addClass('list-select');
				$('#summary-' + id).addClass('open');
				$('#summary-' + id).removeClass('close');
				$('#summary-' + id).slideDown();
				$('#'+id + ' .badge').html('-');
				var url = window.location.href;
				if(getParameterByName('amendment').length === 0 && url.indexOf('?') < 0) {
					replace_value = "?amendment="+(parseInt(id)+1);
	                history.pushState(null, null, url+replace_value);
				} else if(getParameterByName('amendment').length === 0 && url.indexOf('?') > 0) {
					url = url.substr(0,url.indexOf('?'));
					replace_value = "?amendment="+(parseInt(id)+1);
					history.pushState(null, null, url+replace_value);
				} else {
					replace_value = "?amendment="+getParameterByName("amendment");
	                param_value = "?amendment="+(parseInt(id)+1);
	                search_page_url = window.location.href.replace(replace_value,param_value);
	                history.replaceState(null, null, search_page_url);
				}
			}
		});

		$('.list_class').on('mouseover',function() {
			// $(".box").css({"background-color":"","color":""});
			// if (is_heatmap) {
			// 	remove_heatmap();
			// 	$(".articles_container .box").css("background-color", "");
			// 	is_heatmap = false;
			// }
			$('.years_box').removeClass('hover_effect');
				// var custom_data = _.where(full_data,{"amendment" : (parseInt(this.id) + 1)});
				// for(var i=0; i<custom_data.length;i++) {
				// 	if (custom_data[i].type == "A") {
				// 		if(custom_data[i].status == "modified") {
				// 			$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_yellow_effect');
				// 		} else if(custom_data[i].status === "inserted") {
				// 			$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_green_effect');
				// 		} else {
				// 			$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_red_effect');
				// 		}
				// 		if (is_heatmap) {
				// 			$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_effect');
				// 		}
				// 	} else if (custom_data[i].type == "S") {
				// 		if(custom_data[i].status == "modified") {
				// 			$('#sched_' + parseInt(custom_data[i].article)).addClass('select_yellow_effect');
				// 		} else if(custom_data[i].status === "inserted") {
				// 			$('#sched_' + parseInt(custom_data[i].article)).addClass('select_green_effect');
				// 		} else {
				// 			$('#sched_' + parseInt(custom_data[i].article)).addClass('select_red_effect');
				// 		}
				// 		if (is_heatmap) {
				// 			$('#sched_' + parseInt(custom_data[i].article)).addClass('select_effect');
				// 		}
				// 	}
					// var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
					// if(month<4) {
					// year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
					// id = "#year_" + (year-1) + "_" + year;
					// } else {
					// year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
					// id = "#year_" + year + "_" + (year + 1);
					// }
					// $(id).addClass('hover_effect');
				// }
			$(this).addClass('list-hover');
		});
		$('.list_class').on('mouseout',function() {
			// $(".box").css("color","");
			// $('.years_box').removeClass('hover_effect');
			// 	$('#parts_div .box, #schedules .box').removeClass('select_yellow_effect');
			// 	$('#parts_div .box, #schedules .box').removeClass('select_green_effect');
			// 	$('#parts_div .box, #schedules .box').removeClass('select_red_effect');
			$('.list_class').removeClass('list-hover')
			// $(".box").each(function (d) {
			// 	$(this).css("background-color",$(this).data("prev-fill"));
			// 	if($(this).data("prev-fill")){
			// 		$(this).css("color","white");
			// 	}
			// });
		});
		var cutPasteSelectedAmmendments = function (id) {

			$(".list_class#"+id).appendTo('#selected_ammendments');
			$(".list_of_amendments").css("height",+($(".list_of_amendments").css("max-height").slice(0,-2))-$("#selected_ammendments").height())
			$(".list_of_amendments").hide();
		};
		$('.article-list #parts_div .box').on('click',function () {
			$(".box").css({"background-color":"","color":""})
			$('#reset').addClass('show_element');
			$('#detail').addClass('show_element');
			if (is_heatmap) {
				remove_heatmap();
				$(".articles_container .box").css("background-color", "");
				is_heatmap = false;
			}
			if($("#main_title").hasClass("col-sm-3")) {
				$("#main_title").removeClass("col-sm-3");
				$("#main_title").addClass("col-sm-4");
			}
			$("#amendments_heading").html("");
			$("#article_hint").html("");
			$("#amendments_hint").html("");
			$("#tenure_hint").html("");
			$("#article_heading").html("");
			$("#tenure_heading").html("All amendments to Article "+$(this).html());

			$.noty.closeAll()
				$('.list_class').removeClass('list-select');
				$('.box').removeClass('select_effect');
				$('#parts_div .box').removeClass('select_yellow_effect');
				$('#parts_div .box').removeClass('select_green_effect');
				$('#parts_div .box').removeClass('select_red_effect');
				$('.years_box').removeClass('select_effect');
				$("#selected_ammendments .list_class").appendTo('.list_of_amendments');
				$("#selected_ammendments").html("<span style='font-size:14px;text-align:right;color:#333;margin-right:20px;margin-top:4px;' class='pull-right'>Related Amendments</span>");

			

			var value = (this.id).toUpperCase().substr((this.id).indexOf('_') + 1, (this.id).length)
				, custom_data = _.where(full_data,{"article": value, "type": "A"})
				, id;

			$(this).addClass('select_effect');
			var url = window.location.href;
			if(getParameterByName('article').length === 0 && url.indexOf('?') < 0) {
				replace_value = "?article="+value;
				history.pushState(null, null, url+replace_value);
			} else if(getParameterByName('article').length === 0 && url.indexOf('?') > 0) {
				url = url.substr(0,url.indexOf('?'));
				replace_value = "?article="+value;
				history.pushState(null, null, url+replace_value);
			} else {
				replace_value = "?article="+getParameterByName("article");
				param_value = "?article="+value;
				search_page_url = window.location.href.replace(replace_value,param_value);
				history.replaceState(null, null, search_page_url);
			}

			if(custom_data.length !== 0) {
				
				for(var i=0; i<custom_data.length;i++) {
					id = parseInt(custom_data[i].amendment) - 1;
					$('.list_class#' + (id)).addClass('list-select');
					cutPasteSelectedAmmendments(id);
					var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
					if(month<4) {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						id = "#year_" + (year-1) + "_" + year;
					} else {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						id = "#year_" + year + "_" + (year + 1);
					}
					$(id).addClass('select_effect');
				}
				var sorted_dom = $(".list_of_amendments .list_class").sort(function(a,b){
				    if(+a.id < +b.id) {
				        return -1;
				    } else {
				        return 1;
				    }
				});
				$("#subtitle").remove();
				$(".list_of_amendments").prepend("<span id='subtitle' style='font-size:14px;text-align:right;color:#333;margin-right:20px;margin-top:20px;' class='pull-right'>Other Amendments</span>");
				sorted_dom.detach().appendTo($(".list_of_amendments .list-group"));
				if ($("#selected_ammendments").html().length>0) {
					// $("#selected_ammendments").css("border-bottom","4px solid lightgrey");
				}
				
			}else {
				$("#tenure_heading").html("No amendments to Article "+$(this).html());
				generate_notify({text: "No amendments made", notify: "error",timeout:false});
			}
		});
		$('.article-list #schedules .box').on('click',function () {
			$(".box").css({"background-color":"","color":""})
			$('#reset').addClass('show_element');
			$('#detail').removeClass('show_element');
			if (is_heatmap) {
				remove_heatmap();
				$(".articles_container .box").css("background-color", "");
				is_heatmap = false;
			}

			if($("#main_title").hasClass("col-sm-3")) {
				$("#main_title").removeClass("col-sm-3");
				$("#main_title").addClass("col-sm-4");
			}
			$("#amendments_heading").html("");
			$("#article_hint").html("");
			$("#amendments_hint").html("");
			$("#tenure_hint").html("");
			$("#article_heading").html("");
			$("#tenure_heading").html("All amendments to Schedule "+$(this).html());

			$.noty.closeAll()
				$('.list_class').removeClass('list-select');
				$('.box').removeClass('select_effect');
				$('#parts_div .box').removeClass('select_yellow_effect');
				$('#parts_div .box').removeClass('select_green_effect');
				$('#parts_div .box').removeClass('select_red_effect');
				$('.years_box').removeClass('select_effect');
				$("#selected_ammendments .list_class").appendTo('.list_of_amendments');
				$("#selected_ammendments").html("<span style='font-size:14px;text-align:right;color:#333;margin-right:20px;margin-top:4px;' class='pull-right'>Related Amendments</span>");

			

			var value = (this.id).substr((this.id).indexOf('_') + 1, (this.id).length)
				, custom_data = _.where(full_data,{"article": value, "type": "S"})
				, id;

			$(this).addClass('select_effect')
			var url = window.location.href;
			if(getParameterByName('schedule').length === 0 && url.indexOf('?') < 0) {
				replace_value = "?schedule="+value;
				history.pushState(null, null, url+replace_value);
			} else if(getParameterByName('schedule').length === 0 && url.indexOf('?') > 0) {
				url = url.substr(0,url.indexOf('?'));
				replace_value = "?schedule="+value;
				history.pushState(null, null, url+replace_value);
			} else {
				replace_value = "?schedule="+getParameterByName("schedule");
				param_value = "?schedule="+value;
				search_page_url = window.location.href.replace(replace_value,param_value);
				history.replaceState(null, null, search_page_url);
			}

			if(custom_data.length !== 0) {
				
				for(var i=0; i<custom_data.length;i++) {
					id = parseInt(custom_data[i].amendment) - 1;
					$('.list_class#' + (id)).addClass('list-select');
					cutPasteSelectedAmmendments(id);
					var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
					if(month<4) {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						id = "#year_" + (year-1) + "_" + year;
					} else {
						year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
						id = "#year_" + year + "_" + (year + 1);
					}
					$(id).addClass('select_effect');
				}
				var sorted_dom = $(".list_of_amendments .list_class").sort(function(a,b){
				    if(+a.id < +b.id) {
				        return -1;
				    } else {
				        return 1;
				    }
				});
				$("#subtitle").remove();
				$(".list_of_amendments").prepend("<span id='subtitle' style='font-size:14px;text-align:right;color:#333;margin-right:20px;margin-top:20px;' class='pull-right'>Other Amendments</span>");
				sorted_dom.detach().appendTo($(".list_of_amendments .list-group"));
				if ($("#selected_ammendments").html().length>0) {
					// $("#selected_ammendments").css("border-bottom","4px solid lightgrey");
				}
				
			}else {
				$("#tenure_heading").html("No amendments to Schedule "+$(this).html());
				generate_notify({text: "No amendments made", notify: "error",timeout:false});
			}
		});
		$('.article-list #parts_div .box').on('mouseover',function () {

			var value = (this.id).toUpperCase().substr((this.id).indexOf('_') + 1, (this.id).length)
				, custom_data = _.where(full_data,{"article": value, "type": "A"})
				, parent_id = $(this).parent()[0].id;
			$('.list_class').removeClass('list-hover');
			$('.years_box').removeClass('hover_effect');
			for(var i=0; i<custom_data.length;i++) {
				$('.list_class#' + (parseInt(custom_data[i].amendment) - 1)).addClass('list-hover');
				var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
				if(month<4) {
					year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
					id = "#year_" + (year-1) + "_" + year;
				} else {
					year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
					id = "#year_" + year + "_" + (year + 1);
				}
				$(id).addClass('hover_effect');
			}
			if(custom_data.length !== 0) {
				$(this).addClass('individual_box');
			}
			$('#' + parent_id + ' .box').addClass('part_highlight');
			$('.parts_of_constitution .part_names').addClass('deselect-text');
			$('.' + parent_id).removeClass('deselect-text').addClass("part_name_bold");
		});
		$('.article-list #schedules .box').on('mouseover',function () {
			var value = (this.id).substr((this.id).indexOf('_') + 1, (this.id).length)
				, custom_data = _.where(full_data,{"article": value, "type": "S"})
				, parent_id = $(this).parent()[0].id;

			$('.list_class').removeClass('list-hover');
			$('.years_box').removeClass('hover_effect');
			for(var i=0; i<custom_data.length;i++) {
				$('.list_class#' + (parseInt(custom_data[i].amendment) - 1)).addClass('list-hover');
				var month = custom_data[i].date.substr(custom_data[i].date.indexOf('-')+1, (custom_data[i].date.lastIndexOf('-') - custom_data[i].date.indexOf('-') - 1))
				if(month<4) {
					year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
					id = "#year_" + (year-1) + "_" + year;
				} else {
					year = parseInt(custom_data[i].date.substr(custom_data[i].date.lastIndexOf('-')+3,custom_data[i].date.length));
					id = "#year_" + year + "_" + (year + 1);
				}
				$(id).addClass('hover_effect');
			}
			if(custom_data.length !== 0) {
				$(this).addClass('individual_box');
			}
			$('#' + parent_id + ' .box').addClass('part_highlight');
			$('.parts_of_constitution .part_names').addClass('deselect-text');
			$('.' + parent_id).removeClass('deselect-text');
		});
		$('.article-list .box').on('mouseout',function () {
			$('.list_class').removeClass('list-hover');
			$('.years_box').removeClass('hover_effect');
			$('.box').removeClass('individual_box');
			$('.box').removeClass('part_highlight');
			$('.part_names').removeClass('deselect-text').removeClass('part_name_bold');
		});
		$( ".years_box" ).mouseover(function() {
			var year_range = this.getAttribute('year')
			  , custom_data = _.where(full_data,{"year_range" : year_range})
			  , id;
			if(custom_data.length !== 0) {
				$('.box').removeClass('hover_effect');
				$('.list_class').removeClass('list-hover');
				for(var i=0; i<custom_data.length;i++) {
					id = parseInt(custom_data[i].amendment) - 1;
					if(custom_data[i].type === "A") {
						$('#article_' + (custom_data[i].article).toLowerCase()).addClass('hover_effect')
					} else if(custom_data[i].type === "S") {
						$('#sched_' + parseInt(custom_data[i].article)).addClass('hover_effect')
					}
					$('.list_class#' + (id)).addClass('list-hover');
				}
				$(this).addClass('select_effect_hover')
			}
		});
		$( ".years_box" ).mouseout(function() {
			$('.box').removeClass('hover_effect');
			$('.years_box').removeClass('select_effect_hover');
			$('.list_class').removeClass('list-hover');
		});
		$('.years_box').on('click',function() {
			$(".part .box").css({"background-color":"","color":""})
			$('#reset').addClass('show_element');
			$('#detail').removeClass('show_element');
			if($("#main_title").hasClass("col-sm-3")) {
				$("#main_title").removeClass("col-sm-3");
				$("#main_title").addClass("col-sm-4");
			}
			$("#amendments_heading").html("");
			$("#article_hint").html("");
			$("#amendments_hint").html("");
			$("#tenure_hint").html("");
			$("#article_heading").html("");
			$("#tenure_heading").html("All amendments in the year "+$(this).html());

			if (is_heatmap) {
				remove_heatmap();
				$(".articles_container .box").css("background-color", "");
				is_heatmap = false;
			}
			var year_range = this.getAttribute('year')
			  , custom_data = _.where(full_data,{"year_range" : year_range})
			  , id;
			if(custom_data.length !== 0) {
				$.noty.closeAll()
				$('.box').removeClass('select_effect');
				$('#parts_div .box').removeClass('select_yellow_effect');
				$('#parts_div .box').removeClass('select_green_effect');
				$('#parts_div .box').removeClass('select_red_effect');
				$('.list_class').removeClass('list-select');
				$("#selected_ammendments .list_class").appendTo('.list_of_amendments');
				$("#selected_ammendments").html("<span style='font-size:14px;text-align:right;color:#333;margin-right:20px;margin-top:4px;' class='pull-right'>Related Amendments</span>");
				for(var i=0; i<custom_data.length;i++) {
					id = parseInt(custom_data[i].amendment) - 1;
					if(custom_data[i].type === "A") {
						$('#article_' + (custom_data[i].article).toLowerCase()).addClass('select_effect')
					} else if(custom_data[i].type === "S") {
						$('#sched_' + parseInt(custom_data[i].article)).addClass('select_effect')
					}
					$('.list_class#' + (id)).addClass('list-select');
					cutPasteSelectedAmmendments(id);
					$(this).addClass('select_effect');
				}
				var sorted_dom = $(".list_of_amendments .list_class").sort(function(a,b){
				    if(+a.id < +b.id) {
				        return -1;
				    } else {
				        return 1;
				    }
				});
				$("#subtitle").remove();
				$(".list_of_amendments").prepend("<span id='subtitle' style='font-size:14px;text-align:right;color:#333;margin-right:20px;margin-top:20px;' class='pull-right'>Other Amendments</span>");
				sorted_dom.detach().appendTo($(".list_of_amendments .list-group"));
				if ($("#selected_ammendments").html().length>0) {
					// $("#selected_ammendments").css("border-bottom","4px solid lightgrey");
				}
				var url = window.location.href;
				if(getParameterByName('year').length === 0 && url.indexOf('?') < 0) {
					replace_value = "?year="+year_range;
	                history.pushState(null, null, url+replace_value);
				} else if(getParameterByName('year').length === 0 && url.indexOf('?') > 0) {
					url = url.substr(0,url.indexOf('?'));
					replace_value = "?year="+year_range;
					history.pushState(null, null, url+replace_value);
				} else {
					replace_value = "?year="+getParameterByName("year");
	                param_value = "?year="+year_range;
	                search_page_url = window.location.href.replace(replace_value,param_value);
	                history.replaceState(null, null, search_page_url);
				}
			} else {
				generate_notify({text: "No amendments made", notify: "error",timeout:false});
			}
		});
		$('.tenure').on('mouseover',function () {
			var tenure = this.getAttribute('tenures')
			$('.box').removeClass('hover_effect');
			$('.list_class').removeClass('list-hover');
			var custom_data = _.where(full_data,{"tenure" : tenure});
			for(var i=0; i<custom_data.length;i++) {
				if(custom_data[i].type === "A") {
					$('#article_' + (custom_data[i].article).toLowerCase()).addClass('hover_effect')
				} else if(custom_data[i].type === "S") {
					$('#sched_' + parseInt(custom_data[i].article)).addClass('hover_effect')
				}
				$('.list_class#' + (parseInt(custom_data[i].amendment) - 1)).addClass('list-hover');
			}
		});
		$( ".tenure" ).mouseout(function() {
			$('.box').removeClass('hover_effect');
			$('.list_class').removeClass('list-hover');
		});
		fetchUrl();

		var tour = new Tour({
		  steps: [
			{
				element: "#tenure1",
				title: "Hover to highlight amendments in this tenure <i style='font-size:12px'>(1/4)</i>",
				content: "Hovering highlights the amended articles and respective amendment number in this tenure"
		  },
			{
				element: "#year_52_53",
				title: "Click to highlight amendments in this year <i style='font-size:12px'>(2/4)</i>",
				content: "Clicking highlights the amended articles and respective amendment number in this year"
			},
			{
				element: "#article_1",
				title: "Click to highlight the amendments of this article <i style='font-size:12px'>(3/4)</i>",
				content: "Clicking highlights the year of amendment and respective amendment number of this article",
				placement: "bottom"
			},
			{
				element: "#tour_01",
				title: "Click to get the details of this amendment <i style='font-size:12px'>(4/4)</i>",
				content: "Clicking highlights the year of amendment and the amended articles and shows more information about the amendment",
				placement: "left"
			}/*,
			{
				element: "#sharing_images",
				title: "Social sharing <i style='font-size:12px'>(5/5)</i>",
				content: "Share on facebook and twitter",
				placement: "left"
			}*/
		]});

		// Initialize the tour
		tour.init();
		// Start the tour
		$(".hint.tour").click(function () {
			tour.restart();
		});

		$("#reset").click(function () {
			$('#reset').removeClass('show_element');
			window.location.href = window.location.origin+window.location.pathname;
		})

		// On click of the detail element
        $('#detail').on('click', function () {
            // Get the article number from the URL
            let articleNumber = getQueryParameter('article');
			console.info(articleNumber);
            
            $.getJSON("data/constitution_of_india.json", function (data) {
                // Find the article based on the article number
                let articleData = data.find(item => String(item.article) === articleNumber);
				console.info(articleData);
                if (articleData) {
                    // Populate the #contentDiv with the article data
                    $('#coi_panel').empty(); // Clear existing content
                    $('#coi_panel').append('<h4>' + articleData.title + '</h4>');
                    articleData.description.forEach(function (line) {
                        $('#coi_panel').append('<p>' + line + '</p>');
                    });

                    // Clear the other div
					$('#left_side_bar').empty();
                    $('#right_side_bar').empty();
					
                } else {
                    // If article not found, display an error message in #contentDiv
                    $('#contentDiv').html('<p>The requested article could not be found.</p>');
                }
            });
        });

		function getQueryParameter(name) {
			let urlParams = new URLSearchParams(window.location.search);
			return urlParams.get(name);
		}
	}
}
