var map
var stopListHtml;
var jtsMarker;
var jtsMarkers = new L.MarkerClusterGroup();
var jtsMarkersList = [];
	
$(document).ready(function () {
	map = L.map('map').setView([51.505, -0.09], 2);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		maxZoom: 18
	}).addTo(map);
	
	var p = L.icon({
        iconUrl: "images/lectures3.png",
        iconSize: [25, 25],
        iconAnchor: [13, 13]
    });
	
	stopListHtml = "<label for='stopList' class='select' style='height:0px;font-size:0px;'></label><select name='stopList' id='stopList' data-mini='true' onchange='changeOpt(value);'><option value='0'>Or choose a city</option>";
	
	$.getJSON("json/jts.geojson", function (d){
			//return d;		
		L.geoJson(d, {
			//style: function (feature) {
			//	return {color: feature.properties.color};
			//},
			pointToLayer: function (feature, latlng){
				jtsMarker = new L.marker(latlng, {icon: p});
				jtsMarkersList.push(jtsMarker);
				jtsMarkers.addLayer(jtsMarker);
				return jtsMarker;
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup("<span class='th' style='color:#666666;width:50px;'>No</span>:" + feature.properties.NO 
				+ "<br/><span class='th' style='color:#666666;'>Date</span>: " + feature.properties.Date 
				+ "<br/><span class='th' style='color:#666666;'>City</span>: " + feature.properties.City
				+ "<br/><span class='th' style='color:#666666;'>Time</span>: " + feature.properties.Time 
				+ "<br/><span class='th' style='color:#666666;'>Place</span>: " + feature.properties.Place 
				+ "<br/><span class='th' style='color:#666666;'>Address</span>: " + feature.properties.Address);
			}
		});
		for(var i=0;i<d.features.length;i++){
			stopListHtml += "<option value='" + d.features[i].properties.NO + "'>" + d.features[i].properties.NO + ". " + d.features[i].properties.City + "</option>";
		}
		stopListHtml += "</select>";
		$("#stopListG").html(stopListHtml);
	});	
	
	map.addLayer(jtsMarkers);	
	
	var jtsLine = $.getJSON("json/jtsLine.geojson", function (d){
			//return d;		
		L.geoJson(d, {}).addTo(map);
	});

	$("#titleImage").animate({
		top:"36px",
		left:"140px",
		margin:"0px",
		height: "-=212px", //282to70
		width: "-=526px"  //700to174
	}, 3000);
	    
	(new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Google,
        position: "bottomleft",
        showMarker: false
    })).addTo(map);

    $("#leaflet-control-geosearch-qry").attr("placeholder", "Type an address");
    $("#leaflet-control-geosearch-qry").hide();
    $("#leaflet-control-geosearch-qry").css("padding", "0px");
	$(".leaflet-bottom.leaflet-left").css("bottom", "");
	$(".leaflet-bottom.leaflet-left").css("top", "78px");	


	$("#stopList").on("change", function(){
		alert("nw");
	});
	
});
	
	function searchOpen(){
		$("#leaflet-control-geosearch-qry").toggle();
		$("#stopListG").toggle();
	}

function changeOpt(v){
	$.getJSON("json/jts.geojson", function (d){
		for(var i=0;i<d.features.length;i++){
			if (v === d.features[i].properties.NO){
				var location = d.features[i].geometry.coordinates;
				var lat = location[0];
				var lng = location[1];
				console.log(location);
				map.setView([lng, lat], 10);
				jtsMarkersList[v-1].openPopup();
			}
		}
	});
}