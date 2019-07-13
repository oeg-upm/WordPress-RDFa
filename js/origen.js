var VPrinc  = (!window.frameElement && window.dialogArguments) || opener || parent || top;
var editor=VPrinc.editorRdfa;
var plugin_url=VPrinc.urlRdfa;
var c=editor.getBody();
$(function () {
	var editorPer = ace.edit("editorPer");
	editorPer.setValue(vkbeautify.xml($(c).html()));
	editorPer.setTheme("ace/theme/chrome");
	editorPer.getSession().setMode("ace/mode/html");
	editorPer.getSession().setUseWrapMode(true);
	editorPer.getSession().on('change', function(e) {
		editor.setContent(editorPer.getValue());
	});
})
