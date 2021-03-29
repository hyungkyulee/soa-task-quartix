// menu assist javascript
// Functions for processing menu items on a web page
///***** Select Region, Site, Group and Vehicle **********/

var DOMProperties = {
	xmlhttp,
	xmlTimer,
	lang,
	waiting,
	CSD,
	dtFormat
};

// var xmlhttp;
// var xmlTimer;
// var lang;	//V1.06
// var waiting;	//V1.15
// var CSD;	//V1.16
// var dtFormat;

// function returnTrue() {
//     return true;
// }

function GetXmlHttpObject() {
	if (window.XMLHttpRequest) {
  		// code for IE7+, Firefox, Chrome, Opera, Safari
  		return new XMLHttpRequest();
  	}
	if (window.ActiveXObject) {
		// code for IE6, IE5
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	return null;
}

function GetXmlDoc(text) {
	// try {
	// 	//Internet Explorer
	// 	xdoc=new ActiveXObject("Microsoft.XMLDOM");
  // 		xdoc.async="true";
  // 		xdoc.loadXML(text);
  // 		return xdoc;
  // 	}
	// catch(e) {
	// 	parser=new DOMParser();
	// 	xdoc=parser.parseFromString(text,"text/xml");
	// 	return xdoc;
	// }

	/* ----------------
		refactoring
	*/
	if(text == null) return null;

	var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
	if (msie > 0) // If Internet Explorer, return version number
    {
			xdoc = new ActiveXObject("Microsoft.XMLDOM");
			xdoc.async = "true";
			xdoc.loadXML(text);
    }
    else  // If another browser, return 0
    {
			parser = new DOMParser();
			try {
				xdoc = parser.parseFromString(text,"text/xml");
			}
			catch(e) {
				// error message;
				xdoc = null;
			}
    }
		return xdoc;
}

function addOption(e, 
	text, 
	value,
	sel) {
	var optn = document.createElement("OPTION");
	optn.text = text;
	optn.value = value;
	optn.selected = sel;
	e.options.add(optn);
}

/* ----------------
refactoring
*/
function setFieldDate(element, fieldName) {
	if (element) {
		var dt = readDate(fieldName);
		if (dt) {element.value = dt;}
	}
}

function setFieldValue(element, fieldName) {
	if (element) {
		var dt = readValue(fieldName);
		if (dt) {element.value = dt;}
	}
}

function updateLanguage(element) {
	if (element) {
		switch(element.value) {
			case 'English':
				DOMProperties.lang = 0;
				break;

			case 'English':
				DOMProperties.lang = 0;
				break;

			default:
				DOMProperties.lang = 0;
				break; 
		}
	}
}

function buildHttpRequestParams(dvd) {
		var params = "RegionID=" + ((dvd.RegionID) ? dvd.RegionID.value : -2) + 
			"&SiteID=" + ((dvd.SiteID) ? dvd.SiteID.value : -2) + 
			"&GroupID=" + ((dvd.GroupID) ? dvd.GroupID.value : -2) + 
			"&VehicleID=" + ((dvd.VehicleID) ? dvd.VehicleID.value : -2) + 
			"&DriverID=" + ((dvd.DriverID) ? dvd.DriverID.value : -2) + 
			"&Lang=" + ((dvd.language) ? dvd.language.value : 'English') + 
			"&Multi=" + ((dvd.Multi) ? dvd.Multi.value : 0) + 
			"&Grpst=" + ((dvd.grpst) ? dvd.grpst.value : 0);

		return params.replace(new RegExp(" ","g"), "+");	//need to encode parameters as URL
}

function get_selects() {
	xmlhttp = GetXmlHttpObject();
	CSD = false;	//V1.16
	if (xmlhttp==null) {
  		alert ("Please enable Javascript in your browser!"); // browser dowsn't support http request
  		return;
	}
	var dvd = document.VehicleDate;
	if (dvd) {
		if (dvd.dateTimeFormatType) {
			dtFormat = dvd.dateTimeFormatType.value;
		}
		waiting = true;	//V1.15
		//first load saved date, if any
		var dvddt = false;
		var dt;

		// if (dvd.StartDate) {
		// 	dt = readDate('StartDate');
		// 	if (dt) {dvd.StartDate.value = dt;}
		// }
		// if (dvd.BeginDate) {
		// 	dt = readDate('BeginDate');
		// 	if (dt) {dvd.BeginDate.value = dt;}
		// }
		// if (dvd.EndDate) {
		// 	dt = readDate('EndDate');
		// 	if (dt) {dvd.EndDate.value = dt;}
		// }
		/* ----------------
			refactoring
		*/
		setFieldDate(dvd.StartDate, 'StartDate')
		setFieldDate(dvd.BeginDate, 'BeginDate')
		setFieldDate(dvd.BeginDate, 'BeginDate')

		// if (dvd.Address) {
		// 	dt = readValue('Address');
		// 	if (dt) {dvd.Address.value = d
		// }
		// if .AddressOnSite) {
		// 	dreadValue('AddressOnSite');
		// 	if (dt) {dvd.AddressOnSite.value = dt;};
		// }
		// if (dvd.Distance) {
		// 	dt = readValue('Distance');
		// 	if (dt) {dvd.Distance.value = dt;};
		// }
		setFieldValue(dvd.Address, 'Address')
		setFieldValue(dvd.AddressOnSite, 'AddressOnSite')
		setFieldValue(dvd.Distance, 'Distance')

		// var RegionNum = -2; // -2 is code for ignore the field
		// var SiteNum = -2;
		// var GroupNum = -2;
		// var VehNum = -2;
		// var DriverNum = -2;
		// lang = 0;	//English, V1.06
		// var strLang = 'English';
		// var Multi = 0; //multiple vehicle selection allowed
		// var groupstyle = 0;
		// if (dvd.RegionID) {RegionNum = dvd.RegionID.value}
		// if (dvd.GroupID) {GroupNum = dvd.GroupID.value}
		// if (dvd.VehicleID) {VehNum = dvd.VehicleID.value}
		// if (dvd.DriverID) {DriverNum = dvd.DriverID.value}
		// if (dvd.language) {	//V1.06
		// 	strLang = dvd.language.value;
		// 	if (dvd.language.value == 'French') {
		// 		lang = 1;
		// 	};
		// }
		// if (dvd.multi) {Multi = parseInt(dvd.multi.value)}
		// if (dvd.grpst) {groupstyle = parseInt(dvd.grpst.value);}
		// var params = "RegionID=" + RegionNum + "&SiteID=" + SiteNum + "&GroupID=" + GroupNum + "&VehicleID=" + VehNum + "&DriverID=" + DriverNum + "&Lang=" + strLang + "&Multi=" + Multi + "&Grpst=" + groupstyle;
		// params = params.replace(new RegExp(" ","g"), "+");	//need to encode parameters as URL
		/* ----------------
			refactoring
		*/
		updateLanguage(dvd.language)
		var params = buildHttpRequestParams(dvd)

		xmlhttp.onreadystatechange = stateChanged;
		xmlhttp.open("POST","/content/asp/SelectionChange.asp",true);
		xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xmlhttp.send(params);
	}
}

function handleOption(element, tagName) {
	if (element) {
		var sel = element;
		sel.length = 0;
		var x = xmldoc.getElementsByTagName(tagName);
		for (var i = 0;i < x.length;i++) {
			addOption(sel, 
				x[i].childNodes[0].nodeValue, 
				x[i].getAttribute('value'), 
				(x[i].getAttribute('selected')=='selected')
			);
		}
	}
}

function stateChanged() {
	var xmldoc, x, dvd, sel, i;
	if (xmlhttp.readyState==4) {
		clearTimeout(xmlTimer);
		if (xmlhttp.status == 200) {
			waiting = false;	//V1.15
			xmldoc = GetXmlDoc(xmlhttp.responseText);
			x = xmldoc.getElementsByTagName('message');
			if (x.length != 0) {alert(x[0].childNodes[0].nodeValue)};
			x = xmldoc.getElementsByTagName('error');
			if (x.length == 0) {
				/*x = xmldoc.getElementsByTagName('debug')	
				var str;
				for (var di = 0; di < x[0].childNodes.length; ++di)
				{
					str += x[0].childNodes[di].tagName + ": " +  x[0].childNodes[di].textContent + "\n";
				}
				alert(str);*/
				x = xmldoc.getElementsByTagName('csd')	//V1.16
				if (x.length != 0 && x[0].childNodes[0].nodeValue=='True') {CSD = true};
				dvd = document.VehicleDate;

				// if (dvd.RegionID) {
				// 	sel = dvd.RegionID;
				// 	sel.length = 0;	//this deletes all current options
				// 	x = xmldoc.getElementsByTagName('region');
				// 	for (i=0;i<x.length;i++) {
				// 		addOption(sel, x[i].childNodes[0].nodeValue, x[i].getAttribute('value'), (x[i].getAttribute('selected')=='selected'));
				// 	}
				handleOption(dvd.RegionID, 'region')
					/* ----------------
						refactoring
					*/
					// regions = xmldoc.getElementsByTagName('region')
					// regions.map(x => addOption(sel,
					// 	x.childNodes[0].nodeValue,
					// 	x.getAttribute('value'),
					// 	x.getAttribute('selected') == 'selected'))

			}

				// repeat
				// if (dvd.SiteID) {
				// 	sel = dvd.SiteID;
				// 	sel.length = 0;
				// 	x = xmldoc.getElementsByTagName('site');
				// 	for (i=0;i<x.length;i++) {
				// 		addOption(sel, x[i].childNodes[0].nodeValue, x[i].getAttribute('value'), (x[i].getAttribute('selected')=='selected'));
				// 	}
				// }
				// if (dvd.GroupID) {
				// 	sel = dvd.GroupID;
				// 	sel.length = 0;
				// 	x = xmldoc.getElementsByTagName('group');
				// 	for (i=0;i<x.length;i++) {
				// 		addOption(sel, x[i].childNodes[0].nodeValue, x[i].getAttribute('value'), (x[i].getAttribute('selected')=='selected'));
				// 	}
				// }
				// if (dvd.VehicleID) {
				// 	sel = dvd.VehicleID;
				// 	sel.length = 0;
				// 	x = xmldoc.getElementsByTagName('vehicle');
				// 	for (i=0;i<x.length;i++) {
				// 		addOption(sel, x[i].childNodes[0].nodeValue, x[i].getAttribute('value'), (x[i].getAttribute('selected')=='selected'));
				// 	}
				// }
				// if (dvd.DriverID) {
				// 	sel = dvd.DriverID;
				// 	sel.length = 0;
				// 	x = xmldoc.getElementsByTagName('driver');
				// 	for (i=0;i<x.length;i++) {
				// 		addOption(sel, x[i].childNodes[0].nodeValue, x[i].getAttribute('value'), (x[i].getAttribute('selected')=='selected'));
				// 	}
				// }
			handleOption(dvd.SiteID, 'site')
			handleOption(dvd.GroupID, 'group')
			handleOption(dvd.VehicleID, 'vehicle')
			handleOption(dvd.DriverID, 'driver')
		} else {
			//session has been logged out
			var text = new Array("Your session has timed out - please log on again to continue working","Votre session a expiré - Veuillez vous reconnecter");
			alert(text[lang]);
			window.location = '/content/asp/Logout.asp';
		}
	} else {
		var text = new Array("A server error has occurred. Please retry your last action, or contact support","Une erreur de serveur s'est produite. S'il vous plaît réessayer votre dernière action, ou contactez le support");
		alert(text[lang]);
	}
}

///***** Form Validation **********/
///***** Main menus ***************/
function saveValue(fieldname, fieldvalue) {		//changed V1.18
	document.cookie = fieldname + '=' + escape(fieldvalue) + '; path=/';
}

function readValue(fieldname) {
	var nameEQ = fieldname + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length,c.length));
	}
	return false;
}

function readDate(fieldname) {
	var dtr = readValue(fieldname);
	if (dtr) {
		var dtriso = ISOtoDate(dtr);
		if (dtriso) return DatetoString(ISOtoDate(dtr));
	}
	return false;
}

function StringtoDate(strdate) {
	// returns date object if successful, false if not
	var date_arr = strdate.split("/");
	if (date_arr.length == 3) {
		var d, m, y, new_date;
		if (dtFormat == 'US12' || dtFormat == 'US24') {
			d = parseInt(date_arr[1], 10);
			m = parseInt(date_arr[0], 10) - 1;
		} else {
			d = parseInt(date_arr[0], 10);
			m = parseInt(date_arr[1], 10) - 1;
		}
		y = parseInt(date_arr[2], 10);
		if (y < 100) {y = y + 2000};
		// Anything earlier than 1753 is invalid in SQL
		if (y < 1753) return false;
		// Anything more than 4 digits is also invalid
		if (y > 9999) return false;
		new_date = new Date(y, m, d);
		if (new_date.getDate() == d && new_date.getMonth() == m && new_date.getFullYear() == y) {
			return new_date;
		}
	}
	return false;
}

function DatetoString(datepar) {
	// converts a date into a text string in format dd/mm/yyyy
	var ds = "00" + datepar.getDate();
	var ms = "00" + (datepar.getMonth()+1);
	ds = ds.substring(ds.length - 2);
	ms = ms.substring(ms.length - 2);
	if (dtFormat == 'US12' || dtFormat == 'US24') {
		return (ms + "/" + ds + "/" + datepar.getFullYear());
	} else {
		return (ds + "/" + ms + "/" + datepar.getFullYear());
	}
}

function DatetoISO(datepar) {
	// converts a date into ISO format without timezone
	var ds = "00" + datepar.getDate();
	var ms = "00" + (datepar.getMonth()+1);
	ds = ds.substring(ds.length - 2);
	ms = ms.substring(ms.length - 2);
	return (datepar.getFullYear()+'-'+ms+'-'+ds);
}

function ISOtoDate(strdate) {
	// returns date object if successful, false if not
	var arr1 = strdate.split("T");
	if (arr1.length == 2 || arr1.length == 1) {
		var arr2 = arr1[0].split("-")
		if (arr2.length == 3) {
			var d, m, y, new_date;
			d = parseInt(arr2[2], 10);
			m = parseInt(arr2[1], 10) - 1;
			y = parseInt(arr2[0], 10);
			if (y < 100) {y = y + 2000};
			new_date = new Date(y, m, d);
			if (new_date.getDate() == d && new_date.getMonth() == m && new_date.getFullYear() == y) {
				return new_date;
			}
		}
	}
	return false;
}

function fnDate(fieldName, action) {
	//loads a specific date into a field on the form
	var dt = new Date();
	switch(action) {
		case 'Day': dt.setDate(dt.getDate() - 1); break;
		case 'Week': dt.setDate(dt.getDate() - dt.getDay()); break;
		case 'WeekAgo': dt.setDate(dt.getDate() - 7); break;
		case 'Month': dt = new Date(dt.getFullYear(), dt.getMonth(), 0); break;
		//'Day2' needs no action
	}
	if (document.getElementsByName(fieldName).length > 0) {
		var dts = DatetoString(dt);
		document.getElementsByName(fieldName).item(0).value = dts;
		saveValue(fieldName, dts);
	}
}

function fnWeek(fieldName, weekend) {	//added V1.08
	//loads the end of last week into a field on the form
	var dt = new Date();
	var dy = 0;	// assume Sunday if not Friday or Saturday
	switch(weekend) {
		case 'Friday': case 'Vendredi': case 'friday': case 'vendredi': dy = 2; break;
		case 'Saturday': case 'Samedi': case 'saturday': case 'samedi': dy = 2; break;
	}
	dt.setDate(dt.getDate() - dt.getDay() - dy);
	if (document.getElementsByName(fieldName).length > 0) {
		var dts = DatetoString(dt);
		document.getElementsByName(fieldName).item(0).value = dts;
		saveValue(fieldName, dts);
	}
}	 

function valid_date(doc, fieldName, lang) {
	var td = StringtoDate(doc[fieldName].value);
	var dateOK = 1;
	if (td) {
		// date is valid, rewrite four digit year
		var dts = DatetoString(td);
		doc[fieldName].value = dts;
		var diso = DatetoISO(td);
		saveValue(fieldName, diso);	//saved in cookie for later re-use
		if (doc[fieldName+'ISO']) doc[fieldName+'ISO'].value = diso; // saved ISO formatted date
	} else {
		dateOK = 0;
		if (dtFormat == 'US12' || dtFormat == 'US24') {
			var text = new Array("Please enter a valid date (format mm/dd/yyyy)","S'il vous plaît entrer une date valide (format mm/jj/aaaa)");
		} else {
			var text = new Array("Please enter a valid date (format dd/mm/yyyy)","S'il vous plaît entrer une date valide (format jj/mm/aaaa)");
		}
		alert(text[lang]);
 	}
	return dateOK;
}

/*
refactoring
*/
function validateDate(dvd) {
	if(!dvd.StartDate || !dvd.EndDate || !dvd.BeginDate) return false;

	if ( (valid_date(dvd, 'EndDate', lang) == 0) ||
				(valid_date(dvd, 'StartDate', lang) == 0) ||
				(valid_date(dvd, 'BeginDate', lang) == 0) ) return false;
	
	var startdt = StringtoDate(dvd.StartDate.value);
	var begindt = StringtoDate(dvd.BeginDate.value);
	var enddt = StringtoDate(dvd.EndDate.value);

	if (begindt > enddt) {
		var text = new Array("Please ensure the start date selected comes before or is equal to the end date","Veuillez vous assurer que la date de départ choisie vient avant ou est égale à la date de fin")
		alert(text[lang]);
		return false;
	}
	
	if (startdt > enddt) {
		var text = new Array("Please ensure the start date selected comes before or is equal to the end date","Veuillez vous assurer que la date de départ choisie vient avant ou est égale à la date de fin")
		alert(text[lang]);
		return false;
	}

	return true;
}

function ValidateForm() {
	//Date entries must be in acceptable format, and a vehicle or postcode must be selected if required
	var valid=1;
	var veh=-1;
	var vehpres=0;
	var drv=-1;
	var drvpres=0;
	var pc=0;
	var pcpres=0;
	lang=0;	//V1.06
	var multi=0;
	var wait=0;
	var groupstyle=0;
	var email_pres=0;
	var dvd = document.VehicleDate;
	dtFormat = 'GB24';	// default to UK dates

	//Get language to allow selection of text strings
	// if (dvd.language) {
	// 	if (dvd.language.value == "French") {lang = 1};
	// }
	/*
	refactoring
	*/
	updateLanguage(dvd.language)

	//Get date format
	if (dvd.dateTimeFormatType) {
		dtFormat = dvd.dateTimeFormatType.value;
	}
		
	if (waiting==true) {
		var text = new Array("Waiting for server...", "D'attente pour le serveur");
		alert(text[lang]);
		valid=0;
	} else {
		//get flag indicating only one vehicle allowed
		if (dvd.multi) {multi = parseInt(dvd.multi.value);}
		if (CSD == true) {multi = 0};	//V1.16
		//get flag indicating wait message required
		if (dvd.wait) {wait = parseInt(dvd.wait.value);}
		//get flag for contents of GroupRegion
		if (dvd.grpst) {groupstyle = parseInt(dvd.grpst.value);}

		//Check date - field is called StartDate or EndDate
		// if (dvd.EndDate) {
		// 	if (valid_date(dvd, 'EndDate', lang) == 0) {
		// 		valid = 0;
		// 	}
		// }
		// if (dvd.StartDate) {
		// 	if (valid_date(dvd, 'StartDate', lang) == 0) {
		// 		valid = 0;
		// 	}
		// }
		// if (dvd.BeginDate) {
		// 	if (valid_date(dvd, 'BeginDate', lang) == 0) {
		// 		valid = 0;
		// 	}
		// }
		
		// if (dvd.BeginDate && dvd.EndDate) {
		// 	if (valid==1) {
		// 		var begindt = StringtoDate(dvd.BeginDate.value);
		// 		var enddt = StringtoDate(dvd.EndDate.value);
		// 		if (begindt > enddt) {
		// 			valid = 0;
		// 			var text = new Array("Please ensure the start date selected comes before or is equal to the end date","Veuillez vous assurer que la date de départ choisie vient avant ou est égale à la date de fin")
		// 			alert(text[lang]);
		// 		}
		// 	}
		// }
		
		// if (dvd.StartDate && dvd.EndDate) {
		// 	if (valid==1) {
		// 		var begindt = StringtoDate(dvd.StartDate.value);
		// 		var enddt = StringtoDate(dvd.EndDate.value);
		// 		if (begindt > enddt) {
		// 			valid = 0;
		// 			var text = new Array("Please ensure the start date selected comes before or is equal to the end date","Veuillez vous assurer que la date de départ choisie vient avant ou est égale à la date de fin")
		// 			alert(text[lang]);
		// 		}
		// 	}
		// }
		/*
		refactoring
		*/
		valid = validateDate(dvd)
		
		/* temporary fix - some reports currently need a site */
		if (dvd.SiteID && multi < 2) {
			var site=dvd.SiteID.value;
			if (site<=0) {
				valid=0;
				var text = new Array("Please select a site from the list","S'il vous plaît choisir un site dans la liste")
				alert(text[lang]);
			}
		}

		if (dvd.VehicleID) {
			vehpres=1;
			veh=parseInt(dvd.VehicleID.value);
		}

		if (dvd.DriverID) {
			drvpres=1;
			drv=parseInt(dvd.DriverID.value);
		}

		if (drvpres==0) {
			if (vehpres==1 && multi==0 && veh<=1) {
				//veh = 1 is 'All vehicles'
				var text = new Array("Please select a vehicle from the list","S'il vous plaît choisir un véhicule dans la liste");
				alert(text[lang]);
				valid = 0;
			} else if (vehpres==1 && veh<1) {
				// select vehicle
				var text = new Array("Please select a vehicle or 'All Vehicles' and enter a postcode if required","Sélectionnez un véhicule ou 'Tous les véhicules' et entrer un code postal si vous le souhaitez");
				alert(text[lang]);
				valid = 0;
			}
		} else {
			if (vehpres==1 && multi==0 && ((veh>1 && drv>0) || (veh<=1 && drv<=0))) {	//V1.12
				var text = new Array("Please select either a vehicle or a driver","S'il vous plaît sélectionner un véhicule ou un conducteur");
				alert(text[lang]);
				valid = 0;
			} else if (vehpres == 0 && drv < 0 && multi==0) {
				// No  Vehicle, driver not selected
				var text = new Array("Please select a driver from the list","S'il vous plaît choisir un conducteur dans la liste");
				alert(text[lang]);
				valid = 0;
			}
		} 

		/* validate GroupID and populate the GroupRegion field for legacy targets */
		if (dvd.GroupID) {
			var group = dvd.GroupID.value;
			switch(groupstyle) {
			case 1:
			case 2:
				if (group < 0) {
					var text = new Array('Please select a group or "All Groups"',"S'il vous plaît sélectionner un groupe ou 'Tous les groupes'");
					alert(text[lang]);
					valid = 0;
				}
				break;
			case 3:
				if (group <= 0) {
					var text = new Array("Please select a group","S'il vous plaît sélectionner un groupe");
					alert(text[lang]);
					valid = 0;
				}
				break;
			}
			if (dvd.GroupRegion) {
				switch(groupstyle) {
				case 0:
				case 2:
					dvd.GroupRegion.value = group;
					break;
				default:
					if (group==0) {dvd.GroupRegion.value = 'Lcl';}
					else {dvd.GroupRegion.value = 'Grp ' + group;}
					break;
				}
			}
		}

		if (dvd.SpeedLimit) {
			if (dvd.SpeedLimit.length == 0 || isNaN(dvd.SpeedLimit.value) || dvd.SpeedLimit.value < 30) {
				var text = new Array("Please enter a speed > 30mph","S'il vous plaît entrer une vitesse > 30mph");
				alert(text[lang]);
				valid = 0;
			}
		}

		if (dvd.Email) {	//rewritten V1.12
			var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if (dvd.Email.length != 0 && reg.test(dvd.Email.value) == true) {
				email_pres = 1;
			} else {
				if (!dvd.Screen) {
					var text = new Array("Please enter a correct email address","S'il vous plaît entrer une adresse email correcte");
					alert(text[lang]);
					valid = 0;
				} else {
					if (dvd.Screen.checked == false) {
						var text = new Array("Please enter a correct email address or select 'Show on screen'","S'il vous plaît entrer une adresse email correcte ou sélectionnez 'Voir à l'écran'");
						alert(text[lang]);
						valid = 0;
					}
				}
			}
		}

		if (dvd.Address) {	//added V1.18, modified V1.19
			saveValue('Address', dvd.Address.value);
		}
		
		if (dvd.AddressOnSite) {	//added V1.18, modified V1.19
			saveValue('AddressOnSite', dvd.AddressOnSite.value);
		}

		if (dvd.Distance) {	//added V1.18
			if (dvd.Distance.value.length > 0) {
				saveValue('Distance', dvd.Distance.value);
			} else {
				var text = new Array("Location radius cannot be blank","Lieu rayon ne peut pas être vide.");
				alert(text[lang]);
				valid = 0;
			}
		}
		
		if (valid==1 && wait==1) {
			if (email_pres == 1) {
				if (lang == 1) {	//V1.17
					var resp = confirm('Cliquez sur OK - Le système prendra quelques instants pour éditer et envoyer par courriel le rapport demandé.\nVeuillez vérifier votre adresse courriel, et vous recevrez sous peu le rapport.\nCliquez sur Cancel pour abandonner et revenir au menu.')
				} else {
					var resp = confirm('Once you click OK below, the system will take a short while to create and e-mail the report you requested.\nOnce the system returns, check your e-mail and you should receive the message containing the report shortly.\nClick Cancel to abandon the report and return to the menu.')
				}
			} else {
				if (lang == 1) {
					var resp = confirm('Une fois que vous cliquez sur OK ci-dessous, le système va prendre un certain temps pour créer le rapport demandé.\nCliquez sur Cancel pour abandonner le rapport et revenir au menu.')
				} else {
					var resp = confirm('Once you click OK below, the system will take a short while to generate the report you requested.\nClick Cancel to abandon the report and return to the menu.')
				}
			}
			if (resp) {return true;
			} else {return false;
			}
		}
	}

	if (valid==1) {
		return true;
	} else {return false;}

}

/***** Form Validation **********/
/***** Edit screens *************/

function badTime(strTime, language) {
	// returns true if time fails format check
	var validflag = 1;
	var time_arr = strTime.split(':');
	if (time_arr.length != 2) {validflag = 0;}
	else {
		var h = time_arr[0];
		var m = time_arr[1];
		if (h.length==0 || m.length==0 || isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {validflag=0;}
	}
	if (validflag == 0) {
		var text = new Array('Please enter all times in 24 hour format, e.g. 07:00','Veuillez entrée les heures sous le format 19:00');
		alert(text[language]);
		return true;
	} else {
		return false;
	}
}

function badOdo(odom, language) {
	// returns true if odometer reading present but outside range
	if ((isNaN(odom) || odom < 0 || odom > 999999)) {
		var text = new Array('Please enter odometer values between 0 and 999999','Veuillez entrée la valeur du compteur entre 0 et 99999');
		alert(text[language]);
		return true;
	} else {
		return false;
	}
}

function badDate(strdate, language) {
	// returns true if date is badly formatted
	if (strdate == '') {
		return false;
	} else {
		var td = StringtoDate(strdate);
		if (td) {
			return false;
		} else {
			var text = new Array("Please enter dates in the format dd/mm/yyyy","S'il vous plaît entrer une date valide (format dd/mm/yyyy)");
			alert(text[language]);
			return true;
		}
 	}
}

function ValidateUpdate() {
var valid=1;
var lang=0;
var dvd = document.UpdateDetails;
//Get language to allow selection of text strings
if (dvd.language) {
	if (dvd.language.value == "French") {lang = 1};
}

if (dvd.ShiftStartTime && badTime(dvd.ShiftStartTime.value, lang)) {valid=0;};
if (dvd.StartMonitoringWeek && badTime(dvd.StartMonitoringWeek.value, lang)) {valid=0;};
if (dvd.StopMonitoringWeek && badTime(dvd.StopMonitoringWeek.value, lang)) {valid=0;};
if (dvd.StartMonitoringSat && badTime(dvd.StartMonitoringSat.value, lang)) {valid=0;};
if (dvd.StopMonitoringSat && badTime(dvd.StopMonitoringSat.value, lang)) {valid=0;};
if (dvd.StartMonitoringSun && badTime(dvd.StartMonitoringSun.value, lang)) {valid=0;};
if (dvd.StopMonitoringSun && badTime(dvd.StopMonitoringSun.value, lang)) {valid=0;};

if (dvd.NewTripThreshold) {
	if (dvd.NewTripThreshold.length==0 || dvd.NewTripThreshold.value < 0 || dvd.NewTripThreshold.value > 5000) {
		var text = new Array('Please enter a value for New Trip Threshold between 0 and 5000 metres','Veuillez entrée la valeur du Nouveau Seuil de Trajet');
		alert(text[lang]);
		valid=0;
	}
}

if (dvd.EstimatedMPG) {
	var mpg = dvd.EstimatedMPG;
	if (mpg.length == 0 || isNaN(mpg.value) || mpg.value <= 0 || mpg.value >= 1000) {
		var text = new Array('Please enter a value for Estimated MPG between 1 and 999','Veuillez entrée la valeur estimée l/100Km entre 1 et 999');
		alert(text[lang]);
		valid=0;
	}
}

if (dvd.GroupID && valid == 1) {
	if (!dvd.GroupID2 || !dvd.GroupID3) {valid=0;}
	else {
		var id1 = dvd.GroupID.value;
		var id2 = dvd.GroupID2.value;
		var id3 = dvd.GroupID3.value;
		// validation used to check for gaps, removed V1.09
		if ((id1 == id2 && id2 != 0) || (id2 == id3 && id3 != 0) || (id1 == id3 && id3 != 0)) {valid=0;}
	}
	if (valid == 0) {
		var text = new Array('Duplicate group error','Erreur duplication de Groupe');
		alert(text[lang]);
	}
}

if (dvd.ManualOdoReading && badOdo(dvd.ManualOdoReading.value, lang)) {valid=0;};
if (dvd.Milestone2Odo && badOdo(dvd.Milestone2Odo.value, lang)) {valid=0;};
if (dvd.ServiceDueOdometer && badOdo(dvd.ServiceDueOdometer.value, lang)) {valid=0;};
if (dvd.ManualReadingDateTime && badDate(dvd.ManualReadingDateTime.value, lang)) {valid=0;};
if (dvd.InsuranceDueDate && badDate(dvd.InsuranceDueDate.value, lang)) {valid=0;};
if (dvd.TaxDueDate && badDate(dvd.TaxDueDate.value, lang)) {valid=0;};
if (dvd.TestDueDate && badDate(dvd.TestDueDate.value, lang)) {valid=0;};
if (dvd.Milestone1Date && badDate(dvd.Milestone1Date.value, lang)) {valid=0;};
if (dvd.ServiceDueDate && badDate(dvd.ServiceDueDate.value, lang)) {valid=0;};

// warn user if manual odometer reading is less than Quartix estimate
if (valid == 1 && dvd.ManualOdoReading && dvd.QuartixOdoEstimate && dvd.OldManualOdo) {
	if (dvd.OldManualOdo.value != dvd.ManualOdoReading.value && dvd.ManualOdoReading.value < dvd.QuartixOdoEstimate.value) {
		if (lang == 1) {
			var resp = confirm("Relevé compteur manuel est inférieure à l'estimation. Ok pour continuer?");
		} else {
			var resp = confirm("Manual reading is less than estimate. Ok to continue?");
		}
		if (resp) {return true;
		} else {return false;
		}
	}
}	

if (valid==1) {
	return true;
} else {return false;}
}


/*
refactoring
*/
const errorMessages = {
	LocationNameShort: ["The Location Name must be less than 100 characters","Le nom de la localisation doit être moins de 100 charatères"],
	LocationNameEmpty: ["Please enter the location name","Veuillez entrée le nom de la localisation"],
	search: (field) => {
			switch(field) {
				case "GridX":
					return ["Please enter a number for Grid X","S'il vous plaît entrez un numéro de Grid X"];

				case "GridY":
					return ["Please enter a number for Grid Y","S'il vous plaît entrez un numéro de Grid Y"];

				case "MaxRadius":
					return ["Max Radius must be a number between 0 and 100000","Le Rayon Maximum doit etre compris entre 0 et 1000000"];
			}
	}
}

function validateValue(element) {
	if (element) {
		var gx = element.value;
		if (gx == '' || isNaN(gx) ) {		//V1.11
			var text = new Array(errorMessages.search(element.split('.')[1]));
			alert(text[lang]);
			return false;
		}
	}

	return true;
}

//Location Edit javascript
//V1.00 24/03/10 WAH initial entry, derived from V1.04 of LocationEdit
function ValidateLocation() {
	//validates data entry for location edit
	var dvd = document.UpdateDetails;
	var lang = 0;
	var valid = 1;

	//Get language to allow selection of text strings
	if (dvd.language) {
		if (dvd.language.value == "French") {lang = 1};
	}

	if (dvd.LocationName) {
		var ln = dvd.LocationName.value;
		if (ln.length == 0 || ln.length > 100 || ln == '') {
			valid=0;
			var text = new Array(errorMessages.LocationNameShort);
			alert(text[lang]);
		}
		if (ln == 'Enter location name here') {
			valid=0;
			var text = new Array(errorMessages.LocationNameEmpty);
			alert(text[lang]);
		}
	}

	// if (dvd.GridX) {
	// 	var gx = dvd.GridX.value;
	// 	if (gx == '' || isNaN(gx) ) {		//V1.11
	// 		valid=0;
	// 		var text = new Array("Please enter a number for Grid X","S'il vous plaît entrez un numéro de Grid X");
	// 		alert(text[lang]);
	// 	}
	// }

	// if (dvd.GridY) {
	// 	var gy = dvd.GridY.value;
	// 	if (gy == '' || isNaN(gy) ) {		//V1.11
	// 		valid=0;
	// 		var text = new Array("Please enter a number for Grid Y","S'il vous plaît entrez un numéro de Grid Y");
	// 		alert(text[lang]);
	// 	}
	// }

	// if (dvd.MaxRadius) {
	// 	var mr = dvd.MaxRadius.value;
	// 	if (mr == '' || isNaN(mr) || mr < 1 || mr > 100000) {
	// 		valid=0;
	// 		var text = new Array("Max Radius must be a number between 0 and 100000","Le Rayon Maximum doit etre compris entre 0 et 1000000");
	// 		alert(text[lang]);
	// 	}
	// }

	/*
	refactoring
	*/
	valid = validateValue(dvd.GridX);
	valid = validateValue(dvd.GridY);
	valid = validateValue(dvd.MaxRadius);

	if (valid==1) {
		return true;
	} else {return false;}
}

function editDelete() {
	//delete button in Location Edit
	var lang = 0;
	var dud = document.UpdateDetails;
	if (dud.language) {
		if (dud.language.value == "French") {lang = 1};
	}
	if (dud.LocationID.value == 0) {
		alert('Cannot delete location 0');
	} else {
		var text = new Array('OK to delete this location?','Ok pour Effacer cette localisation ?');
		if (confirm(text[lang])) {
			dud.dataedit.value = "delete";
			dud.submit();
		} else {
			dud.dataedit.value = "update"
		}
	}
}