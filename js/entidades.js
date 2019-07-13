var VPrinc = (!window.frameElement && window.dialogArguments) || opener || parent || top;
var url=VPrinc.urlRdfa;
var contenido=princ.html();
var editor=VPrinc.editorRdfa;
var tipoEntidad=VPrinc.tipoEntRdfa;
var princ=VPrinc.puntRdfa;
var Entidades = {
	init : function() {
		$.getJSON(url+'/schema/clasificacion.json', function(datos) {
			schemas=datos;
			$.each(datos.datatypes,function(i,v){
				all_datatypes.push(i);
			})	
			$('#area').append('<a class="btn" onclick="Entidades.actualizar();"> Actualizar </a> <a class="btn btn-danger" onclick="Entidades.borrar();"> Borrar </a> ');
			$('#area2').append('<div class="tab-content" id="schema_tabs_content"><div class="tab-pane active" id="properties"></div>');
			
			//relaciones entre las entidades
			var prov=princ.parent();
			var tipo;
			var hay_rel='';
			var propiedades=[];
			while(prov.length){
				if(prov.hasClass('r_entity')){						
					tipo=prov.attr('typeof');
					tipo=tipo.split(':')[1];
					hay_rel=princ.attr('property');
					if(hay_rel)
						hay_rel=hay_rel.split(':')[1];
		
					$.each(schemas['types'][tipo]['properties'],function(i,v){
						if(schemas['properties'][v]['ranges'][0]==tipoEntidad){
							propiedades.push(schemas['properties'][v]['id']);
							
						}	
					})	
					break;
				}
				prov=prov.parent();
			}
		});		
	},
	//Actualizar el código al añadir un atributo Rdfa nuevo
	actualizar : function() {
		
		princ.removeClass("automatic");	
		var relProp='';
		if($('#relProp').length){
			relProp=$('#relProp').val();
		}	
		var obj=formuJson('properties');		
		tagsRdfa(obj,princ)
		if(relProp!=''){
			princ.attr('property','schema:'+relProp);
		}
		if(obj.properties.entity_uri){
			princ.attr('resource',obj.properties.entity_uri.value)
			}
		princ.css("background-color","");
		princ.find('.tooltip').remove();
		editor.cambiarNodo();
		editor.windowManager.close(); 
	},
	// Borrar la entidad
	borrar : function() {
		remove_annotation(princ,anoRdfa);
		princ.find('.tooltip').remove();
		editor.cambiarNodo();
		$(editor.getBody()).html($(editor.getBody()).html());
		editor.windowManager.close(); 
	},
};

Entidades.init();
