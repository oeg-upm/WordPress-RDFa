
function showmore_schemas(){
	$('#more_schemas_btn').remove();
	$('.ocultar_ent').show();
	$('#schema_search_menu').show();
}
function handleSearchMenu(term){
    $('#schema_menu .seond-level').each(function(i, element){
    	var str=$(element).text();
    	str=str.toLowerCase();
	    	var n=str.search(term.toLowerCase());
	    	if (n!=-1)
	    		$(element).addClass('found_node_menu');
	    	else
	    		$(element).css('display','none');
    });
    if(term==''){
    	$('#schema_menu .seond-level').css('display','');
    	$('.ocultar_ent').show();
    }
}
function handleSearchMenuInline(term){
    $('#changetype_menu .seond-level').each(function(i, element){
    	var str=$(element).text();
    	str=str.toLowerCase();
	    	var n=str.search(term.toLowerCase());
	    	if (n!=-1)
	    		$(element).addClass('found_node_menu');
	    	else
	    		$(element).css('display','none');
    });
    if(term==''){
    	$('#changetype_menu .seond-level').css('display','');
    	$('.ocultar_ent').show();
    }
}
function load_schemas(){
	var secondlevles=new Array();
	$.getJSON('clasificacion.json', function(data) {
		all_schemas=data;
		$.each(data.types,function(i,v){
			if(v.level==1)
				$('#schema_menu').append('<li><a onclick="initiate_form(\''+v.id+'\')" tabindex="-1" href="#'+v.id+'" title="'+v.comment_plain+'">'+v.label+'</a></li>');
			else
				secondlevles.push('<li class="seond-level schema_hidden"><a onclick="initiate_form(\''+v.id+'\')" tabindex="-1" href="#'+v.id+'" title="'+v.comment_plain+'">'+v.label+'</a></li>')
		})
		$.each(data.datatypes,function(i,v){
			all_datatypes.push(i);
		})		
		$('#schema_menu').append('<li class="divider"></li>');
		$('#schema_menu').append('<li id="more_schemas_btn"><a tabindex="-1" onclick="showmore_schemas()" class="hand-pointer">More...</a></li>');
		$('#schema_menu').append('<li><a tabindex="-1"><input id="schema_search_menu" type="text" class="input span2 search-query" placeholder="Search for Schema" style="display:none;"></a></li>');
		$.each(secondlevles,function(i,v){
			$('#schema_menu').append(v);
		})	
		$('.dropdown-menu').show();
		$("#schema_search_menu").keyup(function(event){
			
			if(event.keyCode == 13){ 
				handleSearchMenu($("#schema_search_menu").val().trim());
			}
			
			var k=$("#schema_search_menu").val().trim();
			setTimeout(function() {
				handleSearchMenu($("#schema_search_menu").val().trim());
			}, 300);
		});	
	});	
}
function initiate_form(schema){
	$('#page_header').hide();
	$('#schema_dropdown').hide();
	$('#area2').append('<div id="second_page_btns"><center><a href="#types" class="btn" onclick="show_schemas();"> Back </a> <a class="btn btn-success" onclick="submit_schema_form();"> Insert </a></center></div>');	
	$('.nav-tabs').remove();
	$('.tab-content').remove();
	$('#area2').append('<ul class="nav nav-tabs" id="schema_tabs"><li class="active"><a href="#properties" data-toggle="tab">Main</a></li></ul>');
	$('#area2').append('<div class="tab-content" id="schema_tabs_content"><div class="tab-pane active" id="properties"></div>');
	create_form(schema,'','properties');
}
function create_form(schema,property,container){
	var tmp='';
	var selected=all_schemas.types[schema];
	var id;
	if(property==''){
		id=schema;
	}else{
		id=schema+'_'+property;
	}
	$('#'+container).append('<div id="schema_form_'+id+'"></div>');
	$('#schema_form_'+id).append('<h4><a href="'+selected.url+'" target="_blank">'+selected.label+'</a></h4><small id="schema_description" class="muted">-- '+selected.comment+'</small>');
	$('#schema_form_'+id).append('<form class="form-vertical well well-small" id="form_'+id+'"></form>');
	if(property==''){
		tmp='<div class="control-group">';
		tmp=tmp+'<label class="control-label" for="entity_uri">Entity URI</label>';
		tmp=tmp+'<div class="controls">';
		tmp=tmp+'<input type="text" id="entity_uri" placeholder="URI of the entity">';
		tmp=tmp+'<span class="add-on iconoSub" onclick="form_suggestURI()" title="Search for URI"><i class="icon-search"></i></span>';
		tmp=tmp+'</div>';
		tmp=tmp+'</div>';
		$('#form_'+id).append(tmp);
		$('#entity_uri').mouseover(function() {
			   $('#entity_uri').tooltip({
			        placement : 'right',
			        title : 'resolvable URI of the entity'
			    });
		});			
	}
	$.each(selected.properties, function(i,v){
			if(property==''){
				build_form_element(selected.id,v,'form_'+id,1);
			}else{
				build_form_element(property,v,'form_'+id,0);
			}
	})
	$('#schema_form_'+id).linkify();
}
function show_schemas(){
	$('#second_page_btns').remove();
	$('#schema_tabs').remove();
	$('#contSchema').remove();
	$('#page_header').show();
	$('#schema_dropdown').show();	
}
function build_form_element(schema,property,container,is_initial){	
	var output='';
	output=output+'<div class="control-group">';
	output=output+'<label class="control-label" for="'+schema+'_'+property+'">'+all_schemas.properties[property].label+'</label>';
	output=output+'<div class="controls">';
	
	var selected=all_schemas.properties[property];
	if(property=='description'){
		output=output+'<textarea rows="2" id="'+schema+'_'+property+'" placeholder="'+property+'"></textarea>';
		$('#'+container).append(output);
		make_tooltip(schema,property);
		return 0;
	}
	var range=selected.ranges[0];
	switch(range){
	case 'Boolean':
		output=output+'<select id="'+schema+'_'+property+'"><option value=""></option><option value="True">True</option><option value="False">False</option></select>';
		$('#'+container).append(output);
		make_tooltip(schema,property);
		return 0;
		break;	
	case 'DateTime':
		output=output+'<div class="input-append date" id="datetimepicker_'+schema+'_'+property+'" data-date-format="yyyy-mm-dd hh:ii"><input size="16" type="text" id="'+schema+'_'+property+'"><span class="add-on"><i class="icon-th"></i></span></div>';
		$('#'+container).append(output);
		$('#datetimepicker_'+schema+'_'+property).datetimepicker();
		make_tooltip(schema,property);
		return 0;
		break;
	case 'Date':
		var nowTemp = new Date();
		var now=nowTemp.getFullYear()+'-'+nowTemp.getMonth()+'-'+nowTemp.getDate();
		output=output+'<div class="input-append date" id="datepicker_'+schema+'_'+property+'" data-date="'+now+'" data-date-format="yyyy-mm-dd"><input size="16" type="text" id="'+schema+'_'+property+'"><span class="add-on"><i class="icon-th"></i></span></div>';
		$('#'+container).append(output);
		$('#datepicker_'+schema+'_'+property).datepicker();
		make_tooltip(schema,property);
		return 0;
		break;		
	default:
		output=output+'<input type="text" id="'+schema+'_'+property+'" placeholder="'+property+'">';	
	}
	if(all_datatypes.indexOf(range) != -1){ 
	}else{
		if(is_initial)
			output=output+'<span class="add-on iconoSub" onclick="add_sub_schema(\''+property+'\',\''+range+'\')" title="Add details"><a href="#schema_tabs"><i class="icon-plus"></i></a></span>';
		else
			output=output+'<span class="add-on iconoSub" onclick="add_sub_schema(\''+schema+'_'+property+'\',\''+range+'\')" title="Add details"><a href="#schema_tabs"><i class="icon-plus"></i></a></span>';
	}
	$('#'+container).append(output);
	make_tooltip(schema,property);
}
function is_composite_property(prop){
	if(all_datatypes.indexOf(all_schemas['properties'][prop]['ranges'][0]) != -1){ 
		return 0;
	}else{
		return 1;
	}
}
function make_tooltip(schema,property){
	$('#'+schema+'_'+property).mouseover(function() {
		   $('#'+schema+'_'+property).tooltip({
		        placement : 'right',
		        title : all_schemas.properties[property].comment_plain
		    });
	});	
}
function build_changetype_box(current_type){
	var secondlevles=new Array();
	var output='<div id="changetype_menu" class="btn-group"><button class="btn dropdown-toggle btn-inverse" data-toggle="dropdown">'+current_type+' <span class="caret"></span> </button><ul class="dropdown-menu" style="text-align:left;">';
	$.each(all_schemas.types,function(i,v){
		if(v.level==1 && v.id!=current_type)
			output=output+'<li><a onclick="Entidades.cambiarTipo(\''+v.id+'\')" tabindex="-1" href="#'+v.id+'" title="'+v.comment_plain+'">'+v.label+'</a></li>';
		else
			secondlevles.push('<li class="seond-level schema_hidden"><a onclick="Entidades.cambiarTipo(\''+v.id+'\')" tabindex="-1" href="#'+v.id+'" title="'+v.comment_plain+'">'+v.label+'</a></li>')
	})	
	output=output+'<li class="divider"></li>';
	output=output+'<li id="more_schemas_btn"><a tabindex="-1" onclick="event.stopPropagation();showmore_schemas();" class="hand-pointer">More...</li>';
	output=output+'<li><a tabindex="-1" onclick="event.stopPropagation();"><input id="schema_search_menu" type="text" class="input span2 search-query" placeholder="Search for Schema" style="display:none;"></a></li>';
	$.each(secondlevles,function(i,v){
		output=output+v;
	})	
	output=output+'</ul></div>';
	return output;
}
function form_suggestURI(){
	var term=$('#entity_uri').val().trim();
	var str=term.toLowerCase();
	var n1=str.search('http://');
	var n2=str.search('www.');
	if (n1==-1 && term!=''){
		if(n2==-1){
			$('#entity_uri').val(suggestURI(proxy_url,"api=Sindice&query="+term,true));
		}else{
			alert('Please type a keyword to search');
		}
	}else{
		alert('Please type a keyword to search');
	}
	
}
function add_sub_schema(s,range){
	if(!$('#tab_'+s).length){
		$('#schema_tabs').append('<li><a href="#tab_'+s+'" data-toggle="tab"> <button class="close" type="button" onclick="remove_schema_tab(\''+s+'\')">&times;</button> '+s+'</a></li>');
		$('#contSchema').append('<div class="tab-pane" id="tab_'+s+'"></div>');
		create_form(range,s,'tab_'+s);
	}
	$('#schema_tabs a[href=#tab_'+s+']').tab('show');
	$("#contSchema").animate({ scrollTop: 0 }, "fast");
}
function add_repeated_sub_schema(instances,s,range,is_composite){
	if(!$('#tab_'+s).length){
		$('#schema_tabs').append('<li><a href="#tab_'+s+'" data-toggle="tab"> <button class="close" type="button" onclick="remove_schema_tab(\''+s+'\')">&times;</button> '+s+'</a></li>');
		$('#contSchema').append('<div class="tab-pane" id="tab_'+s+'"></div>');
		$("#tab_"+s).append('<ul class="nav nav-tabs" id="schema_tabs_'+s+'"></ul>');
		$("#tab_"+s).append('<div class="tab-content" id="schema_tabs_content_'+s+'"></div>');
		if(is_composite){
			for (var i=0;i<instances.length;i++)
			{
				if(i==0){
					$("#schema_tabs_"+s).append('<li class="active"><a href="#tab_'+s+'_'+i+'" data-toggle="tab"> <button class="close" type="button" onclick="remove_repeated_schema_tab(\''+s+'\',\''+s+'_'+i+'\')">&times;</button> Value '+i+'</a></li>');
					$('#contSchema_'+s).append('<div class="tab-pane active" id="tab_'+s+'_'+i+'"></div>');
				}else{
					$("#schema_tabs_"+s).append('<li><a href="#tab_'+s+'_'+i+'" data-toggle="tab"> <button class="close" type="button" onclick="remove_repeated_schema_tab(\''+s+'\',\''+s+'_'+i+'\')">&times;</button> Value '+i+'</a></li>');
					$('#contSchema_'+s).append('<div class="tab-pane" id="tab_'+s+'_'+i+'"></div>');
				}	
				create_form(range,s+'_'+i,'tab_'+s+'_'+i);
				reJson(instances[i].value,s+'_'+i,'schema_form_'+s+'_'+i);
			}		
		}else{
			for (var i=0;i<instances.length;i++)
			{
				if(i==0){
					$("#schema_tabs_"+s).append('<li class="active"><a href="#tab_'+s+'_'+i+'" data-toggle="tab"> <button class="close" type="button" onclick="remove_repeated_schema_tab(\''+s+'\',\''+s+'_'+i+'\')">&times;</button> Value '+i+'</a></li>');
					$('#contSchema_'+s).append('<div class="tab-pane active" id="tab_'+s+'_'+i+'"></div>');
				}else{
					$("#schema_tabs_"+s).append('<li><a href="#tab_'+s+'_'+i+'" data-toggle="tab"> <button class="close" type="button" onclick="remove_repeated_schema_tab(\''+s+'\',\''+s+'_'+i+'\')">&times;</button> Value '+i+'</a></li>');
					$('#contSchema_'+s).append('<div class="tab-pane" id="tab_'+s+'_'+i+'"></div>');
				}	
				$('#tab_'+s+'_'+i).append('<input type="text" id="'+s+'_'+i+'" value="'+instances[i].value+'">');	
			}
		}
		
	}
}
function show_repeated_tab(s,is_composite){
	if(!$('#tab_'+s).length){
		alert('Cierra la ventana y haz click en la entidad de nuevo!');
	}else{
		$('#schema_tabs a[href=#tab_'+s+']').tab('show');
		$("#contSchema").animate({ scrollTop: 0 }, "fast");
	}
}
function remove_schema_tab(s){
	$('#schema_tabs a[href=#tab_'+s+']').parent().remove();
	$('#tab_'+s).remove();
	$('#schema_tabs a[href=#properties]').tab('show');
}
function remove_repeated_schema_tab(parent_tab,s){
	$('#schema_tabs_'+parent_tab+' a[href=#tab_'+s+']').parent().remove();
	$('#tab_'+s).remove();
	if(!$('#contSchema_'+parent_tab).find('.tab-pane').length){
		$('#schema_tabs a[href=#tab_'+parent_tab+']').parent().remove();
		$('#tab_'+parent_tab).remove();	
		$('#schema_tabs a[href=#properties]').tab('show');
	}else{
		$('#schema_tabs_'+parent_tab).tab('show');
	}
	
}
function submit_schema_form(){
	console.log(formuJson('properties'));
}
function formuJson(container){
	var output = {};
	var jsonObj = {};
	var div_name=$('#'+container).children().attr('id');
	var tmp=div_name.split("_");
	var schema=tmp[2];
	var property=tmp[(tmp.length)-1];
	var input_prefix='';
	var tab_prefix='';
	if(schema==property){
		input_prefix=schema;
		tab_prefix='tab_';
	}else{
		var tmp2=div_name.split("schema_form_"+schema+"_");
		input_prefix=tmp2[1];
		tab_prefix='tab_'+input_prefix+'_';
	}
	var selected=all_schemas.types[schema];
	var input_val;
	output['type']=schema;
	if($('#'+container+' #entity_uri').length){
		var tmp=$('#'+container+' #entity_uri').val().trim();
		if(tmp!=''){
			jsonObj['entity_uri']=({value:tmp,is_composite:0,is_repeated:0});
		}
	}
	$.each(selected.properties,function(i,v){
		input_val=$('#'+container+' #'+input_prefix+'_'+v).val().trim();
		if(input_val!='' && input_val!='Multiple values'){
			jsonObj[v]=({value:input_val,is_composite:0, is_repeated:0});
		}else{
			if($('#'+tab_prefix+v).length){
				var tmp2=tab_prefix.split('tab_')[1];
				if($('#schema_tabs_'+tmp2+v).length){
					var is_composite_prop=is_composite_property(v);
					jsonObj[v]=({is_composite:is_composite_prop, is_repeated:1});
					jsonObj[v]['instances']=[];
					for (var j=0;j<50;j++){
						if($('#tab_'+tmp2+v+'_'+j).length){
							if(is_composite_prop)
								jsonObj[v]['instances'][j]=({value:formuJson('tab_'+tmp2+v+'_'+j)});
							else
								jsonObj[v]['instances'][j]=({value:$('#tab_'+tmp2+v+'_'+j+' #'+tmp2+v+'_'+j).val().trim()});
						}else{
							break;
						}
					}
				}else{
					jsonObj[v]=({value:formuJson(tab_prefix+v), is_composite:1, is_repeated:0});
				}
				
			}
		}
	})
		output['properties']=jsonObj;
		return output;
}
function anotacionesRdfaJson(pointer){
	var output = {};
	var jsonObj = {};
	var tmp=pointer.attr('typeof');
	if(tmp){
		tmp=tmp.split(':')[1];
		output['type']=tmp;
	}
	var firstlevels1=primerNivel(pointer,getFirstLevelNodes(pointer,0,1));
	$.each(firstlevels1,function(i,v){
		tmp=$(v).attr('property');
		tmp=tmp.split(':')[1];
		if(jsonObj[tmp]){
			if(!jsonObj[tmp]['instances']){
				jsonObj[tmp]['instances']=[];
				jsonObj[tmp].is_composite=1;
				jsonObj[tmp].is_repeated=1;
				jsonObj[tmp]['instances'][0]=({value:jsonObj[tmp].value});
				delete jsonObj[tmp].value;
			}
			var tmp2=jsonObj[tmp]['instances'].length;
			jsonObj[tmp]['instances'][tmp2]=({value:anotacionesRdfaJson($(v))});
		}else{
			jsonObj[tmp]=({value:anotacionesRdfaJson($(v)), is_composite:1,is_repeated:0});
		}
	})
	var firstlevels2=primerNivel(pointer,getFirstLevelNodes(pointer,0,2));
	$.each(firstlevels2,function(i,v){
		tmp=$(v).attr('property');
		tmp=tmp.split(':')[1];
		if(jsonObj[tmp]){
			if(!jsonObj[tmp]['instances']){
				jsonObj[tmp]['instances']=[];
				jsonObj[tmp].is_composite=0;
				jsonObj[tmp].is_repeated=1;
				jsonObj[tmp]['instances'][0]=({value:jsonObj[tmp].value});
				delete jsonObj[tmp].value;
			}
			var tmp2=jsonObj[tmp]['instances'].length;
			jsonObj[tmp]['instances'][tmp2]=({value:$(v).html()});
		}else{
			jsonObj[tmp]=({value:$(v).html(),is_composite:0,is_repeated:0});
		}
	})
	var firstlevels3=primerNivel(pointer,getFirstLevelNodes(pointer,0,3));
	$.each(firstlevels3,function(i,v){
		tmp=$(v).attr('property');
		tmp=tmp.split(':')[1];
		if(jsonObj[tmp]){
			if(!jsonObj[tmp]['instances']){
				jsonObj[tmp]['instances']=[];
				jsonObj[tmp].is_composite=0;
				jsonObj[tmp].is_repeated=1;
				jsonObj[tmp]['instances'][0]=({value:jsonObj[tmp].value});
				delete jsonObj[tmp].value;
			}
			var tmp2=jsonObj[tmp]['instances'].length;
			jsonObj[tmp]['instances'][tmp2]=({value:$(v).attr('content')});
		}else{
			jsonObj[tmp]=({value:$(v).attr('content'),is_composite:0,is_repeated:0});
		}
	})

	if(pointer.attr('resource')){
		jsonObj['entity_uri']=({value:pointer.attr('resource'),is_composite:0,is_repeated:0});
	}
	output['properties']=jsonObj;
	return output;
}

function getFirstLevelNodes(p,property,ann_type){
	var out=[];
	if(property){
		
			$.each($(p).children(),function(i,v){
				if($(v).attr('property')=='schema:'+property){
					out=$.merge(out,$(v));
				}else{
					var r=getFirstLevelNodes($(v),property,0);
					if(r.length)
						out=$.merge(out,r);
				}
			});
		
	}else{
			if(ann_type==1){
				$.each($(p).children(),function(i,v){
					if($(v).attr('typeof') && $(v).attr('property')){
						out=$.merge(out,$(v));
					}else{
						var r=getFirstLevelNodes($(v),0,1);
						if(r.length)
							out=$.merge(out,r);
					}
				});
			}else{
				if(ann_type==2){
					$.each($(p).children(),function(i,v){
						if($(v).hasClass('r_prop') && $(v).attr('property')){
							out=$.merge(out,$(v));
						}else{
							var r=getFirstLevelNodes($(v),0,2);
							if(r.length)
								out=$.merge(out,r);
						}
					});
				}else{
					if(ann_type==3){
						$.each($(p).children(),function(i,v){
							if(($(v).prop("tagName").toLowerCase()=='meta') && $(v).attr('property')){
								out=$.merge(out,$(v));
							}else{
								var r=getFirstLevelNodes($(v),0,3);
								if(r.length)
									out=$.merge(out,r);
							}
						});	
					}
				}
			}
		
	}
	return out;
}
function esPadre(node,c,type,format){
	var counter=0;
		while($(c).parent()){
			counter++;
			vvv=$(c).parent();
			if($(vvv).attr('typeof')){
				if($(vvv).attr('typeof')==type){
					if($(vvv).html()==$(node).html()){
						return counter;
					}else{
						return 0;
					}
				}else{
					return 0;
				}
			}
			c=$(c).parent();
		};
	return 0;
}

function primerNivel(pointer,firstlevels){
	var out=[];
	var t,counter;
		$.each(firstlevels,function(i,v){
			t=pointer.attr('typeof');
			counter=esPadre(pointer,$(v),t,'RDFa');
			if(counter){
				out.push(v);
			}
		});
	
	return out;
}
function tagsRdfa(obj,pointer){
	for(var i in obj.properties){
	if(i!='entity_uri'){
		var firstlevels=primerNivel(pointer,getFirstLevelNodes(pointer,i,0));
		if(firstlevels.length){
		
			if(obj.properties[i].is_repeated){
				
				if(obj.properties[i].is_composite){
				
					$.each(firstlevels,function(ii,vv){
					
						tagsRdfa(obj.properties[i].instances[ii].value,$(vv));					
					});	
				}else{
					$.each(firstlevels,function(ii,vv){
							var tagName=$(vv).prop("tagName").toLowerCase();
							if(tagName=='meta'){
								$(vv).attr('content',obj.properties[i].instances[ii].value);
							}else{
								$(vv).html(obj.properties[i].instances[ii].value);
							}
					});
				}
			}else{
				if(obj.properties[i].is_composite){
					tagsRdfa(obj.properties[i].value,$(firstlevels[0]));
				}else{
					var tagName=$(firstlevels[0]).prop("tagName").toLowerCase();
					if(tagName=='meta'){
						$(firstlevels[0]).attr('content',obj.properties[i].value);
					}else{
						$(firstlevels[0]).html(obj.properties[i].value);
					}
				}
			}
		}else{
			if(obj.properties[i].is_repeated){
				if(obj.properties[i].is_composite){
					$.each(obj.properties[i].instances,function(ii,vv){
						pointer.append('<span id="inst_'+i+'_'+ii+'" property="schema:'+i+'" typeof="schema:'+obj.properties[i].instances[0].value.type+'"></span>');
						tagsRdfa(vv.value,pointer.find("#inst_'+i+'_'+ii+'"));
					})
				}else{
					$.each(obj.properties[i].instances,function(ii,vv){
						pointer.append('<meta property="schema:'+i+'" content="'+vv.value+'" />');
					})
				}
			}else{
				if(obj.properties[i].is_composite){
					pointer.append('<span property="schema:'+i+'" typeof="schema:'+obj.properties[i].value.type+'"></span>');
					tagsRdfa(obj.properties[i].value,pointer.find('[property="schema:'+i+'"]'));
				}else{
					pointer.append('<meta property="schema:'+i+'" content="'+obj.properties[i].value+'" />');
				}
			}
			
		}
	}
	}
}

function reJson(obj,property,form_container){
	var tmp;
	for(var i in obj.properties){
		v=obj.properties[i];
		if(v.is_repeated){
		
			if(v.is_composite){
				if(form_container=='properties'){
					$('#'+form_container+' #'+obj.type+'_'+i).parent().parent().addClass('info');
					$('#'+form_container+' #'+obj.type+'_'+i).next().remove();
					$('#'+form_container+' #'+obj.type+'_'+i).after('<span class="add-on iconoSub" title="See multiple values" onclick="show_repeated_tab(\''+i+'\',1);"><a href="#schema_tabs"><i class="icon-book"></i></a></span>');
					$('#'+form_container+' #'+obj.type+'_'+i).prop('disabled', true);
					$('#'+form_container+' #'+obj.type+'_'+i).val('Multiple values');	
					add_repeated_sub_schema(v.instances,i,v.instances[0].value.type,1);
				}else{
					tmp=form_container.split('schema_form_'+obj.type+'_');
					tmp=tmp[1];	
					if(!tmp){
						var tmp2=form_container.split('schema_form_')[1];
						$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).parent().parent().addClass('info');
						$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).next().remove();
						$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).after('<span class="add-on iconoSub" title="See multiple values" onclick="show_repeated_tab(\''+property+'_'+i+'\',1);"><a href="#schema_tabs"><i class="icon-book"></i></a></span>');
						$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).prop('disabled', true);
						$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).val('Multiple values');
					}else{
						$('#'+form_container+' #'+tmp+'_'+i).parent().parent().addClass('info');
						$('#'+form_container+' #'+tmp+'_'+i).next().remove();
						$('#'+form_container+' #'+tmp+'_'+i).after('<span class="add-on iconoSub" title="See multiple values" onclick="show_repeated_tab(\''+property+'_'+i+'\',1);"><a href="#schema_tabs"><i class="icon-book"></i></a></span>');
						$('#'+form_container+' #'+tmp+'_'+i).prop('disabled', true);
						$('#'+form_container+' #'+tmp+'_'+i).val('Multiple values');
					}
					add_repeated_sub_schema(v.instances,property+'_'+i,v.instances[0].value.type,1);
				}
			}else{
				if(i=='entity_uri'){
					$('#properties #entity_uri').val(v.value);
				}else{
					if(form_container=='properties'){
						$('#'+form_container+' #'+obj.type+'_'+i).parent().parent().addClass('info');
						$('#'+form_container+' #'+obj.type+'_'+i).after('<span class="add-on iconoSub" title="See multiple values" onclick="show_repeated_tab(\''+i+'\',0);"><a href="#schema_tabs"><i class="icon-book"></i></a></span>');
						$('#'+form_container+' #'+obj.type+'_'+i).prop('disabled', true);
						$('#'+form_container+' #'+obj.type+'_'+i).val('Multiple values');
						add_repeated_sub_schema(v.instances,i,all_schemas.properties[i].ranges[0],0);
					}else{
						tmp=form_container.split('schema_form_'+obj.type+'_');
						tmp=tmp[1];	
						if(!tmp){
						
							var tmp2=form_container.split('schema_form_')[1];
							$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).parent().parent().addClass('info');
							$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).after('<span class="add-on iconoSub" title="See multiple values" onclick="show_repeated_tab(\''+property+'_'+i+'\',0);"><a href="#schema_tabs"><i class="icon-book"></i></a></span>');
							$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).prop('disabled', true);
							$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).val('Multiple values');

						}else{
							$('#'+form_container+' #'+tmp+'_'+i).parent().parent().addClass('info');
							$('#'+form_container+' #'+tmp+'_'+i).after('<span class="add-on iconoSub" title="See multiple values" onclick="show_repeated_tab(\''+property+'_'+i+'\',0);"><a href="#schema_tabs"><i class="icon-book"></i></a></span>');
							$('#'+form_container+' #'+tmp+'_'+i).prop('disabled', true);
							$('#'+form_container+' #'+tmp+'_'+i).val('Multiple values');
						}						

						add_repeated_sub_schema(v.instances,property+'_'+i,all_schemas.properties[i].ranges[0],0);
					}					
				}
			}		
		}else{
			if(v.is_composite){
				if(form_container=='properties'){
					$('#'+form_container+' #'+obj.type+'_'+i).parent().parent().addClass('success');
					$('#'+form_container+' #'+obj.type+'_'+i).next().children().html('<i class="icon-star"></i>');
					add_sub_schema(i,v.value.type);
					reJson(v.value,i,'schema_form_'+v.value.type+'_'+i)
				}else{
					$('#'+form_container+' #'+tmp+'_'+i).parent().parent().addClass('success');
					$('#'+form_container+' #'+tmp+'_'+i).next().children().html('<i class="icon-star"></i>');
					add_sub_schema(property+'_'+i,v.value.type);
					reJson(v.value,property+'_'+i,'schema_form_'+v.value.type+'_'+property+'_'+i)
				}
			}else{
				if(i=='entity_uri'){
					$('#properties #entity_uri').val(v.value);
					$('#properties #entity_uri').parent().parent().addClass('success');
				}else{
					if(form_container=='properties'){
						$('#'+form_container+' #'+obj.type+'_'+i).val(v.value);
						$('#'+form_container+' #'+obj.type+'_'+i).parent().parent().addClass('success');
					}else{
						tmp=form_container.split('schema_form_'+obj.type+'_');
						tmp=tmp[1];
						if(!tmp){
							
							var tmp2=form_container.split('schema_form_')[1];
							$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).val(v.value);
							$('#schema_form_'+obj.type+'_'+tmp2+' #'+tmp2+'_'+i).parent().parent().addClass('success');
						}else{
							$('#'+form_container+' #'+tmp+'_'+i).val(v.value);
							$('#'+form_container+' #'+tmp+'_'+i).parent().parent().addClass('success');
						}	
					}
				}
			}
		}
	}
}